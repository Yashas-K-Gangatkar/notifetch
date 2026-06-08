package com.notifetch.app.notification

import android.os.Bundle
import com.notifetch.app.util.Helpers

/**
 * Parses notification content per delivery platform.
 * Each platform has different notification formats, so we extract
 * order value, pickup/dropoff locations, distance, and other relevant data
 * using platform-specific patterns.
 */
object NotificationParser {

    data class ParsedNotification(
        val platform: String,
        val source: String,
        val title: String,
        val body: String,
        val bigText: String,
        val subText: String,
        val orderValue: Double?,
        val pickupLocation: String?,
        val dropoffLocation: String?,
        val distance: String?,
        val category: String?
    )

    fun parse(
        platform: String,
        source: String,
        title: String,
        text: String,
        bigText: String,
        subText: String,
        extras: Bundle?
    ): ParsedNotification {
        val combinedText = "$title $text $bigText $subText"

        val orderValue = extractOrderValue(platform, combinedText)
        val pickupLocation = extractPickupLocation(platform, combinedText)
        val dropoffLocation = extractDropoffLocation(platform, combinedText)
        val distance = Helpers.extractDistance(combinedText)
        val category = categorizeNotification(platform, title, combinedText)

        return ParsedNotification(
            platform = platform,
            source = source,
            title = title,
            body = text,
            bigText = bigText,
            subText = subText,
            orderValue = orderValue,
            pickupLocation = pickupLocation,
            dropoffLocation = dropoffLocation,
            distance = distance,
            category = category
        )
    }

    private fun extractOrderValue(platform: String, text: String): Double? {
        // Platform-specific patterns for extracting order/delivery value
        val valuePattern = when {
            platform.contains("Swiggy", ignoreCase = true) ->
                Regex("""(?:delivery fee|earn|payout|₹)\s*₹?\s*(\d+(?:\.\d{1,2})?)""", RegexOption.IGNORE_CASE)
            platform.contains("Zomato", ignoreCase = true) ->
                Regex("""(?:earn|delivery fee|payout|₹)\s*₹?\s*(\d+(?:\.\d{1,2})?)""", RegexOption.IGNORE_CASE)
            platform.contains("Amazon", ignoreCase = true) ->
                Regex("""(?:earn|block|payout|₹)\s*₹?\s*(\d+(?:\.\d{1,2})?)""", RegexOption.IGNORE_CASE)
            platform.contains("Zepto", ignoreCase = true) ->
                Regex("""(?:earn|delivery|payout|₹)\s*₹?\s*(\d+(?:\.\d{1,2})?)""", RegexOption.IGNORE_CASE)
            platform.contains("Blinkit", ignoreCase = true) ->
                Regex("""(?:earn|delivery|payout|₹)\s*₹?\s*(\d+(?:\.\d{1,2})?)""", RegexOption.IGNORE_CASE)
            platform.contains("BigBasket", ignoreCase = true) ->
                Regex("""(?:earn|delivery|payout|₹)\s*₹?\s*(\d+(?:\.\d{1,2})?)""", RegexOption.IGNORE_CASE)
            platform.contains("Dunzo", ignoreCase = true) ->
                Regex("""(?:earn|delivery|payout|₹)\s*₹?\s*(\d+(?:\.\d{1,2})?)""", RegexOption.IGNORE_CASE)
            platform.contains("Porter", ignoreCase = true) ->
                Regex("""(?:earn|fare|payout|₹)\s*₹?\s*(\d+(?:\.\d{1,2})?)""", RegexOption.IGNORE_CASE)
            platform.contains("Rapido", ignoreCase = true) ->
                Regex("""(?:earn|fare|payout|₹)\s*₹?\s*(\d+(?:\.\d{1,2})?)""", RegexOption.IGNORE_CASE)
            platform.contains("Ola", ignoreCase = true) ->
                Regex("""(?:earn|fare|payout|₹)\s*₹?\s*(\d+(?:\.\d{1,2})?)""", RegexOption.IGNORE_CASE)
            platform.contains("Uber", ignoreCase = true) ->
                Regex("""(?:earn|fare|trip|₹)\s*₹?\s*(\d+(?:\.\d{1,2})?)""", RegexOption.IGNORE_CASE)
            platform.contains("Flipkart", ignoreCase = true) ->
                Regex("""(?:earn|delivery|payout|₹)\s*₹?\s*(\d+(?:\.\d{1,2})?)""", RegexOption.IGNORE_CASE)
            platform.contains("Shadowfax", ignoreCase = true) ->
                Regex("""(?:earn|delivery|payout|₹)\s*₹?\s*(\d+(?:\.\d{1,2})?)""", RegexOption.IGNORE_CASE)
            else ->
                Regex("""₹\s*(\d+(?:\.\d{1,2})?)""")
        }

        val match = valuePattern.find(text)
        return match?.groupValues?.get(1)?.toDoubleOrNull()
    }

