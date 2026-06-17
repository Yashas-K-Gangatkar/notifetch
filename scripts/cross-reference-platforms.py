#!/usr/bin/env python3
"""
Cross-reference web platforms (data.ts) against Android Constants.kt
to find any gaps in Android notification listener coverage.
"""
import re
import sys
from pathlib import Path

WEB_DATA = Path("/home/z/my-project/src/lib/data.ts")
ANDROID_CONSTANTS = Path("/home/z/my-project/notifetch-android/app/src/main/java/com/notifetch/app/util/Constants.kt")


def parse_web_platforms():
    """Extract all platform {id, name, category, regions} entries from data.ts."""
    text = WEB_DATA.read_text()
    # Find the PLATFORMS array
    m = re.search(r"export const PLATFORMS[^=]*=\s*\[(.*?)\n\];", text, re.DOTALL)
    if not m:
        sys.exit("ERROR: Could not find PLATFORMS array in data.ts")
    body = m.group(1)
    # Each platform object starts with `{` and ends with `}`. Split by object boundaries.
    platforms = []
    # Match each object
    for obj_match in re.finditer(r"\{([^{}]+)\}", body):
        obj = obj_match.group(1)
        # Extract id, name, category, regions
        id_m = re.search(r'id:\s*"([^"]+)"', obj)
        name_m = re.search(r'name:\s*"([^"]+)"', obj)
        cat_m = re.search(r'category:\s*"([^"]+)"', obj)
        regions_m = re.search(r'regions:\s*\[([^\]]+)\]', obj)
        if id_m and name_m:
            regions = []
            if regions_m:
                regions = re.findall(r'"([^"]+)"', regions_m.group(1))
            platforms.append({
                "id": id_m.group(1),
                "name": name_m.group(1),
                "category": cat_m.group(1) if cat_m else "",
                "regions": regions,
            })
    return platforms


def parse_android_packages():
    """Extract PARTNER_PACKAGES and CUSTOMER_PACKAGES from Constants.kt."""
    text = ANDROID_CONSTANTS.read_text()
    packages = {}  # display_name -> package_name

    for label in ["PARTNER_PACKAGES", "CUSTOMER_PACKAGES"]:
        m = re.search(rf"val {label}\s*=\s*mapOf\((.*?)\n    \)", text, re.DOTALL)
        if not m:
            print(f"WARNING: {label} not found in Constants.kt")
            continue
        body = m.group(1)
        # Match "package.name" to "Display Name",
        for line in body.split("\n"):
            line = line.strip()
            mm = re.match(r'"([^"]+)"\s+to\s+"([^"]+)"', line)
            if mm:
                pkg = mm.group(1)
                display = mm.group(2)
                packages[display] = pkg
    return packages


def normalize(name):
    """Normalize a platform name for fuzzy matching."""
    return re.sub(r"[^a-z0-9]", "", name.lower())


def main():
    web_platforms = parse_web_platforms()
    android_packages = parse_android_packages()

    print(f"Web platforms: {len(web_platforms)}")
    print(f"Android package display names: {len(android_packages)}")
    print()

    # Build normalized Android display name index
    android_norm = {normalize(name): (name, pkg) for name, pkg in android_packages.items()}

    # For each web platform, try to find a match in Android
    matched = []
    unmatched = []

    for wp in web_platforms:
        wp_name = wp["name"]
        wp_norm = normalize(wp_name)

        # Direct match
        if wp_norm in android_norm:
            android_name, pkg = android_norm[wp_norm]
            matched.append((wp, android_name, pkg, "exact"))
            continue

        # Partial match (one contains the other)
        partial_matches = []
        for anorm, (aname, apkg) in android_norm.items():
            # Check if web name is substring of android name or vice versa
            if wp_norm and (wp_norm in anorm or anorm in wp_norm):
                partial_matches.append((aname, apkg))

        if len(partial_matches) == 1:
            aname, apkg = partial_matches[0]
            matched.append((wp, aname, apkg, "partial"))
        elif len(partial_matches) > 1:
            # Pick the shortest android name (closest match)
            best = min(partial_matches, key=lambda x: len(x[0]))
            matched.append((wp, best[0], best[1], "partial-multi"))
        else:
            unmatched.append(wp)

    # Report
    print("═══════════════════════════════════════════════════════════════")
    print(f"  MATCHED: {len(matched)} / {len(web_platforms)}")
    print("═══════════════════════════════════════════════════════════════")
    print()
    if unmatched:
        print("❌ UNMATCHED WEB PLATFORMS (Android notification listener will NOT capture these):")
        print()
        for wp in unmatched:
            print(f"  - {wp['name']:30} (id: {wp['id']:25}, category: {wp['category']:15}, regions: {wp['regions']})")
        print()
        print(f"Total unmatched: {len(unmatched)}")
    else:
        print("✅ All web platforms have a matching Android package.")

    print()
    print("═══════════════════════════════════════════════════════════════")
    print("  PARTIAL MATCHES (may need verification)")
    print("═══════════════════════════════════════════════════════════════")
    partial_count = 0
    for wp, aname, apkg, mtype in matched:
        if mtype.startswith("partial"):
            partial_count += 1
            print(f"  - Web: {wp['name']:30} → Android: {aname:30} (pkg: {apkg})")
    if partial_count == 0:
        print("  (none — all matches are exact)")
    print()
    print(f"Exact matches: {sum(1 for _, _, _, m in matched if m == 'exact')}")
    print(f"Partial matches: {partial_count}")
    print(f"Unmatched: {len(unmatched)}")

    # Also list Android packages not in web data
    web_names_norm = {normalize(wp["name"]) for wp in web_platforms}
    android_only = []
    for aname, apkg in android_packages.items():
        anorm = normalize(aname)
        # Skip if any web platform name matches
        if anorm in web_names_norm:
            continue
        # Skip partial
        if any(anorm in wn or wn in anorm for wn in web_names_norm if wn):
            continue
        android_only.append((aname, apkg))

    print()
    print("═══════════════════════════════════════════════════════════════")
    print(f"  ANDROID-ONLY PACKAGES ({len(android_only)}) — in Android but not in web data")
    print("═══════════════════════════════════════════════════════════════")
    for aname, apkg in android_only[:50]:  # cap output
        print(f"  - {aname:30} (pkg: {apkg})")
    if len(android_only) > 50:
        print(f"  ... and {len(android_only) - 50} more")


if __name__ == "__main__":
    main()
