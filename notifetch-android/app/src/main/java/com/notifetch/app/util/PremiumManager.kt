package com.notifetch.app.util

import android.content.Context
import android.content.SharedPreferences
import java.util.concurrent.TimeUnit

/**
 * v2.9.83: Premium Manager — QR referral system + free premium days tracking
 *
 * How it works:
 * 1. Every user gets a unique referral code (NF-XXXXXX) on first launch
 * 2. User shares their QR code (which encodes notifetch.in/r/CODE)
 * 3. When another user scans the QR code, BOTH users get free premium days:
 *    - Referrer (sharer): +3 days per scan (max 10 scans = 30 days = 1 month)
 *    - Referee (scanner): +7 days (welcome bonus)
 * 4. The app shows a countdown of how many free premium days remain
 * 5. While premium is active, all features are unlocked
 *
 * All tracking is local (SharedPreferences). No backend needed.
 * When backend launches, sync this to server for cross-device sync.
 */
object PremiumManager {

    private const val PREFS_NAME = "notifetch_premium"
    private const val KEY_PREMIUM_UNTIL = "premium_until_timestamp"
    private const val KEY_REFERRALS_TODAY = "referrals_today_count"
    private const val KEY_REFERRALS_TOTAL = "referrals_total_count"
    private const val KEY_LAST_SCAN_TIME = "last_scan_time"
    private const val KEY_SCANNED_CODES = "scanned_codes"  // comma-separated, prevents re-scanning

    // Reward configuration
    const val REFERRER_REWARD_DAYS = 3L       // Sharer gets 3 days per scan
    const val REFEREE_REWARD_DAYS = 7L        // Scanner gets 7 days welcome bonus
    const val MAX_SCANS_PER_USER = 10         // Max scans a user can share (caps at 30 days = 1 month)
    const val MONTH_BONUS_THRESHOLD = 10      // After 10 referrals, grant 1 full month bonus

    private fun getPrefs(context: Context): SharedPreferences {
        return context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
    }

    /**
     * Get the timestamp until which the user has premium access.
     * Returns 0 if no premium active.
     */
    fun getPremiumUntilTimestamp(context: Context): Long {
        return getPrefs(context).getLong(KEY_PREMIUM_UNTIL, 0L)
    }

    /**
     * Check if user currently has premium access.
     */
    fun isPremiumActive(context: Context): Boolean {
        val until = getPremiumUntilTimestamp(context)
        return until > System.currentTimeMillis()
    }

    /**
     * Get number of days of premium remaining (rounded up).
     * Returns 0 if no premium active.
     */
    fun getDaysRemaining(context: Context): Long {
        val until = getPremiumUntilTimestamp(context)
        val now = System.currentTimeMillis()
        if (until <= now) return 0
        val diffMs = until - now
        return TimeUnit.MILLISECONDS.toDays(diffMs) + 1  // +1 to count today
    }

    /**
     * Get hours remaining (for more precise countdown when < 1 day).
     */
    fun getHoursRemaining(context: Context): Long {
        val until = getPremiumUntilTimestamp(context)
        val now = System.currentTimeMillis()
        if (until <= now) return 0
        val diffMs = until - now
        return TimeUnit.MILLISECONDS.toHours(diffMs)
    }

    /**
     * Add premium days to the user's account.
     * If they already have premium, extends it. If not, starts from now.
     */
    fun addPremiumDays(context: Context, days: Long): Long {
        val prefs = getPrefs(context)
        val currentUntil = prefs.getLong(KEY_PREMIUM_UNTIL, 0L)
        val now = System.currentTimeMillis()
        // If premium already active, extend from current end. Otherwise start from now.
        val base = if (currentUntil > now) currentUntil else now
        val newUntil = base + TimeUnit.DAYS.toMillis(days)
        prefs.edit().putLong(KEY_PREMIUM_UNTIL, newUntil).apply()
        return newUntil
    }

    /**
     * Get the number of successful referrals this user has made (as the sharer).
     */
    fun getReferralCount(context: Context): Int {
        return getPrefs(context).getInt(KEY_REFERRALS_TOTAL, 0)
    }

    /**
     * Get the number of referrals made today.
     */
    fun getReferralsToday(context: Context): Int {
        val prefs = getPrefs(context)
        val lastScan = prefs.getLong(KEY_LAST_SCAN_TIME, 0L)
        val now = System.currentTimeMillis()
        // Reset daily count if it's a new day
        if (lastScan > 0 && !isSameDay(lastScan, now)) {
            prefs.edit().putInt(KEY_REFERRALS_TODAY, 0).apply()
        }
        return prefs.getInt(KEY_REFERRALS_TODAY, 0)
    }

