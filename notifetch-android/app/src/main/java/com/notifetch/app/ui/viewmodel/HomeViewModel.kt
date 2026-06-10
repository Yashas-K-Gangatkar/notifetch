package com.notifetch.app.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.notifetch.app.data.local.CapturedNotification
import com.notifetch.app.data.local.NotificationDao
import com.notifetch.app.data.local.PlatformConfig
import com.notifetch.app.data.repository.AuthRepository
import com.notifetch.app.data.repository.NotificationRepository
import com.notifetch.app.util.Helpers
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import javax.inject.Inject

data class HomeUiState(
    val notifications: List<CapturedNotification> = emptyList(),
    val unreadCount: Int = 0,
    val totalCount: Int = 0,
    val todayCount: Int = 0,
    val todayEarnings: Double = 0.0,
    val weekEarnings: Double = 0.0,
    val platformStats: List<NotificationDao.PlatformStat> = emptyList(),
    val isListenerEnabled: Boolean = true,
    val isSyncing: Boolean = false,
    val searchQuery: String = "",
    val selectedPlatform: String? = null,
    val isRefreshing: Boolean = false,
    val platformNameMap: Map<String, String> = emptyMap()
)

@HiltViewModel
class HomeViewModel @Inject constructor(
    private val repository: NotificationRepository,
    private val authRepository: AuthRepository
) : ViewModel() {

    private val _searchQuery = MutableStateFlow("")
    private val _selectedPlatform = MutableStateFlow<String?>(null)
    private val _isSyncing = MutableStateFlow(false)
    private val _isRefreshing = MutableStateFlow(false)
    private val _isListenerEnabled = MutableStateFlow(true)

    // Room flows — StateFlow from stateIn already deduplicates
    private val allNotifications = repository.getAllNotifications()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    private val platformConfigsFlow = repository.getAllPlatformConfigs()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    private val filteredNotifications = combine(
        allNotifications,
        _searchQuery,
        _selectedPlatform
    ) { notifications, query, platform ->
        var result = notifications
        if (platform != null) {
            result = result.filter { it.platform == platform }
        }
        if (query.isNotBlank()) {
            result = result.filter {
                it.title.contains(query, ignoreCase = true) ||
                it.body.contains(query, ignoreCase = true) ||
                it.platform.contains(query, ignoreCase = true)
            }
        }
        result
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    private val unreadCountFlow = repository.getUnreadCount()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), 0)

    private val totalCountFlow = repository.getTotalCount()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), 0)

    private val todayCountFlow = repository.getCountInTimeRange(
        Helpers.startOfDayTimestamp(), System.currentTimeMillis()
    ).stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), 0)

    private val todayEarningsFlow = repository.getTotalOrderValueSince(
        Helpers.startOfDayTimestamp()
    ).stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), 0.0)

    private val weekEarningsFlow = repository.getTotalOrderValueSince(
        Helpers.startOfWeekTimestamp()
    ).stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), 0.0)

    private val platformStatsFlow = repository.getNotificationCountByPlatform()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    // Consolidate all state into a SINGLE uiState to prevent cascading recompositions.
    // Use nested combines since Kotlin combine() supports max 5 flows directly.
    // Step 1: Combine Room data flows
    private val dataState = combine(
        filteredNotifications,
        unreadCountFlow,
        totalCountFlow,
        todayCountFlow,
        todayEarningsFlow
    ) { notifications, unreadCount, totalCount, todayCount, todayEarnings ->
        DataState(
            notifications = notifications,
            unreadCount = unreadCount,
            totalCount = totalCount,
            todayCount = todayCount,
            todayEarnings = todayEarnings
        )
    }

    // Step 2: Combine secondary data flows
    private val secondaryState = combine(
        weekEarningsFlow,
        platformStatsFlow,
        platformConfigsFlow
    ) { weekEarnings, platformStats, configs ->
        SecondaryState(
            weekEarnings = weekEarnings,
            platformStats = platformStats,
            platformNameMap = configs.associate { it.packageName to it.resolvedDisplayName }
        )
    }

    // Step 3: Combine UI state flows
    private val uiControlState = combine(
        _isSyncing,
        _isRefreshing,
        _isListenerEnabled,
        _searchQuery,
        _selectedPlatform
    ) { isSyncing, isRefreshing, isListenerEnabled, searchQuery, selectedPlatform ->
        UIControlState(
            isSyncing = isSyncing,
            isRefreshing = isRefreshing,
            isListenerEnabled = isListenerEnabled,
            searchQuery = searchQuery,
            selectedPlatform = selectedPlatform
        )
    }

    // Step 4: Final combine into HomeUiState
    val uiState: StateFlow<HomeUiState> = combine(
        dataState,
        secondaryState,
        uiControlState
    ) { data, secondary, uiControl ->
        HomeUiState(
            notifications = data.notifications,
            unreadCount = data.unreadCount,
            totalCount = data.totalCount,
            todayCount = data.todayCount,
            todayEarnings = data.todayEarnings,
            weekEarnings = secondary.weekEarnings,
            platformStats = secondary.platformStats,
            platformNameMap = secondary.platformNameMap,
            isSyncing = uiControl.isSyncing,
            isRefreshing = uiControl.isRefreshing,
            isListenerEnabled = uiControl.isListenerEnabled,
            searchQuery = uiControl.searchQuery,
            selectedPlatform = uiControl.selectedPlatform
        )
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), HomeUiState())

    init {
        viewModelScope.launch {
            repository.initializePlatformConfigs()
        }
    }

    fun onSearchQueryChange(query: String) {
        _searchQuery.value = query
    }

    fun onPlatformFilterChange(platform: String?) {
        _selectedPlatform.value = platform
    }

    fun markAsRead(id: Long) {
        viewModelScope.launch {
            repository.markAsRead(id)
        }
    }

    fun markAllAsRead() {
        viewModelScope.launch {
            repository.markAllAsRead()
        }
    }

    fun syncNow() {
        viewModelScope.launch {
            try {
                _isSyncing.value = true
                repository.syncPendingNotifications()
            } catch (_: Exception) {
                // Silently handle sync errors
            } finally {
                _isSyncing.value = false
            }
        }
    }

    fun updateListenerEnabled(enabled: Boolean) {
        _isListenerEnabled.value = enabled
    }

    fun refresh() {
        viewModelScope.launch {
            _isRefreshing.value = true
            // Allow Room flows to emit before turning off refresh indicator
            kotlinx.coroutines.delay(300)
            _isRefreshing.value = false
        }
    }
}

// Intermediate state holders for nested combine
private data class DataState(
    val notifications: List<CapturedNotification>,
    val unreadCount: Int,
    val totalCount: Int,
    val todayCount: Int,
    val todayEarnings: Double
)

private data class SecondaryState(
    val weekEarnings: Double,
    val platformStats: List<NotificationDao.PlatformStat>,
    val platformNameMap: Map<String, String>
)

private data class UIControlState(
    val isSyncing: Boolean,
    val isRefreshing: Boolean,
    val isListenerEnabled: Boolean,
    val searchQuery: String,
    val selectedPlatform: String?
)
