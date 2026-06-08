package com.notifetch.app

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.util.Log

/**
 * Boot receiver to re-enable notification listening after device restart.
 *
 * Note: NotificationListenerService is automatically re-bound by the system
 * after reboot IF the user has granted notification access. This receiver
 * serves as a safety net and also handles MY_PACKAGE_REPLACED to ensure
 * the service reconnects after app updates.
 */
class BootReceiver : BroadcastReceiver() {

    companion object {
        private const val TAG = "NotiFetchBootReceiver"
    }

    override fun onReceive(context: Context, intent: Intent) {
        when (intent.action) {
            Intent.ACTION_BOOT_COMPLETED,
            Intent.ACTION_MY_PACKAGE_REPLACED,
            "android.intent.action.QUICKBOOT_POWERON" -> {
                Log.i(TAG, "Received: ${intent.action} — notification listener should auto-reconnect")

                // The NotificationListenerService is automatically reconnected by Android
                // after boot if the user has granted permission. We don't need to
                // explicitly start it. However, we can retry any failed notifications.
                val apiClient = ApiClient(context)
                val repository = NotificationRepository(
                    NotiFetchDatabase.getDatabase(context).notificationDao()
                )

                // Retry failed notifications in background
                Thread {
                    try {
                        kotlinx.coroutines.runBlocking {
                            apiClient.retryFailedNotifications(repository)
                        }
                    } catch (e: Exception) {
                        Log.e(TAG, "Error retrying notifications on boot", e)
                    }
                }.start()
            }
        }
    }
}
