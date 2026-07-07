package com.notifetch.app.ui.screens

import android.content.ComponentName
import android.content.Intent
import android.net.Uri
import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.ContentCopy
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material.icons.filled.Notifications
import androidx.compose.material.icons.filled.OpenInNew
import androidx.compose.material.icons.filled.Payments
import androidx.compose.material.icons.filled.Share
import androidx.compose.material.icons.filled.Straighten
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FilledTonalButton
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalClipboardManager
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.AnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.notifetch.app.notification.PendingIntentCache
import com.notifetch.app.ui.components.CategoryBadge
import com.notifetch.app.ui.components.PlatformIcon
import com.notifetch.app.ui.theme.getPlatformColor
import com.notifetch.app.ui.viewmodel.NotificationDetailViewModel
import com.notifetch.app.util.Helpers

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun NotificationDetailScreen(
    onNavigateBack: () -> Unit,
    viewModel: NotificationDetailViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()
    val notification = uiState.notification
    val context = LocalContext.current
    val clipboardManager = LocalClipboardManager.current

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
    ) {
        TopAppBar(
            title = { Text("Notification Details") },
            navigationIcon = {
                IconButton(onClick = onNavigateBack) {
                    Icon(
                        imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                        contentDescription = "Back"
                    )
                }
            },
            actions = {
                if (notification != null) {
                    IconButton(onClick = {
                        viewModel.deleteNotification()
                        onNavigateBack()
                    }) {
                        Icon(
                            imageVector = Icons.Default.Delete,
                            contentDescription = "Delete",
                            tint = MaterialTheme.colorScheme.error
                        )
                    }
                }
            },
            colors = TopAppBarDefaults.topAppBarColors(
                containerColor = MaterialTheme.colorScheme.surface
            )
        )

        if (notification == null && uiState.isLoading) {
            Column(
                modifier = Modifier.fillMaxSize(),
                verticalArrangement = Arrangement.Center,
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Text("Loading...", style = MaterialTheme.typography.bodyLarge)
            }
        } else if (notification == null) {
            // v2.9.71: Show brief message + auto-navigate back
            // instead of stranding user on 'not found' screen
            LaunchedEffect(Unit) {
                kotlinx.coroutines.delay(1500)
                onNavigateBack()
            }
            Column(
                modifier = Modifier.fillMaxSize(),
                verticalArrangement = Arrangement.Center,
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Icon(
                    imageVector = Icons.Default.Notifications,
                    contentDescription = null,
                    modifier = Modifier.size(64.dp),
                    tint = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.5f)
                )
                Spacer(modifier = Modifier.height(16.dp))
                Text(
                    text = "Notification no longer available",
                    style = MaterialTheme.typography.titleLarge,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = "Returning to home...",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        } else {
            val displayPlatformName = uiState.resolvedDisplayName ?: notification.platform
            val platformColor = getPlatformColor(displayPlatformName, notification.packageName)

            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .verticalScroll(rememberScrollState())
                    .padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                // Platform header
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(
                        containerColor = platformColor.copy(alpha = 0.1f)
                    )
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(16.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        PlatformIcon(
                            platform = displayPlatformName,
                            color = platformColor,
                            packageName = notification.packageName,
                            size = 56.dp
                        )
                        Spacer(modifier = Modifier.width(16.dp))
                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = displayPlatformName,
                                style = MaterialTheme.typography.titleLarge,
                                fontWeight = FontWeight.Bold,
                                color = platformColor
                            )
                            Text(
                                text = notification.packageName,
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                    }
                }

                // ── Open App Button (PRIMARY ACTION) ──────────────────────
                // v2.9.8: 5-strategy approach. Deep link is tried FIRST using the
                // persisted URI from the original notification's contentIntent.
                // This survives process death — even if NotiFetch was killed and
                // the in-memory PendingIntentCache is empty, we can still deep-link
                // to the specific offer/order/tracking screen.
                //   1. Persisted deep link URI (from DB) — opens specific screen
                //   2. Cached PendingIntent (in-memory) — opens specific screen
                //   3. getLaunchIntentForPackage() — opens app main screen
                //   4. Resolve LAUNCHER activity manually — backup for OEM ROMs
                //   5. Play Store (last resort — app not installed)
                Button(
                    onClick = {
                        try {
                            openSourceApp(
                                context = context,
                                packageName = notification.packageName,
                                displayName = displayPlatformName,
                                deepLinkUri = notification.deepLinkUri,
                                deepLinkComponent = notification.deepLinkComponent,
                                systemNotificationId = notification.systemNotificationId
                            )
                        } catch (e: Exception) {
                            android.util.Log.e("NotiFetchOpen", "Button onClick crashed", e)
                            Toast.makeText(context, "Error opening app: ${e.message}", Toast.LENGTH_LONG).show()
                        }
                    },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = platformColor
                    )
                ) {
                    Icon(
                        Icons.Default.OpenInNew,
                        contentDescription = null,
                        modifier = Modifier.size(20.dp)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("Open $displayPlatformName", fontWeight = FontWeight.Bold)
                }

                // ── Quick Actions Row ────────────────────────────────────
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    // Copy text
                    OutlinedButton(
                        onClick = {
                            val textToCopy = buildString {
                                append("${notification.title}\n")
                                if (notification.body.isNotBlank()) append("${notification.body}\n")
                                if (notification.bigText.isNotBlank()) append("${notification.bigText}\n")
                                if (notification.orderValue != null) append("Value: ${Helpers.formatCurrency(notification.orderValue, notification.currency)}\n")
                                append("From: $displayPlatformName")
                            }
                            clipboardManager.setText(AnnotatedString(textToCopy))
                            Toast.makeText(context, "Copied to clipboard", Toast.LENGTH_SHORT).show()
                        },
                        modifier = Modifier.weight(1f),
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Icon(Icons.Default.ContentCopy, contentDescription = null, modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(4.dp))
                        Text("Copy", style = MaterialTheme.typography.labelMedium)
                    }

                    // Share
                    OutlinedButton(
                        onClick = {
                            val shareText = buildString {
                                append("${notification.title}\n")
                                if (notification.body.isNotBlank()) append("${notification.body}\n")
                                if (notification.orderValue != null) append("Value: ${Helpers.formatCurrency(notification.orderValue, notification.currency)}\n")
                                append("From: $displayPlatformName")
                            }
                            val shareIntent = Intent(Intent.ACTION_SEND).apply {
                                type = "text/plain"
                                putExtra(Intent.EXTRA_TEXT, shareText)
                            }
                            context.startActivity(Intent.createChooser(shareIntent, "Share"))
                        },
                        modifier = Modifier.weight(1f),
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Icon(Icons.Default.Share, contentDescription = null, modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(4.dp))
                        Text("Share", style = MaterialTheme.typography.labelMedium)
                    }
                }

                // Category and time
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    notification.category?.let {
                        CategoryBadge(category = it)
                    }
                    Text(
                        text = Helpers.formatTimestamp(notification.receivedAt),
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }

                // Title
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text(
                            text = "Title",
                            style = MaterialTheme.typography.labelMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = notification.title,
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.SemiBold,
                            color = MaterialTheme.colorScheme.onSurface
                        )
                    }
                }

                // Body
                if (notification.body.isNotBlank()) {
                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Column(modifier = Modifier.padding(16.dp)) {
                            Text(
                                text = "Body",
                                style = MaterialTheme.typography.labelMedium,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(
                                text = notification.body,
                                style = MaterialTheme.typography.bodyLarge,
                                color = MaterialTheme.colorScheme.onSurface
                            )
                        }
                    }
                }

                // Big text
                if (notification.bigText.isNotBlank()) {
                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Column(modifier = Modifier.padding(16.dp)) {
                            Text(
                                text = "Full Text",
                                style = MaterialTheme.typography.labelMedium,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(
                                text = notification.bigText,
                                style = MaterialTheme.typography.bodyMedium,
                                color = MaterialTheme.colorScheme.onSurface
                            )
                        }
                    }
                }

                // Sub text
                if (notification.subText.isNotBlank()) {
                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Column(modifier = Modifier.padding(16.dp)) {
                            Text(
                                text = "Sub Text",
                                style = MaterialTheme.typography.labelMedium,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(
                                text = notification.subText,
                                style = MaterialTheme.typography.bodyMedium,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                    }
                }

                // Quick info cards
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    if (notification.orderValue != null) {
                        InfoDetailCard(
                            icon = Icons.Default.Payments,
                            label = "Order Value",
                            value = Helpers.formatCurrency(notification.orderValue, notification.currency),
                            modifier = Modifier.weight(1f)
                        )
                    }
                    if (notification.distance != null) {
                        InfoDetailCard(
                            icon = Icons.Default.Straighten,
                            label = "Distance",
                            value = notification.distance,
                            modifier = Modifier.weight(1f)
                        )
                    }
                }

                // Pickup location
                if (notification.pickupLocation != null) {
                    LocationCard(
                        label = "Pickup",
                        location = notification.pickupLocation,
                        icon = Icons.Default.LocationOn
                    )
                }

                // Dropoff location
                if (notification.dropoffLocation != null) {
                    LocationCard(
                        label = "Drop-off",
                        location = notification.dropoffLocation,
                        icon = Icons.Default.LocationOn
                    )
                }

                Spacer(modifier = Modifier.height(32.dp))
            }
        }
    }
}

