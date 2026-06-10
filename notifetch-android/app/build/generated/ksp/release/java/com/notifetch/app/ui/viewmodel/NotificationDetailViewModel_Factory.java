package com.notifetch.app.ui.viewmodel;

import androidx.lifecycle.SavedStateHandle;
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
public final class NotificationDetailViewModel_Factory implements Factory<NotificationDetailViewModel> {
  private final Provider<SavedStateHandle> savedStateHandleProvider;

  private final Provider<NotificationRepository> repositoryProvider;

  public NotificationDetailViewModel_Factory(Provider<SavedStateHandle> savedStateHandleProvider,
      Provider<NotificationRepository> repositoryProvider) {
    this.savedStateHandleProvider = savedStateHandleProvider;
    this.repositoryProvider = repositoryProvider;
  }

  @Override
  public NotificationDetailViewModel get() {
    return newInstance(savedStateHandleProvider.get(), repositoryProvider.get());
  }

  public static NotificationDetailViewModel_Factory create(
      Provider<SavedStateHandle> savedStateHandleProvider,
      Provider<NotificationRepository> repositoryProvider) {
    return new NotificationDetailViewModel_Factory(savedStateHandleProvider, repositoryProvider);
  }

  public static NotificationDetailViewModel newInstance(SavedStateHandle savedStateHandle,
      NotificationRepository repository) {
    return new NotificationDetailViewModel(savedStateHandle, repository);
  }
}
