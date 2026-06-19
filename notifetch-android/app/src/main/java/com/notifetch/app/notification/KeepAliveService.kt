package com.notifetch.app.notification

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.Context
import android.content.Intent
import android.os.Build
import android.os.IBinder
import android.util.Log
import androidx.core.app.NotificationCompat
import com.notifetch.app.R
import com.notifetch.app.util.Constants

/**
 * v2.9.17: Foreground Keep-Alive Service
 *
 * THE PROBLEM:
 * NotificationListenerService is a system-bound service. On stock Android, it stays
 * alive forever once granted. BUT on aggressive OEM ROMs (Realme, Xiaomi, OPPO, Vivo,
 * Samsung), the OS kills the entire app process after 5-10 minutes of backgrounding.
 * When the process dies, NotificationListenerService dies with it → notifications
 * stop being captured.
 *
 * THE FIX:
 * This service runs as a FOREGROUND service with a persistent notification. Android
 * guarantees foreground services are never killed (except in extreme memory pressure).
 * By keeping this service alive, we keep the entire app process alive, which in turn
 * keeps NotificationListenerService alive.
 *
 * This is the same technique used by:
 *   - Spotify (to keep music playing)
 *   - WhatsApp (to keep calls connected)
 *   - Truecaller (to keep caller ID active)
 *   - Telegram (to keep messages arriving)
 *
 * The persistent notification shows:
 *   "NotiFetch is monitoring delivery notifications"
 * with LOW importance (no sound, no heads-up, just a small icon in status bar).
 *
 * The user can dismiss it (Android 13+) but the service stays alive.
 *
 * Play Store policy compliance:
 *   - foregroundServiceType="specialUse" is the correct type for non-media/non-nav/non-call
 *     services that need to run continuously
 *   - We declare a <property> explaining the use case (required by Play Store)
 *   - The service provides real user-facing value (notification aggregation)
 *   - User explicitly grants notification access permission
 */
class KeepAliveService : Service() {

    companion object {
        private const val TAG = "NotiFetchKeepAlive"
        private const val NOTIFICATION_ID = 1
        private const val CHANNEL_ID = "notifetch_keep_alive"
        private const val CHANNEL_NAME = "Background Monitoring"

        /**
         * Start the keep-alive service.
         * Safe to call multiple times — if already running, does nothing.
         */
        fun start(context: Context) {
            val intent = Intent(context, KeepAliveService::class.java)
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                context.startForegroundService(intent)
            } else {
                context.startService(intent)
            }
            Log.d(TAG, "KeepAliveService start requested")
        }

        /**
         * Stop the keep-alive service (e.g., when user disables notification access).
         */
        fun stop(context: Context) {
            context.stopService(Intent(context, KeepAliveService::class.java))
            Log.d(TAG, "KeepAliveService stop requested")
        }
    }

    override fun onCreate() {
        super.onCreate()
        createNotificationChannel()
        Log.d(TAG, "KeepAliveService created")
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        // Start as foreground service — this is what prevents the OS from killing us
        startForeground(NOTIFICATION_ID, createPersistentNotification())
        Log.d(TAG, "KeepAliveService started as foreground service")

        // Return START_STICKY so Android restarts us if we're killed
        return START_STICKY
    }

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onDestroy() {
        Log.d(TAG, "KeepAliveService destroyed")
        super.onDestroy()
    }

    /**
     * Create the persistent notification shown in the status bar.
     * LOW importance = no sound, no heads-up, just a small icon.
     */
    private fun createPersistentNotification(): Notification {
        return NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("NotiFetch Active")
            .setContentText("Monitoring delivery notifications")
            .setSmallIcon(R.drawable.ic_launcher_foreground)
            .setOngoing(true) // Can't be swiped away
            .setPriority(NotificationCompat.PRIORITY_LOW)
            .setCategory(NotificationCompat.CATEGORY_SERVICE)
            .setColor(0xFFFFC107.toInt()) // Amber
            .setVisibility(NotificationCompat.VISIBILITY_SECRET) // Hidden on lock screen
            .build()
    }

    /**
     * Create the notification channel for the persistent notification.
     * LOW importance = no sound, no heads-up popup.
     */
    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                CHANNEL_NAME,
                NotificationManager.IMPORTANCE_LOW
            ).apply {
                description = "Keeps NotiFetch alive to capture delivery notifications"
                setShowBadge(false)
                enableLights(false)
                enableVibration(false)
            }
            val manager = getSystemService(NotificationManager::class.java)
            manager.createNotificationChannel(channel)
        }
    }
}
