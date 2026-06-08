package com.notifetch.app.data.local

import androidx.room.Entity
import androidx.room.Index
import androidx.room.PrimaryKey
import com.notifetch.app.util.PlatformSource

@Entity(
    tableName = "captured_notifications",
    indices = [
        Index(value = ["packageName"]),
        Index(value = ["platform"]),
        Index(value = ["receivedAt"]),
        Index(value = ["isSynced"])
    ]
)
data class CapturedNotification(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val packageName: String,
    val platform: String,
    val source: String,
    val title: String,
    val body: String,
    val bigText: String,
    val subText: String,
    val orderValue: Double?,
    val pickupLocation: String?,
    val dropoffLocation: String?,
    val distance: String?,
    val extrasJson: String,
    val receivedAt: Long,
    val isSynced: Boolean = false,
    val syncedAt: Long? = null,
    val isRead: Boolean = false,
    val category: String?
)
