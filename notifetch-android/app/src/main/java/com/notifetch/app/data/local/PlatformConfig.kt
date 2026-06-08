package com.notifetch.app.data.local

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "platform_configs")
data class PlatformConfig(
    @PrimaryKey
    val packageName: String,
    val displayName: String,
    val isEnabled: Boolean = true,
    val notificationCount: Int = 0,
    val lastNotificationAt: Long? = null
)
