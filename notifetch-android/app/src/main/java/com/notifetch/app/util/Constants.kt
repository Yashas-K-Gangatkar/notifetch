package com.notifetch.app.util

object Constants {

    const val DATABASE_NAME = "notifetch_db"
    const val BASE_URL = "https://www.notifetch.in/"
    const val NOTIFICATION_CHANNEL_ID = "notifetch_channel"
    const val NOTIFICATION_CHANNEL_NAME = "NotiFetch Service"
    const val SYNC_WORK_NAME = "notifetch_sync_work"
    const val PREFS_NAME = "notifetch_prefs"

    // ═══════════════════════════════════════════════════════════════════════
    // ALL Verified Delivery Partner/Driver App Packages (NOT customer apps)
    // Last verified: June 2026
    // Only includes apps with CONFIRMED package names from Google Play Store
    //
    // LEGAL NOTE — Platform Display Names (User Choice Model):
    // Default display names use the real brand names (e.g., "Swiggy Delivery",
    // "DoorDash Dasher") because this is nominative fair use — we are identifying
    // the service the user is already using. Users can customize any platform
    // name to whatever they prefer. This "user choice" model provides:
    //   1. Better UX (users want to see the real name they know)
    //   2. Legal defense (user chose to display the brand name, we just
    //      provided a tool with customizable labels)
    //   3. Nominative fair use protection (we must identify the service
    //      to function; we don't claim endorsement or affiliation)
    // ═══════════════════════════════════════════════════════════════════════

    val PARTNER_PACKAGES = mapOf(
        // ── Food Delivery ──────────────────────────────────────────────────
        "com.ubercab.driver" to "Uber Driver",                      // Uber Driver/Eats (Global)
        "com.doordash.driverapp" to "DoorDash Dasher",              // DoorDash Dasher (US/CA/AU/JP)
        "com.grubhub.driver" to "Grubhub Driver",                   // Grubhub Driver (US)
        "com.deliveroo.driverapp" to "Deliveroo Rider",             // Deliveroo Rider (UK/EU/MENA/Asia)
        "com.justeat.courier.uk" to "Just Eat Courier",             // Just Eat Courier UK
        "com.takeaway.delivered4all" to "Takeaway Courier",         // Takeaway.com Courier (EU)
        "com.lieferando.courier" to "Lieferando Courier",           // Lieferando Courier (DE)
        "com.logistics.rider.foodpanda" to "Foodpanda Rider",      // Foodpanda Rider (Asia/EMEA)
        "in.swiggy.deliveryapp" to "Swiggy Delivery",              // Swiggy Delivery Partner (India)
        "com.zomato.delivery" to "Zomato Delivery",                // Zomato Delivery (India)
        "br.com.ifood.driver.app" to "iFood Entregador",           // iFood Entregador (Brazil)
        "com.rappi.storekeeper" to "Rappi Repartidor",             // Rappi Repartidor (LATAM)
        "com.wolt.courierapp" to "Wolt Courier",                   // Wolt Courier (EU/Nordics/Asia)
        "com.logistics.rider.glovo" to "Glovo Courier",            // Glovo Courier (EMEA/LATAM)
        "com.demaecan.DemaecanDriver" to "Demae-can Driver",       // Demae-can Driver (Japan)
        "com.logistics.rider.talabat" to "Talabat Rider",          // Talabat Rider (MENA)
        "com.menulog.courier" to "Menulog Courier",                // Menulog Courier (AU/NZ)
        "com.sankuai.sailor.courier" to "Keeta Rider",             // Keeta Rider (HK/Saudi — Meituan Intl)

        // ── Grocery Delivery ───────────────────────────────────────────────
        "com.instacart.shopper" to "Instacart Shopper",            // Instacart Shopper (US/CA)
        "com.gopuff.godrive2.live" to "Gopuff Driver",             // Gopuff Driver (US/UK)
        "app.blinkit.onboarding" to "Blinkit Delivery",            // Blinkit Delivery Partner (India)
        "com.bigbasket.dapp.activity" to "BigBasket Delivery",     // BigBasket Delivery Partner (India)
        "com.mercadoenvios.crowdsourcing" to "Mercado Envios",     // Mercado Libre Envios Extra (LATAM)
        "com.mercadoenvios.driver" to "Mercado Flex",              // Mercado Libre Envios Flex (LATAM)
        "au.com.woolworths.android.driver" to "WooliesGO",         // WooliesGO (AU)
        "com.zepto.rider" to "Zepto Delivery",                     // Zepto Delivery Partner (India)
        "com.flink.workforce" to "Flink Rider",                    // Flink Workforce (EU)
        "com.shipt.shopper" to "Shipt Shopper",                    // Shipt Shopper (US)

        // ── Package & Parcel ──────────────────────────────────────────────
        "com.amazon.flex.rabbit" to "Amazon Flex",                 // Amazon Flex (Global)
        "com.ups.genesispd" to "UPS Driver",                       // UPS Pickup & Delivery (Global)
        "com.dunzo.partner" to "Dunzo Partner",                    // Dunzo Partner (India)
        "com.lalamove.global.driver.sea" to "Lalamove Driver",     // Lalamove Driver (Asia/LATAM/ME)
        "global.dostavista.courier" to "Borzo Courier",            // Borzo/WeFast Courier (India/LATAM/Asia)

        // ── Courier & Express ─────────────────────────────────────────────
        "com.postmates.android.courier" to "Postmates Fleet",      // Postmates Fleet (US — now merged into Uber)
        "com.roadie.drive.android.app" to "Roadie Driver",         // Roadie Driver (US)
        "com.stuart.courier" to "Stuart Courier",                  // Stuart Courier (UK/FR/ES)
        "com.quadx.riderapp" to "GoGo Xpress",                     // GoGo Xpress Rider (Philippines)

        // ── Last-Mile Delivery ────────────────────────────────────────────
        "com.amazon.relay" to "Amazon Relay",                      // Amazon Relay/Logistics (US — for carriers)
        "com.ekartkiranaonboarding" to "Ekart Delivery",           // Flipkart/Ekart Delivery Partner (India)
        "com.ekart.logistics.app" to "Ekart Field X",              // Ekart Field X (India)
        "id.my.irsyadf.jobdriver" to "JNE Kurir",                  // JOS KURIR/JNE (Indonesia)
        "com.aramex.ecourier" to "Aramex Courier",                 // Aramex Courier (MENA/Global)
        "co.ninjavan.swiftninja_global" to "Ninja Van Driver",     // Ninja Van Driver (SE Asia)

        // ── Ride & Transport ──────────────────────────────────────────────
        "com.lyft.android.driver" to "Lyft Driver",                // Lyft Driver (US/CA)
        "com.olacabs.oladriver" to "Ola Driver",                   // Ola Driver (India/AU/NZ/UK)
        "com.grabtaxi.driver2" to "Grab Driver",                   // Grab Driver (SE Asia)
        "com.careem.adma" to "Careem Captain",                     // Careem Captain (MENA)
        "com.didiglobal.driver" to "DiDi Driver",                  // DiDi Driver (AU/NZ/LATAM/JP)
        "ee.mtakso.driver" to "Bolt Driver",                       // Bolt Driver (EU/Africa)

        // ── Other Delivery Partners ────────────────────────────────────────
        "com.theporter.android.driverapp" to "Porter Driver",      // Porter Driver (India)
        "com.rapido.rider" to "Rapido Captain",                    // Rapido Captain (India)
        "in.shadowfax.gandalf" to "Shadowfax Delivery",            // Shadowfax Delivery Partner (India)
        "com.gojek.partner" to "Gojek Driver",                     // Gojek Driver/GoPartner (Indonesia/SE Asia)
        "com.delhivery.delhiverypartner" to "Delhivery Partner",   // Delhivery Partner (India)
        "com.ecomexpress.oneBoarding" to "Ecom Express",           // Ecom Express Sathi (India)
        "com.xpressbees.unified_new_arch" to "Xpressbees",         // Xpressbees (India)
        "in.letstransport.supply" to "LetsTransport",              // LetsTransport Partner (India)
        "net.blowhorn.driverapp" to "Blowhorn Driver",             // Blowhorn Driver (India)
        "com.driveu.partner" to "DriveU Partner",                  // DriveU Partner (India)
        "app.yulu.android.partner" to "Yulu Partner",              // Yulu Partner (India)

        // ── Alternate/legacy packages (for compatibility) ──────────────────
        "in.swiggy.partner" to "Swiggy Delivery",                  // Swiggy Restaurant Partner (alt package)
        "com.zomato.deliverypartner" to "Zomato Delivery",         // Zomato alternate package
        "com.amazon.flex" to "Amazon Flex",                        // Amazon Flex old package (redirects to .rabbit)
        "com.flipkart.logistics" to "Ekart Delivery",              // Flipkart old package

        // ── Freight (Driver Apps) ───────────────────────────────────────────
        "com.convoy.driverapp"                                   to "Convoy Driver",               // Convoy Driver (US)
        "com.blackbuck.driver"                                   to "BlackBuck Driver",            // BlackBuck Driver (India)
    )

