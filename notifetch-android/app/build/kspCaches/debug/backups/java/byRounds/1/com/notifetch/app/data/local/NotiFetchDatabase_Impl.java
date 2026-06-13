package com.notifetch.app.data.local;

import androidx.annotation.NonNull;
import androidx.room.DatabaseConfiguration;
import androidx.room.InvalidationTracker;
import androidx.room.RoomDatabase;
import androidx.room.RoomOpenHelper;
import androidx.room.migration.AutoMigrationSpec;
import androidx.room.migration.Migration;
import androidx.room.util.DBUtil;
import androidx.room.util.TableInfo;
import androidx.sqlite.db.SupportSQLiteDatabase;
import androidx.sqlite.db.SupportSQLiteOpenHelper;
import java.lang.Class;
import java.lang.Override;
import java.lang.String;
import java.lang.SuppressWarnings;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import javax.annotation.processing.Generated;

@Generated("androidx.room.RoomProcessor")
@SuppressWarnings({"unchecked", "deprecation"})
public final class NotiFetchDatabase_Impl extends NotiFetchDatabase {
  private volatile NotificationDao _notificationDao;

  private volatile PlatformConfigDao _platformConfigDao;

  @Override
  @NonNull
  protected SupportSQLiteOpenHelper createOpenHelper(@NonNull final DatabaseConfiguration config) {
    final SupportSQLiteOpenHelper.Callback _openCallback = new RoomOpenHelper(config, new RoomOpenHelper.Delegate(5) {
      @Override
      public void createAllTables(@NonNull final SupportSQLiteDatabase db) {
        db.execSQL("CREATE TABLE IF NOT EXISTS `captured_notifications` (`id` INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, `packageName` TEXT NOT NULL, `platform` TEXT NOT NULL, `source` TEXT NOT NULL, `title` TEXT NOT NULL, `body` TEXT NOT NULL, `bigText` TEXT NOT NULL, `subText` TEXT NOT NULL, `orderValue` REAL, `pickupLocation` TEXT, `dropoffLocation` TEXT, `distance` TEXT, `receivedAt` INTEGER NOT NULL, `isSynced` INTEGER NOT NULL, `syncedAt` INTEGER, `isRead` INTEGER NOT NULL, `category` TEXT, `currency` TEXT NOT NULL, `userMode` TEXT NOT NULL)");
        db.execSQL("CREATE INDEX IF NOT EXISTS `index_captured_notifications_packageName` ON `captured_notifications` (`packageName`)");
        db.execSQL("CREATE INDEX IF NOT EXISTS `index_captured_notifications_platform` ON `captured_notifications` (`platform`)");
        db.execSQL("CREATE INDEX IF NOT EXISTS `index_captured_notifications_receivedAt` ON `captured_notifications` (`receivedAt`)");
        db.execSQL("CREATE INDEX IF NOT EXISTS `index_captured_notifications_isSynced` ON `captured_notifications` (`isSynced`)");
        db.execSQL("CREATE INDEX IF NOT EXISTS `index_captured_notifications_userMode` ON `captured_notifications` (`userMode`)");
        db.execSQL("CREATE TABLE IF NOT EXISTS `platform_configs` (`packageName` TEXT NOT NULL, `displayName` TEXT NOT NULL, `customDisplayName` TEXT, `isEnabled` INTEGER NOT NULL, `notificationCount` INTEGER NOT NULL, `lastNotificationAt` INTEGER, `userMode` TEXT NOT NULL, PRIMARY KEY(`packageName`))");
        db.execSQL("CREATE TABLE IF NOT EXISTS room_master_table (id INTEGER PRIMARY KEY,identity_hash TEXT)");
        db.execSQL("INSERT OR REPLACE INTO room_master_table (id,identity_hash) VALUES(42, 'c3ce79f7ee250522ba92a113e407e1bf')");
      }

      @Override
      public void dropAllTables(@NonNull final SupportSQLiteDatabase db) {
        db.execSQL("DROP TABLE IF EXISTS `captured_notifications`");
        db.execSQL("DROP TABLE IF EXISTS `platform_configs`");
        final List<? extends RoomDatabase.Callback> _callbacks = mCallbacks;
        if (_callbacks != null) {
          for (RoomDatabase.Callback _callback : _callbacks) {
            _callback.onDestructiveMigration(db);
          }
        }
      }

      @Override
      public void onCreate(@NonNull final SupportSQLiteDatabase db) {
        final List<? extends RoomDatabase.Callback> _callbacks = mCallbacks;
        if (_callbacks != null) {
          for (RoomDatabase.Callback _callback : _callbacks) {
            _callback.onCreate(db);
          }
        }
      }

      @Override
      public void onOpen(@NonNull final SupportSQLiteDatabase db) {
        mDatabase = db;
        internalInitInvalidationTracker(db);
        final List<? extends RoomDatabase.Callback> _callbacks = mCallbacks;
        if (_callbacks != null) {
          for (RoomDatabase.Callback _callback : _callbacks) {
            _callback.onOpen(db);
          }
        }
      }

      @Override
      public void onPreMigrate(@NonNull final SupportSQLiteDatabase db) {
        DBUtil.dropFtsSyncTriggers(db);
      }

      @Override
      public void onPostMigrate(@NonNull final SupportSQLiteDatabase db) {
      }

      @Override
      @NonNull
      public RoomOpenHelper.ValidationResult onValidateSchema(
          @NonNull final SupportSQLiteDatabase db) {
        final HashMap<String, TableInfo.Column> _columnsCapturedNotifications = new HashMap<String, TableInfo.Column>(19);
        _columnsCapturedNotifications.put("id", new TableInfo.Column("id", "INTEGER", true, 1, null, TableInfo.CREATED_FROM_ENTITY));
        _columnsCapturedNotifications.put("packageName", new TableInfo.Column("packageName", "TEXT", true, 0, null, TableInfo.CREATED_FROM_ENTITY));
        _columnsCapturedNotifications.put("platform", new TableInfo.Column("platform", "TEXT", true, 0, null, TableInfo.CREATED_FROM_ENTITY));
        _columnsCapturedNotifications.put("source", new TableInfo.Column("source", "TEXT", true, 0, null, TableInfo.CREATED_FROM_ENTITY));
        _columnsCapturedNotifications.put("title", new TableInfo.Column("title", "TEXT", true, 0, null, TableInfo.CREATED_FROM_ENTITY));
        _columnsCapturedNotifications.put("body", new TableInfo.Column("body", "TEXT", true, 0, null, TableInfo.CREATED_FROM_ENTITY));
        _columnsCapturedNotifications.put("bigText", new TableInfo.Column("bigText", "TEXT", true, 0, null, TableInfo.CREATED_FROM_ENTITY));
        _columnsCapturedNotifications.put("subText", new TableInfo.Column("subText", "TEXT", true, 0, null, TableInfo.CREATED_FROM_ENTITY));
        _columnsCapturedNotifications.put("orderValue", new TableInfo.Column("orderValue", "REAL", false, 0, null, TableInfo.CREATED_FROM_ENTITY));
        _columnsCapturedNotifications.put("pickupLocation", new TableInfo.Column("pickupLocation", "TEXT", false, 0, null, TableInfo.CREATED_FROM_ENTITY));
        _columnsCapturedNotifications.put("dropoffLocation", new TableInfo.Column("dropoffLocation", "TEXT", false, 0, null, TableInfo.CREATED_FROM_ENTITY));
        _columnsCapturedNotifications.put("distance", new TableInfo.Column("distance", "TEXT", false, 0, null, TableInfo.CREATED_FROM_ENTITY));
        _columnsCapturedNotifications.put("receivedAt", new TableInfo.Column("receivedAt", "INTEGER", true, 0, null, TableInfo.CREATED_FROM_ENTITY));
        _columnsCapturedNotifications.put("isSynced", new TableInfo.Column("isSynced", "INTEGER", true, 0, null, TableInfo.CREATED_FROM_ENTITY));
        _columnsCapturedNotifications.put("syncedAt", new TableInfo.Column("syncedAt", "INTEGER", false, 0, null, TableInfo.CREATED_FROM_ENTITY));
        _columnsCapturedNotifications.put("isRead", new TableInfo.Column("isRead", "INTEGER", true, 0, null, TableInfo.CREATED_FROM_ENTITY));
        _columnsCapturedNotifications.put("category", new TableInfo.Column("category", "TEXT", false, 0, null, TableInfo.CREATED_FROM_ENTITY));
        _columnsCapturedNotifications.put("currency", new TableInfo.Column("currency", "TEXT", true, 0, null, TableInfo.CREATED_FROM_ENTITY));
        _columnsCapturedNotifications.put("userMode", new TableInfo.Column("userMode", "TEXT", true, 0, null, TableInfo.CREATED_FROM_ENTITY));
        final HashSet<TableInfo.ForeignKey> _foreignKeysCapturedNotifications = new HashSet<TableInfo.ForeignKey>(0);
        final HashSet<TableInfo.Index> _indicesCapturedNotifications = new HashSet<TableInfo.Index>(5);
        _indicesCapturedNotifications.add(new TableInfo.Index("index_captured_notifications_packageName", false, Arrays.asList("packageName"), Arrays.asList("ASC")));
        _indicesCapturedNotifications.add(new TableInfo.Index("index_captured_notifications_platform", false, Arrays.asList("platform"), Arrays.asList("ASC")));
        _indicesCapturedNotifications.add(new TableInfo.Index("index_captured_notifications_receivedAt", false, Arrays.asList("receivedAt"), Arrays.asList("ASC")));
        _indicesCapturedNotifications.add(new TableInfo.Index("index_captured_notifications_isSynced", false, Arrays.asList("isSynced"), Arrays.asList("ASC")));
        _indicesCapturedNotifications.add(new TableInfo.Index("index_captured_notifications_userMode", false, Arrays.asList("userMode"), Arrays.asList("ASC")));
        final TableInfo _infoCapturedNotifications = new TableInfo("captured_notifications", _columnsCapturedNotifications, _foreignKeysCapturedNotifications, _indicesCapturedNotifications);
        final TableInfo _existingCapturedNotifications = TableInfo.read(db, "captured_notifications");
        if (!_infoCapturedNotifications.equals(_existingCapturedNotifications)) {
          return new RoomOpenHelper.ValidationResult(false, "captured_notifications(com.notifetch.app.data.local.CapturedNotification).\n"
                  + " Expected:\n" + _infoCapturedNotifications + "\n"
                  + " Found:\n" + _existingCapturedNotifications);
        }
        final HashMap<String, TableInfo.Column> _columnsPlatformConfigs = new HashMap<String, TableInfo.Column>(7);
        _columnsPlatformConfigs.put("packageName", new TableInfo.Column("packageName", "TEXT", true, 1, null, TableInfo.CREATED_FROM_ENTITY));
        _columnsPlatformConfigs.put("displayName", new TableInfo.Column("displayName", "TEXT", true, 0, null, TableInfo.CREATED_FROM_ENTITY));
        _columnsPlatformConfigs.put("customDisplayName", new TableInfo.Column("customDisplayName", "TEXT", false, 0, null, TableInfo.CREATED_FROM_ENTITY));
        _columnsPlatformConfigs.put("isEnabled", new TableInfo.Column("isEnabled", "INTEGER", true, 0, null, TableInfo.CREATED_FROM_ENTITY));
        _columnsPlatformConfigs.put("notificationCount", new TableInfo.Column("notificationCount", "INTEGER", true, 0, null, TableInfo.CREATED_FROM_ENTITY));
        _columnsPlatformConfigs.put("lastNotificationAt", new TableInfo.Column("lastNotificationAt", "INTEGER", false, 0, null, TableInfo.CREATED_FROM_ENTITY));
        _columnsPlatformConfigs.put("userMode", new TableInfo.Column("userMode", "TEXT", true, 0, null, TableInfo.CREATED_FROM_ENTITY));
        final HashSet<TableInfo.ForeignKey> _foreignKeysPlatformConfigs = new HashSet<TableInfo.ForeignKey>(0);
        final HashSet<TableInfo.Index> _indicesPlatformConfigs = new HashSet<TableInfo.Index>(0);
        final TableInfo _infoPlatformConfigs = new TableInfo("platform_configs", _columnsPlatformConfigs, _foreignKeysPlatformConfigs, _indicesPlatformConfigs);
        final TableInfo _existingPlatformConfigs = TableInfo.read(db, "platform_configs");
        if (!_infoPlatformConfigs.equals(_existingPlatformConfigs)) {
          return new RoomOpenHelper.ValidationResult(false, "platform_configs(com.notifetch.app.data.local.PlatformConfig).\n"
                  + " Expected:\n" + _infoPlatformConfigs + "\n"
                  + " Found:\n" + _existingPlatformConfigs);
        }
        return new RoomOpenHelper.ValidationResult(true, null);
      }
    }, "c3ce79f7ee250522ba92a113e407e1bf", "3a28063c72141257946ac18b565cfeb3");
    final SupportSQLiteOpenHelper.Configuration _sqliteConfig = SupportSQLiteOpenHelper.Configuration.builder(config.context).name(config.name).callback(_openCallback).build();
    final SupportSQLiteOpenHelper _helper = config.sqliteOpenHelperFactory.create(_sqliteConfig);
    return _helper;
  }

