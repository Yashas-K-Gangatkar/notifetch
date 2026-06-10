package com.notifetch.app.data.local;

import android.database.Cursor;
import android.os.CancellationSignal;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.room.CoroutinesRoom;
import androidx.room.EntityInsertionAdapter;
import androidx.room.RoomDatabase;
import androidx.room.RoomSQLiteQuery;
import androidx.room.SharedSQLiteStatement;
import androidx.room.util.CursorUtil;
import androidx.room.util.DBUtil;
import androidx.sqlite.db.SupportSQLiteStatement;
import java.lang.Class;
import java.lang.Exception;
import java.lang.Long;
import java.lang.Object;
import java.lang.Override;
import java.lang.String;
import java.lang.SuppressWarnings;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.Callable;
import javax.annotation.processing.Generated;
import kotlin.Unit;
import kotlin.coroutines.Continuation;
import kotlinx.coroutines.flow.Flow;

@Generated("androidx.room.RoomProcessor")
@SuppressWarnings({"unchecked", "deprecation"})
public final class PlatformConfigDao_Impl implements PlatformConfigDao {
  private final RoomDatabase __db;

  private final EntityInsertionAdapter<PlatformConfig> __insertionAdapterOfPlatformConfig;

  private final SharedSQLiteStatement __preparedStmtOfUpdateEnabled;

  private final SharedSQLiteStatement __preparedStmtOfUpdateCustomDisplayName;

  private final SharedSQLiteStatement __preparedStmtOfIncrementNotificationCount;

  private final SharedSQLiteStatement __preparedStmtOfDeleteAll;

  public PlatformConfigDao_Impl(@NonNull final RoomDatabase __db) {
    this.__db = __db;
    this.__insertionAdapterOfPlatformConfig = new EntityInsertionAdapter<PlatformConfig>(__db) {
      @Override
      @NonNull
      protected String createQuery() {
        return "INSERT OR REPLACE INTO `platform_configs` (`packageName`,`displayName`,`customDisplayName`,`isEnabled`,`notificationCount`,`lastNotificationAt`) VALUES (?,?,?,?,?,?)";
      }

      @Override
      protected void bind(@NonNull final SupportSQLiteStatement statement,
          @NonNull final PlatformConfig entity) {
        statement.bindString(1, entity.getPackageName());
        statement.bindString(2, entity.getDisplayName());
        if (entity.getCustomDisplayName() == null) {
          statement.bindNull(3);
        } else {
          statement.bindString(3, entity.getCustomDisplayName());
        }
        final int _tmp = entity.isEnabled() ? 1 : 0;
        statement.bindLong(4, _tmp);
        statement.bindLong(5, entity.getNotificationCount());
        if (entity.getLastNotificationAt() == null) {
          statement.bindNull(6);
        } else {
          statement.bindLong(6, entity.getLastNotificationAt());
        }
      }
    };
    this.__preparedStmtOfUpdateEnabled = new SharedSQLiteStatement(__db) {
      @Override
      @NonNull
      public String createQuery() {
        final String _query = "UPDATE platform_configs SET isEnabled = ? WHERE packageName = ?";
        return _query;
      }
    };
    this.__preparedStmtOfUpdateCustomDisplayName = new SharedSQLiteStatement(__db) {
      @Override
      @NonNull
      public String createQuery() {
        final String _query = "UPDATE platform_configs SET customDisplayName = ? WHERE packageName = ?";
        return _query;
      }
    };
    this.__preparedStmtOfIncrementNotificationCount = new SharedSQLiteStatement(__db) {
      @Override
      @NonNull
      public String createQuery() {
        final String _query = "UPDATE platform_configs SET notificationCount = notificationCount + 1, lastNotificationAt = ? WHERE packageName = ?";
        return _query;
      }
    };
    this.__preparedStmtOfDeleteAll = new SharedSQLiteStatement(__db) {
      @Override
      @NonNull
      public String createQuery() {
        final String _query = "DELETE FROM platform_configs";
        return _query;
      }
    };
  }

  @Override
  public Object upsertConfig(final PlatformConfig config,
      final Continuation<? super Unit> $completion) {
    return CoroutinesRoom.execute(__db, true, new Callable<Unit>() {
      @Override
      @NonNull
      public Unit call() throws Exception {
        __db.beginTransaction();
        try {
          __insertionAdapterOfPlatformConfig.insert(config);
          __db.setTransactionSuccessful();
          return Unit.INSTANCE;
        } finally {
          __db.endTransaction();
        }
      }
    }, $completion);
  }