    // Source identifiers for API (machine-readable, not user-facing)
    val PLATFORM_SOURCES: Map<String, String> = PARTNER_PACKAGES.map { (pkg, _) ->
        pkg to pkg.replace(".", "_").replace("com_", "").replace("in_", "").replace("br_com_", "").replace("global_", "").replace("app_", "").take(40)
    }.toMap()

    // ═══════════════════════════════════════════════════════════════════════
    // Platform colors keyed by PACKAGE NAME (not display name!)
    // This ensures colors work regardless of user customizing the display name.
    // Colors are the actual brand colors used in nominative fair use context.
    // ═══════════════════════════════════════════════════════════════════════
    val PLATFORM_COLORS = mapOf(
        // Food Delivery
        "com.ubercab.driver" to "#000000",              // Uber — Black
        "com.doordash.driverapp" to "#FF3008",          // DoorDash — Red
        "com.grubhub.driver" to "#F7871D",              // Grubhub — Orange
        "com.deliveroo.driverapp" to "#00CCBC",         // Deliveroo — Teal
        "com.justeat.courier.uk" to "#FF8000",          // Just Eat — Orange
        "com.takeaway.delivered4all" to "#FF6D00",      // Takeaway — Orange
        "com.lieferando.courier" to "#FF6D00",          // Lieferando — Orange
        "com.logistics.rider.foodpanda" to "#D21F3C",   // Foodpanda — Pink/Red
        "in.swiggy.deliveryapp" to "#FC8019",           // Swiggy — Orange
        "com.zomato.delivery" to "#E23744",             // Zomato — Red
        "br.com.ifood.driver.app" to "#EA1D2C",         // iFood — Red
        "com.rappi.storekeeper" to "#FF4444",           // Rappi — Orange/Red
        "com.wolt.courierapp" to "#00C7E6",             // Wolt — Cyan
        "com.logistics.rider.glovo" to "#F5C518",       // Glovo — Yellow
        "com.demaecan.DemaecanDriver" to "#D94F4F",     // Demae-can — Red
        "com.logistics.rider.talabat" to "#FF5A00",     // Talabat — Orange
        "com.menulog.courier" to "#FF8000",             // Menulog — Orange
        "com.sankuai.sailor.courier" to "#F5C518",      // Keeta — Yellow

        // Grocery
        "com.instacart.shopper" to "#43B02A",           // Instacart — Green
        "com.gopuff.godrive2.live" to "#7B2FF2",        // Gopuff — Purple
        "app.blinkit.onboarding" to "#F8E71C",          // Blinkit — Yellow
        "com.bigbasket.dapp.activity" to "#84C225",     // BigBasket — Green
        "com.mercadoenvios.crowdsourcing" to "#FFE600", // Mercado Libre — Yellow
        "com.mercadoenvios.driver" to "#FFE600",        // Mercado Flex — Yellow
        "au.com.woolworths.android.driver" to "#009444", // WooliesGO — Green
        "com.zepto.rider" to "#8B008B",                 // Zepto — Purple/Magenta
        "com.flink.workforce" to "#FF6B35",             // Flink — Orange
        "com.shipt.shopper" to "#33A198",               // Shipt — Teal

        // Package
        "com.amazon.flex.rabbit" to "#FF9900",          // Amazon Flex — Orange
        "com.ups.genesispd" to "#351C15",               // UPS — Brown
        "com.dunzo.partner" to "#00D290",               // Dunzo — Green
        "com.lalamove.global.driver.sea" to "#F5A623",  // Lalamove — Orange
        "global.dostavista.courier" to "#4CAF50",       // Borzo — Green

        // Courier
        "com.postmates.android.courier" to "#000000",   // Postmates — Black
        "com.roadie.drive.android.app" to "#42A5F5",    // Roadie — Blue
        "com.stuart.courier" to "#5C6BC0",              // Stuart — Indigo
        "com.quadx.riderapp" to "#E67E22",              // GoGo Xpress — Orange

        // Last-Mile
        "com.amazon.relay" to "#FF9900",                // Amazon Relay — Orange
        "com.ekartkiranaonboarding" to "#2874F0",       // Ekart — Blue
        "com.ekart.logistics.app" to "#2874F0",         // Ekart Field X — Blue
        "id.my.irsyadf.jobdriver" to "#FF6B35",         // JNE — Orange
        "com.aramex.ecourier" to "#ED1C24",             // Aramex — Red
        "co.ninjavan.swiftninja_global" to "#FF6B35",   // Ninja Van — Orange

        // Ride
        "com.lyft.android.driver" to "#FF00BF",         // Lyft — Pink
        "com.olacabs.oladriver" to "#36B37E",           // Ola — Green
        "com.grabtaxi.driver2" to "#00B14F",            // Grab — Green
        "com.careem.adma" to "#4CB050",                 // Careem — Green
        "com.didiglobal.driver" to "#FF6B00",           // DiDi — Orange
        "ee.mtakso.driver" to "#34C759",                // Bolt — Green

        // Other
        "com.theporter.android.driverapp" to "#2E5BFF", // Porter — Blue
        "com.rapido.rider" to "#FFCC00",                // Rapido — Yellow
        "in.shadowfax.gandalf" to "#FF6B35",            // Shadowfax — Orange
        "com.gojek.partner" to "#00AA13",               // Gojek — Green
        "com.delhivery.delhiverypartner" to "#1A73E8",  // Delhivery — Blue
        "com.ecomexpress.oneBoarding" to "#FF6B00",     // Ecom Express — Orange
        "com.xpressbees.unified_new_arch" to "#E91E63", // Xpressbees — Pink
        "in.letstransport.supply" to "#00BCD4",         // LetsTransport — Cyan
        "net.blowhorn.driverapp" to "#FF5722",          // Blowhorn — Deep Orange
        "com.driveu.partner" to "#FF9800",              // DriveU — Orange
        "app.yulu.android.partner" to "#26A69A",        // Yulu — Teal

        // Legacy packages
        "in.swiggy.partner" to "#FC8019",               // Swiggy alt — Orange
        "com.zomato.deliverypartner" to "#E23744",      // Zomato alt — Red
        "com.amazon.flex" to "#FF9900",                 // Amazon Flex old — Orange
        "com.flipkart.logistics" to "#2874F0",          // Flipkart old — Blue
        "com.convoy.driverapp"                           to "#1A1A1A",      // Convoy Driver
        "com.blackbuck.driver"                           to "#FFC107",      // BlackBuck Driver
    )

