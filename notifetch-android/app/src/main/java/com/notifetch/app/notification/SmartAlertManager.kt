package com.notifetch.app.notification

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.os.Build
import androidx.core.app.NotificationCompat
import com.notifetch.app.MainActivity
import com.notifetch.app.R
import com.notifetch.app.data.local.CapturedNotification
import com.notifetch.app.util.EarningsCalculator

/**
 * v2.9.12: Smart Offer Alerts
 *
 * When the listener captures a high-value offer (50%+ off, "free delivery",
 * "flash sale", etc.), this helper posts a HIGH-priority notification to
 * the user's status bar.
 *
 * The user can tap the alert to open NotiFetch directly to the notification
 * detail, where they can then tap "Open App" to claim the offer in the
 * source delivery app.
 *
 * Muted platforms (set in Settings) don't trigger alerts.
 */
object SmartAlertManager {

    const val CHANNEL_ID = "notifetch_smart_alerts"
    const val CHANNEL_NAME = "Smart Offer Alerts"
    private var channelCreated = false

    /**
     * Check if a captured notification warrants a smart alert.
     * Returns true if it's a high-value offer from a non-muted platform.
     */
    fun shouldAlert(
        notification: CapturedNotification,
        isPlatformMuted: Boolean
    ): Boolean {
        if (isPlatformMuted) return false
        return EarningsCalculator.isHighValueOffer(
            notification.title,
            notification.body,
            notification.bigText
        )
    }

    /**
     * Post a high-priority notification to the status bar.
     * Should be called from a background coroutine.
     */
    fun postOfferAlert(
        context: Context,
        notification: CapturedNotification,
        notificationId: Long
    ) {
        ensureChannelCreated(context)

        val pendingIntent = PendingIntent.getActivity(
            context,
            notificationId.toInt(),
            Intent(context, MainActivity::class.java).apply {
                action = "OPEN_NOTIFICATION_DETAIL"
                putExtra("notificationId", notificationId)
                flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
            },
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val alertTitle = "🔥 ${notification.platform} Offer!"
        val alertBody = buildString {
            notification.title.take(80).let { if (it.isNotBlank()) append(it) }
            if (notification.body.isNotBlank()) {
                if (isNotEmpty()) append(" — ")
                append(notification.body.take(60))
            }
        }.ifBlank { "High-value offer detected. Tap to view." }

        val notification = NotificationCompat.Builder(context, CHANNEL_ID)
            .setSmallIcon(R.drawable.ic_launcher_foreground)
            .setContentTitle(alertTitle)
            .setContentText(alertBody)
            .setStyle(NotificationCompat.BigTextStyle().bigText(alertBody))
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setCategory(NotificationCompat.CATEGORY_PROMO)
            .setContentIntent(pendingIntent)
            .setAutoCancel(true)
            .setColor(0xFFFFC107.toInt()) // amber
            .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
            .build()

        val notificationManager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        // Use a unique ID for each alert (offset to avoid clashes with notificationId)
        notificationManager.notify((notificationId + 100000L).toInt(), notification)
    }

    private fun ensureChannelCreated(context: Context) {
        if (channelCreated) return
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                CHANNEL_NAME,
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = "High-priority alerts for 50%+ off offers and flash sales"
                enableLights(true)
                enableVibration(true)
                setShowBadge(true)
                lockscreenVisibility = NotificationCompat.VISIBILITY_PUBLIC
            }
            val notificationManager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            notificationManager.createNotificationChannel(channel)
        }
        channelCreated = true
    }
}
