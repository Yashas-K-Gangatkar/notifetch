package com.notifetch.app

import android.app.Application
import android.app.NotificationChannel
import android.app.NotificationManager
import android.os.Build
import androidx.hilt.work.HiltWorkerFactory
import androidx.work.Configuration
import androidx.work.WorkManager
import com.notifetch.app.ui.viewmodel.settingsDataStore
import com.notifetch.app.util.Constants
import com.notifetch.app.ui.viewmodel.SettingsViewModel
import com.notifetch.app.worker.SyncWorker
import dagger.hilt.android.HiltAndroidApp
import javax.inject.Inject
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.launch

@HiltAndroidApp
class NotiFetchApp : Application(), Configuration.Provider {

    @Inject lateinit var workerFactory: HiltWorkerFactory

    private val appScope = CoroutineScope(SupervisorJob() + Dispatchers.IO)

    override val workManagerConfiguration: Configuration
        get() = Configuration.Builder()
            .setWorkerFactory(workerFactory)
            .build()

    override fun onCreate() {
        super.onCreate()
        createNotificationChannels()
        schedulePeriodicSyncIfEnabled()
    }

    private fun createNotificationChannels() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                Constants.NOTIFICATION_CHANNEL_ID,
                Constants.NOTIFICATION_CHANNEL_NAME,
                NotificationManager.IMPORTANCE_LOW
            ).apply {
                description = "NotiFetch background sync service"
                setShowBadge(false)
            }

            val notificationManager = getSystemService(NotificationManager::class.java)
            notificationManager.createNotificationChannel(channel)
        }
    }

    /**
     * Schedule periodic sync only if the user hasn't disabled it (BUG #7/16 fix).
     * Reads the sync_enabled preference from DataStore.
     */
    private fun schedulePeriodicSyncIfEnabled() {
        val workManager = WorkManager.getInstance(this)
        appScope.launch {
            val syncEnabled = try {
                settingsDataStore.data.map { prefs ->
                    prefs[SettingsViewModel.SYNC_ENABLED_KEY] ?: true
                }.first()
            } catch (_: Exception) { true } // Default to enabled if read fails

            if (syncEnabled) {
                val intervalMinutes = try {
                    settingsDataStore.data.map { prefs ->
                        prefs[SettingsViewModel.SYNC_INTERVAL_KEY] ?: 15L
                    }.first()
                } catch (_: Exception) { Constants.SYNC_INTERVAL_MINUTES }

                SettingsViewModel.scheduleSyncWork(workManager, intervalMinutes)
            }
        }
    }
}
