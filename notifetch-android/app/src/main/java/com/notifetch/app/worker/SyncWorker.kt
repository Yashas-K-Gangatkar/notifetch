package com.notifetch.app.worker

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
         * v2.9.9: Schedule a periodic sync worker that runs every 15 minutes.
         * This serves two purposes:
         *   1. Ensures pending notifications get synced to the backend even if
         *      the listener service was killed by Android
         *   2. Acts as a "heartbeat" — when WorkManager runs the worker, it
         *      spins up the NotiFetch process, which gives the system a chance
         *      to reconnect the notification listener
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

            Log.d(TAG, "Periodic sync scheduled (every 15 min)")
        }
    }
}

