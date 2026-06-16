package com.notifetch.app.notification

import android.app.Notification
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.service.notification.NotificationListenerService
import android.service.notification.StatusBarNotification
import android.util.Log
import com.notifetch.app.data.local.CapturedNotification
import com.notifetch.app.data.repository.AuthRepository
import com.notifetch.app.data.repository.NotificationRepository
import com.notifetch.app.util.Constants
import com.notifetch.app.util.Helpers
import dagger.hilt.android.AndroidEntryPoint
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.cancel
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import javax.inject.Inject

/**
 * Core NotificationListenerService that captures notifications from delivery partner apps.
 *
 * This service uses the Android NotificationListenerService API to receive real-time
 * notifications from delivery partner/driver apps AND customer apps. It filters only
 * the configured packages, extracts relevant data, saves to local Room database, and
 * forwards to the NotiFetch backend.
 *
 * IMPORTANT LEGAL COMPLIANCE:
 * - We only store notification content the user can already see (title, text, bigText, subText)
 * - We do NOT store the raw notification extras bundle (may contain PII, auth tokens)
 * - We do NOT access delivery platform APIs or store credentials
 * - Platform names in the app use generic category names, not brand names
 * - Per-platform enable/disable is respected (DPDPA compliance)
 * - Android 15 redacted notifications are handled gracefully
 */
@AndroidEntryPoint
class NotiFetchListenerService : NotificationListenerService() {

    @Inject lateinit var repository: NotificationRepository
    @Inject lateinit var authRepository: AuthRepository

    private val serviceScope = CoroutineScope(SupervisorJob() + Dispatchers.IO)
    private val tag = "NotiFetchListener"

    // Debounce sync — wait 5 seconds after the last notification before syncing
    private var syncJob: kotlinx.coroutines.Job? = null
    // Debounce platform count increment — batch updates to reduce DB writes
    private var countIncrementJob: kotlinx.coroutines.Job? = null
    // Track which packages need count increments for batching
    private val pendingCountIncrements = mutableSetOf<String>()

    companion object {
        // Use the combined package list (rider + customer) from Constants
        private val ALL_PACKAGES: Map<String, String>
            get() = Constants.ALL_PACKAGES

        /**
         * Check if the notification listener service is enabled.
         */
        fun isListenerEnabled(context: Context): Boolean {
            val componentName = ComponentName(context, NotiFetchListenerService::class.java)
            val enabledListeners = android.provider.Settings.Secure.getString(
                context.contentResolver,
                "enabled_notification_listeners"
            ) ?: return false
            return enabledListeners.contains(componentName.flattenToString())
        }

        /**
         * Open the notification access settings screen.
         */
        fun openNotificationSettings(context: Context) {
            val intent = Intent(android.provider.Settings.ACTION_NOTIFICATION_LISTENER_SETTINGS)
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            context.startActivity(intent)
        }
    }

    override fun onCreate() {
        super.onCreate()
        Log.d(tag, "NotiFetchListenerService created — monitoring ${Constants.ALL_PACKAGES.size} packages")
    }

    override fun onListenerConnected() {
        super.onListenerConnected()
        Log.d(tag, "Notification listener connected — monitoring ${Constants.ALL_PACKAGES.size} packages (rider + customer)")

        // Log ALL currently active notifications for diagnostics
        // This helps debug why only certain apps are showing
        try {
            val activeNotifications = getActiveNotifications()
            Log.d(tag, "=== DIAGNOSTIC: Active notifications on device ===")
            Log.d(tag, "Total active notifications: ${activeNotifications.size}")
            val trackedPackages = activeNotifications.map { it.packageName }.distinct()
            Log.d(tag, "All packages with active notifications: $trackedPackages")
            val matchedPackages = trackedPackages.filter { Constants.ALL_PACKAGES.containsKey(it) }
            Log.d(tag, "Matched (tracked) packages: $matchedPackages")
            val unmatchedPackages = trackedPackages.filter { !Constants.ALL_PACKAGES.containsKey(it) }
            Log.d(tag, "Unmatched packages (not in our list): $unmatchedPackages")
            Log.d(tag, "=== END DIAGNOSTIC ===")
        } catch (e: Exception) {
            Log.e(tag, "Failed to log active notifications diagnostic", e)
        }

        // Initialize platform configs in database
        serviceScope.launch {
            try {
                repository.initializePlatformConfigs()
            } catch (e: Exception) {
                Log.e(tag, "Failed to initialize platform configs", e)
            }
        }
    }