    // Time constants
    const val SYNC_INTERVAL_MINUTES = 15L
    const val MAX_NOTIFICATION_AGE_DAYS = 30

    // Legal compliance: NotiFetch does NOT access delivery platform APIs,
    // store credentials, or use OAuth tokens. It only reads notification
    // content that the user can already see on their device.
    // Platform display names use real brand names under nominative fair use.
    // Users can customize any display name through the app settings.
    const val LEGAL_DISCLAIMER = "NotiFetch reads notifications you can already see. We never access platform APIs or store credentials. Platform names are customizable by the user."

    // ═══════════════════════════════════════════════════════════════════════
    // CUSTOMER App Packages — for the Customer mode
    // These are the customer-facing apps (not driver/partner apps)
    // Last verified: June 2026
    // ═══════════════════════════════════════════════════════════════════════

    val CUSTOMER_PACKAGES = mapOf(
        // ── Food Delivery (Customer Apps) ─────────────────────────────────
        "in.swiggy.android" to "Swiggy",                           // Swiggy Customer (India)
        "com.application.zomato" to "Zomato",                      // Zomato Customer (India)
        "com.ubercab.eats" to "Uber Eats",                         // Uber Eats Customer (Global)
        "com.doordash.consumerapp" to "DoorDash",                  // DoorDash Customer (US/CA/AU/JP)
        "com.grubhub.android" to "Grubhub",                        // Grubhub Customer (US)
        "com.deliveroo.orderapp" to "Deliveroo",                    // Deliveroo Customer (UK/EU)
        "com.justeat.app.uk" to "Just Eat",                        // Just Eat Customer UK
        "com.takeaway.android" to "Takeaway",                      // Takeaway.com Customer (EU)
        "com.lieferando.android" to "Lieferando",                  // Lieferando Customer (DE)
        "com.foodpanda.android" to "Foodpanda",                    // Foodpanda Customer (Asia/EMEA)
        "br.com.ifood" to "iFood",                                 // iFood Customer (Brazil)
        "com.rappi.app" to "Rappi",                                // Rappi Customer (LATAM)
        "com.wolt.android" to "Wolt",                              // Wolt Customer (EU/Nordics/Asia)
        "com.glovoapp.android" to "Glovo",                         // Glovo Customer (EMEA/LATAM)
        "com.talabat.android" to "Talabat",                        // Talabat Customer (MENA)
        "com.menulog.android" to "Menulog",                        // Menulog Customer (AU/NZ)

        // ── Grocery (Customer Apps) ────────────────────────────────────────
        "com.instacart.app" to "Instacart",                        // Instacart Customer (US/CA)
        "app.blinkit" to "Blinkit",                                // Blinkit Customer (India)
        "com.bigbasket.mobileapp" to "BigBasket",                  // BigBasket Customer (India)
        "com.zepto.app" to "Zepto",                                // Zepto Customer (India)
        "com.shipt.android" to "Shipt",                            // Shipt Customer (US)
        "au.com.woolworths.android" to "Woolworths",               // Woolworths Customer (AU)

        // ── E-Commerce (Customer Apps) ────────────────────────────────────
        "in.amazon.mShop.android.shopping" to "Amazon",            // Amazon Shopping (India)
        "com.amazon.mShop.android.shopping" to "Amazon",           // Amazon Shopping (Global)
        "com.flipkart.android" to "Flipkart",                      // Flipkart Customer (India)
        "com.myntra.android" to "Myntra",                          // Myntra Customer (India)
        "com.meesho.app" to "Meesho",                              // Meesho Customer (India)
        "in.swiggy.android.instamart" to "Instamart",              // Swiggy Instamart (India)

        // ── Ride & Transport (Customer Apps) ──────────────────────────────
        "com.ubercab" to "Uber",                                   // Uber Customer (Global)
        "com.olacabs.customer" to "Ola",                           // Ola Customer (India)
        "com.grabtaxi.passenger" to "Grab",                        // Grab Customer (SE Asia)
        "com.careem.acma" to "Careem",                             // Careem Customer (MENA)
        "com.didiglobal.passenger" to "DiDi",                      // DiDi Customer (AU/NZ/LATAM)
        "ee.mtakso.client" to "Bolt",                              // Bolt Customer (EU/Africa)
        "com.lyft.android" to "Lyft",                              // Lyft Customer (US/CA)

        // ── Package Tracking (Customer Apps) ──────────────────────────────
        "com.delhivery.track" to "Delhivery",                      // Delhivery Customer (India)
        "com.xpressbees.track" to "Xpressbees",                    // Xpressbees Customer (India)
        "com.dunzo.user" to "Dunzo",                               // Dunzo Customer (India)

        // ── Food (China) — Customer Apps ──────────────────────────────────
        "com.sankuai.meituan"                                    to "Meituan",                     // Meituan (China)
        "me.ele"                                                 to "Ele.me",                      // Ele.me (China)

        // ── Grocery (EU) — Customer Apps ──────────────────────────────────
        "com.gorillasapp"                                        to "Gorillas",                    // Gorillas (EU/UK — acquired by Getir)
        "com.getir"                                              to "Getir",                       // Getir (EU/UK/MENA)

        // ── Package & Parcel — Customer Apps ───────────────────────────────
        "com.fedex.android.apps.fedexmobile"                     to "FedEx",                       // FedEx (Global)
        "com.dhl.parcel.uk"                                      to "DHL",                         // DHL (Global)
        "com.sf.activity"                                        to "SF Express",                  // SF Express (China)

        // ── Medical / Pharmacy — Customer Apps ────────────────────────────
        "com.capsule.pharmacy"                                   to "Capsule",                     // Capsule (US)
        "com.nowrx.android"                                      to "NowRx",                       // NowRx (US)
        "com.indpro.pharmeasy"                                   to "PharmEasy",                   // PharmEasy (India)
        "com.netmeds.android"                                    to "Netmeds",                     // Netmeds (India)
        "com.aranoah.healthkart.plus"                            to "1mg",                         // 1mg (India)

        // ── Alcohol — Customer Apps ────────────────────────────────────────
        "com.drizly.drizly"                                      to "Drizly",                      // Drizly (US — acquired by Uber)
        "com.minibar.android"                                    to "Minibar",                     // Minibar (US)
        "com.saucey.android"                                     to "Saucey",                      // Saucey (US)
        "com.hipbar.android"                                     to "HipBar",                      // HipBar (India)

        // ── Flowers — Customer Apps ────────────────────────────────────────
        "com.bloomnation.bloomnation"                            to "BloomNation",                 // BloomNation (US)
        "com.ftd.app.bloom"                                      to "1-800-Flowers",               // 1-800-Flowers (US)
        "com.interflora.android"                                 to "Interflora",                  // Interflora (Europe/Oceania)
        "com.fnp.android"                                        to "Ferns N Petals",              // Ferns N Petals (India)

        // ── Laundry — Customer Apps ────────────────────────────────────────
        "com.rinse.app"                                          to "Rinse",                       // Rinse (US)
        "com.flycleaners.android"                                to "FlyCleaners",                 // FlyCleaners (US)
        "com.laundrokart.app"                                    to "LaundroKart",                 // LaundroKart (India)
        "com.presso.app"                                         to "Presso",                      // Presso (SEA/MENA)

        // ── Pet Supplies — Customer Apps ───────────────────────────────────
        "com.chewy.android"                                      to "Chewy",                       // Chewy (US)
        "com.petsathome.android"                                 to "Pets at Home",                // Pets at Home (UK)
        "com.hutf.android"                                       to "Heads Up For Tails",          // Heads Up For Tails (India)

        // ── Furniture — Customer Apps ──────────────────────────────────────
        "com.wayfair.wayfair"                                    to "Wayfair",                     // Wayfair (US/Europe)
        "com.castlery.app"                                       to "Castlery",                    // Castlery (SEA/Oceania)
        "com.urbanladder.app"                                    to "Urban Ladder",                // Urban Ladder (India)

        // ── Bicycle Courier ────────────────────────────────────────────────
        "com.couriersplease.app"                                 to "Courier Please",              // Courier Please (Australia)

        // ── Document ───────────────────────────────────────────────────────
        "com.dex.android"                                        to "Dex",                         // Dex (US)
        "com.couriire.app"                                       to "Couriire",                    // Couriire (India)

        // ── Same-Day (China) ───────────────────────────────────────────────
        "com.cainiao.wireless.dumps"                             to "Cainiao",                     // Cainiao (China)

        // ── White-Glove ────────────────────────────────────────────────────
        "com.xpo.logistics"                                      to "XPO Logistics",               // XPO Logistics (US/Europe)
        "com.jingdong.app.mall"                                  to "JD Logistics",                // JD Logistics (China)

        // ── Cannabis ───────────────────────────────────────────────────────
        "com.eaze.android"                                       to "Eaze",                        // Eaze (US)
        "com.dutchie.android"                                    to "Dutchie",                     // Dutchie (US)

        // ── QSR (Quick Service Restaurants) — Customer Apps ────────────────
        "com.dominos"                                            to "Domino's India",              // Domino's India (India)
        "com.dominos.android"                                    to "Domino's US",                 // Domino's US (US)
        "com.pizzahut.android"                                   to "Pizza Hut India",             // Pizza Hut India (India)
        "com.pizzahut.android.global"                            to "Pizza Hut",                   // Pizza Hut (Global)
        "com.papajohns.android"                                  to "Papa John's",                 // Papa John's (US/Global)
        "com.mcdonalds.mcdeliveryindia"                          to "McDelivery India",            // McDelivery India (India)
        "com.mcdonalds.app"                                      to "McDonald's",                  // McDonald's (Global)
        "com.bkindia"                                            to "Burger King India",           // Burger King India (India)
        "com.bk"                                                 to "Burger King",                 // Burger King (Global)
        "com.wendys.nutritiontool"                               to "Wendy's",                     // Wendy's (US)
        "com.fiveguys.android"                                   to "Five Guys",                   // Five Guys (US/Europe)
        "com.kfc.india"                                          to "KFC India",                   // KFC India (India)
        "com.kfc.android"                                        to "KFC",                         // KFC (Global)
        "com.chickfila.app"                                      to "Chick-fil-A",                 // Chick-fil-A (US)
        "com.popeyes.android"                                    to "Popeyes",                     // Popeyes (US/Global)
        "com.chipotle.android"                                   to "Chipotle",                    // Chipotle (US/Europe)
        "com.tacobell"                                           to "Taco Bell",                   // Taco Bell (US/Europe/LATAM)
        "com.subway.subwaymobile"                                to "Subway",                      // Subway (Global)
        "com.panera.bread"                                       to "Panera Bread",                // Panera Bread (US)
        "com.starbucks.mobilecard"                               to "Starbucks",                   // Starbucks (Global)
        "com.starbucks.in"                                       to "Starbucks India",             // Starbucks India (India)
        "com.dunkinbrands.dunkindonuts"                          to "Dunkin'",                     // Dunkin' (US)
        "com.timhortons.app"                                     to "Tim Hortons",                 // Tim Hortons (US/Canada)
        "com.eatsure"                                            to "EatSure",                     // EatSure (India)
        "com.box8.app"                                           to "Box8",                        // Box8 (India)
        "com.faasos.behrouz"                                     to "Behrouz Biryani",             // Behrouz Biryani (India)
        "com.chaayos"                                            to "Chaayos",                     // Chaayos (India)
        "com.wowmomo"                                            to "Wow! Momo",                   // Wow! Momo (India)
        "com.faasos"                                             to "Faasos",                      // Faasos (India)
        "com.faasos.ovenstory"                                   to "Oven Story Pizza",            // Oven Story Pizza (India)
        "com.faasos.mandarinfox"                                 to "Mandarin Fox",                // Mandarin Fox (India)
        "com.faasos.bowlcompany"                                 to "The Bowl Company",            // The Bowl Company (India)
        "com.lenotre.android"                                    to "LENOTRE Dessert",              // LENOTRE Dessert (MENA)
    )

