package com.notifetch.app.worker

import android.content.ComponentName
import android.content.Context
import android.util.Log
import androidx.hilt.work.HiltWorker
import androidx.work.Constraints
import androidx.work.CoroutineWorker
import androidx.work.ExistingPeriodicWorkPolicy
import androidx.work.ExistingWorkPolicy
import androidx.work.NetworkType
import androidx.work.OneTimeWorkRequestBuilder
import androidx.work.PeriodicWorkRequestBuilder
import androidx.work.WorkManager
import androidx.work.WorkerParameters
import com.notifetch.app.data.repository.NotificationRepository
import com.notifetch.app.notification.NotiFetchListenerService
import dagger.assisted.Assisted
import dagger.assisted.AssistedInject
import kotlinx.coroutines.delay
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
                // v2.9.58 FIX: Listener is enabled in settings, but is the instance alive?
                // Check if currentInstance is null (means process was killed but setting is still on)
                val isInstanceAlive = com.notifetch.app.notification.NotiFetchListenerService.isInstanceAlive()
                if (!isInstanceAlive) {
                    Log.w(tag, "Listener enabled in settings but instance is dead! Requesting rebind...")
                    try {
                        val componentName = android.content.ComponentName(
                            applicationContext,
                            com.notifetch.app.notification.NotiFetchListenerService::class.java
                        )
                        android.service.notification.NotificationListenerService.requestRebind(componentName)
                        Log.d(tag, "requestRebind() called successfully")
                    } catch (e: Exception) {
                        Log.w(tag, "requestRebind() failed: ${e.message}")
                    }
                } else {
                    Log.d(tag, "Listener is connected ✅")
                }
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
         *
         * v2.9.38: Converted from `private fun` to `private suspend fun` and
         * replaced `Thread.sleep(500)` with `delay(500)` — Thread.sleep blocks
         * the worker thread, while delay() properly suspends the coroutine.
         */
        private suspend fun forceListenerRebind(context: Context) {
            try {
                // v2.9.66: use requestRebind() directly — no destructive component toggle
                val componentName = ComponentName(context, NotiFetchListenerService::class.java)
                android.service.notification.NotificationListenerService.requestRebind(componentName)
                Log.d(TAG, "requestRebind() called — system should rebind within seconds")
            } catch (e: Exception) {
                Log.e(TAG, "forceListenerRebind failed", e)
            }
        }

        /**
         * v2.9.35: Fire a one-shot listener health check immediately.
         *
         * Called when:
         *   - App comes to foreground (ProcessLifecycleOwner ON_RESUME)
         *   - Screen turns on (ACTION_SCREEN_ON broadcast via ScreenOnReceiver)
         *
         * This brings the worst-case blind window down from "15-60 min" (when
         * Realme/Xiaomi kills the listener and delays the periodic worker) to
         * "next time the user touches their phone".
         *
         * Uses ExistingWorkPolicy.REPLACE so multiple rapid triggers (e.g.
         * screen-on while app is also in foreground) coalesce into a single
         * health-check run instead of stacking up.
         *
         * No network constraint — listener rebind works offline, and we don't
         * want to delay the rebind waiting for network.
         */
        fun checkListenerHealthNow(context: Context) {
            val request = OneTimeWorkRequestBuilder<SyncWorker>()
                .setConstraints(Constraints.Builder().build())
                .build()
            WorkManager.getInstance(context).enqueueUniqueWork(
                "notifetch_listener_health_check",
                ExistingWorkPolicy.REPLACE,
                request
            )
            Log.d(TAG, "One-shot listener health check enqueued")
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
         * v2.9.35: The 15-min periodic schedule is now a SAFETY NET. The
         * primary rebind trigger is [checkListenerHealthNow], which fires on
         * foreground and screen-on events. This periodic schedule catches
         * the case where the user leaves their phone untouched for hours.
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

            // v2.9.66: use single canonical name, REPLACE so interval changes take effect
            WorkManager.getInstance(context).enqueueUniquePeriodicWork(
                com.notifetch.app.util.Constants.SYNC_WORK_NAME,
                ExistingPeriodicWorkPolicy.REPLACE,
                syncRequest
            )

            Log.d(TAG, "Periodic sync + listener watchdog scheduled (every 15 min)")
        }
    }
}

