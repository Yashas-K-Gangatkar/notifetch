package com.notifetch.app.ui.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.notifetch.app.data.repository.NotificationRepository
import com.notifetch.app.util.Constants
import com.notifetch.app.util.Helpers
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.debounce
import kotlinx.coroutines.flow.distinctUntilChanged
import kotlinx.coroutines.flow.flatMapLatest
import kotlinx.coroutines.flow.flow
import kotlinx.coroutines.flow.stateIn
import javax.inject.Inject

data class PlatformEarning(
    val platform: String,
    val earnings: Double,
    val count: Int,
    val color: String
)

data class EarningsUiState(
    val todayEarnings: Double = 0.0,
    val weekEarnings: Double = 0.0,
    val monthEarnings: Double = 0.0,
    val todayOrders: Int = 0,
    val weekOrders: Int = 0,
    val monthOrders: Int = 0,
    val platformBreakdown: List<PlatformEarning> = emptyList()
)

@HiltViewModel
class EarningsViewModel @Inject constructor(
    application: Application,
    private val repository: NotificationRepository
) : AndroidViewModel(application) {

<<<<<<< HEAD
    // ── Reactive time-range flows (fix: timestamps were frozen at construction) ──
    // Previously, Helpers.startOfDayTimestamp() etc. were called once in the constructor.
    // If the user left the app open overnight, "today" stats would still show yesterday's
    // data until they restarted the app. Now, timestamps auto-recalculate at midnight.

    private val dayRangeFlow = flow {
        while (true) {
            val startOfDay = Helpers.startOfDayTimestamp()
            val now = System.currentTimeMillis()
            emit(startOfDay to now)
            val nextMidnight = startOfDay + 86_400_000L
            val delayMs = (nextMidnight - now).coerceAtLeast(60_000L)
=======
    // Reactive time-range flows — auto-recalculate at midnight
    private val dayRangeFlow = flow {
        while (true) {
            val startOfDay = Helpers.startOfDayTimestamp()
            val now = System.currentTimeMillis()
            emit(startOfDay to now)
            val nextMidnight = startOfDay + 86_400_000L
            val delayMs = (nextMidnight - now).coerceAtLeast(60_000L)
            kotlinx.coroutines.delay(delayMs)
        }
    }

    private val weekStartFlow = flow {
        while (true) {
            val startOfWeek = Helpers.startOfWeekTimestamp()
            emit(startOfWeek)
            val now = System.currentTimeMillis()
            val nextWeek = startOfWeek + 7 * 86_400_000L
            val delayMs = (nextWeek - now).coerceAtLeast(60_000L)
>>>>>>> e57fe8a (fix: v2.9.1 — Open App button with multi-strategy launch, notification diagnostics, remove all payment code)
            kotlinx.coroutines.delay(delayMs)
        }
    }

<<<<<<< HEAD
    private val weekStartFlow = flow {
        while (true) {
            val startOfWeek = Helpers.startOfWeekTimestamp()
            emit(startOfWeek)
            val now = System.currentTimeMillis()
            val nextWeek = startOfWeek + 7 * 86_400_000L
            val delayMs = (nextWeek - now).coerceAtLeast(60_000L)
            kotlinx.coroutines.delay(delayMs)
        }
    }

    private val monthStartFlow = flow {
        while (true) {
            val startOfMonth = Helpers.startOfMonthTimestamp()
            emit(startOfMonth)
            val now = System.currentTimeMillis()
            // Approximate — recalculate at least every 24h
            val delayMs = 86_400_000L.coerceAtLeast(60_000L)
            kotlinx.coroutines.delay(delayMs)
        }
    }

    private val todayEarningsFlow = dayRangeFlow.flatMapLatest { (start, _) ->
        repository.getTotalOrderValueSince(start)
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), 0.0)

    private val weekEarningsFlow = weekStartFlow.flatMapLatest { startOfWeek ->
        repository.getTotalOrderValueSince(startOfWeek)
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), 0.0)

    private val monthEarningsFlow = monthStartFlow.flatMapLatest { startOfMonth ->
        repository.getTotalOrderValueSince(startOfMonth)
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), 0.0)

    private val todayOrdersFlow = dayRangeFlow.flatMapLatest { (start, end) ->
        repository.getCountInTimeRange(start, end)
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), 0)

    private val weekOrdersFlow = weekStartFlow.flatMapLatest { startOfWeek ->
        repository.getCountInTimeRange(startOfWeek, System.currentTimeMillis())
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), 0)

