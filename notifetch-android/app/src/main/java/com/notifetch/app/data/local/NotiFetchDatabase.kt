package com.notifetch.app.data.local

import androidx.room.Database
import androidx.room.RoomDatabase
import androidx.room.TypeConverters

@Database(
    entities = [CapturedNotification::class, PlatformConfig::class],
    version = 2,
    exportSchema = false
)
@TypeConverters(Converters::class)
abstract class NotiFetchDatabase : RoomDatabase() {
    abstract fun notificationDao(): NotificationDao
    abstract fun platformConfigDao(): PlatformConfigDao
}
