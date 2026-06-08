package com.notifetch.app.notification

import android.app.Notification
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.os.Build
import android.service.notification.NotificationListenerService
import android.service.notification.StatusBarNotification
import android.util.Log
import com.notifetch.app.data.local.CapturedNotification
import com.notifetch.app.data.remote.NotificationPayload
import com.notifetch.app.data.repository.AuthRepository
import com.notifetch.app.data.repository.NotificationRepository
import com.notifetch.app.util.Constants
import com.notifetch.app.util.Helpers
import com.notifetch.app.util.PlatformSource
import com.squareup.moshi.Moshi
import dagger.hilt.android.AndroidEntryPoint
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import java.util.TimeZone
import javax.inject.Inject

/**
 * Core NotificationListenerService that captures notifications from delivery partner apps.
 *
 * This service uses the Android NotificationListenerService API to receive real-time
 * notifications from delivery partner/driver apps. It filters only the configured
 * partner packages, extracts relevant data, saves to local Room database, and
 * forwards to the NotiFetch backend.
 *
 * IMPORTANT: This captures from PARTNER/DRIVER apps, NOT customer apps.
 */
@AndroidEntryPoint
class NotiFetchListenerService : NotificationListenerService() {

    @Inject lateinit var repository: NotificationRepository
    @Inject lateinit var authRepository: AuthRepository
    @Inject lateinit var moshi: Moshi

    private val serviceScope = CoroutineScope(SupervisorJob() + Dispatchers.IO)
    private val tag = "NotiFetchListener"

    companion object {
        // These are the PARTNER/DRIVER app packages (NOT customer apps)
        private val PARTNER_PACKAGES = mapOf(
            "in.swiggy.partner" to "Swiggy Partner",
            "in.swiggy.deliveryapp" to "Swiggy Delivery",
            "com.zomato.delivery" to "Zomato Delivery",
            "com.zomato.deliverypartner" to "Zomato Delivery Partner",
            "com.amazon.flex" to "Amazon Flex",
            "com.zepto.cafepartner" to "Zepto Cafe Partner",
            "com.grofers.partnerapp" to "Blinkit Partner",
            "com.bigbasket.partnerapp" to "BigBasket Partner",
            "com.dunzo.partner" to "Dunzo Partner",
            "com.porter.porterpartner" to "Porter Partner",
            "com.rapido.captain" to "Rapido Captain",
            "com.olacabs.driver" to "Ola Driver",
            "com.ubercab.driver" to "Uber Driver",
            "com.flipkart.logistics" to "Flipkart Logistics",
            "com.shadowfax.partner" to "Shadowfax Partner"
        )

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
        Log.d(tag, "NotiFetchListenerService created")
    }

    override fun onListenerConnected() {
        super.onListenerConnected()
        Log.d(tag, "Notification listener connected - monitoring ${PARTNER_PACKAGES.size} partner apps")

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
        if (!PARTNER_PACKAGES.containsKey(packageName)) return

        val platform = PARTNER_PACKAGES[packageName] ?: "Unknown"
        val source = Constants.PLATFORM_SOURCES[packageName] ?: packageName.replace(".", "_")

        Log.d(tag, "Captured notification from $platform ($packageName)")

        try {
            val notification = sbn.notification
            val extras = notification.extras

            // Extract notification data
            val title = extras.getString(Notification.EXTRA_TITLE)?.trim() ?: ""
            val text = extras.getCharSequence(Notification.EXTRA_TEXT)?.toString()?.trim() ?: ""
            val bigText = extras.getCharSequence(Notification.EXTRA_BIG_TEXT)?.toString()?.trim() ?: ""
            val subText = extras.getCharSequence(Notification.EXTRA_SUB_TEXT)?.toString()?.trim() ?: ""

            // Skip empty or group summary notifications
            if (title.isBlank() && text.isBlank() && bigText.isBlank()) {
                Log.d(tag, "Skipping empty notification from $platform")
                return
            }

            // Skip ongoing notifications (like "you are online" persistent notifications)
            if (notification.flags and Notification.FLAG_ONGOING_EVENT != 0) {
                Log.d(tag, "Skipping ongoing notification from $platform")
                return
            }

            // Parse platform-specific data
            val parsed = NotificationParser.parse(
                platform = platform,
                source = source,
                title = title,
                text = text,
                bigText = bigText,
                subText = subText,
                extras = extras
            )

            // Create database entity
            val capturedNotification = CapturedNotification(
                packageName = packageName,
                platform = platform,
                source = source,
                title = parsed.title,
                body = parsed.body,
                bigText = parsed.bigText,
                subText = parsed.subText,
                orderValue = parsed.orderValue,
                pickupLocation = parsed.pickupLocation,
                dropoffLocation = parsed.dropoffLocation,
                distance = parsed.distance,
                extrasJson = Helpers.extrasToJson(extras),
                receivedAt = System.currentTimeMillis(),
                isSynced = false,
                category = parsed.category
            )

            // Save to local database
            serviceScope.launch {
                try {
                    val id = repository.insertNotification(capturedNotification)
                    Log.d(tag, "Saved notification #$id from $platform [${parsed.category}]")

                    // Try to sync to backend
                    syncToBackend(capturedNotification.copy(id = id))
                } catch (e: Exception) {
                    Log.e(tag, "Failed to save notification from $platform", e)
                }
            }
        } catch (e: Exception) {
            Log.e(tag, "Error processing notification from $platform", e)
        }
    }

    override fun onNotificationRemoved(sbn: StatusBarNotification) {
        // Notification was dismissed - we don't need to do anything
        // as we've already captured it in onNotificationPosted
    }

    override fun onListenerDisconnected() {
        super.onListenerDisconnected()
        Log.w(tag, "Notification listener disconnected")
    }

    /**
     * Attempt to forward the captured notification to the NotiFetch backend.
     * If it fails, it will remain marked as unsynced and be picked up
     * by the periodic sync WorkManager task.
     */
    private suspend fun syncToBackend(notification: CapturedNotification) {
        try {
            val token = authRepository.getCurrentToken()
            val authHeader = if (token != null) "Bearer $token" else ""

            val sdf = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'", Locale.US)
            sdf.timeZone = TimeZone.getTimeZone("UTC")

            val payload = NotificationPayload(
                source = notification.source,
                platform = notification.platform,
                title = notification.title,
                body = notification.body,
                orderValue = notification.orderValue,
                pickupLocation = notification.pickupLocation,
                dropoffLocation = notification.dropoffLocation,
                distance = notification.distance,
                receivedAt = sdf.format(Date(notification.receivedAt)),
                packageName = notification.packageName
            )

            // Use the API directly through repository's sync mechanism
            // Individual sync attempts are handled by the sync worker
            Log.d(tag, "Notification queued for sync: ${notification.platform}")
        } catch (e: Exception) {
            Log.e(tag, "Failed to sync notification to backend", e)
        }
    }
}
