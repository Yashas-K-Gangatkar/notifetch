#!/usr/bin/env python3
import re
from pathlib import Path

DATA_TS = Path("/home/z/my-project/src/lib/data.ts")
text = DATA_TS.read_text()
counters = {}
CATEGORY_NAMES = {
    "food": "Food Delivery Platform", "grocery": "Grocery Delivery Platform",
    "package": "Package Delivery Platform", "courier": "Courier Platform",
    "last-mile": "Last-Mile Delivery Platform", "ride": "Ride Platform",
    "qsr": "Restaurant Platform", "medical": "Pharmacy Platform",
    "alcohol": "Beverage Platform", "flower": "Flower Platform",
    "laundry": "Laundry Platform", "pet-supplies": "Pet Supplies Platform",
    "furniture": "Furniture Platform", "freight": "Freight Platform",
    "bicycle-courier": "Bicycle Courier Platform", "document": "Document Platform",
    "same-day": "Same-Day Platform", "white-glove": "White-Glove Platform",
    "cannabis": "Delivery Platform", "other": "Delivery Platform",
}
def get_generic_name(category):
    base = CATEGORY_NAMES.get(category, "Delivery Platform")
    if base not in counters: counters[base] = 0
    counters[base] += 1
    return base if counters[base] == 1 else f"{base} {counters[base]}"

def replace_name(match):
    full_match = match.group(0)
    category_match = re.search(r'category:\s*"([^"]+)"', full_match)
    if category_match:
        generic = get_generic_name(category_match.group(1))
        return re.sub(r'name:\s*"[^"]+"', f'name: "{generic}"', full_match)
    return full_match

new_text = re.sub(r'\{[^}]+name:\s*"[^"]+"[^}]+\}', replace_name, text)
DATA_TS.write_text(new_text)
print(f"✅ Replaced all brand names in data.ts")
for name, count in sorted(counters.items()):
    print(f"   {name}: {count}")
