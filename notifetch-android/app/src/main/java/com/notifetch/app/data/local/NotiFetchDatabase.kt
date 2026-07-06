package com.notifetch.app.data.local

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import androidx.room.migration.Migration
import androidx.sqlite.db.SupportSQLiteDatabase
import com.notifetch.app.util.Constants

@Database(
    entities = [CapturedNotification::class, PlatformConfig::class],
    version = 8,
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
         * v7 (v2.9.12): Favorites/mute list.
         * Adds isFavorite and isMuted columns to platform_configs.
         * Both default to 0 (false) so existing platforms are unaffected.
         */
        val MIGRATION_6_7 = object : Migration(6, 7) {
            override fun migrate(db: SupportSQLiteDatabase) {
                db.execSQL(
                    "ALTER TABLE platform_configs ADD COLUMN isFavorite INTEGER NOT NULL DEFAULT 0"
                )
                db.execSQL(
                    "ALTER TABLE platform_configs ADD COLUMN isMuted INTEGER NOT NULL DEFAULT 0"
                )
            }
        }

        /**
         * Returns all migrations in order.
         * Room will automatically run the necessary chain of migrations.
         */
        val MIGRATION_7_8 = object : Migration(7, 8) {
            override fun migrate(db: SupportSQLiteDatabase) {
                db.execSQL("ALTER TABLE captured_notifications ADD COLUMN systemNotificationId INTEGER")
                db.execSQL("CREATE INDEX IF NOT EXISTS index_captured_notifications_userMode ON captured_notifications(userMode)")
            }
        }

        fun allMigrations(): Array<Migration> = arrayOf(
            MIGRATION_4_5,
            MIGRATION_5_6,
            MIGRATION_6_7,
            MIGRATION_7_8
        )

        /**
         * v2.9.12: Singleton database instance for use outside Hilt (e.g., widget).
         * Uses @Volatile + synchronized for thread-safe lazy initialization.
         */
        @Volatile
        private var INSTANCE: NotiFetchDatabase? = null

        fun getDatabase(context: Context): NotiFetchDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    NotiFetchDatabase::class.java,
                    Constants.DATABASE_NAME
                )
                    .addMigrations(*allMigrations())
                    .fallbackToDestructiveMigrationFrom(1, 2, 3)
                    .build()
                INSTANCE = instance
                instance
            }
        }
    }
}
