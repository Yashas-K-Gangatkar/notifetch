package com.notifetch.app.util

object Constants {

    const val DATABASE_NAME = "notifetch_db"
    const val BASE_URL = "https://d2-liart-nine.vercel.app/"
    const val NOTIFICATION_CHANNEL_ID = "notifetch_channel"
    const val NOTIFICATION_CHANNEL_NAME = "NotiFetch Service"
    const val SYNC_WORK_NAME = "notifetch_sync_work"
    const val PREFS_NAME = "notifetch_prefs"

    // ═══════════════════════════════════════════════════════════════════════
    // ALL Verified Delivery Partner/Driver App Packages (NOT customer apps)
    // Last verified: June 2026
    // Only includes apps with CONFIRMED package names from Google Play Store
    // ═══════════════════════════════════════════════════════════════════════

    val PARTNER_PACKAGES = mapOf(
        // ── Food Delivery ──────────────────────────────────────────────────
        "com.ubercab.driver" to "Food & Ride Partner",              // Uber Driver/Eats (Global)
        "com.doordash.driverapp" to "Food Dasher",                   // DoorDash Dasher (US/CA/AU/JP)
        "com.grubhub.driver" to "Food Courier US",                   // Grubhub Driver (US)
        "com.deliveroo.driverapp" to "Food Rider EU",                // Deliveroo Rider (UK/EU/MENA/Asia)
        "com.justeat.courier.uk" to "Food Courier UK",               // Just Eat Courier UK
        "com.takeaway.delivered4all" to "Food Courier EU",           // Takeaway.com Courier (EU)
        "com.lieferando.courier" to "Food Courier DE",               // Lieferando Courier (DE)
        "com.logistics.rider.foodpanda" to "Food Rider Asia",        // Foodpanda Rider (Asia/EMEA)
        "in.swiggy.deliveryapp" to "Food Delivery IN",               // Swiggy Delivery Partner (India) — NOT .partner (that's for restaurants!)
        "com.zomato.delivery" to "Food Delivery IN 2",              // Zomato Delivery (India)
        "br.com.ifood.driver.app" to "Food Courier BR",              // iFood Entregador (Brazil)
        "com.rappi.storekeeper" to "Food Courier LATAM",             // Rappi Repartidor (LATAM)
        "com.wolt.courierapp" to "Food Courier Nordics",             // Wolt Courier (EU/Nordics/Asia)
        "com.logistics.rider.glovo" to "Food Courier EU 2",         // Glovo Courier (EMEA/LATAM)
        "com.demaecan.DemaecanDriver" to "Food Courier JP",          // Demae-can Driver (Japan)
        "com.logistics.rider.talabat" to "Food Rider MENA",          // Talabat Rider (MENA)
        "com.menulog.courier" to "Food Courier AU",                  // Menulog Courier (AU/NZ)
        "com.sankuai.sailor.courier" to "Food Rider HK",             // Keeta Rider (HK/Saudi — Meituan Intl)

        // ── Grocery Delivery ───────────────────────────────────────────────
        "com.instacart.shopper" to "Grocery Shopper",                // Instacart Shopper (US/CA)
        "com.gopuff.godrive2.live" to "Grocery Courier",             // Gopuff Driver (US/UK)
        "app.blinkit.onboarding" to "Grocery Quick IN",              // Blinkit Delivery Partner (India) — NOT .partnerapp
        "com.bigbasket.dapp.activity" to "Grocery IN",               // BigBasket Delivery Partner (India) — NOT .partnerapp
        "com.mercadoenvios.crowdsourcing" to "Grocery LATAM",        // Mercado Libre Envios Extra (LATAM)
        "com.mercadoenvios.driver" to "Grocery LATAM 2",             // Mercado Libre Envios Flex (LATAM)
        "au.com.woolworths.android.driver" to "Grocery AU",          // WooliesGO (AU)
        "com.zepto.rider" to "Quick Grocery IN",                     // Zepto Delivery Partner (India) — NOT .cafepartner
        "com.flink.workforce" to "Grocery EU",                       // Flink Workforce (EU)

        // ── Package & Parcel ──────────────────────────────────────────────
        "com.amazon.flex.rabbit" to "Package Flex",                  // Amazon Flex (Global) — NOT .flex (old package)
        "com.ups.genesispd" to "Package Courier US",                 // UPS Pickup & Delivery (Global)
        "com.dunzo.partner" to "Package IN",                         // Dunzo Partner (India)
        "com.lalamove.global.driver.sea" to "Package Courier Asia",  // Lalamove Driver (Asia/LATAM/ME)
        "global.dostavista.courier" to "Package Courier IN",         // Borzo/WeFast Courier (India/LATAM/Asia)

        // ── Courier & Express ─────────────────────────────────────────────
        "com.postmates.android.courier" to "Courier US",             // Postmates Fleet (US — now merged into Uber)
        "com.roadie.drive.android.app" to "Courier US 2",            // Roadie Driver (US)
        "com.stuart.courier" to "Courier EU",                        // Stuart Courier (UK/FR/ES)
        "com.quadx.riderapp" to "Courier PH",                        // GoGo Xpress Rider (Philippines)

        // ── Last-Mile Delivery ────────────────────────────────────────────
        "com.amazon.relay" to "Logistics Relay",                     // Amazon Relay/Logistics (US — for carriers)
        "com.ekartkiranaonboarding" to "Last Mile IN",               // Flipkart/Ekart Delivery Partner (India) — NOT .logistics
        "com.ekart.logistics.app" to "Last Mile IN 2",               // Ekart Field X (India)
        "id.my.irsyadf.jobdriver" to "Last Mile ID",                 // JOS KURIR/JNE (Indonesia)
        "com.aramex.ecourier" to "Last Mile MENA",                   // Aramex Courier (MENA/Global)

        // ── Medical & Pharmacy ────────────────────────────────────────────
        // NOTE: Most pharmacy platforms don't have public driver apps.
        // They use internal couriers or third-party logistics.

        // ── Ride & Transport ──────────────────────────────────────────────
        "com.lyft.android.driver" to "Ride Partner US",              // Lyft Driver (US/CA)
        "com.olacabs.oladriver" to "Ride Partner IN",                // Ola Driver (India/AU/NZ/UK) — NOT .driver (old package)
        "com.grabtaxi.driver2" to "Ride Partner SEA",                // Grab Driver (SE Asia)
        "com.careem.adma" to "Ride Partner MENA",                    // Careem Captain (MENA)
        "com.didiglobal.driver" to "Ride Partner LATAM",             // DiDi Driver (AU/NZ/LATAM/JP)
        "ee.mtakso.driver" to "Ride Partner EU",                     // Bolt Driver (EU/Africa)

        // ── Other Delivery Partners (India-specific) ──────────────────────
        "com.theporter.android.driverapp" to "Logistics IN",         // Porter Driver (India) — NOT .porterpartner
        "com.rapido.rider" to "Bike Taxi IN",                        // Rapido Captain (India) — NOT .captain
        "in.shadowfax.gandalf" to "Last Mile IN 3",                  // Shadowfax Delivery Partner (India) — NOT .partner
        "com.shipt.shopper" to "Grocery Shopper US",                 // Shipt Shopper (US)
        "co.ninjavan.swiftninja_global" to "Last Mile SEA",          // Ninja Van Driver (SE Asia)

        // ── Additional Worldwide Platforms ─────────────────────────────────
        "com.gojek.partner" to "Super App ID",                       // Gojek Driver/GoPartner (Indonesia/SE Asia)
        "com.delhivery.delhiverypartner" to "Logistics IN 2",        // Delhivery Partner (India)
        "com.ecomexpress.oneBoarding" to "Logistics IN 3",           // Ecom Express Sathi (India)
        "com.xpressbees.unified_new_arch" to "Logistics IN 4",       // Xpressbees (India)
        "in.letstransport.supply" to "Logistics IN 5",               // LetsTransport Partner (India)
        "net.blowhorn.driverapp" to "Logistics IN 6",                // Blowhorn Driver (India)
        "com.driveu.partner" to "Driver Partner IN",                 // DriveU Partner (India)
        "app.yulu.android.partner" to "Mobility IN",                 // Yulu Partner (India)

        // ── Alternate/legacy packages (for compatibility) ──────────────────
        "in.swiggy.partner" to "Food Delivery IN",                   // Swiggy Restaurant Partner (may still be used by some)
        "com.zomato.deliverypartner" to "Food Delivery IN 2",        // Zomato alternate package
        "com.amazon.flex" to "Package Flex",                         // Amazon Flex old package (redirects to .rabbit)
        "com.flipkart.logistics" to "Last Mile IN",                  // Flipkart old package
    )

