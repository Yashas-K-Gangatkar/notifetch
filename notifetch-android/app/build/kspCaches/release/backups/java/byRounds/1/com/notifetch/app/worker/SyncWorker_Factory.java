package com.notifetch.app.worker;

import android.content.Context;
import androidx.work.WorkerParameters;
import com.notifetch.app.data.repository.NotificationRepository;
import dagger.internal.DaggerGenerated;
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
public final class SyncWorker_Factory {
  private final Provider<NotificationRepository> repositoryProvider;

  public SyncWorker_Factory(Provider<NotificationRepository> repositoryProvider) {
    this.repositoryProvider = repositoryProvider;
  }

  public SyncWorker get(Context appContext, WorkerParameters workerParams) {
    return newInstance(appContext, workerParams, repositoryProvider.get());
  }

  public static SyncWorker_Factory create(Provider<NotificationRepository> repositoryProvider) {
    return new SyncWorker_Factory(repositoryProvider);
  }

  public static SyncWorker newInstance(Context appContext, WorkerParameters workerParams,
      NotificationRepository repository) {
    return new SyncWorker(appContext, workerParams, repository);
  }
}
