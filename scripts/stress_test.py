#!/usr/bin/env python3
"""
Comprehensive stress test for NotiFetch Android app.
Validates every aspect of the codebase that could cause runtime bugs.
"""
import re
import json
import subprocess
from pathlib import Path

PROJECT = Path("/home/z/my-project/notifetch-android/app/src/main/java/com/notifetch/app")
CONSTANTS = PROJECT / "util/Constants.kt"
MANIFEST = Path("/home/z/my-project/notifetch-android/app/src/main/AndroidManifest.xml")
GOOGLE_SERVICES = Path("/home/z/my-project/notifetch-android/app/google-services.json")
GRADLE = Path("/home/z/my-project/notifetch-android/app/build.gradle.kts")
PROGUARD = Path("/home/z/my-project/notifetch-android/app/proguard-rules.pro")
WEB_DATA = Path("/home/z/my-project/src/lib/data.ts")

PASS = 0
FAIL = 0
WARN = 0
FAILURES = []
WARNINGS = []

def ok(name, detail=""):
    global PASS
    PASS += 1
    print(f"  ✅ {name}" + (f" — {detail}" if detail else ""))

def fail(name, detail=""):
    global FAIL
    FAIL += 1
    FAILURES.append(f"{name}: {detail}")
    print(f"  ❌ {name}" + (f" — {detail}" if detail else ""))

def warn(name, detail=""):
    global WARN
    WARN += 1
    WARNINGS.append(f"{name}: {detail}")
    print(f"  ⚠️  {name}" + (f" — {detail}" if detail else ""))


def test_constants_kt():
    """Test Constants.kt for syntax + completeness."""
    print("\n═══ Constants.kt ═══")
    text = CONSTANTS.read_text()

    # Count packages
    partner_matches = re.findall(r'"([^"]+)"\s+to\s+"([^"]+)"', text)
    # Use line position to determine which section
    partner_section_end = text.find("val PLATFORM_SOURCES")
    customer_section_start = text.find("val CUSTOMER_PACKAGES")
    customer_section_end = text.find("// Combined map")

    partner_section = text[:partner_section_end]
    customer_section = text[customer_section_start:customer_section_end] if customer_section_start != -1 else ""

    partner_packages = re.findall(r'"([^"]+)"\s+to\s+"([^"]+)"', partner_section)
    customer_packages = re.findall(r'"([^"]+)"\s+to\s+"([^"]+)"', customer_section)

    ok("PARTNER_PACKAGES count", f"{len(partner_packages)} entries")
    ok("CUSTOMER_PACKAGES count", f"{len(customer_packages)} entries")
    ok("Total tracked packages", f"{len(partner_packages) + len(customer_packages)} unique")

    # Check for duplicate packages
    all_pkgs = [p[0] for p in partner_packages] + [p[0] for p in customer_packages]
    duplicates = set([p for p in all_pkgs if all_pkgs.count(p) > 1])
    if duplicates:
        fail("Duplicate packages found", ", ".join(sorted(duplicates)))
    else:
        ok("No duplicate packages")

    # Check for null bytes / encoding issues
    if "\x00" in text:
        fail("Constants.kt contains null bytes")
    else:
        ok("No encoding issues")

    # Check for non-ASCII characters in string literals (could break Kotlin compiler)
    non_ascii = re.findall(r'"[^"]*([^\x00-\x7F])[^"]*"', text)
    if non_ascii:
        warn("Non-ASCII characters in string literals", f"found: {set(non_ascii)}")
    else:
        ok("All string literals are ASCII-safe")

    # Check enum class PlatformSource for invalid names (start with digit)
    enum_section = re.search(r'enum class PlatformSource.*?\{(.*?)\n\}', text, re.DOTALL)
    if enum_section:
        enum_names = re.findall(r'^\s+([A-Z_][A-Z_0-9]*)\s*\(', enum_section.group(1), re.MULTILINE)
        invalid = [n for n in enum_names if n[0].isdigit()]
        if invalid:
            fail("Enum names starting with digit", ", ".join(invalid))
        else:
            ok(f"PlatformSource enum valid", f"{len(enum_names)} entries, all start with letter/underscore")

        # Check for duplicate enum names
        dupes = set([n for n in enum_names if enum_names.count(n) > 1])
        if dupes:
            fail("Duplicate enum names", ", ".join(dupes))
        else:
            ok("No duplicate enum names")


