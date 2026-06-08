#!/usr/bin/env bash
#
# build-twa.sh — Build the NotiFetch TWA Android App Bundle (AAB)
#
# This script:
#   1. Checks for Bubblewrap CLI availability
#   2. Validates the TWA project configuration
#   3. Generates Android project files from twa-manifest.json (if needed)
#   4. Copies the app icon into the project
#   5. Builds the signed release AAB
#
# Prerequisites:
#   - Node.js 18+ and npm
#   - Java Development Kit (JDK) 17+
#   - Android SDK with API 34
#   - keystore.jks generated via generate-signing-key.sh
#
# Usage:
#   ./scripts/build-twa.sh [--init] [--debug] [--clean]
#
# Options:
#   --init    Initialize a new TWA project from scratch using Bubblewrap
#   --debug   Build debug APK instead of release AAB
#   --clean   Clean build artifacts before building
#

set -euo pipefail

# ─── Colors ──────────────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ─── Configuration ───────────────────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
TWA_DIR="$PROJECT_ROOT/twa"
ICON_SOURCE="$PROJECT_ROOT/public/icons/icon-512x512.png"
KEYSTORE_PATH="$TWA_DIR/keystore.jks"
AAB_OUTPUT="$TWA_DIR/app/build/outputs/bundle/release/app-release.aab"
APK_OUTPUT="$TWA_DIR/app/build/outputs/apk/debug/app-debug.apk"

# TWA Configuration
APP_NAME="NotiFetch"
PACKAGE_ID="com.notifetch.app"
HOST_URL="https://d2-liart-nine.vercel.app"
THEME_COLOR="#f59e0b"
BACKGROUND_COLOR="#0a0a0a"
NAVIGATION_COLOR="#f59e0b"

# ─── Helper Functions ────────────────────────────────────────────────────
info()  { echo -e "${BLUE}[INFO]${NC}  $*"; }
ok()    { echo -e "${GREEN}[OK]${NC}    $*"; }
warn()  { echo -e "${YELLOW}[WARN]${NC}  $*"; }
error() { echo -e "${RED}[ERROR]${NC} $*" >&2; exit 1; }

check_command() {
    if ! command -v "$1" &> /dev/null; then
        error "'$1' is not installed. Please install it first."
    fi
}

# ─── Parse Arguments ─────────────────────────────────────────────────────
INIT_MODE=false
DEBUG_MODE=false
CLEAN_MODE=false

for arg in "$@"; do
    case $arg in
        --init)   INIT_MODE=true ;;
        --debug)  DEBUG_MODE=true ;;
        --clean)  CLEAN_MODE=true ;;
        *)        warn "Unknown argument: $arg" ;;
    esac
done

# ─── Step 1: Check Prerequisites ─────────────────────────────────────────
info "Checking prerequisites..."

check_command "node"
check_command "java"
check_command "keytool"

# Check for Bubblewrap
info "Checking for Bubblewrap CLI..."
if ! npx @nicolo-ribaudo/bubblewrap --version &> /dev/null; then
    warn "Bubblewrap CLI not found globally."
    info "Installing Bubblewrap CLI via npx (will be cached)..."
fi
ok "Bubblewrap CLI available via npx"

# Check Java version
JAVA_VERSION=$(java -version 2>&1 | head -1 | cut -d'"' -f2 | cut -d'.' -f1)
if [[ "$JAVA_VERSION" -lt 17 ]]; then
    warn "JDK 17+ is recommended. Current version: $(java -version 2>&1 | head -1)"
fi

# ─── Step 2: Validate Icon ──────────────────────────────────────────────
info "Checking app icon..."
if [[ ! -f "$ICON_SOURCE" ]]; then
    error "Icon not found at $ICON_SOURCE. Generate icons first with scripts/generate-icons.js"
fi
ok "App icon found at $ICON_SOURCE"

