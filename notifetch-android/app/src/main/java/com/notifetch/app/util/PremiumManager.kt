package com.notifetch.app.util

import android.content.Context
import android.content.SharedPreferences
import java.util.concurrent.TimeUnit

/**
 * v2.9.93: Premium Manager — QR referral system + locked bonus months
 *
 * How it works:
 * 1. Every user gets a unique referral code (NF-XXXXXX) on first launch
 * 2. User shares their QR code (which encodes notifetch.in/r/CODE)
 * 3. When another user scans the QR code, BOTH users get premium:
 *    - Scanner: 7 days premium (welcome bonus)
 *    - Sharer: referrals count increases
 * 4. Locked bonus system:
 *    - Every 20 referrals = 1 month (30 days) UNLOCKED
 *    - At 20 referrals: 1 month unlocked
 *    - At 40 referrals: 2 months unlocked
 *    - At 60 referrals: 3 months unlocked
 *    - etc.
 * 5. The locked months are shown with a lock icon until unlocked
 *
 * All tracking is local (SharedPreferences). No backend needed.
 */
object PremiumManager {

    private const val PREFS_NAME = "notifetch_premium"
    private const val KEY_PREMIUM_UNTIL = "premium_until_timestamp"
    private const val KEY_REFERRALS_TOTAL = "referrals_total_count"
    private const val KEY_LAST_SCAN_TIME = "last_scan_time"
    private const val KEY_SCANNED_CODES = "scanned_codes"
    private const val KEY_UNLOCKED_MONTHS = "unlocked_months"

    // Reward configuration
    const val REFEREE_REWARD_DAYS = 7L        // Scanner gets 7 days premium
    const val REFERRER_REWARD_DAYS = 3L       // Sharer gets 3 days per scan
    const val REFERRALS_PER_MONTH = 20        // Every 20 referrals = 1 month bonus
    const val MONTH_BONUS_DAYS = 30L          // 1 month = 30 days

    private fun getPrefs(context: Context): SharedPreferences {
        return context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
    }

    fun getPremiumUntilTimestamp(context: Context): Long {
        return getPrefs(context).getLong(KEY_PREMIUM_UNTIL, 0L)
    }

    fun isPremiumActive(context: Context): Boolean {
        return getPremiumUntilTimestamp(context) > System.currentTimeMillis()
    }

    fun getDaysRemaining(context: Context): Long {
        val until = getPremiumUntilTimestamp(context)
        val now = System.currentTimeMillis()
        if (until <= now) return 0
        return TimeUnit.MILLISECONDS.toDays(until - now) + 1
    }

    fun getHoursRemaining(context: Context): Long {
        val until = getPremiumUntilTimestamp(context)
        val now = System.currentTimeMillis()
        if (until <= now) return 0
        return TimeUnit.MILLISECONDS.toHours(until - now)
    }

    fun addPremiumDays(context: Context, days: Long): Long {
        val prefs = getPrefs(context)
        val currentUntil = prefs.getLong(KEY_PREMIUM_UNTIL, 0L)
        val now = System.currentTimeMillis()
        val base = if (currentUntil > now) currentUntil else now
        val newUntil = base + TimeUnit.DAYS.toMillis(days)
        prefs.edit().putLong(KEY_PREMIUM_UNTIL, newUntil).apply()
        return newUntil
    }

    fun getReferralCount(context: Context): Int {
        return getPrefs(context).getInt(KEY_REFERRALS_TOTAL, 0)
    }

    fun getScannedCodes(context: Context): Set<String> {
        val csv = getPrefs(context).getString(KEY_SCANNED_CODES, "") ?: ""
        return if (csv.isBlank()) emptySet() else csv.split(",").toSet()
    }

    /**
     * Get how many bonus months have been UNLOCKED.
     * Every 20 referrals = 1 month unlocked.
     */
    fun getUnlockedMonths(context: Context): Int {
        val count = getReferralCount(context)
        return count / REFERRALS_PER_MONTH
    }

