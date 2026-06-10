package com.notifetch.app.ui.viewmodel

import android.content.Context
import androidx.datastore.preferences.core.booleanPreferencesKey
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.longPreferencesKey
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import androidx.work.ExistingPeriodicWorkPolicy
import androidx.work.PeriodicWorkRequestBuilder
import com.notifetch.app.data.local.PlatformConfig
import com.notifetch.app.data.repository.NotificationRepository
import com.notifetch.app.data.repository.dataStore
import com.notifetch.app.notification.NotiFetchListenerService
import com.notifetch.app.util.Constants
import com.notifetch.app.worker.SyncWorker
import dagger.hilt.android.lifecycle.HiltViewModel
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import androidx.work.WorkManager
import androidx.work.Constraints
import androidx.work.NetworkType
import java.util.concurrent.TimeUnit
import javax.inject.Inject

data class SettingsUiState(
    val platformConfigs: List<PlatformConfig> = emptyList(),
    val isDarkMode: Boolean = false,
    val isSyncEnabled: Boolean = true,
    val syncIntervalMinutes: Long = 15,
    val isListenerEnabled: Boolean = false
)

@HiltViewModel
class SettingsViewModel @Inject constructor(
    @ApplicationContext private val context: Context,
    private val repository: NotificationRepository
) : ViewModel() {

    private val _isDarkMode = MutableStateFlow(false)
    private val _isSyncEnabled = MutableStateFlow(true)
    private val _syncIntervalMinutes = MutableStateFlow(15L)
    private val _isListenerEnabled = MutableStateFlow(false)

    private val platformConfigsFlow = repository.getAllPlatformConfigs()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val uiState: StateFlow<SettingsUiState> = combine(
        platformConfigsFlow,
        _isDarkMode,
        _isSyncEnabled,
        _syncIntervalMinutes,
        _isListenerEnabled
    ) { configs, darkMode, syncEnabled, syncInterval, listenerEnabled ->
        SettingsUiState(
            platformConfigs = configs,
            isDarkMode = darkMode,
            isSyncEnabled = syncEnabled,
            syncIntervalMinutes = syncInterval,
            isListenerEnabled = listenerEnabled
        )
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), SettingsUiState())

    init {
        // Load saved preferences from DataStore
        viewModelScope.launch {
            val prefs = context.dataStore.data.first()
            _isDarkMode.value = prefs[DARK_MODE_KEY] ?: false
            _isSyncEnabled.value = prefs[SYNC_ENABLED_KEY] ?: true
            _syncIntervalMinutes.value = prefs[SYNC_INTERVAL_KEY] ?: 15L
        }
        // Check actual listener enabled status (BUG #9 fix)
        _isListenerEnabled.value = NotiFetchListenerService.isListenerEnabled(context)
    }

    fun togglePlatform(packageName: String, isEnabled: Boolean) {
        viewModelScope.launch {
            repository.updatePlatformEnabled(packageName, isEnabled)
        }
    }

    fun updateCustomDisplayName(packageName: String, customName: String?) {
        viewModelScope.launch {
            repository.updateCustomDisplayName(packageName, customName)
        }
    }

    fun resetDisplayName(packageName: String) {
        viewModelScope.launch {
            repository.resetDisplayName(packageName)
        }
    }

    fun setDarkMode(enabled: Boolean) {
        _isDarkMode.value = enabled
        viewModelScope.launch {
            context.dataStore.edit { prefs ->
                prefs[DARK_MODE_KEY] = enabled
            }
        }
    }

    /**
     * Toggle auto sync — now ACTUALLY works (BUG #7 fix).
     * Persists preference to DataStore and cancels/re-schedules WorkManager.
     */
    fun setSyncEnabled(enabled: Boolean) {
        _isSyncEnabled.value = enabled
        viewModelScope.launch {
            // Persist to DataStore
            context.dataStore.edit { prefs ->
                prefs[SYNC_ENABLED_KEY] = enabled
            }
            // Cancel or re-schedule WorkManager periodic sync
            val workManager = WorkManager.getInstance(context)
            if (enabled) {
                scheduleSyncWork(workManager, _syncIntervalMinutes.value)
            } else {
                workManager.cancelUniqueWork(Constants.SYNC_WORK_NAME)
            }
        }
    }

    /**
     * Refresh listener enabled status — call from UI when returning from settings.
     */
    fun refreshListenerStatus() {
        _isListenerEnabled.value = NotiFetchListenerService.isListenerEnabled(context)
    }

    companion object {
        val DARK_MODE_KEY = booleanPreferencesKey("dark_mode")
        val SYNC_ENABLED_KEY = booleanPreferencesKey("sync_enabled")
        val SYNC_INTERVAL_KEY = longPreferencesKey("sync_interval_minutes")

        /**
         * Schedule periodic sync work with WorkManager.
         * Public so NotiFetchApp can also call it on startup.
         */
        fun scheduleSyncWork(workManager: WorkManager, intervalMinutes: Long) {
            val constraints = Constraints.Builder()
                .setRequiredNetworkType(NetworkType.CONNECTED)
                .setRequiresBatteryNotLow(true)
                .build()

            val syncWork = PeriodicWorkRequestBuilder<SyncWorker>(
                intervalMinutes,
                TimeUnit.MINUTES
            )
                .setConstraints(constraints)
                .setBackoffCriteria(
                    androidx.work.BackoffPolicy.EXPONENTIAL,
                    30,
                    TimeUnit.SECONDS
                )
                .build()

            workManager.enqueueUniquePeriodicWork(
                Constants.SYNC_WORK_NAME,
                ExistingPeriodicWorkPolicy.KEEP,
                syncWork
            )
        }
    }
}