    // Combined map for the notification listener to use
    val ALL_PACKAGES: Map<String, String>
        get() = PARTNER_PACKAGES + CUSTOMER_PACKAGES

    // Customer platform colors
    val CUSTOMER_PLATFORM_COLORS = mapOf(
        // Food Delivery
        "in.swiggy.android" to "#FC8019",              // Swiggy — Orange
        "com.application.zomato" to "#E23744",         // Zomato — Red
        "com.ubercab.eats" to "#05944F",               // Uber Eats — Green
        "com.doordash.consumerapp" to "#FF3008",       // DoorDash — Red
        "com.grubhub.android" to "#F7871D",            // Grubhub — Orange
        "com.deliveroo.orderapp" to "#00CCBC",         // Deliveroo — Teal
        "com.justeat.app.uk" to "#FF8000",             // Just Eat — Orange
        "com.takeaway.android" to "#FF6D00",           // Takeaway — Orange
        "com.lieferando.android" to "#FF6D00",         // Lieferando — Orange
        "com.foodpanda.android" to "#D21F3C",          // Foodpanda — Pink/Red
        "br.com.ifood" to "#EA1D2C",                   // iFood — Red
        "com.rappi.app" to "#FF4444",                  // Rappi — Orange/Red
        "com.wolt.android" to "#00C7E6",               // Wolt — Cyan
        "com.glovoapp.android" to "#F5C518",           // Glovo — Yellow
        "com.talabat.android" to "#FF5A00",            // Talabat — Orange
        "com.menulog.android" to "#FF8000",            // Menulog — Orange

        // Grocery
        "com.instacart.app" to "#43B02A",              // Instacart — Green
        "app.blinkit" to "#F8E71C",                    // Blinkit — Yellow
        "com.bigbasket.mobileapp" to "#84C225",        // BigBasket — Green
        "com.zepto.app" to "#8B008B",                  // Zepto — Purple
        "com.shipt.android" to "#33A198",              // Shipt — Teal
        "au.com.woolworths.android" to "#009444",      // Woolworths — Green

        // E-Commerce
        "in.amazon.mShop.android.shopping" to "#FF9900", // Amazon — Orange
        "com.amazon.mShop.android.shopping" to "#FF9900",// Amazon — Orange
        "com.flipkart.android" to "#2874F0",             // Flipkart — Blue
        "com.myntra.android" to "#FF3F6C",             // Myntra — Pink
        "com.meesho.app" to "#570A57",                 // Meesho — Purple
        "in.swiggy.android.instamart" to "#FC8019",    // Instamart — Orange

        // Ride
        "com.ubercab" to "#000000",                    // Uber — Black
        "com.olacabs.customer" to "#36B37E",           // Ola — Green
        "com.grabtaxi.passenger" to "#00B14F",         // Grab — Green
        "com.careem.acma" to "#4CB050",                // Careem — Green
        "com.didiglobal.passenger" to "#FF6B00",       // DiDi — Orange
        "ee.mtakso.client" to "#34C759",               // Bolt — Green
        "com.lyft.android" to "#FF00BF",               // Lyft — Pink

        // Package Tracking
        "com.delhivery.track" to "#1A73E8",            // Delhivery — Blue
        "com.xpressbees.track" to "#E91E63",           // Xpressbees — Pink
        "com.dunzo.user" to "#00D290",                 // Dunzo — Green
        "com.sankuai.meituan"                            to "#FFD100",      // Meituan
        "me.ele"                                         to "#0097FF",      // Ele.me
        "com.gorillasapp"                                to "#FFD100",      // Gorillas
        "com.getir"                                      to "#5D00B7",      // Getir
        "com.fedex.android.apps.fedexmobile"             to "#4D148C",      // FedEx
        "com.dhl.parcel.uk"                              to "#FFCC00",      // DHL
        "com.sf.activity"                                to "#DC0019",      // SF Express
        "com.capsule.pharmacy"                           to "#000000",      // Capsule
        "com.nowrx.android"                              to "#00A3E0",      // NowRx
        "com.indpro.pharmeasy"                           to "#3BB871",      // PharmEasy
        "com.netmeds.android"                            to "#E61E2A",      // Netmeds
        "com.aranoah.healthkart.plus"                    to "#FF6F00",      // 1mg
        "com.drizly.drizly"                              to "#FF4A1C",      // Drizly
        "com.minibar.android"                            to "#1A1A1A",      // Minibar
        "com.saucey.android"                             to "#FF6B35",      // Saucey
        "com.hipbar.android"                             to "#FF1744",      // HipBar
        "com.bloomnation.bloomnation"                    to "#E8336A",      // BloomNation
        "com.ftd.app.bloom"                              to "#000000",      // 1-800-Flowers
        "com.interflora.android"                         to "#E6007E",      // Interflora
        "com.fnp.android"                                to "#E6007E",      // Ferns N Petals
        "com.rinse.app"                                  to "#00B8A9",      // Rinse
        "com.flycleaners.android"                        to "#1E88E5",      // FlyCleaners
        "com.laundrokart.app"                            to "#00BCD4",      // LaundroKart
        "com.presso.app"                                 to "#212121",      // Presso
        "com.chewy.android"                              to "#1B6EC2",      // Chewy
        "com.petsathome.android"                         to "#00A651",      // Pets at Home
        "com.hutf.android"                               to "#FF6F00",      // Heads Up For Tails
        "com.wayfair.wayfair"                            to "#7B1899",      // Wayfair
        "com.castlery.app"                               to "#1A1A1A",      // Castlery
        "com.urbanladder.app"                            to "#FF6F00",      // Urban Ladder
        "com.couriersplease.app"                         to "#FF6B00",      // Courier Please
        "com.dex.android"                                to "#1E88E5",      // Dex
        "com.couriire.app"                               to "#212121",      // Couriire
        "com.cainiao.wireless.dumps"                     to "#FF6A00",      // Cainiao
        "com.xpo.logistics"                              to "#E61E2A",      // XPO Logistics
        "com.jingdong.app.mall"                          to "#E1251B",      // JD Logistics
        "com.eaze.android"                               to "#00C853",      // Eaze
        "com.dutchie.android"                            to "#00C853",      // Dutchie
        "com.dominos"                                    to "#006491",      // Domino's India
        "com.dominos.android"                            to "#006491",      // Domino's US
        "com.pizzahut.android"                           to "#EE3124",      // Pizza Hut India
        "com.pizzahut.android.global"                    to "#EE3124",      // Pizza Hut
        "com.papajohns.android"                          to "#008515",      // Papa John's
        "com.mcdonalds.mcdeliveryindia"                  to "#FFC72C",      // McDelivery India
        "com.mcdonalds.app"                              to "#FFC72C",      // McDonald's
        "com.bkindia"                                    to "#D62300",      // Burger King India
        "com.bk"                                         to "#D62300",      // Burger King
        "com.wendys.nutritiontool"                       to "#E31837",      // Wendy's
        "com.fiveguys.android"                           to "#E94B3C",      // Five Guys
        "com.kfc.india"                                  to "#F40009",      // KFC India
        "com.kfc.android"                                to "#F40009",      // KFC
        "com.chickfila.app"                              to "#DD0031",      // Chick-fil-A
        "com.popeyes.android"                            to "#FF7D00",      // Popeyes
        "com.chipotle.android"                           to "#451400",      // Chipotle
        "com.tacobell"                                   to "#702083",      // Taco Bell
        "com.subway.subwaymobile"                        to "#008C15",      // Subway
        "com.panera.bread"                               to "#1B998B",      // Panera Bread
        "com.starbucks.mobilecard"                       to "#00704A",      // Starbucks
        "com.starbucks.in"                               to "#00704A",      // Starbucks India
        "com.dunkinbrands.dunkindonuts"                  to "#FF671F",      // Dunkin'
        "com.timhortons.app"                             to "#C8102E",      // Tim Hortons
        "com.eatsure"                                    to "#FF6F00",      // EatSure
        "com.box8.app"                                   to "#FF6F00",      // Box8
        "com.faasos.behrouz"                             to "#1A1A1A",      // Behrouz Biryani
        "com.chaayos"                                    to "#00A651",      // Chaayos
        "com.wowmomo"                                    to "#FF6F00",      // Wow! Momo
        "com.faasos"                                     to "#FF6F00",      // Faasos
        "com.faasos.ovenstory"                           to "#D0021B",      // Oven Story Pizza
        "com.faasos.mandarinfox"                         to "#FF6F00",      // Mandarin Fox
        "com.faasos.bowlcompany"                         to "#FF6F00",      // The Bowl Company
        "com.lenotre.android"                            to "#1A1A1A",      // LENôTRE Dessert
    )

