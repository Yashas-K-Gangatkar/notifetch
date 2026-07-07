package com.notifetch.app.ui.viewmodel

import android.app.Application
import android.content.pm.PackageManager
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.notifetch.app.data.local.CapturedNotification
import com.notifetch.app.data.local.NotificationDao
import com.notifetch.app.data.local.PlatformConfig
import com.notifetch.app.data.repository.AuthRepository
import com.notifetch.app.data.repository.dataStore
import com.notifetch.app.data.repository.NotificationRepository
import com.notifetch.app.util.Constants
import com.notifetch.app.util.Helpers
import com.notifetch.app.util.UserMode
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.debounce
import kotlinx.coroutines.flow.distinctUntilChanged
import kotlinx.coroutines.flow.flatMapLatest
import kotlinx.coroutines.flow.flow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
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
    val platformNameMap: Map<String, String> = emptyMap(),
    val userMode: UserMode = UserMode.RIDER,
    // v2.9.72 Phase 3: Smart filter state
    val timeFilter: TimeFilter = TimeFilter.ALL,
    val minOrderValue: Double? = null,
    val highValueOnly: Boolean = false
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
                platformNameMap == other.platformNameMap &&
                userMode == other.userMode &&
                timeFilter == other.timeFilter &&
                minOrderValue == other.minOrderValue &&
                highValueOnly == other.highValueOnly
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
        result = 31 * result + userMode.hashCode()
        result = 31 * result + timeFilter.hashCode()
        result = 31 * result + (minOrderValue?.hashCode() ?: 0)
        result = 31 * result + highValueOnly.hashCode()
        return result
    }
}

