package com.notifetch.app.util

import android.content.Context
import android.content.Intent
import android.util.Base64
import java.security.MessageDigest

/**
 * v2.9.16: Referral System
 *
 * Generates unique referral codes for each user.
 * Tracks referrals via deep links (notifetch.in/r/CODE).
 * Awards virtual points for successful referrals.
 *
 * No backend needed — all tracking is local + Firebase Auth UID.
 * When backend launches, sync local referrals to server.
 */
object ReferralManager {

    private const val PREFS_NAME = "notifetch_referral"
    private const val KEY_REFERRAL_CODE = "referral_code"
    private const val KEY_REFERRAL_COUNT = "referral_count"
    private const val KEY_REFERRAL_POINTS = "referral_points"
    private const val REFERRAL_BONUS_POINTS = 1000

    /**
     * Get or generate the user's unique referral code.
     * Format: NOTIFETCH-XXXXXX (6 alphanumeric chars based on device ID hash)
     */
    fun getReferralCode(context: Context): String {
        val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        var code = prefs.getString(KEY_REFERRAL_CODE, null)

        if (code == null) {
            // Generate from device ID (stable across reinstalls on same device)
            val deviceId = android.provider.Settings.Secure.getString(
                context.contentResolver,
                android.provider.Settings.Secure.ANDROID_ID
            ) ?: System.currentTimeMillis().toString()

            val md = MessageDigest.getInstance("SHA-256")
            val hash = md.digest(deviceId.toByteArray())
            val encoded = Base64.encodeToString(hash, Base64.NO_WRAP or Base64.URL_SAFE)
                .take(6)
                .uppercase()
                .replace(Regex("[^A-Z0-9]"), "X")

            code = "NF-$encoded"
            prefs.edit().putString(KEY_REFERRAL_CODE, code).apply()
        }

        return code
    }

    /**
     * Get the shareable referral link.
     */
    fun getReferralLink(context: Context): String {
        val code = getReferralCode(context)
        return "https://notifetch.in/r/$code"
    }

    /**
     * Get the number of successful referrals.
     */
    fun getReferralCount(context: Context): Int {
        val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        return prefs.getInt(KEY_REFERRAL_COUNT, 0)
    }

    /**
     * Get total referral points earned.
     */
    fun getReferralPoints(context: Context): Int {
        val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        return prefs.getInt(KEY_REFERRAL_POINTS, 0)
    }

    /**
     * Record a successful referral (called when a new user signs up with a referral code).
     * Awards points to both the referrer and the referred user.
     */
    fun recordSuccessfulReferral(context: Context) {
        val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        val currentCount = prefs.getInt(KEY_REFERRAL_COUNT, 0)
        val currentPoints = prefs.getInt(KEY_REFERRAL_POINTS, 0)
        prefs.edit()
            .putInt(KEY_REFERRAL_COUNT, currentCount + 1)
            .putInt(KEY_REFERRAL_POINTS, currentPoints + REFERRAL_BONUS_POINTS)
            .apply()
    }

    /**
     * Create a share intent with the referral link + promotional message.
     */
    fun createShareIntent(context: Context): Intent {
        val code = getReferralCode(context)
        val link = getReferralLink(context)
        val message = """
            🔔 NotiFetch — Turn your delivery notifications into cash!

            I've been using NotiFetch to capture notifications from Swiggy, Zomato, Zepto, Blinkit, and 115+ more apps. It aggregates them into one feed and pays you for the data.

            Use my referral code: $code
            Download: $link

            You get 1000 bonus points when you sign up! 🎁
        """.trimIndent()

        return Intent(Intent.ACTION_SEND).apply {
            type = "text/plain"
            putExtra(Intent.EXTRA_SUBJECT, "Join NotiFetch — earn from your delivery notifications!")
            putExtra(Intent.EXTRA_TEXT, message)
        }
    }

    /**
     * Extract referral code from a deep link URL.
     * Returns null if the URL is not a referral link.
     */
    fun extractReferralCode(url: String): String? {
        // Match patterns like:
        //   https://notifetch.in/r/NF-ABC123
        //   notifetch://r/NF-ABC123
        //   notifetch.in/r/NF-ABC123
        val patterns = listOf(
            Regex("""notifetch\.in/r/([A-Z0-9\-]+)""", RegexOption.IGNORE_CASE),
            Regex("""notifetch://r/([A-Z0-9\-]+)""", RegexOption.IGNORE_CASE),
            Regex("""ref=([A-Z0-9\-]+)""", RegexOption.IGNORE_CASE)
        )

        for (pattern in patterns) {
            val match = pattern.find(url)
            if (match != null) {
                return match.groupValues[1].uppercase()
            }
        }
        return null
    }
}
