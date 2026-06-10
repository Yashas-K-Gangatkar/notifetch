package com.notifetch.app.ui.viewmodel

import android.content.Context
import androidx.datastore.preferences.core.booleanPreferencesKey
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.preferencesDataStore
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.notifetch.app.data.local.PlatformConfig
import com.notifetch.app.data.repository.NotificationRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import javax.inject.Inject

val Context.settingsDataStore by preferencesDataStore(name = "settings_prefs")

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
        // Load saved dark mode preference
        viewModelScope.launch {
            val prefs = context.settingsDataStore.data.first()
            _isDarkMode.value = prefs[DARK_MODE_KEY] ?: false
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
            context.settingsDataStore.edit { prefs ->
                prefs[DARK_MODE_KEY] = enabled
            }
        }
    }

    fun setSyncEnabled(enabled: Boolean) {
        _isSyncEnabled.value = enabled
    }

    fun setListenerEnabled(enabled: Boolean) {
        _isListenerEnabled.value = enabled
    }

    companion object {
        val DARK_MODE_KEY = booleanPreferencesKey("dark_mode")
    }
}