    // Combined platform colors
    val ALL_PLATFORM_COLORS: Map<String, String>
        get() = PLATFORM_COLORS + CUSTOMER_PLATFORM_COLORS

    // Customer source identifiers
    val CUSTOMER_PLATFORM_SOURCES: Map<String, String> = CUSTOMER_PACKAGES.map { (pkg, _) ->
        pkg to "cust_${pkg.replace(".", "_").replace("com_", "").replace("in_", "").replace("br_com_", "").replace("global_", "").replace("app_", "").take(35)}"
    }.toMap()

    // Combined platform sources
    val ALL_PLATFORM_SOURCES: Map<String, String>
        get() = PLATFORM_SOURCES + CUSTOMER_PLATFORM_SOURCES

    // Determine if a package is rider or customer mode
    fun getUserModeForPackage(packageName: String): UserMode? {
        return when {
            PARTNER_PACKAGES.containsKey(packageName) -> UserMode.RIDER
            CUSTOMER_PACKAGES.containsKey(packageName) -> UserMode.CUSTOMER
            else -> null
        }
    }
}

enum class UserMode(val label: String) {
    RIDER("Rider"),
    CUSTOMER("Customer")
}

enum class PlatformSource(val displayName: String, val packageName: String, val sourceId: String, val category: String) {
    // Food Delivery
    UBER_DRIVER("Uber Driver", "com.ubercab.driver", "uber_driver", "food"),
    DOORDASH("DoorDash Dasher", "com.doordash.driverapp", "doordash_dasher", "food"),
    GRUBHUB("Grubhub Driver", "com.grubhub.driver", "grubhub_driver", "food"),
    DELIVEROO("Deliveroo Rider", "com.deliveroo.driverapp", "deliveroo_rider", "food"),
    JUSTEAT("Just Eat Courier", "com.justeat.courier.uk", "justeat_courier", "food"),
    TAKEAWAY("Takeaway Courier", "com.takeaway.delivered4all", "takeaway_courier", "food"),
    LIEFERANDO("Lieferando Courier", "com.lieferando.courier", "lieferando_courier", "food"),
    FOODPANDA("Foodpanda Rider", "com.logistics.rider.foodpanda", "foodpanda_rider", "food"),
    SWIGGY("Swiggy Delivery", "in.swiggy.deliveryapp", "swiggy_delivery", "food"),
    ZOMATO("Zomato Delivery", "com.zomato.delivery", "zomato_delivery", "food"),
    IFOOD("iFood Entregador", "br.com.ifood.driver.app", "ifood_entregador", "food"),
    RAPPI("Rappi Repartidor", "com.rappi.storekeeper", "rappi_repartidor", "food"),
    WOLT("Wolt Courier", "com.wolt.courierapp", "wolt_courier", "food"),
    GLOVO("Glovo Courier", "com.logistics.rider.glovo", "glovo_courier", "food"),
    DEMAECAN("Demae-can Driver", "com.demaecan.DemaecanDriver", "demaecan_driver", "food"),
    TALABAT("Talabat Rider", "com.logistics.rider.talabat", "talabat_rider", "food"),
    MENULOG("Menulog Courier", "com.menulog.courier", "menulog_courier", "food"),
    KEETA("Keeta Rider", "com.sankuai.sailor.courier", "keeta_rider", "food"),

