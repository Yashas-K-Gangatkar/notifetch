package com.notifetch.app.data.local

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import kotlinx.coroutines.flow.Flow

@Dao
interface PlatformConfigDao {

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun upsertConfig(config: PlatformConfig)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun upsertConfigs(configs: List<PlatformConfig>)

    @Query("SELECT * FROM platform_configs ORDER BY displayName")
    fun getAllConfigs(): Flow<List<PlatformConfig>>

    @Query("SELECT * FROM platform_configs WHERE isEnabled = 1 ORDER BY displayName")
    fun getEnabledConfigs(): Flow<List<PlatformConfig>>

    @Query("SELECT * FROM platform_configs WHERE packageName = :packageName")
    suspend fun getConfigByPackage(packageName: String): PlatformConfig?

    @Query("UPDATE platform_configs SET isEnabled = :isEnabled WHERE packageName = :packageName")
    suspend fun updateEnabled(packageName: String, isEnabled: Boolean)

    @Query("UPDATE platform_configs SET customDisplayName = :customName WHERE packageName = :packageName")
    suspend fun updateCustomDisplayName(packageName: String, customName: String?)

    // v2.9.12: Favorites/mute list
    @Query("UPDATE platform_configs SET isFavorite = :isFavorite WHERE packageName = :packageName")
    suspend fun updateFavorite(packageName: String, isFavorite: Boolean)

    @Query("UPDATE platform_configs SET isMuted = :isMuted WHERE packageName = :packageName")
    suspend fun updateMuted(packageName: String, isMuted: Boolean)

    @Query("SELECT * FROM platform_configs WHERE isFavorite = 1 ORDER BY displayName")
    fun getFavoriteConfigs(): Flow<List<PlatformConfig>>

    @Query("SELECT * FROM platform_configs WHERE isMuted = 1 ORDER BY displayName")
    fun getMutedConfigs(): Flow<List<PlatformConfig>>

    @Query("SELECT isMuted FROM platform_configs WHERE packageName = :packageName")
    suspend fun isPlatformMuted(packageName: String): Boolean?

    @Query("SELECT isFavorite FROM platform_configs WHERE packageName = :packageName")
    suspend fun isPlatformFavorite(packageName: String): Boolean?

    @Query("UPDATE platform_configs SET notificationCount = notificationCount + 1, lastNotificationAt = :timestamp WHERE packageName = :packageName")
    suspend fun incrementNotificationCount(packageName: String, timestamp: Long)

    @Query("DELETE FROM platform_configs")
    suspend fun deleteAll()

    /**
     * Get the resolved display name for a platform by package name.
     * Returns custom name if set, otherwise the default brand name.
     */
    @Query("SELECT COALESCE(customDisplayName, displayName) FROM platform_configs WHERE packageName = :packageName")
    suspend fun getResolvedDisplayName(packageName: String): String?
}