  @Override
  public Object upsertConfigs(final List<PlatformConfig> configs,
      final Continuation<? super Unit> $completion) {
    return CoroutinesRoom.execute(__db, true, new Callable<Unit>() {
      @Override
      @NonNull
      public Unit call() throws Exception {
        __db.beginTransaction();
        try {
          __insertionAdapterOfPlatformConfig.insert(configs);
          __db.setTransactionSuccessful();
          return Unit.INSTANCE;
        } finally {
          __db.endTransaction();
        }
      }
    }, $completion);
  }

  @Override
  public Object updateEnabled(final String packageName, final boolean isEnabled,
      final Continuation<? super Unit> $completion) {
    return CoroutinesRoom.execute(__db, true, new Callable<Unit>() {
      @Override
      @NonNull
      public Unit call() throws Exception {
        final SupportSQLiteStatement _stmt = __preparedStmtOfUpdateEnabled.acquire();
        int _argIndex = 1;
        final int _tmp = isEnabled ? 1 : 0;
        _stmt.bindLong(_argIndex, _tmp);
        _argIndex = 2;
        _stmt.bindString(_argIndex, packageName);
        try {
          __db.beginTransaction();
          try {
            _stmt.executeUpdateDelete();
            __db.setTransactionSuccessful();
            return Unit.INSTANCE;
          } finally {
            __db.endTransaction();
          }
        } finally {
          __preparedStmtOfUpdateEnabled.release(_stmt);
        }
      }
    }, $completion);
  }

  @Override
  public Object updateCustomDisplayName(final String packageName, final String customName,
      final Continuation<? super Unit> $completion) {
    return CoroutinesRoom.execute(__db, true, new Callable<Unit>() {
      @Override
      @NonNull
      public Unit call() throws Exception {
        final SupportSQLiteStatement _stmt = __preparedStmtOfUpdateCustomDisplayName.acquire();
        int _argIndex = 1;
        if (customName == null) {
          _stmt.bindNull(_argIndex);
        } else {
          _stmt.bindString(_argIndex, customName);
        }
        _argIndex = 2;
        _stmt.bindString(_argIndex, packageName);
        try {
          __db.beginTransaction();
          try {
            _stmt.executeUpdateDelete();
            __db.setTransactionSuccessful();
            return Unit.INSTANCE;
          } finally {
            __db.endTransaction();
          }
        } finally {
          __preparedStmtOfUpdateCustomDisplayName.release(_stmt);
        }
      }
    }, $completion);
  }

  @Override
  public Object incrementNotificationCount(final String packageName, final long timestamp,
      final Continuation<? super Unit> $completion) {
    return CoroutinesRoom.execute(__db, true, new Callable<Unit>() {
      @Override
      @NonNull
      public Unit call() throws Exception {
        final SupportSQLiteStatement _stmt = __preparedStmtOfIncrementNotificationCount.acquire();
        int _argIndex = 1;
        _stmt.bindLong(_argIndex, timestamp);
        _argIndex = 2;
        _stmt.bindString(_argIndex, packageName);
        try {
          __db.beginTransaction();
          try {
            _stmt.executeUpdateDelete();
            __db.setTransactionSuccessful();
            return Unit.INSTANCE;
          } finally {
            __db.endTransaction();
          }
        } finally {
          __preparedStmtOfIncrementNotificationCount.release(_stmt);
        }
      }
    }, $completion);
  }

  @Override
  public Object deleteAll(final Continuation<? super Unit> $completion) {
    return CoroutinesRoom.execute(__db, true, new Callable<Unit>() {
      @Override
      @NonNull
      public Unit call() throws Exception {
        final SupportSQLiteStatement _stmt = __preparedStmtOfDeleteAll.acquire();
        try {
          __db.beginTransaction();
          try {
            _stmt.executeUpdateDelete();
            __db.setTransactionSuccessful();
            return Unit.INSTANCE;
          } finally {
            __db.endTransaction();
          }
        } finally {
          __preparedStmtOfDeleteAll.release(_stmt);
        }
      }
    }, $completion);
  }

