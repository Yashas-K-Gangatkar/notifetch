package com.notifetch.app.worker

import android.content.ComponentName
import android.content.Context
import android.util.Log
import androidx.hilt.work.HiltWorker
import androidx.work.Constraints
import androidx.work.CoroutineWorker
import androidx.work.ExistingPeriodicWorkPolicy
import androidx.work.NetworkType
import androidx.work.PeriodicWorkRequestBuilder
import androidx.work.WorkManager
import androidx.work.WorkerParameters
import com.notifetch.app.data.repository.NotificationRepository
import com.notifetch.app.notification.NotiFetchListenerService
import dagger.assisted.Assisted
import dagger.assisted.AssistedInject
import java.util.concurrent.TimeUnit

@HiltWorker
class SyncWorker @AssistedInject constructor(
    @Assisted appContext: Context,
    @Assisted workerParams: WorkerParameters,
    private val repository: NotificationRepository
) : CoroutineWorker(appContext, workerParams) {

    private val tag = "SyncWorker"

    override suspend fun doWork(): Result {
        Log.d(tag, "SyncWorker running...")

        // v2.9.26: CRITICAL — Check if the notification listener is still alive.
        // If Realme/Android killed it, force the system to reconnect it using
        // requestRebind(). This is the official Android API for reactivating
        // a killed NotificationListenerService.
        try {
            val listenerEnabled = NotiFetchListenerService.isListenerEnabled(applicationContext)
            if (!listenerEnabled) {
                Log.w(tag, "Listener is NOT connected! Attempting to force rebind...")
                forceListenerRebind(applicationContext)
            } else {
                Log.d(tag, "Listener is connected ✅")
            }
        } catch (e: Exception) {
            Log.e(tag, "Failed to check listener status", e)
            // Try rebind anyway
            try { forceListenerRebind(applicationContext) } catch (_: Exception) {}
        }

        // v2.9.27: Auto-cleanup old notifications
        // Delete read notifications older than 2 hours, all notifications older than 24 hours
        try {
            val deleted = repository.cleanupOldNotifications()
            if (deleted > 0) {
                Log.d(tag, "Auto-cleanup: deleted $deleted old notifications")
            }
        } catch (e: Exception) {
            Log.w(tag, "Cleanup failed: ${e.message}")
        }

        // Sync pending notifications to backend
        Log.d(tag, "Starting notification sync...")
        return try {
            val result = repository.syncPendingNotifications()
            result.fold(
                onSuccess = { count ->
                    Log.d(tag, "Sync completed: $count notifications synced")
                    Result.success()
                },
                onFailure = { error ->
                    Log.e(tag, "Sync failed: ${error.message}")
                    if (runAttemptCount < 3) Result.retry() else Result.failure()
                }
            )
        } catch (e: Exception) {
            Log.e(tag, "Sync worker error", e)
            if (runAttemptCount < 3) {
                Result.retry()
            } else {
                Result.failure()
            }
        }
    }

    companion object {
        private const val TAG = "SyncWorker"
        private const val PERIODIC_SYNC_WORK_NAME = "notifetch_periodic_sync"

        /**
         * v2.9.26: Force the system to reconnect NotificationListenerService.
         *
         * Uses two strategies:
         * 1. requestRebind() — the official Android API (API 24+) that asks
         *    the system to rebind a notification listener that was killed.
         *    This is the CORRECT way to recover from OEM battery killing.
         *
         * 2. Component toggle — disable and re-enable the listener component.
         *    This is a fallback that works on some OEM ROMs where requestRebind()
         *    is ignored.
         */
        private fun forceListenerRebind(context: Context) {
            try {
                // Strategy 1: requestRebind() — official API
                val componentName = ComponentName(context, NotiFetchListenerService::class.java)

                // Toggle the component off then on to force system to re-evaluate
                val pm = context.packageManager
                pm.setComponentEnabledSetting(
                    componentName,
                    android.content.pm.PackageManager.COMPONENT_ENABLED_STATE_DISABLED,
                    android.content.pm.PackageManager.DONT_KILL_APP
                )

                // Small delay to let the system process the disable
                Thread.sleep(500)

                pm.setComponentEnabledSetting(
                    componentName,
                    android.content.pm.PackageManager.COMPONENT_ENABLED_STATE_ENABLED,
                    android.content.pm.PackageManager.DONT_KILL_APP
                )

                Log.d(TAG, "Listener component toggled — system should rebind within seconds")

                // Strategy 2: requestRebind via reflection (some OEMs block the public API)
                try {
                    val method = NotiFetchListenerService::class.java.getMethod("requestRebind", ComponentName::class.java)
                    method.invoke(null, componentName)
                    Log.d(TAG, "requestRebind() called successfully")
                } catch (e: Exception) {
                    Log.w(TAG, "requestRebind() failed: ${e.message} — component toggle should still work")
                }
            } catch (e: Exception) {
                Log.e(TAG, "forceListenerRebind failed", e)
            }
        }

        /**
         * Schedule a periodic sync worker that runs every 15 minutes.
         *
         * v2.9.26: This worker now does TWO things:
         *   1. Checks if NotificationListenerService is alive — if not, forces rebind
         *   2. Syncs pending notifications to backend
         *
         * The 15-minute interval is the minimum allowed by Android for periodic
         * WorkManager tasks. This means worst case, the listener is dead for
         * at most 15 minutes before being revived.
         *
         * Called from:
         *   - NotiFetchApp.onCreate() on first launch
         *   - BootReceiver.onReceive() after device restart
         */
        fun schedulePeriodicSync(context: Context) {
            val constraints = Constraints.Builder()
                .setRequiredNetworkType(NetworkType.CONNECTED)
                .build()

            val syncRequest = PeriodicWorkRequestBuilder<SyncWorker>(
                15, TimeUnit.MINUTES
            )
                .setConstraints(constraints)
                .build()

            WorkManager.getInstance(context).enqueueUniquePeriodicWork(
                PERIODIC_SYNC_WORK_NAME,
                ExistingPeriodicWorkPolicy.KEEP,
                syncRequest
            )

            Log.d(TAG, "Periodic sync + listener watchdog scheduled (every 15 min)")
        }
    }
}

