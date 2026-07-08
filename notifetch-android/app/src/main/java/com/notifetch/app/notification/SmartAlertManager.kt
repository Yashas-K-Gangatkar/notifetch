package com.notifetch.app.notification

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.os.Build
import android.os.PowerManager
import android.util.Log
import androidx.core.app.NotificationCompat
import com.notifetch.app.MainActivity
import com.notifetch.app.R
import com.notifetch.app.data.local.CapturedNotification
import com.notifetch.app.util.EarningsCalculator
import java.util.concurrent.ConcurrentHashMap

/**
 * v2.9.72: Enhanced Smart Alert Manager with sound + vibration + cooldown.
 *
 * Triggers for:
 *   - High-value offers (50%+ off, flash sale, BOGO, etc.)
 *   - Orders above ₹200 value
 *
 * Features:
 *   - Custom vibration pattern (500ms on, 200ms off, 500ms on)
 *   - HIGH importance channel (plays sound automatically)
 *   - Cooldown: max 1 alert per app per 5 minutes
 *   - Condition: only if screen is off OR NotiFetch is not in foreground
 */
object SmartAlertManager {

    private const val TAG = "SmartAlertManager"
    const val CHANNEL_ID = "notifetch_smart_alerts"
    const val CHANNEL_NAME = "Smart Offer Alerts"
    @Volatile
    private var channelCreated = false

    // v2.9.72: Cooldown tracking — packageName → last alert timestamp
    private val lastAlertTime = ConcurrentHashMap<String, Long>()
    private val COOLDOWN_MS = 5 * 60 * 1000L // 5 minutes

    // v2.9.72: Vibration pattern (500ms on, 200ms off, 500ms on)
    private val VIBRATION_PATTERN = longArrayOf(0, 500, 200, 500)

    /**
     * v2.9.72: Enhanced — checks high-value offer OR order value > ₹200
     */
    fun shouldAlert(
        notification: CapturedNotification,
        isPlatformMuted: Boolean
    ): Boolean {
        if (isPlatformMuted) return false

        // Check high-value offer (50%+ off, flash sale, etc.)
        if (EarningsCalculator.isHighValueOffer(
                notification.title,
                notification.body,
                notification.bigText
            )
        ) return true

        // v2.9.72: Also alert on high-value orders (₹200+)
        if (notification.orderValue != null && notification.orderValue >= 200.0) return true

        return false
    }

    /**
     * v2.9.72: Post alert with cooldown + screen-state check.
     * Returns true if alert was posted, false if skipped (cooldown/foreground).
     */
    fun postOfferAlert(
        context: Context,
        notification: CapturedNotification,
        notificationId: Long
    ): Boolean {
        // v2.9.72: Check cooldown — max 1 alert per app per 5 minutes
        val now = System.currentTimeMillis()
        val lastAlert = lastAlertTime[notification.packageName] ?: 0
        if (now - lastAlert < COOLDOWN_MS) {
            Log.d(TAG, "Skipping alert for ${notification.platform} — cooldown active (${(now - lastAlert) / 1000}s since last)")
            return false
        }

        // v2.9.72: Check if screen is on AND NotiFetch is in foreground
        // If both true, skip alert (user already sees the notification)
        val powerManager = context.getSystemService(Context.POWER_SERVICE) as PowerManager
        val isScreenOn = powerManager.isInteractive
        val isNotiFetchForeground = NotiFetchListenerService.isInstanceAlive()
        if (isScreenOn && isNotiFetchForeground) {
            Log.d(TAG, "Skipping alert for ${notification.platform} — NotiFetch is in foreground")
            return false
        }

        // Post the alert
        ensureChannelCreated(context)
        lastAlertTime[notification.packageName] = now

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

        val alertTitle = "🔥 ${notification.platform} — High Value!"
        val alertBody = buildString {
            notification.title.take(80).let { if (it.isNotBlank()) append(it) }
            if (notification.body.isNotBlank()) {
                if (isNotEmpty()) append(" — ")
                append(notification.body.take(60))
            }
            if (notification.orderValue != null && notification.orderValue > 0) {
                if (isNotEmpty()) append(" | ")
                append("Order value: ₹${notification.orderValue.toInt()}")
            }
        }.ifBlank { "High-value order detected. Tap to view." }

        val alert = NotificationCompat.Builder(context, CHANNEL_ID)
            .setSmallIcon(R.drawable.ic_launcher_foreground)
            .setContentTitle(alertTitle)
            .setContentText(alertBody)
            .setStyle(NotificationCompat.BigTextStyle().bigText(alertBody))
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setCategory(NotificationCompat.CATEGORY_PROMO)
            .setContentIntent(pendingIntent)
            .setAutoCancel(true)
            .setColor(0xFFFF5A1F.toInt()) // v2.9.72: brand orange-red
            .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
            // v2.9.72: Custom vibration pattern
            .setVibrate(VIBRATION_PATTERN)
            // v2.9.72: Default notification sound (HIGH importance channel plays it)
            .setDefaults(NotificationCompat.DEFAULT_SOUND or NotificationCompat.DEFAULT_LIGHTS)
            .build()

        val notificationManager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        notificationManager.notify((notificationId + 100000L).toInt(), alert)

        Log.d(TAG, "Alert posted for ${notification.platform} (cooldown set for 5 min)")
        return true
    }

    private fun ensureChannelCreated(context: Context) {
        if (channelCreated) return
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                CHANNEL_NAME,
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = "Sound + vibration alerts for high-value orders (₹200+) and 50%+ off offers"
                enableLights(true)
                lightColor = 0xFFFF5A1F.toInt()
                enableVibration(true)
                vibrationPattern = VIBRATION_PATTERN
                setShowBadge(true)
                lockscreenVisibility = NotificationCompat.VISIBILITY_PUBLIC
            }
            val notificationManager = context.getSystemService(NotificationManager::class.java)
            notificationManager.createNotificationChannel(channel)
        }
        channelCreated = true
    }
}
