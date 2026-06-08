#!/usr/bin/env bash
#
# generate-signing-key.sh — Generate a signing keystore for the NotiFetch TWA
#
# This script:
#   1. Generates an RSA 2048-bit keystore for signing the Android AAB
#   2. Saves the keystore to twa/keystore.jks
#   3. Outputs the SHA-256 fingerprint for assetlinks.json
#   4. Optionally updates public/.well-known/assetlinks.json with the fingerprint
#
# Prerequisites:
#   - keytool (part of JDK)
#
# Usage:
#   ./scripts/generate-signing-key.sh [--auto] [--update-assetlinks]
#
# Options:
#   --auto                Use default values (no interactive prompts)
#   --update-assetlinks   Automatically update assetlinks.json with the fingerprint
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
KEYSTORE_PATH="$TWA_DIR/keystore.jks"
KEY_ALIAS="notifetch"
VALIDITY_DAYS=9125  # 25 years
KEY_ALG="RSA"
KEY_SIZE=2048
ASSETLINKS_PATH="$PROJECT_ROOT/public/.well-known/assetlinks.json"

# Default keystore info (used with --auto)
DEFAULT_STORE_PASS="changeme_notifetch_store_2024"
DEFAULT_KEY_PASS="changeme_notifetch_key_2024"
DEFAULT_CN="NotiFetch"
DEFAULT_OU="Engineering"
DEFAULT_O="NotiFetch"
DEFAULT_L="Mumbai"
DEFAULT_ST="Maharashtra"
DEFAULT_C="IN"

# ─── Helper Functions ────────────────────────────────────────────────────
info()  { echo -e "${BLUE}[INFO]${NC}  $*"; }
ok()    { echo -e "${GREEN}[OK]${NC}    $*"; }
warn()  { echo -e "${YELLOW}[WARN]${NC}  $*"; }
error() { echo -e "${RED}[ERROR]${NC} $*" >&2; exit 1; }

# ─── Parse Arguments ─────────────────────────────────────────────────────
AUTO_MODE=false
UPDATE_ASSETLINKS=false

for arg in "$@"; do
    case $arg in
        --auto)              AUTO_MODE=true ;;
        --update-assetlinks) UPDATE_ASSETLINKS=true ;;
        *)                   warn "Unknown argument: $arg" ;;
    esac
done

# ─── Step 1: Check Prerequisites ─────────────────────────────────────────
info "Checking prerequisites..."

if ! command -v keytool &> /dev/null; then
    error "keytool is not installed. Please install JDK 17+ first."
fi

ok "keytool found"

# ─── Step 2: Check if Keystore Already Exists ────────────────────────────
if [[ -f "$KEYSTORE_PATH" ]]; then
    warn "Keystore already exists at $KEYSTORE_PATH"
    echo ""
    if [[ "$AUTO_MODE" == false ]]; then
        read -rp "Overwrite existing keystore? This cannot be undone! (yes/no): " CONFIRM
        if [[ "$CONFIRM" != "yes" ]]; then
            info "Aborting. Existing keystore preserved."
            info "To view the existing fingerprint, run:"
            info "  keytool -list -v -keystore $KEYSTORE_PATH -alias $KEY_ALIAS"
            exit 0
        fi
    else
        warn "Auto mode: backing up existing keystore and regenerating..."
        mv "$KEYSTORE_PATH" "${KEYSTORE_PATH}.backup.$(date +%Y%m%d%H%M%S)"
    fi
fi

# ─── Step 3: Gather Information ──────────────────────────────────────────
info "Setting up keystore parameters..."

if [[ "$AUTO_MODE" == true ]]; then
    STORE_PASS="$DEFAULT_STORE_PASS"
    KEY_PASS="$DEFAULT_KEY_PASS"
    DNAME="CN=$DEFAULT_CN, OU=$DEFAULT_OU, O=$DEFAULT_O, L=$DEFAULT_L, ST=$DEFAULT_ST, C=$DEFAULT_C"
    warn "Using default passwords. CHANGE THESE FOR PRODUCTION!"