/**
 * Opens the source app that generated the notification.
 *
 * v2.9.35: 4-tier fallback strategy — each tier guarded by [resolveActivity]
 * pre-check to prevent the silent failures that plagued v2.9.30–v2.9.34.
 *
 * When you tap a notification in Android's status bar, the system fires the
 * notification's contentIntent (PendingIntent). This opens the EXACT screen
 * the app intended (offer page, order tracking, etc.).
 *
 * The listener service extracts that Intent's URI (via [Intent.toUri] with
 * [Intent.URI_INTENT_SCHEME]) and persists it as `deepLinkUri`. We also
 * persist the explicit component (`deepLinkComponent`) as a fallback.
 *
 * Tier 1: Reconstruct the original Intent from [deepLinkUri] using
 *         [Intent.parseUri] with [Intent.URI_INTENT_SCHEME]. This is the
 *         exact same Intent the source app posted — opens the specific page.
 *
 * Tier 2: If [deepLinkComponent] is set (e.g. "in.swiggy.partner/.HomeActivity"),
 *         build a component-only Intent. Less precise than Tier 1 (no extras,
 *         no action, no data) but still lands on a specific Activity.
 *
 * Tier 3: [PackageManager.getLaunchIntentForPackage] — opens the app's MAIN
 *         screen. Always works if the app is installed. This is the
 *         guaranteed fallback that v2.9.28 confirmed as reliable.
 *
 * Tier 4: Play Store (app not installed).
 *
 * v2.9.47: Removed resolveActivity() pre-checks. On Android 11+ (API 30+),
 * package visibility filtering causes resolveActivity() to return null even
 * when the target activity exists and is launchable. This caused deep links
 * to silently fall through to the main screen (Tier 3) instead of opening
 * the specific order/offer page.
 *
 * The fix: call startActivity() directly and catch ActivityNotFoundException.
 * startActivity() bypasses package visibility filtering for explicit component
 * intents and parsed URI intents — it only throws if the activity truly doesn't
 * exist. This is the correct Android 11+ pattern for deep link resolution.
 */
