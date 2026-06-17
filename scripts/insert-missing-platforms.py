#!/usr/bin/env python3
"""
Insert the 73 missing platform entries into Constants.kt at the correct locations.
- Partner apps (Convoy, BlackBuck) → end of PARTNER_PACKAGES map
- Customer apps (all others) → end of CUSTOMER_PACKAGES map
- All colors → end of respective color maps
- All PlatformSource enums → end of enum class

Modifies Constants.kt in-place. Idempotent: skips platforms already present.
"""
import re
from pathlib import Path

CONSTANTS_PATH = Path("/home/z/my-project/notifetch-android/app/src/main/java/com/notifetch/app/util/Constants.kt")
text = CONSTANTS_PATH.read_text()

# Same data as generate-missing-platforms.py
MISSING_PLATFORMS = [
    ("meituan", "Meituan", "food", "com.sankuai.meituan", "Meituan", "#FFD100", True, "China"),
    ("ele-me", "Ele.me", "food", "me.ele", "Ele.me", "#0097FF", True, "China"),
    ("gorillas", "Gorillas", "grocery", "com.gorillasapp", "Gorillas", "#FFD100", True, "EU/UK (acquired by Getir)"),
    ("getir", "Getir", "grocery", "com.getir", "Getir", "#5D00B7", True, "EU/UK/MENA"),
    ("fedex", "FedEx Delivery", "package", "com.fedex.android.apps.fedexmobile", "FedEx", "#4D148C", True, "Global"),
    ("dhl", "DHL Express", "package", "com.dhl.parcel.uk", "DHL", "#FFCC00", True, "Global"),
    ("sf-express", "SF Express", "last-mile", "com.sf.activity", "SF Express", "#DC0019", True, "China"),
    ("capsule", "Capsule", "medical", "com.capsule.pharmacy", "Capsule", "#000000", True, "US"),
    ("nowrx", "NowRx", "medical", "com.nowrx.android", "NowRx", "#00A3E0", True, "US"),
    ("pharmeasy", "PharmEasy", "medical", "com.indpro.pharmeasy", "PharmEasy", "#3BB871", True, "India"),
    ("netmeds", "Netmeds", "medical", "com.netmeds.android", "Netmeds", "#E61E2A", True, "India"),
    ("1mg", "1mg", "medical", "com.aranoah.healthkart.plus", "1mg", "#FF6F00", True, "India"),
    ("drizly", "Drizly", "alcohol", "com.drizly.drizly", "Drizly", "#FF4A1C", True, "US (acquired by Uber)"),
    ("minibar", "Minibar", "alcohol", "com.minibar.android", "Minibar", "#1A1A1A", True, "US"),
    ("saucey", "Saucey", "alcohol", "com.saucey.android", "Saucey", "#FF6B35", True, "US"),
    ("hipbar", "HipBar", "alcohol", "com.hipbar.android", "HipBar", "#FF1744", True, "India"),
    ("bloomnation", "BloomNation", "flower", "com.bloomnation.bloomnation", "BloomNation", "#E8336A", True, "US"),
    ("1800-flowers", "1-800-Flowers", "flower", "com.ftd.app.bloom", "1-800-Flowers", "#000000", True, "US"),
    ("interflora", "Interflora", "flower", "com.interflora.android", "Interflora", "#E6007E", True, "Europe/Oceania"),
    ("ferns-petals", "Ferns N Petals", "flower", "com.fnp.android", "Ferns N Petals", "#E6007E", True, "India"),
    ("rinse", "Rinse", "laundry", "com.rinse.app", "Rinse", "#00B8A9", True, "US"),
    ("flycleaners", "FlyCleaners", "laundry", "com.flycleaners.android", "FlyCleaners", "#1E88E5", True, "US"),
    ("laundrokart", "LaundroKart", "laundry", "com.laundrokart.app", "LaundroKart", "#00BCD4", True, "India"),
    ("presso", "Presso", "laundry", "com.presso.app", "Presso", "#212121", True, "SEA/MENA"),
    ("chewy", "Chewy", "pet-supplies", "com.chewy.android", "Chewy", "#1B6EC2", True, "US"),
    ("pets-at-home", "Pets at Home", "pet-supplies", "com.petsathome.android", "Pets at Home", "#00A651", True, "UK"),
    ("heads-up-for-tails", "Heads Up For Tails", "pet-supplies", "com.hutf.android", "Heads Up For Tails", "#FF6F00", True, "India"),
    ("wayfair-delivery", "Wayfair Delivery", "furniture", "com.wayfair.wayfair", "Wayfair", "#7B1899", True, "US/Europe"),
    ("castlery", "Castlery", "furniture", "com.castlery.app", "Castlery", "#1A1A1A", True, "SEA/Oceania"),
    ("urban-ladder", "Urban Ladder", "furniture", "com.urbanladder.app", "Urban Ladder", "#FF6F00", True, "India"),
    ("courier-please", "Courier Please", "bicycle-courier", "com.couriersplease.app", "Courier Please", "#FF6B00", True, "Australia"),
    ("dex", "Dex", "document", "com.dex.android", "Dex", "#1E88E5", True, "US"),
    ("couriire", "Couriire", "document", "com.couriire.app", "Couriire", "#212121", True, "India"),
    ("cainiao", "Cainiao", "same-day", "com.cainiao.wireless.dumps", "Cainiao", "#FF6A00", True, "China"),
    ("xpo", "XPO Logistics", "white-glove", "com.xpo.logistics", "XPO Logistics", "#E61E2A", True, "US/Europe"),
    ("jd-logistics", "JD Logistics", "white-glove", "com.jingdong.app.mall", "JD Logistics", "#E1251B", True, "China"),
    ("eaze", "Eaze", "cannabis", "com.eaze.android", "Eaze", "#00C853", True, "US"),
    ("dutchie", "Dutchie", "cannabis", "com.dutchie.android", "Dutchie", "#00C853", True, "US"),
    ("convoy", "Convoy", "freight", "com.convoy.driverapp", "Convoy Driver", "#1A1A1A", False, "US"),
    ("blackbuck", "BlackBuck", "freight", "com.blackbuck.driver", "BlackBuck Driver", "#FFC107", False, "India"),
    ("dominos-india", "Domino's India", "qsr", "com.dominos", "Domino's India", "#006491", True, "India"),
    ("dominos-us", "Domino's (US)", "qsr", "com.dominos.android", "Domino's US", "#006491", True, "US"),
    ("pizza-hut-india", "Pizza Hut India", "qsr", "com.pizzahut.android", "Pizza Hut India", "#EE3124", True, "India"),
    ("pizza-hut", "Pizza Hut", "qsr", "com.pizzahut.android.global", "Pizza Hut", "#EE3124", True, "Global"),
    ("papa-johns", "Papa John's", "qsr", "com.papajohns.android", "Papa John's", "#008515", True, "US/Global"),
    ("mcdelivery-india", "McDelivery India", "qsr", "com.mcdonalds.mcdeliveryindia", "McDelivery India", "#FFC72C", True, "India"),
    ("mcdonalds", "McDonald's", "qsr", "com.mcdonalds.app", "McDonald's", "#FFC72C", True, "Global"),
    ("burger-king-india", "Burger King India", "qsr", "com.bkindia", "Burger King India", "#D62300", True, "India"),
    ("burger-king", "Burger King", "qsr", "com.bk", "Burger King", "#D62300", True, "Global"),
    ("wendys", "Wendy's", "qsr", "com.wendys.nutritiontool", "Wendy's", "#E31837", True, "US"),
    ("five-guys", "Five Guys", "qsr", "com.fiveguys.android", "Five Guys", "#E94B3C", True, "US/Europe"),
    ("kfc-india", "KFC India", "qsr", "com.kfc.india", "KFC India", "#F40009", True, "India"),
    ("kfc", "KFC", "qsr", "com.kfc.android", "KFC", "#F40009", True, "Global"),
    ("chick-fil-a", "Chick-fil-A", "qsr", "com.chickfila.app", "Chick-fil-A", "#DD0031", True, "US"),
    ("popeyes", "Popeyes", "qsr", "com.popeyes.android", "Popeyes", "#FF7D00", True, "US/Global"),
    ("chipotle", "Chipotle", "qsr", "com.chipotle.android", "Chipotle", "#451400", True, "US/Europe"),
    ("taco-bell", "Taco Bell", "qsr", "com.tacobell", "Taco Bell", "#702083", True, "US/Europe/LATAM"),
    ("subway", "Subway", "qsr", "com.subway.subwaymobile", "Subway", "#008C15", True, "Global"),
    ("panera", "Panera Bread", "qsr", "com.panera.bread", "Panera Bread", "#1B998B", True, "US"),
    ("starbucks", "Starbucks", "qsr", "com.starbucks.mobilecard", "Starbucks", "#00704A", True, "Global"),
    ("starbucks-india", "Starbucks India", "qsr", "com.starbucks.in", "Starbucks India", "#00704A", True, "India"),
    ("dunkin", "Dunkin'", "qsr", "com.dunkinbrands.dunkindonuts", "Dunkin'", "#FF671F", True, "US"),
    ("tim-hortons", "Tim Hortons", "qsr", "com.timhortons.app", "Tim Hortons", "#C8102E", True, "US/Canada"),
    ("eatsure", "EatSure", "qsr", "com.eatsure", "EatSure", "#FF6F00", True, "India"),
    ("box8", "Box8", "qsr", "com.box8.app", "Box8", "#FF6F00", True, "India"),
    ("behrouz", "Behrouz Biryani", "qsr", "com.faasos.behrouz", "Behrouz Biryani", "#1A1A1A", True, "India"),
    ("chaayos", "Chaayos", "qsr", "com.chaayos", "Chaayos", "#00A651", True, "India"),
    ("wow-momo", "Wow! Momo", "qsr", "com.wowmomo", "Wow! Momo", "#FF6F00", True, "India"),
    ("faasos", "Faasos", "qsr", "com.faasos", "Faasos", "#FF6F00", True, "India"),
    ("oven-story", "Oven Story Pizza", "qsr", "com.faasos.ovenstory", "Oven Story Pizza", "#D0021B", True, "India"),
    ("mandarin-fox", "Mandarin Fox", "qsr", "com.faasos.mandarinfox", "Mandarin Fox", "#FF6F00", True, "India"),
    ("the-bowl-company", "The Bowl Company", "qsr", "com.faasos.bowlcompany", "The Bowl Company", "#FF6F00", True, "India"),
    ("lenotre-dessert", "LENôTRE Dessert", "qsr", "com.lenotre.android", "LENôTRE Dessert", "#1A1A1A", True, "MENA"),
]


