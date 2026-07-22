package com.notifetch.app.ui.components

import android.content.Intent
import android.graphics.Bitmap
import androidx.compose.foundation.Image
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
import androidx.compose.material.icons.filled.CardGiftcard
import androidx.compose.material.icons.filled.QrCode
import androidx.compose.material.icons.filled.QrCodeScanner
import androidx.compose.material.icons.filled.Share
import androidx.compose.material.icons.filled.Star
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.notifetch.app.R
import com.notifetch.app.util.PremiumManager
import com.notifetch.app.util.QrCodeGenerator
import com.notifetch.app.util.ReferralManager
import java.util.concurrent.TimeUnit

/**
 * v2.9.83: Referral QR Card
 *
 * Shows:
 * 1. Premium status banner (days remaining or expired)
 * 2. User's unique QR code
 * 3. Referral code + share button
 * 4. "Scan someone's QR" button
 * 5. How it works steps
 * 6. Referral stats
 */
@Composable
fun ReferralQrCard(
    onScanClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    val context = LocalContext.current
    val referralCode = remember { ReferralManager.getReferralCode(context) }
    val referralLink = remember { ReferralManager.getReferralLink(context) }
    val referralCount = remember { PremiumManager.getReferralCount(context) }

    // Premium status
    var daysRemaining by remember { mutableStateOf(PremiumManager.getDaysRemaining(context)) }
    var isPremium by remember { mutableStateOf(PremiumManager.isPremiumActive(context)) }

    // Refresh premium status every second (for live countdown)
    LaunchedEffect(Unit) {
        while (true) {
            daysRemaining = PremiumManager.getDaysRemaining(context)
            isPremium = PremiumManager.isPremiumActive(context)
            kotlinx.coroutines.delay(60_000) // update every minute
        }
    }

    // Generate QR code bitmap
    val qrBitmap: Bitmap? = remember { QrCodeGenerator.generateReferralQrCode(referralCode) }

    // Premium days earned from referrals (3 days per referral + 30 day bonus at 10)
    val premiumDaysEarned = remember {
        val baseDays = referralCount * PremiumManager.REFERRER_REWARD_DAYS
        val bonusDays = if (referralCount >= PremiumManager.MONTH_BONUS_THRESHOLD) 30 else 0
        baseDays + bonusDays
    }

    Card(
        modifier = modifier.fillMaxWidth(),
        shape = RoundedCornerShape(20.dp),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surface
        ),
        elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
    ) {
        Column(
            modifier = Modifier.padding(20.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            // Premium status banner
            PremiumStatusBanner(isPremium = isPremium, daysRemaining = daysRemaining)

            Spacer(modifier = Modifier.height(20.dp))

            // Title
            Text(
                text = stringResource(R.string.referral_title),
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.Bold,
                textAlign = TextAlign.Center
            )
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = stringResource(R.string.referral_subtitle),
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                textAlign = TextAlign.Center
            )

            Spacer(modifier = Modifier.height(20.dp))

            // QR Code
            if (qrBitmap != null) {
                Box(
                    modifier = Modifier
                        .size(220.dp)
                        .background(
                            color = Color.White,
                            shape = RoundedCornerShape(16.dp)
                        )
                        .padding(12.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Image(
                        bitmap = qrBitmap.asImageBitmap(),
                        contentDescription = stringResource(R.string.referral_your_qr),
                        modifier = Modifier.size(196.dp)
                    )
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

            // Referral code
            Text(
                text = stringResource(R.string.referral_your_code),
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
            Text(
                text = referralCode,
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.primary,
                letterSpacing = 2.sp
            )

            Spacer(modifier = Modifier.height(16.dp))

            // Share button
            Button(
                onClick = {
                    val message = context.getString(
                        R.string.referral_share_message,
                        referralCode,
                        referralLink
                    )
                    val intent = Intent(Intent.ACTION_SEND).apply {
                        type = "text/plain"
                        putExtra(Intent.EXTRA_SUBJECT, "NotiFetch — Never miss a delivery order!")
                        putExtra(Intent.EXTRA_TEXT, message)
                    }
                    context.startActivity(Intent.createChooser(intent, "Share via"))
                },
                modifier = Modifier.fillMaxWidth(),
                colors = ButtonDefaults.buttonColors(
                    containerColor = MaterialTheme.colorScheme.primary
                )
            ) {
                Icon(Icons.Default.Share, contentDescription = null, modifier = Modifier.size(18.dp))
                Spacer(modifier = Modifier.width(8.dp))
                Text(stringResource(R.string.referral_share_qr))
            }

            Spacer(modifier = Modifier.height(8.dp))

            // Scan button
            OutlinedButton(
                onClick = onScanClick,
                modifier = Modifier.fillMaxWidth()
            ) {
                Icon(Icons.Default.QrCodeScanner, contentDescription = null, modifier = Modifier.size(18.dp))
                Spacer(modifier = Modifier.width(8.dp))
                Text(stringResource(R.string.referral_scan_qr))
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Scan subtitle
            Text(
                text = stringResource(R.string.referral_scan_subtitle),
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                textAlign = TextAlign.Center
            )

            Spacer(modifier = Modifier.height(20.dp))

            // Stats row
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceEvenly
            ) {
                StatItem(
                    icon = Icons.Default.Star,
                    value = referralCount.toString(),
                    label = stringResource(R.string.referral_total_referrals)
                )
                StatItem(
                    icon = Icons.Default.CardGiftcard,
                    value = premiumDaysEarned.toString(),
                    label = stringResource(R.string.referral_premium_earned)
                )
            }

            Spacer(modifier = Modifier.height(20.dp))

            // How it works
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(
                        color = MaterialTheme.colorScheme.primaryContainer.copy(alpha = 0.3f),
                        shape = RoundedCornerShape(12.dp)
                    )
                    .padding(16.dp)
            ) {
                Text(
                    text = stringResource(R.string.referral_how_it_works),
                    style = MaterialTheme.typography.titleSmall,
                    fontWeight = FontWeight.SemiBold
                )
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = stringResource(R.string.referral_step_1),
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
                Text(
                    text = stringResource(R.string.referral_step_2),
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
                Text(
                    text = stringResource(R.string.referral_step_3),
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
                Text(
                    text = stringResource(R.string.referral_step_4),
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.primary,
                    fontWeight = FontWeight.SemiBold
                )
            }

            Spacer(modifier = Modifier.height(12.dp))

            // Reward info
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text(
                    text = stringResource(R.string.referral_reward_sharer),
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
                Text(
                    text = stringResource(R.string.referral_reward_scanner),
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        }
    }
}

@Composable
private fun PremiumStatusBanner(isPremium: Boolean, daysRemaining: Long) {
    val gradient = if (isPremium) {
        Brush.horizontalGradient(listOf(Color(0xFFFF5A1F), Color(0xFFF59E0B)))
    } else {
        Brush.horizontalGradient(listOf(Color(0xFF6B7280), Color(0xFF4B5563)))
    }

    Box(
        modifier = Modifier
            .fillMaxWidth()
            .background(gradient, RoundedCornerShape(12.dp))
            .padding(12.dp)
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier.fillMaxWidth()
        ) {
            Icon(
                imageVector = if (isPremium) Icons.Default.Star else Icons.Default.QrCode,
                contentDescription = null,
                tint = Color.White,
                modifier = Modifier.size(24.dp)
            )
            Spacer(modifier = Modifier.width(8.dp))
            Column {
                Text(
                    text = if (isPremium) stringResource(R.string.premium_active)
                           else stringResource(R.string.premium_free_tier),
                    color = Color.White,
                    fontWeight = FontWeight.Bold,
                    style = MaterialTheme.typography.titleSmall
                )
                Text(
                    text = if (isPremium) {
                        if (daysRemaining > 1) stringResource(R.string.premium_days_remaining, daysRemaining.toInt())
                        else if (daysRemaining == 1L) stringResource(R.string.premium_one_day_remaining)
                        else stringResource(R.string.premium_hours_remaining, PremiumManager.getHoursRemaining(LocalContext.current).toInt())
                    } else {
                        stringResource(R.string.premium_unlock_more)
                    },
                    color = Color.White.copy(alpha = 0.9f),
                    style = MaterialTheme.typography.bodySmall
                )
            }
        }
    }
}

@Composable
private fun StatItem(
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    value: String,
    label: String
) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Icon(
            imageVector = icon,
            contentDescription = null,
            tint = MaterialTheme.colorScheme.primary,
            modifier = Modifier.size(28.dp)
        )
        Spacer(modifier = Modifier.height(4.dp))
        Text(
            text = value,
            style = MaterialTheme.typography.titleLarge,
            fontWeight = FontWeight.Bold
        )
        Text(
            text = label,
            style = MaterialTheme.typography.bodySmall,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )
    }
}
