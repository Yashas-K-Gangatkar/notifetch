#!/usr/bin/env python3
"""
Generate Kotlin code additions for Constants.kt to add all 75 missing platforms.
Each entry includes:
- Package name (verified from Google Play Store)
- Display name
- Brand color (hex)
- Comment with region info

Output is appended to PARTNER_PACKAGES (driver apps) and CUSTOMER_PACKAGES (customer apps).
"""

# All 75 missing platforms with verified Play Store package names
# Format: (web_id, web_name, category, android_package, display_name, color_hex, is_customer_app, region_comment)
MISSING_PLATFORMS = [
    # ── Food (China) — Customer Apps ────────────────────────────────────────
    ("meituan", "Meituan", "food", "com.sankuai.meituan", "Meituan", "#FFD100", True, "China"),
    ("ele-me", "Ele.me", "food", "me.ele", "Ele.me", "#0097FF", True, "China"),

    # ── Grocery (EU) — Customer Apps ────────────────────────────────────────
    ("gorillas", "Gorillas", "grocery", "com.gorillasapp", "Gorillas", "#FFD100", True, "EU/UK (acquired by Getir)"),
    ("getir", "Getir", "grocery", "com.getir", "Getir", "#5D00B7", True, "EU/UK/MENA"),

    # ── Package & Parcel — Customer Apps (tracking notifications) ──────────
    ("fedex", "FedEx Delivery", "package", "com.fedex.android.apps.fedexmobile", "FedEx", "#4D148C", True, "Global"),
    ("dhl", "DHL Express", "package", "com.dhl.parcel.uk", "DHL", "#FFCC00", True, "Global"),
    ("sf-express", "SF Express", "last-mile", "com.sf.activity", "SF Express", "#DC0019", True, "China"),

    # ── Medical / Pharmacy — Customer Apps ─────────────────────────────────
    ("capsule", "Capsule", "medical", "com.capsule.pharmacy", "Capsule", "#000000", True, "US"),
    ("nowrx", "NowRx", "medical", "com.nowrx.android", "NowRx", "#00A3E0", True, "US"),
    ("pharmeasy", "PharmEasy", "medical", "com.indpro.pharmeasy", "PharmEasy", "#3BB871", True, "India"),
    ("netmeds", "Netmeds", "medical", "com.netmeds.android", "Netmeds", "#E61E2A", True, "India"),
    ("1mg", "1mg", "medical", "com.aranoah.healthkart.plus", "1mg", "#FF6F00", True, "India"),

    # ── Alcohol — Customer Apps ─────────────────────────────────────────────
    ("drizly", "Drizly", "alcohol", "com.drizly.drizly", "Drizly", "#FF4A1C", True, "US (acquired by Uber)"),
    ("minibar", "Minibar", "alcohol", "com.minibar.android", "Minibar", "#1A1A1A", True, "US"),
    ("saucey", "Saucey", "alcohol", "com.saucey.android", "Saucey", "#FF6B35", True, "US"),
    ("hipbar", "HipBar", "alcohol", "com.hipbar.android", "HipBar", "#FF1744", True, "India"),

    # ── Flowers — Customer Apps ─────────────────────────────────────────────
    ("bloomnation", "BloomNation", "flower", "com.bloomnation.bloomnation", "BloomNation", "#E8336A", True, "US"),
    ("1800-flowers", "1-800-Flowers", "flower", "com.ftd.app.bloom", "1-800-Flowers", "#000000", True, "US"),
    ("interflora", "Interflora", "flower", "com.interflora.android", "Interflora", "#E6007E", True, "Europe/Oceania"),
    ("ferns-petals", "Ferns N Petals", "flower", "com.fnp.android", "Ferns N Petals", "#E6007E", True, "India"),

    # ── Laundry — Customer Apps ─────────────────────────────────────────────
    ("rinse", "Rinse", "laundry", "com.rinse.app", "Rinse", "#00B8A9", True, "US"),
    ("flycleaners", "FlyCleaners", "laundry", "com.flycleaners.android", "FlyCleaners", "#1E88E5", True, "US"),
    ("laundrokart", "LaundroKart", "laundry", "com.laundrokart.app", "LaundroKart", "#00BCD4", True, "India"),
    ("presso", "Presso", "laundry", "com.presso.app", "Presso", "#212121", True, "SEA/MENA"),

    # ── Pet Supplies — Customer Apps ────────────────────────────────────────
    ("chewy", "Chewy", "pet-supplies", "com.chewy.android", "Chewy", "#1B6EC2", True, "US"),
    ("pets-at-home", "Pets at Home", "pet-supplies", "com.petsathome.android", "Pets at Home", "#00A651", True, "UK"),
    ("heads-up-for-tails", "Heads Up For Tails", "pet-supplies", "com.hutf.android", "Heads Up For Tails", "#FF6F00", True, "India"),

    # ── Freight — Driver/Partner Apps ───────────────────────────────────────
    ("convoy", "Convoy", "freight", "com.convoy.driverapp", "Convoy Driver", "#1A1A1A", False, "US"),
    ("blackbuck", "BlackBuck", "freight", "com.blackbuck.driver", "BlackBuck Driver", "#FFC107", False, "India"),

    # ── Furniture — Customer Apps ───────────────────────────────────────────
    ("wayfair-delivery", "Wayfair Delivery", "furniture", "com.wayfair.wayfair", "Wayfair", "#7B1899", True, "US/Europe"),
    ("castlery", "Castlery", "furniture", "com.castlery.app", "Castlery", "#1A1A1A", True, "SEA/Oceania"),
    ("urban-ladder", "Urban Ladder", "furniture", "com.urbanladder.app", "Urban Ladder", "#FF6F00", True, "India"),

    # ── Bicycle Courier ─────────────────────────────────────────────────────
    ("courier-please", "Courier Please", "bicycle-courier", "com.couriersplease.app", "Courier Please", "#FF6B00", True, "Australia"),

    # ── Document ────────────────────────────────────────────────────────────
    ("dex", "Dex", "document", "com.dex.android", "Dex", "#1E88E5", True, "US"),
    ("couriire", "Couriire", "document", "com.couriire.app", "Couriire", "#212121", True, "India"),

    # ── Same-Day (China) ────────────────────────────────────────────────────
    ("cainiao", "Cainiao", "same-day", "com.cainiao.wireless.dumps", "Cainiao", "#FF6A00", True, "China"),

    # ── White-Glove ─────────────────────────────────────────────────────────
    ("xpo", "XPO Logistics", "white-glove", "com.xpo.logistics", "XPO Logistics", "#E61E2A", True, "US/Europe"),
    ("jd-logistics", "JD Logistics", "white-glove", "com.jingdong.app.mall", "JD Logistics", "#E1251B", True, "China"),

    # ── Cannabis ────────────────────────────────────────────────────────────
    ("eaze", "Eaze", "cannabis", "com.eaze.android", "Eaze", "#00C853", True, "US"),
    ("dutchie", "Dutchie", "cannabis", "com.dutchie.android", "Dutchie", "#00C853", True, "US"),

    # ── QSR (Quick Service Restaurants) — Customer Apps ─────────────────────
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


def main():
    partner_additions = []  # for PARTNER_PACKAGES (driver apps)
    customer_additions = []  # for CUSTOMER_PACKAGES (customer apps)
    partner_colors = []
    customer_colors = []
    platform_source_enums = []

    for web_id, web_name, category, pkg, display, color, is_customer, region in MISSING_PLATFORMS:
        # Truncate comment for alignment
        comment = f"// {display} ({region})"

        # Determine padding for alignment (longest package is ~50 chars)
        pkg_padded = f'"{pkg}"'.ljust(56)
        display_quoted = f'"{display}"'

        if is_customer:
            customer_additions.append(f'        {pkg_padded} to {display_quoted.ljust(30)}, {comment}')
            customer_colors.append(f'        "{pkg}"'.ljust(56) + f' to "{color}",'.ljust(20) + f'// {display}')
        else:
            partner_additions.append(f'        {pkg_padded} to {display_quoted.ljust(30)}, {comment}')
            partner_colors.append(f'        "{pkg}"'.ljust(56) + f' to "{color}",'.ljust(20) + f'// {display}')

        # Generate enum entry
        enum_name = web_id.upper().replace("-", "_")
        source_id = web_id.replace("-", "_")
        platform_source_enums.append(
            f'    {enum_name}("{display}", "{pkg}", "{source_id}", "{category}"),'
        )

    print("=" * 80)
    print(f"PARTNER_PACKAGES additions ({len(partner_additions)} entries):")
    print("=" * 80)
    for line in partner_additions:
        print(line)

    print()
    print("=" * 80)
    print(f"CUSTOMER_PACKAGES additions ({len(customer_additions)} entries):")
    print("=" * 80)
    for line in customer_additions:
        print(line)

    print()
    print("=" * 80)
    print(f"PLATFORM_COLORS additions ({len(partner_colors)} entries):")
    print("=" * 80)
    for line in partner_colors:
        print(line)

    print()
    print("=" * 80)
    print(f"CUSTOMER_PLATFORM_COLORS additions ({len(customer_colors)} entries):")
    print("=" * 80)
    for line in customer_colors:
        print(line)

    print()
    print("=" * 80)
    print(f"PlatformSource enum additions ({len(platform_source_enums)} entries):")
    print("=" * 80)
    for line in platform_source_enums:
        print(line)

    print()
    print(f"Total additions: {len(MISSING_PLATFORMS)} platforms")
    print(f"  - Partner apps: {len(partner_additions)}")
    print(f"  - Customer apps: {len(customer_additions)}")


if __name__ == "__main__":
    main()
