package com.notifetch.app.ui.components

import android.content.Intent
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Share
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.notifetch.app.ui.theme.Accent
import com.notifetch.app.ui.theme.AmberGold

/**
 * v2.9.81: Share Earnings Card
 *
 * A branded card on the Earnings screen that summarizes today's activity
 * (earnings in INR, order count, platform count) and lets the user share
 * that summary via Android's standard share sheet (Intent.ACTION_SEND,
 * type "text/plain").
 *
 * Visual: coral -> amber horizontal gradient, matching the app's brand
 * system (Accent #FF5A1F -> AmberGold #F59E0B). White-on-gradient for
 * high contrast.
 *
 * Placement: inserted into EarningsScreen.kt below the today/week/month
 * summary cards and above the "Orders by Platform" breakdown.
 */
@Composable
fun ShareEarningsCard(
    todayEarnings: Double,
    todayOrders: Int,
    platformCount: Int,
    modifier: Modifier = Modifier
) {
    val context = LocalContext.current

    val shareText = buildShareText(
        todayEarnings = todayEarnings,
        todayOrders = todayOrders,
        platformCount = platformCount
    )

    Card(
        modifier = modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = Color.Transparent)
    ) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .background(
                    Brush.horizontalGradient(
                        colors = listOf(Accent, AmberGold)
                    )
                )
                .padding(16.dp)
        ) {
            Column(modifier = Modifier.fillMaxWidth()) {
                // Header row — "Share Today's Activity"
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        imageVector = Icons.Default.Share,
                        contentDescription = null,
                        tint = Color.White,
                        modifier = Modifier.size(20.dp)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "Share Today's Activity",
                        color = Color.White,
                        fontWeight = FontWeight.Bold,
                        style = MaterialTheme.typography.titleMedium
                    )
                }

                Spacer(modifier = Modifier.height(12.dp))

                // Today's earnings summary — 3 mini-stats
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    SummaryStat(
                        label = "Today's Value",
                        value = "₹${formatRupees(todayEarnings)}"
                    )
                    SummaryStat(
                        label = "Orders",
                        value = todayOrders.toString()
                    )
                    SummaryStat(
                        label = "Platforms",
                        value = platformCount.toString()
                    )
                }

                Spacer(modifier = Modifier.height(16.dp))

                // Share button — opens Android share sheet
                Button(
                    onClick = {
                        val shareIntent = Intent(Intent.ACTION_SEND).apply {
                            type = "text/plain"
                            putExtra(Intent.EXTRA_TEXT, shareText)
                            // Optional: include a chooser title for nicer UX
                            putExtra(Intent.EXTRA_TITLE, "Share NotiFetch Earnings")
                        }
                        context.startActivity(
                            Intent.createChooser(shareIntent, "Share Earnings")
                        )
                    },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = Color.White,
                        contentColor = Accent
                    )
                ) {
                    Icon(
                        imageVector = Icons.Default.Share,
                        contentDescription = null,
                        modifier = Modifier.size(18.dp)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "Share Earnings",
                        fontWeight = FontWeight.Bold
                    )
                }
            }
        }
    }
}

@Composable
private fun SummaryStat(label: String, value: String) {
    Column(horizontalAlignment = Alignment.Start) {
        Text(
            text = label,
            color = Color.White.copy(alpha = 0.85f),
            fontSize = 12.sp
        )
        Text(
            text = value,
            color = Color.White,
            fontWeight = FontWeight.Bold,
            fontSize = 22.sp
        )
    }
}

/**
 * Format a rupee amount: integer if whole, otherwise 2-decimal.
 * e.g. 847.0 -> "847", 847.5 -> "847.50", 0.0 -> "0".
 */
private fun formatRupees(amount: Double): String {
    return if (amount % 1.0 == 0.0) {
        amount.toInt().toString()
    } else {
        String.format("%.2f", amount)
    }
}

/**
 * Build the share text. Matches the v2.9.81 spec:
 *
 *   "🚀 My NotiFetch earnings today: ₹847 from 12 orders across 3 platforms!
 *    Track your deliveries with NotiFetch: https://play.google.com/store/apps/details?id=com.notifetch.app"
 *
 * Live values are substituted for the example numbers.
 */
private fun buildShareText(
    todayEarnings: Double,
    todayOrders: Int,
    platformCount: Int
): String {
    val rupees = formatRupees(todayEarnings)
    val platformWord = if (platformCount == 1) "platform" else "platforms"
    val orderWord = if (todayOrders == 1) "order" else "orders"
    return "🚀 My NotiFetch earnings today: ₹$rupees from $todayOrders $orderWord " +
            "across $platformCount $platformWord! " +
            "Track your deliveries with NotiFetch: " +
            "https://play.google.com/store/apps/details?id=com.notifetch.app"
}
