package com.notifetch.app.data.local

import androidx.room.Database
import androidx.room.RoomDatabase
import androidx.room.migration.Migration
import androidx.sqlite.db.SupportSQLiteDatabase

@Database(
    entities = [CapturedNotification::class, PlatformConfig::class],
    version = 5,
    exportSchema = false
)
abstract class NotiFetchDatabase : RoomDatabase() {
    abstract fun notificationDao(): NotificationDao
    abstract fun platformConfigDao(): PlatformConfigDao

    companion object {
        /**
         * Migration from v4 to v5.
         * v5 added: currency column (TEXT DEFAULT 'INR') and userMode column (TEXT DEFAULT 'rider')
         * to captured_notifications table, and userMode column to platform_configs table.
         *
         * IMPORTANT: Add new migrations here for each schema version bump.
         * Never rely on fallbackToDestructiveMigration — it destroys user data.
         */
        val MIGRATION_4_5 = object : Migration(4, 5) {
            override fun migrate(db: SupportSQLiteDatabase) {
                // Add currency column to captured_notifications (default INR for Indian users)
                db.execSQL(
                    "ALTER TABLE captured_notifications ADD COLUMN currency TEXT NOT NULL DEFAULT 'INR'"
                )
                // Add userMode column to captured_notifications (default 'rider')
                db.execSQL(
                    "ALTER TABLE captured_notifications ADD COLUMN userMode TEXT NOT NULL DEFAULT 'rider'"
                )
                // Add userMode column to platform_configs (default 'rider')
                db.execSQL(
                    "ALTER TABLE platform_configs ADD COLUMN userMode TEXT NOT NULL DEFAULT 'rider'"
                )
            }
        }

        /**
         * Returns all migrations in order.
         * Room will automatically run the necessary chain of migrations.
         */
        fun allMigrations(): Array<Migration> = arrayOf(
            MIGRATION_4_5
            // Add MIGRATION_5_6, MIGRATION_6_7, etc. here as the schema evolves.
        )
    }
}