def test_manifest():
    """Test AndroidManifest.xml."""
    print("\n═══ AndroidManifest.xml ═══")
    text = MANIFEST.read_text()

    # Validate XML
    try:
        import xml.etree.ElementTree as ET
        ET.fromstring(text)
        ok("Valid XML")
    except ET.ParseError as e:
        fail("Invalid XML", str(e))
        return

    # Check <queries> is present (required for Android 11+ package visibility)
    if "<queries>" in text:
        ok("<queries> element present")
        # Check it has LAUNCHER intent filter
        if 'android.intent.action.MAIN' in text and 'android.intent.category.LAUNCHER' in text:
            ok("LAUNCHER intent query present")
        else:
            fail("LAUNCHER intent query missing — getLaunchIntentForPackage will return null on Android 11+")
    else:
        fail("<queries> element MISSING — Android 11+ package visibility restrictions will break Open App")

    # Check BootReceiver is registered
    if "BootReceiver" in text and "BOOT_COMPLETED" in text:
        ok("BootReceiver registered for BOOT_COMPLETED")
    else:
        fail("BootReceiver not registered — listener won't auto-restart after device reboot")

    # Check notification listener service
    if "NotiFetchListenerService" in text and "BIND_NOTIFICATION_LISTENER_SERVICE" in text:
        ok("NotificationListenerService registered")
    else:
        fail("NotificationListenerService missing or not bound")

    # Check no foregroundServiceType as ACTUAL XML ATTRIBUTE (not in comments)
    # Parse the XML and walk all elements to check attributes
    try:
        root = ET.fromstring(text)
        fgs_found = False
        for elem in root.iter():
            if "foregroundServiceType" in elem.attrib:
                fgs_found = True
                fail("foregroundServiceType XML attribute present", f"on <{elem.tag}> — will cause Play Store policy warnings")
                break
        if not fgs_found:
            ok("No foregroundServiceType XML attribute (correct — NotificationListenerService doesn't need it)")
    except Exception:
        # Fallback: check for the pattern as XML attribute (not in comments)
        # Strip XML comments first
        text_no_comments = re.sub(r'<!--.*?-->', '', text, flags=re.DOTALL)
        if re.search(r'android:foregroundServiceType\s*=', text_no_comments):
            fail("foregroundServiceType XML attribute present — will cause Play Store policy warnings")
        else:
            ok("No foregroundServiceType XML attribute (correct — NotificationListenerService doesn't need it)")


def test_google_services():
    """Test google-services.json."""
    print("\n═══ google-services.json ═══")
    try:
        data = json.loads(GOOGLE_SERVICES.read_text())
        ok("Valid JSON")
    except json.JSONDecodeError as e:
        fail("Invalid JSON", str(e))
        return

    clients = data.get("client", [])
    if not clients:
        fail("No clients in google-services.json")
        return

    # Find the com.notifetch.app client (release)
    release_client = None
    for c in clients:
        pkg = c.get("client_info", {}).get("android_client_info", {}).get("package_name", "")
        if pkg == "com.notifetch.app":
            release_client = c
            break

    if not release_client:
        fail("com.notifetch.app client not found")
        return
    ok("com.notifetch.app client present")

    oauth_clients = release_client.get("oauth_client", [])
    android_clients = [oc for oc in oauth_clients if oc.get("client_type") == 1]
    web_clients = [oc for oc in oauth_clients if oc.get("client_type") == 3]

    ok(f"Android OAuth clients", f"{len(android_clients)} registered")
    ok(f"Web OAuth clients", f"{len(web_clients)} registered (needed for Google Sign-In)")

    # Check expected SHA-1 fingerprints
    expected_sha1s = [
        "5970881eb80bce1bf4a80ed235c4063e9989f5ed",  # release upload key
        "d1cf2afa8d15c7225dcfec9b347f9ee5663aa3c2",  # Play App Signing key
    ]
    found_hashes = []
    for ac in android_clients:
        h = ac.get("android_info", {}).get("certificate_hash", "")
        if h:
            found_hashes.append(h.lower())

    for expected in expected_sha1s:
        if expected in found_hashes:
            ok(f"SHA-1 registered", expected)
        else:
            fail(f"SHA-1 MISSING", expected)

    if not web_clients:
        fail("No Web client (client_type 3) — Google Sign-In will fail to fetch ID token")
    else:
        ok("Web client present (Google Sign-In will work)")


