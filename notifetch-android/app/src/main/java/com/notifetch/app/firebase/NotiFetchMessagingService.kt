package com.notifetch.app.firebase

import android.util.Log
import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage

class NotiFetchMessagingService : FirebaseMessagingService() {

    private val tag = "NotiFetchFCM"

    override fun onNewToken(token: String) {
        super.onNewToken(token)
        Log.d(tag, "FCM token refreshed: ${token.take(20)}...")
        // Send the new token to the NotiFetch backend
        // This will be handled by the repository when the user is signed in
    }

    override fun onMessageReceived(remoteMessage: RemoteMessage) {
        super.onMessageReceived(remoteMessage)
        Log.d(tag, "FCM message received from: ${remoteMessage.from}")

        // Handle data payload
        if (remoteMessage.data.isNotEmpty()) {
            Log.d(tag, "Message data payload: ${remoteMessage.data}")
            // Process data messages (e.g., sync trigger, config update)
            val action = remoteMessage.data["action"]
            when (action) {
                "sync" -> {
                    // Trigger sync of pending notifications
                    Log.d(tag, "Sync triggered via FCM")
                }
                "config_update" -> {
                    // Update platform configurations
                    Log.d(tag, "Config update triggered via FCM")
                }
            }
        }

        // Handle notification payload
        remoteMessage.notification?.let {
            Log.d(tag, "Message notification: title=${it.title}, body=${it.body}")
        }
    }
}
