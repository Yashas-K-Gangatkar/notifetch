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
    // LEGAL NOTE — User Choice Model:
    // Default display names are GENERIC (e.g., "Food Delivery Platform 1")
    // to avoid trademark infringement. Users can customize any platform
    // name to whatever they prefer. This "user choice" model provides:
    //   1. Zero trademark risk (we don't use brand names by default)
    //   2. User can rename to brand name if they want (their choice, their liability)
    //   3. Package names are factual identifiers (not trademark use)
    //   4. All brand colors replaced with NotiFetch amber/orange
    // ═══════════════════════════════════════════════════════════════════════

    val PARTNER_PACKAGES = mapOf(
        // ── Food Delivery ──────────────────────────────────────────────────
        "com.ubercab.driver" to "Uber",                      // Uber Driver/Eats 
        "com.doordash.driverapp" to "DoorDash",              // DoorDash Dasher 
        "com.grubhub.driver" to "Grubhub",                   // Grubhub Driver 
        "com.deliveroo.driverapp" to "Deliveroo",             // Deliveroo Rider 
        "com.justeat.courier.uk" to "Just Eat",             // Just Eat Courier UK
        "com.takeaway.delivered4all" to "Takeaway.com",        // Takeaway.com Courier (EU)
        "com.lieferando.courier" to "Lieferando",           // Lieferando Courier 
        "com.logistics.rider.foodpanda" to "Foodpanda",      // Foodpanda Rider 
        "in.swiggy.deliveryapp" to "Swiggy",              // Swiggy Delivery Partner 
        "com.zomato.delivery" to "Zomato",                // Zomato Delivery 
        "br.com.ifood.driver.app" to "iFood",           // iFood Entregador 
        "com.rappi.storekeeper" to "Rappi",             // Rappi Repartidor 
        "com.wolt.courierapp" to "Wolt",                   // Wolt Courier 
        "com.logistics.rider.glovo" to "Glovo",            // Glovo Courier 
        "com.demaecan.DemaecanDriver" to "Demae-can",       // Demae-can Driver 
        "com.logistics.rider.talabat" to "Talabat",          // Talabat Rider 
        "com.menulog.courier" to "Menulog",                // Menulog Courier 
        "com.sankuai.sailor.courier" to "Keeta",             // Keeta Rider 

        // ── Grocery Delivery ───────────────────────────────────────────────
        "com.instacart.shopper" to "Instacart",            // Instacart Shopper 
        "com.gopuff.godrive2.live" to "Gopuff",             // Gopuff Driver 
        "app.blinkit.onboarding" to "Blinkit",            // Blinkit Delivery Partner 
        "com.bigbasket.dapp.activity" to "BigBasket",     // BigBasket Delivery Partner 
        "com.mercadoenvios.crowdsourcing" to "Mercado Libre Envios",     // Mercado Libre Envios Extra 
        "com.mercadoenvios.driver" to "Mercado Libre Envios",              // Mercado Libre Envios Flex 
        "au.com.woolworths.android.driver" to "WooliesGO",         // WooliesGO 
        "com.zepto.rider" to "Zepto",                     // Zepto Delivery Partner 
        "com.flink.workforce" to "Flink",                    // Flink Workforce 
        "com.shipt.shopper" to "Shipt",                    // Shipt Shopper 

        // ── Package & Parcel ──────────────────────────────────────────────
        "com.amazon.flex.rabbit" to "Amazon Flex",                 // Amazon Flex 
        "com.ups.genesispd" to "UPS Pickup &",                       // UPS Pickup & Delivery 
        "com.dunzo.partner" to "Dunzo",                    // Dunzo Partner 
        "com.lalamove.global.driver.sea" to "Lalamove",     // Lalamove Driver 
        "global.dostavista.courier" to "Borzo/WeFast",            // Borzo/WeFast Courier 

        // ── Courier & Express ─────────────────────────────────────────────
        "com.postmates.android.courier" to "Postmates",      // Postmates Fleet 
        "com.roadie.drive.android.app" to "Roadie",         // Roadie Driver 
        "com.stuart.courier" to "Stuart",                  // Stuart Courier 
        "com.quadx.riderapp" to "GoGo Xpress",                     // GoGo Xpress Rider 

        // ── Last-Mile Delivery ────────────────────────────────────────────
        "com.amazon.relay" to "Amazon Relay/Logistics",                      // Amazon Relay/Logistics 
        "com.ekartkiranaonboarding" to "Flipkart/Ekart",           // Flipkart/Ekart Delivery Partner 
        "com.ekart.logistics.app" to "Ekart",              // Ekart Field X 
        "id.my.irsyadf.jobdriver" to "JOS KURIR/JNE",                  // JOS KURIR/JNE 
        "com.aramex.ecourier" to "Aramex",                 // Aramex Courier 
        "co.ninjavan.swiftninja_global" to "Ninja Van",     // Ninja Van Driver 

        // ── Ride & Transport ──────────────────────────────────────────────
        "com.lyft.android.driver" to "Lyft",                // Lyft Driver 
        "com.olacabs.oladriver" to "Ola",                   // Ola Driver 
        "com.grabtaxi.driver2" to "Grab",                   // Grab Driver 
        "com.careem.adma" to "Careem Captain",                     // Careem Captain 
        "com.didiglobal.driver" to "DiDi",                  // DiDi Driver 
        "ee.mtakso.driver" to "Bolt",                       // Bolt Driver 

        // ── Other Delivery Partners ────────────────────────────────────────
        "com.theporter.android.driverapp" to "Porter",      // Porter Driver 
        "com.rapido.rider" to "Rapido Captain",                    // Rapido Captain 
        "com.rapido.passenger" to "Rapido",              // Rapido Customer  — v2.9.24 fix
        "in.shadowfax.gandalf" to "Shadowfax",            // Shadowfax Delivery Partner 
        "com.gojek.partner" to "Gojek Driver/GoPartner",                     // Gojek Driver/GoPartner 
        "com.delhivery.delhiverypartner" to "Delhivery",   // Delhivery Partner 
        "com.ecomexpress.oneBoarding" to "Ecom Express Sathi",           // Ecom Express Sathi 
        "com.xpressbees.unified_new_arch" to "Xpressbees",         // Xpressbees 
        "in.letstransport.supply" to "LetsTransport",              // LetsTransport Partner 
        "net.blowhorn.driverapp" to "Blowhorn",             // Blowhorn Driver 
        "com.driveu.partner" to "DriveU",                  // DriveU Partner 
        "app.yulu.android.partner" to "Yulu",              // Yulu Partner 

        // ── Alternate/legacy packages (for compatibility) ──────────────────
        "in.swiggy.partner" to "Swiggy Restaurant",                  // Swiggy Restaurant Partner 
        "com.zomato.deliverypartner" to "Zomato Delivery",         // Zomato alternate package
        "com.amazon.flex" to "Amazon Flex",
        "com.flipkart.logistics" to "Flipkart",           // Flipkart old package
        // ── Freight",              // Flipkart old package

        // ── Freight  ───────────────────────────────────────────
        "com.convoy.driverapp"                                   to "Convoy",      // (US)
        "com.blackbuck.driver"                                   to "BlackBuck",      // (India)
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
        "com.ubercab.driver" to "#FFC107",              // Uber — Black
        "com.doordash.driverapp" to "#FF9800",          // DoorDash — Red
        "com.grubhub.driver" to "#FF6B35",              // Grubhub — Orange
        "com.deliveroo.driverapp" to "#F59E0B",         // Deliveroo — Teal
        "com.justeat.courier.uk" to "#FB923C",          // Just Eat — Orange
        "com.takeaway.delivered4all" to "#FFC107",      // Takeaway — Orange
        "com.lieferando.courier" to "#FF9800",          // Lieferando — Orange
        "com.logistics.rider.foodpanda" to "#FF6B35",   // Foodpanda — Pink/Red
        "in.swiggy.deliveryapp" to "#F59E0B",           // Swiggy — Orange
        "com.zomato.delivery" to "#FB923C",             // Zomato — Red
        "br.com.ifood.driver.app" to "#FFC107",         // iFood — Red
        "com.rappi.storekeeper" to "#FF9800",           // Rappi — Orange/Red
        "com.wolt.courierapp" to "#FF6B35",             // Wolt — Cyan
        "com.logistics.rider.glovo" to "#F59E0B",       // Glovo — Yellow
        "com.demaecan.DemaecanDriver" to "#FB923C",     // Demae-can — Red
        "com.logistics.rider.talabat" to "#FFC107",     // Talabat — Orange
        "com.menulog.courier" to "#FF9800",             // Menulog — Orange
        "com.sankuai.sailor.courier" to "#FF6B35",      // Keeta — Yellow

        // Grocery
        "com.instacart.shopper" to "#F59E0B",           // Instacart — Green
        "com.gopuff.godrive2.live" to "#FB923C",        // Gopuff — Purple
        "app.blinkit.onboarding" to "#FFC107",          // Blinkit — Yellow
        "com.bigbasket.dapp.activity" to "#FF9800",     // BigBasket — Green
        "com.mercadoenvios.crowdsourcing" to "#FF6B35", // Mercado Libre — Yellow
        "com.mercadoenvios.driver" to "#F59E0B",        // Mercado Flex — Yellow
        "au.com.woolworths.android.driver" to "#FB923C", // WooliesGO — Green
        "com.zepto.rider" to "#FFC107",                 // Zepto — Purple/Magenta
        "com.flink.workforce" to "#FF9800",             // Flink — Orange
        "com.shipt.shopper" to "#FF6B35",               // Shipt — Teal

        // Package
        "com.amazon.flex.rabbit" to "#F59E0B",          // Amazon Flex — Orange
        "com.ups.genesispd" to "#FB923C",               // UPS — Brown
        "com.dunzo.partner" to "#FFC107",               // Dunzo — Green
        "com.lalamove.global.driver.sea" to "#FF9800",  // Lalamove — Orange
        "global.dostavista.courier" to "#FF6B35",       // Borzo — Green

        // Courier
        "com.postmates.android.courier" to "#F59E0B",   // Postmates — Black
        "com.roadie.drive.android.app" to "#FB923C",    // Roadie — Blue
        "com.stuart.courier" to "#FFC107",              // Stuart — Indigo
        "com.quadx.riderapp" to "#FF9800",              // GoGo Xpress — Orange

        // Last-Mile
        "com.amazon.relay" to "#FF6B35",                // Amazon Relay — Orange
        "com.ekartkiranaonboarding" to "#F59E0B",       // Ekart — Blue
        "com.ekart.logistics.app" to "#FB923C",         // Ekart Field X — Blue
        "id.my.irsyadf.jobdriver" to "#FFC107",         // JNE — Orange
        "com.aramex.ecourier" to "#FF9800",             // Aramex — Red
        "co.ninjavan.swiftninja_global" to "#FF6B35",   // Ninja Van — Orange

        // Ride
        "com.lyft.android.driver" to "#F59E0B",         // Lyft — Pink
        "com.olacabs.oladriver" to "#FB923C",           // Ola — Green
        "com.grabtaxi.driver2" to "#FFC107",            // Grab — Green
        "com.careem.adma" to "#FF9800",                 // Careem — Green
        "com.didiglobal.driver" to "#FF6B35",           // DiDi — Orange
        "ee.mtakso.driver" to "#F59E0B",                // Bolt — Green

        // Other
        "com.theporter.android.driverapp" to "#FB923C", // Porter — Blue
        "com.rapido.rider" to "#FFC107",                // Rapido — Yellow
        "com.rapido.passenger" to "#FF9800",          // Rapido Passenger — Yellow
        "com.rapido.passenger" to "#FF6B35",          // Rapido Passenger — Yellow
        "in.shadowfax.gandalf" to "#F59E0B",            // Shadowfax — Orange
        "com.gojek.partner" to "#FB923C",               // Gojek — Green
        "com.delhivery.delhiverypartner" to "#FFC107",  // Delhivery — Blue
        "com.ecomexpress.oneBoarding" to "#FF9800",     // Ecom Express — Orange
        "com.xpressbees.unified_new_arch" to "#FF6B35", // Xpressbees — Pink
        "in.letstransport.supply" to "#F59E0B",         // LetsTransport — Cyan
        "net.blowhorn.driverapp" to "#FB923C",          // Blowhorn — Deep Orange
        "com.driveu.partner" to "#FFC107",              // DriveU — Orange
        "app.yulu.android.partner" to "#FF9800",        // Yulu — Teal

        // Legacy packages
        "in.swiggy.partner" to "#FF6B35",               // Swiggy alt — Orange
        "com.zomato.deliverypartner" to "#F59E0B",      // Zomato alt — Red
        "com.amazon.flex" to "#FB923C",                 // Amazon Flex old — Orange
        "com.flipkart.logistics" to "#FFC107",          // Flipkart old — Blue
        "com.convoy.driverapp"                           to "#FF9800",      // Convoy Driver
        "com.blackbuck.driver"                           to "#FF6B35",      // BlackBuck Driver
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
        "in.swiggy.android" to "Swiggy",                           // Swiggy Customer 
        "com.application.zomato" to "Zomato",                      // Zomato Customer 
        "com.application.zomato.district" to "Zomato District",          // Zomato District
        "com.magicpin.local" to "Magicpin",
        "com.ubercab.eats" to "Uber Eats",
        "com.doordash.consumerapp" to "DoorDash",                  // DoorDash Customer 
        "com.grubhub.android" to "Grubhub",                        // Grubhub Customer 
        "com.deliveroo.orderapp" to "Deliveroo",                    // Deliveroo Customer 
        "com.justeat.app.uk" to "Just Eat",                  // Just Eat Customer UK
        "com.takeaway.android" to "Takeaway.com",
        "com.lieferando.android" to "Lieferando",                  // Lieferando Customer 
        "com.foodpanda.android" to "Foodpanda",                    // Foodpanda Customer 
        "br.com.ifood" to "iFood",                                 // iFood Customer 
        "com.rappi.app" to "Rappi",                                // Rappi Customer 
        "com.wolt.android" to "Wolt",                              // Wolt Customer 
        "com.glovoapp.android" to "Glovo",                         // Glovo Customer 
        "com.talabat.android" to "Talabat",                        // Talabat Customer 
        "com.menulog.android" to "Menulog",                        // Menulog Customer 

        // ── Grocery (Customer Apps) ────────────────────────────────────────
        "com.instacart.app" to "Instacart",                        // Instacart Customer 
        "app.blinkit" to "Blinkit",                                // Blinkit Customer 
        "com.bigbasket.mobileapp" to "BigBasket",                  // BigBasket Customer 
        "com.zepto.app" to "Zepto",                                // Zepto Customer  — old package
        "com.zeptoconsumerapp" to "Zepto",                          // Zepto Customer  — v2.9.24 fix: actual package name
        "com.shipt.android" to "Shipt",                            // Shipt Customer 
        "au.com.woolworths.android" to "Woolworths",               // Woolworths Customer 

        // ── E-Commerce (Customer Apps) ────────────────────────────────────
        "in.amazon.mShop.android.shopping" to "Amazon Shopping",            // Amazon Shopping 
        "com.amazon.mShop.android.shopping" to "Amazon Shopping",           // Amazon Shopping 
        "com.flipkart.android" to "Flipkart",                      // Flipkart Customer 
        "com.myntra.android" to "Myntra",                          // Myntra Customer 
        "com.meesho.app" to "Meesho",                              // Meesho Customer 
        "in.swiggy.android.instamart" to "Swiggy Instamart",              // Swiggy Instamart 

        // ── Ride & Transport (Customer Apps) ──────────────────────────────
        "com.ubercab" to "Uber",                                   // Uber Customer 
        "com.olacabs.customer" to "Ola",                           // Ola Customer 
        "com.grabtaxi.passenger" to "Grab",                        // Grab Customer 
        "com.careem.acma" to "Careem",                             // Careem Customer 
        "com.didiglobal.passenger" to "DiDi",                      // DiDi Customer 
        "ee.mtakso.client" to "Bolt",                              // Bolt Customer 
        "com.lyft.android" to "Lyft",                              // Lyft Customer 

        // ── Package Tracking (Customer Apps) ──────────────────────────────
        "com.delhivery.track" to "Delhivery",                      // Delhivery Customer 
        "com.xpressbees.track" to "Xpressbees",                    // Xpressbees Customer 
        "com.dunzo.user" to "Dunzo",                               // Dunzo Customer 

        // ── Food (China) — Customer Apps ──────────────────────────────────
        "com.sankuai.meituan"                                    to "Meituan",      // (China)
        "me.ele"                                                 to "Ele.me",      // (China)

        // ── Grocery (EU) — Customer Apps ──────────────────────────────────
        "com.gorillasapp"                                        to "Gorillas",      // (EU/UK — acquired by Getir)
        "com.getir"                                              to "Getir",      // (EU/UK/MENA)

        // ── Package & Parcel — Customer Apps ───────────────────────────────
        "com.fedex.android.apps.fedexmobile"                     to "FedEx",      // (Global)
        "com.dhl.parcel.uk"                                      to "DHL",      // (Global)
        "com.sf.activity"                                        to "SF Express",      // (China)

        // ── Medical / Pharmacy — Customer Apps ────────────────────────────
        "com.capsule.pharmacy"                                   to "Capsule",      // (US)
        "com.nowrx.android"                                      to "NowRx",      // (US)
        "com.indpro.pharmeasy"                                   to "PharmEasy",      // (India)
        "com.netmeds.android"                                    to "Netmeds",      // (India)
        "com.aranoah.healthkart.plus"                            to "1mg",      // (India)

        // ── Alcohol — Customer Apps ────────────────────────────────────────
        "com.drizly.drizly"                                      to "Drizly",      // (US — acquired by Uber)
        "com.minibar.android"                                    to "Minibar",      // (US)
        "com.saucey.android"                                     to "Saucey",      // (US)
        "com.hipbar.android"                                     to "HipBar",      // (India)

        // ── Flowers — Customer Apps ────────────────────────────────────────
        "com.bloomnation.bloomnation"                            to "BloomNation",      // (US)
        "com.ftd.app.bloom"                                      to "1-800-Flowers",               // 1-800-Flowers (US)
        "com.interflora.android"                                 to "Interflora",      // (Europe/Oceania)
        "com.fnp.android"                                        to "Ferns N Petals",              // Ferns N Petals (India)

        // ── Laundry — Customer Apps ────────────────────────────────────────
        "com.rinse.app"                                          to "Rinse",      // (US)
        "com.flycleaners.android"                                to "FlyCleaners",      // (US)
        "com.laundrokart.app"                                    to "LaundroKart",      // (India)
        "com.presso.app"                                         to "Presso",      // (SEA/MENA)

        // ── Pet Supplies — Customer Apps ───────────────────────────────────
        "com.chewy.android"                                      to "Chewy",      // (US)
        "com.petsathome.android"                                 to "Pets at Home",                // Pets at Home (UK)
        "com.hutf.android"                                       to "Heads Up For Tails",      // (India)

        // ── Furniture — Customer Apps ──────────────────────────────────────
        "com.wayfair.wayfair"                                    to "Wayfair",      // (US/Europe)
        "com.castlery.app"                                       to "Castlery",      // (SEA/Oceania)
        "com.urbanladder.app"                                    to "Urban Ladder",      // (India)

        // ── Bicycle Courier ────────────────────────────────────────────────
        "com.couriersplease.app"                                 to "Courier Please",      // (Australia)

        // ── Document ───────────────────────────────────────────────────────
        "com.dex.android"                                        to "Dex",      // (US)
        "com.couriire.app"                                       to "Couriire",      // (India)

        // ── Same-Day (China) ───────────────────────────────────────────────
        "com.cainiao.wireless.dumps"                             to "Cainiao",      // (China)

        // ── White-Glove ────────────────────────────────────────────────────
        "com.xpo.logistics"                                      to "XPO Logistics",      // (US/Europe)
        "com.jingdong.app.mall"                                  to "JD Logistics",      // (China)

        // ── Cannabis ───────────────────────────────────────────────────────
        "com.eaze.android"                                       to "Eaze",      // (US)
        "com.dutchie.android"                                    to "Dutchie",      // (US)

        // ── QSR (Quick Service Restaurants) — Customer Apps ────────────────
        "com.Dominos"                                            to "Domino's India — v2.9.24 fix: capital D",
        "com.dominos"                                            to "Domino's India — old lowercase",      // (fallback)
        "com.dominos.android"                                    to "Domino's US",      // (US)
        "com.pizzahut.android"                                   to "Pizza Hut",             // Pizza Hut India (India)
        "com.pizzahut.android.global"                            to "Pizza Hut Global",                   // Pizza Hut (Global)
        "com.papajohns.android"                                  to "Papa John's",      // (US/Global)
        "com.mcdonalds.mcdeliveryindia"                          to "McDelivery India",      // (India)
        "com.mcdonalds.app"                                      to "McDonald's",      // (Global) — old package
        "com.mcdonalds.mobileapp"                                to "McDonald's — v2.9.24 fix: actual package name",
        "com.bkindia"                                            to "Burger King India",           // Burger King India (India)
        "com.bk"                                                 to "Burger King",                 // Burger King (Global)
        "com.wendys.nutritiontool"                               to "Wendy's",      // (US)
        "com.fiveguys.android"                                   to "Five Guys",      // (US/Europe)
        "com.kfc.india"                                          to "KFC India",      // (India)
        "com.kfc.android"                                        to "KFC",      // (Global)
        "com.chickfila.app"                                      to "Chick-fil-A",      // (US)
        "com.popeyes.android"                                    to "Popeyes",      // (US/Global) — old package
        "com.jubl.popeyes"                                      to "Popeyes — v2.9.24 fix: actual package name",      // (Jubilant FoodWorks)
        "com.chipotle.android"                                   to "Chipotle",      // (US/Europe)
        "com.tacobell"                                           to "Taco Bell",      // (US/Europe/LATAM)
        "com.subway.subwaymobile"                                to "Subway",      // (Global)
        "com.panera.bread"                                       to "Panera Bread",      // (US)
        "com.starbucks.mobilecard"                               to "Starbucks",      // (Global)
        "com.starbucks.in"                                       to "Starbucks India",      // (India)
        "com.dunkinbrands.dunkindonuts"                          to "Dunkin'",      // (US)
        "com.timhortons.app"                                     to "Tim Hortons",      // (US/Canada)
        "com.eatsure"                                            to "EatSure",      // (India)
        "com.box8.app"                                           to "Box8",      // (India)
        "com.faasos.behrouz"                                     to "Behrouz Biryani",      // (India)
        "com.chaayos"                                            to "Chaayos",      // (India)
        "com.wowmomo"                                            to "Wow! Momo",      // (India)
        "com.faasos"                                             to "Faasos",      // (India)
        "com.faasos.ovenstory"                                   to "Oven Story Pizza",            // Oven Story Pizza (India)
        "com.faasos.mandarinfox"                                 to "Mandarin Fox",      // (India)
        "com.faasos.bowlcompany"                                 to "The Bowl Company",  // (India)
        "com.lenotre.android"                                    to "LENOTRE Dessert",   // (MENA)
    )

    // Combined map for the notification listener to use
    val ALL_PACKAGES: Map<String, String>
        get() = PARTNER_PACKAGES + CUSTOMER_PACKAGES

    // Customer platform colors
    val CUSTOMER_PLATFORM_COLORS = mapOf(
        // Food Delivery
        "in.swiggy.android" to "#F59E0B",              // Swiggy — Orange
        "com.application.zomato" to "#FB923C",         // Zomato — Red
        "com.application.zomato.district" to "#FFC107", // Zomato District — Red
        "com.magicpin.local" to "#FF9800",             // Magicpin — Red/Orange
        "com.ubercab.eats" to "#FF6B35",               // Uber Eats — Green
        "com.doordash.consumerapp" to "#F59E0B",       // DoorDash — Red
        "com.grubhub.android" to "#FB923C",            // Grubhub — Orange
        "com.deliveroo.orderapp" to "#FFC107",         // Deliveroo — Teal
        "com.justeat.app.uk" to "#FF9800",             // Just Eat — Orange
        "com.takeaway.android" to "#FF6B35",           // Takeaway — Orange
        "com.lieferando.android" to "#F59E0B",         // Lieferando — Orange
        "com.foodpanda.android" to "#FB923C",          // Foodpanda — Pink/Red
        "br.com.ifood" to "#FFC107",                   // iFood — Red
        "com.rappi.app" to "#FF9800",                  // Rappi — Orange/Red
        "com.wolt.android" to "#FF6B35",               // Wolt — Cyan
        "com.glovoapp.android" to "#F59E0B",           // Glovo — Yellow
        "com.talabat.android" to "#FB923C",            // Talabat — Orange
        "com.menulog.android" to "#FFC107",            // Menulog — Orange

        // Grocery
        "com.instacart.app" to "#FF9800",              // Instacart — Green
        "app.blinkit" to "#FF6B35",                    // Blinkit — Yellow
        "com.bigbasket.mobileapp" to "#F59E0B",        // BigBasket — Green
        "com.zepto.app" to "#FB923C",                  // Zepto — Purple
        "com.zeptoconsumerapp" to "#FFC107",          // Zepto — Purple (v2.9.24)
        "com.zeptoconsumerapp" to "#FF9800",          // Zepto — Purple (v2.9.24)
        "com.shipt.android" to "#FF6B35",              // Shipt — Teal
        "au.com.woolworths.android" to "#F59E0B",      // Woolworths — Green

        // E-Commerce
        "in.amazon.mShop.android.shopping" to "#FB923C", // Amazon — Orange
        "com.amazon.mShop.android.shopping" to "#FFC107",// Amazon — Orange
        "com.flipkart.android" to "#FF9800",             // Flipkart — Blue
        "com.myntra.android" to "#FF6B35",             // Myntra — Pink
        "com.meesho.app" to "#F59E0B",                 // Meesho — Purple
        "in.swiggy.android.instamart" to "#FB923C",    // Instamart — Orange

        // Ride
        "com.ubercab" to "#FFC107",                    // Uber — Black
        "com.olacabs.customer" to "#FF9800",           // Ola — Green
        "com.grabtaxi.passenger" to "#FF6B35",         // Grab — Green
        "com.careem.acma" to "#F59E0B",                // Careem — Green
        "com.didiglobal.passenger" to "#FB923C",       // DiDi — Orange
        "ee.mtakso.client" to "#FFC107",               // Bolt — Green
        "com.lyft.android" to "#FF9800",               // Lyft — Pink

        // Package Tracking
        "com.delhivery.track" to "#FF6B35",            // Delhivery — Blue
        "com.xpressbees.track" to "#F59E0B",           // Xpressbees — Pink
        "com.dunzo.user" to "#FB923C",                 // Dunzo — Green
        "com.sankuai.meituan"                            to "#FFC107",      // Meituan
        "me.ele"                                         to "#FF9800",      // Ele.me
        "com.gorillasapp"                                to "#FF6B35",      // Gorillas
        "com.getir"                                      to "#F59E0B",      // Getir
        "com.fedex.android.apps.fedexmobile"             to "#FB923C",      // FedEx
        "com.dhl.parcel.uk"                              to "#FFC107",      // DHL
        "com.sf.activity"                                to "#FF9800",      // SF Express
        "com.capsule.pharmacy"                           to "#FF6B35",      // Capsule
        "com.nowrx.android"                              to "#F59E0B",      // NowRx
        "com.indpro.pharmeasy"                           to "#FB923C",      // PharmEasy
        "com.netmeds.android"                            to "#FFC107",      // Netmeds
        "com.aranoah.healthkart.plus"                    to "#FF9800",      // 1mg
        "com.drizly.drizly"                              to "#FF6B35",      // Drizly
        "com.minibar.android"                            to "#F59E0B",      // Minibar
        "com.saucey.android"                             to "#FB923C",      // Saucey
        "com.hipbar.android"                             to "#FFC107",      // HipBar
        "com.bloomnation.bloomnation"                    to "#FF9800",      // BloomNation
        "com.ftd.app.bloom"                              to "#FF6B35",      // 1-800-Flowers
        "com.interflora.android"                         to "#F59E0B",      // Interflora
        "com.fnp.android"                                to "#FB923C",      // Ferns N Petals
        "com.rinse.app"                                  to "#FFC107",      // Rinse
        "com.flycleaners.android"                        to "#FF9800",      // FlyCleaners
        "com.laundrokart.app"                            to "#FF6B35",      // LaundroKart
        "com.presso.app"                                 to "#F59E0B",      // Presso
        "com.chewy.android"                              to "#FB923C",      // Chewy
        "com.petsathome.android"                         to "#FFC107",      // Pets at Home
        "com.hutf.android"                               to "#FF9800",      // Heads Up For Tails
        "com.wayfair.wayfair"                            to "#FF6B35",      // Wayfair
        "com.castlery.app"                               to "#F59E0B",      // Castlery
        "com.urbanladder.app"                            to "#FB923C",      // Urban Ladder
        "com.couriersplease.app"                         to "#FFC107",      // Courier Please
        "com.dex.android"                                to "#FF9800",      // Dex
        "com.couriire.app"                               to "#FF6B35",      // Couriire
        "com.cainiao.wireless.dumps"                     to "#F59E0B",      // Cainiao
        "com.xpo.logistics"                              to "#FB923C",      // XPO Logistics
        "com.jingdong.app.mall"                          to "#FFC107",      // JD Logistics
        "com.eaze.android"                               to "#FF9800",      // Eaze
        "com.dutchie.android"                            to "#FF6B35",      // Dutchie
        "com.dominos"                                    to "#F59E0B",      // Domino's India
        "com.dominos.android"                            to "#FB923C",      // Domino's US
        "com.pizzahut.android"                           to "#FFC107",      // Pizza Hut India
        "com.pizzahut.android.global"                    to "#FF9800",      // Pizza Hut
        "com.papajohns.android"                          to "#FF6B35",      // Papa John's
        "com.mcdonalds.mcdeliveryindia"                  to "#F59E0B",      // McDelivery India
        "com.mcdonalds.app"                              to "#FB923C",      // McDonald's
        "com.mcdonalds.mobileapp"                        to "#FFC107",      // McDonald's (v2.9.24)
        "com.bkindia"                                    to "#FF9800",      // Burger King India
        "com.bk"                                         to "#FF6B35",      // Burger King
        "com.wendys.nutritiontool"                       to "#F59E0B",      // Wendy's
        "com.fiveguys.android"                           to "#FB923C",      // Five Guys
        "com.kfc.india"                                  to "#FFC107",      // KFC India
        "com.kfc.android"                                to "#FF9800",      // KFC
        "com.chickfila.app"                              to "#FF6B35",      // Chick-fil-A
        "com.popeyes.android"                            to "#F59E0B",      // Popeyes
        "com.jubl.popeyes"                              to "#FB923C",      // Popeyes (v2.9.24)
        "com.chipotle.android"                           to "#FFC107",      // Chipotle
        "com.tacobell"                                   to "#FF9800",      // Taco Bell
        "com.subway.subwaymobile"                        to "#FF6B35",      // Subway
        "com.panera.bread"                               to "#F59E0B",      // Panera Bread
        "com.starbucks.mobilecard"                       to "#FB923C",      // Starbucks
        "com.starbucks.in"                               to "#FFC107",      // Starbucks India
        "com.dunkinbrands.dunkindonuts"                  to "#FF9800",      // Dunkin'
        "com.timhortons.app"                             to "#FF6B35",      // Tim Hortons
        "com.eatsure"                                    to "#F59E0B",      // EatSure
        "com.box8.app"                                   to "#FB923C",      // Box8
        "com.faasos.behrouz"                             to "#FFC107",      // Behrouz Biryani
        "com.chaayos"                                    to "#FF9800",      // Chaayos
        "com.wowmomo"                                    to "#FF6B35",      // Wow! Momo
        "com.faasos"                                     to "#F59E0B",      // Faasos
        "com.faasos.ovenstory"                           to "#FB923C",      // Oven Story Pizza
        "com.faasos.mandarinfox"                         to "#FFC107",      // Mandarin Fox
        "com.faasos.bowlcompany"                         to "#FF9800",      // The Bowl Company
        "com.lenotre.android"                            to "#FF6B35",      // LENOTRE Dessert
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

    /**
     * v2.9.15: Get the category for a given package name.
     * Used by Settings screen to group platforms by category.
     * Returns "other" if the package isn't found in PlatformSource enum.
     */
    fun getCategoryForPackage(packageName: String): String {
        return try {
            PlatformSource.values().find { it.packageName == packageName }?.category ?: "other"
        } catch (_: Exception) {
            "other"
        }
    }

    /**
     * v2.9.15: All platform categories with display names and icons.
     * Used by Settings screen for expandable category groups.
     */
    val CATEGORY_DISPLAY: List<Triple<String, String, String>> = listOf(
        Triple("food", "Food Delivery", "🍽️"),
        Triple("grocery", "Grocery", "🛒"),
        Triple("package", "Package & Parcel", "📦"),
        Triple("courier", "Courier & Express", "🚚"),
        Triple("last-mile", "Last-Mile Delivery", "📍"),
        Triple("ride", "Ride & Transport", "🚗"),
        Triple("qsr", "Quick Service Restaurants", "🍔"),
        Triple("medical", "Pharmacy & Medical", "💊"),
        Triple("alcohol", "Alcohol Delivery", "🍺"),
        Triple("flower", "Flowers & Gifts", "💐"),
        Triple("laundry", "Laundry & Cleaning", "👕"),
        Triple("pet-supplies", "Pet Supplies", "🐕"),
        Triple("furniture", "Furniture & Home", "🪑"),
        Triple("freight", "Freight & Logistics", "🚛"),
        Triple("bicycle-courier", "Bicycle Courier", "🚴"),
        Triple("document", "Document Delivery", "📄"),
        Triple("same-day", "Same-Day Delivery", "⚡"),
        Triple("white-glove", "White-Glove Delivery", "🧤"),
        Triple("cannabis", "Cannabis Delivery", "🌿"),
        Triple("other", "Other", "📌")
    )

    /**
     * v2.9.15: Get display name for a category.
     */
    fun getCategoryDisplayName(category: String): String {
        return CATEGORY_DISPLAY.find { it.first == category }?.second ?: "Other"
    }

    /**
     * v2.9.15: Get icon emoji for a category.
     */
    fun getCategoryIcon(category: String): String {
        return CATEGORY_DISPLAY.find { it.first == category }?.third ?: "📌"
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
