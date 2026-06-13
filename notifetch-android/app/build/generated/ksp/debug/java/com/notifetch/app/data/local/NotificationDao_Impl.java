package com.notifetch.app.data.local;

import android.database.Cursor;
import android.os.CancellationSignal;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.room.CoroutinesRoom;
import androidx.room.EntityDeletionOrUpdateAdapter;
import androidx.room.EntityInsertionAdapter;
import androidx.room.RoomDatabase;
import androidx.room.RoomSQLiteQuery;
import androidx.room.SharedSQLiteStatement;
import androidx.room.util.CursorUtil;
import androidx.room.util.DBUtil;
import androidx.room.util.StringUtil;
import androidx.sqlite.db.SupportSQLiteStatement;
import java.lang.Class;
import java.lang.Double;
import java.lang.Exception;
import java.lang.Integer;
import java.lang.Long;
import java.lang.Object;
import java.lang.Override;
import java.lang.String;
import java.lang.StringBuilder;
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
public final class NotificationDao_Impl implements NotificationDao {
  private final RoomDatabase __db;

  private final EntityInsertionAdapter<CapturedNotification> __insertionAdapterOfCapturedNotification;

  private final EntityDeletionOrUpdateAdapter<CapturedNotification> __deletionAdapterOfCapturedNotification;

  private final EntityDeletionOrUpdateAdapter<CapturedNotification> __updateAdapterOfCapturedNotification;

  private final SharedSQLiteStatement __preparedStmtOfDeleteById;

  private final SharedSQLiteStatement __preparedStmtOfDeleteAll;

  private final SharedSQLiteStatement __preparedStmtOfMarkAsRead;

  private final SharedSQLiteStatement __preparedStmtOfMarkAllAsRead;

  public NotificationDao_Impl(@NonNull final RoomDatabase __db) {
    this.__db = __db;
    this.__insertionAdapterOfCapturedNotification = new EntityInsertionAdapter<CapturedNotification>(__db) {
      @Override
      @NonNull
      protected String createQuery() {
        return "INSERT OR REPLACE INTO `captured_notifications` (`id`,`packageName`,`platform`,`source`,`title`,`body`,`bigText`,`subText`,`orderValue`,`pickupLocation`,`dropoffLocation`,`distance`,`receivedAt`,`isSynced`,`syncedAt`,`isRead`,`category`,`currency`,`userMode`) VALUES (nullif(?, 0),?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
      }

      @Override
      protected void bind(@NonNull final SupportSQLiteStatement statement,
          @NonNull final CapturedNotification entity) {
        statement.bindLong(1, entity.getId());
        statement.bindString(2, entity.getPackageName());
        statement.bindString(3, entity.getPlatform());
        statement.bindString(4, entity.getSource());
        statement.bindString(5, entity.getTitle());
        statement.bindString(6, entity.getBody());
        statement.bindString(7, entity.getBigText());
        statement.bindString(8, entity.getSubText());
        if (entity.getOrderValue() == null) {
          statement.bindNull(9);
        } else {
          statement.bindDouble(9, entity.getOrderValue());
        }
        if (entity.getPickupLocation() == null) {
          statement.bindNull(10);
        } else {
          statement.bindString(10, entity.getPickupLocation());
        }
        if (entity.getDropoffLocation() == null) {
          statement.bindNull(11);
        } else {
          statement.bindString(11, entity.getDropoffLocation());
        }
        if (entity.getDistance() == null) {
          statement.bindNull(12);
        } else {
          statement.bindString(12, entity.getDistance());
        }
        statement.bindLong(13, entity.getReceivedAt());
        final int _tmp = entity.isSynced() ? 1 : 0;
        statement.bindLong(14, _tmp);
        if (entity.getSyncedAt() == null) {
          statement.bindNull(15);
        } else {
          statement.bindLong(15, entity.getSyncedAt());
        }
        final int _tmp_1 = entity.isRead() ? 1 : 0;
        statement.bindLong(16, _tmp_1);
        if (entity.getCategory() == null) {
          statement.bindNull(17);
        } else {
          statement.bindString(17, entity.getCategory());
        }
        statement.bindString(18, entity.getCurrency());
        statement.bindString(19, entity.getUserMode());
      }
    };
    this.__deletionAdapterOfCapturedNotification = new EntityDeletionOrUpdateAdapter<CapturedNotification>(__db) {
      @Override
      @NonNull
      protected String createQuery() {
        return "DELETE FROM `captured_notifications` WHERE `id` = ?";
      }

      @Override
      protected void bind(@NonNull final SupportSQLiteStatement statement,
          @NonNull final CapturedNotification entity) {
        statement.bindLong(1, entity.getId());
      }
    };
    this.__updateAdapterOfCapturedNotification = new EntityDeletionOrUpdateAdapter<CapturedNotification>(__db) {
      @Override
      @NonNull
      protected String createQuery() {
        return "UPDATE OR ABORT `captured_notifications` SET `id` = ?,`packageName` = ?,`platform` = ?,`source` = ?,`title` = ?,`body` = ?,`bigText` = ?,`subText` = ?,`orderValue` = ?,`pickupLocation` = ?,`dropoffLocation` = ?,`distance` = ?,`receivedAt` = ?,`isSynced` = ?,`syncedAt` = ?,`isRead` = ?,`category` = ?,`currency` = ?,`userMode` = ? WHERE `id` = ?";
      }

      @Override
      protected void bind(@NonNull final SupportSQLiteStatement statement,
          @NonNull final CapturedNotification entity) {
        statement.bindLong(1, entity.getId());
        statement.bindString(2, entity.getPackageName());
        statement.bindString(3, entity.getPlatform());
        statement.bindString(4, entity.getSource());
        statement.bindString(5, entity.getTitle());
        statement.bindString(6, entity.getBody());
        statement.bindString(7, entity.getBigText());
        statement.bindString(8, entity.getSubText());
        if (entity.getOrderValue() == null) {
          statement.bindNull(9);
        } else {
          statement.bindDouble(9, entity.getOrderValue());
        }
        if (entity.getPickupLocation() == null) {
          statement.bindNull(10);
        } else {
          statement.bindString(10, entity.getPickupLocation());
        }
        if (entity.getDropoffLocation() == null) {
          statement.bindNull(11);
        } else {
          statement.bindString(11, entity.getDropoffLocation());
        }
        if (entity.getDistance() == null) {
          statement.bindNull(12);
        } else {
          statement.bindString(12, entity.getDistance());
        }
        statement.bindLong(13, entity.getReceivedAt());
        final int _tmp = entity.isSynced() ? 1 : 0;
        statement.bindLong(14, _tmp);
        if (entity.getSyncedAt() == null) {
          statement.bindNull(15);
        } else {
          statement.bindLong(15, entity.getSyncedAt());
        }
        final int _tmp_1 = entity.isRead() ? 1 : 0;
        statement.bindLong(16, _tmp_1);
        if (entity.getCategory() == null) {
          statement.bindNull(17);
        } else {
          statement.bindString(17, entity.getCategory());
        }
        statement.bindString(18, entity.getCurrency());
        statement.bindString(19, entity.getUserMode());
        statement.bindLong(20, entity.getId());
      }
    };
    this.__preparedStmtOfDeleteById = new SharedSQLiteStatement(__db) {
      @Override
      @NonNull
      public String createQuery() {
        final String _query = "DELETE FROM captured_notifications WHERE id = ?";
        return _query;
      }
    };
    this.__preparedStmtOfDeleteAll = new SharedSQLiteStatement(__db) {
      @Override
      @NonNull
      public String createQuery() {
        final String _query = "DELETE FROM captured_notifications";
        return _query;
      }
    };
    this.__preparedStmtOfMarkAsRead = new SharedSQLiteStatement(__db) {
      @Override
      @NonNull
      public String createQuery() {
        final String _query = "UPDATE captured_notifications SET isRead = 1 WHERE id = ?";
        return _query;
      }
    };
    this.__preparedStmtOfMarkAllAsRead = new SharedSQLiteStatement(__db) {
      @Override
      @NonNull
      public String createQuery() {
        final String _query = "UPDATE captured_notifications SET isRead = 1";
        return _query;
      }
    };
  }

  @Override
  public Object insertNotification(final CapturedNotification notification,
      final Continuation<? super Long> $completion) {
    return CoroutinesRoom.execute(__db, true, new Callable<Long>() {
      @Override
      @NonNull
      public Long call() throws Exception {
        __db.beginTransaction();
        try {
          final Long _result = __insertionAdapterOfCapturedNotification.insertAndReturnId(notification);
          __db.setTransactionSuccessful();
          return _result;
        } finally {
          __db.endTransaction();
        }
      }
    }, $completion);
  }

  @Override
  public Object deleteNotification(final CapturedNotification notification,
      final Continuation<? super Unit> $completion) {
    return CoroutinesRoom.execute(__db, true, new Callable<Unit>() {
      @Override
      @NonNull
      public Unit call() throws Exception {
        __db.beginTransaction();
        try {
          __deletionAdapterOfCapturedNotification.handle(notification);
          __db.setTransactionSuccessful();
          return Unit.INSTANCE;
        } finally {
          __db.endTransaction();
        }
      }
    }, $completion);
  }