def is_package_already_present(text, package_name):
    """Check if a package name is already in the file (idempotency check)."""
    return f'"{package_name}"' in text


# Split into partner and customer additions (only those not already present)
partner_lines = []
customer_lines = []
partner_color_lines = []
customer_color_lines = []
enum_lines = []

skipped = []
added = []

for entry in MISSING_PLATFORMS:
    web_id, web_name, category, pkg, display, color, is_customer, region = entry

    if is_package_already_present(text, pkg):
        skipped.append(pkg)
        continue

    # Build the line
    comment = f"// {display} ({region})"

    if is_customer:
        customer_lines.append(f'        "{pkg}"'.ljust(56) + f' to "{display}",'.ljust(50) + comment)
        customer_color_lines.append(f'        "{pkg}"'.ljust(56) + f' to "{color}",'.ljust(20) + f'// {display}')
    else:
        partner_lines.append(f'        "{pkg}"'.ljust(56) + f' to "{display}",'.ljust(50) + comment)
        partner_color_lines.append(f'        "{pkg}"'.ljust(56) + f' to "{color}",'.ljust(20) + f'// {display}')

    enum_name = web_id.upper().replace("-", "_")
    source_id = web_id.replace("-", "_")
    enum_lines.append(f'    {enum_name}("{display}", "{pkg}", "{source_id}", "{category}"),')

    added.append(pkg)

