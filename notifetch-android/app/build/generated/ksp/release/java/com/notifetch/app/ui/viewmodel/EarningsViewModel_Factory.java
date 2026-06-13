package com.notifetch.app.ui.viewmodel;

import android.app.Application;
import com.notifetch.app.data.repository.AuthRepository;
import com.notifetch.app.data.repository.NotificationRepository;
import dagger.internal.DaggerGenerated;
import dagger.internal.Factory;
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
public final class EarningsViewModel_Factory implements Factory<EarningsViewModel> {
  private final Provider<Application> applicationProvider;

  private final Provider<NotificationRepository> repositoryProvider;

  private final Provider<AuthRepository> authRepositoryProvider;

  public EarningsViewModel_Factory(Provider<Application> applicationProvider,
      Provider<NotificationRepository> repositoryProvider,
      Provider<AuthRepository> authRepositoryProvider) {
    this.applicationProvider = applicationProvider;
    this.repositoryProvider = repositoryProvider;
    this.authRepositoryProvider = authRepositoryProvider;
  }

  @Override
  public EarningsViewModel get() {
    return newInstance(applicationProvider.get(), repositoryProvider.get(), authRepositoryProvider.get());
  }

  public static EarningsViewModel_Factory create(Provider<Application> applicationProvider,
      Provider<NotificationRepository> repositoryProvider,
      Provider<AuthRepository> authRepositoryProvider) {
    return new EarningsViewModel_Factory(applicationProvider, repositoryProvider, authRepositoryProvider);
  }

  public static EarningsViewModel newInstance(Application application,
      NotificationRepository repository, AuthRepository authRepository) {
    return new EarningsViewModel(application, repository, authRepository);
  }
}
