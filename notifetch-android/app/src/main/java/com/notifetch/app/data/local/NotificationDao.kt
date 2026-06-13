package com.notifetch.app.data.local

import androidx.room.Dao
import androidx.room.Delete
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Update
import kotlinx.coroutines.flow.Flow

@Dao
interface NotificationDao {

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertNotification(notification: CapturedNotification): Long

    @Update
    suspend fun updateNotification(notification: CapturedNotification)

    @Delete
    suspend fun deleteNotification(notification: CapturedNotification)

    @Query("DELETE FROM captured_notifications WHERE id = :id")
    suspend fun deleteById(id: Long)

    @Query("DELETE FROM captured_notifications")
    suspend fun deleteAll()

    @Query("SELECT * FROM captured_notifications ORDER BY receivedAt DESC")
    fun getAllNotifications(): Flow<List<CapturedNotification>>

    @Query("SELECT * FROM captured_notifications WHERE id = :id")
    suspend fun getNotificationById(id: Long): CapturedNotification?

    @Query("SELECT * FROM captured_notifications WHERE id = :id")
    fun getNotificationByIdFlow(id: Long): Flow<CapturedNotification?>

    @Query("SELECT * FROM captured_notifications WHERE packageName = :packageName ORDER BY receivedAt DESC")
    fun getNotificationsByPackage(packageName: String): Flow<List<CapturedNotification>>

    @Query("SELECT * FROM captured_notifications WHERE platform = :platform ORDER BY receivedAt DESC")
    fun getNotificationsByPlatform(platform: String): Flow<List<CapturedNotification>>

    @Query("SELECT * FROM captured_notifications WHERE isSynced = 0")
    suspend fun getUnsyncedNotifications(): List<CapturedNotification>

    @Query("UPDATE captured_notifications SET isSynced = 1, syncedAt = :syncedAt WHERE id IN (:ids)")
    suspend fun markAsSynced(ids: List<Long>, syncedAt: Long)

    @Query("UPDATE captured_notifications SET isRead = 1 WHERE id = :id")
    suspend fun markAsRead(id: Long)

    @Query("UPDATE captured_notifications SET isRead = 1")
    suspend fun markAllAsRead()

    @Query("SELECT COUNT(*) FROM captured_notifications WHERE isRead = 0")
    fun getUnreadCount(): Flow<Int>

    @Query("SELECT COUNT(*) FROM captured_notifications")
    fun getTotalCount(): Flow<Int>

    @Query("SELECT COUNT(*) FROM captured_notifications WHERE platform = :platform")
    fun getCountByPlatform(platform: String): Flow<Int>

    @Query("SELECT COUNT(*) FROM captured_notifications WHERE receivedAt >= :startTime AND receivedAt <= :endTime")
    fun getCountInTimeRange(startTime: Long, endTime: Long): Flow<Int>

    @Query("SELECT COALESCE(SUM(orderValue), 0.0) FROM captured_notifications WHERE orderValue IS NOT NULL AND receivedAt >= :startTime")
    fun getTotalOrderValueSince(startTime: Long): Flow<Double>

    @Query("SELECT packageName, platform, COUNT(*) as count FROM captured_notifications GROUP BY packageName ORDER BY count DESC")
    fun getNotificationCountByPlatform(): Flow<List<PlatformStat>>

    @Query("SELECT packageName, platform, COALESCE(SUM(orderValue), 0.0) as totalValue FROM captured_notifications WHERE orderValue IS NOT NULL AND receivedAt >= :startTime GROUP BY packageName ORDER BY totalValue DESC")
    fun getOrderValueByPlatformSince(startTime: Long): Flow<List<PlatformEarningStat>>

    @Query("SELECT * FROM captured_notifications WHERE receivedAt >= :startTime ORDER BY receivedAt DESC")
    fun getNotificationsSince(startTime: Long): Flow<List<CapturedNotification>>

    @Query("SELECT * FROM captured_notifications WHERE userMode = :mode ORDER BY receivedAt DESC")
    fun getNotificationsByUserMode(mode: String): Flow<List<CapturedNotification>>

    data class PlatformStat(
        val packageName: String,
        val platform: String,
        val count: Int
    )

    data class PlatformEarningStat(
        val packageName: String,
        val platform: String,
        val totalValue: Double
    )
}
