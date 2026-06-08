package com.notifetch.app

import android.app.Notification
import android.app.PendingIntent
import android.content.Intent
import android.os.Build
import android.service.notification.NotificationListenerService
import android.service.notification.StatusBarNotification
import android.util.Log
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.launch

/**
 * Core Notification Listener Service for NotiFetch.
 *
 * This service listens for notifications from delivery partner apps,
 * parses their content, saves them locally, and forwards them to the
 * NotiFetch web backend API.
 *
 * REQUIRES: android.permission.BIND_NOTIFICATION_LISTENER_SERVICE
 * The user must grant notification access in Settings → Apps → Special access → Notification access
 */
class NotiFetchListenerService : NotificationListenerService() {

    companion object {
        private const val TAG = "NotiFetchListener"

        // Channel ID for in-app notifications
        private const val CHANNEL_ID = "notifetch_captured"
        private const val CHANNEL_NAME = "Captured Notifications"

        // In-app notification ID counter
        private var notificationIdCounter = 1000

        // Listener connection state for UI to check
        var isListenerConnected = false
            private set
    }

    private val serviceScope = CoroutineScope(SupervisorJob() + Dispatchers.IO)
    private lateinit var repository: NotificationRepository
    private lateinit var apiClient: ApiClient

    override fun onCreate() {
        super.onCreate()
        repository = NotificationRepository(
            NotiFetchDatabase.getDatabase(applicationContext).notificationDao()
        )
        apiClient = ApiClient(applicationContext)
        Log.d(TAG, "NotiFetch Listener Service created")
    }

    override fun onListenerConnected() {
        super.onListenerConnected()
        isListenerConnected = true
        Log.i(TAG, "Notification listener connected — monitoring delivery apps")

        // Send broadcast to update UI
        sendBroadcast(Intent("com.notifetch.app.LISTENER_CONNECTED"))
    }

    override fun onListenerDisconnected() {
        super.onListenerDisconnected()
        isListenerConnected = false
        Log.w(TAG, "Notification listener disconnected")

        // Send broadcast to update UI
        sendBroadcast(Intent("com.notifetch.app.LISTENER_DISCONNECTED"))
    }

    override fun onNotificationPosted(sbn: StatusBarNotification) {
        val packageName = sbn.packageName

        // Only process notifications from known delivery partner apps
        val partnerInfo = DeliveryPartners.getPartner(packageName) ?: return

        // Skip ongoing/group summary notifications that aren't useful
        if (sbn.isOngoing && sbn.notification.flags and Notification.FLAG_GROUP_SUMMARY != 0) {
            return
        }

        val extras = sbn.notification.extras

        // Extract notification text content
        val title = extras.getCharSequence(Notification.EXTRA_TITLE)?.toString()?.trim() ?: ""
        val text = extras.getCharSequence(Notification.EXTRA_TEXT)?.toString()?.trim() ?: ""
        val bigText = extras.getCharSequence(Notification.EXTRA_BIG_TEXT)?.toString()?.trim() ?: text
        val subText = extras.getCharSequence(Notification.EXTRA_SUB_TEXT)?.toString()?.trim() ?: ""
        val bigTitle = extras.getCharSequence(Notification.EXTRA_TITLE_BIG)?.toString()?.trim() ?: ""
        val progress = extras.getInt(Notification.EXTRA_PROGRESS, -1)
        val category = sbn.notification.category ?: ""

        // Don't capture empty notifications
        if (title.isBlank() && text.isBlank()) {
            Log.d(TAG, "Skipping empty notification from ${partnerInfo.displayName}")
            return
        }

        // Determine a useful category for our purposes
        val notifCategory = when (category) {
            Notification.CATEGORY_MESSAGE -> "chat"
            Notification.CATEGORY_CALL -> "call"
            Notification.CATEGORY_NAVIGATION -> "navigation"
            Notification.CATEGORY_TRANSPORT -> "transport"
            else -> partnerInfo.category
        }

        // Create notification data
        val notification = NotificationData(
            id = sbn.key,
            title = if (bigTitle.isNotBlank()) bigTitle else title,
            body = if (bigText.isNotBlank()) bigText else text,
            source = partnerInfo.displayName,
            packageName = packageName,
            timestamp = sbn.postTime,
            isRead = false,
            isForwarded = false,
            category = notifCategory,
            subText = subText,
            bigTitle = bigTitle,
            progress = progress,
        )

        Log.i(
            TAG,
            "Captured notification from ${partnerInfo.displayName}: $title — $text"
        )

        // Save locally and forward to backend
        serviceScope.launch {
            try {
                // Check for duplicate
                val existing = repository.allNotifications.first()
                    .find { it.id == notification.id }
                if (existing != null) {
                    Log.d(TAG, "Duplicate notification, skipping: ${notification.id}")
                    return@launch
                }

                // Save to local database
                repository.insert(notification)
                Log.d(TAG, "Saved notification locally: ${notification.id}")

                // Forward to NotiFetch backend
                forwardToBackend(notification)

                // Show in-app notification
                showInAppNotification(notification)

            } catch (e: Exception) {
                Log.e(TAG, "Error processing notification", e)
            }
        }
    }

