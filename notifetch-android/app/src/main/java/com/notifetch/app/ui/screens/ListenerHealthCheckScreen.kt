package com.notifetch.app.ui.screens

import android.app.Activity
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.expandVertically
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.shrinkVertically
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.BatteryAlert
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Error
import androidx.compose.material.icons.filled.NotificationsActive
import androidx.compose.material.icons.filled.PhoneAndroid
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.Send
import androidx.compose.material.icons.filled.Settings as SettingsIcon
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.notifetch.app.notification.NotiFetchListenerService
import com.notifetch.app.util.BatteryOptimizationHelper
import androidx.compose.ui.res.stringResource
import com.notifetch.app.R

/**
 * v2.9.14: Listener Health Check Screen
 *
 * Diagnoses why notifications aren't being captured and provides one-tap
 * "Fix now" buttons for each issue. Especially useful for OEM ROMs
 * (Realme/Xiaomi/OPPO/Samsung) that kill background services.
 *
 * Checks 4 things:
 *   1. Notification access granted?
 *   2. Battery optimization exemption granted?
 *   3. OEM auto-start permission granted? (Realme/Xiaomi/OPPO/Vivo/Samsung only)
 *   4. Listener service actually connected?
 *
 * Accessible from Settings → "Listener Health Check"
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ListenerHealthCheckScreen(
    onNavigateBack: () -> Unit
) {
    val context = LocalContext.current
    val activity = context as? Activity

    // States we check on launch + on refresh
    var notificationAccessGranted by remember { mutableStateOf(false) }
    var batteryOptimizationExempt by remember { mutableStateOf(false) }
    val isAggressiveOem = remember { BatteryOptimizationHelper.isAggressiveOem() }
    val isRealme = remember { BatteryOptimizationHelper.isRealmeDevice() }
    val oemName = remember { BatteryOptimizationHelper.getOemDisplayName() }
    var lastRefresh by remember { mutableStateOf(0L) }

    // Refresh function — re-checks all permissions
    fun refresh() {
        notificationAccessGranted = NotiFetchListenerService.isListenerEnabled(context)
        batteryOptimizationExempt = BatteryOptimizationHelper.isExemptFromBatteryOptimization(context)
        lastRefresh = System.currentTimeMillis()
    }

    // Initial check
    LaunchedEffect(Unit) { refresh() }

    // Re-check when screen regains focus (user returns from settings)
    LaunchedEffect(Unit) {
        // Use a simple lifecycle-less approach: refresh when composable recomposes
        // after the user returns from a settings screen
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
    ) {
        TopAppBar(
            title = { Text(stringResource(R.string.health_check_title)) },
            navigationIcon = {
                IconButton(onClick = onNavigateBack) {
                    Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = stringResource(R.string.common_back))
                }
            },
            actions = {
                IconButton(onClick = { refresh() }) {
                    Icon(Icons.Default.Refresh, contentDescription = stringResource(R.string.health_check_refresh))
                }
            },
            colors = TopAppBarDefaults.topAppBarColors(
                containerColor = MaterialTheme.colorScheme.surface
            )
        )

        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            // ── Device info card ─────────────────────────────────────────────
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(
                    containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.4f)
                )
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            Icons.Default.PhoneAndroid,
                            contentDescription = null,
                            tint = MaterialTheme.colorScheme.primary,
                            modifier = Modifier.size(20.dp)
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = stringResource(R.string.health_check_device_label, oemName),
                            style = MaterialTheme.typography.titleSmall,
                            fontWeight = FontWeight.SemiBold
                        )
                    }
                    if (isRealme) {
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = stringResource(R.string.health_check_realme_warning),
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.error
                        )
                    } else if (isAggressiveOem) {
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = stringResource(R.string.health_check_aggressive_oem_warning, oemName),
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }
            }

            // ── Health Check 1: Notification access ─────────────────────────
            HealthCheckItem(
                icon = Icons.Default.NotificationsActive,
                title = stringResource(R.string.health_check_notif_access_title),
                subtitle = if (notificationAccessGranted)
                    stringResource(R.string.health_check_notif_access_granted)
                else
                    stringResource(R.string.health_check_notif_access_not_granted),
                status = if (notificationAccessGranted) HealthStatus.GOOD else HealthStatus.CRITICAL,
                actionLabel = if (notificationAccessGranted) null else stringResource(R.string.health_check_grant_access),
                onAction = {
                    NotiFetchListenerService.openNotificationSettings(context)
                }
            )

            // ── Health Check 2: Battery optimization ────────────────────────
            HealthCheckItem(
                icon = Icons.Default.BatteryAlert,
                title = stringResource(R.string.health_check_battery_title),
                subtitle = if (batteryOptimizationExempt)
                    stringResource(R.string.health_check_battery_exempt)
                else
                    stringResource(R.string.health_check_battery_not_exempt),
                status = if (batteryOptimizationExempt) HealthStatus.GOOD else HealthStatus.CRITICAL,
                actionLabel = if (batteryOptimizedExemptLabel(batteryOptimizationExempt)) null else stringResource(R.string.health_check_disable_battery),
                onAction = {
                    activity?.let {
                        BatteryOptimizationHelper.requestBatteryOptimizationExemption(it)
                    }
                }
            )

            // ── Health Check 3: OEM Auto-start (Realme/Xiaomi/OPPO/Vivo/Samsung) ──
            if (isAggressiveOem) {
                HealthCheckItem(
                    icon = Icons.Default.Warning,
                    title = stringResource(R.string.health_check_autostart_title, oemName),
                    subtitle = stringResource(R.string.health_check_autostart_subtitle, oemName, oemName),
                    status = HealthStatus.WARNING,  // Can't programmatically verify, so always warn
                    actionLabel = stringResource(R.string.health_check_open_autostart, oemName),
                    onAction = {
                        activity?.let {
                            BatteryOptimizationHelper.openOemAutoStartSettings(it)
                        }
                    }
                )
            }

            // ── Health Check 4: Realme App Battery Saver (extra) ────────────
            if (isRealme) {
                HealthCheckItem(
                    icon = Icons.Default.BatteryAlert,
                    title = stringResource(R.string.health_check_realme_battery_saver_title),
                    subtitle = stringResource(R.string.health_check_realme_battery_saver_subtitle),
                    status = HealthStatus.WARNING,
                    actionLabel = stringResource(R.string.health_check_open_notifetch_settings),
                    onAction = {
                        activity?.let {
                            BatteryOptimizationHelper.openRealmeAppBatterySaver(it)
                        }
                    }
                )
            }

            Spacer(modifier = Modifier.height(16.dp))

            // ── Final summary card ──────────────────────────────────────────
            val allGood = notificationAccessGranted && batteryOptimizationExempt
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(
                    containerColor = if (allGood && !isAggressiveOem)
                        MaterialTheme.colorScheme.primaryContainer.copy(alpha = 0.3f)
                    else
                        MaterialTheme.colorScheme.errorContainer.copy(alpha = 0.3f)
                )
            ) {
                Column(
                    modifier = Modifier.padding(20.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Icon(
                        if (allGood && !isAggressiveOem) Icons.Default.CheckCircle else Icons.Default.Error,
                        contentDescription = null,
                        tint = if (allGood && !isAggressiveOem)
                            MaterialTheme.colorScheme.primary
                        else
                            MaterialTheme.colorScheme.error,
                        modifier = Modifier.size(48.dp)
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = if (allGood && !isAggressiveOem)
                            stringResource(R.string.health_check_all_passed)
                        else
                            stringResource(R.string.health_check_permissions_missing),
                        style = MaterialTheme.typography.titleLarge,
                        fontWeight = FontWeight.Bold
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = if (allGood && !isAggressiveOem)
                            stringResource(R.string.health_check_all_passed_desc)
                        else
                            stringResource(R.string.health_check_permissions_missing_desc),
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        textAlign = androidx.compose.ui.text.style.TextAlign.Center
                    )
                }
            }

            // ── v2.9.19: Diagnostic Log ──────────────────────────────────────
            Spacer(modifier = Modifier.height(16.dp))

            var showDiagnostic by remember { mutableStateOf(false) }
            var diagnosticText by remember { mutableStateOf("") }

            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(
                    containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.4f)
                )
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(
                            Icons.Default.Search,
                            contentDescription = null,
                            tint = MaterialTheme.colorScheme.primary,
                            modifier = Modifier.size(20.dp)
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = stringResource(R.string.health_check_diagnostic_title),
                            style = MaterialTheme.typography.titleSmall,
                            fontWeight = FontWeight.SemiBold,
                            modifier = Modifier.weight(1f)
                        )
                        OutlinedButton(
                            onClick = {
                                diagnosticText = com.notifetch.app.notification.DiagnosticLogger.getLogSummary(context)
                                showDiagnostic = !showDiagnostic
                            },
                            shape = RoundedCornerShape(8.dp),
                            contentPadding = androidx.compose.foundation.layout.PaddingValues(horizontal = 12.dp, vertical = 4.dp)
                        ) {
                            Text(if (showDiagnostic) stringResource(R.string.health_check_hide) else stringResource(R.string.health_check_show_log), style = MaterialTheme.typography.labelSmall)
                        }
                    }

                    if (showDiagnostic) {
                        Spacer(modifier = Modifier.height(12.dp))

                        // Show untracked packages prominently
                        val untracked = com.notifetch.app.notification.DiagnosticLogger.getUntrackedPackages(context)
                        if (untracked.isNotEmpty()) {
                            Text(
                                text = stringResource(R.string.health_check_untracked_warning, untracked.size),
                                style = MaterialTheme.typography.titleSmall,
                                fontWeight = FontWeight.Bold,
                                color = MaterialTheme.colorScheme.error
                            )
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(
                                text = stringResource(R.string.health_check_untracked_desc),
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                            Spacer(modifier = Modifier.height(8.dp))
                            untracked.forEach { pkg ->
                                Text(
                                    text = "  ❌ $pkg",
                                    style = MaterialTheme.typography.bodySmall,
                                    color = MaterialTheme.colorScheme.error,
                                    fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace
                                )
                            }
                        }

                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = diagnosticText,
                            style = MaterialTheme.typography.bodySmall,
                            fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace,
                            modifier = Modifier
                                .fillMaxWidth()
                                .heightIn(max = 300.dp)
                                .verticalScroll(rememberScrollState())
                        )

                        Spacer(modifier = Modifier.height(8.dp))
                        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            OutlinedButton(
                                onClick = {
                                    val shareIntent = android.content.Intent(android.content.Intent.ACTION_SEND).apply {
                                        type = "text/plain"
                                        putExtra(android.content.Intent.EXTRA_SUBJECT, "NotiFetch Diagnostic Log")
                                        putExtra(android.content.Intent.EXTRA_TEXT, diagnosticText)
                                    }
                                    context.startActivity(android.content.Intent.createChooser(shareIntent, context.getString(R.string.health_check_send_diagnostic_log)))
                                },
                                shape = RoundedCornerShape(8.dp),
                                modifier = Modifier.weight(1f)
                            ) {
                                Icon(Icons.Default.Send, contentDescription = null, modifier = Modifier.size(16.dp))
                                Spacer(modifier = Modifier.width(4.dp))
                                Text(stringResource(R.string.health_check_send_log), style = MaterialTheme.typography.labelSmall)
                            }
                            OutlinedButton(
                                onClick = {
                                    com.notifetch.app.notification.DiagnosticLogger.clearLog(context)
                                    diagnosticText = context.getString(R.string.health_check_log_cleared)
                                },
                                shape = RoundedCornerShape(8.dp),
                                modifier = Modifier.weight(1f)
                            ) {
                                Text(stringResource(R.string.health_check_clear_log), style = MaterialTheme.typography.labelSmall)
                            }
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(32.dp))
        }
    }
}

private fun batteryOptimizedExemptLabel(exempt: Boolean): Boolean = exempt

enum class HealthStatus { GOOD, WARNING, CRITICAL }

@Composable
private fun HealthCheckItem(
    icon: ImageVector,
    title: String,
    subtitle: String,
    status: HealthStatus,
    actionLabel: String?,
    onAction: () -> Unit
) {
    val statusColor = when (status) {
        HealthStatus.GOOD -> Color(0xFF4CAF50)  // Green
        HealthStatus.WARNING -> Color(0xFFFF9800)  // Orange
        HealthStatus.CRITICAL -> MaterialTheme.colorScheme.error
    }

    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surface
        )
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Box(
                    modifier = Modifier
                        .size(40.dp)
                        .clip(CircleShape)
                        .background(statusColor.copy(alpha = 0.15f)),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        icon,
                        contentDescription = null,
                        tint = statusColor,
                        modifier = Modifier.size(22.dp)
                    )
                }
                Spacer(modifier = Modifier.width(12.dp))
                Text(
                    text = title,
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.SemiBold,
                    modifier = Modifier.weight(1f)
                )
                // Status indicator
                when (status) {
                    HealthStatus.GOOD -> {
                        Icon(
                            Icons.Default.CheckCircle,
                            contentDescription = stringResource(R.string.common_good),
                            tint = statusColor,
                            modifier = Modifier.size(24.dp)
                        )
                    }
                    HealthStatus.WARNING -> {
                        Icon(
                            Icons.Default.Warning,
                            contentDescription = stringResource(R.string.common_warning),
                            tint = statusColor,
                            modifier = Modifier.size(24.dp)
                        )
                    }
                    HealthStatus.CRITICAL -> {
                        Icon(
                            Icons.Default.Error,
                            contentDescription = stringResource(R.string.common_critical),
                            tint = statusColor,
                            modifier = Modifier.size(24.dp)
                        )
                    }
                }
            }
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = subtitle,
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                lineHeight = 18.sp
            )
            if (actionLabel != null) {
                Spacer(modifier = Modifier.height(12.dp))
                Button(
                    onClick = onAction,
                    shape = RoundedCornerShape(8.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = statusColor
                    )
                ) {
                    Icon(Icons.Default.SettingsIcon, contentDescription = null, modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(actionLabel, fontSize = 13.sp)
                }
            }
        }
    }
}
