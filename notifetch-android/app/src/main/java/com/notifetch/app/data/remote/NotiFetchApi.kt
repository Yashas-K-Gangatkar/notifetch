package com.notifetch.app.data.remote

import retrofit2.http.Body
import retrofit2.http.Header
import retrofit2.http.POST

interface NotiFetchApi {

    @POST("api/notifications")
    suspend fun sendNotification(
        @Header("Authorization") authHeader: String,
        @Body payload: NotificationPayload
    ): ApiResponse

    @POST("api/notifications/batch")
    suspend fun sendBatchNotifications(
        @Header("Authorization") authHeader: String,
        @Body payload: BatchNotificationPayload
    ): ApiResponse

    @POST("api/auth/token")
    suspend fun authenticate(
        @Body payload: AuthPayload
    ): AuthResponse
}
