package com.notifetch.app.data.remote

import com.squareup.moshi.Json
import com.squareup.moshi.JsonClass

@JsonClass(generateAdapter = true)
data class NotificationPayload(
    @Json(name = "source") val source: String,
    @Json(name = "platform") val platform: String,
    @Json(name = "title") val title: String,
    @Json(name = "body") val body: String,
    @Json(name = "orderValue") val orderValue: Double?,
    @Json(name = "pickupLocation") val pickupLocation: String?,
    @Json(name = "dropoffLocation") val dropoffLocation: String?,
    @Json(name = "distance") val distance: String?,
    @Json(name = "receivedAt") val receivedAt: String,
    @Json(name = "packageName") val packageName: String
)

@JsonClass(generateAdapter = true)
data class BatchNotificationPayload(
    @Json(name = "notifications") val notifications: List<NotificationPayload>,
    @Json(name = "deviceId") val deviceId: String?
)

@JsonClass(generateAdapter = true)
data class ApiResponse(
    @Json(name = "success") val success: Boolean,
    @Json(name = "message") val message: String?,
    @Json(name = "id") val id: String?
)

@JsonClass(generateAdapter = true)
data class AuthPayload(
    @Json(name = "token") val token: String,
    @Json(name = "provider") val provider: String
)

@JsonClass(generateAdapter = true)
data class AuthResponse(
    @Json(name = "success") val success: Boolean,
    @Json(name = "customToken") val customToken: String?,
    @Json(name = "uid") val uid: String?,
    @Json(name = "message") val message: String?
)

@JsonClass(generateAdapter = true)
data class FcmTokenPayload(
    @Json(name = "token") val token: String,
    @Json(name = "deviceId") val deviceId: String?
)
