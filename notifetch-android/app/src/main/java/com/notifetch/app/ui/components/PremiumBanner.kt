package com.notifetch.app.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.Star
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableLongStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.notifetch.app.util.PremiumManager

/**
 * v2.9.93: Premium Status Banner with LIVE countdown + locked bonus months
 *
 * Shows on Home screen:
 * - Live countdown to December 20, 2026 (updates every second)
 * - Format: "Xmo Yd Zh Wm Vs" (months, days, hours, minutes, seconds)
 * - Locked bonus months: shows 🔒 (1 month) for every 20 referrals not yet completed
 *   - 0-19 referrals: "+ 🔒(1 month)"
 *   - 20-39 referrals: "+ ✅(1 month) 🔒(1 month)" — 1 unlocked, next locked
 *   - 40-59 referrals: "+ ✅(2 months) 🔒(1 month)" — 2 unlocked, next locked
 */
@Composable
fun PremiumBanner(
    modifier: Modifier = Modifier
) {
    val context = LocalContext.current
    var isPremium by remember { mutableStateOf(PremiumManager.isPremiumActive(context)) }
    var timeRemainingMs by remember { mutableLongStateOf(getTimeRemainingToDec20()) }
    var unlockedMonths by remember { mutableStateOf(PremiumManager.getUnlockedMonths(context)) }
    var referralCount by remember { mutableStateOf(PremiumManager.getReferralCount(context)) }

    LaunchedEffect(Unit) {
        while (true) {
            isPremium = PremiumManager.isPremiumActive(context)
            timeRemainingMs = getTimeRemainingToDec20()
            unlockedMonths = PremiumManager.getUnlockedMonths(context)
            referralCount = PremiumManager.getReferralCount(context)
            kotlinx.coroutines.delay(1000)
        }
    }

    val gradient = if (isPremium) {
        Brush.horizontalGradient(listOf(Color(0xFFFF5A1F), Color(0xFFF59E0B)))
    } else {
        Brush.horizontalGradient(listOf(Color(0xFF4B5563), Color(0xFF374151)))
    }

    val countdownText = formatCountdown(timeRemainingMs)
    val progressToNext = referralCount % PremiumManager.REFERRALS_PER_MONTH

    Box(
        modifier = modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 4.dp)
            .background(gradient, RoundedCornerShape(12.dp))
            .padding(horizontal = 12.dp, vertical = 8.dp)
    ) {
        Column {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier.fillMaxWidth()
            ) {
                Icon(
                    imageVector = Icons.Default.Star,
                    contentDescription = null,
                    tint = Color.White,
                    modifier = Modifier.padding(end = 6.dp).width(16.dp)
                )
                Text(
                    text = if (isPremium) "Premium Active" else "Free Tier",
                    color = Color.White,
                    fontWeight = FontWeight.Bold,
                    style = MaterialTheme.typography.labelMedium,
                    modifier = Modifier.weight(1f)
                )
                Text(
                    text = countdownText,
                    color = Color.White,
                    fontWeight = FontWeight.Bold,
                    style = MaterialTheme.typography.labelSmall
                )
            }

            Spacer(modifier = Modifier.padding(2.dp))

            // Bonus months row — locked and unlocked
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier.fillMaxWidth()
            ) {
                // Unlocked months
                if (unlockedMonths > 0) {
                    Text(
                        text = "+ ✅($unlockedMonths month${if (unlockedMonths > 1) "s" else ""})",
                        color = Color.White.copy(alpha = 0.9f),
                        style = MaterialTheme.typography.labelSmall,
                        fontWeight = FontWeight.Medium
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                }

                // Locked next month
                Text(
                    text = "+ 🔒(1 month)",
                    color = Color.White.copy(alpha = 0.6f),
                    style = MaterialTheme.typography.labelSmall
                )
                Text(
                    text = "  [$progressToNext/${PremiumManager.REFERRALS_PER_MONTH}]",
                    color = Color.White.copy(alpha = 0.5f),
                    style = MaterialTheme.typography.labelSmall
                )
            }
        }
    }
}

private fun getTimeRemainingToDec20(): Long {
    val dec20 = java.util.Calendar.getInstance().apply {
        set(2026, java.util.Calendar.DECEMBER, 20, 0, 0, 0)
        set(java.util.Calendar.MILLISECOND, 0)
    }
    val now = java.util.Calendar.getInstance()
    val diff = dec20.timeInMillis - now.timeInMillis
    return diff.coerceAtLeast(0)
}

private fun formatCountdown(ms: Long): String {
    if (ms <= 0) return "Expired"

    val seconds = ms / 1000
    val minutes = seconds / 60
    val hours = minutes / 60
    val days = hours / 24
    val months = days / 30

    val remainingDays = days % 30
    val remainingHours = hours % 24
    val remainingMinutes = minutes % 60
    val remainingSeconds = seconds % 60

    return buildString {
        if (months > 0) append("${months}mo ")
        if (remainingDays > 0 || months > 0) append("${remainingDays}d ")
        if (remainingHours > 0 || remainingDays > 0 || months > 0) append("${remainingHours}h ")
        if (remainingMinutes > 0 || remainingHours > 0 || remainingDays > 0 || months > 0) append("${remainingMinutes}m ")
        append("${remainingSeconds}s")
    }.trim()
}