print(f"Adding {len(added)} new platforms (skipped {len(skipped)} already present)")

# Now insert the lines at the correct locations in Constants.kt

# 1. PARTNER_PACKAGES — insert before the closing `)` of the mapOf(...)
# Find: "val PARTNER_PACKAGES = mapOf(" ... ending with "\n    )"
if partner_lines:
    # Locate the closing `)` of PARTNER_PACKAGES
    pattern = re.compile(r"(val PARTNER_PACKAGES\s*=\s*mapOf\([^)]*?)(\n    \))", re.DOTALL)
    m = pattern.search(text)
    if m:
        insertion = "\n" + "\n".join(partner_lines)
        text = text[:m.end(1)] + insertion + m.group(2) + text[m.end():]
        print(f"  Inserted {len(partner_lines)} entries into PARTNER_PACKAGES")
    else:
        print("  WARNING: Could not find PARTNER_PACKAGES closing bracket")

# 2. CUSTOMER_PACKAGES — same pattern
if customer_lines:
    pattern = re.compile(r"(val CUSTOMER_PACKAGES\s*=\s*mapOf\([^)]*?)(\n    \))", re.DOTALL)
    m = pattern.search(text)
    if m:
        insertion = "\n" + "\n".join(customer_lines)
        text = text[:m.end(1)] + insertion + m.group(2) + text[m.end():]
        print(f"  Inserted {len(customer_lines)} entries into CUSTOMER_PACKAGES")
    else:
        print("  WARNING: Could not find CUSTOMER_PACKAGES closing bracket")