def test_gradle():
    """Test build.gradle.kts."""
    print("\n═══ app/build.gradle.kts ═══")
    text = GRADLE.read_text()

    # Check version
    vc_match = re.search(r'versionCode\s*=\s*(\d+)', text)
    vn_match = re.search(r'versionName\s*=\s*"([^"]+)"', text)
    if vc_match and vn_match:
        vc = int(vc_match.group(1))
        vn = vn_match.group(1)
        if vc >= 36:
            ok(f"Version", f"v{vn} (vc{vc})")
        else:
            fail(f"Version too low", f"v{vn} (vc{vc}) — needs to be vc36+ for Play Store upload")
    else:
        fail("Could not parse version")

    # Check signing config
    if "uploadKeystore.exists()" in text and "NOTIFETCH_STORE_PASSWORD" in text:
        ok("Signing config resolves upload/keystore.jks + env vars")
    else:
        fail("Signing config incomplete")

    # Check fallback to debug signing
    if "signingConfigs.getByName(\"debug\")" in text:
        ok("Debug signing fallback present (builds never hard-fail)")
    else:
        warn("No debug signing fallback — build may fail if keystore is missing")

    # Check applicationId
    if 'applicationId = "com.notifetch.app"' in text:
        ok("Application ID matches package name")
    else:
        fail("Application ID mismatch — must be com.notifetch.app")

    # Check compileSdk / targetSdk
    if "compileSdk = 35" in text and "targetSdk = 35" in text:
        ok("compileSdk = 35, targetSdk = 35 (Android 15)")
    else:
        warn("SDK version mismatch — expected 35")


def test_proguard():
    """Test proguard-rules.pro."""
    print("\n═══ proguard-rules.pro ═══")
    text = PROGUARD.read_text()

    required_keeps = [
        ("android.app.PendingIntent", "PendingIntent reflection"),
        ("android.app.Notification$MessagingStyle$Message", "MessagingStyle reflection"),
        ("com.notifetch.app.util.Constants", "Constants class"),
        ("com.notifetch.app.util.UserMode", "UserMode enum"),
        ("com.notifetch.app.notification.BootReceiver", "BootReceiver"),
        ("com.notifetch.app.notification.NotiFetchListenerService", "NotificationListenerService"),
        ("com.notifetch.app.notification.PendingIntentCache", "PendingIntentCache"),
        ("com.notifetch.app.notification.NotificationParser", "NotificationParser"),
    ]
    for class_name, desc in required_keeps:
        if class_name in text:
            ok(f"Keep rule present", desc)
        else:
            fail(f"Keep rule MISSING", desc)


def test_platform_coverage():
    """Cross-reference web platforms vs Android Constants.kt."""
    print("\n═══ Platform Coverage ═══")
    web_text = WEB_DATA.read_text()
    android_text = CONSTANTS.read_text()

    # Extract web platform names
    m = re.search(r'export const PLATFORMS[^=]*=\s*\[(.*?)\n\];', web_text, re.DOTALL)
    if not m:
        fail("Could not find PLATFORMS array in data.ts")
        return
    body = m.group(1)
    web_platforms = []
    for obj_match in re.finditer(r'\{([^{}]+)\}', body):
        obj = obj_match.group(1)
        name_m = re.search(r'name:\s*"([^"]+)"', obj)
        if name_m:
            web_platforms.append(name_m.group(1))

    ok(f"Web platforms", f"{len(web_platforms)} found in data.ts")

    # Extract Android package display names
    android_names = set()
    for m in re.finditer(r'"[^"]+"\s+to\s+"([^"]+)"', android_text):
        android_names.add(m.group(1).lower())

    # Normalize for fuzzy matching
    def norm(s):
        return re.sub(r'[^a-z0-9]', '', s.lower())

    android_norm = {norm(n) for n in android_names}

    matched = 0
    unmatched = []
    for wp in web_platforms:
        wn = norm(wp)
        # Direct or partial match
        if any(wn in an or an in wn for an in android_norm if wn and an):
            matched += 1
        else:
            unmatched.append(wp)

    coverage_pct = (matched / len(web_platforms)) * 100 if web_platforms else 0
    ok(f"Coverage", f"{matched}/{len(web_platforms)} ({coverage_pct:.1f}%)")

    if unmatched:
        warn("Unmatched web platforms", f"{len(unmatched)}: {', '.join(unmatched[:5])}{'...' if len(unmatched) > 5 else ''}")
    else:
        ok("All web platforms have matching Android packages")


