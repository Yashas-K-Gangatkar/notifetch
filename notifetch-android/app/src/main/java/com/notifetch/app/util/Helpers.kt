package com.notifetch.app.util

import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import java.util.TimeZone
import java.util.UUID

object Helpers {

    fun generateUniqueId(): String = UUID.randomUUID().toString()

    fun formatTimestamp(timestamp: Long): String {
        val sdf = SimpleDateFormat("dd MMM yyyy, HH:mm", Locale.getDefault())
        return sdf.format(Date(timestamp))
    }

    fun formatTimeAgo(timestamp: Long): String {
        val now = System.currentTimeMillis()
        val diff = now - timestamp

        return when {
            diff < 60_000 -> "Just now"
            diff < 3_600_000 -> "${diff / 60_000}m ago"
            diff < 86_400_000 -> "${diff / 3_600_000}h ago"
            diff < 604_800_000 -> "${diff / 86_400_000}d ago"
            else -> formatTimestamp(timestamp)
        }
    }

    /**
     * Format currency based on the currency code.
     * Supports multi-currency for worldwide platforms.
     */
    fun formatCurrency(value: Double?, currency: String = "INR"): String {
        if (value == null) return "—"
        return when (currency) {
            "INR" -> "₹${String.format(Locale.getDefault(), "%.0f", value)}"
            "USD", "CAD", "AUD", "SGD" -> "$${String.format(Locale.getDefault(), "%.2f", value)}"
            "EUR" -> "€${String.format(Locale.getDefault(), "%.2f", value)}"
            "GBP" -> "£${String.format(Locale.getDefault(), "%.2f", value)}"
            "JPY" -> "¥${String.format(Locale.getDefault(), "%.0f", value)}"
            "BRL" -> "R$${String.format(Locale.getDefault(), "%.2f", value)}"
            "AED", "SAR" -> "${String.format(Locale.getDefault(), "%.2f", value)} ${currency}"
            "CNY" -> "¥${String.format(Locale.getDefault(), "%.2f", value)}"
            "KRW" -> "₩${String.format(Locale.getDefault(), "%.0f", value)}"
            "THB" -> "฿${String.format(Locale.getDefault(), "%.2f", value)}"
            "PHP" -> "₱${String.format(Locale.getDefault(), "%.2f", value)}"
            "IDR" -> "Rp${String.format(Locale.getDefault(), "%.0f", value)}"
            "MXN", "COP", "CLP", "ARS" -> "${String.format(Locale.getDefault(), "%.0f", value)} ${currency}"
            "TRY" -> "₺${String.format(Locale.getDefault(), "%.2f", value)}"
            "ZAR" -> "R${String.format(Locale.getDefault(), "%.2f", value)}"
            "MYR" -> "RM${String.format(Locale.getDefault(), "%.2f", value)}"
            "NGN" -> "₦${String.format(Locale.getDefault(), "%.0f", value)}"
            "EGP" -> "E£${String.format(Locale.getDefault(), "%.2f", value)}"
            "ILS" -> "₪${String.format(Locale.getDefault(), "%.2f", value)}"
            "SEK", "PLN" -> "${String.format(Locale.getDefault(), "%.2f", value)} ${currency}"
            else -> "${String.format(Locale.getDefault(), "%.2f", value)} ${currency}"
        }
    }

    fun formatIsoDate(timestamp: Long): String {
        val sdf = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'", Locale.US)
        sdf.timeZone = TimeZone.getTimeZone("UTC")
        return sdf.format(Date(timestamp))
    }

    fun startOfDayTimestamp(): Long {
        val calendar = java.util.Calendar.getInstance()
        calendar.set(java.util.Calendar.HOUR_OF_DAY, 0)
        calendar.set(java.util.Calendar.MINUTE, 0)
        calendar.set(java.util.Calendar.SECOND, 0)
        calendar.set(java.util.Calendar.MILLISECOND, 0)
        return calendar.timeInMillis
    }

    fun startOfWeekTimestamp(): Long {
        val calendar = java.util.Calendar.getInstance()
        calendar.set(java.util.Calendar.DAY_OF_WEEK, calendar.firstDayOfWeek)
        calendar.set(java.util.Calendar.HOUR_OF_DAY, 0)
        calendar.set(java.util.Calendar.MINUTE, 0)
        calendar.set(java.util.Calendar.SECOND, 0)
        calendar.set(java.util.Calendar.MILLISECOND, 0)
        return calendar.timeInMillis
    }

