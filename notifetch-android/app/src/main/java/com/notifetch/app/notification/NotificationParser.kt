package com.notifetch.app.notification

import android.os.Bundle
import com.notifetch.app.util.Helpers

/**
 * Parses notification content per delivery platform.
 * Each platform has different notification formats, so we extract
 * order value, pickup/dropoff locations, distance, and other relevant data
 * using platform-specific patterns.
 *
 * Supports worldwide currencies and multiple languages.
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

        val orderValue = Helpers.extractOrderValue(combinedText)
        val pickupLocation = extractPickupLocation(combinedText)
        val dropoffLocation = extractDropoffLocation(combinedText)
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

    private fun extractPickupLocation(text: String): String? {
        val pickupPatterns = listOf(
            Regex("""(?:pick(?:up|[- ]?up)?(?:\s+(?:from|at|location))?)[:\s]+([A-Za-z0-9\s,.\-']+?)(?:\n|,|\.|$|→|to|drop)""", RegexOption.IGNORE_CASE),
            Regex("""(?:from|collect from|retrieve from)[:\s]+([A-Za-z0-9\s,.\-']+?)(?:\n|,|\.|$|→|to|drop)""", RegexOption.IGNORE_CASE),
            Regex("""(?:restaurant|store|shop|merchant|hub|depot|warehouse)[:\s]+([A-Za-z0-9\s,.\-']+?)(?:\n|,|\.|$)""", RegexOption.IGNORE_CASE),
            // Japanese: 受取 (pickup)
            Regex("""(?:受取|集荷|ピックアップ)[:\s]*([^\n,\.]+)"""),
            // Portuguese: retirar em
            Regex("""(?:retirar\s+(?:em|no|na))[:\s]+([A-Za-z0-9\s,.\-']+?)(?:\n|,|\.|$)""", RegexOption.IGNORE_CASE),
            // Spanish: recoger en
            Regex("""(?:recoger\s+(?:en|del))[:\s]+([A-Za-z0-9\s,.\-']+?)(?:\n|,|\.|$)""", RegexOption.IGNORE_CASE),
            // Arabic: استلام من (pickup from)
            Regex("""(?:استلام\s+من)[:\s]+([^\n,\.]+)"""),
            // Indonesian: ambil di
            Regex("""(?:ambil\s+di)[:\s]+([A-Za-z0-9\s,.\-']+?)(?:\n|,|\.|$)""", RegexOption.IGNORE_CASE),
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

    private fun extractDropoffLocation(text: String): String? {
        val dropPatterns = listOf(
            Regex("""(?:drop(?:off|[- ]?off)?(?:\s+(?:to|at|location))?)[:\s]+([A-Za-z0-9\s,.\-']+?)(?:\n|,|\.|$)""", RegexOption.IGNORE_CASE),
            Regex("""(?:deliver(?:y)?(?:\s+to)?)[:\s]+([A-Za-z0-9\s,.\-']+?)(?:\n|,|\.|$)""", RegexOption.IGNORE_CASE),
            Regex("""(?:to|→|➡)\s+([A-Za-z0-9\s,.\-']+?)(?:\n|,|\.|$)""", RegexOption.IGNORE_CASE),
            // Japanese: 届け先 (delivery destination)
            Regex("""(?:届け先|配達先|納品先)[:\s]*([^\n,\.]+)"""),
            // Portuguese: entregar em
            Regex("""(?:entregar\s+(?:em|no|na))[:\s]+([A-Za-z0-9\s,.\-']+?)(?:\n|,|\.|$)""", RegexOption.IGNORE_CASE),
            // Spanish: entregar en
            Regex("""(?:entregar\s+(?:en|al))[:\s]+([A-Za-z0-9\s,.\-']+?)(?:\n|,|\.|$)""", RegexOption.IGNORE_CASE),
            // Arabic: توصيل إلى (deliver to)
            Regex("""(?:توصيل\s+إلى)[:\s]+([^\n,\.]+)"""),
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
            // New order / delivery available
            combined.contains("new order") || combined.contains("order available") ||
            combined.contains("new delivery") || combined.contains("delivery available") ||
            combined.contains("new trip") || combined.contains("ride request") ||
            combined.contains("new ride") || combined.contains("nova corrida") || // Portuguese
            combined.contains("nuevo pedido") || combined.contains("nueva entrega") || // Spanish
            combined.contains("新しい注文") || combined.contains("配達依頼") || // Japanese
            combined.contains("pesanan baru") || // Indonesian
            combined.contains("طلب جديد") || // Arabic
            combined.contains("新订单") -> "NEW_ORDER" // Chinese

            // Order update
            combined.contains("accepted") || combined.contains("confirmed") ||
            combined.contains("picked up") || combined.contains("on the way") ||
            combined.contains("order assigned") || combined.contains("a caminho") || // Portuguese
            combined.contains("en camino") || combined.contains("aceptado") || // Spanish
            combined.contains("配達中") || combined.contains("受取済み") -> "ORDER_UPDATE" // Japanese

            // Completed
            combined.contains("delivered") || combined.contains("completed") ||
            combined.contains("finished") || combined.contains("trip completed") ||
            combined.contains("entregue") || // Portuguese
            combined.contains("entregado") || // Spanish
            combined.contains("配達完了") || combined.contains("完了") -> "COMPLETED" // Japanese

            // Cancelled
            combined.contains("cancelled") || combined.contains("rejected") ||
            combined.contains("expired") || combined.contains("missed") ||
            combined.contains("cancelado") || // Portuguese/Spanish
            combined.contains("キャンセル") -> "CANCELLED" // Japanese

            // Earnings
            combined.contains("earnings") || combined.contains("payout") ||
            combined.contains("payment") || combined.contains("incentive") ||
            combined.contains("bonus") || combined.contains("ganhos") || // Portuguese
            combined.contains("ganancias") || combined.contains("pago") || // Spanish
            combined.contains("収入") || combined.contains("報酬") -> "EARNINGS" // Japanese

            // Availability
            combined.contains("go online") || combined.contains("you're online") ||
            combined.contains("shift") || combined.contains("batch") ||
            combined.contains("fique online") || // Portuguese
            combined.contains("conéctate") || // Spanish
            combined.contains("オンライン") -> "AVAILABILITY" // Japanese

            else -> "GENERAL"
        }
    }
}
