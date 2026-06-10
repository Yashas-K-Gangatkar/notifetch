package com.notifetch.app.ui.viewmodel;

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
public final class SettingsViewModel_Factory implements Factory<SettingsViewModel> {
  private final Provider<NotificationRepository> repositoryProvider;

  public SettingsViewModel_Factory(Provider<NotificationRepository> repositoryProvider) {
    this.repositoryProvider = repositoryProvider;
  }

  @Override
  public SettingsViewModel get() {
    return newInstance(repositoryProvider.get());
  }

  public static SettingsViewModel_Factory create(
      Provider<NotificationRepository> repositoryProvider) {
    return new SettingsViewModel_Factory(repositoryProvider);
  }

  public static SettingsViewModel newInstance(NotificationRepository repository) {
    return new SettingsViewModel(repository);
  }
}
