package com.notifetch.app.ui.viewmodel

import android.app.Application
import android.util.Log
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.google.firebase.auth.FirebaseAuth
import com.notifetch.app.BuildConfig
import com.notifetch.app.data.remote.CreateOrderPayload
import com.notifetch.app.data.remote.VerifyPaymentPayload
import com.notifetch.app.data.repository.AuthRepository
import com.notifetch.app.data.repository.NotificationRepository
import com.notifetch.app.util.Constants
import com.notifetch.app.util.Helpers
import com.razorpay.Checkout
import com.razorpay.PaymentData
import com.razorpay.PaymentResultWithDataListener
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import org.json.JSONObject
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
    val platformBreakdown: List<PlatformEarning> = emptyList(),
    val subscriptionTier: String = "free",
    val isPremium: Boolean = false,
    val isPaymentProcessing: Boolean = false,
    val paymentError: String? = null,
    val paymentSuccess: Boolean = false
)

/**
 * ViewModel for the Earnings screen.
 *
 * IMPORTANT: This ViewModel uses AndroidViewModel (not ViewModel) to access
 * Application context for Razorpay Checkout. We do NOT hold any Activity
 * references — the Activity reference is only passed through to
 * Checkout.open() and never stored, preventing memory leaks.
 *
 * Production Razorpay Payment Flow:
 * 1. User taps upgrade → launchPayment() is called with Activity
 * 2. Backend creates a Razorpay order via /api/payments/create-order
 * 3. Order ID is passed to Razorpay Checkout → user completes payment
 * 4. PaymentResultWithDataListener callback fires in MainActivity
 * 5. MainActivity calls handlePaymentSuccess() or handlePaymentError()
 * 6. ViewModel verifies the payment signature via /api/payments/verify
 * 7. On successful verification, subscription tier is upgraded
 */