=======
    private val monthStartFlow = flow {
        while (true) {
            val startOfMonth = Helpers.startOfMonthTimestamp()
            emit(startOfMonth)
            kotlinx.coroutines.delay(86_400_000L.coerceAtLeast(60_000L))
        }
    }

    private val todayEarningsFlow = dayRangeFlow.flatMapLatest { (start, _) ->
        repository.getTotalOrderValueSince(start)
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), 0.0)

    private val weekEarningsFlow = weekStartFlow.flatMapLatest { startOfWeek ->
        repository.getTotalOrderValueSince(startOfWeek)
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), 0.0)

    private val monthEarningsFlow = monthStartFlow.flatMapLatest { startOfMonth ->
        repository.getTotalOrderValueSince(startOfMonth)
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), 0.0)

    private val todayOrdersFlow = dayRangeFlow.flatMapLatest { (start, end) ->
        repository.getCountInTimeRange(start, end)
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), 0)

    private val weekOrdersFlow = weekStartFlow.flatMapLatest { startOfWeek ->
        repository.getCountInTimeRange(startOfWeek, System.currentTimeMillis())
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), 0)

>>>>>>> e57fe8a (fix: v2.9.1 — Open App button with multi-strategy launch, notification diagnostics, remove all payment code)
    private val monthOrdersFlow = monthStartFlow.flatMapLatest { startOfMonth ->
        repository.getCountInTimeRange(startOfMonth, System.currentTimeMillis())
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), 0)

    private val platformCountFlow = repository.getNotificationCountByPlatform()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    private val platformEarningsFlow = monthStartFlow.flatMapLatest { startOfMonth ->
        repository.getOrderValueByPlatformSince(startOfMonth)
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    private val earningsState = combine(
        todayEarningsFlow,
        weekEarningsFlow,
        monthEarningsFlow
    ) { today, week, month ->
        EarningsDataState(today, week, month)
    }

    private val ordersState = combine(
        todayOrdersFlow,
        weekOrdersFlow,
        monthOrdersFlow
    ) { today, week, month ->
        OrdersDataState(today, week, month)
    }

    private val platformState = combine(
        platformCountFlow,
        platformEarningsFlow
    ) { counts, earnings ->
        val earningsMap = earnings.associate { it.platform to it.totalValue }
        val countsMap = counts.associate { it.platform to it.count }
<<<<<<< HEAD

        val allPlatforms = (countsMap.keys + earningsMap.keys).distinct()

        allPlatforms.map { platform ->
            // FIX: Look up color from ALL_PACKAGES (both rider + customer), not just PARTNER_PACKAGES.
            // Previously, only PARTNER_PACKAGES was queried, so customer platforms like
            // Swiggy Customer, Zomato Customer, Amazon Shopping etc. would fall through to the
            // default amber color, making the breakdown visually indistinguishable.
=======
        val allPlatforms = (countsMap.keys + earningsMap.keys).distinct()

        allPlatforms.map { platform ->
            // Look up color from ALL_PACKAGES (both rider + customer)
>>>>>>> e57fe8a (fix: v2.9.1 — Open App button with multi-strategy launch, notification diagnostics, remove all payment code)
            val pkg = Constants.ALL_PACKAGES.entries
                .firstOrNull { it.value == platform }?.key
            val hexColor = pkg?.let { Constants.ALL_PLATFORM_COLORS[it] } ?: "#FFC107"

            PlatformEarning(
                platform = platform,
                earnings = earningsMap[platform] ?: 0.0,
                count = countsMap[platform] ?: 0,
                color = hexColor
            )
        }.sortedByDescending { it.earnings }
    }

    val uiState: StateFlow<EarningsUiState> = combine(
        earningsState,
        ordersState,
        platformState
    ) { earnings, orders, platforms ->
        EarningsUiState(
            todayEarnings = earnings.todayEarnings,
            weekEarnings = earnings.weekEarnings,
            monthEarnings = earnings.monthEarnings,
            todayOrders = orders.todayOrders,
            weekOrders = orders.weekOrders,
            monthOrders = orders.monthOrders,
            platformBreakdown = platforms
        )
    }
        .debounce(200)
        .distinctUntilChanged()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), EarningsUiState())
}

private data class EarningsDataState(
    val todayEarnings: Double,
    val weekEarnings: Double,
    val monthEarnings: Double
)

private data class OrdersDataState(
    val todayOrders: Int,
    val weekOrders: Int,
    val monthOrders: Int
)
