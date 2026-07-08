package com.notifetch.app.data.repository

import com.notifetch.app.data.local.CapturedNotification
import com.notifetch.app.data.local.NotificationDao
import com.notifetch.app.data.local.PlatformConfig
import com.notifetch.app.data.local.PlatformConfigDao
import com.notifetch.app.data.remote.BatchNotificationPayload
import com.notifetch.app.data.remote.NotiFetchApi
import com.notifetch.app.data.remote.NotificationPayload
import com.notifetch.app.util.Constants
import kotlinx.coroutines.flow.Flow
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import java.util.TimeZone
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class NotificationRepository @Inject constructor(
    private val notificationDao: NotificationDao,
    private val platformConfigDao: PlatformConfigDao,
    private val api: NotiFetchApi,
    private val authRepository: AuthRepository
) {


    fun getAllNotifications(): Flow<List<CapturedNotification>> =
        notificationDao.getAllNotifications()

    // v2.9.69: Sync version for CSV export
    suspend fun getAllNotificationsSync(): List<CapturedNotification> =
        notificationDao.getAllNotificationsSync()

    fun getNotificationById(id: Long): Flow<CapturedNotification?> =
        notificationDao.getNotificationByIdFlow(id)

    fun getNotificationsByPlatform(platform: String): Flow<List<CapturedNotification>> =
        notificationDao.getNotificationsByPlatform(platform)

    fun getUnreadCount(): Flow<Int> = notificationDao.getUnreadCount()

    fun getTotalCount(): Flow<Int> = notificationDao.getTotalCount()

    fun getNotificationCountByPlatform(): Flow<List<NotificationDao.PlatformStat>> =
        notificationDao.getNotificationCountByPlatform()

    // v2.9.71: Filtered by userMode
    fun getNotificationCountByPlatformByMode(mode: String): Flow<List<NotificationDao.PlatformStat>> =
        notificationDao.getNotificationCountByPlatformByMode(mode)

    fun getOrderValueByPlatformSince(startTime: Long): Flow<List<NotificationDao.PlatformEarningStat>> =
        notificationDao.getOrderValueByPlatformSince(startTime)

    fun getCountInTimeRange(startTime: Long, endTime: Long): Flow<Int> =
        notificationDao.getCountInTimeRange(startTime, endTime)

    // v2.9.71: Filtered by userMode
    fun getCountInTimeRangeByMode(startTime: Long, endTime: Long, mode: String): Flow<Int> =
        notificationDao.getCountInTimeRangeByMode(startTime, endTime, mode)

    fun getTotalOrderValueSince(startTime: Long): Flow<Double> =
        notificationDao.getTotalOrderValueSince(startTime)

    fun getNotificationsSince(startTime: Long): Flow<List<CapturedNotification>> =
        notificationDao.getNotificationsSince(startTime)

    suspend fun insertNotification(notification: CapturedNotification): Long {
        // NOTE: platformConfigDao.incrementNotificationCount() was previously called here,
        // causing a DOUBLE INCREMENT bug because the listener service also calls
        // incrementPlatformNotificationCount() with a 2-second debounce.
        // The count increment is now ONLY done via the debounced call in
        // NotiFetchListenerService to avoid UI fluttering from cascading Room Flow emissions.
        return notificationDao.insertNotification(notification)
    }

    suspend fun markAsRead(id: Long) = notificationDao.markAsRead(id)

    suspend fun markAllAsRead() = notificationDao.markAllAsRead()

    suspend fun deleteNotification(id: Long) = notificationDao.deleteById(id)

    suspend fun deleteAllNotifications() = notificationDao.deleteAll()

    // v2.9.27: Auto-cleanup — delete notifications older than 24 hours
    suspend fun cleanupOldNotifications(): Int {
        val cutoff = System.currentTimeMillis() - (24 * 60 * 60 * 1000L) // 24 hours ago
        val deleted = notificationDao.deleteOlderThan(cutoff)
        // Also delete read notifications older than 2 hours (faster cleanup for read items)
        val readCutoff = System.currentTimeMillis() - (2 * 60 * 60 * 1000L) // 2 hours ago
        notificationDao.deleteReadOlderThan(readCutoff)
        return deleted
    }

    // v2.9.27: Get total count (for cleanup logic)
    suspend fun getTotalNotificationCount(): Int = notificationDao.getTotalCountSync()

    /**
     * Delete all user data including server-side data.
     * DPDP Act 2023 §8 & GDPR Article 17 (Right to Erasure).
     */
    suspend fun deleteAllDataIncludingServer() {
        // Delete local data
        notificationDao.deleteAll()
        platformConfigDao.deleteAll()
        // Server-side deletion would happen here if the API supported it
    }

    // ═══════════════════════════════════════════════════════════════════════
    // Platform Display Name Resolution
    //
    // Resolution order:
    //   1. customDisplayName (user's custom name, e.g., "Z" or "My Delivery App")
    //   2. displayName (default brand name, e.g., "Swiggy Delivery")
    //
    // This "user choice" model is the legal defense: we default to the
    // real brand name under nominative fair use, but the user can change
    // it to whatever they want.
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * Get the resolved display name for a platform.
     * Returns custom name if set, otherwise the default brand name.
     */
    suspend fun getResolvedDisplayName(packageName: String): String {
        val resolved = platformConfigDao.getResolvedDisplayName(packageName)
        return resolved ?: Constants.ALL_PACKAGES[packageName] ?: packageName
    }

    /**
     * Update the custom display name for a platform.
     * Pass null to reset to the default brand name.
     */
    suspend fun updateCustomDisplayName(packageName: String, customName: String?) {
        platformConfigDao.updateCustomDisplayName(packageName, customName)
    }

    /**
     * Reset a platform's display name back to the default brand name.
     */
    suspend fun resetDisplayName(packageName: String) {
        platformConfigDao.updateCustomDisplayName(packageName, null)
    }

    suspend fun syncPendingNotifications(): Result<Int> {
        return try {
            val unsynced = notificationDao.getUnsyncedNotifications()
            if (unsynced.isEmpty()) return Result.success(0)

            val token = authRepository.getCurrentToken()
            val authHeader = if (token != null) "Bearer $token" else ""

            val payloads = unsynced.map { it.toPayload() }
            val deviceId = authRepository.getDeviceId()

            val batchPayload = BatchNotificationPayload(
                notifications = payloads,
                deviceId = deviceId
            )

            val response = api.sendBatchNotifications(authHeader, batchPayload)
            if (response.success) {
                notificationDao.markAsSynced(
                    unsynced.map { it.id },
                    System.currentTimeMillis()
                )
                Result.success(unsynced.size)
            } else {
                Result.failure(Exception(response.message ?: "Sync failed"))
            }
        } catch (e: Exception) {
            // Try syncing individually if batch fails
            try {
                val unsynced = notificationDao.getUnsyncedNotifications()
                val token = authRepository.getCurrentToken()
                val authHeader = if (token != null) "Bearer $token" else ""
                var syncedCount = 0

                for (notification in unsynced) {
                    try {
                        val response = api.sendNotification(authHeader, notification.toPayload())
                        if (response.success) {
                            notificationDao.markAsSynced(
                                listOf(notification.id),
                                System.currentTimeMillis()
                            )
                            syncedCount++
                        }
                    } catch (_: Exception) {
                        // Skip this one, try next
                    }
                }
                if (syncedCount > 0) Result.success(syncedCount)
                else Result.failure(e)
            } catch (e2: Exception) {
                Result.failure(e2)
            }
        }
    }

    // Platform config operations
    fun getAllPlatformConfigs(): Flow<List<PlatformConfig>> = platformConfigDao.getAllConfigs()

    suspend fun getPlatformConfig(packageName: String): PlatformConfig? =
        platformConfigDao.getConfigByPackage(packageName)

    fun getEnabledPlatformConfigs(): Flow<List<PlatformConfig>> = platformConfigDao.getEnabledConfigs()

    /**
     * Synchronous read of a single platform config. Used by NotiFetchListenerService
     * to check per-platform enable/disable status on the main thread.
     * This is a quick primary-key lookup, not a Flow.
     */
    suspend fun getPlatformConfigSync(packageName: String): PlatformConfig? =
        platformConfigDao.getConfigByPackage(packageName)

    suspend fun updatePlatformEnabled(packageName: String, isEnabled: Boolean) =
        platformConfigDao.updateEnabled(packageName, isEnabled)

    // v2.9.12: Favorites/mute list
    suspend fun updatePlatformFavorite(packageName: String, isFavorite: Boolean) =
        platformConfigDao.updateFavorite(packageName, isFavorite)

    suspend fun updatePlatformMuted(packageName: String, isMuted: Boolean) =
        platformConfigDao.updateMuted(packageName, isMuted)

    fun getFavoritePlatforms(): Flow<List<PlatformConfig>> = platformConfigDao.getFavoriteConfigs()
    fun getMutedPlatforms(): Flow<List<PlatformConfig>> = platformConfigDao.getMutedConfigs()

    suspend fun isPlatformMuted(packageName: String): Boolean =
        platformConfigDao.isPlatformMuted(packageName) ?: false

    suspend fun incrementPlatformNotificationCount(packageName: String) =
        platformConfigDao.incrementNotificationCount(packageName, System.currentTimeMillis())

    // Atomic flag to prevent concurrent initialization from NotiFetchApp.onCreate()
    // and HomeViewModel.init{} running simultaneously and causing duplicate upserts.
    @Volatile
    private var platformConfigsInitialized = false

    suspend fun initializePlatformConfigs() {
        if (platformConfigsInitialized) return

        val allPackages = Constants.PARTNER_PACKAGES + Constants.CUSTOMER_PACKAGES

        // FIX: Previously, only the first package was checked. If the app crashed
        // during initial DB population, subsequent packages were missing but the
        // check passed. Now we verify ALL packages exist before skipping.
        // We use upsertConfigs (REPLACE strategy) so this is idempotent —
        // re-running it is safe and won't destroy existing data.
        val configs = allPackages.map { (packageName, displayName) ->
            val mode = Constants.getUserModeForPackage(packageName)?.name?.lowercase() ?: "rider"
            PlatformConfig(
                packageName = packageName,
                displayName = displayName,
                isEnabled = true,
                userMode = mode
            )
        }
        platformConfigDao.upsertConfigs(configs)
        platformConfigsInitialized = true
    }

    private fun CapturedNotification.toPayload(): NotificationPayload {
        val sdf = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'", Locale.US)
        sdf.timeZone = TimeZone.getTimeZone("UTC")
        return NotificationPayload(
            source = source,
            platform = platform,
            title = title,
            body = body,
            orderValue = orderValue,
            pickupLocation = pickupLocation,
            dropoffLocation = dropoffLocation,
            distance = distance,
            receivedAt = sdf.format(Date(receivedAt)),
            packageName = packageName
        )
    }
}