    // REMOVED: extrasToJson() — storing raw notification extras violates data minimization
    // under GDPR Art. 5(1)(c) and may contain PII, auth tokens, or data beyond
    // what the user can see. Only visible notification content is stored.

    /**
     * Extract order value from text using multiple currency patterns.
     * Supports: ₹, $, €, £, ¥, ₩, R$, ฿, ₱, Rp, AED, etc.
     */
    fun extractOrderValue(text: String): Double? {
        val patterns = listOf(
            Regex("""₹\s*(\d+(?:,\d+)*(?:\.\d{1,2})?)"""),
            Regex("""(?:Rs\.?|INR)\s*(\d+(?:,\d+)*(?:\.\d{1,2})?)"""),
            Regex("""\$\s*(\d+(?:,\d+)*(?:\.\d{1,2})?)"""),
            Regex("""€\s*(\d+(?:,\d+)*(?:\.\d{1,2})?)"""),
            Regex("""£\s*(\d+(?:,\d+)*(?:\.\d{1,2})?)"""),
            Regex("""¥\s*(\d+(?:,\d+)*)"""),
            Regex("""₩\s*(\d+(?:,\d+)*)"""),
            Regex("""R\$\s*(\d+(?:,\d+)*(?:\.\d{1,2})?)"""),
            Regex("""฿\s*(\d+(?:,\d+)*(?:\.\d{1,2})?)"""),
            Regex("""₱\s*(\d+(?:,\d+)*(?:\.\d{1,2})?)"""),
            Regex("""Rp\s*(\d+(?:,\d+)*)"""),
            Regex("""(earn|payout|fee|fare|trip)\s*:?\s*(\d+(?:\.\d{1,2})?)""", RegexOption.IGNORE_CASE),
        )

        for (pattern in patterns) {
            val match = pattern.find(text)
            if (match != null) {
                val numStr = match.groupValues[1].replace(",", "")
                return numStr.toDoubleOrNull()
            }
        }
        return null
    }

    fun extractDistance(text: String): String? {
        val patterns = listOf(
            Regex("""(\d+(?:\.\d+)?)\s*(km|kilometers?)\b""", RegexOption.IGNORE_CASE),
            Regex("""(\d+(?:\.\d+)?)\s*(mi|miles?)\b""", RegexOption.IGNORE_CASE),
            Regex("""(\d+(?:\.\d+)?)\s*m\b""", RegexOption.IGNORE_CASE), // meters
        )
        for (pattern in patterns) {
            val match = pattern.find(text)
            if (match != null) return match.value
        }
        return null
    }

    /**
     * Detect currency from the platform name or text content.
     */
    fun detectCurrency(platform: String, text: String): String {
        // Check for explicit currency symbols in text
        return when {
            text.contains("₹") || text.contains("Rs.", ignoreCase = true) -> "INR"
            text.contains("$") -> "USD"
            text.contains("€") -> "EUR"
            text.contains("£") -> "GBP"
            text.contains("¥") -> "JPY"
            text.contains("₩") -> "KRW"
            text.contains("R$") -> "BRL"
            text.contains("฿") -> "THB"
            text.contains("₱") -> "PHP"
            text.contains("Rp") -> "IDR"
            text.contains("AED", ignoreCase = true) -> "AED"
            // Fallback based on platform region
            platform.contains("IN") || platform.contains("India") -> "INR"
            platform.contains("US") -> "USD"
            platform.contains("EU") || platform.contains("DE") || platform.contains("UK") -> "EUR"
            platform.contains("BR") -> "BRL"
            platform.contains("LATAM") -> "BRL"
            platform.contains("MENA") -> "AED"
            platform.contains("SEA") || platform.contains("Asia") -> "SGD"
            platform.contains("AU") -> "AUD"
            platform.contains("JP") -> "JPY"
            platform.contains("Nordics") -> "EUR"
            platform.contains("ID") -> "IDR"
            platform.contains("PH") -> "PHP"
            else -> "USD"
        }
    }
}