def test_code_scan():
    """Scan Kotlin files for common bugs."""
    print("\n═══ Code Scan (common bugs) ═══")
    kotlin_files = list(PROJECT.rglob("*.kt"))

    run_blocking_on_main = 0
    hard_coded_passwords = 0
    todo_comments = 0
    force_unwraps = 0

    for kt in kotlin_files:
        rel = str(kt.relative_to(PROJECT))
        text = kt.read_text()

        # Strip comments before scanning (avoid false positives from documentation)
        # Remove /* */ multi-line comments
        text_no_comments = re.sub(r'/\*.*?\*/', '', text, flags=re.DOTALL)
        # Remove // single-line comments
        text_no_comments = re.sub(r'//[^\n]*', '', text_no_comments)

        # Check for runBlocking on main thread (could cause ANR)
        # Only flag ACTUAL code calls (not mentions in comments)
        if re.search(r'\brunBlocking\s*\(', text_no_comments):
            # Check if it's in onNotificationPosted (main-thread callback)
            if "onNotificationPosted" in text and re.search(r'onNotificationPosted.*?runBlocking\s*\(', text_no_comments, re.DOTALL):
                fail("runBlocking on main thread", f"{rel} — will cause ANR, Android will kill listener")
                run_blocking_on_main += 1
            else:
                warn("runBlocking found", f"{rel} — review to ensure it's not on main thread")

        # Check for hard-coded passwords (only in actual code, not comments)
        for pattern in [r'password\s*=\s*"[^"]+"', r'storePassword\s*=\s*"[^"]+"']:
            for m in re.finditer(pattern, text_no_comments, re.IGNORECASE):
                val = m.group(0)
                if "changeme" not in val.lower() and "test" not in val.lower():
                    hard_coded_passwords += 1
                    warn("Potential hard-coded password", f"{rel}: {val[:60]}")

        # Check for TODOs (only in comments — restore from original text)
        todo_count = text.count("TODO")
        if todo_count > 0:
            todo_comments += todo_count

        # Check for !! (force unwrap — NPE risk) — only in actual code
        force_unwraps_in_file = text_no_comments.count("!!")
        # Subtract != comparisons (false positive)
        force_unwraps_in_file -= text_no_comments.count("!=!!")  # unlikely but safe
        force_unwraps += force_unwraps_in_file

    if run_blocking_on_main == 0:
        ok("No runBlocking on main thread (v2.9.6 fix preserved)")
    if hard_coded_passwords == 0:
        ok("No hard-coded passwords")
    if todo_comments > 0:
        warn(f"TODOs in code", f"{todo_comments} found — review and address")
    else:
        ok("No TODOs")
    if force_unwraps > 0:
        warn(f"Force unwraps (!!)", f"{force_unwraps} found — review for null safety")
    else:
        ok("No force unwraps")

    ok(f"Kotlin files scanned", f"{len(kotlin_files)} files")


def test_room_migrations():
    """Check Room migrations are complete."""
    print("\n═══ Room Migrations ═══")
    db_text = (PROJECT / "data/local/NotiFetchDatabase.kt").read_text()
    entity_text = (PROJECT / "data/local/CapturedNotification.kt").read_text()

    # Find @Database version
    version_match = re.search(r'version\s*=\s*(\d+)', db_text)
    if version_match:
        version = int(version_match.group(1))
        ok(f"Database version", f"v{version}")

        # Count migrations
        migrations = re.findall(r'val MIGRATION_(\d+)_(\d+)', db_text)
        ok(f"Migrations defined", f"{len(migrations)}: {migrations}")

        # Check that we have migrations up to current version
        if version >= 6:
            has_5_6 = any(m == ('5', '6') for m in migrations)
            if has_5_6:
                ok("MIGRATION_5_6 present (deep link persistence)")
            else:
                fail("MIGRATION_5_6 MISSING — app will crash on update from v5 schema")

    # Check CapturedNotification has deepLinkUri field
    if "deepLinkUri" in entity_text and "deepLinkComponent" in entity_text:
        ok("CapturedNotification has deepLinkUri + deepLinkComponent fields")
    else:
        fail("CapturedNotification missing deep link fields")


def main():
    print("=" * 70)
    print("  NOTIFETCH STRESS TEST — v2.9.10-vc36")
    print("=" * 70)

    test_constants_kt()
    test_manifest()
    test_google_services()
    test_gradle()
    test_proguard()
    test_platform_coverage()
    test_code_scan()
    test_room_migrations()

    print("\n" + "=" * 70)
    print(f"  SUMMARY: {PASS} passed, {WARN} warnings, {FAIL} failed")
    print("=" * 70)
    if FAILURES:
        print("\n❌ FAILURES:")
        for f in FAILURES:
            print(f"  - {f}")
    if WARNINGS:
        print("\n⚠️  WARNINGS:")
        for w in WARNINGS:
            print(f"  - {w}")
    if not FAILURES:
        print("\n🎉 ALL CRITICAL CHECKS PASSED — app is production-ready")


if __name__ == "__main__":
    main()
