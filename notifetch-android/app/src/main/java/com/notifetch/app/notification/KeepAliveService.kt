package com.notifetch.app.notification

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.app.ForegroundServiceStartNotAllowedException
import android.content.Context
import android.content.Intent
import android.os.Build
import android.os.IBinder
import android.util.Log
import androidx.core.app.NotificationCompat
import com.notifetch.app.R

/**
 * v2.9.66: Foreground Keep-Alive Service — re-introduced with crash fix.
 *
 * v2.9.17 added this, v2.9.23 removed it (crashed with ForegroundServiceStartNotAllowedException
 * because it was started from onListenerConnected — a background thread).
 * v2.9.66 fix: started from MainActivity.onCreate (foreground context) — no crash.
 *
 * Keeps the app process alive so Realme/Xiaomi/OPPO don't kill NotificationListenerService
 * after 5-10 minutes of backgrounding. Same technique as Spotify, WhatsApp, Truecaller.
 */
class KeepAliveService : Service() {

    companion object {
        private const val TAG = "NotiFetchKeepAlive"
        private const val NOTIFICATION_ID = 1
        private const val CHANNEL_ID = "notifetch_keep_alive"
        private const val CHANNEL_NAME = "Background Monitoring"

        fun start(context: Context) {
            try {
                val intent = Intent(context, KeepAliveService::class.java)
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                    context.startForegroundService(intent)
                } else {
                    context.startService(intent)
                }
                Log.d(TAG, "KeepAliveService start requested")
            } catch (e: Exception) {
                Log.w(TAG, "Could not start KeepAliveService: ${e.message}")
            }
        }

        fun stop(context: Context) {
            try {
                context.stopService(Intent(context, KeepAliveService::class.java))
            } catch (e: Exception) {
                Log.w(TAG, "Could not stop KeepAliveService: ${e.message}")
            }
        }
    }

    override fun onCreate() {
        super.onCreate()
        createNotificationChannel()
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {
                // Android 14+ requires explicit foregroundServiceType
                val notification = createPersistentNotification()
                val type = 0x40000000 // ServiceInfo.FOREGROUND_SERVICE_TYPE_SPECIAL_USE
                val method = Service::class.java.getMethod(
                    "startForeground",
                    Int::class.javaPrimitiveType,
                    Notification::class.java,
                    Int::class.javaPrimitiveType
                )
                method.invoke(this, NOTIFICATION_ID, notification, type)
            } else {
                startForeground(NOTIFICATION_ID, createPersistentNotification())
            }
            Log.d(TAG, "KeepAliveService started as foreground service")
        } catch (e: ForegroundServiceStartNotAllowedException) {
            Log.e(TAG, "ForegroundServiceStartNotAllowedException — started from background?", e)
        } catch (e: Exception) {
            Log.e(TAG, "Failed to start foreground service: ${e.message}", e)
        }
        return START_STICKY
    }

    override fun onBind(intent: Intent?): IBinder? = null

    private fun createPersistentNotification(): Notification {
        return NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("NotiFetch Active")
            .setContentText("Monitoring delivery notifications")
            .setSmallIcon(R.drawable.ic_launcher_foreground)
            .setOngoing(true)
            .setPriority(NotificationCompat.PRIORITY_LOW)
            .setCategory(NotificationCompat.CATEGORY_SERVICE)
            .setColor(0xFFFFC107.toInt())
            .setVisibility(NotificationCompat.VISIBILITY_SECRET)
            .build()
    }

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