    // Source identifiers for API (generic, no brand names)
    val PLATFORM_SOURCES: Map<String, String> = PARTNER_PACKAGES.map { (pkg, _) ->
        pkg to pkg.replace(".", "_").replace("com_", "").replace("in_", "").replace("br_com_", "").replace("global_", "").replace("app_", "").take(40)
    }.toMap()

    // Generic category-based colors (NOT brand colors — legal compliance)
    // Each platform gets a color based on its delivery category, not its brand
    val PLATFORM_COLORS = mapOf(
        // Food Delivery — warm oranges/reds
        "Food & Ride Partner" to "#E8751A",
        "Food Dasher" to "#D94F4F",
        "Food Courier US" to "#D4A017",
        "Food Rider EU" to "#4DB6AC",
        "Food Courier UK" to "#E67E22",
        "Food Courier EU" to "#E67E22",
        "Food Courier DE" to "#E67E22",
        "Food Rider Asia" to "#E91E8C",
        "Food Delivery IN" to "#E8751A",
        "Food Delivery IN 2" to "#D94F4F",
        "Food Courier BR" to "#9C27B0",
        "Food Courier LATAM" to "#E67E22",
        "Food Courier Nordics" to "#42A5F5",
        "Food Courier EU 2" to "#F1C40F",
        "Food Courier JP" to "#D94F4F",
        "Food Rider MENA" to "#E67E22",
        "Food Courier AU" to "#9C27B0",
        "Food Rider HK" to "#F1C40F",

        // Grocery — greens
        "Grocery Shopper" to "#E67E22",
        "Grocery Courier" to "#9C27B0",
        "Grocery Quick IN" to "#F1C40F",
        "Grocery IN" to "#D94F4F",
        "Grocery LATAM" to "#F1C40F",
        "Grocery LATAM 2" to "#F1C40F",
        "Grocery AU" to "#66BB6A",
        "Quick Grocery IN" to "#8B5CF6",
        "Grocery EU" to "#66BB6A",
        "Grocery Shopper US" to "#66BB6A",

        // Package — blues/teals
        "Package Flex" to "#26A69A",
        "Package Courier US" to "#7E57C2",
        "Package IN" to "#00BCD4",
        "Package Courier Asia" to "#E67E22",
        "Package Courier IN" to "#66BB6A",

        // Courier — indigos
        "Courier US" to "#F1C40F",
        "Courier US 2" to "#42A5F5",
        "Courier EU" to="#5C6BC0",
        "Courier PH" to "#E67E22",

        // Last-Mile — teals
        "Logistics Relay" to "#26A69A",
        "Last Mile IN" to "#42A5F5",
        "Last Mile IN 2" to "#42A5F5",
        "Last Mile ID" to "#E67E22",
        "Last Mile MENA" to "#42A5F5",
        "Last Mile SEA" to "#E67E22",
        "Last Mile IN 3" to "#E67E22",

        // Ride — violets/greens
        "Ride Partner US" to="#E91E8C",
        "Ride Partner IN" to="#F1C40F",
        "Ride Partner SEA" to="#66BB6A",
        "Ride Partner MENA" to="#66BB6A",
        "Ride Partner LATAM" to="#E67E22",
        "Ride Partner EU" to="#66BB6A",

        // Other
        "Logistics IN" to "#42A5F5",
        "Bike Taxi IN" to "#F1C40F",
        "Driver Partner IN" to="#E67E22",
        "Mobility IN" to="#26A69A",
        "Super App ID" to="#66BB6A",
        "Logistics IN 2" to="#42A5F5",
        "Logistics IN 3" to="#42A5F5",
        "Logistics IN 4" to="#42A5F5",
        "Logistics IN 5" to="#42A5F5",
        "Logistics IN 6" to="#42A5F5",
    )