    private fun extractPickupLocation(platform: String, text: String): String? {
        // Common patterns for pickup location extraction
        val pickupPatterns = listOf(
            Regex("""(?:pick(?:up|[- ]?up)?(?:\s+(?:from|at|location))?)[:\s]+([A-Za-z0-9\s,.-]+?)(?:\n|,|\.|$|→|→|to|drop)""", RegexOption.IGNORE_CASE),
            Regex("""(?:from|collect from)[:\s]+([A-Za-z0-9\s,.-]+?)(?:\n|,|\.|$|→|→|to|drop)""", RegexOption.IGNORE_CASE),
            Regex("""(?:restaurant|store|shop|merchant|hub)[:\s]+([A-Za-z0-9\s,.-]+?)(?:\n|,|\.|$)""", RegexOption.IGNORE_CASE)
        )

        for (pattern in pickupPatterns) {
            val match = pattern.find(text)
            if (match != null) {
                val location = match.groupValues[1].trim()
                if (location.isNotBlank() && location.length > 2) {
                    return location
                }
            }
        }
        return null
    }

    private fun extractDropoffLocation(platform: String, text: String): String? {
        val dropPatterns = listOf(
            Regex("""(?:drop(?:off|[- ]?off)?(?:\s+(?:to|at|location))?)[:\s]+([A-Za-z0-9\s,.-]+?)(?:\n|,|\.|$)""", RegexOption.IGNORE_CASE),
            Regex("""(?:deliver(?:y)?(?:\s+to)?)[:\s]+([A-Za-z0-9\s,.-]+?)(?:\n|,|\.|$)""", RegexOption.IGNORE_CASE),
            Regex("""(?:to|→|➡)\s+([A-Za-z0-9\s,.-]+?)(?:\n|,|\.|$)""", RegexOption.IGNORE_CASE)
        )

        for (pattern in dropPatterns) {
            val match = pattern.find(text)
            if (match != null) {
                val location = match.groupValues[1].trim()
                if (location.isNotBlank() && location.length > 2) {
                    return location
                }
            }
        }
        return null
    }

    private fun categorizeNotification(platform: String, title: String, text: String): String {
        val combined = "$title $text".lowercase()

        return when {
            combined.contains("new order") || combined.contains("order available") ||
            combined.contains("new delivery") || combined.contains("delivery available") ||
            combined.contains("new trip") || combined.contains("ride request") ||
            combined.contains("new ride") -> "NEW_ORDER"

            combined.contains("accepted") || combined.contains("confirmed") ||
            combined.contains("picked up") || combined.contains("on the way") ||
            combined.contains("order assigned") -> "ORDER_UPDATE"

            combined.contains("delivered") || combined.contains("completed") ||
            combined.contains("finished") || combined.contains("trip completed") -> "COMPLETED"

            combined.contains("cancelled") || combined.contains("rejected") ||
            combined.contains("expired") || combined.contains("missed") -> "CANCELLED"

            combined.contains("earnings") || combined.contains("payout") ||
            combined.contains("payment") || combined.contains("incentive") ||
            combined.contains("bonus") -> "EARNINGS"

            combined.contains("go online") || combined.contains("you're online") ||
            combined.contains("shift") || combined.contains("batch") -> "AVAILABILITY"

            else -> "GENERAL"
        }
    }
}