    // Grocery
    INSTACART("Instacart Shopper", "com.instacart.shopper", "instacart_shopper", "grocery"),
    GOPUFF("Gopuff Driver", "com.gopuff.godrive2.live", "gopuff_driver", "grocery"),
    BLINKIT("Blinkit Delivery", "app.blinkit.onboarding", "blinkit_partner", "grocery"),
    BIGBASKET("BigBasket Delivery", "com.bigbasket.dapp.activity", "bigbasket_partner", "grocery"),
    MERCADO("Mercado Envios", "com.mercadoenvios.crowdsourcing", "mercado_envios", "grocery"),
    WOOLWORTHS("WooliesGO", "au.com.woolworths.android.driver", "woolworths_driver", "grocery"),
    ZEPTO("Zepto Delivery", "com.zepto.rider", "zepto_partner", "grocery"),
    FLINK("Flink Rider", "com.flink.workforce", "flink_rider", "grocery"),
    SHIPT("Shipt Shopper", "com.shipt.shopper", "shipt_shopper", "grocery"),

    // Package
    AMAZON_FLEX("Amazon Flex", "com.amazon.flex.rabbit", "amazon_flex", "package"),
    UPS("UPS Driver", "com.ups.genesispd", "ups_driver", "package"),
    DUNZO("Dunzo Partner", "com.dunzo.partner", "dunzo_partner", "package"),
    LALAMOVE("Lalamove Driver", "com.lalamove.global.driver.sea", "lalamove_driver", "package"),
    BORZO("Borzo Courier", "global.dostavista.courier", "borzo_courier", "package"),