    override fun onNotificationPosted(sbn: StatusBarNotification) {
        val packageName = sbn.packageName

        // Log ALL incoming notifications for diagnostics (helps debug OEM-specific capture issues)
        Log.d(tag, "Received notification from: $packageName")

        // Filter: only process notifications from partner apps
        val platformName = Constants.ALL_PACKAGES[packageName]
        if (platformName == null) {
            // Not a tracked package — skip silently (reduce log noise)
            return
        }

        val source = Constants.ALL_PLATFORM_SOURCES[packageName] ?: packageName.replace(".", "_")

        val userMode = Constants.getUserModeForPackage(packageName)?.name?.lowercase() ?: "rider"

        // Per-platform enable/disable check (DPDPA compliance — user can opt out of
        // individual platforms). We check on IO dispatcher since this is a DB read.
        try {
            val config = kotlinx.coroutines.runBlocking(Dispatchers.IO) {
                repository.getPlatformConfig(packageName)
            }
            if (config != null && !config.isEnabled) {
                Log.d(tag, "Skipping disabled platform: $platformName ($packageName)")
                return
            }
        } catch (_: Exception) {
            // If we can't check the config, allow the notification through
        }

        Log.d(tag, "Captured notification from $platformName ($packageName)")

        try {
            val notification = sbn.notification
            val extras = notification.extras

            // Extract only visible notification content (what the user can see)
            var title = extras.getString(Notification.EXTRA_TITLE)?.trim() ?: ""
            var text = extras.getCharSequence(Notification.EXTRA_TEXT)?.toString()?.trim() ?: ""
            var bigText = extras.getCharSequence(Notification.EXTRA_BIG_TEXT)?.toString()?.trim() ?: ""
            var subText = extras.getCharSequence(Notification.EXTRA_SUB_TEXT)?.toString()?.trim() ?: ""

            // Android 15+ notification redaction handling:
            // On Android 15, untrusted notification listeners receive "Sensitive notification hidden"
            // or similar redaction strings for financial/OTP-style notifications. We detect this
            // and mark the category as REDACTED so the UI can show a fallback card with the
            // Open App button instead of blank content.
            val redactionMarkers = listOf(
                "sensitive notification hidden",
                "content hidden",
                "notification hidden",
                "hidden content",
                "redacted"
            )
            val allText = "$title $text $bigText $subText".lowercase()
            val isRedacted = redactionMarkers.any { allText.contains(it) }

            if (isRedacted) {
                Log.d(tag, "Android 15+ redacted notification detected from $platformName — saving with REDACTED category")
                title = "Content hidden by Android"
                text = ""
                bigText = ""
                subText = ""
            }

            // Skip empty or group summary notifications
            if (title.isBlank() && text.isBlank() && bigText.isBlank()) {
                Log.d(tag, "Skipping empty notification from $platformName")
                return
            }

            // Skip ongoing notifications (like "you are online" persistent notifications)
            if (notification.flags and Notification.FLAG_ONGOING_EVENT != 0) {
                Log.d(tag, "Skipping ongoing notification from $platformName")
                return
            }

            // Skip group summary notifications (they duplicate content)
            if (notification.flags and Notification.FLAG_GROUP_SUMMARY != 0) {
                Log.d(tag, "Skipping group summary notification from $platformName")
                return
            }

            // Parse platform-specific data
            // If Android 15+ redacted the notification, force category to REDACTED
            val parsed = if (isRedacted) {
                NotificationParser.ParsedNotification(
                    platform = platformName,
                    source = source,
                    title = title,
                    body = text,
                    bigText = bigText,
                    subText = subText,
                    orderValue = null,
                    pickupLocation = null,
                    dropoffLocation = null,
                    distance = null,
                    category = "REDACTED"
                )
            } else {
                NotificationParser.parse(
                    platform = platformName,
                    source = source,
                    title = title,
                    text = text,
                    bigText = bigText,
                    subText = subText,
                    extras = extras,
                    userMode = userMode
                )
            }

            // Detect currency based on platform region and text content
            val currency = Helpers.detectCurrency(packageName, platformName, "$title $text $bigText")

            // Create database entity (NO extrasJson — data minimization compliance)
            val capturedNotification = CapturedNotification(
                packageName = packageName,
                platform = platformName,
                source = source,
                title = parsed.title,
                body = parsed.body,
                bigText = parsed.bigText,
                subText = parsed.subText,
                orderValue = parsed.orderValue,
                pickupLocation = parsed.pickupLocation,
                dropoffLocation = parsed.dropoffLocation,
                distance = parsed.distance,
                receivedAt = System.currentTimeMillis(),
                isSynced = false,
                category = parsed.category,
                currency = currency,
                userMode = userMode
            )

            // Save to local database
            serviceScope.launch {
                try {
                    val id = repository.insertNotification(capturedNotification)
                    Log.d(tag, "Saved notification #$id from $platformName [${parsed.category}] ($currency)")

                    // Debounced platform count increment
                    synchronized(pendingCountIncrements) {
                        pendingCountIncrements.add(packageName)
                    }
                    countIncrementJob?.cancel()
                    countIncrementJob = serviceScope.launch {
                        delay(2000)
                        val packagesToIncrement = synchronized(pendingCountIncrements) {
                            val copy = pendingCountIncrements.toList()
                            pendingCountIncrements.clear()
                            copy
                        }
                        for (pkg in packagesToIncrement) {
                            try {
                                repository.incrementPlatformNotificationCount(pkg)
                            } catch (e: Exception) {
                                Log.e(tag, "Failed to increment count for $pkg", e)
                            }
                        }
                    }

                    // Debounced sync
                    syncJob?.cancel()
                    syncJob = serviceScope.launch {
                        delay(5000)
                        syncToBackend()
                    }
                } catch (e: Exception) {
                    Log.e(tag, "Failed to save notification from $platformName", e)
                }
            }
        } catch (e: Exception) {
            Log.e(tag, "Error processing notification from $platformName", e)
        }
    }

    override fun onNotificationRemoved(sbn: StatusBarNotification) {
        // Notification was dismissed — we don't need to do anything
    }

    override fun onListenerDisconnected() {
        super.onListenerDisconnected()
        serviceScope.cancel()
        Log.w(tag, "Notification listener disconnected")
    }

    override fun onDestroy() {
        super.onDestroy()
        serviceScope.cancel()
    }

    /**
     * Attempt to forward all unsynced notifications to the NotiFetch backend.
     * Debounced — called 5 seconds after the last notification capture.
     */
    private suspend fun syncToBackend() {
        try {
            repository.syncPendingNotifications()
            Log.d(tag, "Debounced sync completed")
        } catch (e: Exception) {
            Log.e(tag, "Failed to sync notifications to backend", e)
        }
    }
}
