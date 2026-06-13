package com.notifetch.app.di;

import com.notifetch.app.data.local.NotiFetchDatabase;
import com.notifetch.app.data.local.PlatformConfigDao;
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
public final class DatabaseModule_ProvidePlatformConfigDaoFactory implements Factory<PlatformConfigDao> {
  private final Provider<NotiFetchDatabase> databaseProvider;

  public DatabaseModule_ProvidePlatformConfigDaoFactory(
      Provider<NotiFetchDatabase> databaseProvider) {
    this.databaseProvider = databaseProvider;
  }

  @Override
  public PlatformConfigDao get() {
    return providePlatformConfigDao(databaseProvider.get());
  }

  public static DatabaseModule_ProvidePlatformConfigDaoFactory create(
      Provider<NotiFetchDatabase> databaseProvider) {
    return new DatabaseModule_ProvidePlatformConfigDaoFactory(databaseProvider);
  }

  public static PlatformConfigDao providePlatformConfigDao(NotiFetchDatabase database) {
    return Preconditions.checkNotNullFromProvides(DatabaseModule.INSTANCE.providePlatformConfigDao(database));
  }
}