    // Courier
    POSTMATES("Postmates Fleet", "com.postmates.android.courier", "postmates_fleet", "courier"),
    ROADIE("Roadie Driver", "com.roadie.drive.android.app", "roadie_driver", "courier"),
    STUART("Stuart Courier", "com.stuart.courier", "stuart_courier", "courier"),
    GOGO("GoGo Xpress", "com.quadx.riderapp", "gogo_rider", "courier"),

    // Last-Mile
    AMAZON_RELAY("Amazon Relay", "com.amazon.relay", "amazon_relay", "last-mile"),
    EKART("Ekart Delivery", "com.ekartkiranaonboarding", "ekart_partner", "last-mile"),
    EKART_FIELD("Ekart Field X", "com.ekart.logistics.app", "ekart_field", "last-mile"),
    JNE("JNE Kurir", "id.my.irsyadf.jobdriver", "jne_kurir", "last-mile"),
    ARAMEX("Aramex Courier", "com.aramex.ecourier", "aramex_courier", "last-mile"),
    NINJA_VAN("Ninja Van Driver", "co.ninjavan.swiftninja_global", "ninja_van_driver", "last-mile"),

    // Ride
    LYFT("Lyft Driver", "com.lyft.android.driver", "lyft_driver", "ride"),
    OLA("Ola Driver", "com.olacabs.oladriver", "ola_driver", "ride"),
    GRAB("Grab Driver", "com.grabtaxi.driver2", "grab_driver", "ride"),
    CAREEM("Careem Captain", "com.careem.adma", "careem_captain", "ride"),
    DIDI("DiDi Driver", "com.didiglobal.driver", "didi_driver", "ride"),
    BOLT("Bolt Driver", "ee.mtakso.driver", "bolt_driver", "ride"),

