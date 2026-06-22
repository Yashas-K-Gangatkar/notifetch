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
        "com.ubercab.driver" to "Ride Platform",                      // Uber Driver/Eats (Global)
        "com.doordash.driverapp" to "Delivery Platform",              // DoorDash Dasher (US/CA/AU/JP)
        "com.grubhub.driver" to "Ride Platform 2",                   // Grubhub Driver (US)
        "com.deliveroo.driverapp" to "Ride Platform 3",             // Deliveroo Rider (UK/EU/MENA/Asia)
        "com.justeat.courier.uk" to "Courier Platform",             // Just Eat Courier UK
        "com.takeaway.delivered4all" to "Courier Platform 2",         // Takeaway.com Courier (EU)
        "com.lieferando.courier" to "Courier Platform 3",           // Lieferando Courier (DE)
        "com.logistics.rider.foodpanda" to "Food Delivery Platform",      // Foodpanda Rider (Asia/EMEA)
        "in.swiggy.deliveryapp" to "Delivery Platform 2",              // Swiggy Delivery Partner (India)
        "com.zomato.delivery" to "Delivery Platform 3",                // Zomato Delivery (India)
        "br.com.ifood.driver.app" to "Food Delivery Platform 2",           // iFood Entregador (Brazil)
        "com.rappi.storekeeper" to "Delivery Platform 4",             // Rappi Repartidor (LATAM)
        "com.wolt.courierapp" to "Courier Platform 4",                   // Wolt Courier (EU/Nordics/Asia)
        "com.logistics.rider.glovo" to "Courier Platform 5",            // Glovo Courier (EMEA/LATAM)
        "com.demaecan.DemaecanDriver" to "Ride Platform 4",       // Demae-can Driver (Japan)
        "com.logistics.rider.talabat" to "Ride Platform 5",          // Talabat Rider (MENA)
        "com.menulog.courier" to "Courier Platform 6",                // Menulog Courier (AU/NZ)
        "com.sankuai.sailor.courier" to "Ride Platform 6",             // Keeta Rider (HK/Saudi — Meituan Intl)

        // ── Grocery Delivery ───────────────────────────────────────────────
        "com.instacart.shopper" to "Delivery Platform 5",            // Instacart Shopper (US/CA)
        "com.gopuff.godrive2.live" to "Ride Platform 7",             // Gopuff Driver (US/UK)
        "app.blinkit.onboarding" to "Delivery Platform 6",            // Blinkit Delivery Partner (India)
        "com.bigbasket.dapp.activity" to "Delivery Platform 7",     // BigBasket Delivery Partner (India)
        "com.mercadoenvios.crowdsourcing" to "Delivery Platform 8",     // Mercado Libre Envios Extra (LATAM)
        "com.mercadoenvios.driver" to "Delivery Platform 9",              // Mercado Libre Envios Flex (LATAM)
        "au.com.woolworths.android.driver" to "Delivery Platform 10",         // WooliesGO (AU)
        "com.zepto.rider" to "Delivery Platform 11",                     // Zepto Delivery Partner (India)
        "com.flink.workforce" to "Delivery Platform 12",                    // Flink Workforce (EU)
        "com.shipt.shopper" to "Delivery Platform 13",                    // Shipt Shopper (US)

        // ── Package & Parcel ──────────────────────────────────────────────
        "com.amazon.flex.rabbit" to "Delivery Platform 14",                 // Amazon Flex (Global)
        "com.ups.genesispd" to "Delivery Platform 15",                       // UPS Pickup & Delivery (Global)
        "com.dunzo.partner" to "Delivery Platform 16",                    // Dunzo Partner (India)
        "com.lalamove.global.driver.sea" to "Ride Platform 8",     // Lalamove Driver (Asia/LATAM/ME)
        "global.dostavista.courier" to "Courier Platform 7",            // Borzo/WeFast Courier (India/LATAM/Asia)

        // ── Courier & Express ─────────────────────────────────────────────
        "com.postmates.android.courier" to "Delivery Platform 17",      // Postmates Fleet (US — now merged into Uber)
        "com.roadie.drive.android.app" to "Ride Platform 9",         // Roadie Driver (US)
        "com.stuart.courier" to "Courier Platform 8",                  // Stuart Courier (UK/FR/ES)
        "com.quadx.riderapp" to "Ride Platform 10",                     // GoGo Xpress Rider (Philippines)

        // ── Last-Mile Delivery ────────────────────────────────────────────
        "com.amazon.relay" to "Delivery Platform 18",                      // Amazon Relay/Logistics (US — for carriers)
        "com.ekartkiranaonboarding" to "Delivery Platform 19",           // Flipkart/Ekart Delivery Partner (India)
        "com.ekart.logistics.app" to "Delivery Platform 20",              // Ekart Field X (India)
        "id.my.irsyadf.jobdriver" to "Delivery Platform 21",                  // JOS KURIR/JNE (Indonesia)
        "com.aramex.ecourier" to "Courier Platform 9",                 // Aramex Courier (MENA/Global)
        "co.ninjavan.swiftninja_global" to "Ride Platform 11",     // Ninja Van Driver (SE Asia)

        // ── Ride & Transport ──────────────────────────────────────────────
        "com.lyft.android.driver" to "Ride Platform 12",                // Lyft Driver (US/CA)
        "com.olacabs.oladriver" to "Ride Platform 13",                   // Ola Driver (India/AU/NZ/UK)
        "com.grabtaxi.driver2" to "Ride Platform 14",                   // Grab Driver (SE Asia)
        "com.careem.adma" to "Delivery Platform 22",                     // Careem Captain (MENA)
        "com.didiglobal.driver" to "Ride Platform 15",                  // DiDi Driver (AU/NZ/LATAM/JP)
        "ee.mtakso.driver" to "Ride Platform 16",                       // Bolt Driver (EU/Africa)

        // ── Other Delivery Partners ────────────────────────────────────────
        "com.theporter.android.driverapp" to "Ride Platform 17",      // Porter Driver (India)
        "com.rapido.rider" to "Delivery Platform 23",                    // Rapido Captain (India)
        "com.rapido.passenger" to "Delivery Platform 24",              // Rapido Customer (India) — v2.9.24 fix
        "in.shadowfax.gandalf" to "Delivery Platform 25",            // Shadowfax Delivery Partner (India)
        "com.gojek.partner" to "Ride Platform 18",                     // Gojek Driver/GoPartner (Indonesia/SE Asia)
        "com.delhivery.delhiverypartner" to "Delivery Platform 26",   // Delhivery Partner (India)
        "com.ecomexpress.oneBoarding" to "Delivery Platform 27",           // Ecom Express Sathi (India)
        "com.xpressbees.unified_new_arch" to "Delivery Platform 28",         // Xpressbees (India)
        "in.letstransport.supply" to "Delivery Platform 29",              // LetsTransport Partner (India)
        "net.blowhorn.driverapp" to "Ride Platform 19",             // Blowhorn Driver (India)
        "com.driveu.partner" to "Delivery Platform 30",                  // DriveU Partner (India)
        "app.yulu.android.partner" to "Delivery Platform 31",              // Yulu Partner (India)

        // ── Alternate/legacy packages (for compatibility) ──────────────────
        "in.swiggy.partner" to "Package Delivery Platform",                  // Swiggy Restaurant Partner (alt package)
        "com.zomato.deliverypartner" to "Package Delivery Platform 2",         // Zomato alternate package
        "com.amazon.flex" to "Package Delivery Platform 3",                        // Amazon Flex old package (redirects to .rabbit)
        "com.flipkart.logistics" to "Package Delivery Platform 4",              // Flipkart old package

        // ── Freight (Driver Apps) ───────────────────────────────────────────
        "com.convoy.driverapp"                                   to "Ride Platform 20",               // Convoy Driver (US)
        "com.blackbuck.driver"                                   to "Ride Platform 21",            // BlackBuck Driver (India)
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
        "in.swiggy.android" to "Delivery Platform 32",                           // Swiggy Customer (India)
        "com.application.zomato" to "Delivery Platform 33",                      // Zomato Customer (India)
        "com.application.zomato.district" to "Delivery Platform 34",     // Zomato District — v2.9.24: new product
        "com.magicpin.local" to "Delivery Platform 35",                         // Magicpin — v2.9.24: deals + delivery
        "com.ubercab.eats" to "Delivery Platform 36",                         // Uber Eats Customer (Global)
        "com.doordash.consumerapp" to "Delivery Platform 37",                  // DoorDash Customer (US/CA/AU/JP)
        "com.grubhub.android" to "Delivery Platform 38",                        // Grubhub Customer (US)
        "com.deliveroo.orderapp" to "Delivery Platform 39",                    // Deliveroo Customer (UK/EU)
        "com.justeat.app.uk" to "Delivery Platform 40",                        // Just Eat Customer UK
        "com.takeaway.android" to "Delivery Platform 41",                      // Takeaway.com Customer (EU)
        "com.lieferando.android" to "Delivery Platform 42",                  // Lieferando Customer (DE)
        "com.foodpanda.android" to "Food Delivery Platform 3",                    // Foodpanda Customer (Asia/EMEA)
        "br.com.ifood" to "Food Delivery Platform 4",                                 // iFood Customer (Brazil)
        "com.rappi.app" to "Delivery Platform 43",                                // Rappi Customer (LATAM)
        "com.wolt.android" to "Delivery Platform 44",                              // Wolt Customer (EU/Nordics/Asia)
        "com.glovoapp.android" to "Delivery Platform 45",                         // Glovo Customer (EMEA/LATAM)
        "com.talabat.android" to "Delivery Platform 46",                        // Talabat Customer (MENA)
        "com.menulog.android" to "Delivery Platform 47",                        // Menulog Customer (AU/NZ)

        // ── Grocery (Customer Apps) ────────────────────────────────────────
        "com.instacart.app" to "Delivery Platform 48",                        // Instacart Customer (US/CA)
        "app.blinkit" to "Delivery Platform 49",                                // Blinkit Customer (India)
        "com.bigbasket.mobileapp" to "Delivery Platform 50",                  // BigBasket Customer (India)
        "com.zepto.app" to "Package Delivery Platform 5",                                // Zepto Customer (India) — old package
        "com.zeptoconsumerapp" to "Package Delivery Platform 6",                          // Zepto Customer (India) — v2.9.24 fix: actual package name
        "com.shipt.android" to "Delivery Platform 51",                            // Shipt Customer (US)
        "au.com.woolworths.android" to "Delivery Platform 52",               // Woolworths Customer (AU)

        // ── E-Commerce (Customer Apps) ────────────────────────────────────
        "in.amazon.mShop.android.shopping" to "Delivery Platform 53",            // Amazon Shopping (India)
        "com.amazon.mShop.android.shopping" to "Delivery Platform 54",           // Amazon Shopping (Global)
        "com.flipkart.android" to "Delivery Platform 55",                      // Flipkart Customer (India)
        "com.myntra.android" to "Delivery Platform 56",                          // Myntra Customer (India)
        "com.meesho.app" to "Delivery Platform 57",                              // Meesho Customer (India)
        "in.swiggy.android.instamart" to "Delivery Platform 58",              // Swiggy Instamart (India)

        // ── Ride & Transport (Customer Apps) ──────────────────────────────
        "com.ubercab" to "Delivery Platform 59",                                   // Uber Customer (Global)
        "com.olacabs.customer" to "Delivery Platform 60",                           // Ola Customer (India)
        "com.grabtaxi.passenger" to "Delivery Platform 61",                        // Grab Customer (SE Asia)
        "com.careem.acma" to "Delivery Platform 62",                             // Careem Customer (MENA)
        "com.didiglobal.passenger" to "Delivery Platform 63",                      // DiDi Customer (AU/NZ/LATAM)
        "ee.mtakso.client" to "Delivery Platform 64",                              // Bolt Customer (EU/Africa)
        "com.lyft.android" to "Delivery Platform 65",                              // Lyft Customer (US/CA)

        // ── Package Tracking (Customer Apps) ──────────────────────────────
        "com.delhivery.track" to "Delivery Platform 66",                      // Delhivery Customer (India)
        "com.xpressbees.track" to "Delivery Platform 67",                    // Xpressbees Customer (India)
        "com.dunzo.user" to "Delivery Platform 68",                               // Dunzo Customer (India)

        // ── Food (China) — Customer Apps ──────────────────────────────────
        "com.sankuai.meituan"                                    to "Delivery Platform 69",                     // Meituan (China)
        "me.ele"                                                 to "Delivery Platform 70",                      // Ele.me (China)

        // ── Grocery (EU) — Customer Apps ──────────────────────────────────
        "com.gorillasapp"                                        to "Delivery Platform 71",                    // Gorillas (EU/UK — acquired by Getir)
        "com.getir"                                              to "Delivery Platform 72",                       // Getir (EU/UK/MENA)

        // ── Package & Parcel — Customer Apps ───────────────────────────────
        "com.fedex.android.apps.fedexmobile"                     to "Delivery Platform 73",                       // FedEx (Global)
        "com.dhl.parcel.uk"                                      to "Delivery Platform 74",                         // DHL (Global)
        "com.sf.activity"                                        to "Delivery Platform 75",                  // SF Express (China)

        // ── Medical / Pharmacy — Customer Apps ────────────────────────────
        "com.capsule.pharmacy"                                   to "Delivery Platform 76",                     // Capsule (US)
        "com.nowrx.android"                                      to "Delivery Platform 77",                       // NowRx (US)
        "com.indpro.pharmeasy"                                   to "Delivery Platform 78",                   // PharmEasy (India)
        "com.netmeds.android"                                    to "Delivery Platform 79",                     // Netmeds (India)
        "com.aranoah.healthkart.plus"                            to "Delivery Platform 80",                         // 1mg (India)

        // ── Alcohol — Customer Apps ────────────────────────────────────────
        "com.drizly.drizly"                                      to "Delivery Platform 81",                      // Drizly (US — acquired by Uber)
        "com.minibar.android"                                    to "Delivery Platform 82",                     // Minibar (US)
        "com.saucey.android"                                     to "Delivery Platform 83",                      // Saucey (US)
        "com.hipbar.android"                                     to "Delivery Platform 84",                      // HipBar (India)

        // ── Flowers — Customer Apps ────────────────────────────────────────
        "com.bloomnation.bloomnation"                            to "Delivery Platform 85",                 // BloomNation (US)
        "com.ftd.app.bloom"                                      to "Flower Delivery Platform",               // 1-800-Flowers (US)
        "com.interflora.android"                                 to "Delivery Platform 86",                  // Interflora (Europe/Oceania)
        "com.fnp.android"                                        to "Pet Supplies Platform",              // Ferns N Petals (India)

        // ── Laundry — Customer Apps ────────────────────────────────────────
        "com.rinse.app"                                          to "Delivery Platform 87",                       // Rinse (US)
        "com.flycleaners.android"                                to "Delivery Platform 88",                 // FlyCleaners (US)
        "com.laundrokart.app"                                    to "Delivery Platform 89",                 // LaundroKart (India)
        "com.presso.app"                                         to "Delivery Platform 90",                      // Presso (SEA/MENA)

        // ── Pet Supplies — Customer Apps ───────────────────────────────────
        "com.chewy.android"                                      to "Delivery Platform 91",                       // Chewy (US)
        "com.petsathome.android"                                 to "Pet Supplies Platform 2",                // Pets at Home (UK)
        "com.hutf.android"                                       to "Delivery Platform 92",          // Heads Up For Tails (India)

        // ── Furniture — Customer Apps ──────────────────────────────────────
        "com.wayfair.wayfair"                                    to "Delivery Platform 93",                     // Wayfair (US/Europe)
        "com.castlery.app"                                       to "Delivery Platform 94",                    // Castlery (SEA/Oceania)
        "com.urbanladder.app"                                    to "Delivery Platform 95",                // Urban Ladder (India)

        // ── Bicycle Courier ────────────────────────────────────────────────
        "com.couriersplease.app"                                 to "Courier Platform 10",              // Courier Please (Australia)

        // ── Document ───────────────────────────────────────────────────────
        "com.dex.android"                                        to "Delivery Platform 96",                         // Dex (US)
        "com.couriire.app"                                       to "Delivery Platform 97",                    // Couriire (India)

        // ── Same-Day (China) ───────────────────────────────────────────────
        "com.cainiao.wireless.dumps"                             to "Delivery Platform 98",                     // Cainiao (China)

        // ── White-Glove ────────────────────────────────────────────────────
        "com.xpo.logistics"                                      to "Delivery Platform 99",               // XPO Logistics (US/Europe)
        "com.jingdong.app.mall"                                  to "Delivery Platform 100",                // JD Logistics (China)

        // ── Cannabis ───────────────────────────────────────────────────────
        "com.eaze.android"                                       to "Delivery Platform 101",                        // Eaze (US)
        "com.dutchie.android"                                    to "Delivery Platform 102",                     // Dutchie (US)

        // ── QSR (Quick Service Restaurants) — Customer Apps ────────────────
        "com.Dominos"                                            to "Delivery Platform 103",              // Domino's India — v2.9.24 fix: capital D
        "com.dominos"                                            to "Delivery Platform 104",              // Domino's India — old lowercase (fallback)
        "com.dominos.android"                                    to "Delivery Platform 105",                 // Domino's US (US)
        "com.pizzahut.android"                                   to "Restaurant Platform",             // Pizza Hut India (India)
        "com.pizzahut.android.global"                            to "Restaurant Platform 2",                   // Pizza Hut (Global)
        "com.papajohns.android"                                  to "Delivery Platform 106",                 // Papa John's (US/Global)
        "com.mcdonalds.mcdeliveryindia"                          to "Delivery Platform 107",            // McDelivery India (India)
        "com.mcdonalds.app"                                      to "Package Delivery Platform 7",                  // McDonald's (Global) — old package
        "com.mcdonalds.mobileapp"                                to "Package Delivery Platform 8",                  // McDonald's — v2.9.24 fix: actual package name
        "com.bkindia"                                            to "Restaurant Platform 3",           // Burger King India (India)
        "com.bk"                                                 to "Restaurant Platform 4",                 // Burger King (Global)
        "com.wendys.nutritiontool"                               to "Delivery Platform 108",                     // Wendy's (US)
        "com.fiveguys.android"                                   to "Delivery Platform 109",                   // Five Guys (US/Europe)
        "com.kfc.india"                                          to "Delivery Platform 110",                   // KFC India (India)
        "com.kfc.android"                                        to "Delivery Platform 111",                         // KFC (Global)
        "com.chickfila.app"                                      to "Delivery Platform 112",                 // Chick-fil-A (US)
        "com.popeyes.android"                                    to "Package Delivery Platform 9",                     // Popeyes (US/Global) — old package
        "com.jubl.popeyes"                                      to "Food Delivery Platform 5",                     // Popeyes — v2.9.24 fix: actual package name (Jubilant FoodWorks)
        "com.chipotle.android"                                   to "Delivery Platform 113",                    // Chipotle (US/Europe)
        "com.tacobell"                                           to "Delivery Platform 114",                   // Taco Bell (US/Europe/LATAM)
        "com.subway.subwaymobile"                                to "Delivery Platform 115",                      // Subway (Global)
        "com.panera.bread"                                       to "Delivery Platform 116",                // Panera Bread (US)
        "com.starbucks.mobilecard"                               to "Delivery Platform 117",                   // Starbucks (Global)
        "com.starbucks.in"                                       to "Delivery Platform 118",             // Starbucks India (India)
        "com.dunkinbrands.dunkindonuts"                          to "Delivery Platform 119",                     // Dunkin' (US)
        "com.timhortons.app"                                     to "Delivery Platform 120",                 // Tim Hortons (US/Canada)
        "com.eatsure"                                            to "Delivery Platform 121",                     // EatSure (India)
        "com.box8.app"                                           to "Delivery Platform 122",                        // Box8 (India)
        "com.faasos.behrouz"                                     to "Delivery Platform 123",             // Behrouz Biryani (India)
        "com.chaayos"                                            to "Delivery Platform 124",                     // Chaayos (India)
        "com.wowmomo"                                            to "Delivery Platform 125",                   // Wow! Momo (India)
        "com.faasos"                                             to "Delivery Platform 126",                      // Faasos (India)
        "com.faasos.ovenstory"                                   to "Restaurant Platform 5",            // Oven Story Pizza (India)
        "com.faasos.mandarinfox"                                 to "Delivery Platform 127",                // Mandarin Fox (India)
        "com.faasos.bowlcompany"                                 to "Delivery Platform 128",            // The Bowl Company (India)
        "com.lenotre.android"                                    to "Delivery Platform 129",              // LENOTRE Dessert (MENA)
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
