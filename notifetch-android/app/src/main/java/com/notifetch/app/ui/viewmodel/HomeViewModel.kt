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
    val isListenerEnabled: Boolean = false,
    val isSyncing: Boolean = false,
    val searchQuery: String = "",
    val selectedPlatform: String? = null,
    val isRefreshing: Boolean = false,
    // Map of packageName → resolved display name (custom → default)
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
    private val _isListenerEnabled = MutableStateFlow(false)

    private val allNotifications = repository.getAllNotifications()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    // Platform configs for display name resolution
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

    val uiState: StateFlow<HomeUiState> = combine(
        filteredNotifications,
        unreadCountFlow,
        totalCountFlow,
        todayCountFlow,
        todayEarningsFlow,
        platformConfigsFlow
    ) { notifications, unreadCount, totalCount, todayCount, todayEarnings, configs ->
        // Build the package → resolved name map for display name resolution
        val nameMap = configs.associate { it.packageName to it.resolvedDisplayName }

        HomeUiState(
            notifications = notifications,
            unreadCount = unreadCount,
            totalCount = totalCount,
            todayCount = todayCount,
            todayEarnings = todayEarnings,
            platformNameMap = nameMap
        )
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), HomeUiState())

    // Additional state flows accessed separately for compose
    val weekEarnings = weekEarningsFlow
    val platformStats = platformStatsFlow
    val isSyncing = _isSyncing.asStateFlow()
    val isRefreshing = _isRefreshing.asStateFlow()
    val isListenerEnabled = _isListenerEnabled.asStateFlow()
    val searchQuery = _searchQuery.asStateFlow()
    val selectedPlatform = _selectedPlatform.asStateFlow()

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
            _isSyncing.value = true
            repository.syncPendingNotifications()
            _isSyncing.value = false
        }
    }

    fun updateListenerEnabled(enabled: Boolean) {
        _isListenerEnabled.value = enabled
    }

    fun refresh() {
        viewModelScope.launch {
            _isRefreshing.value = true
            _isRefreshing.value = false
        }
    }
}

private fun <T> MutableStateFlow<T>.asStateFlow(): StateFlow<T> = this
