package com.notifetch.app.ui.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.notifetch.app.data.repository.NotificationRepository
import com.notifetch.app.util.Constants
import com.notifetch.app.util.Helpers
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
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

    // Room flows
    private val todayEarningsFlow = repository.getTotalOrderValueSince(
        Helpers.startOfDayTimestamp()
    ).stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), 0.0)

    private val weekEarningsFlow = repository.getTotalOrderValueSince(
        Helpers.startOfWeekTimestamp()
    ).stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), 0.0)

    private val monthEarningsFlow = repository.getTotalOrderValueSince(
        Helpers.startOfMonthTimestamp()
    ).stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), 0.0)

    private val todayOrdersFlow = repository.getCountInTimeRange(
        Helpers.startOfDayTimestamp(), System.currentTimeMillis()
    ).stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), 0)

    private val weekOrdersFlow = repository.getCountInTimeRange(
        Helpers.startOfWeekTimestamp(), System.currentTimeMillis()
    ).stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), 0)

    private val monthOrdersFlow = repository.getCountInTimeRange(
        Helpers.startOfMonthTimestamp(), System.currentTimeMillis()
    ).stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), 0)

    private val platformCountFlow = repository.getNotificationCountByPlatform()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    private val platformEarningsFlow = repository.getOrderValueByPlatformSince(
        Helpers.startOfMonthTimestamp()
    ).stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    private val earningsState = combine(
        todayEarningsFlow,
        weekEarningsFlow,
        monthEarningsFlow
    ) { today, week, month ->
        EarningsDataState(
            todayEarnings = today,
            weekEarnings = week,
            monthEarnings = month
        )
    }

    private val ordersState = combine(
        todayOrdersFlow,
        weekOrdersFlow,
        monthOrdersFlow
    ) { today, week, month ->
        OrdersDataState(
            todayOrders = today,
            weekOrders = week,
            monthOrders = month
        )
    }

    private val platformState = combine(
        platformCountFlow,
        platformEarningsFlow
    ) { counts, earnings ->
        val earningsMap = earnings.associate { it.platform to it.totalValue }
        val countsMap = counts.associate { it.platform to it.count }

        val allPlatforms = (countsMap.keys + earningsMap.keys).distinct()

        allPlatforms.map { platform ->
            val pkg = Constants.PARTNER_PACKAGES.entries
                .firstOrNull { it.value == platform }?.key
            val hexColor = pkg?.let { Constants.PLATFORM_COLORS[it] } ?: "#FFC107"

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
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), EarningsUiState())
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
