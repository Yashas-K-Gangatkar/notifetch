package com.notifetch.app.ui.viewmodel

import android.content.Context
import androidx.datastore.preferences.core.booleanPreferencesKey
import androidx.datastore.preferences.core.floatPreferencesKey
import androidx.datastore.preferences.core.stringPreferencesKey
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
    val isDynamicColor: Boolean = false,
    val isSyncEnabled: Boolean = true,
    val syncIntervalMinutes: Long = 15,
    val isListenerEnabled: Boolean = false,
    val notificationsCount: Int = 0,
    val unreadCount: Int = 0,
    val dataCollectedSizeBytes: Long = 0L
)

@HiltViewModel
class SettingsViewModel @Inject constructor(
    @ApplicationContext private val context: Context,
    private val repository: NotificationRepository
) : ViewModel() {

    private val _isDarkMode = MutableStateFlow(false)
    private val _isDynamicColor = MutableStateFlow(false)
    private val _isSyncEnabled = MutableStateFlow(true)
    private val _syncIntervalMinutes = MutableStateFlow(15L)
    private val _isListenerEnabled = MutableStateFlow(false)
    private val _notificationsCount = MutableStateFlow(0)
    private val _unreadCount = MutableStateFlow(0)
    private val _dataCollectedSizeBytes = MutableStateFlow(0L)

    private val platformConfigsFlow = repository.getAllPlatformConfigs()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val uiState: StateFlow<SettingsUiState> = combine(
        platformConfigsFlow,
        combine(
            _isDarkMode, _isDynamicColor, _isSyncEnabled,
            _syncIntervalMinutes, _isListenerEnabled
        ) { darkMode, dynamicColor, syncEnabled, syncInterval, listenerEnabled ->
            ThemeSyncState(darkMode, dynamicColor, syncEnabled, syncInterval, listenerEnabled)
        },
        combine(_notificationsCount, _unreadCount) { count, unread ->
            Pair(count, unread)
        },
        _dataCollectedSizeBytes
    ) { configs, themeSync, notifPair, sizeBytes ->
        SettingsUiState(
            platformConfigs = configs,
            isDarkMode = themeSync.darkMode,
            isDynamicColor = themeSync.dynamicColor,
            isSyncEnabled = themeSync.syncEnabled,
            syncIntervalMinutes = themeSync.syncInterval,
            isListenerEnabled = themeSync.listenerEnabled,
            notificationsCount = notifPair.first,
            unreadCount = notifPair.second,
            dataCollectedSizeBytes = sizeBytes
        )
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), SettingsUiState())

    init {
        // Load saved preferences from DataStore
        viewModelScope.launch {
            val prefs = context.dataStore.data.first()
            _isDarkMode.value = prefs[DARK_MODE_KEY] ?: false
            _isDynamicColor.value = prefs[DYNAMIC_COLOR_KEY] ?: false
            _isSyncEnabled.value = prefs[SYNC_ENABLED_KEY] ?: true
            _syncIntervalMinutes.value = prefs[SYNC_INTERVAL_KEY] ?: 15L
        }
        // Check actual listener enabled status (BUG #9 fix)
        _isListenerEnabled.value = NotiFetchListenerService.isListenerEnabled(context)

        // v2.9.11: Load privacy dashboard data
        viewModelScope.launch {
            try {
                val count = repository.getTotalCount().first()
                _notificationsCount.value = count
                val unread = repository.getUnreadCount().first()
                _unreadCount.value = unread
                // Estimate data size: each notification averages ~500 bytes
                _dataCollectedSizeBytes.value = count.toLong() * 500L
            } catch (_: Exception) {
                // Ignore — non-critical
            }
        }
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
     * v2.9.11: Toggle Material You dynamic color theming.
     * When enabled, app colors adapt to user's wallpaper (Android 12+).
     * When disabled, app uses fixed amber/orange brand colors.
     */
    fun setDynamicColor(enabled: Boolean) {
        _isDynamicColor.value = enabled
        viewModelScope.launch {
            context.dataStore.edit { prefs ->
                prefs[DYNAMIC_COLOR_KEY] = enabled
            }
        }
    }

    /**
     * v2.9.11: Export all captured notifications as JSON for the privacy dashboard.
     */
    suspend fun exportAllDataAsJson(): String {
        val notifications = repository.getAllNotifications().first()
        val sb = StringBuilder()
        sb.append("[\n")
        notifications.forEachIndexed { index, n ->
            sb.append("  {\n")
            sb.append("    \"id\": ${n.id},\n")
            sb.append("    \"platform\": \"${n.platform}\",\n")
            sb.append("    \"packageName\": \"${n.packageName}\",\n")
            sb.append("    \"title\": \"${n.title.replace("\"", "\\\"")}\",\n")
            sb.append("    \"body\": \"${n.body.replace("\"", "\\\"")}\",\n")
            sb.append("    \"category\": \"${n.category ?: ""}\",\n")
            sb.append("    \"orderValue\": ${n.orderValue ?: "null"},\n")
            sb.append("    \"currency\": \"${n.currency}\",\n")
            sb.append("    \"receivedAt\": ${n.receivedAt},\n")
            sb.append("    \"userMode\": \"${n.userMode}\"\n")
            sb.append("  }")
            if (index < notifications.size - 1) sb.append(",")
            sb.append("\n")
        }
        sb.append("]\n")
        return sb.toString()
    }

    /**
     * v2.9.11: Delete ALL user data (DPDP Act 2023 §8 & GDPR Article 17).
     */
    fun deleteAllData() {
        viewModelScope.launch {
            try {
                repository.deleteAllDataIncludingServer()
                _notificationsCount.value = 0
                _unreadCount.value = 0
                _dataCollectedSizeBytes.value = 0L
            } catch (_: Exception) {
                // Ignore — UI will reflect error via separate flow if needed
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

    /**
     * v2.9.69: Export all notifications as CSV string.
     * Used by Settings → Download a Copy (local export, no web redirect).
     */
    fun exportNotificationsAsCsv(): String {
        return kotlinx.coroutines.runBlocking {
            val notifications = repository.getAllNotificationsSync()
            val sdf = java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss", java.util.Locale.getDefault())
            val sb = StringBuilder()
            sb.appendLine("Date,Platform,Title,Body,Category,Mode")
            for (n in notifications) {
                val date = sdf.format(java.util.Date(n.receivedAt))
                val title = n.title.replace("\"", "\"\"")
                val body = n.body.replace("\"", "\"\"")
                val category = n.category ?: ""
                sb.appendLine("\"$date\",\"${n.platform}\",\"$title\",\"$body\",\"$category\",\"${n.userMode}\"")
            }
            sb.toString()
        }
    }

    companion object {
        val DARK_MODE_KEY = booleanPreferencesKey("dark_mode")
        val DYNAMIC_COLOR_KEY = booleanPreferencesKey("dynamic_color")
        val SYNC_ENABLED_KEY = booleanPreferencesKey("sync_enabled")
        val SYNC_INTERVAL_KEY = longPreferencesKey("sync_interval_minutes")
        val ONBOARDING_COMPLETED_KEY = booleanPreferencesKey("onboarding_completed")
        // v2.9.68: Glass transparency — controls overlay alpha over gradient background
        val CARD_TRANSPARENCY_KEY = floatPreferencesKey("card_transparency")
        val USER_MODE_KEY = stringPreferencesKey("user_mode")

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

            // Use REPLACE instead of KEEP so that interval changes actually take effect.
            // KEEP would ignore the new interval if work is already scheduled.
            workManager.enqueueUniquePeriodicWork(
                Constants.SYNC_WORK_NAME,
                ExistingPeriodicWorkPolicy.REPLACE,
                syncWork
            )
        }
    }
}

private data class ThemeSyncState(
    val darkMode: Boolean,
    val dynamicColor: Boolean,
    val syncEnabled: Boolean,
    val syncInterval: Long,
    val listenerEnabled: Boolean
)
