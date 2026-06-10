package com.notifetch.app.di;

import com.notifetch.app.data.local.NotiFetchDatabase;
import com.notifetch.app.data.local.NotificationDao;
import dagger.internal.DaggerGenerated;
import dagger.internal.Factory;
import dagger.internal.Preconditions;
import dagger.internal.QualifierMetadata;
import dagger.internal.ScopeMetadata;
import javax.annotation.processing.Generated;
import javax.inject.Provider;

@ScopeMetadata
@QualifierMetadata
@DaggerGenerated
@Generated(
    value = "dagger.internal.codegen.ComponentProcessor",
    comments = "https://dagger.dev"
)
@SuppressWarnings({
    "unchecked",
    "rawtypes",
    "KotlinInternal",
    "KotlinInternalInJava",
    "cast",
    "deprecation",
    "nullness:initialization.field.uninitialized"
})
public final class DatabaseModule_ProvideNotificationDaoFactory implements Factory<NotificationDao> {
  private final Provider<NotiFetchDatabase> databaseProvider;

  public DatabaseModule_ProvideNotificationDaoFactory(
      Provider<NotiFetchDatabase> databaseProvider) {
    this.databaseProvider = databaseProvider;
  }

  @Override
  public NotificationDao get() {
    return provideNotificationDao(databaseProvider.get());
  }

  public static DatabaseModule_ProvideNotificationDaoFactory create(
      Provider<NotiFetchDatabase> databaseProvider) {
    return new DatabaseModule_ProvideNotificationDaoFactory(databaseProvider);
  }

  public static NotificationDao provideNotificationDao(NotiFetchDatabase database) {
    return Preconditions.checkNotNullFromProvides(DatabaseModule.INSTANCE.provideNotificationDao(database));
  }
}
