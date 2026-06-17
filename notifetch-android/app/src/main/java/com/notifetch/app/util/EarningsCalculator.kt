package com.notifetch.app.util

/**
 * v2.9.12: Virtual earnings calculation.
 *
 * NotiFetch is a passive income app, but we have no funding yet. So we use a
 * virtual points system:
 *
 * - Each captured notification earns the user 10 points
 * - Notifications with orderValue earn bonus: 1 point per ₹1 of order value
 * - High-value offers (50%+ off) earn 50 bonus points
 * - 1000 points = ₹1 (estimated)
 *
 * Real cash payouts start when:
 * - We secure investment, OR
 * - Backend data sales reach ₹50,000/month
 *
 * Until then, points can be converted to Premium tier months (when premium launches).
 */
object EarningsCalculator {

    // Points awarded per captured notification (base rate)
    const val POINTS_PER_NOTIFICATION = 10

    // Points awarded per ₹1 of detected order value
    const val POINTS_PER_RUPEE = 1.0

    // Points awarded for high-value offers (50%+ off)
    const val POINTS_PER_HIGH_VALUE_OFFER = 50

    // Conversion rate: 1000 points = ₹1
    const val POINTS_PER_RUPEE_REDEMPTION = 1000.0

    // User's share of revenue (5% of data sale price)
    const val USER_REVENUE_SHARE = 0.05

    /**
     * Calculate points earned for a single notification.
     */
    fun calculatePoints(
        hasOrderValue: Boolean,
        orderValue: Double?,
        isHighValueOffer: Boolean
    ): Int {
        var points = POINTS_PER_NOTIFICATION
        if (hasOrderValue && orderValue != null && orderValue > 0) {
            points += (orderValue * POINTS_PER_RUPEE).toInt()
        }
        if (isHighValueOffer) {
            points += POINTS_PER_HIGH_VALUE_OFFER
        }
        return points
    }

    /**
     * Convert points to estimated rupees.
     */
    fun pointsToRupees(points: Int): Double {
        return points / POINTS_PER_RUPEE_REDEMPTION
    }

    /**
     * Calculate estimated earnings for a batch of notifications.
     *
     * @param totalNotifications Total count of notifications captured
     * @param totalOrderValue Sum of all orderValues (in user's currency)
     * @param highValueOfferCount Count of high-value offers detected
     * @return Estimated earnings in rupees
     */
    fun calculateEstimatedEarnings(
        totalNotifications: Int,
        totalOrderValue: Double,
        highValueOfferCount: Int
    ): Double {
        val basePoints = totalNotifications * POINTS_PER_NOTIFICATION
        val orderValuePoints = (totalOrderValue * POINTS_PER_RUPEE).toInt()
        val highValueBonus = highValueOfferCount * POINTS_PER_HIGH_VALUE_OFFER
        val totalPoints = basePoints + orderValuePoints + highValueBonus
        return pointsToRupees(totalPoints)
    }

    /**
     * Detect if a notification is a high-value offer (50%+ off, "free", "deal", etc.)
     */
    fun isHighValueOffer(title: String, body: String, bigText: String): Boolean {
        val combined = "$title $body $bigText".lowercase()
        val highValuePatterns = listOf(
            "50% off", "60% off", "70% off", "80% off", "90% off", "free delivery",
            "free meal", "free order", "flat 50", "flat 60", "flat 70", "flat 80", "flat 90",
            "upto 50", "upto 60", "upto 70", "upto 80", "upto 90",
            "buy 1 get 1", "b1g1", "flash sale", "limited time offer", "today only",
            "special offer", "exclusive deal", "mega sale", "big billion", "great indian"
        )
        return highValuePatterns.any { combined.contains(it) }
    }
}
