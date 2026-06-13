package com.notifetch.app.ui.viewmodel;

import android.content.Context;
import com.notifetch.app.data.repository.NotificationRepository;
import dagger.internal.DaggerGenerated;
import dagger.internal.Factory;
import dagger.internal.QualifierMetadata;
import dagger.internal.ScopeMetadata;
import javax.annotation.processing.Generated;
import javax.inject.Provider;

@ScopeMetadata
@QualifierMetadata("dagger.hilt.android.qualifiers.ApplicationContext")
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
  private final Provider<Context> contextProvider;

  private final Provider<NotificationRepository> repositoryProvider;

  public SettingsViewModel_Factory(Provider<Context> contextProvider,
      Provider<NotificationRepository> repositoryProvider) {
    this.contextProvider = contextProvider;
    this.repositoryProvider = repositoryProvider;
  }

  @Override
  public SettingsViewModel get() {
    return newInstance(contextProvider.get(), repositoryProvider.get());
  }

  public static SettingsViewModel_Factory create(Provider<Context> contextProvider,
      Provider<NotificationRepository> repositoryProvider) {
    return new SettingsViewModel_Factory(contextProvider, repositoryProvider);
  }

  public static SettingsViewModel newInstance(Context context, NotificationRepository repository) {
    return new SettingsViewModel(context, repository);
  }
}