@HiltViewModel
@OptIn(kotlinx.coroutines.FlowPreview::class)
class HomeViewModel @Inject constructor(
    private val repository: NotificationRepository,
    private val authRepository: AuthRepository,
    private val application: Application
) : ViewModel() {

    private val _searchQuery = MutableStateFlow("")
    private val _selectedPlatform = MutableStateFlow<String?>(null)
    private val _isSyncing = MutableStateFlow(false)
    private val _isRefreshing = MutableStateFlow(false)
    private val _isListenerEnabled = MutableStateFlow(true)

    // ── v2.9.9: Auto-detect user mode based on installed apps ──────────────
    // Previously defaulted to RIDER, which meant customer notifications
    // (Swiggy, Zomato, Zepto, Blinkit, Uber Eats, etc.) were FILTERED OUT
    // unless the user manually tapped the "Customer" tab.
    //
    // Detection logic:
    //   1. Count installed PARTNER_PACKAGES (rider/driver apps)
    //   2. Count installed CUSTOMER_PACKAGES (customer apps)
    //   3. If customer_apps > rider_apps → default to CUSTOMER mode
    //   4. If rider_apps > 0 → default to RIDER mode
    //   5. Otherwise → default to CUSTOMER (most users are customers, not drivers)
    // v2.9.66: detect in background — was blocking main thread (ANR)
    private val _userMode = MutableStateFlow(com.notifetch.app.util.UserMode.CUSTOMER)

    // v2.9.72 Phase 3: Smart filtering
    private val _timeFilter = MutableStateFlow(TimeFilter.ALL)
    val timeFilter: StateFlow<TimeFilter> = _timeFilter.asStateFlow()
    private val _minOrderValue = MutableStateFlow<Double?>(null)
    val minOrderValue: StateFlow<Double?> = _minOrderValue.asStateFlow()
    private val _highValueOnly = MutableStateFlow(false)
    val highValueOnly: StateFlow<Boolean> = _highValueOnly.asStateFlow()

    init {
        viewModelScope.launch(kotlinx.coroutines.Dispatchers.IO) {
            _userMode.value = detectInitialUserMode()
        }
    }

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
        _selectedPlatform,
        _userMode,
        _timeFilter,
        _minOrderValue,
        _highValueOnly
    ) { values ->
        @Suppress("UNCHECKED_CAST")
        val notifications = values[0] as List<com.notifetch.app.data.local.CapturedNotification>
        val query = values[1] as String
        val platform = values[2] as String?
        val mode = values[3] as com.notifetch.app.util.UserMode
        val timeFilter = values[4] as TimeFilter
        val minOrderValue = values[5] as Double?
        val highValueOnly = values[6] as Boolean

        var result = notifications.filter { it.userMode == mode.name.lowercase() }

        // Platform filter
        if (platform != null) {
            result = result.filter { it.packageName == platform }
        }

        // Text search filter
        if (query.isNotBlank()) {
            result = result.filter {
                it.title.contains(query, ignoreCase = true) ||
                it.body.contains(query, ignoreCase = true) ||
                it.platform.contains(query, ignoreCase = true)
            }
        }

        // v2.9.72 Phase 3: Time range filter
        if (timeFilter != TimeFilter.ALL) {
            val now = System.currentTimeMillis()
            val cutoff = when (timeFilter) {
                TimeFilter.LAST_HOUR -> now - 3_600_000L
                TimeFilter.LAST_6_HOURS -> now - 21_600_000L
                TimeFilter.TODAY -> Helpers.startOfDayTimestamp()
                TimeFilter.THIS_WEEK -> Helpers.startOfWeekTimestamp()
                TimeFilter.ALL -> 0L
            }
            result = result.filter { it.receivedAt >= cutoff }
        }

        // v2.9.72 Phase 3: Order value filter
        if (minOrderValue != null && minOrderValue > 0) {
            result = result.filter { it.orderValue != null && it.orderValue >= minOrderValue }
        }

        // v2.9.72 Phase 3: High-value only filter
        if (highValueOnly) {
            result = result.filter {
                com.notifetch.app.util.EarningsCalculator.isHighValueOffer(it.title, it.body, it.bigText)
            }
        }

        result
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    private val unreadCountFlow = repository.getUnreadCount()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), 0)

    private val totalCountFlow = repository.getTotalCount()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), 0)

    // ── Reactive time-range flows (BUG #24 fix) ─────────────────────────────
    // Previously, timestamps were captured once at ViewModel creation. If the app
    // stayed open past midnight, "today" stats would still show yesterday's data.
    // Now, these flows automatically recalculate timestamps at midnight.
    private val dayRangeFlow = flow {
        while (true) {
            val startOfDay = Helpers.startOfDayTimestamp()
            val now = System.currentTimeMillis()
            emit(startOfDay to now)
            // Sleep until next midnight, then re-emit
            val nextMidnight = startOfDay + 86_400_000L // 24 hours
            val delayMs = (nextMidnight - now).coerceAtLeast(60_000L) // at least 1 min
            kotlinx.coroutines.delay(delayMs)
        }
    }

    private val todayCountFlow = dayRangeFlow.flatMapLatest { (start, end) ->
        repository.getCountInTimeRange(start, end)
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), 0)

    private val todayEarningsFlow = dayRangeFlow.flatMapLatest { (start, _) ->
        repository.getTotalOrderValueSince(start)
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), 0.0)

    private val weekStartFlow = flow {
        while (true) {
            val startOfWeek = Helpers.startOfWeekTimestamp()
            emit(startOfWeek)
            // Sleep until next Monday midnight
            val now = System.currentTimeMillis()
            val nextWeek = startOfWeek + 7 * 86_400_000L
            val delayMs = (nextWeek - now).coerceAtLeast(60_000L)
            kotlinx.coroutines.delay(delayMs)
        }
    }

    private val weekEarningsFlow = weekStartFlow.flatMapLatest { startOfWeek ->
        repository.getTotalOrderValueSince(startOfWeek)
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), 0.0)

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
        combine(_isSyncing, _isRefreshing, _isListenerEnabled) { isSyncing, isRefreshing, isListenerEnabled ->
            Triple(isSyncing, isRefreshing, isListenerEnabled)
        },
        combine(_searchQuery, _selectedPlatform, _userMode) { searchQuery, selectedPlatform, userMode ->
            Triple(searchQuery, selectedPlatform, userMode)
        },
        combine(_timeFilter, _minOrderValue, _highValueOnly) { timeFilter, minOrderValue, highValueOnly ->
            Triple(timeFilter, minOrderValue, highValueOnly)
        }
    ) { (isSyncing, isRefreshing, isListenerEnabled), (searchQuery, selectedPlatform, userMode), (timeFilter, minOrderValue, highValueOnly) ->
        UIControlState(
            isSyncing = isSyncing,
            isRefreshing = isRefreshing,
            isListenerEnabled = isListenerEnabled,
            searchQuery = searchQuery,
            selectedPlatform = selectedPlatform,
            userMode = userMode,
            timeFilter = timeFilter,
            minOrderValue = minOrderValue,
            highValueOnly = highValueOnly
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
            selectedPlatform = uiControl.selectedPlatform,
            userMode = uiControl.userMode,
            timeFilter = uiControl.timeFilter,
            minOrderValue = uiControl.minOrderValue,
            highValueOnly = uiControl.highValueOnly
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

    // v2.9.72 Phase 3: Smart filter setters
    fun setTimeFilter(filter: TimeFilter) { _timeFilter.value = filter }
    fun setMinOrderValue(value: Double?) { _minOrderValue.value = value }
    fun setHighValueOnly(enabled: Boolean) { _highValueOnly.value = enabled }
    fun clearAllFilters() {
        _timeFilter.value = TimeFilter.ALL
        _minOrderValue.value = null
        _highValueOnly.value = false
        _selectedPlatform.value = null
        _searchQuery.value = ""
    }

    fun onUserModeChange(mode: UserMode) {
        _userMode.value = mode
        _selectedPlatform.value = null // Reset platform filter on mode switch
        // v2.9.71: Save to DataStore so EarningsViewModel can read it
        viewModelScope.launch {
            application.dataStore.edit { prefs ->
                prefs[SettingsViewModel.USER_MODE_KEY] = mode.name.lowercase()
            }
        }
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

    /**
     * Export currently filtered notifications as CSV string.
     * Includes all visible notifications based on current mode, platform filter, and search query.
     */
    fun exportNotificationsAsCsv(): String {
        val notifications = uiState.value.notifications
        val mode = uiState.value.userMode.name.lowercase()
        val sdf = SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.getDefault())

        val sb = StringBuilder()
        sb.appendLine("Date,Platform,Title,Body,Category,Order Value,Mode")
        for (n in notifications) {
            val date = sdf.format(Date(n.receivedAt))
            val title = n.title.replace("\"", "\"\"")
            val body = n.body.replace("\"", "\"\"")
            val category = n.category ?: ""
            val orderValue = n.orderValue?.let { String.format("%.2f", it) } ?: ""
            sb.appendLine("\"$date\",\"${n.platform}\",\"$title\",\"$body\",\"$category\",\"$orderValue\",\"$mode\"")
        }
        return sb.toString()
    }

    /**
     * v2.9.9: Auto-detect the best initial user mode based on which apps are
     * installed on the device.
     *
     * Why this matters: the previous default of RIDER meant that customer
     * notifications (Swiggy offers, Zomato order updates, Zepto/Blinkit
     * deliveries, Uber Eats promos) were filtered out and invisible to
     * the user — they had to manually tap the "Customer" tab to see them.
     *
     * Most NotiFetch users are CUSTOMERS, not delivery drivers. So when
     * in doubt, default to CUSTOMER mode.
     */
    private fun detectInitialUserMode(): UserMode {
        return try {
            val pm = application.packageManager
            var partnerCount = 0
            var customerCount = 0

            // Count installed partner (rider/driver) apps
            for (pkgName in Constants.PARTNER_PACKAGES.keys) {
                try {
                    pm.getPackageInfo(pkgName, 0)
                    partnerCount++
                } catch (_: PackageManager.NameNotFoundException) {
                    // Not installed — skip
                }
            }

            // Count installed customer apps
            for (pkgName in Constants.CUSTOMER_PACKAGES.keys) {
                try {
                    pm.getPackageInfo(pkgName, 0)
                    customerCount++
                } catch (_: PackageManager.NameNotFoundException) {
                    // Not installed — skip
                }
            }

            // Decision matrix:
            //   - If user has more customer apps than partner apps → CUSTOMER
            //   - If user has only partner apps → RIDER
            //   - If user has neither (fresh install) → CUSTOMER (safest default
            //     because most users will install customer apps)
            //   - Tie → CUSTOMER
            when {
                customerCount > partnerCount -> UserMode.CUSTOMER
                partnerCount > customerCount && customerCount == 0 -> UserMode.RIDER
                else -> UserMode.CUSTOMER
            }
        } catch (_: Exception) {
            // If anything fails, default to CUSTOMER (safe choice for most users)
            UserMode.CUSTOMER
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
    val selectedPlatform: String?,
    val userMode: UserMode,
    val timeFilter: TimeFilter = TimeFilter.ALL,
    val minOrderValue: Double? = null,
    val highValueOnly: Boolean = false
)


// v2.9.72 Phase 3: Time filter options for smart filtering
enum class TimeFilter(val label: String) {
    ALL("All Time"),
    LAST_HOUR("Last Hour"),
    LAST_6_HOURS("Last 6 Hours"),
    TODAY("Today"),
    THIS_WEEK("This Week")
}
