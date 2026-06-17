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
                    text = "Notification not found",
                    style = MaterialTheme.typography.titleLarge,
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
                        openSourceApp(
                            context = context,
                            packageName = notification.packageName,
                            displayName = displayPlatformName,
                            deepLinkUri = notification.deepLinkUri,
                            deepLinkComponent = notification.deepLinkComponent
                        )
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
 * v2.9.8 NEW: Strategy 0 — Persisted deep link URI from database.
 *   When the notification was captured, we extracted the target Intent's data URI
 *   from the source app's contentIntent and stored it in the DB. This survives
 *   process death (unlike the in-memory PendingIntentCache). When launched, it
 *   opens the SPECIFIC screen the notification was about (offer, order tracking,
 *   etc.) — not just the app's main screen.
 *
 * v2.9.7 FIX: Added <queries> to AndroidManifest so getLaunchIntentForPackage()
 * works on Android 11+. Previously, this returned null on Android 11+ due to
 * package visibility restrictions, causing the button to fall through to Play Store.
 *
 * Strategy order:
 *   0. Persisted deep link URI (DB) — opens SPECIFIC screen (e.g., offer page) ✓ NEW
 *   1. Cached PendingIntent (in-memory) — opens specific screen (when app alive)
 *   2. getLaunchIntentForPackage() — opens app main screen
 *   3. Resolve LAUNCHER activity manually — backup for OEM ROMs
 *   4. Play Store (last resort — app not installed)
 */
private fun openSourceApp(
    context: android.content.Context,
    packageName: String,
    displayName: String,
    deepLinkUri: String? = null,
    deepLinkComponent: String? = null
) {
    try {
        val pm = context.packageManager

        // ── Strategy 0: Persisted deep link URI from database ───────────────
        // This is the BEST option — it deep-links to the exact screen the source
        // app intended (specific offer, order tracking, etc.) AND survives process
        // death. v2.9.8 new feature.
        if (!deepLinkUri.isNullOrBlank()) {
            try {
                val uri = Uri.parse(deepLinkUri)
                val deepLinkIntent = Intent(Intent.ACTION_VIEW).apply {
                    data = uri
                    setPackage(packageName) // Force the source app to handle it
                    addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP)
                }
                // Verify the source app can handle this URI
                if (deepLinkIntent.resolveActivity(pm) != null) {
                    context.startActivity(deepLinkIntent)
                    android.util.Log.d("NotiFetchOpen", "Opened $packageName via persisted deep link URI: $deepLinkUri")
                    return // Success — deep link opened
                } else {
                    android.util.Log.d("NotiFetchOpen", "Source app $packageName cannot handle URI $deepLinkUri — trying without package filter")
                    // Try without the package filter — maybe another app can handle it
                    // (e.g., a browser if it's an https:// URL)
                    val unfilteredIntent = Intent(Intent.ACTION_VIEW, uri).apply {
                        addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                    }
                    if (unfilteredIntent.resolveActivity(pm) != null) {
                        context.startActivity(unfilteredIntent)
                        android.util.Log.d("NotiFetchOpen", "Opened $deepLinkUri via unfiltered intent (browser/other app)")
                        return
                    }
                }
            } catch (e: Exception) {
                android.util.Log.w("NotiFetchOpen", "Deep link URI '$$deepLinkUri' failed: ${e.message}")
                // Fall through to next strategy
            }
        }

        // ── Strategy 0b: Persisted deep link component from database ────────
        // Some PendingIntents don't have a data URI but DO have a specific
        // component (package + class) they target. Try launching that directly.
        if (!deepLinkComponent.isNullOrBlank()) {
            try {
                val parts = deepLinkComponent.split("/", limit = 2)
                if (parts.size == 2) {
                    val componentIntent = Intent().apply {
                        component = ComponentName(parts[0], parts[1])
                        addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP)
                    }
                    // Try to start — if the activity exists & is exported, it'll open
                    context.startActivity(componentIntent)
                    android.util.Log.d("NotiFetchOpen", "Opened $packageName via persisted deep link component: $deepLinkComponent")
                    return
                }
            } catch (e: Exception) {
                // Activity not exported or doesn't exist — fall through
                android.util.Log.d("NotiFetchOpen", "Deep link component '$deepLinkComponent' not launchable: ${e.message}")
            }
        }

        // ── Strategy 1: Try the cached PendingIntent from the original notification
        // This deep-links to the specific order/offer/tracking screen, but ONLY
        // works while the NotiFetch process is alive (in-memory cache).
        val cachedPendingIntent = PendingIntentCache.get(packageName)
        if (cachedPendingIntent != null) {
            try {
                cachedPendingIntent.send()
                android.util.Log.d("NotiFetchOpen", "Opened $packageName via cached PendingIntent (deep link)")
                return // Success — deep link opened
            } catch (e: Exception) {
                android.util.Log.w("NotiFetchOpen", "Cached PendingIntent for $packageName failed: ${e.message}. Falling back to launch intent.")
            }
        } else {
            android.util.Log.d("NotiFetchOpen", "No cached PendingIntent for $packageName (cache cleared on app restart). Using launch intent.")
        }

        // ── Strategy 2: Try getLaunchIntentForPackage (works for most apps)
        // v2.9.7: Now works on Android 11+ thanks to <queries> in manifest
        var launchIntent = pm.getLaunchIntentForPackage(packageName)

        // ── Strategy 3: If null, try to find ANY launchable activity from the package
        if (launchIntent == null) {
            try {
                val mainIntent = Intent(Intent.ACTION_MAIN).apply {
                    addCategory(Intent.CATEGORY_LAUNCHER)
                    setPackage(packageName)
                }
                val resolveInfo = pm.resolveActivity(mainIntent, 0)
                if (resolveInfo != null) {
                    launchIntent = Intent(Intent.ACTION_MAIN).apply {
                        addCategory(Intent.CATEGORY_LAUNCHER)
                        setFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_RESET_TASK_IF_NEEDED)
                        component = ComponentName(resolveInfo.activityInfo.packageName, resolveInfo.activityInfo.name)
                    }
                    android.util.Log.d("NotiFetchOpen", "Resolved launcher activity manually for $packageName")
                }
            } catch (_: Exception) { }
        }

        if (launchIntent != null) {
            launchIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_RESET_TASK_IF_NEEDED)
            context.startActivity(launchIntent)
            android.util.Log.d("NotiFetchOpen", "Opened $packageName via launch intent (main screen)")
        } else {
            // Strategy 4: App not installed or locked — open Play Store
            android.util.Log.w("NotiFetchOpen", "App $packageName not visible/installed. Opening Play Store.")
            Toast.makeText(context, "$displayName not installed — opening Play Store", Toast.LENGTH_SHORT).show()
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
    } catch (e: Exception) {
        android.util.Log.e("NotiFetchOpen", "Failed to open $packageName", e)
        Toast.makeText(context, "Could not open $displayName", Toast.LENGTH_SHORT).show()
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
