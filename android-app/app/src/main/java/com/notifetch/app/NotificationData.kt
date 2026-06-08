package com.notifetch.app

import androidx.room.Entity
import androidx.room.PrimaryKey
import androidx.room.TypeConverters

/**
 * Data model representing a captured notification from a delivery partner app.
 */
@Entity(tableName = "notifications")
data class NotificationData(
    @PrimaryKey
    val id: String,
    val title: String,
    val body: String,
    val source: String,          // Platform display name (e.g. "Swiggy Partner")
    val packageName: String,     // Android package name (e.g. "in.swiggy.partner")
    val timestamp: Long,
    val isRead: Boolean = false,
    val isForwarded: Boolean = false,   // Whether it was sent to backend
    val category: String = "",          // Order, Chat, System, etc.
    val subText: String = "",           // Notification sub-text
    val bigTitle: String = "",          // Expanded title
    val progress: Int = -1,             // Progress bar value (-1 = indeterminate/no progress)
    val largeIcon: String = "",         // Large icon URI if available
)

/**
 * API request body for forwarding a notification to the NotiFetch backend.
 */
data class NotificationForwardRequest(
    val title: String,
    val body: String,
    val source: String,
    val sourceIcon: String,      // Package name used as icon identifier
    val timestamp: Long,
    val packageName: String,
    val category: String = "",
)

/**
 * API response from the NotiFetch backend.
 */
data class NotificationForwardResponse(
    val success: Boolean,
    val id: String? = null,
    val error: String? = null,
)

/**
 * Known delivery partner app package names and their display names.
 */
object DeliveryPartners {
    val PACKAGES: Map<String, DeliveryPartnerInfo> = mapOf(
        "in.swiggy.partner" to DeliveryPartnerInfo("Swiggy Partner", "food", "🟠"),
        "in.swiggy.delivery" to DeliveryPartnerInfo("Swiggy Delivery", "food", "🟠"),
        "com.swiggy.app" to DeliveryPartnerInfo("Swiggy", "food", "🟠"),
        "com.zomato.delivery" to DeliveryPartnerInfo("Zomato Delivery", "food", "🔴"),
        "com.zomato.rider" to DeliveryPartnerInfo("Zomato Rider", "food", "🔴"),
        "com.application.zomato" to DeliveryPartnerInfo("Zomato", "food", "🔴"),
        "com.amazon.flex" to DeliveryPartnerInfo("Amazon Flex", "package", "🟡"),
        "com.amazon.rabbit" to DeliveryPartnerInfo("Amazon Rabbit", "package", "🟡"),
        "com.dunzo.delivery" to DeliveryPartnerInfo("Dunzo", "grocery", "🟢"),
        "com.porter.delivery" to DeliveryPartnerInfo("Porter", "package", "🔵"),
        "in.zepto.rider" to DeliveryPartnerInfo("Zepto Rider", "grocery", "🟣"),
        "com.blinkit.rider" to DeliveryPartnerInfo("Blinkit Rider", "grocery", "🟡"),
        "in.ubereats.partner" to DeliveryPartnerInfo("Uber Eats Partner", "food", "⚫"),
        "com.ola.partner" to DeliveryPartnerInfo("Ola Partner", "ride", "🟢"),
        "in.gojek.driver" to DeliveryPartnerInfo("Gojek Driver", "ride", "🟢"),
        "com.rapido.driver" to DeliveryPartnerInfo("Rapido Driver", "ride", "🟡"),
        "com.ubercab" to DeliveryPartnerInfo("Uber Driver", "ride", "⚫"),
        "com.lyft.driver" to DeliveryPartnerInfo("Lyft Driver", "ride", "🩷"),
        "com.doordash.driverapp" to DeliveryPartnerInfo("DoorDash Dasher", "food", "🔴"),
        "com.grubhub.driverapp" to DeliveryPartnerInfo("Grubhub Driver", "food", "🟠"),
        "com.instacart.shopper" to DeliveryPartnerInfo("Instacart Shopper", "grocery", "🟢"),
        "com.postmates" to DeliveryPartnerInfo("Postmates", "food", "⚫"),
        "com.shippoh.driver" to DeliveryPartnerInfo("ShipPoh Driver", "package", "🟠"),
        "com.shadowfax.user" to DeliveryPartnerInfo("Shadowfax", "package", "🟣"),
        "com.wefast.driver" to DeliveryPartnerInfo("Wefast", "package", "🔵"),
        "in.deliveryhero.partner" to DeliveryPartnerInfo("Delivery Hero", "food", "🟠"),
    )

    fun getPartner(packageName: String): DeliveryPartnerInfo? = PACKAGES[packageName]

    fun getAllCategories(): List<String> = PACKAGES.values
        .map { it.category }
        .distinct()
        .sorted()

    fun getPartnersByCategory(category: String): List<DeliveryPartnerInfo> =
        PACKAGES.values.filter { it.category == category }
}

data class DeliveryPartnerInfo(
    val displayName: String,
    val category: String,    // food, grocery, package, ride
    val emoji: String,       // Display emoji for the platform
)

/**
 * Category display names and colors.
 */
object CategoryInfo {
    private val CATEGORY_MAP = mapOf(
        "food" to CategoryDetail("Food Delivery", "#f59e0b"),
        "grocery" to CategoryDetail("Grocery Delivery", "#22c55e"),
        "package" to CategoryDetail("Package Delivery", "#3b82f6"),
        "ride" to CategoryDetail("Ride/Transport", "#a855f7"),
    )

    fun getDetail(category: String): CategoryDetail? = CATEGORY_MAP[category]

    fun getAll(): Map<String, CategoryDetail> = CATEGORY_MAP
}

data class CategoryDetail(
    val displayName: String,
    val color: String,
)