  @Override
  public Object updateNotification(final CapturedNotification notification,
      final Continuation<? super Unit> $completion) {
    return CoroutinesRoom.execute(__db, true, new Callable<Unit>() {
      @Override
      @NonNull
      public Unit call() throws Exception {
        __db.beginTransaction();
        try {
          __updateAdapterOfCapturedNotification.handle(notification);
          __db.setTransactionSuccessful();
          return Unit.INSTANCE;
        } finally {
          __db.endTransaction();
        }
      }
    }, $completion);
  }

  @Override
  public Object deleteById(final long id, final Continuation<? super Unit> $completion) {
    return CoroutinesRoom.execute(__db, true, new Callable<Unit>() {
      @Override
      @NonNull
      public Unit call() throws Exception {
        final SupportSQLiteStatement _stmt = __preparedStmtOfDeleteById.acquire();
        int _argIndex = 1;
        _stmt.bindLong(_argIndex, id);
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
          __preparedStmtOfDeleteById.release(_stmt);
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
  public Object markAsRead(final long id, final Continuation<? super Unit> $completion) {
    return CoroutinesRoom.execute(__db, true, new Callable<Unit>() {
      @Override
      @NonNull
      public Unit call() throws Exception {
        final SupportSQLiteStatement _stmt = __preparedStmtOfMarkAsRead.acquire();
        int _argIndex = 1;
        _stmt.bindLong(_argIndex, id);
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
          __preparedStmtOfMarkAsRead.release(_stmt);
        }
      }
    }, $completion);
  }

  @Override
  public Object markAllAsRead(final Continuation<? super Unit> $completion) {
    return CoroutinesRoom.execute(__db, true, new Callable<Unit>() {
      @Override
      @NonNull
      public Unit call() throws Exception {
        final SupportSQLiteStatement _stmt = __preparedStmtOfMarkAllAsRead.acquire();
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
          __preparedStmtOfMarkAllAsRead.release(_stmt);
        }
      }
    }, $completion);
  }

  @Override
  public Flow<List<CapturedNotification>> getAllNotifications() {
    final String _sql = "SELECT * FROM captured_notifications ORDER BY receivedAt DESC";
    final RoomSQLiteQuery _statement = RoomSQLiteQuery.acquire(_sql, 0);
    return CoroutinesRoom.createFlow(__db, false, new String[] {"captured_notifications"}, new Callable<List<CapturedNotification>>() {
      @Override
      @NonNull
      public List<CapturedNotification> call() throws Exception {
        final Cursor _cursor = DBUtil.query(__db, _statement, false, null);
        try {
          final int _cursorIndexOfId = CursorUtil.getColumnIndexOrThrow(_cursor, "id");
          final int _cursorIndexOfPackageName = CursorUtil.getColumnIndexOrThrow(_cursor, "packageName");
          final int _cursorIndexOfPlatform = CursorUtil.getColumnIndexOrThrow(_cursor, "platform");
          final int _cursorIndexOfSource = CursorUtil.getColumnIndexOrThrow(_cursor, "source");
          final int _cursorIndexOfTitle = CursorUtil.getColumnIndexOrThrow(_cursor, "title");
          final int _cursorIndexOfBody = CursorUtil.getColumnIndexOrThrow(_cursor, "body");
          final int _cursorIndexOfBigText = CursorUtil.getColumnIndexOrThrow(_cursor, "bigText");
          final int _cursorIndexOfSubText = CursorUtil.getColumnIndexOrThrow(_cursor, "subText");
          final int _cursorIndexOfOrderValue = CursorUtil.getColumnIndexOrThrow(_cursor, "orderValue");
          final int _cursorIndexOfPickupLocation = CursorUtil.getColumnIndexOrThrow(_cursor, "pickupLocation");
          final int _cursorIndexOfDropoffLocation = CursorUtil.getColumnIndexOrThrow(_cursor, "dropoffLocation");
          final int _cursorIndexOfDistance = CursorUtil.getColumnIndexOrThrow(_cursor, "distance");
          final int _cursorIndexOfReceivedAt = CursorUtil.getColumnIndexOrThrow(_cursor, "receivedAt");
          final int _cursorIndexOfIsSynced = CursorUtil.getColumnIndexOrThrow(_cursor, "isSynced");
          final int _cursorIndexOfSyncedAt = CursorUtil.getColumnIndexOrThrow(_cursor, "syncedAt");
          final int _cursorIndexOfIsRead = CursorUtil.getColumnIndexOrThrow(_cursor, "isRead");
          final int _cursorIndexOfCategory = CursorUtil.getColumnIndexOrThrow(_cursor, "category");
          final int _cursorIndexOfCurrency = CursorUtil.getColumnIndexOrThrow(_cursor, "currency");
          final int _cursorIndexOfUserMode = CursorUtil.getColumnIndexOrThrow(_cursor, "userMode");
          final List<CapturedNotification> _result = new ArrayList<CapturedNotification>(_cursor.getCount());
          while (_cursor.moveToNext()) {
            final CapturedNotification _item;
            final long _tmpId;
            _tmpId = _cursor.getLong(_cursorIndexOfId);
            final String _tmpPackageName;
            _tmpPackageName = _cursor.getString(_cursorIndexOfPackageName);
            final String _tmpPlatform;
            _tmpPlatform = _cursor.getString(_cursorIndexOfPlatform);
            final String _tmpSource;
            _tmpSource = _cursor.getString(_cursorIndexOfSource);
            final String _tmpTitle;
            _tmpTitle = _cursor.getString(_cursorIndexOfTitle);
            final String _tmpBody;
            _tmpBody = _cursor.getString(_cursorIndexOfBody);
            final String _tmpBigText;
            _tmpBigText = _cursor.getString(_cursorIndexOfBigText);
            final String _tmpSubText;
            _tmpSubText = _cursor.getString(_cursorIndexOfSubText);
            final Double _tmpOrderValue;
            if (_cursor.isNull(_cursorIndexOfOrderValue)) {
              _tmpOrderValue = null;
            } else {
              _tmpOrderValue = _cursor.getDouble(_cursorIndexOfOrderValue);
            }
            final String _tmpPickupLocation;
            if (_cursor.isNull(_cursorIndexOfPickupLocation)) {
              _tmpPickupLocation = null;
            } else {
              _tmpPickupLocation = _cursor.getString(_cursorIndexOfPickupLocation);
            }
            final String _tmpDropoffLocation;
            if (_cursor.isNull(_cursorIndexOfDropoffLocation)) {
              _tmpDropoffLocation = null;
            } else {
              _tmpDropoffLocation = _cursor.getString(_cursorIndexOfDropoffLocation);
            }
            final String _tmpDistance;
            if (_cursor.isNull(_cursorIndexOfDistance)) {
              _tmpDistance = null;
            } else {
              _tmpDistance = _cursor.getString(_cursorIndexOfDistance);
            }
            final long _tmpReceivedAt;
            _tmpReceivedAt = _cursor.getLong(_cursorIndexOfReceivedAt);
            final boolean _tmpIsSynced;
            final int _tmp;
            _tmp = _cursor.getInt(_cursorIndexOfIsSynced);
            _tmpIsSynced = _tmp != 0;
            final Long _tmpSyncedAt;
            if (_cursor.isNull(_cursorIndexOfSyncedAt)) {
              _tmpSyncedAt = null;
            } else {
              _tmpSyncedAt = _cursor.getLong(_cursorIndexOfSyncedAt);
            }
            final boolean _tmpIsRead;
            final int _tmp_1;
            _tmp_1 = _cursor.getInt(_cursorIndexOfIsRead);
            _tmpIsRead = _tmp_1 != 0;
            final String _tmpCategory;
            if (_cursor.isNull(_cursorIndexOfCategory)) {
              _tmpCategory = null;
            } else {
              _tmpCategory = _cursor.getString(_cursorIndexOfCategory);
            }
            final String _tmpCurrency;
            _tmpCurrency = _cursor.getString(_cursorIndexOfCurrency);
            final String _tmpUserMode;
            _tmpUserMode = _cursor.getString(_cursorIndexOfUserMode);
            _item = new CapturedNotification(_tmpId,_tmpPackageName,_tmpPlatform,_tmpSource,_tmpTitle,_tmpBody,_tmpBigText,_tmpSubText,_tmpOrderValue,_tmpPickupLocation,_tmpDropoffLocation,_tmpDistance,_tmpReceivedAt,_tmpIsSynced,_tmpSyncedAt,_tmpIsRead,_tmpCategory,_tmpCurrency,_tmpUserMode);
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
  public Object getNotificationById(final long id,
      final Continuation<? super CapturedNotification> $completion) {
    final String _sql = "SELECT * FROM captured_notifications WHERE id = ?";
    final RoomSQLiteQuery _statement = RoomSQLiteQuery.acquire(_sql, 1);
    int _argIndex = 1;
    _statement.bindLong(_argIndex, id);
    final CancellationSignal _cancellationSignal = DBUtil.createCancellationSignal();
    return CoroutinesRoom.execute(__db, false, _cancellationSignal, new Callable<CapturedNotification>() {
      @Override
      @Nullable
      public CapturedNotification call() throws Exception {
        final Cursor _cursor = DBUtil.query(__db, _statement, false, null);
        try {
          final int _cursorIndexOfId = CursorUtil.getColumnIndexOrThrow(_cursor, "id");
          final int _cursorIndexOfPackageName = CursorUtil.getColumnIndexOrThrow(_cursor, "packageName");
          final int _cursorIndexOfPlatform = CursorUtil.getColumnIndexOrThrow(_cursor, "platform");
          final int _cursorIndexOfSource = CursorUtil.getColumnIndexOrThrow(_cursor, "source");
          final int _cursorIndexOfTitle = CursorUtil.getColumnIndexOrThrow(_cursor, "title");
          final int _cursorIndexOfBody = CursorUtil.getColumnIndexOrThrow(_cursor, "body");
          final int _cursorIndexOfBigText = CursorUtil.getColumnIndexOrThrow(_cursor, "bigText");
          final int _cursorIndexOfSubText = CursorUtil.getColumnIndexOrThrow(_cursor, "subText");
          final int _cursorIndexOfOrderValue = CursorUtil.getColumnIndexOrThrow(_cursor, "orderValue");
          final int _cursorIndexOfPickupLocation = CursorUtil.getColumnIndexOrThrow(_cursor, "pickupLocation");
          final int _cursorIndexOfDropoffLocation = CursorUtil.getColumnIndexOrThrow(_cursor, "dropoffLocation");
          final int _cursorIndexOfDistance = CursorUtil.getColumnIndexOrThrow(_cursor, "distance");
          final int _cursorIndexOfReceivedAt = CursorUtil.getColumnIndexOrThrow(_cursor, "receivedAt");
          final int _cursorIndexOfIsSynced = CursorUtil.getColumnIndexOrThrow(_cursor, "isSynced");
          final int _cursorIndexOfSyncedAt = CursorUtil.getColumnIndexOrThrow(_cursor, "syncedAt");
          final int _cursorIndexOfIsRead = CursorUtil.getColumnIndexOrThrow(_cursor, "isRead");
          final int _cursorIndexOfCategory = CursorUtil.getColumnIndexOrThrow(_cursor, "category");
          final int _cursorIndexOfCurrency = CursorUtil.getColumnIndexOrThrow(_cursor, "currency");
          final int _cursorIndexOfUserMode = CursorUtil.getColumnIndexOrThrow(_cursor, "userMode");
          final CapturedNotification _result;
          if (_cursor.moveToFirst()) {
            final long _tmpId;
            _tmpId = _cursor.getLong(_cursorIndexOfId);
            final String _tmpPackageName;
            _tmpPackageName = _cursor.getString(_cursorIndexOfPackageName);
            final String _tmpPlatform;
            _tmpPlatform = _cursor.getString(_cursorIndexOfPlatform);
            final String _tmpSource;
            _tmpSource = _cursor.getString(_cursorIndexOfSource);
            final String _tmpTitle;
            _tmpTitle = _cursor.getString(_cursorIndexOfTitle);
            final String _tmpBody;
            _tmpBody = _cursor.getString(_cursorIndexOfBody);
            final String _tmpBigText;
            _tmpBigText = _cursor.getString(_cursorIndexOfBigText);
            final String _tmpSubText;
            _tmpSubText = _cursor.getString(_cursorIndexOfSubText);
            final Double _tmpOrderValue;
            if (_cursor.isNull(_cursorIndexOfOrderValue)) {
              _tmpOrderValue = null;
            } else {
              _tmpOrderValue = _cursor.getDouble(_cursorIndexOfOrderValue);
            }
            final String _tmpPickupLocation;
            if (_cursor.isNull(_cursorIndexOfPickupLocation)) {
              _tmpPickupLocation = null;
            } else {
              _tmpPickupLocation = _cursor.getString(_cursorIndexOfPickupLocation);
            }
            final String _tmpDropoffLocation;
            if (_cursor.isNull(_cursorIndexOfDropoffLocation)) {
              _tmpDropoffLocation = null;
            } else {
              _tmpDropoffLocation = _cursor.getString(_cursorIndexOfDropoffLocation);
            }
            final String _tmpDistance;
            if (_cursor.isNull(_cursorIndexOfDistance)) {
              _tmpDistance = null;
            } else {
              _tmpDistance = _cursor.getString(_cursorIndexOfDistance);
            }
            final long _tmpReceivedAt;
            _tmpReceivedAt = _cursor.getLong(_cursorIndexOfReceivedAt);
            final boolean _tmpIsSynced;
            final int _tmp;
            _tmp = _cursor.getInt(_cursorIndexOfIsSynced);
            _tmpIsSynced = _tmp != 0;
            final Long _tmpSyncedAt;
            if (_cursor.isNull(_cursorIndexOfSyncedAt)) {
              _tmpSyncedAt = null;
            } else {
              _tmpSyncedAt = _cursor.getLong(_cursorIndexOfSyncedAt);
            }
            final boolean _tmpIsRead;
            final int _tmp_1;
            _tmp_1 = _cursor.getInt(_cursorIndexOfIsRead);
            _tmpIsRead = _tmp_1 != 0;
            final String _tmpCategory;
            if (_cursor.isNull(_cursorIndexOfCategory)) {
              _tmpCategory = null;
            } else {
              _tmpCategory = _cursor.getString(_cursorIndexOfCategory);
            }
            final String _tmpCurrency;
            _tmpCurrency = _cursor.getString(_cursorIndexOfCurrency);
            final String _tmpUserMode;
            _tmpUserMode = _cursor.getString(_cursorIndexOfUserMode);
            _result = new CapturedNotification(_tmpId,_tmpPackageName,_tmpPlatform,_tmpSource,_tmpTitle,_tmpBody,_tmpBigText,_tmpSubText,_tmpOrderValue,_tmpPickupLocation,_tmpDropoffLocation,_tmpDistance,_tmpReceivedAt,_tmpIsSynced,_tmpSyncedAt,_tmpIsRead,_tmpCategory,_tmpCurrency,_tmpUserMode);
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
  public Flow<CapturedNotification> getNotificationByIdFlow(final long id) {
    final String _sql = "SELECT * FROM captured_notifications WHERE id = ?";
    final RoomSQLiteQuery _statement = RoomSQLiteQuery.acquire(_sql, 1);
    int _argIndex = 1;
    _statement.bindLong(_argIndex, id);
    return CoroutinesRoom.createFlow(__db, false, new String[] {"captured_notifications"}, new Callable<CapturedNotification>() {
      @Override
      @Nullable
      public CapturedNotification call() throws Exception {
        final Cursor _cursor = DBUtil.query(__db, _statement, false, null);
        try {
          final int _cursorIndexOfId = CursorUtil.getColumnIndexOrThrow(_cursor, "id");
          final int _cursorIndexOfPackageName = CursorUtil.getColumnIndexOrThrow(_cursor, "packageName");
          final int _cursorIndexOfPlatform = CursorUtil.getColumnIndexOrThrow(_cursor, "platform");
          final int _cursorIndexOfSource = CursorUtil.getColumnIndexOrThrow(_cursor, "source");
          final int _cursorIndexOfTitle = CursorUtil.getColumnIndexOrThrow(_cursor, "title");
          final int _cursorIndexOfBody = CursorUtil.getColumnIndexOrThrow(_cursor, "body");
          final int _cursorIndexOfBigText = CursorUtil.getColumnIndexOrThrow(_cursor, "bigText");
          final int _cursorIndexOfSubText = CursorUtil.getColumnIndexOrThrow(_cursor, "subText");
          final int _cursorIndexOfOrderValue = CursorUtil.getColumnIndexOrThrow(_cursor, "orderValue");
          final int _cursorIndexOfPickupLocation = CursorUtil.getColumnIndexOrThrow(_cursor, "pickupLocation");
          final int _cursorIndexOfDropoffLocation = CursorUtil.getColumnIndexOrThrow(_cursor, "dropoffLocation");
          final int _cursorIndexOfDistance = CursorUtil.getColumnIndexOrThrow(_cursor, "distance");
          final int _cursorIndexOfReceivedAt = CursorUtil.getColumnIndexOrThrow(_cursor, "receivedAt");
          final int _cursorIndexOfIsSynced = CursorUtil.getColumnIndexOrThrow(_cursor, "isSynced");
          final int _cursorIndexOfSyncedAt = CursorUtil.getColumnIndexOrThrow(_cursor, "syncedAt");
          final int _cursorIndexOfIsRead = CursorUtil.getColumnIndexOrThrow(_cursor, "isRead");
          final int _cursorIndexOfCategory = CursorUtil.getColumnIndexOrThrow(_cursor, "category");
          final int _cursorIndexOfCurrency = CursorUtil.getColumnIndexOrThrow(_cursor, "currency");
          final int _cursorIndexOfUserMode = CursorUtil.getColumnIndexOrThrow(_cursor, "userMode");
          final CapturedNotification _result;
          if (_cursor.moveToFirst()) {
            final long _tmpId;
            _tmpId = _cursor.getLong(_cursorIndexOfId);
            final String _tmpPackageName;
            _tmpPackageName = _cursor.getString(_cursorIndexOfPackageName);
            final String _tmpPlatform;
            _tmpPlatform = _cursor.getString(_cursorIndexOfPlatform);
            final String _tmpSource;
            _tmpSource = _cursor.getString(_cursorIndexOfSource);
            final String _tmpTitle;
            _tmpTitle = _cursor.getString(_cursorIndexOfTitle);
            final String _tmpBody;
            _tmpBody = _cursor.getString(_cursorIndexOfBody);
            final String _tmpBigText;
            _tmpBigText = _cursor.getString(_cursorIndexOfBigText);
            final String _tmpSubText;
            _tmpSubText = _cursor.getString(_cursorIndexOfSubText);
            final Double _tmpOrderValue;
            if (_cursor.isNull(_cursorIndexOfOrderValue)) {
              _tmpOrderValue = null;
            } else {
              _tmpOrderValue = _cursor.getDouble(_cursorIndexOfOrderValue);
            }
            final String _tmpPickupLocation;
            if (_cursor.isNull(_cursorIndexOfPickupLocation)) {
              _tmpPickupLocation = null;
            } else {
              _tmpPickupLocation = _cursor.getString(_cursorIndexOfPickupLocation);
            }
            final String _tmpDropoffLocation;
            if (_cursor.isNull(_cursorIndexOfDropoffLocation)) {
              _tmpDropoffLocation = null;
            } else {
              _tmpDropoffLocation = _cursor.getString(_cursorIndexOfDropoffLocation);
            }
            final String _tmpDistance;
            if (_cursor.isNull(_cursorIndexOfDistance)) {
              _tmpDistance = null;
            } else {
              _tmpDistance = _cursor.getString(_cursorIndexOfDistance);
            }
            final long _tmpReceivedAt;
            _tmpReceivedAt = _cursor.getLong(_cursorIndexOfReceivedAt);
            final boolean _tmpIsSynced;
            final int _tmp;
            _tmp = _cursor.getInt(_cursorIndexOfIsSynced);
            _tmpIsSynced = _tmp != 0;
            final Long _tmpSyncedAt;
            if (_cursor.isNull(_cursorIndexOfSyncedAt)) {
              _tmpSyncedAt = null;
            } else {
              _tmpSyncedAt = _cursor.getLong(_cursorIndexOfSyncedAt);
            }
            final boolean _tmpIsRead;
            final int _tmp_1;
            _tmp_1 = _cursor.getInt(_cursorIndexOfIsRead);
            _tmpIsRead = _tmp_1 != 0;
            final String _tmpCategory;
            if (_cursor.isNull(_cursorIndexOfCategory)) {
              _tmpCategory = null;
            } else {
              _tmpCategory = _cursor.getString(_cursorIndexOfCategory);
            }
            final String _tmpCurrency;
            _tmpCurrency = _cursor.getString(_cursorIndexOfCurrency);
            final String _tmpUserMode;
            _tmpUserMode = _cursor.getString(_cursorIndexOfUserMode);
            _result = new CapturedNotification(_tmpId,_tmpPackageName,_tmpPlatform,_tmpSource,_tmpTitle,_tmpBody,_tmpBigText,_tmpSubText,_tmpOrderValue,_tmpPickupLocation,_tmpDropoffLocation,_tmpDistance,_tmpReceivedAt,_tmpIsSynced,_tmpSyncedAt,_tmpIsRead,_tmpCategory,_tmpCurrency,_tmpUserMode);
          } else {
            _result = null;
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
  public Flow<List<CapturedNotification>> getNotificationsByPackage(final String packageName) {
    final String _sql = "SELECT * FROM captured_notifications WHERE packageName = ? ORDER BY receivedAt DESC";
    final RoomSQLiteQuery _statement = RoomSQLiteQuery.acquire(_sql, 1);
    int _argIndex = 1;
    _statement.bindString(_argIndex, packageName);
    return CoroutinesRoom.createFlow(__db, false, new String[] {"captured_notifications"}, new Callable<List<CapturedNotification>>() {
      @Override
      @NonNull
      public List<CapturedNotification> call() throws Exception {
        final Cursor _cursor = DBUtil.query(__db, _statement, false, null);
        try {
          final int _cursorIndexOfId = CursorUtil.getColumnIndexOrThrow(_cursor, "id");
          final int _cursorIndexOfPackageName = CursorUtil.getColumnIndexOrThrow(_cursor, "packageName");
          final int _cursorIndexOfPlatform = CursorUtil.getColumnIndexOrThrow(_cursor, "platform");
          final int _cursorIndexOfSource = CursorUtil.getColumnIndexOrThrow(_cursor, "source");
          final int _cursorIndexOfTitle = CursorUtil.getColumnIndexOrThrow(_cursor, "title");
          final int _cursorIndexOfBody = CursorUtil.getColumnIndexOrThrow(_cursor, "body");
          final int _cursorIndexOfBigText = CursorUtil.getColumnIndexOrThrow(_cursor, "bigText");
          final int _cursorIndexOfSubText = CursorUtil.getColumnIndexOrThrow(_cursor, "subText");
          final int _cursorIndexOfOrderValue = CursorUtil.getColumnIndexOrThrow(_cursor, "orderValue");
          final int _cursorIndexOfPickupLocation = CursorUtil.getColumnIndexOrThrow(_cursor, "pickupLocation");
          final int _cursorIndexOfDropoffLocation = CursorUtil.getColumnIndexOrThrow(_cursor, "dropoffLocation");
          final int _cursorIndexOfDistance = CursorUtil.getColumnIndexOrThrow(_cursor, "distance");
          final int _cursorIndexOfReceivedAt = CursorUtil.getColumnIndexOrThrow(_cursor, "receivedAt");
          final int _cursorIndexOfIsSynced = CursorUtil.getColumnIndexOrThrow(_cursor, "isSynced");
          final int _cursorIndexOfSyncedAt = CursorUtil.getColumnIndexOrThrow(_cursor, "syncedAt");
          final int _cursorIndexOfIsRead = CursorUtil.getColumnIndexOrThrow(_cursor, "isRead");
          final int _cursorIndexOfCategory = CursorUtil.getColumnIndexOrThrow(_cursor, "category");
          final int _cursorIndexOfCurrency = CursorUtil.getColumnIndexOrThrow(_cursor, "currency");
          final int _cursorIndexOfUserMode = CursorUtil.getColumnIndexOrThrow(_cursor, "userMode");
          final List<CapturedNotification> _result = new ArrayList<CapturedNotification>(_cursor.getCount());
          while (_cursor.moveToNext()) {
            final CapturedNotification _item;
            final long _tmpId;
            _tmpId = _cursor.getLong(_cursorIndexOfId);
            final String _tmpPackageName;
            _tmpPackageName = _cursor.getString(_cursorIndexOfPackageName);
            final String _tmpPlatform;
            _tmpPlatform = _cursor.getString(_cursorIndexOfPlatform);
            final String _tmpSource;
            _tmpSource = _cursor.getString(_cursorIndexOfSource);
            final String _tmpTitle;
            _tmpTitle = _cursor.getString(_cursorIndexOfTitle);
            final String _tmpBody;
            _tmpBody = _cursor.getString(_cursorIndexOfBody);
            final String _tmpBigText;
            _tmpBigText = _cursor.getString(_cursorIndexOfBigText);
            final String _tmpSubText;
            _tmpSubText = _cursor.getString(_cursorIndexOfSubText);
            final Double _tmpOrderValue;
            if (_cursor.isNull(_cursorIndexOfOrderValue)) {
              _tmpOrderValue = null;
            } else {
              _tmpOrderValue = _cursor.getDouble(_cursorIndexOfOrderValue);
            }
            final String _tmpPickupLocation;
            if (_cursor.isNull(_cursorIndexOfPickupLocation)) {
              _tmpPickupLocation = null;
            } else {
              _tmpPickupLocation = _cursor.getString(_cursorIndexOfPickupLocation);
            }
            final String _tmpDropoffLocation;
            if (_cursor.isNull(_cursorIndexOfDropoffLocation)) {
              _tmpDropoffLocation = null;
            } else {
              _tmpDropoffLocation = _cursor.getString(_cursorIndexOfDropoffLocation);
            }
            final String _tmpDistance;
            if (_cursor.isNull(_cursorIndexOfDistance)) {
              _tmpDistance = null;
            } else {
              _tmpDistance = _cursor.getString(_cursorIndexOfDistance);
            }
            final long _tmpReceivedAt;
            _tmpReceivedAt = _cursor.getLong(_cursorIndexOfReceivedAt);
            final boolean _tmpIsSynced;
            final int _tmp;
            _tmp = _cursor.getInt(_cursorIndexOfIsSynced);
            _tmpIsSynced = _tmp != 0;
            final Long _tmpSyncedAt;
            if (_cursor.isNull(_cursorIndexOfSyncedAt)) {
              _tmpSyncedAt = null;
            } else {
              _tmpSyncedAt = _cursor.getLong(_cursorIndexOfSyncedAt);
            }
            final boolean _tmpIsRead;
            final int _tmp_1;
            _tmp_1 = _cursor.getInt(_cursorIndexOfIsRead);
            _tmpIsRead = _tmp_1 != 0;
            final String _tmpCategory;
            if (_cursor.isNull(_cursorIndexOfCategory)) {
              _tmpCategory = null;
            } else {
              _tmpCategory = _cursor.getString(_cursorIndexOfCategory);
            }
            final String _tmpCurrency;
            _tmpCurrency = _cursor.getString(_cursorIndexOfCurrency);
            final String _tmpUserMode;
            _tmpUserMode = _cursor.getString(_cursorIndexOfUserMode);
            _item = new CapturedNotification(_tmpId,_tmpPackageName,_tmpPlatform,_tmpSource,_tmpTitle,_tmpBody,_tmpBigText,_tmpSubText,_tmpOrderValue,_tmpPickupLocation,_tmpDropoffLocation,_tmpDistance,_tmpReceivedAt,_tmpIsSynced,_tmpSyncedAt,_tmpIsRead,_tmpCategory,_tmpCurrency,_tmpUserMode);
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
  public Flow<List<CapturedNotification>> getNotificationsByPlatform(final String platform) {
    final String _sql = "SELECT * FROM captured_notifications WHERE platform = ? ORDER BY receivedAt DESC";
    final RoomSQLiteQuery _statement = RoomSQLiteQuery.acquire(_sql, 1);
    int _argIndex = 1;
    _statement.bindString(_argIndex, platform);
    return CoroutinesRoom.createFlow(__db, false, new String[] {"captured_notifications"}, new Callable<List<CapturedNotification>>() {
      @Override
      @NonNull
      public List<CapturedNotification> call() throws Exception {
        final Cursor _cursor = DBUtil.query(__db, _statement, false, null);
        try {
          final int _cursorIndexOfId = CursorUtil.getColumnIndexOrThrow(_cursor, "id");
          final int _cursorIndexOfPackageName = CursorUtil.getColumnIndexOrThrow(_cursor, "packageName");
          final int _cursorIndexOfPlatform = CursorUtil.getColumnIndexOrThrow(_cursor, "platform");
          final int _cursorIndexOfSource = CursorUtil.getColumnIndexOrThrow(_cursor, "source");
          final int _cursorIndexOfTitle = CursorUtil.getColumnIndexOrThrow(_cursor, "title");
          final int _cursorIndexOfBody = CursorUtil.getColumnIndexOrThrow(_cursor, "body");
          final int _cursorIndexOfBigText = CursorUtil.getColumnIndexOrThrow(_cursor, "bigText");
          final int _cursorIndexOfSubText = CursorUtil.getColumnIndexOrThrow(_cursor, "subText");
          final int _cursorIndexOfOrderValue = CursorUtil.getColumnIndexOrThrow(_cursor, "orderValue");
          final int _cursorIndexOfPickupLocation = CursorUtil.getColumnIndexOrThrow(_cursor, "pickupLocation");
          final int _cursorIndexOfDropoffLocation = CursorUtil.getColumnIndexOrThrow(_cursor, "dropoffLocation");
          final int _cursorIndexOfDistance = CursorUtil.getColumnIndexOrThrow(_cursor, "distance");
          final int _cursorIndexOfReceivedAt = CursorUtil.getColumnIndexOrThrow(_cursor, "receivedAt");
          final int _cursorIndexOfIsSynced = CursorUtil.getColumnIndexOrThrow(_cursor, "isSynced");
          final int _cursorIndexOfSyncedAt = CursorUtil.getColumnIndexOrThrow(_cursor, "syncedAt");
          final int _cursorIndexOfIsRead = CursorUtil.getColumnIndexOrThrow(_cursor, "isRead");
          final int _cursorIndexOfCategory = CursorUtil.getColumnIndexOrThrow(_cursor, "category");
          final int _cursorIndexOfCurrency = CursorUtil.getColumnIndexOrThrow(_cursor, "currency");
          final int _cursorIndexOfUserMode = CursorUtil.getColumnIndexOrThrow(_cursor, "userMode");
          final List<CapturedNotification> _result = new ArrayList<CapturedNotification>(_cursor.getCount());
          while (_cursor.moveToNext()) {
            final CapturedNotification _item;
            final long _tmpId;
            _tmpId = _cursor.getLong(_cursorIndexOfId);
            final String _tmpPackageName;
            _tmpPackageName = _cursor.getString(_cursorIndexOfPackageName);
            final String _tmpPlatform;
            _tmpPlatform = _cursor.getString(_cursorIndexOfPlatform);
            final String _tmpSource;
            _tmpSource = _cursor.getString(_cursorIndexOfSource);
            final String _tmpTitle;
            _tmpTitle = _cursor.getString(_cursorIndexOfTitle);
            final String _tmpBody;
            _tmpBody = _cursor.getString(_cursorIndexOfBody);
            final String _tmpBigText;
            _tmpBigText = _cursor.getString(_cursorIndexOfBigText);
            final String _tmpSubText;
            _tmpSubText = _cursor.getString(_cursorIndexOfSubText);
            final Double _tmpOrderValue;
            if (_cursor.isNull(_cursorIndexOfOrderValue)) {
              _tmpOrderValue = null;
            } else {
              _tmpOrderValue = _cursor.getDouble(_cursorIndexOfOrderValue);
            }
            final String _tmpPickupLocation;
            if (_cursor.isNull(_cursorIndexOfPickupLocation)) {
              _tmpPickupLocation = null;
            } else {
              _tmpPickupLocation = _cursor.getString(_cursorIndexOfPickupLocation);
            }
            final String _tmpDropoffLocation;
            if (_cursor.isNull(_cursorIndexOfDropoffLocation)) {
              _tmpDropoffLocation = null;
            } else {
              _tmpDropoffLocation = _cursor.getString(_cursorIndexOfDropoffLocation);
            }
            final String _tmpDistance;
            if (_cursor.isNull(_cursorIndexOfDistance)) {
              _tmpDistance = null;
            } else {
              _tmpDistance = _cursor.getString(_cursorIndexOfDistance);
            }
            final long _tmpReceivedAt;
            _tmpReceivedAt = _cursor.getLong(_cursorIndexOfReceivedAt);
            final boolean _tmpIsSynced;
            final int _tmp;
            _tmp = _cursor.getInt(_cursorIndexOfIsSynced);
            _tmpIsSynced = _tmp != 0;
            final Long _tmpSyncedAt;
            if (_cursor.isNull(_cursorIndexOfSyncedAt)) {
              _tmpSyncedAt = null;
            } else {
              _tmpSyncedAt = _cursor.getLong(_cursorIndexOfSyncedAt);
            }
            final boolean _tmpIsRead;
            final int _tmp_1;
            _tmp_1 = _cursor.getInt(_cursorIndexOfIsRead);
            _tmpIsRead = _tmp_1 != 0;
            final String _tmpCategory;
            if (_cursor.isNull(_cursorIndexOfCategory)) {
              _tmpCategory = null;
            } else {
              _tmpCategory = _cursor.getString(_cursorIndexOfCategory);
            }
            final String _tmpCurrency;
            _tmpCurrency = _cursor.getString(_cursorIndexOfCurrency);
            final String _tmpUserMode;
            _tmpUserMode = _cursor.getString(_cursorIndexOfUserMode);
            _item = new CapturedNotification(_tmpId,_tmpPackageName,_tmpPlatform,_tmpSource,_tmpTitle,_tmpBody,_tmpBigText,_tmpSubText,_tmpOrderValue,_tmpPickupLocation,_tmpDropoffLocation,_tmpDistance,_tmpReceivedAt,_tmpIsSynced,_tmpSyncedAt,_tmpIsRead,_tmpCategory,_tmpCurrency,_tmpUserMode);
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
  public Object getUnsyncedNotifications(
      final Continuation<? super List<CapturedNotification>> $completion) {
    final String _sql = "SELECT * FROM captured_notifications WHERE isSynced = 0";
    final RoomSQLiteQuery _statement = RoomSQLiteQuery.acquire(_sql, 0);
    final CancellationSignal _cancellationSignal = DBUtil.createCancellationSignal();
    return CoroutinesRoom.execute(__db, false, _cancellationSignal, new Callable<List<CapturedNotification>>() {
      @Override
      @NonNull
      public List<CapturedNotification> call() throws Exception {
        final Cursor _cursor = DBUtil.query(__db, _statement, false, null);
        try {
          final int _cursorIndexOfId = CursorUtil.getColumnIndexOrThrow(_cursor, "id");
          final int _cursorIndexOfPackageName = CursorUtil.getColumnIndexOrThrow(_cursor, "packageName");
          final int _cursorIndexOfPlatform = CursorUtil.getColumnIndexOrThrow(_cursor, "platform");
          final int _cursorIndexOfSource = CursorUtil.getColumnIndexOrThrow(_cursor, "source");
          final int _cursorIndexOfTitle = CursorUtil.getColumnIndexOrThrow(_cursor, "title");
          final int _cursorIndexOfBody = CursorUtil.getColumnIndexOrThrow(_cursor, "body");
          final int _cursorIndexOfBigText = CursorUtil.getColumnIndexOrThrow(_cursor, "bigText");
          final int _cursorIndexOfSubText = CursorUtil.getColumnIndexOrThrow(_cursor, "subText");
          final int _cursorIndexOfOrderValue = CursorUtil.getColumnIndexOrThrow(_cursor, "orderValue");
          final int _cursorIndexOfPickupLocation = CursorUtil.getColumnIndexOrThrow(_cursor, "pickupLocation");
          final int _cursorIndexOfDropoffLocation = CursorUtil.getColumnIndexOrThrow(_cursor, "dropoffLocation");
          final int _cursorIndexOfDistance = CursorUtil.getColumnIndexOrThrow(_cursor, "distance");
          final int _cursorIndexOfReceivedAt = CursorUtil.getColumnIndexOrThrow(_cursor, "receivedAt");
          final int _cursorIndexOfIsSynced = CursorUtil.getColumnIndexOrThrow(_cursor, "isSynced");
          final int _cursorIndexOfSyncedAt = CursorUtil.getColumnIndexOrThrow(_cursor, "syncedAt");
          final int _cursorIndexOfIsRead = CursorUtil.getColumnIndexOrThrow(_cursor, "isRead");
          final int _cursorIndexOfCategory = CursorUtil.getColumnIndexOrThrow(_cursor, "category");
          final int _cursorIndexOfCurrency = CursorUtil.getColumnIndexOrThrow(_cursor, "currency");
          final int _cursorIndexOfUserMode = CursorUtil.getColumnIndexOrThrow(_cursor, "userMode");
          final List<CapturedNotification> _result = new ArrayList<CapturedNotification>(_cursor.getCount());
          while (_cursor.moveToNext()) {
            final CapturedNotification _item;
            final long _tmpId;
            _tmpId = _cursor.getLong(_cursorIndexOfId);
            final String _tmpPackageName;
            _tmpPackageName = _cursor.getString(_cursorIndexOfPackageName);
            final String _tmpPlatform;
            _tmpPlatform = _cursor.getString(_cursorIndexOfPlatform);
            final String _tmpSource;
            _tmpSource = _cursor.getString(_cursorIndexOfSource);
            final String _tmpTitle;
            _tmpTitle = _cursor.getString(_cursorIndexOfTitle);
            final String _tmpBody;
            _tmpBody = _cursor.getString(_cursorIndexOfBody);
            final String _tmpBigText;
            _tmpBigText = _cursor.getString(_cursorIndexOfBigText);
            final String _tmpSubText;
            _tmpSubText = _cursor.getString(_cursorIndexOfSubText);
            final Double _tmpOrderValue;
            if (_cursor.isNull(_cursorIndexOfOrderValue)) {
              _tmpOrderValue = null;
            } else {
              _tmpOrderValue = _cursor.getDouble(_cursorIndexOfOrderValue);
            }
            final String _tmpPickupLocation;
            if (_cursor.isNull(_cursorIndexOfPickupLocation)) {
              _tmpPickupLocation = null;
            } else {
              _tmpPickupLocation = _cursor.getString(_cursorIndexOfPickupLocation);
            }
            final String _tmpDropoffLocation;
            if (_cursor.isNull(_cursorIndexOfDropoffLocation)) {
              _tmpDropoffLocation = null;
            } else {
              _tmpDropoffLocation = _cursor.getString(_cursorIndexOfDropoffLocation);
            }
            final String _tmpDistance;
            if (_cursor.isNull(_cursorIndexOfDistance)) {
              _tmpDistance = null;
            } else {
              _tmpDistance = _cursor.getString(_cursorIndexOfDistance);
            }
            final long _tmpReceivedAt;
            _tmpReceivedAt = _cursor.getLong(_cursorIndexOfReceivedAt);
            final boolean _tmpIsSynced;
            final int _tmp;
            _tmp = _cursor.getInt(_cursorIndexOfIsSynced);
            _tmpIsSynced = _tmp != 0;
            final Long _tmpSyncedAt;
            if (_cursor.isNull(_cursorIndexOfSyncedAt)) {
              _tmpSyncedAt = null;
            } else {
              _tmpSyncedAt = _cursor.getLong(_cursorIndexOfSyncedAt);
            }
            final boolean _tmpIsRead;
            final int _tmp_1;
            _tmp_1 = _cursor.getInt(_cursorIndexOfIsRead);
            _tmpIsRead = _tmp_1 != 0;
            final String _tmpCategory;
            if (_cursor.isNull(_cursorIndexOfCategory)) {
              _tmpCategory = null;
            } else {
              _tmpCategory = _cursor.getString(_cursorIndexOfCategory);
            }
            final String _tmpCurrency;
            _tmpCurrency = _cursor.getString(_cursorIndexOfCurrency);
            final String _tmpUserMode;
            _tmpUserMode = _cursor.getString(_cursorIndexOfUserMode);
            _item = new CapturedNotification(_tmpId,_tmpPackageName,_tmpPlatform,_tmpSource,_tmpTitle,_tmpBody,_tmpBigText,_tmpSubText,_tmpOrderValue,_tmpPickupLocation,_tmpDropoffLocation,_tmpDistance,_tmpReceivedAt,_tmpIsSynced,_tmpSyncedAt,_tmpIsRead,_tmpCategory,_tmpCurrency,_tmpUserMode);
            _result.add(_item);
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
  public Flow<Integer> getUnreadCount() {
    final String _sql = "SELECT COUNT(*) FROM captured_notifications WHERE isRead = 0";
    final RoomSQLiteQuery _statement = RoomSQLiteQuery.acquire(_sql, 0);
    return CoroutinesRoom.createFlow(__db, false, new String[] {"captured_notifications"}, new Callable<Integer>() {
      @Override
      @NonNull
      public Integer call() throws Exception {
        final Cursor _cursor = DBUtil.query(__db, _statement, false, null);
        try {
          final Integer _result;
          if (_cursor.moveToFirst()) {
            final int _tmp;
            _tmp = _cursor.getInt(0);
            _result = _tmp;
          } else {
            _result = 0;
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
  public Flow<Integer> getTotalCount() {
    final String _sql = "SELECT COUNT(*) FROM captured_notifications";
    final RoomSQLiteQuery _statement = RoomSQLiteQuery.acquire(_sql, 0);
    return CoroutinesRoom.createFlow(__db, false, new String[] {"captured_notifications"}, new Callable<Integer>() {
      @Override
      @NonNull
      public Integer call() throws Exception {
        final Cursor _cursor = DBUtil.query(__db, _statement, false, null);
        try {
          final Integer _result;
          if (_cursor.moveToFirst()) {
            final int _tmp;
            _tmp = _cursor.getInt(0);
            _result = _tmp;
          } else {
            _result = 0;
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
  public Flow<Integer> getCountByPlatform(final String platform) {
    final String _sql = "SELECT COUNT(*) FROM captured_notifications WHERE platform = ?";
    final RoomSQLiteQuery _statement = RoomSQLiteQuery.acquire(_sql, 1);
    int _argIndex = 1;
    _statement.bindString(_argIndex, platform);
    return CoroutinesRoom.createFlow(__db, false, new String[] {"captured_notifications"}, new Callable<Integer>() {
      @Override
      @NonNull
      public Integer call() throws Exception {
        final Cursor _cursor = DBUtil.query(__db, _statement, false, null);
        try {
          final Integer _result;
          if (_cursor.moveToFirst()) {
            final int _tmp;
            _tmp = _cursor.getInt(0);
            _result = _tmp;
          } else {
            _result = 0;
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
  public Flow<Integer> getCountInTimeRange(final long startTime, final long endTime) {
    final String _sql = "SELECT COUNT(*) FROM captured_notifications WHERE receivedAt >= ? AND receivedAt <= ?";
    final RoomSQLiteQuery _statement = RoomSQLiteQuery.acquire(_sql, 2);
    int _argIndex = 1;
    _statement.bindLong(_argIndex, startTime);
    _argIndex = 2;
    _statement.bindLong(_argIndex, endTime);
    return CoroutinesRoom.createFlow(__db, false, new String[] {"captured_notifications"}, new Callable<Integer>() {
      @Override
      @NonNull
      public Integer call() throws Exception {
        final Cursor _cursor = DBUtil.query(__db, _statement, false, null);
        try {
          final Integer _result;
          if (_cursor.moveToFirst()) {
            final int _tmp;
            _tmp = _cursor.getInt(0);
            _result = _tmp;
          } else {
            _result = 0;
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
  public Flow<Double> getTotalOrderValueSince(final long startTime) {
    final String _sql = "SELECT COALESCE(SUM(orderValue), 0.0) FROM captured_notifications WHERE orderValue IS NOT NULL AND receivedAt >= ?";
    final RoomSQLiteQuery _statement = RoomSQLiteQuery.acquire(_sql, 1);
    int _argIndex = 1;
    _statement.bindLong(_argIndex, startTime);
    return CoroutinesRoom.createFlow(__db, false, new String[] {"captured_notifications"}, new Callable<Double>() {
      @Override
      @NonNull
      public Double call() throws Exception {
        final Cursor _cursor = DBUtil.query(__db, _statement, false, null);
        try {
          final Double _result;
          if (_cursor.moveToFirst()) {
            final double _tmp;
            _tmp = _cursor.getDouble(0);
            _result = _tmp;
          } else {
            _result = 0.0;
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
  public Flow<List<NotificationDao.PlatformStat>> getNotificationCountByPlatform() {
    final String _sql = "SELECT packageName, platform, COUNT(*) as count FROM captured_notifications GROUP BY packageName ORDER BY count DESC";
    final RoomSQLiteQuery _statement = RoomSQLiteQuery.acquire(_sql, 0);
    return CoroutinesRoom.createFlow(__db, false, new String[] {"captured_notifications"}, new Callable<List<NotificationDao.PlatformStat>>() {
      @Override
      @NonNull
      public List<NotificationDao.PlatformStat> call() throws Exception {
        final Cursor _cursor = DBUtil.query(__db, _statement, false, null);
        try {
          final int _cursorIndexOfPackageName = 0;
          final int _cursorIndexOfPlatform = 1;
          final int _cursorIndexOfCount = 2;
          final List<NotificationDao.PlatformStat> _result = new ArrayList<NotificationDao.PlatformStat>(_cursor.getCount());
          while (_cursor.moveToNext()) {
            final NotificationDao.PlatformStat _item;
            final String _tmpPackageName;
            _tmpPackageName = _cursor.getString(_cursorIndexOfPackageName);
            final String _tmpPlatform;
            _tmpPlatform = _cursor.getString(_cursorIndexOfPlatform);
            final int _tmpCount;
            _tmpCount = _cursor.getInt(_cursorIndexOfCount);
            _item = new NotificationDao.PlatformStat(_tmpPackageName,_tmpPlatform,_tmpCount);
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
  public Flow<List<NotificationDao.PlatformEarningStat>> getOrderValueByPlatformSince(
      final long startTime) {
    final String _sql = "SELECT packageName, platform, COALESCE(SUM(orderValue), 0.0) as totalValue FROM captured_notifications WHERE orderValue IS NOT NULL AND receivedAt >= ? GROUP BY packageName ORDER BY totalValue DESC";
    final RoomSQLiteQuery _statement = RoomSQLiteQuery.acquire(_sql, 1);
    int _argIndex = 1;
    _statement.bindLong(_argIndex, startTime);
    return CoroutinesRoom.createFlow(__db, false, new String[] {"captured_notifications"}, new Callable<List<NotificationDao.PlatformEarningStat>>() {
      @Override
      @NonNull
      public List<NotificationDao.PlatformEarningStat> call() throws Exception {
        final Cursor _cursor = DBUtil.query(__db, _statement, false, null);
        try {
          final int _cursorIndexOfPackageName = 0;
          final int _cursorIndexOfPlatform = 1;
          final int _cursorIndexOfTotalValue = 2;
          final List<NotificationDao.PlatformEarningStat> _result = new ArrayList<NotificationDao.PlatformEarningStat>(_cursor.getCount());
          while (_cursor.moveToNext()) {
            final NotificationDao.PlatformEarningStat _item;
            final String _tmpPackageName;
            _tmpPackageName = _cursor.getString(_cursorIndexOfPackageName);
            final String _tmpPlatform;
            _tmpPlatform = _cursor.getString(_cursorIndexOfPlatform);
            final double _tmpTotalValue;
            _tmpTotalValue = _cursor.getDouble(_cursorIndexOfTotalValue);
            _item = new NotificationDao.PlatformEarningStat(_tmpPackageName,_tmpPlatform,_tmpTotalValue);
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
  public Flow<List<CapturedNotification>> getNotificationsSince(final long startTime) {
    final String _sql = "SELECT * FROM captured_notifications WHERE receivedAt >= ? ORDER BY receivedAt DESC";
    final RoomSQLiteQuery _statement = RoomSQLiteQuery.acquire(_sql, 1);
    int _argIndex = 1;
    _statement.bindLong(_argIndex, startTime);
    return CoroutinesRoom.createFlow(__db, false, new String[] {"captured_notifications"}, new Callable<List<CapturedNotification>>() {
      @Override
      @NonNull
      public List<CapturedNotification> call() throws Exception {
        final Cursor _cursor = DBUtil.query(__db, _statement, false, null);
        try {
          final int _cursorIndexOfId = CursorUtil.getColumnIndexOrThrow(_cursor, "id");
          final int _cursorIndexOfPackageName = CursorUtil.getColumnIndexOrThrow(_cursor, "packageName");
          final int _cursorIndexOfPlatform = CursorUtil.getColumnIndexOrThrow(_cursor, "platform");
          final int _cursorIndexOfSource = CursorUtil.getColumnIndexOrThrow(_cursor, "source");
          final int _cursorIndexOfTitle = CursorUtil.getColumnIndexOrThrow(_cursor, "title");
          final int _cursorIndexOfBody = CursorUtil.getColumnIndexOrThrow(_cursor, "body");
          final int _cursorIndexOfBigText = CursorUtil.getColumnIndexOrThrow(_cursor, "bigText");
          final int _cursorIndexOfSubText = CursorUtil.getColumnIndexOrThrow(_cursor, "subText");
          final int _cursorIndexOfOrderValue = CursorUtil.getColumnIndexOrThrow(_cursor, "orderValue");
          final int _cursorIndexOfPickupLocation = CursorUtil.getColumnIndexOrThrow(_cursor, "pickupLocation");
          final int _cursorIndexOfDropoffLocation = CursorUtil.getColumnIndexOrThrow(_cursor, "dropoffLocation");
          final int _cursorIndexOfDistance = CursorUtil.getColumnIndexOrThrow(_cursor, "distance");
          final int _cursorIndexOfReceivedAt = CursorUtil.getColumnIndexOrThrow(_cursor, "receivedAt");
          final int _cursorIndexOfIsSynced = CursorUtil.getColumnIndexOrThrow(_cursor, "isSynced");
          final int _cursorIndexOfSyncedAt = CursorUtil.getColumnIndexOrThrow(_cursor, "syncedAt");
          final int _cursorIndexOfIsRead = CursorUtil.getColumnIndexOrThrow(_cursor, "isRead");
          final int _cursorIndexOfCategory = CursorUtil.getColumnIndexOrThrow(_cursor, "category");
          final int _cursorIndexOfCurrency = CursorUtil.getColumnIndexOrThrow(_cursor, "currency");
          final int _cursorIndexOfUserMode = CursorUtil.getColumnIndexOrThrow(_cursor, "userMode");
          final List<CapturedNotification> _result = new ArrayList<CapturedNotification>(_cursor.getCount());
          while (_cursor.moveToNext()) {
            final CapturedNotification _item;
            final long _tmpId;
            _tmpId = _cursor.getLong(_cursorIndexOfId);
            final String _tmpPackageName;
            _tmpPackageName = _cursor.getString(_cursorIndexOfPackageName);
            final String _tmpPlatform;
            _tmpPlatform = _cursor.getString(_cursorIndexOfPlatform);
            final String _tmpSource;
            _tmpSource = _cursor.getString(_cursorIndexOfSource);
            final String _tmpTitle;
            _tmpTitle = _cursor.getString(_cursorIndexOfTitle);
            final String _tmpBody;
            _tmpBody = _cursor.getString(_cursorIndexOfBody);
            final String _tmpBigText;
            _tmpBigText = _cursor.getString(_cursorIndexOfBigText);
            final String _tmpSubText;
            _tmpSubText = _cursor.getString(_cursorIndexOfSubText);
            final Double _tmpOrderValue;
            if (_cursor.isNull(_cursorIndexOfOrderValue)) {
              _tmpOrderValue = null;
            } else {
              _tmpOrderValue = _cursor.getDouble(_cursorIndexOfOrderValue);
            }
            final String _tmpPickupLocation;
            if (_cursor.isNull(_cursorIndexOfPickupLocation)) {
              _tmpPickupLocation = null;
            } else {
              _tmpPickupLocation = _cursor.getString(_cursorIndexOfPickupLocation);
            }
            final String _tmpDropoffLocation;
            if (_cursor.isNull(_cursorIndexOfDropoffLocation)) {
              _tmpDropoffLocation = null;
            } else {
              _tmpDropoffLocation = _cursor.getString(_cursorIndexOfDropoffLocation);
            }
            final String _tmpDistance;
            if (_cursor.isNull(_cursorIndexOfDistance)) {
              _tmpDistance = null;
            } else {
              _tmpDistance = _cursor.getString(_cursorIndexOfDistance);
            }
            final long _tmpReceivedAt;
            _tmpReceivedAt = _cursor.getLong(_cursorIndexOfReceivedAt);
            final boolean _tmpIsSynced;
            final int _tmp;
            _tmp = _cursor.getInt(_cursorIndexOfIsSynced);
            _tmpIsSynced = _tmp != 0;
            final Long _tmpSyncedAt;
            if (_cursor.isNull(_cursorIndexOfSyncedAt)) {
              _tmpSyncedAt = null;
            } else {
              _tmpSyncedAt = _cursor.getLong(_cursorIndexOfSyncedAt);
            }
            final boolean _tmpIsRead;
            final int _tmp_1;
            _tmp_1 = _cursor.getInt(_cursorIndexOfIsRead);
            _tmpIsRead = _tmp_1 != 0;
            final String _tmpCategory;
            if (_cursor.isNull(_cursorIndexOfCategory)) {
              _tmpCategory = null;
            } else {
              _tmpCategory = _cursor.getString(_cursorIndexOfCategory);
            }
            final String _tmpCurrency;
            _tmpCurrency = _cursor.getString(_cursorIndexOfCurrency);
            final String _tmpUserMode;
            _tmpUserMode = _cursor.getString(_cursorIndexOfUserMode);
            _item = new CapturedNotification(_tmpId,_tmpPackageName,_tmpPlatform,_tmpSource,_tmpTitle,_tmpBody,_tmpBigText,_tmpSubText,_tmpOrderValue,_tmpPickupLocation,_tmpDropoffLocation,_tmpDistance,_tmpReceivedAt,_tmpIsSynced,_tmpSyncedAt,_tmpIsRead,_tmpCategory,_tmpCurrency,_tmpUserMode);
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
  public Flow<List<CapturedNotification>> getNotificationsByUserMode(final String mode) {
    final String _sql = "SELECT * FROM captured_notifications WHERE userMode = ? ORDER BY receivedAt DESC";
    final RoomSQLiteQuery _statement = RoomSQLiteQuery.acquire(_sql, 1);
    int _argIndex = 1;
    _statement.bindString(_argIndex, mode);
    return CoroutinesRoom.createFlow(__db, false, new String[] {"captured_notifications"}, new Callable<List<CapturedNotification>>() {
      @Override
      @NonNull
      public List<CapturedNotification> call() throws Exception {
        final Cursor _cursor = DBUtil.query(__db, _statement, false, null);
        try {
          final int _cursorIndexOfId = CursorUtil.getColumnIndexOrThrow(_cursor, "id");
          final int _cursorIndexOfPackageName = CursorUtil.getColumnIndexOrThrow(_cursor, "packageName");
          final int _cursorIndexOfPlatform = CursorUtil.getColumnIndexOrThrow(_cursor, "platform");
          final int _cursorIndexOfSource = CursorUtil.getColumnIndexOrThrow(_cursor, "source");
          final int _cursorIndexOfTitle = CursorUtil.getColumnIndexOrThrow(_cursor, "title");
          final int _cursorIndexOfBody = CursorUtil.getColumnIndexOrThrow(_cursor, "body");
          final int _cursorIndexOfBigText = CursorUtil.getColumnIndexOrThrow(_cursor, "bigText");
          final int _cursorIndexOfSubText = CursorUtil.getColumnIndexOrThrow(_cursor, "subText");
          final int _cursorIndexOfOrderValue = CursorUtil.getColumnIndexOrThrow(_cursor, "orderValue");
          final int _cursorIndexOfPickupLocation = CursorUtil.getColumnIndexOrThrow(_cursor, "pickupLocation");
          final int _cursorIndexOfDropoffLocation = CursorUtil.getColumnIndexOrThrow(_cursor, "dropoffLocation");
          final int _cursorIndexOfDistance = CursorUtil.getColumnIndexOrThrow(_cursor, "distance");
          final int _cursorIndexOfReceivedAt = CursorUtil.getColumnIndexOrThrow(_cursor, "receivedAt");
          final int _cursorIndexOfIsSynced = CursorUtil.getColumnIndexOrThrow(_cursor, "isSynced");
          final int _cursorIndexOfSyncedAt = CursorUtil.getColumnIndexOrThrow(_cursor, "syncedAt");
          final int _cursorIndexOfIsRead = CursorUtil.getColumnIndexOrThrow(_cursor, "isRead");
          final int _cursorIndexOfCategory = CursorUtil.getColumnIndexOrThrow(_cursor, "category");
          final int _cursorIndexOfCurrency = CursorUtil.getColumnIndexOrThrow(_cursor, "currency");
          final int _cursorIndexOfUserMode = CursorUtil.getColumnIndexOrThrow(_cursor, "userMode");
          final List<CapturedNotification> _result = new ArrayList<CapturedNotification>(_cursor.getCount());
          while (_cursor.moveToNext()) {
            final CapturedNotification _item;
            final long _tmpId;
            _tmpId = _cursor.getLong(_cursorIndexOfId);
            final String _tmpPackageName;
            _tmpPackageName = _cursor.getString(_cursorIndexOfPackageName);
            final String _tmpPlatform;
            _tmpPlatform = _cursor.getString(_cursorIndexOfPlatform);
            final String _tmpSource;
            _tmpSource = _cursor.getString(_cursorIndexOfSource);
            final String _tmpTitle;
            _tmpTitle = _cursor.getString(_cursorIndexOfTitle);
            final String _tmpBody;
            _tmpBody = _cursor.getString(_cursorIndexOfBody);
            final String _tmpBigText;
            _tmpBigText = _cursor.getString(_cursorIndexOfBigText);
            final String _tmpSubText;
            _tmpSubText = _cursor.getString(_cursorIndexOfSubText);
            final Double _tmpOrderValue;
            if (_cursor.isNull(_cursorIndexOfOrderValue)) {
              _tmpOrderValue = null;
            } else {
              _tmpOrderValue = _cursor.getDouble(_cursorIndexOfOrderValue);
            }
            final String _tmpPickupLocation;
            if (_cursor.isNull(_cursorIndexOfPickupLocation)) {
              _tmpPickupLocation = null;
            } else {
              _tmpPickupLocation = _cursor.getString(_cursorIndexOfPickupLocation);
            }
            final String _tmpDropoffLocation;
            if (_cursor.isNull(_cursorIndexOfDropoffLocation)) {
              _tmpDropoffLocation = null;
            } else {
              _tmpDropoffLocation = _cursor.getString(_cursorIndexOfDropoffLocation);
            }
            final String _tmpDistance;
            if (_cursor.isNull(_cursorIndexOfDistance)) {
              _tmpDistance = null;
            } else {
              _tmpDistance = _cursor.getString(_cursorIndexOfDistance);
            }
            final long _tmpReceivedAt;
            _tmpReceivedAt = _cursor.getLong(_cursorIndexOfReceivedAt);
            final boolean _tmpIsSynced;
            final int _tmp;
            _tmp = _cursor.getInt(_cursorIndexOfIsSynced);
            _tmpIsSynced = _tmp != 0;
            final Long _tmpSyncedAt;
            if (_cursor.isNull(_cursorIndexOfSyncedAt)) {
              _tmpSyncedAt = null;
            } else {
              _tmpSyncedAt = _cursor.getLong(_cursorIndexOfSyncedAt);
            }
            final boolean _tmpIsRead;
            final int _tmp_1;
            _tmp_1 = _cursor.getInt(_cursorIndexOfIsRead);
            _tmpIsRead = _tmp_1 != 0;
            final String _tmpCategory;
            if (_cursor.isNull(_cursorIndexOfCategory)) {
              _tmpCategory = null;
            } else {
              _tmpCategory = _cursor.getString(_cursorIndexOfCategory);
            }
            final String _tmpCurrency;
            _tmpCurrency = _cursor.getString(_cursorIndexOfCurrency);
            final String _tmpUserMode;
            _tmpUserMode = _cursor.getString(_cursorIndexOfUserMode);
            _item = new CapturedNotification(_tmpId,_tmpPackageName,_tmpPlatform,_tmpSource,_tmpTitle,_tmpBody,_tmpBigText,_tmpSubText,_tmpOrderValue,_tmpPickupLocation,_tmpDropoffLocation,_tmpDistance,_tmpReceivedAt,_tmpIsSynced,_tmpSyncedAt,_tmpIsRead,_tmpCategory,_tmpCurrency,_tmpUserMode);
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
  public Object markAsSynced(final List<Long> ids, final long syncedAt,
      final Continuation<? super Unit> $completion) {
    return CoroutinesRoom.execute(__db, true, new Callable<Unit>() {
      @Override
      @NonNull
      public Unit call() throws Exception {
        final StringBuilder _stringBuilder = StringUtil.newStringBuilder();
        _stringBuilder.append("UPDATE captured_notifications SET isSynced = 1, syncedAt = ");
        _stringBuilder.append("?");
        _stringBuilder.append(" WHERE id IN (");
        final int _inputSize = ids.size();
        StringUtil.appendPlaceholders(_stringBuilder, _inputSize);
        _stringBuilder.append(")");
        final String _sql = _stringBuilder.toString();
        final SupportSQLiteStatement _stmt = __db.compileStatement(_sql);
        int _argIndex = 1;
        _stmt.bindLong(_argIndex, syncedAt);
        _argIndex = 2;
        for (long _item : ids) {
          _stmt.bindLong(_argIndex, _item);
          _argIndex++;
        }
        __db.beginTransaction();
        try {
          _stmt.executeUpdateDelete();
          __db.setTransactionSuccessful();
          return Unit.INSTANCE;
        } finally {
          __db.endTransaction();
        }
      }
    }, $completion);
  }

  @NonNull
  public static List<Class<?>> getRequiredConverters() {
    return Collections.emptyList();
  }
}