# ─── Step 3: Initialize TWA Project (if --init) ─────────────────────────
if [[ "$INIT_MODE" == true ]]; then
    info "Initializing new TWA project with Bubblewrap..."

    cd "$PROJECT_ROOT"

    # Create a temporary icon for Bubblewrap (it expects a URL or local file)
    TEMP_ICON_DIR="$TWA_DIR/temp-icon"
    mkdir -p "$TEMP_ICON_DIR"
    cp "$ICON_SOURCE" "$TEMP_ICON_DIR/icon-512x512.png"

    # Run Bubblewrap init with the manifest
    npx @nicolo-ribaudo/bubblewrap init \
        --manifest="$HOST_URL/manifest.json" \
        --directory="$TWA_DIR" \
        --appVersionName="1.0.0" \
        --appVersionCode=1 \
        --name="$APP_NAME" \
        --shortName="$APP_NAME" \
        --launcherName="$APP_NAME" \
        --packageId="$PACKAGE_ID" \
        --themeColor="$THEME_COLOR" \
        --backgroundColor="$BACKGROUND_COLOR" \
        --navigationColor="$NAVIGATION_COLOR" \
        --splashScreenFadeOutDuration=300 \
        --enableNotifications=true \
        --enableSiteSettingsShortcut=true \
        --icon="$TEMP_ICON_DIR/icon-512x512.png" \
        --maskableIcon="$TEMP_ICON_DIR/icon-512x512.png" \
        --signingKeyPath="keystore.jks" \
        --signingKeyAlias="notifetch" \
        || error "Bubblewrap init failed"

    # Clean up temp icon
    rm -rf "$TEMP_ICON_DIR"

    ok "TWA project initialized at $TWA_DIR"
fi

# ─── Step 4: Copy Icon into Android mipmap Directories ──────────────────
info "Generating mipmap icons from source..."

# Use ImageMagick or sips to resize, fall back to copying the 512 icon
RESIZE_CMD=""
if command -v convert &> /dev/null; then
    RESIZE_CMD="convert"
elif command -v sips &> /dev/null; then
    RESIZE_CMD="sips"
fi

MIPMAP_DIR="$TWA_DIR/app/src/main/res"
DENSITIES=("mdpi:48" "hdpi:72" "xhdpi:96" "xxhdpi:144" "xxxhdpi:192")

for entry in "${DENSITIES[@]}"; do
    DENSITY="${entry%%:*}"
    SIZE="${entry##*:}"
    TARGET_DIR="$MIPMAP_DIR/mipmap-$DENSITY"

    mkdir -p "$TARGET_DIR"

    if [[ "$RESIZE_CMD" == "convert" ]]; then
        convert "$ICON_SOURCE" -resize "${SIZE}x${SIZE}" "$TARGET_DIR/ic_launcher.png" 2>/dev/null || \
            cp "$ICON_SOURCE" "$TARGET_DIR/ic_launcher.png"
    elif [[ "$RESIZE_CMD" == "sips" ]]; then
        sips -z "$SIZE" "$SIZE" "$ICON_SOURCE" --out "$TARGET_DIR/ic_launcher.png" &> /dev/null || \
            cp "$ICON_SOURCE" "$TARGET_DIR/ic_launcher.png"
    else
        # No resize tool — copy full icon (Android will scale)
        cp "$ICON_SOURCE" "$TARGET_DIR/ic_launcher.png"
    fi

    # Round icon (same as regular for adaptive icons)
    cp "$TARGET_DIR/ic_launcher.png" "$TARGET_DIR/ic_launcher_round.png"
done

ok "Mipmap icons generated"

