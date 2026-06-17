#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════════════════
# NotiFetch — Play Store AAB Build Script
# ═══════════════════════════════════════════════════════════════════════════
# Handles:
#   1. JDK 21 setup (uses system JDK if /home/z/my-project/jdk21/ missing)
#   2. Android SDK install (cmdline-tools + platform-tools + build-tools;35.0.0 + platforms;android-35)
#   3. Keystore generation (if no upload/keystore.jks AND no upload-keystore.jks exists)
#   4. Gradle bundleRelease build
#   5. Copy AAB to /home/z/my-project/download/ with versioned filename
#
# Usage:  bash build-playstore.sh
# ═══════════════════════════════════════════════════════════════════════════
set -euo pipefail
cd "$(dirname "$0")"

# ── Configuration ─────────────────────────────────────────────────────────
SCRIPT_DIR="$(pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"           # /home/z/my-project
ANDROID_DIR="$SCRIPT_DIR"                          # /home/z/my-project/notifetch-android
SDK_DIR="/home/z/android-sdk"
DOWNLOAD_DIR="$PROJECT_DIR/download"

# JDK 21 resolution: prefer bundled jdk21/, fall back to system JDK
if [[ -d "$PROJECT_DIR/jdk21" ]]; then
    export JAVA_HOME="$PROJECT_DIR/jdk21"
else
    # Use system JDK 21
    export JAVA_HOME="/usr/lib/jvm/java-21-openjdk-amd64"
fi
export PATH="$JAVA_HOME/bin:$PATH"

echo "═══════════════════════════════════════════════════════════════"
echo "  NotiFetch Play Store AAB Build"
echo "═══════════════════════════════════════════════════════════════"
echo "JAVA_HOME: $JAVA_HOME"
java -version

# ── Step 1: Android SDK setup ─────────────────────────────────────────────
echo ""
echo "── Step 1: Android SDK setup ─────────────────────────────────"
mkdir -p "$SDK_DIR"

if [[ ! -d "$SDK_DIR/cmdline-tools/latest" ]]; then
    echo "  cmdline-tools missing — downloading..."
    mkdir -p "$SDK_DIR/cmdline-tools"
    cd /tmp
    curl -fsSL -o cmdline-tools.zip https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip
    unzip -q -o cmdline-tools.zip -d "$SDK_DIR/cmdline-tools/"
    mv "$SDK_DIR/cmdline-tools/cmdline-tools" "$SDK_DIR/cmdline-tools/latest"
    rm -f cmdline-tools.zip
    cd "$ANDROID_DIR"
fi

export ANDROID_HOME="$SDK_DIR"
export ANDROID_SDK_ROOT="$SDK_DIR"
export PATH="$SDK_DIR/cmdline-tools/latest/bin:$SDK_DIR/platform-tools:$PATH"

# Write local.properties
cat > "$ANDROID_DIR/local.properties" <<EOF
sdk.dir=$SDK_DIR
EOF

SDKMANAGER="$SDK_DIR/cmdline-tools/latest/bin/sdkmanager"

# Accept licenses (auto-yes)
echo "  Accepting SDK licenses..."
yes | "$SDKMANAGER" --licenses > /dev/null 2>&1 || true

# Install required SDK components
echo "  Installing platform-tools, build-tools;35.0.0, platforms;android-35..."
"$SDKMANAGER" --install \
    "platform-tools" \
    "build-tools;35.0.0" \
    "platforms;android-35" \
    > /tmp/sdk-install.log 2>&1 || {
    echo "  SDK install failed — check /tmp/sdk-install.log"
    tail -30 /tmp/sdk-install.log
    exit 1
}
echo "  SDK ready."

# ── Step 2: Keystore setup ────────────────────────────────────────────────
echo ""
echo "── Step 2: Keystore setup ────────────────────────────────────"

UPLOAD_KEYSTORE="$PROJECT_DIR/upload/keystore.jks"
GEN_KEYSTORE="$ANDROID_DIR/upload-keystore.jks"
KEYSTORE_PROPS="$ANDROID_DIR/keystore.properties"

# Option A: Use existing upload keystore (from previous Play Store signing setup)
if [[ -f "$UPLOAD_KEYSTORE" ]] && [[ -n "${NOTIFETCH_STORE_PASSWORD:-}" ]]; then
    echo "  Using existing upload/keystore.jks (with env vars for credentials)"
    SIGNING_MODE="release-upload"

# Option B: Use existing generated keystore + properties file
elif [[ -f "$GEN_KEYSTORE" ]] && [[ -f "$KEYSTORE_PROPS" ]]; then
    echo "  Using existing upload-keystore.jks + keystore.properties"
    SIGNING_MODE="release-generated"