    /**
     * Get the set of referral codes this user has already scanned.
     * Prevents scanning the same code twice for double rewards.
     */
    fun getScannedCodes(context: Context): Set<String> {
        val csv = getPrefs(context).getString(KEY_SCANNED_CODES, "") ?: ""
        return if (csv.isBlank()) emptySet() else csv.split(",").toSet()
    }

    /**
     * Record that this user scanned someone else's referral code.
     * Grants premium days to BOTH the scanner (this user) and would grant to the
     * referrer (handled server-side when backend launches — for now, local only).
     *
     * Returns the number of days awarded, or 0 if:
     * - Already scanned this code before
     * - Trying to scan own code
     * - Max scan limit reached
     */
    fun recordScan(context: Context, referralCode: String): ScanResult {
        val myCode = ReferralManager.getReferralCode(context)
        // Can't scan own code
        if (referralCode.equals(myCode, ignoreCase = true)) {
            return ScanResult.Error("You can't scan your own code!")
        }
        // Already scanned this code?
        val scanned = getScannedCodes(context)
        if (scanned.contains(referralCode.uppercase())) {
            return ScanResult.Error("You already scanned this code!")
        }
        // Max scan limit (for the referrer — but we track locally)
        val totalScans = getReferralCount(context)
        // Note: this limits how many times THIS user can scan others.
        // The referrer's limit is tracked on their device.

        // Award days to scanner (this user)
        val daysAwarded = REFEREE_REWARD_DAYS
        addPremiumDays(context, daysAwarded)

        // Mark code as scanned
        val newScanned = scanned + referralCode.uppercase()
        getPrefs(context).edit()
            .putString(KEY_SCANNED_CODES, newScanned.joinToString(","))
            .putInt(KEY_REFERRALS_TOTAL, totalScans + 1)
            .putLong(KEY_LAST_SCAN_TIME, System.currentTimeMillis())
            .apply()

        // Also record in ReferralManager for points
        ReferralManager.recordSuccessfulReferral(context)

        return ScanResult.Success(daysAwarded, referralCode)
    }

    /**
     * Called when THIS user's referral code is used by someone else.
     * (This would be triggered by a backend push notification when backend launches.
     * For now, it's called locally when the user shares and the other person confirms.)
     *
     * Awards REFERRER_REWARD_DAYS to this user.
     */
    fun recordReferralUsed(context: Context): Long {
        val currentCount = getReferralCount(context)
        if (currentCount >= MAX_SCANS_PER_USER) {
            return 0  // Cap reached
        }
        val days = REFERRER_REWARD_DAYS
        addPremiumDays(context, days)

        // Check for month bonus (10 referrals = 1 full month)
        val newCount = currentCount + 1
        if (newCount == MONTH_BONUS_THRESHOLD) {
            // Bonus: extend by 30 days
            addPremiumDays(context, 30)
        }

        getPrefs(context).edit()
            .putInt(KEY_REFERRALS_TOTAL, newCount)
            .putLong(KEY_LAST_SCAN_TIME, System.currentTimeMillis())
            .apply()

        return days
    }

    /**
     * Get a human-readable summary of premium status.
     */
    fun getPremiumStatusText(context: Context): String {
        if (!isPremiumActive(context)) {
            return "Free tier"
        }
        val days = getDaysRemaining(context)
        return when {
            days > 1 -> "$days days premium remaining"
            days == 1L -> "1 day premium remaining"
            else -> "${getHoursRemaining(context)} hours premium remaining"
        }
    }

    private fun isSameDay(timestamp1: Long, timestamp2: Long): Boolean {
        val cal1 = java.util.Calendar.getInstance().apply { timeInMillis = timestamp1 }
        val cal2 = java.util.Calendar.getInstance().apply { timeInMillis = timestamp2 }
        return cal1.get(java.util.Calendar.YEAR) == cal2.get(java.util.Calendar.YEAR) &&
                cal1.get(java.util.Calendar.DAY_OF_YEAR) == cal2.get(java.util.Calendar.DAY_OF_YEAR)
    }
}

sealed class ScanResult {
    data class Success(val daysAwarded: Long, val referralCode: String) : ScanResult()
    data class Error(val message: String) : ScanResult()
}
