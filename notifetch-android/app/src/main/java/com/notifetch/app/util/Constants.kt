package com.notifetch.app.util

object Constants {

    const val DATABASE_NAME = "notifetch_db"
    const val BASE_URL = "https://notifetch.app/"
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
}