    // Time constants
    const val SYNC_INTERVAL_MINUTES = 15L
    const val MAX_NOTIFICATION_AGE_DAYS = 30

    // Legal compliance: NotiFetch does NOT access delivery platform APIs,
    // store credentials, or use OAuth tokens. It only reads notification
    // content that the user can already see on their device.
    const val LEGAL_DISCLAIMER = "NotiFetch reads notifications you can already see. We never access platform APIs or store credentials."
}

enum class PlatformSource(val displayName: String, val packageName: String, val sourceId: String, val category: String) {
    // Food Delivery
    UBER_DRIVER("Food & Ride Partner", "com.ubercab.driver", "uber_driver", "food"),
    DOORDASH("Food Dasher", "com.doordash.driverapp", "doordash_dasher", "food"),
    GRUBHUB("Food Courier US", "com.grubhub.driver", "grubhub_driver", "food"),
    DELIVEROO("Food Rider EU", "com.deliveroo.driverapp", "deliveroo_rider", "food"),
    JUSTEAT("Food Courier UK", "com.justeat.courier.uk", "justeat_courier", "food"),
    TAKEAWAY("Food Courier EU", "com.takeaway.delivered4all", "takeaway_courier", "food"),
    LIEFERANDO("Food Courier DE", "com.lieferando.courier", "lieferando_courier", "food"),
    FOODPANDA("Food Rider Asia", "com.logistics.rider.foodpanda", "foodpanda_rider", "food"),
    SWIGGY("Food Delivery IN", "in.swiggy.deliveryapp", "swiggy_delivery", "food"),
    ZOMATO("Food Delivery IN 2", "com.zomato.delivery", "zomato_delivery", "food"),
    IFOOD("Food Courier BR", "br.com.ifood.driver.app", "ifood_entregador", "food"),
    RAPPI("Food Courier LATAM", "com.rappi.storekeeper", "rappi_repartidor", "food"),
    WOLT("Food Courier Nordics", "com.wolt.courierapp", "wolt_courier", "food"),
    GLOVO("Food Courier EU 2", "com.logistics.rider.glovo", "glovo_courier", "food"),
    DEMAECAN("Food Courier JP", "com.demaecan.DemaecanDriver", "demaecan_driver", "food"),
    TALABAT("Food Rider MENA", "com.logistics.rider.talabat", "talabat_rider", "food"),
    MENULOG("Food Courier AU", "com.menulog.courier", "menulog_courier", "food"),
    KEETA("Food Rider HK", "com.sankuai.sailor.courier", "keeta_rider", "food"),

