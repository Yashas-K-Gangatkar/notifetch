package com.notifetch.app.util

object Constants {

    const val DATABASE_NAME = "notifetch_db"
    const val BASE_URL = "https://d2-liart-nine.vercel.app/"
    const val NOTIFICATION_CHANNEL_ID = "notifetch_channel"
    const val NOTIFICATION_CHANNEL_NAME = "NotiFetch Service"
    const val SYNC_WORK_NAME = "notifetch_sync_work"
    const val PREFS_NAME = "notifetch_prefs"

    // Partner/Driver app packages (NOT customer apps)
    val PARTNER_PACKAGES = mapOf(
        "in.swiggy.partner" to "Swiggy Partner",
        "in.swiggy.deliveryapp" to "Swiggy Delivery",
        "com.zomato.delivery" to "Zomato Delivery",
        "com.zomato.deliverypartner" to "Zomato Delivery Partner",
        "com.amazon.flex" to "Amazon Flex",
        "com.zepto.cafepartner" to "Zepto Cafe Partner",
        "com.grofers.partnerapp" to "Blinkit Partner",
        "com.bigbasket.partnerapp" to "BigBasket Partner",
        "com.dunzo.partner" to "Dunzo Partner",
        "com.porter.porterpartner" to "Porter Partner",
        "com.rapido.captain" to "Rapido Captain",
        "com.olacabs.driver" to "Ola Driver",
        "com.ubercab.driver" to "Uber Driver",
        "com.flipkart.logistics" to "Flipkart Logistics",
        "com.shadowfax.partner" to "Shadowfax Partner"
    )

    // Source identifiers for API
    val PLATFORM_SOURCES = mapOf(
        "in.swiggy.partner" to "swiggy_partner",
        "in.swiggy.deliveryapp" to "swiggy_delivery",
        "com.zomato.delivery" to "zomato_delivery",
        "com.zomato.deliverypartner" to "zomato_delivery_partner",
        "com.amazon.flex" to "amazon_flex",
        "com.zepto.cafepartner" to "zepto_cafe_partner",
        "com.grofers.partnerapp" to "blinkit_partner",
        "com.bigbasket.partnerapp" to "bigbasket_partner",
        "com.dunzo.partner" to "dunzo_partner",
        "com.porter.porterpartner" to "porter_partner",
        "com.rapido.captain" to "rapido_captain",
        "com.olacabs.driver" to "ola_driver",
        "com.ubercab.driver" to "uber_driver",
        "com.flipkart.logistics" to "flipkart_logistics",
        "com.shadowfax.partner" to "shadowfax_partner"
    )

    // Platform brand colors (hex strings for reference)
    val PLATFORM_COLORS = mapOf(
        "Swiggy Partner" to "#FC8019",
        "Swiggy Delivery" to "#FC8019",
        "Zomato Delivery" to "#E23744",
        "Zomato Delivery Partner" to "#E23744",
        "Amazon Flex" to "#FF9900",
        "Zepto Cafe Partner" to "#8B008B",
        "Blinkit Partner" to "#F8E71C",
        "BigBasket Partner" to "#84C225",
        "Dunzo Partner" to "#00D290",
        "Porter Partner" to "#2E5BFF",
        "Rapido Captain" to "#FFCC00",
        "Ola Driver" to "#36B37E",
        "Uber Driver" to "#000000",
        "Flipkart Logistics" to "#2874F0",
        "Shadowfax Partner" to "#FF6B35"
    )

    // Time constants
    const val SYNC_INTERVAL_MINUTES = 15L
    const val MAX_NOTIFICATION_AGE_DAYS = 30
}

enum class PlatformSource(val displayName: String, val packageName: String, val sourceId: String) {
    SWIGGY_PARTNER("Swiggy Partner", "in.swiggy.partner", "swiggy_partner"),
    SWIGGY_DELIVERY("Swiggy Delivery", "in.swiggy.deliveryapp", "swiggy_delivery"),
    ZOMATO_DELIVERY("Zomato Delivery", "com.zomato.delivery", "zomato_delivery"),
    ZOMATO_PARTNER("Zomato Delivery Partner", "com.zomato.deliverypartner", "zomato_delivery_partner"),
    AMAZON_FLEX("Amazon Flex", "com.amazon.flex", "amazon_flex"),
    ZEPTO_PARTNER("Zepto Cafe Partner", "com.zepto.cafepartner", "zepto_cafe_partner"),
    BLINKIT_PARTNER("Blinkit Partner", "com.grofers.partnerapp", "blinkit_partner"),
    BIGBASKET_PARTNER("BigBasket Partner", "com.bigbasket.partnerapp", "bigbasket_partner"),
    DUNZO_PARTNER("Dunzo Partner", "com.dunzo.partner", "dunzo_partner"),
    PORTER_PARTNER("Porter Partner", "com.porter.porterpartner", "porter_partner"),
    RAPIDO_CAPTAIN("Rapido Captain", "com.rapido.captain", "rapido_captain"),
    OLA_DRIVER("Ola Driver", "com.olacabs.driver", "ola_driver"),
    UBER_DRIVER("Uber Driver", "com.ubercab.driver", "uber_driver"),
    FLIPKART_LOGISTICS("Flipkart Logistics", "com.flipkart.logistics", "flipkart_logistics"),
    SHADOWFAX_PARTNER("Shadowfax Partner", "com.shadowfax.partner", "shadowfax_partner")
}