  @Override
  public Flow<List<PlatformConfig>> getAllConfigs() {
    final String _sql = "SELECT * FROM platform_configs ORDER BY displayName";
    final RoomSQLiteQuery _statement = RoomSQLiteQuery.acquire(_sql, 0);
    return CoroutinesRoom.createFlow(__db, false, new String[] {"platform_configs"}, new Callable<List<PlatformConfig>>() {
      @Override
      @NonNull
      public List<PlatformConfig> call() throws Exception {
        final Cursor _cursor = DBUtil.query(__db, _statement, false, null);
        try {
          final int _cursorIndexOfPackageName = CursorUtil.getColumnIndexOrThrow(_cursor, "packageName");
          final int _cursorIndexOfDisplayName = CursorUtil.getColumnIndexOrThrow(_cursor, "displayName");
          final int _cursorIndexOfCustomDisplayName = CursorUtil.getColumnIndexOrThrow(_cursor, "customDisplayName");
          final int _cursorIndexOfIsEnabled = CursorUtil.getColumnIndexOrThrow(_cursor, "isEnabled");
          final int _cursorIndexOfNotificationCount = CursorUtil.getColumnIndexOrThrow(_cursor, "notificationCount");
          final int _cursorIndexOfLastNotificationAt = CursorUtil.getColumnIndexOrThrow(_cursor, "lastNotificationAt");
          final List<PlatformConfig> _result = new ArrayList<PlatformConfig>(_cursor.getCount());
          while (_cursor.moveToNext()) {
            final PlatformConfig _item;
            final String _tmpPackageName;
            _tmpPackageName = _cursor.getString(_cursorIndexOfPackageName);
            final String _tmpDisplayName;
            _tmpDisplayName = _cursor.getString(_cursorIndexOfDisplayName);
            final String _tmpCustomDisplayName;
            if (_cursor.isNull(_cursorIndexOfCustomDisplayName)) {
              _tmpCustomDisplayName = null;
            } else {
              _tmpCustomDisplayName = _cursor.getString(_cursorIndexOfCustomDisplayName);
            }
            final boolean _tmpIsEnabled;
            final int _tmp;
            _tmp = _cursor.getInt(_cursorIndexOfIsEnabled);
            _tmpIsEnabled = _tmp != 0;
            final int _tmpNotificationCount;
            _tmpNotificationCount = _cursor.getInt(_cursorIndexOfNotificationCount);
            final Long _tmpLastNotificationAt;
            if (_cursor.isNull(_cursorIndexOfLastNotificationAt)) {
              _tmpLastNotificationAt = null;
            } else {
              _tmpLastNotificationAt = _cursor.getLong(_cursorIndexOfLastNotificationAt);
            }
            _item = new PlatformConfig(_tmpPackageName,_tmpDisplayName,_tmpCustomDisplayName,_tmpIsEnabled,_tmpNotificationCount,_tmpLastNotificationAt);
            _result.add(_item);
          }
          return _result;
        } finally {
          _cursor.close();
        }
      }

      @Override
      protected void finalize() {
        _statement.release();
      }
    });
  }

  @Override
  public Flow<List<PlatformConfig>> getEnabledConfigs() {
    final String _sql = "SELECT * FROM platform_configs WHERE isEnabled = 1 ORDER BY displayName";
    final RoomSQLiteQuery _statement = RoomSQLiteQuery.acquire(_sql, 0);
    return CoroutinesRoom.createFlow(__db, false, new String[] {"platform_configs"}, new Callable<List<PlatformConfig>>() {
      @Override
      @NonNull
      public List<PlatformConfig> call() throws Exception {
        final Cursor _cursor = DBUtil.query(__db, _statement, false, null);
        try {
          final int _cursorIndexOfPackageName = CursorUtil.getColumnIndexOrThrow(_cursor, "packageName");
          final int _cursorIndexOfDisplayName = CursorUtil.getColumnIndexOrThrow(_cursor, "displayName");
          final int _cursorIndexOfCustomDisplayName = CursorUtil.getColumnIndexOrThrow(_cursor, "customDisplayName");
          final int _cursorIndexOfIsEnabled = CursorUtil.getColumnIndexOrThrow(_cursor, "isEnabled");
          final int _cursorIndexOfNotificationCount = CursorUtil.getColumnIndexOrThrow(_cursor, "notificationCount");
          final int _cursorIndexOfLastNotificationAt = CursorUtil.getColumnIndexOrThrow(_cursor, "lastNotificationAt");
          final List<PlatformConfig> _result = new ArrayList<PlatformConfig>(_cursor.getCount());
          while (_cursor.moveToNext()) {
            final PlatformConfig _item;
            final String _tmpPackageName;
            _tmpPackageName = _cursor.getString(_cursorIndexOfPackageName);
            final String _tmpDisplayName;
            _tmpDisplayName = _cursor.getString(_cursorIndexOfDisplayName);
            final String _tmpCustomDisplayName;
            if (_cursor.isNull(_cursorIndexOfCustomDisplayName)) {
              _tmpCustomDisplayName = null;
            } else {
              _tmpCustomDisplayName = _cursor.getString(_cursorIndexOfCustomDisplayName);
            }
            final boolean _tmpIsEnabled;
            final int _tmp;
            _tmp = _cursor.getInt(_cursorIndexOfIsEnabled);
            _tmpIsEnabled = _tmp != 0;
            final int _tmpNotificationCount;
            _tmpNotificationCount = _cursor.getInt(_cursorIndexOfNotificationCount);
            final Long _tmpLastNotificationAt;
            if (_cursor.isNull(_cursorIndexOfLastNotificationAt)) {
              _tmpLastNotificationAt = null;
            } else {
              _tmpLastNotificationAt = _cursor.getLong(_cursorIndexOfLastNotificationAt);
            }
            _item = new PlatformConfig(_tmpPackageName,_tmpDisplayName,_tmpCustomDisplayName,_tmpIsEnabled,_tmpNotificationCount,_tmpLastNotificationAt);
            _result.add(_item);
          }
          return _result;
        } finally {
          _cursor.close();
        }
      }

      @Override
      protected void finalize() {
        _statement.release();
      }
    });
  }

