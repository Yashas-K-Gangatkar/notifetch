package com.notifetch.app.data.repository;

import com.notifetch.app.data.local.NotificationDao;
import com.notifetch.app.data.local.PlatformConfigDao;
import com.notifetch.app.data.remote.NotiFetchApi;
import dagger.internal.DaggerGenerated;
import dagger.internal.Factory;
import dagger.internal.QualifierMetadata;
import dagger.internal.ScopeMetadata;
import javax.annotation.processing.Generated;
import javax.inject.Provider;

@ScopeMetadata("javax.inject.Singleton")
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
public final class NotificationRepository_Factory implements Factory<NotificationRepository> {
  private final Provider<NotificationDao> notificationDaoProvider;

  private final Provider<PlatformConfigDao> platformConfigDaoProvider;

  private final Provider<NotiFetchApi> apiProvider;

  private final Provider<AuthRepository> authRepositoryProvider;

  public NotificationRepository_Factory(Provider<NotificationDao> notificationDaoProvider,
      Provider<PlatformConfigDao> platformConfigDaoProvider, Provider<NotiFetchApi> apiProvider,
      Provider<AuthRepository> authRepositoryProvider) {
    this.notificationDaoProvider = notificationDaoProvider;
    this.platformConfigDaoProvider = platformConfigDaoProvider;
    this.apiProvider = apiProvider;
    this.authRepositoryProvider = authRepositoryProvider;
  }

  @Override
  public NotificationRepository get() {
    return newInstance(notificationDaoProvider.get(), platformConfigDaoProvider.get(), apiProvider.get(), authRepositoryProvider.get());
  }

  public static NotificationRepository_Factory create(
      Provider<NotificationDao> notificationDaoProvider,
      Provider<PlatformConfigDao> platformConfigDaoProvider, Provider<NotiFetchApi> apiProvider,
      Provider<AuthRepository> authRepositoryProvider) {
    return new NotificationRepository_Factory(notificationDaoProvider, platformConfigDaoProvider, apiProvider, authRepositoryProvider);
  }

  public static NotificationRepository newInstance(NotificationDao notificationDao,
      PlatformConfigDao platformConfigDao, NotiFetchApi api, AuthRepository authRepository) {
    return new NotificationRepository(notificationDao, platformConfigDao, api, authRepository);
  }
}