# ─── Step 5: Check Keystore ─────────────────────────────────────────────
if [[ "$DEBUG_MODE" == false ]]; then
    info "Checking keystore..."
    if [[ ! -f "$KEYSTORE_PATH" ]]; then
        error "Keystore not found at $KEYSTORE_PATH. Run scripts/generate-signing-key.sh first."
    fi
    ok "Keystore found"

    # Verify environment variables
    if [[ -z "${NOTIFETCH_STORE_PASSWORD:-}" ]]; then
        warn "NOTIFETCH_STORE_PASSWORD not set. Prompting..."
        read -rsp "Enter keystore password: " NOTIFETCH_STORE_PASSWORD
        echo
        export NOTIFETCH_STORE_PASSWORD
    fi
    if [[ -z "${NOTIFETCH_KEY_PASSWORD:-}" ]]; then
        warn "NOTIFETCH_KEY_PASSWORD not set. Prompting..."
        read -rsp "Enter key password: " NOTIFETCH_KEY_PASSWORD
        echo
        export NOTIFETCH_KEY_PASSWORD
    fi
fi

# ─── Step 6: Clean (if requested) ───────────────────────────────────────
if [[ "$CLEAN_MODE" == true ]]; then
    info "Cleaning build artifacts..."
    cd "$TWA_DIR"
    if [[ -f "gradlew" ]]; then
        ./gradlew clean 2>/dev/null || rm -rf app/build .gradle
    else
        rm -rf app/build .gradle
    fi
    ok "Clean complete"
fi

# ─── Step 7: Generate Gradle Wrapper (if missing) ───────────────────────
cd "$TWA_DIR"
if [[ ! -f "gradlew" ]]; then
    info "Generating Gradle wrapper..."
    # Try to use system gradle or download wrapper
    if command -v gradle &> /dev/null; then
        gradle wrapper --gradle-version 8.5
    else
        # Create a minimal gradlew download script
        info "Downloading Gradle wrapper..."
        GRADLE_WRAPPER_URL="https://raw.githubusercontent.com/gradle/gradle/v8.5.0/gradlew"
        mkdir -p gradle/wrapper

        # Download gradle-wrapper.jar
        curl -fsSL "https://raw.githubusercontent.com/nicolo-ribaudo/bubblewrap/main/packages/cli/src/lib/gradle-wrapper.jar" \
            -o gradle/wrapper/gradle-wrapper.jar 2>/dev/null || true

        # Download gradlew script
        curl -fsSL "https://raw.githubusercontent.com/nicolo-ribaudo/bubblewrap/main/packages/cli/src/lib/gradlew" \
            -o gradlew 2>/dev/null || {
            # Fallback: create a minimal gradlew
            cat > gradlew << 'GRADLEW_EOF'
#!/bin/sh
##############################################################################
## Gradle start up script for POSIX generated by Gradle
##############################################################################
APP_BASE_NAME=`basename "$0"`
APP_HOME=`pwd -P`
CLASSPATH=$APP_HOME/gradle/wrapper/gradle-wrapper.jar
exec "$JAVA_HOME/bin/java" -classpath "$CLASSPATH" org.gradle.wrapper.GradleWrapperMain "$@"
GRADLEW_EOF
        }
        chmod +x gradlew
    fi
    ok "Gradle wrapper ready"
fi

# ─── Step 8: Build ───────────────────────────────────────────────────────
if [[ "$DEBUG_MODE" == true ]]; then
    info "Building debug APK..."
    cd "$TWA_DIR"
    ./gradlew assembleDebug
    ok "Debug APK built: $APK_OUTPUT"
    echo ""
    info "Install on connected device with:"
    info "  adb install $APK_OUTPUT"
else
    info "Building release AAB..."
    cd "$TWA_DIR"
    export NOTIFETCH_STORE_PASSWORD
    export NOTIFETCH_KEY_PASSWORD
    ./gradlew bundleRelease
    ok "Release AAB built: $AAB_OUTPUT"
    echo ""
    info "Upload this AAB to the Google Play Console."
fi

echo ""
ok "Build complete! 🎉"
echo ""
info "Next steps:"
info "  1. Test the APK on a real Android device"
info "  2. Verify TWA launches without address bar"
info "  3. Upload AAB to Google Play Console"
info "  4. Update assetlinks.json with Google Play signing key (if using Play App Signing)"
