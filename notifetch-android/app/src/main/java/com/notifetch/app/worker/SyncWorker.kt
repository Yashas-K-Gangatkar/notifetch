package com.notifetch.app.worker

import android.content.Context
import android.util.Log
import androidx.hilt.work.HiltWorker
import androidx.work.CoroutineWorker
import androidx.work.WorkerParameters
import com.notifetch.app.data.repository.NotificationRepository
import dagger.assisted.Assisted
import dagger.assisted.AssistedInject

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
            result.onSuccess { count ->
                Log.d(tag, "Sync completed: $count notifications synced")
            }.onFailure { error ->
                Log.e(tag, "Sync failed: ${error.message}")
            }
            Result.success()
        } catch (e: Exception) {
            Log.e(tag, "Sync worker error", e)
            if (runAttemptCount < 3) {
                Result.retry()
            } else {
                Result.failure()
            }
        }
    }
}