  @Override
  @NonNull
  protected InvalidationTracker createInvalidationTracker() {
    final HashMap<String, String> _shadowTablesMap = new HashMap<String, String>(0);
    final HashMap<String, Set<String>> _viewTables = new HashMap<String, Set<String>>(0);
    return new InvalidationTracker(this, _shadowTablesMap, _viewTables, "captured_notifications","platform_configs");
  }

  @Override
  public void clearAllTables() {
    super.assertNotMainThread();
    final SupportSQLiteDatabase _db = super.getOpenHelper().getWritableDatabase();
    try {
      super.beginTransaction();
      _db.execSQL("DELETE FROM `captured_notifications`");
      _db.execSQL("DELETE FROM `platform_configs`");
      super.setTransactionSuccessful();
    } finally {
      super.endTransaction();
      _db.query("PRAGMA wal_checkpoint(FULL)").close();
      if (!_db.inTransaction()) {
        _db.execSQL("VACUUM");
      }
    }
  }

  @Override
  @NonNull
  protected Map<Class<?>, List<Class<?>>> getRequiredTypeConverters() {
    final HashMap<Class<?>, List<Class<?>>> _typeConvertersMap = new HashMap<Class<?>, List<Class<?>>>();
    _typeConvertersMap.put(NotificationDao.class, NotificationDao_Impl.getRequiredConverters());
    _typeConvertersMap.put(PlatformConfigDao.class, PlatformConfigDao_Impl.getRequiredConverters());
    return _typeConvertersMap;
  }

