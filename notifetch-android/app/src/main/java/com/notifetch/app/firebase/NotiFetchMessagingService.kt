package com.notifetch.app.firebase

import android.util.Log
import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage
import com.notifetch.app.data.remote.FcmTokenPayload
import com.notifetch.app.data.remote.NotiFetchApi
import com.notifetch.app.data.repository.AuthRepository
import dagger.hilt.android.AndroidEntryPoint
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.cancel
import kotlinx.coroutines.launch
import javax.inject.Inject

@AndroidEntryPoint
class NotiFetchMessagingService : FirebaseMessagingService() {

    @Inject lateinit var api: NotiFetchApi
    @Inject lateinit var authRepository: AuthRepository

    private val serviceScope = CoroutineScope(SupervisorJob() + Dispatchers.IO)
    private val tag = "NotiFetchFCM"

    override fun onNewToken(token: String) {
        super.onNewToken(token)
        Log.d(tag, "FCM token refreshed: ${token.take(20)}...")
        // Send the new token to the NotiFetch backend (BUG #10 fix)
        sendTokenToBackend(token)
    }

    override fun onMessageReceived(remoteMessage: RemoteMessage) {
        super.onMessageReceived(remoteMessage)
        Log.d(tag, "FCM message received from: ${remoteMessage.from}")

        if (remoteMessage.data.isNotEmpty()) {
            Log.d(tag, "Message data payload: ${remoteMessage.data}")
            val action = remoteMessage.data["action"]
            when (action) {
                "sync" -> Log.d(tag, "Sync triggered via FCM")
                "config_update" -> Log.d(tag, "Config update triggered via FCM")
            }
        }

        remoteMessage.notification?.let {
            Log.d(tag, "Message notification: title=${it.title}, body=${it.body}")
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        serviceScope.cancel()
    }

    private fun sendTokenToBackend(token: String) {
        serviceScope.launch {
            try {
                val authToken = authRepository.getCurrentToken()
                val authHeader = if (authToken != null) "Bearer $authToken" else ""
                val deviceId = authRepository.getDeviceId()
                val payload = FcmTokenPayload(token = token, deviceId = deviceId)
                val response = api.registerFcmToken(authHeader, payload)
                if (response.success) {
                    Log.d(tag, "FCM token registered with backend")
                } else {
                    Log.w(tag, "FCM token registration failed: ${response.message}")
                }
            } catch (e: Exception) {
                Log.e(tag, "Failed to send FCM token to backend", e)
            }
        }
    }
}
