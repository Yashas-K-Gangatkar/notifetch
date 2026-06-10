package com.notifetch.app.data.remote

import retrofit2.http.Body
import retrofit2.http.DELETE
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

    @POST("api/fcm/token")
    suspend fun registerFcmToken(
        @Header("Authorization") authHeader: String,
        @Body payload: FcmTokenPayload
    ): ApiResponse

    /**
     * Delete all user data from the server (DPDP Act §8 / GDPR Art. 17).
     * Best-effort: if this fails, local data is still deleted.
     */
    @DELETE("api/notifications")
    suspend fun deleteAllServerData(
        @Header("Authorization") authHeader: String
    ): ApiResponse
}
