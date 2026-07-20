package com.notifetch.app.ui.screens

import android.content.Intent
import android.provider.Settings
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.BatteryFull
import androidx.compose.material.icons.filled.NotificationsActive
import androidx.compose.material.icons.filled.RocketLaunch
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.notifetch.app.notification.NotiFetchListenerService
import com.notifetch.app.util.BatteryOptimizationHelper

/**
 * v2.9.11: Onboarding Tutorial
 *
 * 3-screen walkthrough shown on first launch (or when user taps "Show tutorial"
 * in Settings). Walks the user through:
 *
 *   Screen 1: How NotiFetch works (passive income from delivery notifications)
 *   Screen 2: Grant notification access (the core permission)
 *   Screen 3: Disable battery optimization (prevents OEM ROMs from killing listener)
 *
 * After completing onboarding, user lands on the Home screen.
 * Onboarding completion is persisted in DataStore so it doesn't show again.
 */
@Composable
fun OnboardingScreen(
    onComplete: () -> Unit
) {
    val context = LocalContext.current
    var currentPage by remember { mutableStateOf(0) }
    val totalPages = 3

    val pages = listOf(
        OnboardingPage(
            icon = Icons.Default.RocketLaunch,
            title = "Never Miss a Delivery Order",
            description = "NotiFetch captures delivery notifications from Swiggy, Zomato, Zepto, Blinkit, and 115+ more apps — " +
                    "all in one place. No more switching between apps to find your next order.",
            gradient = listOf(Color(0xFFFFC107), Color(0xFFFF9800)),
            buttonText = "Get Started",
            action = null
        ),
        OnboardingPage(
            icon = Icons.Default.NotificationsActive,
            title = "Grant Notification Access",
            description = "To capture delivery notifications, you need to grant NotiFetch permission to read notifications. " +
                    "Tap below to open Android Settings → Notification Access → enable NotiFetch.\n\n" +
                    "We only store notification text you can already see — never passwords, OTPs, or extras bundle data.",
            gradient = listOf(Color(0xFF4CAF50), Color(0xFF2E7D32)),
            buttonText = "Open Notification Settings",
            action = {
                NotiFetchListenerService.openNotificationSettings(context)
            }
        ),
        OnboardingPage(
            icon = Icons.Default.BatteryFull,
            title = "Keep NotiFetch Alive",
            description = "Android may kill NotiFetch in the background to save battery, stopping notification capture. " +
                    "Tap below to whitelist NotiFetch from battery optimization.\n\n" +
                    "On Xiaomi/Samsung/OPPO/Vivo, you may also need to enable 'Auto-start' in OEM-specific settings.",
            gradient = listOf(Color(0xFF2196F3), Color(0xFF1565C0)),
            buttonText = "Disable Battery Optimization",
            action = {
                if (context is android.app.Activity) {
                    BatteryOptimizationHelper.requestBatteryOptimizationExemption(context)
                }
            }
        )
    )

    val page = pages[currentPage]

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(
                Brush.verticalGradient(
                    colors = page.gradient.let { g ->
                        listOf(g[0].copy(alpha = 0.1f), g[1].copy(alpha = 0.05f), MaterialTheme.colorScheme.background)
                    }
                )
            )
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.SpaceBetween
    ) {
        // Top: progress indicator
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.Center
        ) {
            for (i in 0 until totalPages) {
                Box(
                    modifier = Modifier
                        .padding(horizontal = 4.dp)
                        .size(if (i == currentPage) 12.dp else 8.dp, if (i == currentPage) 12.dp else 8.dp)
                        .clip(CircleShape)
                        .background(
                            if (i == currentPage) MaterialTheme.colorScheme.primary
                            else MaterialTheme.colorScheme.outlineVariant
                        )
                )
            }
        }

        // Middle: icon + title + description
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Box(
                modifier = Modifier
                    .size(140.dp)
                    .clip(CircleShape)
                    .background(Brush.linearGradient(page.gradient)),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = page.icon,
                    contentDescription = null,
                    tint = Color.White,
                    modifier = Modifier.size(72.dp)
                )
            }
            Spacer(modifier = Modifier.height(32.dp))
            Text(
                text = page.title,
                style = MaterialTheme.typography.headlineSmall,
                fontWeight = FontWeight.Bold,
                textAlign = TextAlign.Center,
                color = MaterialTheme.colorScheme.onBackground
            )
            Spacer(modifier = Modifier.height(16.dp))
            Text(
                text = page.description,
                style = MaterialTheme.typography.bodyLarge,
                textAlign = TextAlign.Center,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                lineHeight = 24.sp
            )
        }

        // Bottom: action buttons
        Column(
            modifier = Modifier.fillMaxWidth(),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Button(
                onClick = {
                    page.action?.invoke()
                    if (currentPage < totalPages - 1) {
                        currentPage++
                    } else {
                        onComplete()
                    }
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(56.dp),
                shape = RoundedCornerShape(16.dp),
                colors = ButtonDefaults.buttonColors(
                    containerColor = MaterialTheme.colorScheme.primary
                )
            ) {
                Text(
                    text = if (currentPage < totalPages - 1) page.buttonText else "Start Using NotiFetch",
                    fontWeight = FontWeight.Bold,
                    fontSize = 16.sp
                )
            }
            Spacer(modifier = Modifier.height(12.dp))
            if (currentPage < totalPages - 1) {
                OutlinedButton(
                    onClick = onComplete,
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(16.dp)
                ) {
                    Text("Skip Tutorial")
                }
            } else {
                Text(
                    text = "You can change these permissions anytime in Settings",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    textAlign = TextAlign.Center
                )
            }
        }
    }
}

private data class OnboardingPage(
    val icon: androidx.compose.ui.graphics.vector.ImageVector,
    val title: String,
    val description: String,
    val gradient: List<Color>,
    val buttonText: String,
    val action: (() -> Unit)?
)