/**
 * v2.9.60 SECURITY HARDENING: Strip all FLAG_GRANT_* URI permission flags from an Intent.
 *
 * v2.9.59 only stripped flags from the top-level intent — but Intent.parseUri() can
 * produce an intent with a nested [Intent.selector], and the selector can independently
 * carry FLAG_GRANT_* flags. An attacker-controlled URI could put the GRANT flags on the
 * selector to bypass the v2.9.59 fix.
 *
 * This function recursively strips GRANT flags from:
 *   1. The top-level intent
 *   2. The nested selector intent (if any)
 *   3. Any ClipData items (each ClipData item can carry its own URI + grants)
 *
 * It also nulls out ClipData URI permission grants as a defense-in-depth measure.
 *
 * @param intent The Intent to sanitize (modified in place)
 */
private fun stripGrantFlags(intent: Intent) {
    // 1) Strip GRANT flags from the top-level intent.
    val grantMask = (
        Intent.FLAG_GRANT_READ_URI_PERMISSION or
        Intent.FLAG_GRANT_WRITE_URI_PERMISSION or
        Intent.FLAG_GRANT_PERSISTABLE_URI_PERMISSION or
        Intent.FLAG_GRANT_PREFIX_URI_PERMISSION
    ).inv()
    intent.flags = intent.flags and grantMask

    // 2) Recursively strip from the nested selector intent (if present).
    //    Selector intents are used by `intent:` URIs that wrap a chooser.
    @Suppress("DEPRECATION")
    val selector = intent.selector
    if (selector != null) {
        selector.flags = selector.flags and grantMask
        // Selectors can theoretically have nested selectors too — recurse one level.
        @Suppress("DEPRECATION")
        selector.selector?.let { it.flags = it.flags and grantMask }
    }

    // 3) Strip URI permission grants from ClipData.
    //    ClipData items can carry URIs that get auto-granted when the intent fires.
    //    We keep the ClipData (so the receiving app can read text/etc.) but revoke
    //    the URI grants by removing the GRANT flags from each item's intent.
    val clipData = intent.clipData
    if (clipData != null) {
        for (i in 0 until clipData.itemCount) {
            val item = clipData.getItemAt(i)
            item.intent?.let { stripGrantFlags(it) }
        }
    }
}