  @Override
  public Object getConfigByPackage(final String packageName,
      final Continuation<? super PlatformConfig> $completion) {
    final String _sql = "SELECT * FROM platform_configs WHERE packageName = ?";
    final RoomSQLiteQuery _statement = RoomSQLiteQuery.acquire(_sql, 1);
    int _argIndex = 1;
    _statement.bindString(_argIndex, packageName);
    final CancellationSignal _cancellationSignal = DBUtil.createCancellationSignal();
    return CoroutinesRoom.execute(__db, false, _cancellationSignal, new Callable<PlatformConfig>() {
      @Override
      @Nullable
      public PlatformConfig call() throws Exception {
        final Cursor _cursor = DBUtil.query(__db, _statement, false, null);
        try {
          final int _cursorIndexOfPackageName = CursorUtil.getColumnIndexOrThrow(_cursor, "packageName");
          final int _cursorIndexOfDisplayName = CursorUtil.getColumnIndexOrThrow(_cursor, "displayName");
          final int _cursorIndexOfCustomDisplayName = CursorUtil.getColumnIndexOrThrow(_cursor, "customDisplayName");
          final int _cursorIndexOfIsEnabled = CursorUtil.getColumnIndexOrThrow(_cursor, "isEnabled");
          final int _cursorIndexOfNotificationCount = CursorUtil.getColumnIndexOrThrow(_cursor, "notificationCount");
          final int _cursorIndexOfLastNotificationAt = CursorUtil.getColumnIndexOrThrow(_cursor, "lastNotificationAt");
          final PlatformConfig _result;
          if (_cursor.moveToFirst()) {
            final String _tmpPackageName;
            _tmpPackageName = _cursor.getString(_cursorIndexOfPackageName);
            final String _tmpDisplayName;
            _tmpDisplayName = _cursor.getString(_cursorIndexOfDisplayName);
            final String _tmpCustomDisplayName;
            if (_cursor.isNull(_cursorIndexOfCustomDisplayName)) {
              _tmpCustomDisplayName = null;
            } else {
              _tmpCustomDisplayName = _cursor.getString(_cursorIndexOfCustomDisplayName);
            }
            final boolean _tmpIsEnabled;
            final int _tmp;
            _tmp = _cursor.getInt(_cursorIndexOfIsEnabled);
            _tmpIsEnabled = _tmp != 0;
            final int _tmpNotificationCount;
            _tmpNotificationCount = _cursor.getInt(_cursorIndexOfNotificationCount);
            final Long _tmpLastNotificationAt;
            if (_cursor.isNull(_cursorIndexOfLastNotificationAt)) {
              _tmpLastNotificationAt = null;
            } else {
              _tmpLastNotificationAt = _cursor.getLong(_cursorIndexOfLastNotificationAt);
            }
            _result = new PlatformConfig(_tmpPackageName,_tmpDisplayName,_tmpCustomDisplayName,_tmpIsEnabled,_tmpNotificationCount,_tmpLastNotificationAt);
          } else {
            _result = null;
          }
          return _result;
        } finally {
          _cursor.close();
          _statement.release();
        }
      }
    }, $completion);
  }

  @Override
  public Object getResolvedDisplayName(final String packageName,
      final Continuation<? super String> $completion) {
    final String _sql = "SELECT COALESCE(customDisplayName, displayName) FROM platform_configs WHERE packageName = ?";
    final RoomSQLiteQuery _statement = RoomSQLiteQuery.acquire(_sql, 1);
    int _argIndex = 1;
    _statement.bindString(_argIndex, packageName);
    final CancellationSignal _cancellationSignal = DBUtil.createCancellationSignal();
    return CoroutinesRoom.execute(__db, false, _cancellationSignal, new Callable<String>() {
      @Override
      @Nullable
      public String call() throws Exception {
        final Cursor _cursor = DBUtil.query(__db, _statement, false, null);
        try {
          final String _result;
          if (_cursor.moveToFirst()) {
            final String _tmp;
            if (_cursor.isNull(0)) {
              _tmp = null;
            } else {
              _tmp = _cursor.getString(0);
            }
            _result = _tmp;
          } else {
            _result = null;
          }
          return _result;
        } finally {
          _cursor.close();
          _statement.release();
        }
      }
    }, $completion);
  }

  @NonNull
  public static List<Class<?>> getRequiredConverters() {
    return Collections.emptyList();
  }
}