else
    echo ""
    echo -e "${YELLOW}═══════════════════════════════════════════════════════${NC}"
    echo -e "${YELLOW}  NotiFetch Signing Key Generation${NC}"
    echo -e "${YELLOW}═══════════════════════════════════════════════════════${NC}"
    echo ""

    # Get passwords
    while true; do
        read -rsp "Enter keystore password (min 6 chars): " STORE_PASS
        echo
        if [[ ${#STORE_PASS} -ge 6 ]]; then break; fi
        warn "Password must be at least 6 characters"
    done

    while true; do
        read -rsp "Confirm keystore password: " STORE_PASS_CONFIRM
        echo
        if [[ "$STORE_PASS" == "$STORE_PASS_CONFIRM" ]]; then break; fi
        warn "Passwords do not match. Try again."
    done

    read -rsp "Enter key password (min 6 chars, or press Enter to use keystore password): " KEY_PASS
    echo
    if [[ -z "$KEY_PASS" ]]; then
        KEY_PASS="$STORE_PASS"
    fi

    # Get organization info
    echo ""
    info "Enter signing certificate details (press Enter for defaults):"
    read -rp "  Your name or organization [NotiFetch]: " CN
    CN="${CN:-NotiFetch}"
    read -rp "  Organizational Unit [Engineering]: " OU
    OU="${OU:-Engineering}"
    read -rp "  Organization [NotiFetch]: " O
    O="${O:-NotiFetch}"
    read -rp "  City [Mumbai]: " L
    L="${L:-Mumbai}"
    read -rp "  State [Maharashtra]: " ST
    ST="${ST:-Maharashtra}"
    read -rp "  Country Code (2 letters) [IN]: " C
    C="${C:-IN}"

    DNAME="CN=$CN, OU=$OU, O=$O, L=$L, ST=$ST, C=$C"
fi

# ─── Step 4: Generate the Keystore ───────────────────────────────────────
info "Generating RSA $KEY_SIZE-bit signing key..."
info "Keystore path: $KEYSTORE_PATH"
info "Key alias: $KEY_ALIAS"
info "Validity: $VALIDITY_DAYS days (25 years)"

mkdir -p "$TWA_DIR"

keytool -genkeypair \
    -v \
    -keystore "$KEYSTORE_PATH" \
    -alias "$KEY_ALIAS" \
    -keyalg "$KEY_ALG" \
    -keysize "$KEY_SIZE" \
    -validity "$VALIDITY_DAYS" \
    -storepass "$STORE_PASS" \
    -keypass "$KEY_PASS" \
    -dname "$DNAME"

ok "Keystore generated successfully!"

# ─── Step 5: Extract SHA-256 Fingerprint ─────────────────────────────────
info "Extracting SHA-256 fingerprint..."

FINGERPRINT_OUTPUT=$(keytool -list \
    -v \
    -keystore "$KEYSTORE_PATH" \
    -alias "$KEY_ALIAS" \
    -storepass "$STORE_PASS" \
    2>/dev/null)

SHA256_FINGERPRINT=$(echo "$FINGERPRINT_OUTPUT" | rg "SHA256:" | head -1 | sed 's/.*SHA256: //' | xargs)

if [[ -z "$SHA256_FINGERPRINT" ]]; then
    # Fallback: try alternative parsing
    SHA256_FINGERPRINT=$(echo "$FINGERPRINT_OUTPUT" | rg "SHA256:" | head -1 | awk '{for(i=1;i<=NF;i++) if($i ~ /^[A-F0-9]{2}:/) {printf "%s",$i; if(i<NF) printf ":"}}' | sed 's/:$//')
fi

echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  SHA-256 FINGERPRINT${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}  $SHA256_FINGERPRINT${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════${NC}"
echo ""

# ─── Step 6: Update assetlinks.json (if requested) ───────────────────────
if [[ "$UPDATE_ASSETLINKS" == true ]]; then
    info "Updating assetlinks.json with the new fingerprint..."

    cat > "$ASSETLINKS_PATH" << EOF
[{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "com.notifetch.app",
    "sha256_cert_fingerprints": [
      "$SHA256_FINGERPRINT"
    ]
  }
}]
EOF

    ok "assetlinks.json updated at $ASSETLINKS_PATH"
    warn "You MUST deploy this file to https://d2-liart-nine.vercel.app/.well-known/assetlinks.json"
else
    info "To update assetlinks.json, run this script with --update-assetlinks"
    info "Or manually update $ASSETLINKS_PATH with the fingerprint above"
fi

# ─── Step 7: Save Passwords Reference ───────────────────────────────────
CREDENTIALS_FILE="$TWA_DIR/signing-credentials.txt"
cat > "$CREDENTIALS_FILE" << EOF
# NotiFetch TWA Signing Credentials
# ⚠️  IMPORTANT: Add this file to .gitignore! Never commit to version control!
# ⚠️  Store these credentials in a secure password manager.

KEYSTORE_PATH=$KEYSTORE_PATH
KEY_ALIAS=$KEY_ALIAS
STORE_PASSWORD=<STORE_IN_PASSWORD_MANAGER>
KEY_PASSWORD=<STORE_IN_PASSWORD_MANAGER>
SHA256_FINGERPRINT=$SHA256_FINGERPRINT

# Generated on: $(date -u +"%Y-%m-%d %H:%M:%S UTC")
EOF

warn "Credentials reference saved to $CREDENTIALS_FILE"
warn "IMPORTANT: Add signing-credentials.txt to .gitignore!"
warn "IMPORTANT: Store the actual passwords in a secure password manager!"

# ─── Step 8: Summary ─────────────────────────────────────────────────────
echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  ✅ Signing Key Generation Complete                         ║${NC}"
echo -e "${GREEN}╠══════════════════════════════════════════════════════════════╣${NC}"
echo -e "${GREEN}║  Keystore: $KEYSTORE_PATH"
echo -e "${GREEN}║  Alias:     $KEY_ALIAS"
echo -e "${GREEN}║  SHA-256:   $SHA256_FINGERPRINT"
echo -e "${GREEN}╠══════════════════════════════════════════════════════════════╣${NC}"
echo -e "${GREEN}║  NEXT STEPS:                                                ║${NC}"
echo -e "${GREEN}║  1. Back up keystore.jks to a secure location              ║${NC}"
echo -e "${GREEN}║  2. Store passwords in a password manager                  ║${NC}"
echo -e "${GREEN}║  3. Update assetlinks.json with the SHA-256 fingerprint    ║${NC}"
echo -e "${GREEN}║  4. Deploy assetlinks.json to your website                 ║${NC}"
echo -e "${GREEN}║  5. Run: ./scripts/build-twa.sh                            ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════════════╝${NC}"

# Environment variables for build script
echo ""
info "To build the release AAB, set these environment variables:"
echo "  export NOTIFETCH_STORE_PASSWORD=\"<your_store_password>\""
echo "  export NOTIFETCH_KEY_PASSWORD=\"<your_key_password>\""
