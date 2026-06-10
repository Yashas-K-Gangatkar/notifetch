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
import kotlinx.coroutines.flow.debounce
import kotlinx.coroutines.flow.distinctUntilChanged
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
) {
    // Explicit equality check to make distinctUntilChanged() work properly.
    // Without this, data class copy() with same values still creates a new object
    // that Compose treats as different, causing unnecessary recompositions.
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is HomeUiState) return false
        return notifications == other.notifications &&
                unreadCount == other.unreadCount &&
                totalCount == other.totalCount &&
                todayCount == other.todayCount &&
                todayEarnings == other.todayEarnings &&
                weekEarnings == other.weekEarnings &&
                platformStats == other.platformStats &&
                isListenerEnabled == other.isListenerEnabled &&
                isSyncing == other.isSyncing &&
                searchQuery == other.searchQuery &&
                selectedPlatform == other.selectedPlatform &&
                isRefreshing == other.isRefreshing &&
                platformNameMap == other.platformNameMap
    }

    override fun hashCode(): Int {
        var result = notifications.hashCode()
        result = 31 * result + unreadCount
        result = 31 * result + totalCount
        result = 31 * result + todayCount
        result = 31 * result + todayEarnings.hashCode()
        result = 31 * result + weekEarnings.hashCode()
        result = 31 * result + platformStats.hashCode()
        result = 31 * result + isListenerEnabled.hashCode()
        result = 31 * result + isSyncing.hashCode()
        result = 31 * result + searchQuery.hashCode()
        result = 31 * result + (selectedPlatform?.hashCode() ?: 0)
        result = 31 * result + isRefreshing.hashCode()
        result = 31 * result + platformNameMap.hashCode()
        return result
    }
}

@HiltViewModel
@OptIn(kotlinx.coroutines.FlowPreview::class)
class HomeViewModel @Inject constructor(
    private val repository: NotificationRepository,
    private val authRepository: AuthRepository
) : ViewModel() {

    private val _searchQuery = MutableStateFlow("")
    private val _selectedPlatform = MutableStateFlow<String?>(null)
    private val _isSyncing = MutableStateFlow(false)
    private val _isRefreshing = MutableStateFlow(false)
    private val _isListenerEnabled = MutableStateFlow(true)

    // ── Room flows ──────────────────────────────────────────────────────────
    // Each flow is stateIn'd with a 5-second timeout so it stays alive briefly
    // after the UI stops collecting (avoids re-query on rapid screen switches).
    //
    // FLUTTERING FIX STRATEGY:
    // The previous approach used 7+ separate Room Flow subscriptions. A single
    // DB write (insertNotification + incrementNotificationCount + markAsSynced)
    // triggered 7+ emissions, each causing a separate recomposition.
    //
    // New approach:
    //   1. Removed incrementNotificationCount from insertNotification (BUG #2)
    //   2. Debounced sync in the listener (already 5s — kept)
    //   3. markAsSynced is now a batch DAO call that fires once per sync
    //   4. Consolidated all flows into a SINGLE combined state
    //   5. Added 200ms debounce to coalesce any remaining rapid emissions
    //   6. Added proper equals/hashCode to HomeUiState for distinctUntilChanged
    //
    // This means a notification capture causes:
    //   - 1 emission from insertNotification (notifications + counts update)
    //   - 5 seconds later: 1 emission from markAsSynced (isSynced field changes)
    // Instead of 7+ emissions in rapid succession.
    // ─────────────────────────────────────────────────────────────────────────

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

    // ── Consolidated state ──────────────────────────────────────────────────

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

    // Final combined state → 200ms debounce → distinctUntilChanged → StateFlow
    // 200ms is the sweet spot: long enough to coalesce Room's rapid re-emissions
    // after a write, short enough that the user perceives instant UI updates.
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
    }
        .debounce(200)
        .distinctUntilChanged()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), HomeUiState())

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
            // Trigger a real sync and wait for it
            try {
                repository.syncPendingNotifications()
            } catch (_: Exception) { }
            // Brief delay to let Room flows emit updated data
            kotlinx.coroutines.delay(100)
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