    // India-specific
    PORTER("Porter Driver", "com.theporter.android.driverapp", "porter_partner", "package"),
    RAPIDO("Rapido Captain", "com.rapido.rider", "rapido_captain", "ride"),
    SHADOWFAX("Shadowfax Delivery", "in.shadowfax.gandalf", "shadowfax_partner", "last-mile"),
    DELHIVERY("Delhivery Partner", "com.delhivery.delhiverypartner", "delhivery_partner", "last-mile"),
    ECOM_EXPRESS("Ecom Express", "com.ecomexpress.oneBoarding", "ecom_express", "last-mile"),
    XPRESSBEES("Xpressbees", "com.xpressbees.unified_new_arch", "xpressbees", "last-mile"),
    LETSTRANSPORT("LetsTransport", "in.letstransport.supply", "letstransport_partner", "courier"),
    BLOWHORN("Blowhorn Driver", "net.blowhorn.driverapp", "blowhorn_driver", "courier"),
    DRIVEU("DriveU Partner", "com.driveu.partner", "driveu_partner", "ride"),
    YULU("Yulu Partner", "app.yulu.android.partner", "yulu_partner", "ride"),
    GOJEK("Gojek Driver", "com.gojek.partner", "gojek_driver", "food"),
    MEITUAN("Meituan", "com.sankuai.meituan", "meituan", "food"),
    ELE_ME("Ele.me", "me.ele", "ele_me", "food"),
    GORILLAS("Gorillas", "com.gorillasapp", "gorillas", "grocery"),
    GETIR("Getir", "com.getir", "getir", "grocery"),
    FEDEX("FedEx", "com.fedex.android.apps.fedexmobile", "fedex", "package"),
    DHL("DHL", "com.dhl.parcel.uk", "dhl", "package"),
    SF_EXPRESS("SF Express", "com.sf.activity", "sf_express", "last-mile"),
    CAPSULE("Capsule", "com.capsule.pharmacy", "capsule", "medical"),
    NOWRX("NowRx", "com.nowrx.android", "nowrx", "medical"),
    PHARMEASY("PharmEasy", "com.indpro.pharmeasy", "pharmeasy", "medical"),
    NETMEDS("Netmeds", "com.netmeds.android", "netmeds", "medical"),
    ONE_MG("1mg", "com.aranoah.healthkart.plus", "1mg", "medical"),
    DRIZLY("Drizly", "com.drizly.drizly", "drizly", "alcohol"),
    MINIBAR("Minibar", "com.minibar.android", "minibar", "alcohol"),
    SAUCEY("Saucey", "com.saucey.android", "saucey", "alcohol"),
    HIPBAR("HipBar", "com.hipbar.android", "hipbar", "alcohol"),
    BLOOMNATION("BloomNation", "com.bloomnation.bloomnation", "bloomnation", "flower"),
    FLOWERS_1800("1-800-Flowers", "com.ftd.app.bloom", "1800_flowers", "flower"),
    INTERFLORA("Interflora", "com.interflora.android", "interflora", "flower"),
    FERNS_PETALS("Ferns N Petals", "com.fnp.android", "ferns_petals", "flower"),
    RINSE("Rinse", "com.rinse.app", "rinse", "laundry"),
    FLYCLEANERS("FlyCleaners", "com.flycleaners.android", "flycleaners", "laundry"),
    LAUNDROKART("LaundroKart", "com.laundrokart.app", "laundrokart", "laundry"),
    PRESSO("Presso", "com.presso.app", "presso", "laundry"),
    CHEWY("Chewy", "com.chewy.android", "chewy", "pet-supplies"),
    PETS_AT_HOME("Pets at Home", "com.petsathome.android", "pets_at_home", "pet-supplies"),
    HEADS_UP_FOR_TAILS("Heads Up For Tails", "com.hutf.android", "heads_up_for_tails", "pet-supplies"),
    WAYFAIR_DELIVERY("Wayfair", "com.wayfair.wayfair", "wayfair_delivery", "furniture"),
    CASTLERY("Castlery", "com.castlery.app", "castlery", "furniture"),
    URBAN_LADDER("Urban Ladder", "com.urbanladder.app", "urban_ladder", "furniture"),
    COURIER_PLEASE("Courier Please", "com.couriersplease.app", "courier_please", "bicycle-courier"),
    DEX("Dex", "com.dex.android", "dex", "document"),
    COURIIRE("Couriire", "com.couriire.app", "couriire", "document"),
    CAINIAO("Cainiao", "com.cainiao.wireless.dumps", "cainiao", "same-day"),
    XPO("XPO Logistics", "com.xpo.logistics", "xpo", "white-glove"),
    JD_LOGISTICS("JD Logistics", "com.jingdong.app.mall", "jd_logistics", "white-glove"),
    EAZE("Eaze", "com.eaze.android", "eaze", "cannabis"),
    DUTCHIE("Dutchie", "com.dutchie.android", "dutchie", "cannabis"),
    CONVOY("Convoy Driver", "com.convoy.driverapp", "convoy", "freight"),
    BLACKBUCK("BlackBuck Driver", "com.blackbuck.driver", "blackbuck", "freight"),
    DOMINOS_INDIA("Domino's India", "com.dominos", "dominos_india", "qsr"),
    DOMINOS_US("Domino's US", "com.dominos.android", "dominos_us", "qsr"),
    PIZZA_HUT_INDIA("Pizza Hut India", "com.pizzahut.android", "pizza_hut_india", "qsr"),
    PIZZA_HUT("Pizza Hut", "com.pizzahut.android.global", "pizza_hut", "qsr"),
    PAPA_JOHNS("Papa John's", "com.papajohns.android", "papa_johns", "qsr"),
    MCDELIVERY_INDIA("McDelivery India", "com.mcdonalds.mcdeliveryindia", "mcdelivery_india", "qsr"),
    MCDONALDS("McDonald's", "com.mcdonalds.app", "mcdonalds", "qsr"),
    BURGER_KING_INDIA("Burger King India", "com.bkindia", "burger_king_india", "qsr"),
    BURGER_KING("Burger King", "com.bk", "burger_king", "qsr"),
    WENDYS("Wendy's", "com.wendys.nutritiontool", "wendys", "qsr"),
    FIVE_GUYS("Five Guys", "com.fiveguys.android", "five_guys", "qsr"),
    KFC_INDIA("KFC India", "com.kfc.india", "kfc_india", "qsr"),
    KFC("KFC", "com.kfc.android", "kfc", "qsr"),
    CHICK_FIL_A("Chick-fil-A", "com.chickfila.app", "chick_fil_a", "qsr"),
    POPEYES("Popeyes", "com.popeyes.android", "popeyes", "qsr"),
    CHIPOTLE("Chipotle", "com.chipotle.android", "chipotle", "qsr"),
    TACO_BELL("Taco Bell", "com.tacobell", "taco_bell", "qsr"),
    SUBWAY("Subway", "com.subway.subwaymobile", "subway", "qsr"),
    PANERA("Panera Bread", "com.panera.bread", "panera", "qsr"),
    STARBUCKS("Starbucks", "com.starbucks.mobilecard", "starbucks", "qsr"),
    STARBUCKS_INDIA("Starbucks India", "com.starbucks.in", "starbucks_india", "qsr"),
    DUNKIN("Dunkin'", "com.dunkinbrands.dunkindonuts", "dunkin", "qsr"),
    TIM_HORTONS("Tim Hortons", "com.timhortons.app", "tim_hortons", "qsr"),
    EATSURE("EatSure", "com.eatsure", "eatsure", "qsr"),
    BOX8("Box8", "com.box8.app", "box8", "qsr"),
    BEHROUZ("Behrouz Biryani", "com.faasos.behrouz", "behrouz", "qsr"),
    CHAAYOS("Chaayos", "com.chaayos", "chaayos", "qsr"),
    WOW_MOMO("Wow! Momo", "com.wowmomo", "wow_momo", "qsr"),
    FAASOS("Faasos", "com.faasos", "faasos", "qsr"),
    OVEN_STORY("Oven Story Pizza", "com.faasos.ovenstory", "oven_story", "qsr"),
    MANDARIN_FOX("Mandarin Fox", "com.faasos.mandarinfox", "mandarin_fox", "qsr"),
    THE_BOWL_COMPANY("The Bowl Company", "com.faasos.bowlcompany", "the_bowl_company", "qsr"),
    LENOTRE_DESSERT("LENOTRE Dessert", "com.lenotre.android", "lenotre_dessert", "qsr"),
}