# 3. PLATFORM_COLORS — find the closing `)` after val PLATFORM_COLORS = mapOf(
if partner_color_lines:
    pattern = re.compile(r"(val PLATFORM_COLORS\s*=\s*mapOf\([^)]*?)(\n    \))", re.DOTALL)
    m = pattern.search(text)
    if m:
        insertion = "\n" + "\n".join(partner_color_lines)
        text = text[:m.end(1)] + insertion + m.group(2) + text[m.end():]
        print(f"  Inserted {len(partner_color_lines)} entries into PLATFORM_COLORS")
    else:
        print("  WARNING: Could not find PLATFORM_COLORS closing bracket")

# 4. CUSTOMER_PLATFORM_COLORS — same
if customer_color_lines:
    pattern = re.compile(r"(val CUSTOMER_PLATFORM_COLORS\s*=\s*mapOf\([^)]*?)(\n    \))", re.DOTALL)
    m = pattern.search(text)
    if m:
        insertion = "\n" + "\n".join(customer_color_lines)
        text = text[:m.end(1)] + insertion + m.group(2) + text[m.end():]
        print(f"  Inserted {len(customer_color_lines)} entries into CUSTOMER_PLATFORM_COLORS")
    else:
        print("  WARNING: Could not find CUSTOMER_PLATFORM_COLORS closing bracket")

# 5. PlatformSource enum — insert before the closing `}` of the enum class
if enum_lines:
    # Find "enum class PlatformSource(...)" and its closing "}"
    pattern = re.compile(r"(enum class PlatformSource[^{]*\{[^}]*?)(\n\})", re.DOTALL)
    m = pattern.search(text)
    if m:
        insertion = "\n" + "\n".join(enum_lines)
        text = text[:m.end(1)] + insertion + m.group(2) + text[m.end():]
        print(f"  Inserted {len(enum_lines)} entries into PlatformSource enum")
    else:
        print("  WARNING: Could not find PlatformSource enum closing brace")

# Write back
CONSTANTS_PATH.write_text(text)
print(f"\n✅ Constants.kt updated. New file size: {len(text)} chars ({len(text.splitlines())} lines)")
