package com.notifetch.app.data.local

import androidx.room.Database
import androidx.room.RoomDatabase

@Database(
    entities = [CapturedNotification::class, PlatformConfig::class],
    version = 3,
    exportSchema = false
)
abstract class NotiFetchDatabase : RoomDatabase() {
    abstract fun notificationDao(): NotificationDao
    abstract fun platformConfigDao(): PlatformConfigDao
}