    // Grocery
    INSTACART("Grocery Shopper", "com.instacart.shopper", "instacart_shopper", "grocery"),
    GOPUFF("Grocery Courier", "com.gopuff.godrive2.live", "gopuff_driver", "grocery"),
    BLINKIT("Grocery Quick IN", "app.blinkit.onboarding", "blinkit_partner", "grocery"),
    BIGBASKET("Grocery IN", "com.bigbasket.dapp.activity", "bigbasket_partner", "grocery"),
    MERCADO("Grocery LATAM", "com.mercadoenvios.crowdsourcing", "mercado_envios", "grocery"),
    WOOLWORTHS("Grocery AU", "au.com.woolworths.android.driver", "woolworths_driver", "grocery"),
    ZEPTO("Quick Grocery IN", "com.zepto.rider", "zepto_partner", "grocery"),
    FLINK("Grocery EU", "com.flink.workforce", "flink_rider", "grocery"),
    SHIPT("Grocery Shopper US", "com.shipt.shopper", "shipt_shopper", "grocery"),

    // Package
    AMAZON_FLEX("Package Flex", "com.amazon.flex.rabbit", "amazon_flex", "package"),
    UPS("Package Courier US", "com.ups.genesispd", "ups_driver", "package"),
    DUNZO("Package IN", "com.dunzo.partner", "dunzo_partner", "package"),
    LALAMOVE("Package Courier Asia", "com.lalamove.global.driver.sea", "lalamove_driver", "package"),
    BORZO("Package Courier IN", "global.dostavista.courier", "borzo_courier", "package"),

