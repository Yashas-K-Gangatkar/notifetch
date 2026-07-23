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

    // to avoid trademark infringement. Users can customize any platform
    // name to whatever they prefer. This "user choice" model provides:
    //   1. Zero trademark risk (we don't use brand names by default)
    //   2. User can rename to brand name if they want (their choice, their liability)
    //   3. Package names are factual identifiers (not trademark use)
    //   4. All brand colors replaced with NotiFetch amber/orange
    // ═══════════════════════════════════════════════════════════════════════

    val PARTNER_PACKAGES = mapOf(
        // ── Food Delivery ──────────────────────────────────────────────────
        "com.ubercab.driver" to "Platform 167",
        "com.doordash.driverapp" to "Platform 141",
        "com.grubhub.driver" to "Platform 142",
        "com.deliveroo.driverapp" to "Platform 143",
        "com.justeat.courier.uk" to "Platform 144",
        "com.takeaway.delivered4all" to "Platform 145",
        "com.lieferando.courier" to "Platform 146",
        "com.logistics.rider.foodpanda" to "Platform 147",
        "in.swiggy.deliveryapp" to "Platform 136",
        "com.zomato.delivery" to "Platform 137",
        "br.com.ifood.driver.app" to "Platform 148",
        "com.rappi.storekeeper" to "Platform 149",
        "com.wolt.courierapp" to "Platform 150",
        "com.logistics.rider.glovo" to "Platform 151",
        "com.demaecan.PlatformcanDriver" to "Platform 15",
        "com.logistics.rider.talabat" to "Platform 152",
        "com.menulog.courier" to "Platform 153",
        "com.sankuai.sailor.courier" to "Platform 18",

        // ── Grocery Delivery ───────────────────────────────────────────────
        "com.instacart.shopper" to "Platform 154",
        "com.gopuff.godrive2.live" to "Platform 20",
        "app.blinkit.onboarding" to "Platform 155",
        "com.bigbasket.dapp.activity" to "Platform 156",
        "com.mercadoenvios.crowdsourcing" to "Platform 24",
        "com.mercadoenvios.driver" to "Platform 24",
        "au.com.woolworths.android.driver" to "Platform 25",
        "com.zepto.rider" to "Platform 158",
        "com.flink.workforce" to "Platform 27",
        "com.shipt.shopper" to "Platform 159",

        // ── Package & Parcel ──────────────────────────────────────────────
        "com.amazon.flex.rabbit" to "Platform 64",
        "com.ups.genesispd" to "Platform 30",
        "com.dunzo.partner" to "Platform 176",
        "com.lalamove.global.driver.sea" to "Platform 32",
        "global.dostavista.courier" to "Platform 33",

        // ── Courier & Express ─────────────────────────────────────────────
        "com.postmates.android.courier" to "Platform 34",
        "com.roadie.drive.android.app" to "Platform 35",
        "com.stuart.courier" to "Platform 36",
        "com.quadx.riderapp" to "Platform 37",

        // ── Last-Mile Delivery ────────────────────────────────────────────
        "com.amazon.relay" to "Platform 38",
        "com.ekartkiranaonboarding" to "Platform 39",
        "com.ekart.logistics.app" to "Platform 40",
        "id.my.irsyadf.jobdriver" to "Platform 41",
        "com.aramex.ecourier" to "Platform 42",
        "co.ninjavan.swiftninja_global" to "Platform 43",

        // ── Ride & Transport ──────────────────────────────────────────────
        "com.lyft.android.driver" to "Platform 173",
        "com.olacabs.oladriver" to "Platform 168",
        "com.grabtaxi.driver2" to "Platform 169",
        "com.careem.adma" to "Platform 47",
        "com.didiglobal.driver" to "Platform 171",
        "ee.mtakso.driver" to "Platform 172",

        // ── Other Delivery Partners ────────────────────────────────────────
        "com.theporter.android.driverapp" to "Platform 50",
        "com.rapido.rider" to "Platform 51",
        "com.rapido.passenger" to "Platform 52",
        "in.shadowfax.gandalf" to "Platform 53",
        "com.gojek.partner" to "Platform 54",
        "com.delhivery.delhiverypartner" to "Platform 174",
        "com.ecomexpress.oneBoarding" to "Platform 56",
        "com.xpressbees.unified_new_arch" to "Platform 175",
        "in.letstransport.supply" to "Platform 58",
        "net.blowhorn.driverapp" to "Platform 59",
        "com.driveu.partner" to "Platform 60",
        "app.yulu.android.partner" to "Platform 61",

        // ── Alternate/legacy packages (for compatibility) ──────────────────
        "in.swiggy.partner" to "Platform 62",
        "com.zomato.deliverypartner" to "Platform 63",
        "com.amazon.flex" to "Platform 64",
        "com.flipkart.logistics" to "Platform 163",
        // ── Freight

        // ── Freight  ───────────────────────────────────────────
        "com.convoy.driverapp"                                   to "Platform 66",
        "com.blackbuck.driver"                                   to "Platform 67",
    )

    // Source identifiers for API (machine-readable, not user-facing)
    val PLATFORM_SOURCES: Map<String, String> = PARTNER_PACKAGES.map { (pkg, _) ->
        pkg to pkg.replace(".", "_").replace("com_", "").replace("in_", "").replace("br_com_", "").replace("global_", "").replace("app_", "").take(40)
    }.toMap()

    // ═══════════════════════════════════════════════════════════════════════

    // This ensures colors work regardless of user customizing the display name.
    // Colors are the actual brand colors used in nominative fair use context.
    // ═══════════════════════════════════════════════════════════════════════
    val PLATFORM_COLORS = mapOf(
        // Food Delivery
        "com.ubercab.driver" to "Platform 362",
        "com.doordash.driverapp" to "Platform 363",
        "com.grubhub.driver" to "Platform 364",
        "com.deliveroo.driverapp" to "Platform 360",
        "com.justeat.courier.uk" to "Platform 361",
        "com.takeaway.delivered4all" to "Platform 362",
        "com.lieferando.courier" to "Platform 363",
        "com.logistics.rider.foodpanda" to "Platform 364",
        "in.swiggy.deliveryapp" to "Platform 360",
        "com.zomato.delivery" to "Platform 361",
        "br.com.ifood.driver.app" to "Platform 362",
        "com.rappi.storekeeper" to "Platform 363",
        "com.wolt.courierapp" to "Platform 364",
        "com.logistics.rider.glovo" to "Platform 360",
        "com.demaecan.PlatformcanDriver" to "Platform 361",
        "com.logistics.rider.talabat" to "Platform 362",
        "com.menulog.courier" to "Platform 363",
        "com.sankuai.sailor.courier" to "Platform 364",

        // Grocery
        "com.instacart.shopper" to "Platform 360",
        "com.gopuff.godrive2.live" to "Platform 361",
        "app.blinkit.onboarding" to "Platform 362",
        "com.bigbasket.dapp.activity" to "Platform 363",
        "com.mercadoenvios.crowdsourcing" to "Platform 364",
        "com.mercadoenvios.driver" to "Platform 360",
        "au.com.woolworths.android.driver" to "Platform 361",
        "com.zepto.rider" to "Platform 362",
        "com.flink.workforce" to "Platform 363",
        "com.shipt.shopper" to "Platform 364",

        // Package
        "com.amazon.flex.rabbit" to "Platform 360",
        "com.ups.genesispd" to "Platform 361",
        "com.dunzo.partner" to "Platform 362",
        "com.lalamove.global.driver.sea" to "Platform 363",
        "global.dostavista.courier" to "Platform 364",

        // Courier
        "com.postmates.android.courier" to "Platform 360",
        "com.roadie.drive.android.app" to "Platform 361",
        "com.stuart.courier" to "Platform 362",
        "com.quadx.riderapp" to "Platform 363",

        // Last-Mile
        "com.amazon.relay" to "Platform 364",
        "com.ekartkiranaonboarding" to "Platform 360",
        "com.ekart.logistics.app" to "Platform 361",
        "id.my.irsyadf.jobdriver" to "Platform 362",
        "com.aramex.ecourier" to "Platform 363",
        "co.ninjavan.swiftninja_global" to "Platform 364",

        // Ride
        "com.lyft.android.driver" to "Platform 360",
        "com.olacabs.oladriver" to "Platform 361",
        "com.grabtaxi.driver2" to "Platform 362",
        "com.careem.adma" to "Platform 363",
        "com.didiglobal.driver" to "Platform 364",
        "ee.mtakso.driver" to "Platform 360",

        // Other
        "com.theporter.android.driverapp" to "Platform 361",
        "com.rapido.rider" to "Platform 362",
        "com.rapido.passenger" to "Platform 363",
        "com.rapido.passenger" to "Platform 364",
        "in.shadowfax.gandalf" to "Platform 360",
        "com.gojek.partner" to "Platform 361",
        "com.delhivery.delhiverypartner" to "Platform 362",
        "com.ecomexpress.oneBoarding" to "Platform 363",
        "com.xpressbees.unified_new_arch" to "Platform 364",
        "in.letstransport.supply" to "Platform 360",
        "net.blowhorn.driverapp" to "Platform 361",
        "com.driveu.partner" to "Platform 362",
        "app.yulu.android.partner" to "Platform 363",

        // Legacy packages
        "in.swiggy.partner" to "Platform 364",
        "com.zomato.deliverypartner" to "Platform 360",
        "com.amazon.flex" to "Platform 361",
        "com.flipkart.logistics" to "Platform 362",
        "com.convoy.driverapp"                           to "Platform 363",
        "com.blackbuck.driver"                           to "Platform 364",
    )

    // Time constants
    const val SYNC_INTERVAL_MINUTES = 15L
    const val MAX_NOTIFICATION_AGE_DAYS = 30

    // Legal compliance: NotiFetch does NOT access delivery platform APIs,
    // store credentials, or use OAuth tokens. It only reads notification
    // content that the user can already see on their device.

    // Users can customize any display name through the app settings.
    const val LEGAL_DISCLAIMER = "NotiFetch reads notifications you can already see. We never access platform APIs or store credentials. Platform names are customizable by the user."

    // ═══════════════════════════════════════════════════════════════════════
    // CUSTOMER App Packages — for the Customer mode
    // These are the customer-facing apps (not driver/partner apps)
    // Last verified: June 2026
    // ═══════════════════════════════════════════════════════════════════════

    val CUSTOMER_PACKAGES = mapOf(
        // ── Food Delivery (Customer Apps) ─────────────────────────────────
        "in.swiggy.android" to "Platform 136",
        "com.application.zomato" to "Platform 137",
        "com.application.zomato.district" to "Platform 138",
        "com.magicpin.local" to "Platform 139",
        "com.ubercab.eats" to "Platform 140",
        "com.doordash.consumerapp" to "Platform 141",
        "com.grubhub.android" to "Platform 142",
        "com.deliveroo.orderapp" to "Platform 143",
        "com.justeat.app.uk" to "Platform 144",
        "com.takeaway.android" to "Platform 145",
        "com.lieferando.android" to "Platform 146",
        "com.foodpanda.android" to "Platform 147",
        "br.com.ifood" to "Platform 148",
        "com.rappi.app" to "Platform 149",
        "com.wolt.android" to "Platform 150",
        "com.glovoapp.android" to "Platform 151",
        "com.talabat.android" to "Platform 152",
        "com.menulog.android" to "Platform 153",

        // ── Grocery (Customer Apps) ────────────────────────────────────────
        "com.instacart.app" to "Platform 154",
        "app.blinkit" to "Platform 155",
        "com.bigbasket.mobileapp" to "Platform 156",
        "com.zepto.app" to "Platform 158",
        "com.zeptoconsumerapp" to "Platform 158",
        "com.shipt.android" to "Platform 159",
        "au.com.woolworths.android" to "Platform 160",

        // ── E-Commerce (Customer Apps) ────────────────────────────────────
        "in.amazon.mShop.android.shopping" to "Platform 162",
        "com.amazon.mShop.android.shopping" to "Platform 162",
        "com.flipkart.android" to "Platform 163",
        "com.myntra.android" to "Platform 164",
        "com.meesho.app" to "Platform 165",
        "in.swiggy.android.instamart" to "Platform 166",

        // ── Ride & Transport (Customer Apps) ──────────────────────────────
        "com.ubercab" to "Platform 167",
        "com.olacabs.customer" to "Platform 168",
        "com.grabtaxi.passenger" to "Platform 169",
        "com.careem.acma" to "Platform 170",
        "com.didiglobal.passenger" to "Platform 171",
        "ee.mtakso.client" to "Platform 172",
        "com.lyft.android" to "Platform 173",

        // ── Package Tracking (Customer Apps) ──────────────────────────────
        "com.delhivery.track" to "Platform 174",
        "com.xpressbees.track" to "Platform 175",
        "com.dunzo.user" to "Platform 176",

        // ── Food (China) — Customer Apps ──────────────────────────────────
        "com.sankuai.meituan"                                    to "Platform 177",
        "me.ele"                                                 to "Platform 178",

        // ── Grocery (EU) — Customer Apps ──────────────────────────────────
        "com.gorillasapp"                                        to "Platform 179",
        "com.getir"                                              to "Platform 180",

        // ── Package & Parcel — Customer Apps ───────────────────────────────
        "com.fedex.android.apps.fedexmobile"                     to "Platform 181",
        "com.dhl.parcel.uk"                                      to "Platform 182",
        "com.sf.activity"                                        to "Platform 183",

        // ── Medical / Pharmacy — Customer Apps ────────────────────────────
        "com.capsule.pharmacy"                                   to "Platform 184",
        "com.nowrx.android"                                      to "Platform 185",
        "com.indpro.pharmeasy"                                   to "Platform 186",
        "com.netmeds.android"                                    to "Platform 187",
        "com.aranoah.healthkart.plus"                            to "Platform 188",

        // ── Alcohol — Customer Apps ────────────────────────────────────────
        "com.drizly.drizly"                                      to "Platform 189",
        "com.minibar.android"                                    to "Platform 190",
        "com.saucey.android"                                     to "Platform 191",
        "com.hipbar.android"                                     to "Platform 192",

        // ── Flowers — Customer Apps ────────────────────────────────────────
        "com.bloomnation.bloomnation"                            to "Platform 193",
        "com.ftd.app.bloom"                                      to "Platform 194",
        "com.interflora.android"                                 to "Platform 195",
        "com.fnp.android"                                        to "Platform 196",

        // ── Laundry — Customer Apps ────────────────────────────────────────
        "com.rinse.app"                                          to "Platform 197",
        "com.flycleaners.android"                                to "Platform 198",
        "com.laundrokart.app"                                    to "Platform 199",
        "com.presso.app"                                         to "Platform 200",

        // ── Pet Supplies — Customer Apps ───────────────────────────────────
        "com.chewy.android"                                      to "Platform 201",
        "com.petsathome.android"                                 to "Platform 202",
        "com.hutf.android"                                       to "Platform 203",

        // ── Furniture — Customer Apps ──────────────────────────────────────
        "com.wayfair.wayfair"                                    to "Platform 204",
        "com.castlery.app"                                       to "Platform 205",
        "com.urbanladder.app"                                    to "Platform 206",

        // ── Bicycle Courier ────────────────────────────────────────────────
        "com.couriersplease.app"                                 to "Platform 207",

        // ── Document ───────────────────────────────────────────────────────
        "com.dex.android"                                        to "Platform 208",
        "com.couriire.app"                                       to "Platform 209",

        // ── Same-Day (China) ───────────────────────────────────────────────
        "com.cainiao.wireless.dumps"                             to "Platform 210",

        // ── White-Glove ────────────────────────────────────────────────────
        "com.xpo.logistics"                                      to "Platform 211",
        "com.jingdong.app.mall"                                  to "Platform 212",

        // ── Cannabis ───────────────────────────────────────────────────────
        "com.eaze.android"                                       to "Platform 213",
        "com.dutchie.android"                                    to "Platform 214",

        // ── QSR (Quick Service Restaurants) — Customer Apps ────────────────
        "com.dominos"                                            to "Platform 215",
        "com.dominos.android"                                    to "Platform 216",

        // v2.9.66: NotiFetch Tester (test app for deep link verification)
        "com.notifetch.tester"                                   to "Platform 217",
        "com.pizzahut.android"                                   to "Platform 218",
        "com.pizzahut.android.global"                            to "Platform 219",
        "com.papajohns.android"                                  to "Platform 220",
        "com.mcdonalds.mcdeliveryindia"                          to "Platform 221",
        "com.mcdonalds.app"                                      to "Platform 222",
        "com.mcdonalds.mobileapp"                                to "Platform 223",
        "com.bkindia"                                            to "Platform 224",
        "com.bk"                                                 to "Platform 225",
        "com.wendys.nutritiontool"                               to "Platform 226",
        "com.fiveguys.android"                                   to "Platform 227",
        "com.kfc.india"                                          to "Platform 228",
        "com.kfc.android"                                        to "Platform 229",
        "com.chickfila.app"                                      to "Platform 230",
        "com.popeyes.android"                                    to "Platform 231",
        "com.jubl.popeyes"                                      to "Platform 232",
        "com.chipotle.android"                                   to "Platform 233",
        "com.tacobell"                                           to "Platform 234",
        "com.subway.subwaymobile"                                to "Platform 235",
        "com.panera.bread"                                       to "Platform 236",
        "com.starbucks.mobilecard"                               to "Platform 237",
        "com.starbucks.in"                                       to "Platform 238",
        "com.dunkinbrands.dunkindonuts"                          to "Platform 239",
        "com.timhortons.app"                                     to "Platform 240",
        "com.eatsure"                                            to "Platform 241",
        "com.box8.app"                                           to "Platform 242",
        "com.faasos.behrouz"                                     to "Platform 243",
        "com.chaayos"                                            to "Platform 244",
        "com.wowmomo"                                            to "Platform 245",
        "com.faasos"                                             to "Platform 246",
        "com.faasos.ovenstory"                                   to "Platform 247",
        "com.faasos.mandarinfox"                                 to "Platform 248",
        "com.faasos.bowlcompany"                                 to "Platform 249",
        "com.lenotre.android"                                    to "Platform 250",
    )

    // Combined map for the notification listener to use
    val ALL_PACKAGES: Map<String, String>
        get() = PARTNER_PACKAGES + CUSTOMER_PACKAGES

    // Customer platform colors
    val CUSTOMER_PLATFORM_COLORS = mapOf(
        // Food Delivery
        "in.swiggy.android" to "Platform 360",
        "com.application.zomato" to "Platform 361",
        "com.application.zomato.district" to "Platform 362",
        "com.magicpin.local" to "Platform 363",
        "com.ubercab.eats" to "Platform 364",
        "com.doordash.consumerapp" to "Platform 360",
        "com.grubhub.android" to "Platform 361",
        "com.deliveroo.orderapp" to "Platform 362",
        "com.justeat.app.uk" to "Platform 363",
        "com.takeaway.android" to "Platform 364",
        "com.lieferando.android" to "Platform 360",
        "com.foodpanda.android" to "Platform 361",
        "br.com.ifood" to "Platform 362",
        "com.rappi.app" to "Platform 363",
        "com.wolt.android" to "Platform 364",
        "com.glovoapp.android" to "Platform 360",
        "com.talabat.android" to "Platform 361",
        "com.menulog.android" to "Platform 362",

        // Grocery
        "com.instacart.app" to "Platform 363",
        "app.blinkit" to "Platform 364",
        "com.bigbasket.mobileapp" to "Platform 360",
        "com.zepto.app" to "Platform 361",
        "com.zeptoconsumerapp" to "Platform 363",
        "com.shipt.android" to "Platform 364",
        "au.com.woolworths.android" to "Platform 360",

        // E-Commerce
        "in.amazon.mShop.android.shopping" to "Platform 361",
        "com.amazon.mShop.android.shopping" to "Platform 362",
        "com.flipkart.android" to "Platform 363",
        "com.myntra.android" to "Platform 364",
        "com.meesho.app" to "Platform 360",
        "in.swiggy.android.instamart" to "Platform 361",

        // Ride
        "com.ubercab" to "Platform 362",
        "com.olacabs.customer" to "Platform 363",
        "com.grabtaxi.passenger" to "Platform 364",
        "com.careem.acma" to "Platform 360",
        "com.didiglobal.passenger" to "Platform 361",
        "ee.mtakso.client" to "Platform 362",
        "com.lyft.android" to "Platform 363",

        // Package Tracking
        "com.delhivery.track" to "Platform 364",
        "com.xpressbees.track" to "Platform 360",
        "com.dunzo.user" to "Platform 361",
        "com.sankuai.meituan"                            to "Platform 362",
        "me.ele"                                         to "Platform 363",
        "com.gorillasapp"                                to "Platform 364",
        "com.getir"                                      to "Platform 360",
        "com.fedex.android.apps.fedexmobile"             to "Platform 361",
        "com.dhl.parcel.uk"                              to "Platform 362",
        "com.sf.activity"                                to "Platform 363",
        "com.capsule.pharmacy"                           to "Platform 364",
        "com.nowrx.android"                              to "Platform 360",
        "com.indpro.pharmeasy"                           to "Platform 361",
        "com.netmeds.android"                            to "Platform 362",
        "com.aranoah.healthkart.plus"                    to "Platform 363",
        "com.drizly.drizly"                              to "Platform 364",
        "com.minibar.android"                            to "Platform 360",
        "com.saucey.android"                             to "Platform 361",
        "com.hipbar.android"                             to "Platform 362",
        "com.bloomnation.bloomnation"                    to "Platform 363",
        "com.ftd.app.bloom"                              to "Platform 364",
        "com.interflora.android"                         to "Platform 360",
        "com.fnp.android"                                to "Platform 361",
        "com.rinse.app"                                  to "Platform 362",
        "com.flycleaners.android"                        to "Platform 363",
        "com.laundrokart.app"                            to "Platform 364",
        "com.presso.app"                                 to "Platform 360",
        "com.chewy.android"                              to "Platform 361",
        "com.petsathome.android"                         to "Platform 362",
        "com.hutf.android"                               to "Platform 363",
        "com.wayfair.wayfair"                            to "Platform 364",
        "com.castlery.app"                               to "Platform 360",
        "com.urbanladder.app"                            to "Platform 361",
        "com.couriersplease.app"                         to "Platform 362",
        "com.dex.android"                                to "Platform 363",
        "com.couriire.app"                               to "Platform 364",
        "com.cainiao.wireless.dumps"                     to "Platform 360",
        "com.xpo.logistics"                              to "Platform 361",
        "com.jingdong.app.mall"                          to "Platform 362",
        "com.eaze.android"                               to "Platform 363",
        "com.dutchie.android"                            to "Platform 364",
        "com.dominos"                                    to "Platform 360",
        "com.dominos.android"                            to "Platform 361",
        "com.pizzahut.android"                           to "Platform 362",
        "com.pizzahut.android.global"                    to "Platform 363",
        "com.papajohns.android"                          to "Platform 364",
        "com.mcdonalds.mcdeliveryindia"                  to "Platform 360",
        "com.mcdonalds.app"                              to "Platform 361",
        "com.mcdonalds.mobileapp"                        to "Platform 362",
        "com.bkindia"                                    to "Platform 363",
        "com.bk"                                         to "Platform 364",
        "com.wendys.nutritiontool"                       to "Platform 360",
        "com.fiveguys.android"                           to "Platform 361",
        "com.kfc.india"                                  to "Platform 362",
        "com.kfc.android"                                to "Platform 363",
        "com.chickfila.app"                              to "Platform 364",
        "com.popeyes.android"                            to "Platform 360",
        "com.jubl.popeyes"                              to "Platform 361",
        "com.chipotle.android"                           to "Platform 362",
        "com.tacobell"                                   to "Platform 363",
        "com.subway.subwaymobile"                        to "Platform 364",
        "com.panera.bread"                               to "Platform 360",
        "com.starbucks.mobilecard"                       to "Platform 361",
        "com.starbucks.in"                               to "Platform 362",
        "com.dunkinbrands.dunkindonuts"                  to "Platform 363",
        "com.timhortons.app"                             to "Platform 364",
        "com.eatsure"                                    to "Platform 360",
        "com.box8.app"                                   to "Platform 361",
        "com.faasos.behrouz"                             to "Platform 362",
        "com.chaayos"                                    to "Platform 363",
        "com.wowmomo"                                    to "Platform 364",
        "com.faasos"                                     to "Platform 360",
        "com.faasos.ovenstory"                           to "Platform 361",
        "com.faasos.mandarinfox"                         to "Platform 362",
        "com.faasos.bowlcompany"                         to "Platform 363",
        "com.lenotre.android"                            to "Platform 364",
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
    PLATFORM_01("Platform 1", "com.ubercab.driver", "uber_driver", "food"),
    PLATFORM_02("Platform 2", "com.doordash.driverapp", "doordash_dasher", "food"),
    PLATFORM_03("Platform 3", "com.grubhub.driver", "grubhub_driver", "food"),
    PLATFORM_04("Platform 4", "com.deliveroo.driverapp", "deliveroo_rider", "food"),
    PLATFORM_05("Platform 5", "com.justeat.courier.uk", "justeat_courier", "food"),
    PLATFORM_06("Platform 6", "com.takeaway.delivered4all", "takeaway_courier", "food"),
    PLATFORM_07("Platform 7", "com.lieferando.courier", "lieferando_courier", "food"),
    PLATFORM_08("Platform 8", "com.logistics.rider.foodpanda", "foodpanda_rider", "food"),
    PLATFORM_09("Platform 9", "in.swiggy.deliveryapp", "swiggy_delivery", "food"),
    PLATFORM_10("Platform 10", "com.zomato.delivery", "zomato_delivery", "food"),
    PLATFORM_11("Platform 11", "br.com.ifood.driver.app", "ifood_entregador", "food"),
    PLATFORM_12("Platform 12", "com.rappi.storekeeper", "rappi_repartidor", "food"),
    PLATFORM_13("Platform 13", "com.wolt.courierapp", "wolt_courier", "food"),
    PLATFORM_14("Platform 14", "com.logistics.rider.glovo", "glovo_courier", "food"),
    PLATFORM_15("Platform 15", "com.demaecan.PlatformcanDriver", "demaecan_driver", "food"),
    PLATFORM_16("Platform 16", "com.logistics.rider.talabat", "talabat_rider", "food"),
    PLATFORM_17("Platform 17", "com.menulog.courier", "menulog_courier", "food"),
    PLATFORM_18("Platform 18", "com.sankuai.sailor.courier", "keeta_rider", "food"),

    // Grocery
    PLATFORM_19("Platform 19", "com.instacart.shopper", "instacart_shopper", "grocery"),
    PLATFORM_20("Platform 20", "com.gopuff.godrive2.live", "gopuff_driver", "grocery"),
    PLATFORM_21("Platform 21", "app.blinkit.onboarding", "blinkit_partner", "grocery"),
    PLATFORM_22("Platform 22", "com.bigbasket.dapp.activity", "bigbasket_partner", "grocery"),
    PLATFORM_23("Platform 23", "com.mercadoenvios.crowdsourcing", "mercado_envios", "grocery"),
    PLATFORM_24("Platform 24", "au.com.woolworths.android.driver", "woolworths_driver", "grocery"),
    PLATFORM_25("Platform 25", "com.zepto.rider", "zepto_partner", "grocery"),
    PLATFORM_26("Platform 26", "com.flink.workforce", "flink_rider", "grocery"),
    PLATFORM_27("Platform 27", "com.shipt.shopper", "shipt_shopper", "grocery"),

    // Package
    PLATFORM_28("Platform 28", "com.amazon.flex.rabbit", "amazon_flex", "package"),
    PLATFORM_29("Platform 29", "com.ups.genesispd", "ups_driver", "package"),
    PLATFORM_30("Platform 30", "com.dunzo.partner", "dunzo_partner", "package"),
    PLATFORM_31("Platform 31", "com.lalamove.global.driver.sea", "lalamove_driver", "package"),
    PLATFORM_32("Platform 32", "global.dostavista.courier", "borzo_courier", "package"),

    // Courier
    PLATFORM_33("Platform 33", "com.postmates.android.courier", "postmates_fleet", "courier"),
    PLATFORM_34("Platform 34", "com.roadie.drive.android.app", "roadie_driver", "courier"),
    PLATFORM_35("Platform 35", "com.stuart.courier", "stuart_courier", "courier"),
    PLATFORM_36("Platform 36", "com.quadx.riderapp", "gogo_rider", "courier"),

    // Last-Mile
    AMAZON_RELAY("Platform 37", "com.amazon.relay", "amazon_relay", "last-mile"),
    EKART("Platform 38", "com.ekartkiranaonboarding", "ekart_partner", "last-mile"),
    EKART_FIELD("Platform 39", "com.ekart.logistics.app", "ekart_field", "last-mile"),
    JNE("Platform 40", "id.my.irsyadf.jobdriver", "jne_kurir", "last-mile"),
    ARAMEX("Platform 41", "com.aramex.ecourier", "aramex_courier", "last-mile"),
    NINJA_VAN("Platform 42", "co.ninjavan.swiftninja_global", "ninja_van_driver", "last-mile"),

    // Ride
    LYFT("Platform 43", "com.lyft.android.driver", "lyft_driver", "ride"),
    PLATFORM_37("Platform 44", "com.olacabs.oladriver", "ola_driver", "ride"),
    GRAB("Platform 45", "com.grabtaxi.driver2", "grab_driver", "ride"),
    CAREEM("Platform 46", "com.careem.adma", "careem_captain", "ride"),
    DIDI("Platform 47", "com.didiglobal.driver", "didi_driver", "ride"),
    BOLT("Platform 48", "ee.mtakso.driver", "bolt_driver", "ride"),

    // India-specific
    PORTER("Platform 49", "com.theporter.android.driverapp", "porter_partner", "package"),
    RAPIDO("Platform 50", "com.rapido.rider", "rapido_captain", "ride"),
    SHADOWFAX("Platform 51", "in.shadowfax.gandalf", "shadowfax_partner", "last-mile"),
    PLATFORM_38("Platform 52", "com.delhivery.delhiverypartner", "delhivery_partner", "last-mile"),
    ECOM_EXPRESS("Platform 53", "com.ecomexpress.oneBoarding", "ecom_express", "last-mile"),
    XPRESSBEES("Platform 54", "com.xpressbees.unified_new_arch", "xpressbees", "last-mile"),
    LETSTRANSPORT("Platform 55", "in.letstransport.supply", "letstransport_partner", "courier"),
    BLOWHORN("Platform 56", "net.blowhorn.driverapp", "blowhorn_driver", "courier"),
    DRIVEU("Platform 57", "com.driveu.partner", "driveu_partner", "ride"),
    YULU("Platform 58", "app.yulu.android.partner", "yulu_partner", "ride"),
    GOJEK("Platform 59", "com.gojek.partner", "gojek_driver", "food"),
    MEITUAN("Platform 60", "com.sankuai.meituan", "meituan", "food"),
    ELE_ME("Platform 61", "me.ele", "ele_me", "food"),
    GORILLAS("Platform 62", "com.gorillasapp", "gorillas", "grocery"),
    GETIR("Platform 63", "com.getir", "getir", "grocery"),
    FEDEX("Platform 64", "com.fedex.android.apps.fedexmobile", "fedex", "package"),
    PLATFORM_39("Platform 65", "com.dhl.parcel.uk", "dhl", "package"),
    SF_EXPRESS("Platform 66", "com.sf.activity", "sf_express", "last-mile"),
    CAPSULE("Platform 67", "com.capsule.pharmacy", "capsule", "medical"),
    NOWRX("Platform 68", "com.nowrx.android", "nowrx", "medical"),
    PHARMEASY("Platform 69", "com.indpro.pharmeasy", "pharmeasy", "medical"),
    NETMEDS("Platform 70", "com.netmeds.android", "netmeds", "medical"),
    ONE_MG("Platform 71", "com.aranoah.healthkart.plus", "1mg", "medical"),
    DRIZLY("Platform 72", "com.drizly.drizly", "drizly", "alcohol"),
    MINIBAR("Platform 73", "com.minibar.android", "minibar", "alcohol"),
    SAUCEY("Platform 74", "com.saucey.android", "saucey", "alcohol"),
    HIPBAR("Platform 75", "com.hipbar.android", "hipbar", "alcohol"),
    BLOOMNATION("Platform 76", "com.bloomnation.bloomnation", "bloomnation", "flower"),
    FLOWERS_1800("Platform 77", "com.ftd.app.bloom", "1800_flowers", "flower"),
    INTERFLORA("Platform 78", "com.interflora.android", "interflora", "flower"),
    FERNS_PETALS("Platform 79", "com.fnp.android", "ferns_petals", "flower"),
    RINSE("Platform 80", "com.rinse.app", "rinse", "laundry"),
    FLYCLEANERS("Platform 81", "com.flycleaners.android", "flycleaners", "laundry"),
    LAUNDROKART("Platform 82", "com.laundrokart.app", "laundrokart", "laundry"),
    PRESSO("Platform 83", "com.presso.app", "presso", "laundry"),
    CHEWY("Platform 84", "com.chewy.android", "chewy", "pet-supplies"),
    PETS_AT_HOME("Platform 85", "com.petsathome.android", "pets_at_home", "pet-supplies"),
    HEADS_UP_FOR_TAILS("Platform 86", "com.hutf.android", "heads_up_for_tails", "pet-supplies"),
    WAYFAIR_DELIVERY("Platform 87", "com.wayfair.wayfair", "wayfair_delivery", "furniture"),
    CASTLERY("Platform 88", "com.castlery.app", "castlery", "furniture"),
    URBAN_LADDER("Platform 89", "com.urbanladder.app", "urban_ladder", "furniture"),
    COURIER_PLEASE("Platform 90", "com.couriersplease.app", "courier_please", "bicycle-courier"),
    DEX("Platform 91", "com.dex.android", "dex", "document"),
    COURIIRE("Platform 92", "com.couriire.app", "couriire", "document"),
    CAINIAO("Platform 93", "com.cainiao.wireless.dumps", "cainiao", "same-day"),
    XPO("Platform 94", "com.xpo.logistics", "xpo", "white-glove"),
    JD_LOGISTICS("Platform 95", "com.jingdong.app.mall", "jd_logistics", "white-glove"),
    EAZE("Platform 96", "com.eaze.android", "eaze", "cannabis"),
    DUTCHIE("Platform 97", "com.dutchie.android", "dutchie", "cannabis"),
    CONVOY("Platform 98", "com.convoy.driverapp", "convoy", "freight"),
    BLACKBUCK("Platform 99", "com.blackbuck.driver", "blackbuck", "freight"),
    DOMINOS_INDIA("Platform 100", "com.dominos", "dominos_india", "qsr"),
    DOMINOS_US("Platform 101", "com.dominos.android", "dominos_us", "qsr"),
    PIZZA_HUT_INDIA("Platform 102", "com.pizzahut.android", "pizza_hut_india", "qsr"),
    PIZZA_HUT("Platform 103", "com.pizzahut.android.global", "pizza_hut", "qsr"),
    PAPA_JOHNS("Platform 104", "com.papajohns.android", "papa_johns", "qsr"),
    MCDELIVERY_INDIA("Platform 105", "com.mcdonalds.mcdeliveryindia", "mcdelivery_india", "qsr"),
    MCDONALDS("Platform 106", "com.mcdonalds.app", "mcdonalds", "qsr"),
    BURGER_KING_INDIA("Platform 107", "com.bkindia", "burger_king_india", "qsr"),
    BURGER_KING("Platform 108", "com.bk", "burger_king", "qsr"),
    WENDYS("Platform 109", "com.wendys.nutritiontool", "wendys", "qsr"),
    FIVE_GUYS("Platform 110", "com.fiveguys.android", "five_guys", "qsr"),
    KFC_INDIA("Platform 111", "com.kfc.india", "kfc_india", "qsr"),
    KFC("Platform 112", "com.kfc.android", "kfc", "qsr"),
    CHICK_FIL_A("Platform 113", "com.chickfila.app", "chick_fil_a", "qsr"),
    POPEYES("Platform 114", "com.popeyes.android", "popeyes", "qsr"),
    CHIPOTLE("Platform 115", "com.chipotle.android", "chipotle", "qsr"),
    TACO_BELL("Platform 116", "com.tacobell", "taco_bell", "qsr"),
    SUBWAY("Platform 117", "com.subway.subwaymobile", "subway", "qsr"),
    PANERA("Platform 118", "com.panera.bread", "panera", "qsr"),
    STARBUCKS("Platform 119", "com.starbucks.mobilecard", "starbucks", "qsr"),
    STARBUCKS_INDIA("Platform 120", "com.starbucks.in", "starbucks_india", "qsr"),
    DUNKIN("Platform 121", "com.dunkinbrands.dunkindonuts", "dunkin", "qsr"),
    TIM_HORTONS("Platform 122", "com.timhortons.app", "tim_hortons", "qsr"),
    EATSURE("Platform 123", "com.eatsure", "eatsure", "qsr"),
    BOX8("Platform 124", "com.box8.app", "box8", "qsr"),
    BEHROUZ("Platform 125", "com.faasos.behrouz", "behrouz", "qsr"),
    CHAAYOS("Platform 126", "com.chaayos", "chaayos", "qsr"),
    WOW_MOMO("Platform 127", "com.wowmomo", "wow_momo", "qsr"),
    FAASOS("Platform 128", "com.faasos", "faasos", "qsr"),
    OVEN_STORY("Platform 129", "com.faasos.ovenstory", "oven_story", "qsr"),
    MANDARIN_FOX("Platform 130", "com.faasos.mandarinfox", "mandarin_fox", "qsr"),
    THE_BOWL_COMPANY("Platform 131", "com.faasos.bowlcompany", "the_bowl_company", "qsr"),
    LENOTRE_DESSERT("Platform 132", "com.lenotre.android", "lenotre_dessert", "qsr"),
}