# Option C: Generate a new upload keystore
else
    echo "  No keystore found — generating a NEW upload keystore."
    echo "  IMPORTANT: To upload this AAB to Play Store as an update to an existing listing,"
    echo "  you must reset your upload key in Play Console → App integrity → Request upload key reset."
    echo "  Or use Play App Signing (recommended)."
    echo ""

    KEYSTORE_PASSWORD="$(openssl rand -base64 18 | tr -d '/+=' | head -c 20)"
    KEY_PASSWORD="$(openssl rand -base64 18 | tr -d '/+=' | head -c 20)"
    KEY_ALIAS="notifetch-upload"

    "$JAVA_HOME/bin/keytool" -genkeypair \
        -alias "$KEY_ALIAS" \
        -keyalg RSA \
        -keysize 4096 \
        -validity 10000 \
        -keystore "$GEN_KEYSTORE" \
        -storepass "$KEYSTORE_PASSWORD" \
        -keypass "$KEY_PASSWORD" \
        -dname "CN=NotiFetch, OU=Mobile, O=NotiFetch, L=Bengaluru, ST=Karnataka, C=IN" \
        -storetype JKS

    # Save credentials (gitignored — never committed)
    cat > "$KEYSTORE_PROPS" <<EOF
storeFile=$GEN_KEYSTORE
storePassword=$KEYSTORE_PASSWORD
keyAlias=$KEY_ALIAS
keyPassword=$KEY_PASSWORD
EOF
    chmod 600 "$KEYSTORE_PROPS" "$GEN_KEYSTORE"
    echo "  Generated: $GEN_KEYSTORE"
    echo "  Credentials: $KEYSTORE_PROPS (gitignored, keep safe)"
    SIGNING_MODE="release-generated"
fi

# ── Step 3: Read version from build.gradle.kts ────────────────────────────
echo ""
echo "── Step 3: Reading version ───────────────────────────────────"
VERSION_NAME="$(grep -E '^\s*versionName\s*=' app/build.gradle.kts | head -1 | sed -E 's/.*"([^"]+)".*/\1/')"
VERSION_CODE="$(grep -E '^\s*versionCode\s*=' app/build.gradle.kts | head -1 | sed -E 's/[^0-9]+([0-9]+).*/\1/')"
echo "  versionName: $VERSION_NAME"
echo "  versionCode: $VERSION_CODE"
echo "  signing mode: $SIGNING_MODE"

# ── Step 4: Gradle build ──────────────────────────────────────────────────
echo ""
echo "── Step 4: Gradle bundleRelease ──────────────────────────────"
cd "$ANDROID_DIR"
chmod +x ./gradlew

# Build the AAB. The build.gradle.kts falls back to debug signing if no
# release keystore is available — so this never hard-fails on signing.
./gradlew :app:bundleRelease --no-daemon --no-parallel \
    -Pandroid.useAndroidX=true \
    -Dorg.gradle.jvmargs="-Xmx4g -XX:MaxMetaspaceSize=1g" \
    2>&1 | tee /tmp/notifetch-build.log

# ── Step 5: Locate and copy AAB ────────────────────────────────────────────
echo ""
echo "── Step 5: Locating built AAB ────────────────────────────────"
BUILT_AAB="$ANDROID_DIR/app/build/outputs/bundle/release/app-release.aab"
if [[ ! -f "$BUILT_AAB" ]]; then
    echo "  ERROR: AAB not found at $BUILT_AAB"
    echo "  Build log: /tmp/notifetch-build.log"
    exit 1
fi

mkdir -p "$DOWNLOAD_DIR"
FINAL_NAME="NotiFetch-v${VERSION_NAME}-vc${VERSION_CODE}-release.aab"
FINAL_PATH="$DOWNLOAD_DIR/$FINAL_NAME"
cp "$BUILT_AAB" "$FINAL_PATH"

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "  ✅ BUILD COMPLETE"
echo "═══════════════════════════════════════════════════════════════"
echo "  AAB: $FINAL_PATH"
echo "  Size: $(du -h "$FINAL_PATH" | cut -f1)"
echo "  Signing: $SIGNING_MODE"
echo ""
echo "  Next steps:"
if [[ "$SIGNING_MODE" == "release-generated" ]]; then
    echo "  ⚠  This AAB is signed with a NEW upload key."
    echo "     To upload as an UPDATE to existing Play Store listing:"
    echo "     Play Console → App integrity → Request upload key reset"
    echo "     (one-time process, takes Google 1-3 business days)"
    echo "     OR enable Play App Signing for first-time uploads."
fi
echo "  Upload to: https://play.google.com/console"
echo "═══════════════════════════════════════════════════════════════"
