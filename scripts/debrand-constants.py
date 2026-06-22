#!/usr/bin/env python3
"""
Replace ALL brand names with generic names in Constants.kt.
Replace ALL brand colors with NotiFetch amber/orange.
This makes the app 100% trademark-safe for worldwide launch.

Users can still rename platforms in Settings (user choice model).
"""
import re
from pathlib import Path

CONSTANTS = Path("/home/z/my-project/notifetch-android/app/src/main/java/com/notifetch/app/util/Constants.kt")
text = CONSTANTS.read_text()

# Generic name templates by category
CATEGORY_NAMES = {
    "food": "Food Delivery Platform",
    "grocery": "Grocery Delivery Platform",
    "package": "Package Delivery Platform",
    "courier": "Courier Platform",
    "last-mile": "Last-Mile Delivery Platform",
    "ride": "Ride Platform",
    "qsr": "Restaurant Platform",
    "medical": "Pharmacy Platform",
    "alcohol": "Beverage Delivery Platform",
    "flower": "Flower Delivery Platform",
    "laundry": "Laundry Platform",
    "pet-supplies": "Pet Supplies Platform",
    "furniture": "Furniture Delivery Platform",
    "freight": "Freight Platform",
    "bicycle-courier": "Bicycle Courier Platform",
    "document": "Document Delivery Platform",
    "same-day": "Same-Day Delivery Platform",
    "white-glove": "White-Glove Delivery Platform",
    "cannabis": "Delivery Platform",
    "other": "Delivery Platform",
}

# NotiFetch brand colors (no brand-specific colors)
NOTIFETCH_COLORS = ["#FFC107", "#FF9800", "#FF6B35", "#F59E0B", "#FB923C"]

# Track counters for each category
counters = {}

def get_generic_name(category):
    """Get a generic name with a number suffix."""
    base = CATEGORY_NAMES.get(category, "Delivery Platform")
    if base not in counters:
        counters[base] = 0
    counters[base] += 1
    if counters[base] == 1:
        return base
    return f"{base} {counters[base]}"

def get_notifetch_color(index):
    """Get a NotiFetch brand color (cycles through amber/orange shades)."""
    return NOTIFETCH_COLORS[index % len(NOTIFETCH_COLORS)]

# Step 1: Replace all display names in PARTNER_PACKAGES and CUSTOMER_PACKAGES
# Pattern: "package.name" to "Brand Name",
# We keep the package name, replace the display name with generic

# Find all maps and replace display names
lines = text.split("\n")
new_lines = []
color_index = 0
in_platform_source = False

for line in lines:
    # Skip PlatformSource enum entries (those use different format)
    if "enum class PlatformSource" in line:
        in_platform_source = True
    if in_platform_source and line.strip() == "}":
        in_platform_source = False

    if in_platform_source:
        new_lines.append(line)
        continue

    # Replace display names in map entries: "pkg" to "Brand Name",
    # But NOT colors: "pkg" to "#hex",
    if ' to "' in line and '#"' not in line and 'to "#' not in line:
        # This is a display name line, not a color line
        # Pattern: "package.name" to "Brand Name",  // comment
        match = re.match(r'(\s*"[^"]+"\s+to\s+)"([^"]+)"(.*)', line)
        if match:
            prefix = match.group(1)
            old_name = match.group(2)
            suffix = match.group(3)

            # Determine category from comment or context
            category = "other"
            if "Food" in suffix or "food" in suffix or "Food Delivery" in suffix:
                category = "food"
            elif "Grocery" in suffix or "grocery" in suffix:
                category = "grocery"
            elif "Package" in suffix or "package" in suffix or "Parcel" in suffix:
                category = "package"
            elif "Courier" in suffix or "courier" in suffix:
                category = "courier"
            elif "Last-Mile" in suffix or "last-mile" in suffix:
                category = "last-mile"
            elif "Ride" in suffix or "ride" in suffix or "Driver" in suffix:
                category = "ride"
            elif "QSR" in suffix or "Restaurant" in suffix or "Pizza" in suffix or "Burger" in suffix or "Chicken" in suffix:
                category = "qsr"
            elif "Pharmacy" in suffix or "Medical" in suffix or "medical" in suffix:
                category = "medical"
            elif "Alcohol" in suffix or "alcohol" in suffix:
                category = "alcohol"
            elif "Flower" in suffix or "flower" in suffix:
                category = "flower"
            elif "Laundry" in suffix or "laundry" in suffix:
                category = "laundry"
            elif "Pet" in suffix or "pet" in suffix:
                category = "pet-supplies"
            elif "Furniture" in suffix or "furniture" in suffix:
                category = "furniture"
            elif "Freight" in suffix or "freight" in suffix:
                category = "freight"
            elif "Bicycle" in suffix or "bicycle" in suffix:
                category = "bicycle-courier"
            elif "Document" in suffix or "document" in suffix:
                category = "document"
            elif "Same-Day" in suffix or "same-day" in suffix:
                category = "same-day"
            elif "White-Glove" in suffix or "white-glove" in suffix:
                category = "white-glove"
            elif "Cannabis" in suffix or "cannabis" in suffix:
                category = "cannabis"

            generic_name = get_generic_name(category)
            new_line = f'{prefix}"{generic_name}"{suffix}'
            new_lines.append(new_line)
            continue

    # Replace brand colors with NotiFetch colors
    # Pattern: "package.name" to "#hexcolor",
    if 'to "#' in line:
        match = re.match(r'(\s*"[^"]+"\s+to\s+)"(#[^"]+)"(.*)', line)
        if match:
            prefix = match.group(1)
            old_color = match.group(2)
            suffix = match.group(3)
            new_color = get_notifetch_color(color_index)
            color_index += 1
            new_line = f'{prefix}"{new_color}"{suffix}'
            new_lines.append(new_line)
            continue

    new_lines.append(line)

new_text = "\n".join(new_lines)
CONSTANTS.write_text(new_text)
print(f"✅ Replaced all brand names with generic names")
print(f"✅ Replaced all brand colors with NotiFetch amber/orange")
print(f"✅ {len(counters)} categories used:")
for name, count in sorted(counters.items()):
    print(f"   {name}: {count} platforms")
