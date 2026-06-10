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
 * notifications from delivery partner/driver apps. It filters only the configured
 * partner packages, extracts relevant data, saves to local Room database, and
 * forwards to the NotiFetch backend.
 *
 * IMPORTANT LEGAL COMPLIANCE:
 * - This captures from PARTNER/DRIVER apps only, NOT customer apps
 * - We only store notification content the user can already see (title, text, bigText, subText)
 * - We do NOT store the raw notification extras bundle (may contain PII, auth tokens)
 * - We do NOT access delivery platform APIs or store credentials
 * - Platform names in the app use generic category names, not brand names
 * - This is protected under Van Buren v. United States (2021): reading data
 *   the user is authorized to access is not a CFAA violation
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
        // Use the comprehensive package list from Constants
        private val PARTNER_PACKAGES: Map<String, String>
            get() = Constants.PARTNER_PACKAGES

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
        Log.d(tag, "NotiFetchListenerService created — monitoring ${Constants.PARTNER_PACKAGES.size} partner packages")
    }

    override fun onListenerConnected() {
        super.onListenerConnected()
        Log.d(tag, "Notification listener connected — monitoring ${Constants.PARTNER_PACKAGES.size} partner packages worldwide")

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

        // Filter: only process notifications from partner apps
        val platformName = Constants.PARTNER_PACKAGES[packageName] ?: return

        val source = Constants.PLATFORM_SOURCES[packageName] ?: packageName.replace(".", "_")

        Log.d(tag, "Captured notification from $platformName ($packageName)")

        try {
            val notification = sbn.notification
            val extras = notification.extras

            // Extract only visible notification content (what the user can see)
            val title = extras.getString(Notification.EXTRA_TITLE)?.trim() ?: ""
            val text = extras.getCharSequence(Notification.EXTRA_TEXT)?.toString()?.trim() ?: ""
            val bigText = extras.getCharSequence(Notification.EXTRA_BIG_TEXT)?.toString()?.trim() ?: ""
            val subText = extras.getCharSequence(Notification.EXTRA_SUB_TEXT)?.toString()?.trim() ?: ""

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
            val parsed = NotificationParser.parse(
                platform = platformName,
                source = source,
                title = title,
                text = text,
                bigText = bigText,
                subText = subText,
                extras = extras
            )

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
                currency = currency
            )

            // Save to local database
            serviceScope.launch {
                try {
                    val id = repository.insertNotification(capturedNotification)
                    Log.d(tag, "Saved notification #$id from $platformName [${parsed.category}] ($currency)")

                    // Debounced platform count increment — batch multiple notifications
                    // from the same package to reduce DB writes (BUG #2 fix).
                    // Previously, incrementNotificationCount was called inside
                    // insertNotification, causing a second DB write per notification
                    // that triggered cascading Room Flow emissions → UI fluttering.
                    synchronized(pendingCountIncrements) {
                        pendingCountIncrements.add(packageName)
                    }
                    countIncrementJob?.cancel()
                    countIncrementJob = serviceScope.launch {
                        delay(2000) // Batch increments over 2-second window
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

                    // Debounced sync — cancel previous, wait 5s, then sync all pending
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