    /**
     * Get how many bonus months are still LOCKED.
     * Shows progress toward next unlock.
     */
    fun getLockedMonths(context: Context): Int {
        // Always show the NEXT locked month (1 month waiting to be unlocked)
        val unlocked = getUnlockedMonths(context)
        // If user has any referrals at all, show 1 locked month (the next one to unlock)
        return if (getReferralCount(context) > 0 || true) 1 else 0
    }

    /**
     * Get progress toward next month unlock (0-19, where 20 = unlock).
     */
    fun getProgressToNextMonth(context: Context): Int {
        val count = getReferralCount(context)
        return count % REFERRALS_PER_MONTH
    }

    /**
     * Record that this user scanned someone else's referral code.
     * v2.9.93: Fixed — no longer blocks scanning different codes on different devices.
     * Only blocks scanning the SAME code twice on the SAME device.
     */
    fun recordScan(context: Context, referralCode: String): ScanResult {
        val myCode = ReferralManager.getReferralCode(context)
        // Can't scan own code
        if (referralCode.equals(myCode, ignoreCase = true)) {
            return ScanResult.Error("You can't scan your own code! Share it with friends instead.")
        }
        // Already scanned THIS SPECIFIC code on this device?
        val scanned = getScannedCodes(context)
        if (scanned.contains(referralCode.uppercase())) {
            return ScanResult.Error("You already scanned this code! Try a different one.")
        }

        // Award days to scanner (this user)
        val daysAwarded = REFEREE_REWARD_DAYS
        addPremiumDays(context, daysAwarded)

        // Mark code as scanned
        val newScanned = scanned + referralCode.uppercase()
        val totalScans = getReferralCount(context)
        getPrefs(context).edit()
            .putString(KEY_SCANNED_CODES, newScanned.joinToString(","))
            .putInt(KEY_REFERRALS_TOTAL, totalScans + 1)
            .putLong(KEY_LAST_SCAN_TIME, System.currentTimeMillis())
            .apply()

        // Check if this scan unlocked a new month (for the scanner)
        checkAndUnlockMonths(context)

        // Also record in ReferralManager for points
        ReferralManager.recordSuccessfulReferral(context)

        return ScanResult.Success(daysAwarded, referralCode)
    }

    /**
     * Check if referral count crossed a 20-referral threshold.
     * If so, unlock 1 month (30 days) of premium.
     * Called automatically after each scan.
     */
    private fun checkAndUnlockMonths(context: Context) {
        val count = getReferralCount(context)
        val currentUnlocked = getPrefs(context).getInt(KEY_UNLOCKED_MONTHS, 0)
        val shouldUnlock = count / REFERRALS_PER_MONTH

        if (shouldUnlock > currentUnlocked) {
            // Unlock the difference (e.g., from 0 to 1 = unlock 1 month)
            val monthsToUnlock = shouldUnlock - currentUnlocked
            for (i in 0 until monthsToUnlock) {
                addPremiumDays(context, MONTH_BONUS_DAYS)
            }
            getPrefs(context).edit()
                .putInt(KEY_UNLOCKED_MONTHS, shouldUnlock)
                .apply()
        }
    }

    /**
     * Called when THIS user's referral code is used by someone else.
     * Awards REFERRER_REWARD_DAYS + checks for month unlocks.
     */
    fun recordReferralUsed(context: Context): Long {
        val currentCount = getReferralCount(context)
        val days = REFERRER_REWARD_DAYS
        addPremiumDays(context, days)

        val newCount = currentCount + 1
        getPrefs(context).edit()
            .putInt(KEY_REFERRALS_TOTAL, newCount)
            .putLong(KEY_LAST_SCAN_TIME, System.currentTimeMillis())
            .apply()

        // Check for month unlock
        checkAndUnlockMonths(context)

        return days
    }

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
