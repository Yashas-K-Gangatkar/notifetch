package com.notifetch.app.ui.components

import android.content.Intent
import android.net.Uri
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
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
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.notifetch.app.R
import com.notifetch.app.util.PremiumManager

/**
 * v2.9.83: Premium Status Banner
 *
 * Shows on the Home screen at the top. Displays:
 * - If premium active: "X days premium remaining" with star icon
 * - If expired: "Share your QR to get free premium" with share icon
 *
 * Updates every 60 seconds for live countdown.
 */
@Composable
fun PremiumBanner(
    modifier: Modifier = Modifier
) {
    val context = LocalContext.current
    var isPremium by remember { mutableStateOf(PremiumManager.isPremiumActive(context)) }
    var daysRemaining by remember { mutableLongStateOf(PremiumManager.getDaysRemaining(context)) }
    var hoursRemaining by remember { mutableLongStateOf(PremiumManager.getHoursRemaining(context)) }

    // Update every minute
    LaunchedEffect(Unit) {
        while (true) {
            isPremium = PremiumManager.isPremiumActive(context)
            daysRemaining = PremiumManager.getDaysRemaining(context)
            hoursRemaining = PremiumManager.getHoursRemaining(context)
            kotlinx.coroutines.delay(60_000)
        }
    }

    val gradient = if (isPremium) {
        Brush.horizontalGradient(listOf(Color(0xFFFF5A1F), Color(0xFFF59E0B)))
    } else {
        Brush.horizontalGradient(listOf(Color(0xFF4B5563), Color(0xFF374151)))
    }

    Box(
        modifier = modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 4.dp)
            .background(gradient, RoundedCornerShape(12.dp))
            .padding(horizontal = 16.dp, vertical = 10.dp)
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier.fillMaxWidth()
        ) {
            Icon(
                imageVector = Icons.Default.Star,
                contentDescription = null,
                tint = Color.White,
                modifier = Modifier.padding(end = 8.dp)
            )
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = stringResource(R.string.premium_countdown_to_dec),
                    color = Color.White,
                    fontWeight = FontWeight.Bold,
                    style = MaterialTheme.typography.bodyMedium
                )
                Text(
                    text = if (isPremium) {
                        when {
                            daysRemaining > 1 -> stringResource(R.string.premium_days_remaining, daysRemaining.toInt())
                            daysRemaining == 1L -> stringResource(R.string.premium_one_day_remaining)
                            else -> stringResource(R.string.premium_hours_remaining, hoursRemaining.toInt())
                        }
                    } else {
                        stringResource(R.string.premium_unlock_more)
                    },
                    color = Color.White.copy(alpha = 0.9f),
                    style = MaterialTheme.typography.bodySmall
                )
            }
            // Countdown to December 20, 2026
            val dec20Days = remember {
                val dec20 = java.util.Calendar.getInstance().apply {
                    set(2026, java.util.Calendar.DECEMBER, 20, 0, 0, 0)
                    set(java.util.Calendar.MILLISECOND, 0)
                }
                val now = java.util.Calendar.getInstance()
                val diffMs = dec20.timeInMillis - now.timeInMillis
                (diffMs / (1000 * 60 * 60 * 24)).coerceAtLeast(0)
            }
            Text(
                text = stringResource(R.string.premium_countdown_days, dec20Days.toInt()),
                color = Color.White,
                fontWeight = FontWeight.Bold,
                style = MaterialTheme.typography.titleMedium
            )
        }
    }
}