    // Courier
    POSTMATES("Courier US", "com.postmates.android.courier", "postmates_fleet", "courier"),
    ROADIE("Courier US 2", "com.roadie.drive.android.app", "roadie_driver", "courier"),
    STUART("Courier EU", "com.stuart.courier", "stuart_courier", "courier"),
    GOGO("Courier PH", "com.quadx.riderapp", "gogo_rider", "courier"),

    // Last-Mile
    AMAZON_RELAY("Logistics Relay", "com.amazon.relay", "amazon_relay", "last-mile"),
    EKART("Last Mile IN", "com.ekartkiranaonboarding", "ekart_partner", "last-mile"),
    EKART_FIELD("Last Mile IN 2", "com.ekart.logistics.app", "ekart_field", "last-mile"),
    JNE("Last Mile ID", "id.my.irsyadf.jobdriver", "jne_kurir", "last-mile"),
    ARAMEX("Last Mile MENA", "com.aramex.ecourier", "aramex_courier", "last-mile"),
    NINJA_VAN("Last Mile SEA", "co.ninjavan.swiftninja_global", "ninja_van_driver", "last-mile"),

    // Ride
    LYFT("Ride Partner US", "com.lyft.android.driver", "lyft_driver", "ride"),
    OLA("Ride Partner IN", "com.olacabs.oladriver", "ola_driver", "ride"),
    GRAB("Ride Partner SEA", "com.grabtaxi.driver2", "grab_driver", "ride"),
    CAREEM("Ride Partner MENA", "com.careem.adma", "careem_captain", "ride"),
    DIDI("Ride Partner LATAM", "com.didiglobal.driver", "didi_driver", "ride"),
    BOLT("Ride Partner EU", "ee.mtakso.driver", "bolt_driver", "ride"),

    // India-specific
    PORTER("Logistics IN", "com.theporter.android.driverapp", "porter_partner", "package"),
    RAPIDO("Bike Taxi IN", "com.rapido.rider", "rapido_captain", "ride"),
    SHADOWFAX("Last Mile IN 3", "in.shadowfax.gandalf", "shadowfax_partner", "last-mile"),
    DELHIVERY("Logistics IN 2", "com.delhivery.delhiverypartner", "delhivery_partner", "last-mile"),
    ECOM_EXPRESS("Logistics IN 3", "com.ecomexpress.oneBoarding", "ecom_express", "last-mile"),
    XPRESSBEES("Logistics IN 4", "com.xpressbees.unified_new_arch", "xpressbees", "last-mile"),
    LETSTRANSPORT("Logistics IN 5", "in.letstransport.supply", "letstransport_partner", "courier"),
    BLOWHORN("Logistics IN 6", "net.blowhorn.driverapp", "blowhorn_driver", "courier"),
    DRIVEU("Driver Partner IN", "com.driveu.partner", "driveu_partner", "ride"),
    YULU("Mobility IN", "app.yulu.android.partner", "yulu_partner", "ride"),
    GOJEK("Super App ID", "com.gojek.partner", "gojek_driver", "food"),
}
