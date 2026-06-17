package com.notifetch.app.data.local

import androidx.room.Database
import androidx.room.RoomDatabase
import androidx.room.migration.Migration
import androidx.sqlite.db.SupportSQLiteDatabase

@Database(
    entities = [CapturedNotification::class, PlatformConfig::class],
    version = 6,
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
         */
        val MIGRATION_4_5 = object : Migration(4, 5) {
            override fun migrate(db: SupportSQLiteDatabase) {
                db.execSQL(
                    "ALTER TABLE captured_notifications ADD COLUMN currency TEXT NOT NULL DEFAULT 'INR'"
                )
                db.execSQL(
                    "ALTER TABLE captured_notifications ADD COLUMN userMode TEXT NOT NULL DEFAULT 'rider'"
                )
                db.execSQL(
                    "ALTER TABLE platform_configs ADD COLUMN userMode TEXT NOT NULL DEFAULT 'rider'"
                )
            }
        }

        /**
         * v6 (v2.9.8): Deep link persistence.
         *
         * Adds deepLinkUri and deepLinkComponent columns to captured_notifications.
         * These store the source app's intended deep-link target extracted from
         * the original notification's contentIntent. Both are nullable because:
         *   - Older notifications (captured before v2.9.8) have no deep link stored
         *   - Some notifications don't include a contentIntent
         *   - Some contentIntents don't have a data URI (only component/extras)
         *
         * This migration is non-destructive — existing notifications are preserved.
         */
        val MIGRATION_5_6 = object : Migration(5, 6) {
            override fun migrate(db: SupportSQLiteDatabase) {
                db.execSQL(
                    "ALTER TABLE captured_notifications ADD COLUMN deepLinkUri TEXT"
                )
                db.execSQL(
                    "ALTER TABLE captured_notifications ADD COLUMN deepLinkComponent TEXT"
                )
            }
        }

        /**
         * Returns all migrations in order.
         * Room will automatically run the necessary chain of migrations.
         */
        fun allMigrations(): Array<Migration> = arrayOf(
            MIGRATION_4_5,
            MIGRATION_5_6
        )
    }
}
