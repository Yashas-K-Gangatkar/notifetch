package com.notifetch.app

import android.content.Context
import android.util.Log
import com.google.gson.Gson
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.withContext
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import java.util.concurrent.TimeUnit

/**
 * HTTP client for communicating with the NotiFetch web backend API.
 *
 * Sends captured notification data to the backend at:
 * https://d2-liart-nine.vercel.app/api/notifications
 */
class ApiClient(private val context: Context) {

    companion object {
        private const val TAG = "NotiFetchApiClient"
        private const val BASE_URL = "https://d2-liart-nine.vercel.app"
        private const val NOTIFICATIONS_ENDPOINT = "$BASE_URL/api/notifications"
        private const val NOTIFICATIONS_TEST_ENDPOINT = "$BASE_URL/api/notifications/test"
        private val JSON_MEDIA_TYPE = "application/json; charset=utf-8".toMediaType()
    }

    private val gson = Gson()
    private val appContext = context.applicationContext
    private val sharedPreferences = appContext.getSharedPreferences("notifetch_prefs", Context.MODE_PRIVATE)

    private val client: OkHttpClient = OkHttpClient.Builder()
        .connectTimeout(15, TimeUnit.SECONDS)
        .readTimeout(15, TimeUnit.SECONDS)
        .writeTimeout(15, TimeUnit.SECONDS)
        .build()

    /**
     * Get the stored user ID, or generate a device-specific one.
     */
    private fun getUserId(): String {
        var userId = sharedPreferences.getString("user_id", null)
        if (userId == null) {
            // Generate a unique device ID for this installation
            userId = "device_${android.provider.Settings.Secure.getString(
                appContext.contentResolver,
                android.provider.Settings.Secure.ANDROID_ID
            )}"
            sharedPreferences.edit().putString("user_id", userId).apply()
        }
        return userId
    }

    /**
     * Set a custom user ID (e.g., after login).
     */
    fun setUserId(userId: String) {
        sharedPreferences.edit().putString("user_id", userId).apply()
    }

    /**
     * Forward a captured notification to the NotiFetch backend API.
     */
    suspend fun forwardNotification(notification: NotificationForwardRequest): NotificationForwardResponse {
        return withContext(Dispatchers.IO) {
            try {
                val userId = getUserId()
                val jsonBody = gson.toJson(notification)

                Log.d(TAG, "Forwarding notification to backend: ${notification.source} — ${notification.title}")

                val requestBody = jsonBody.toRequestBody(JSON_MEDIA_TYPE)
                val request = Request.Builder()
                    .url(NOTIFICATIONS_ENDPOINT)
                    .post(requestBody)
                    .addHeader("Content-Type", "application/json")
                    .addHeader("Authorization", "Bearer $userId")
                    .addHeader("X-Device-Id", getUserId())
                    .addHeader("X-App-Version", "2.0.0")
                    .addHeader("X-Platform", "android-native")
                    .build()

                val response = client.newCall(request).execute()
                val responseBody = response.body?.string()

                if (response.isSuccessful && responseBody != null) {
                    Log.i(TAG, "Notification forwarded successfully (${response.code})")
                    gson.fromJson(responseBody, NotificationForwardResponse::class.java)
                        ?: NotificationForwardResponse(success = true)
                } else {
                    val errorMsg = responseBody ?: "HTTP ${response.code}"
                    Log.w(TAG, "Backend returned error: $errorMsg")
                    NotificationForwardResponse(
                        success = false,
                        error = errorMsg,
                    )
                }
            } catch (e: Exception) {
                Log.e(TAG, "Network error forwarding notification", e)
                NotificationForwardResponse(
                    success = false,
                    error = e.message ?: "Unknown network error",
                )
            }
        }
    }

    /**
     * Send a test notification to the backend (for debugging).
     */
    suspend fun sendTestNotification(): NotificationForwardResponse {
        return withContext(Dispatchers.IO) {
            try {
                val testNotification = NotificationForwardRequest(
                    title = "Test Notification",
                    body = "This is a test from NotiFetch Android app",
                    source = "NotiFetch Test",
                    sourceIcon = "com.notifetch.app",
                    timestamp = System.currentTimeMillis(),
                    packageName = "com.notifetch.app",
                    category = "test",
                )

                val jsonBody = gson.toJson(testNotification)
                val requestBody = jsonBody.toRequestBody(JSON_MEDIA_TYPE)
                val request = Request.Builder()
                    .url(NOTIFICATIONS_TEST_ENDPOINT)
                    .post(requestBody)
                    .addHeader("Content-Type", "application/json")
                    .addHeader("Authorization", "Bearer ${getUserId()}")
                    .build()

                val response = client.newCall(request).execute()
                val responseBody = response.body?.string()

                NotificationForwardResponse(
                    success = response.isSuccessful,
                    error = if (!response.isSuccessful) responseBody else null,
                )
            } catch (e: Exception) {
                Log.e(TAG, "Error sending test notification", e)
                NotificationForwardResponse(
                    success = false,
                    error = e.message,
                )
            }
        }
    }

    /**
     * Check if the backend API is reachable.
     */
    suspend fun healthCheck(): Boolean {
        return withContext(Dispatchers.IO) {
            try {
                val request = Request.Builder()
                    .url("$BASE_URL/api/health")
                    .head()
                    .build()

                val response = client.newCall(request).execute()
                response.isSuccessful
            } catch (e: Exception) {
                Log.w(TAG, "Health check failed", e)
                false
            }
        }
    }

    /**
     * Retry forwarding any notifications that were saved locally but not forwarded.
     */
    suspend fun retryFailedNotifications(repository: NotificationRepository) {
        withContext(Dispatchers.IO) {
            try {
                val allNotifications = repository.allNotifications.first()
                val failedNotifications = allNotifications.filter { !it.isForwarded }

                Log.i(TAG, "Retrying ${failedNotifications.size} failed notifications")

                for (notification in failedNotifications) {
                    val request = NotificationForwardRequest(
                        title = notification.title,
                        body = notification.body,
                        source = notification.source,
                        sourceIcon = notification.packageName,
                        timestamp = notification.timestamp,
                        packageName = notification.packageName,
                        category = notification.category,
                    )

                    val response = forwardNotification(request)
                    if (response.success) {
                        repository.markAsForwarded(notification.id)
                    }
                }
            } catch (e: Exception) {
                Log.e(TAG, "Error retrying failed notifications", e)
            }
        }
    }
}