  @Override
  @NonNull
  public Set<Class<? extends AutoMigrationSpec>> getRequiredAutoMigrationSpecs() {
    final HashSet<Class<? extends AutoMigrationSpec>> _autoMigrationSpecsSet = new HashSet<Class<? extends AutoMigrationSpec>>();
    return _autoMigrationSpecsSet;
  }

  @Override
  @NonNull
  public List<Migration> getAutoMigrations(
      @NonNull final Map<Class<? extends AutoMigrationSpec>, AutoMigrationSpec> autoMigrationSpecs) {
    final List<Migration> _autoMigrations = new ArrayList<Migration>();
    return _autoMigrations;
  }

  @Override
  public NotificationDao notificationDao() {
    if (_notificationDao != null) {
      return _notificationDao;
    } else {
      synchronized(this) {
        if(_notificationDao == null) {
          _notificationDao = new NotificationDao_Impl(this);
        }
        return _notificationDao;
      }
    }
  }

  @Override
  public PlatformConfigDao platformConfigDao() {
    if (_platformConfigDao != null) {
      return _platformConfigDao;
    } else {
      synchronized(this) {
        if(_platformConfigDao == null) {
          _platformConfigDao = new PlatformConfigDao_Impl(this);
        }
        return _platformConfigDao;
      }
    }
  }
}
