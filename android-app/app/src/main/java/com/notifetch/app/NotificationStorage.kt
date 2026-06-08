package com.notifetch.app

import android.content.Context
import androidx.room.*
import kotlinx.coroutines.flow.Flow

/**
 * Room Type Converters for complex types.
 */
class Converters {
    @TypeConverter
    fun fromStringList(value: List<String>): String = value.joinToString(",")

    @TypeConverter
    fun toStringList(value: String): List<String> =
        if (value.isBlank()) emptyList() else value.split(",")
}

/**
 * Room Data Access Object for notifications.
 */
@Dao
interface NotificationDao {

    @Query("SELECT * FROM notifications ORDER BY timestamp DESC")
    fun getAllNotifications(): Flow<List<NotificationData>>

    @Query("SELECT * FROM notifications ORDER BY timestamp DESC LIMIT :limit OFFSET :offset")
    suspend fun getNotifications(limit: Int, offset: Int): List<NotificationData>

    @Query("SELECT * FROM notifications WHERE source = :source ORDER BY timestamp DESC")
    fun getNotificationsBySource(source: String): Flow<List<NotificationData>>

    @Query("SELECT * FROM notifications WHERE packageName = :packageName ORDER BY timestamp DESC")
    fun getNotificationsByPackage(packageName: String): Flow<List<NotificationData>>

    @Query("SELECT * FROM notifications WHERE category = :category ORDER BY timestamp DESC")
    fun getNotificationsByCategory(category: String): Flow<List<NotificationData>>

    @Query("SELECT * FROM notifications WHERE isRead = 0 ORDER BY timestamp DESC")
    fun getUnreadNotifications(): Flow<List<NotificationData>>

    @Query("SELECT COUNT(*) FROM notifications WHERE isRead = 0")
    fun getUnreadCount(): Flow<Int>

    @Query("SELECT COUNT(*) FROM notifications")
    fun getTotalCount(): Flow<Int>

    @Query("SELECT COUNT(*) FROM notifications WHERE source = :source")
    fun getCountBySource(source: String): Flow<Int>

    @Query("SELECT DISTINCT source FROM notifications ORDER BY source")
    fun getDistinctSources(): Flow<List<String>>

    @Query("SELECT DISTINCT category FROM notifications ORDER BY category")
    fun getDistinctCategories(): Flow<List<String>>

    @Query("SELECT * FROM notifications WHERE id = :id")
    suspend fun getNotificationById(id: String): NotificationData?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertNotification(notification: NotificationData)

    @Update
    suspend fun updateNotification(notification: NotificationData)

    @Query("UPDATE notifications SET isRead = 1 WHERE id = :id")
    suspend fun markAsRead(id: String)

    @Query("UPDATE notifications SET isRead = 1")
    suspend fun markAllAsRead()

    @Query("UPDATE notifications SET isForwarded = 1 WHERE id = :id")
    suspend fun markAsForwarded(id: String)

    @Delete
    suspend fun deleteNotification(notification: NotificationData)

    @Query("DELETE FROM notifications WHERE id = :id")
    suspend fun deleteNotificationById(id: String)

    @Query("DELETE FROM notifications WHERE timestamp < :cutoffTimestamp")
    suspend fun deleteOldNotifications(cutoffTimestamp: Long): Int

    @Query("DELETE FROM notifications")
    suspend fun deleteAll()
}

/**
 * Room Database for NotiFetch.
 */
@Database(
    entities = [NotificationData::class],
    version = 1,
    exportSchema = true
)
@TypeConverters(Converters::class)
abstract class NotiFetchDatabase : RoomDatabase() {
    abstract fun notificationDao(): NotificationDao

    companion object {
        @Volatile
        private var INSTANCE: NotiFetchDatabase? = null

        fun getDatabase(context: Context): NotiFetchDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    NotiFetchDatabase::class.java,
                    "notifetch_database"
                )
                    .fallbackToDestructiveMigration()
                    .build()
                INSTANCE = instance
                instance
            }
        }
    }
}

/**
 * Repository for notification data operations.
 */
class NotificationRepository(private val dao: NotificationDao) {

    val allNotifications: Flow<List<NotificationData>> = dao.getAllNotifications()
    val unreadNotifications: Flow<List<NotificationData>> = dao.getUnreadNotifications()
    val unreadCount: Flow<Int> = dao.getUnreadCount()
    val totalCount: Flow<Int> = dao.getTotalCount()
    val distinctSources: Flow<List<String>> = dao.getDistinctSources()
    val distinctCategories: Flow<List<String>> = dao.getDistinctCategories()

    fun getNotificationsBySource(source: String): Flow<List<NotificationData>> =
        dao.getNotificationsBySource(source)

    fun getNotificationsByCategory(category: String): Flow<List<NotificationData>> =
        dao.getNotificationsByCategory(category)

    suspend fun insert(notification: NotificationData) = dao.insertNotification(notification)

    suspend fun markAsRead(id: String) = dao.markAsRead(id)

    suspend fun markAllAsRead() = dao.markAllAsRead()

    suspend fun markAsForwarded(id: String) = dao.markAsForwarded(id)

    suspend fun delete(id: String) = dao.deleteNotificationById(id)

    suspend fun deleteAll() = dao.deleteAll()

    suspend fun deleteOlderThan(days: Int): Int {
        val cutoff = System.currentTimeMillis() - (days * 24 * 60 * 60 * 1000L)
        return dao.deleteOldNotifications(cutoff)
    }
}
