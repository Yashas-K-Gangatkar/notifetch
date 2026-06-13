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
        // Always use Monday as week start for consistency (BUG #22 fix).
        // Calendar.SUNDAY=1, MONDAY=2. get(DAY_OF_WEEK) returns 1(Sun)-7(Sat).
        val dayOfWeek = calendar.get(java.util.Calendar.DAY_OF_WEEK)
        val daysSinceMonday = when (dayOfWeek) {
            java.util.Calendar.MONDAY -> 0
            java.util.Calendar.TUESDAY -> 1
            java.util.Calendar.WEDNESDAY -> 2
            java.util.Calendar.THURSDAY -> 3
            java.util.Calendar.FRIDAY -> 4
            java.util.Calendar.SATURDAY -> 5
            java.util.Calendar.SUNDAY -> 6
            else -> 0
        }
        calendar.add(java.util.Calendar.DAY_OF_MONTH, -daysSinceMonday)
        calendar.set(java.util.Calendar.HOUR_OF_DAY, 0)
        calendar.set(java.util.Calendar.MINUTE, 0)
        calendar.set(java.util.Calendar.SECOND, 0)
        calendar.set(java.util.Calendar.MILLISECOND, 0)
        return calendar.timeInMillis
    }

    fun startOfMonthTimestamp(): Long {
        val calendar = java.util.Calendar.getInstance()
        calendar.set(java.util.Calendar.DAY_OF_MONTH, 1)
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
     * Extract order value from notification text.
     *
     * CRITICAL: Different locales use different separators:
     *   - Western/Indian: comma = group, dot = decimal (e.g., 1,23,456.78)
     *   - Brazilian/Rupiah: dot = group, comma = decimal (e.g., 1.234.567,89)
     *   - Yen/Won/Rupiah: no decimal at all (e.g., ¥1,234)
     *
     * Each pattern is paired with a cleanup function that handles its specific
     * number format. This prevents the bug where .replace(".", "") would
     * corrupt decimal points in Western/Indian format numbers.
     */
    fun extractOrderValue(text: String): Double? {
        data class ValuePattern(val regex: Regex, val cleanup: (String) -> String)

        val patterns = listOf(
            // ── Indian Rupee (₹) — comma=group, dot=decimal ──
            // Indian lakh format: ₹1,23,456 or ₹1,23,456.78
            ValuePattern(Regex("""₹\s*(\d{1,3}(?:,\d{2})*(?:,\d{3})*(?:\.\d{1,2})?)""")) { it.replace(",", "") },
            // Standard comma format: ₹123,456 or ₹123,456.78
            ValuePattern(Regex("""₹\s*(\d+(?:,\d{3})*(?:\.\d{1,2})?)""")) { it.replace(",", "") },
            // ₹ without commas: ₹1234 or ₹1234.56
            ValuePattern(Regex("""₹\s*(\d+(?:\.\d{1,2})?)""")) { it },

            // ── Rs./INR — comma=group, dot=decimal ──
            ValuePattern(Regex("""(?:Rs\.?|INR)\s*(\d{1,3}(?:,\d{2})*(?:,\d{3})*(?:\.\d{1,2})?)""")) { it.replace(",", "") },
            ValuePattern(Regex("""(?:Rs\.?|INR)\s*(\d+(?:,\d{3})*(?:\.\d{1,2})?)""")) { it.replace(",", "") },
            ValuePattern(Regex("""(?:Rs\.?|INR)\s*(\d+(?:\.\d{1,2})?)""")) { it },

            // ── Dollar ($) — comma=group, dot=decimal ──
            ValuePattern(Regex("""\$\s*(\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?)""")) { it.replace(",", "") },
            ValuePattern(Regex("""\$\s*(\d+(?:\.\d{1,2})?)""")) { it },

            // ── Euro (€) — comma=group, dot=decimal ──
            ValuePattern(Regex("""€\s*(\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?)""")) { it.replace(",", "") },
            ValuePattern(Regex("""€\s*(\d+(?:\.\d{1,2})?)""")) { it },

            // ── Pound (£) — comma=group, dot=decimal ──
            ValuePattern(Regex("""£\s*(\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?)""")) { it.replace(",", "") },
            ValuePattern(Regex("""£\s*(\d+(?:\.\d{1,2})?)""")) { it },

            // ── Yen (¥) — comma=group, no decimal ──
            ValuePattern(Regex("""¥\s*(\d+(?:,\d+)*)""")) { it.replace(",", "") },

            // ── Won (₩) — comma=group, no decimal ──
            ValuePattern(Regex("""₩\s*(\d+(?:,\d+)*)""")) { it.replace(",", "") },

            // ── Brazilian Real (R$) — dot=group, comma=decimal ──
            ValuePattern(Regex("""R\$\s*(\d{1,3}(?:\.\d{3})*(?:,\d{1,2})?)""")) {
                it.replace(".", "").replace(",", ".")
            },

            // ── Thai Baht (฿) — comma=group, dot=decimal ──
            ValuePattern(Regex("""฿\s*(\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?)""")) { it.replace(",", "") },

            // ── Philippine Peso (₱) — comma=group, dot=decimal ──
            ValuePattern(Regex("""₱\s*(\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?)""")) { it.replace(",", "") },

            // ── Indonesian Rupiah (Rp) — dot=group, no decimal ──
            ValuePattern(Regex("""Rp\s*(\d{1,3}(?:\.\d{3})*)""")) { it.replace(".", "") },
        )

        for ((regex, cleanup) in patterns) {
            val match = regex.find(text)
            if (match != null) {
                val cleaned = cleanup(match.groupValues[1])
                return cleaned.toDoubleOrNull()
            }
        }
        return null
    }

    fun extractDistance(text: String): String? {
        val patterns = listOf(
            Regex("""(\d+(?:\.\d+)?)\s*(km|kilometers?)\b""", RegexOption.IGNORE_CASE),
            Regex("""(\d+(?:\.\d+)?)\s*(mi|miles?)\b""", RegexOption.IGNORE_CASE),
            Regex("""(\d+(?:\.\d+)?)\s*(?:meter|meters?)\b""", RegexOption.IGNORE_CASE),
        )
        for (pattern in patterns) {
            val match = pattern.find(text)
            if (match != null) return match.value
        }
        return null
    }

    /**
     * Detect currency from the package name or text content.
     * Primary: packageName-based mapping (reliable, not affected by display name changes).
     * Fallback: text content analysis (symbol detection).
     */
    fun detectCurrency(packageName: String, platform: String, text: String): String {
        // Primary: Map by packageName — most reliable method
        val currencyByPackage = PLATFORM_CURRENCY_MAP[packageName]
        if (currencyByPackage != null) return currencyByPackage

        // Secondary: Check for explicit currency symbols in text
        return when {
            text.contains("₹") || text.contains("Rs.", ignoreCase = true) || text.contains("INR", ignoreCase = true) -> "INR"
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
            else -> "USD"
        }
    }

    /**
     * Currency mapping by Android package name.
     * Keyed by packageName (stable) instead of display name (user-customizable).
     */
    private val PLATFORM_CURRENCY_MAP = mapOf(
        // India
        "in.swiggy.deliveryapp" to "INR", "in.swiggy.partner" to "INR",
        "com.zomato.delivery" to "INR", "com.zomato.deliverypartner" to "INR",
        "app.blinkit.onboarding" to "INR", "com.bigbasket.dapp.activity" to "INR",
        "com.dunzo.partner" to "INR", "com.zepto.rider" to "INR",
        "com.ekartkiranaonboarding" to "INR", "com.ekart.logistics.app" to "INR",
        "com.flipkart.logistics" to "INR", "com.delhivery.delhiverypartner" to "INR",
        "com.ecomexpress.oneBoarding" to "INR", "com.xpressbees.unified_new_arch" to "INR",
        "in.letstransport.supply" to "INR", "net.blowhorn.driverapp" to "INR",
        "com.driveu.partner" to "INR", "app.yulu.android.partner" to "INR",
        "com.rapido.rider" to "INR", "com.olacabs.oladriver" to "INR",
        "in.shadowfax.gandalf" to "INR", "com.theporter.android.driverapp" to "INR",
        "global.dostavista.courier" to "INR", // Borzo India
        // US
        "com.doordash.driverapp" to "USD", "com.grubhub.driver" to "USD",
        "com.instacart.shopper" to "USD", "com.gopuff.godrive2.live" to "USD",
        "com.shipt.shopper" to "USD", "com.roadie.drive.android.app" to "USD",
        "com.amazon.flex.rabbit" to "USD", "com.amazon.flex" to "USD",
        "com.amazon.relay" to "USD", "com.ups.genesispd" to "USD",
        "com.lyft.android.driver" to "USD",
        "com.ubercab.driver" to "USD", // Uber US
        "com.postmates.android.courier" to "USD",
        // UK
        "com.deliveroo.driverapp" to "GBP", "com.justeat.courier.uk" to "GBP",
        "com.stuart.courier" to "GBP", "com.menulog.courier" to "AUD",
        // EU
        "com.takeaway.delivered4all" to "EUR", "com.lieferando.courier" to "EUR",
        "com.wolt.courierapp" to "EUR", "com.flink.workforce" to "EUR",
        "ee.mtakso.driver" to "EUR", // Bolt EU
        // Brazil
        "br.com.ifood.driver.app" to "BRL",
        "com.mercadoenvios.crowdsourcing" to "BRL", "com.mercadoenvios.driver" to "BRL",
        // LATAM
        "com.rappi.storekeeper" to "COP",
        "com.logistics.rider.glovo" to "EUR", // Glovo varies, default EUR
        // MENA
        "com.logistics.rider.talabat" to "AED", "com.careem.adma" to "AED",
        "com.aramex.ecourier" to "AED",
        // SE Asia
        "com.grabtaxi.driver2" to "SGD", "com.gojek.partner" to "IDR",
        "co.ninjavan.swiftninja_global" to "SGD", "com.quadx.riderapp" to "PHP",
        "id.my.irsyadf.jobdriver" to "IDR",
        // Japan
        "com.demaecan.DemaecanDriver" to "JPY",
        // HK/Saudi
        "com.sankuai.sailor.courier" to "SAR",
        // Australia
        "au.com.woolworths.android.driver" to "AUD",
        // Global with regional variants
        "com.lalamove.global.driver.sea" to "SGD",
        "com.didiglobal.driver" to "AUD", // DiDi AU
    )
}