private fun openSourceApp(
    context: android.content.Context,
    packageName: String,
    displayName: String,
    deepLinkUri: String? = null,
    deepLinkComponent: String? = null,
    systemNotificationId: Int? = null
) {
    val pm = context.packageManager
    val logTag = "NotiFetchOpen"

    if (packageName.isBlank()) {
        android.util.Log.e(logTag, "Package name is missing!")
        return
    }

    // v2.9.67: SIMPLIFIED — just open the app. No deep link tiers.
    //
    // After 6 months of trying to deep-link to specific order pages, we
    // learned that Android's notification listener API makes this unreliable:
    //   - PendingIntent tokens get invalidated
    //   - getActiveNotifications() only works if listener is alive
    //   - OEM battery kills make listener die randomly
    //   - Each delivery app handles deep links differently
    //
    // For delivery riders, opening the app IS the right action — the app
    // automatically shows them what they need to do (new order, delivery
    // update, etc.). They don't need to land on a specific page.
    //
    // getLaunchIntentForPackage() is 100% reliable. Every tap opens the app.

    // ── Open the app (main screen) ──
    try {
        val launchIntent = pm.getLaunchIntentForPackage(packageName)
        if (launchIntent != null) {
            launchIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            context.startActivity(launchIntent)
            android.util.Log.d(logTag, "Opened $packageName → main screen")
            return
        }
    } catch (e: Exception) {
        android.util.Log.w(logTag, "Launch intent failed: ${e.message}")
    }

    // ── App not installed → Play Store ──
    android.util.Log.w(logTag, "App $packageName not installed — opening Play Store")
    Toast.makeText(context, "$displayName not installed", Toast.LENGTH_SHORT).show()
    try {
        val playStoreIntent = Intent(Intent.ACTION_VIEW).apply {
            data = Uri.parse("market://details?id=$packageName")
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        }
        context.startActivity(playStoreIntent)
    } catch (_: Exception) {
        val webIntent = Intent(Intent.ACTION_VIEW).apply {
            data = Uri.parse("https://play.google.com/store/apps/details?id=$packageName")
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        }
        context.startActivity(webIntent)
    }
}
@Composable
private fun InfoDetailCard(
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    label: String,
    value: String,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier,
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f)
        )
    ) {
        Column(
            modifier = Modifier.padding(12.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Icon(
                imageVector = icon,
                contentDescription = label,
                tint = MaterialTheme.colorScheme.primary,
                modifier = Modifier.size(24.dp)
            )
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = label,
                style = MaterialTheme.typography.labelSmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
            Text(
                text = value,
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onSurface
            )
        }
    }
}

@Composable
private fun LocationCard(
    label: String,
    location: String,
    icon: androidx.compose.ui.graphics.vector.ImageVector
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(12.dp)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(
                imageVector = icon,
                contentDescription = label,
                tint = MaterialTheme.colorScheme.primary,
                modifier = Modifier.size(24.dp)
            )
            Spacer(modifier = Modifier.width(12.dp))
            Column {
                Text(
                    text = label,
                    style = MaterialTheme.typography.labelSmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
                Text(
                    text = location,
                    style = MaterialTheme.typography.bodyMedium,
                    fontWeight = FontWeight.Medium,
                    color = MaterialTheme.colorScheme.onSurface
                )
            }
        }
    }
}