@HiltViewModel
class EarningsViewModel @Inject constructor(
    application: Application,
    private val repository: NotificationRepository,
    private val authRepository: AuthRepository
) : AndroidViewModel(application) {

    private val _subscriptionTier = MutableStateFlow("free")
    private val _isPaymentProcessing = MutableStateFlow(false)
    private val _paymentError = MutableStateFlow<String?>(null)
    private val _paymentSuccess = MutableStateFlow(false)

    // Track the last initiated tier and period for payment callback
    private var pendingTier: String = "pro"
    private var pendingPeriod: String = "monthly"

    // Store the Razorpay order_id from create-order for verification later
    private var pendingOrderId: String? = null

    // Room flows — following HomeViewModel pattern with stateIn for deduplication
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

    // Step 1: Combine earnings data flows
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

    // Step 2: Combine order count flows
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

    // Step 3: Combine platform breakdown flows
    private val platformState = combine(
        platformCountFlow,
        platformEarningsFlow
    ) { counts, earnings ->
        val earningsMap = earnings.associate { it.platform to it.totalValue }
        val countsMap = counts.associate { it.platform to it.count }

        // Merge: use all platforms that appear in either counts or earnings
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

    // Step 4: Final combine into EarningsUiState
    val uiState: StateFlow<EarningsUiState> = combine(
        earningsState,
        ordersState,
        platformState,
        _subscriptionTier,
        _isPaymentProcessing,
        _paymentError,
        _paymentSuccess
    ) { earnings, orders, platforms, tier, processing, error, success ->
        EarningsUiState(
            todayEarnings = earnings.todayEarnings,
            weekEarnings = earnings.weekEarnings,
            monthEarnings = earnings.monthEarnings,
            todayOrders = orders.todayOrders,
            weekOrders = orders.weekOrders,
            monthOrders = orders.monthOrders,
            platformBreakdown = platforms,
            subscriptionTier = tier,
            isPremium = tier == "pro" || tier == "premium",
            isPaymentProcessing = processing,
            paymentError = error,
            paymentSuccess = success
        )
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), EarningsUiState())

    /**
     * Launch Razorpay payment checkout.
     *
     * PRODUCTION FLOW:
     * 1. Call backend /api/payments/create-order to get a Razorpay order_id
     * 2. Open Razorpay Checkout with the order_id
     * 3. User completes payment
     * 4. handlePaymentSuccess() verifies with backend /api/payments/verify
     *
     * The Activity is passed ONLY to Checkout.open() and is NEVER stored
     * as a field — this prevents Activity memory leaks.
     */
    fun launchPayment(activity: android.app.Activity, tier: String) {
        pendingTier = tier.lowercase()
        pendingPeriod = "monthly"
        _isPaymentProcessing.value = true
        _paymentError.value = null
        _paymentSuccess.value = false

        viewModelScope.launch {
            try {
                // ── Step 1: Create order on backend ───────────────────────────
                val token = authRepository.getCurrentToken()
                if (token.isNullOrBlank()) {
                    _isPaymentProcessing.value = false
                    _paymentError.value = "Please sign in to upgrade your plan"
                    return@launch
                }

                val authHeader = "Bearer $token"
                val orderPayload = CreateOrderPayload(
                    plan = pendingTier,
                    period = pendingPeriod
                )

                val orderResponse = repository.getApi().createOrder(authHeader, orderPayload)

                if (!orderResponse.error.isNullOrEmpty()) {
                    _isPaymentProcessing.value = false
                    _paymentError.value = orderResponse.error
                    Log.e("EarningsViewModel", "Create order error: ${orderResponse.error}")
                    return@launch
                }

                // Store the order_id for verification after payment
                pendingOrderId = orderResponse.orderId
                Log.d("EarningsViewModel", "Order created: ${orderResponse.orderId}, amount: ${orderResponse.amount}")

                // ── Step 2: Open Razorpay Checkout with server-side order_id ──
                val checkout = Checkout()
                checkout.setKeyID(orderResponse.key ?: BuildConfig.RAZORPAY_KEY)

                val options = JSONObject().apply {
                    // CRITICAL: Pass the order_id from the server.
                    // Without this, Razorpay will reject the payment in live mode.
                    put("order_id", orderResponse.orderId)
                    put("name", "NotiFetch")
                    put("description", "NotiFetch ${pendingTier.replaceFirstChar { it.uppercase() }} Plan")
                    put("currency", orderResponse.currency)
                    put("amount", orderResponse.amount)
                    put("prefill", JSONObject().apply {
                        val email = FirebaseAuth.getInstance().currentUser?.email
                        if (email != null) {
                            put("email", email)
                        }
                        val phone = FirebaseAuth.getInstance().currentUser?.phoneNumber
                        if (phone != null) {
                            put("contact", phone)
                        }
                    })
                    put("theme", JSONObject().apply {
                        put("color", "#FF8F00")  // NotiFetch brand amber
                    })
                    put("notes", JSONObject().apply {
                        put("subscription_tier", pendingTier)
                        put("user_id", FirebaseAuth.getInstance().currentUser?.uid ?: "")
                    })
                }

                checkout.open(activity, options)

            } catch (e: Exception) {
                _isPaymentProcessing.value = false
                _paymentError.value = "Failed to create order: ${e.message}"
                Log.e("EarningsViewModel", "Error creating Razorpay order", e)
            }
        }
    }

    /**
     * Handle successful Razorpay payment.
     * Called by MainActivity's PaymentResultWithDataListener callback.
     *
     * Verifies the payment signature with the backend, then upgrades the subscription.
     */
    fun handlePaymentSuccess(paymentData: PaymentData) {
        viewModelScope.launch {
            val paymentId = paymentData.paymentId
            val orderId = paymentData.orderId ?: pendingOrderId
            val signature = paymentData.signature

            Log.d("EarningsViewModel", "Payment success: paymentId=$paymentId, orderId=$orderId")

            if (paymentId == null || orderId == null || signature == null) {
                _isPaymentProcessing.value = false
                _paymentError.value = "Payment data incomplete — please contact support"
                Log.e("EarningsViewModel", "Missing payment data: paymentId=$paymentId, orderId=$orderId, signature=$signature")
                return@launch
            }

            try {
                // ── Verify payment with backend ──────────────────────────────
                val token = authRepository.getCurrentToken()
                if (token.isNullOrBlank()) {
                    _isPaymentProcessing.value = false
                    _paymentError.value = "Authentication expired — please sign in again"
                    return@launch
                }

                val authHeader = "Bearer $token"
                val verifyPayload = VerifyPaymentPayload(
                    razorpayOrderId = orderId,
                    razorpayPaymentId = paymentId,
                    razorpaySignature = signature,
                    plan = pendingTier,
                    period = pendingPeriod
                )

                val verifyResponse = repository.getApi().verifyPayment(authHeader, verifyPayload)

                _isPaymentProcessing.value = false

                if (verifyResponse.success) {
                    // Payment verified — upgrade subscription
                    _subscriptionTier.value = pendingTier
                    _paymentSuccess.value = true
                    pendingOrderId = null
                    Log.d("EarningsViewModel", "Payment verified! Subscription upgraded to: $pendingTier")
                } else {
                    _paymentError.value = verifyResponse.error ?: "Payment verification failed"
                    Log.e("EarningsViewModel", "Payment verification failed: ${verifyResponse.error}")
                }

            } catch (e: Exception) {
                _isPaymentProcessing.value = false
                _paymentError.value = "Verification failed: ${e.message}"
                Log.e("EarningsViewModel", "Error verifying payment", e)
            }
        }
    }

    /**
     * Handle failed Razorpay payment.
     * Called by MainActivity's PaymentResultWithDataListener callback.
     */
    fun handlePaymentError(code: Int, paymentData: PaymentData?) {
        _isPaymentProcessing.value = false
        pendingOrderId = null

        val errorMsg = when (code) {
            Checkout.NETWORK_ERROR -> "Network error — please check your connection"
            Checkout.INVALID_OPTIONS -> "Payment configuration error"
            Checkout.PAYMENT_CANCELED -> "Payment cancelled"
            else -> "Payment failed (code: $code)"
        }

        _paymentError.value = errorMsg
        Log.e("EarningsViewModel", "Payment error: code=$code, msg=${paymentData?.data}")
    }

    /**
     * Clear payment error/success state.
     */
    fun clearPaymentState() {
        _paymentError.value = null
        _paymentSuccess.value = false
    }
}

// Intermediate state holders for nested combine
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