    override fun onNotificationRemoved(sbn: StatusBarNotification) {
        // A notification was dismissed — we could optionally update state
        val packageName = sbn.packageName
        val partnerInfo = DeliveryPartners.getPartner(packageName) ?: return
        Log.d(TAG, "Notification removed from ${partnerInfo.displayName}")
    }

    /**
     * Forward the captured notification to the NotiFetch web backend API.
     */
    private suspend fun forwardToBackend(notification: NotificationData) {
        try {
            val request = NotificationForwardRequest(
                title = notification.title,
                body = notification.body,
                source = notification.source,
                sourceIcon = notification.packageName,
                timestamp = notification.timestamp,
                packageName = notification.packageName,
                category = notification.category,
            )

            val response = apiClient.forwardNotification(request)
            if (response.success) {
                repository.markAsForwarded(notification.id)
                Log.i(TAG, "Forwarded notification to backend: ${notification.id}")
            } else {
                Log.w(TAG, "Backend returned error: ${response.error}")
            }
        } catch (e: Exception) {
            Log.e(TAG, "Failed to forward notification to backend", e)
            // We'll retry next time the app is opened or on a schedule
        }
    }

    /**
     * Show an in-app notification to let the user know a delivery notification was captured.
     */
    private fun showInAppNotification(notification: NotificationData) {
        try {
            val intent = Intent(this, MainActivity::class.java).apply {
                flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
                putExtra("open_dashboard", true)
                putExtra("notification_id", notification.id)
            }

            val pendingIntent = PendingIntent.getActivity(
                this,
                notificationIdCounter++,
                intent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
            )

            val inAppNotification = android.app.Notification.Builder(this, CHANNEL_ID)
                .setSmallIcon(R.drawable.ic_notification)
                .setContentTitle("${notification.emoji()} ${notification.source}")
                .setContentText(notification.title)
                .setStyle(
                    android.app.Notification.BigTextStyle()
                        .bigText("${notification.title}\n${notification.body}")
                )
                .setContentIntent(pendingIntent)
                .setAutoCancel(true)
                .setCategory(android.app.Notification.CATEGORY_STATUS)
                .setPriority(android.app.Notification.PRIORITY_LOW)
                .build()

            // Create notification channel (Android 8+)
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                val channel = android.app.NotificationChannel(
                    CHANNEL_ID,
                    CHANNEL_NAME,
                    android.app.NotificationManager.IMPORTANCE_LOW,
                ).apply {
                    description = "Shows captured delivery notifications"
                    setShowBadge(true)
                }
                val manager = getSystemService(android.app.NotificationManager::class.java)
                manager.createNotificationChannel(channel)
            }

            val notificationManager = getSystemService(NOTIFICATION_SERVICE) as android.app.NotificationManager
            notificationManager.notify(notificationIdCounter, inAppNotification)

        } catch (e: Exception) {
            Log.e(TAG, "Error showing in-app notification", e)
        }
    }
}

/**
 * Extension to get emoji for a notification based on its source.
 */
fun NotificationData.emoji(): String {
    val partner = DeliveryPartners.getPartner(this.packageName)
    return partner?.emoji ?: "📦"
}
