package com.notifetch.app.util

import android.os.Bundle
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

    fun formatCurrency(value: Double?): String {
        if (value == null) return "—"
        return "₹${String.format(Locale.getDefault(), "%.0f", value)}"
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

    fun extrasToJson(extras: Bundle?): String {
        if (extras == null) return "{}"
        val sb = StringBuilder("{")
        var first = true
        for (key in extras.keySet()) {
            if (!first) sb.append(",")
            val value = extras.get(key)
            sb.append("\"").append(key).append("\":")
            sb.append("\"").append(value?.toString()?.replace("\"", "\\\"") ?: "null").append("\"")
            first = false
        }
        sb.append("}")
        return sb.toString()
    }

    fun extractOrderValue(text: String): Double? {
        // Try ₹XXX or Rs.XXX patterns
        val rupeePattern = Regex("""[₹Rs\.]?\s*(\d+(?:\.\d{1,2})?)""")
        val match = rupeePattern.find(text)
        return match?.groupValues?.get(1)?.toDoubleOrNull()
    }

    fun extractDistance(text: String): String? {
        val distancePattern = Regex("""(\d+(?:\.\d+)?)\s*(km|m)\b""", RegexOption.IGNORE_CASE)
        val match = distancePattern.find(text)
        return match?.value
    }
}
