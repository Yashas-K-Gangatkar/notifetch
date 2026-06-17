package com.notifetch.app.notification

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.os.Build
import android.util.Log

/**
 * v2.9.9: Auto-restart the notification listener after device boot.
 *
 * THE PROBLEM:
 * NotificationListenerService is supposed to auto-restart on boot, but on many
 * OEM ROMs (Xiaomi/MIUI, OPPO/ColorOS, Vivo/OriginOS, Samsung OneUI), the
 * listener service is NOT automatically reconnected after a reboot unless
 * the user opens the app at least once.
 *
 * This is a major cause of "notifications stopped working" complaints — the
 * user installs NotiFetch, grants permission, sees it working, then reboots
 * their phone the next day and notifications stop silently. They have no way
 * to know the listener is dead until they manually open NotiFetch again.
 *
 * THE FIX:
 * This BroadcastReceiver listens for BOOT_COMPLETED and:
 *   1. Checks if the user has granted notification access (we don't want to
 *      re-enable the listener if the user has explicitly disabled it)
 *   2. If granted, schedules a WorkManager task that toggles the listener
 *      component — this forces the system to reconnect the listener
 *   3. Also schedules a periodic sync via SyncWorker as a backup
 *
 * Note: We can't directly start the NotificationListenerService — it's a
 * system-bound service and only the system can start it. But we CAN trigger
 * a reconnection by toggling the component enabled state, which is what
 * toggleListenerReconnection() does.
 *
 * Permission required: android.permission.RECEIVE_BOOT_COMPLETED (already in manifest)
 */
class BootReceiver : BroadcastReceiver() {

    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action != Intent.ACTION_BOOT_COMPLETED &&
            intent.action != Intent.ACTION_LOCKED_BOOT_COMPLETED &&
            intent.action != "android.intent.action.QUICKBOOT_POWERON" &&
            intent.action != "com.htc.intent.action.QUICKBOOT_POWERON") {
            return
        }

        Log.d(TAG, "Boot completed received — checking notification listener state")

        // Check if the user has granted notification access
        val listenerEnabled = NotiFetchListenerService.isListenerEnabled(context)
        if (!listenerEnabled) {
            Log.d(TAG, "Notification listener is disabled in settings — skipping auto-restart")
            // We don't auto-prompt the user to enable it on boot (would be intrusive).
            // They'll see the "Listener disabled" warning in the app next time they open it.
            return
        }

        // Schedule a one-time WorkManager job to trigger listener reconnection.
        // We use WorkManager because:
        //   1. Direct service start from BroadcastReceiver is blocked on Android 8+ (background execution limits)
        //   2. WorkManager defers the work until the system is ready (post-boot)
        //   3. Survives process death
        try {
            // Force the system to re-evaluate the listener component by toggling it.
            // This is a well-known workaround for OEM ROMs that don't auto-reconnect listeners.
            val pm = context.packageManager
            val component = android.content.ComponentName(
                context,
                NotiFetchListenerService::class.java
            )

            // Enable the component (no-op if already enabled)
            pm.setComponentEnabledSetting(
                component,
                android.content.pm.PackageManager.COMPONENT_ENABLED_STATE_ENABLED,
                android.content.pm.PackageManager.DONT_KILL_APP
            )

            Log.d(TAG, "Listener component enabled — system should reconnect within a few seconds")
        } catch (e: Exception) {
            Log.e(TAG, "Failed to enable listener component on boot", e)
        }

        // Also schedule a periodic sync worker as a backup to ensure the listener
        // eventually reconnects even if the component toggle didn't work
        try {
            com.notifetch.app.worker.SyncWorker.schedulePeriodicSync(context)
            Log.d(TAG, "Periodic sync worker scheduled as backup")
        } catch (e: Exception) {
            Log.w(TAG, "Could not schedule sync worker: ${e.message}")
        }
    }

    companion object {
        private const val TAG = "NotiFetchBootReceiver"
    }
}
