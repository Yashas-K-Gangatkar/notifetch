package com.notifetch.app.notification;

import com.notifetch.app.data.repository.AuthRepository;
import com.notifetch.app.data.repository.NotificationRepository;
import dagger.MembersInjector;
import dagger.internal.DaggerGenerated;
import dagger.internal.InjectedFieldSignature;
import dagger.internal.QualifierMetadata;
import javax.annotation.processing.Generated;
import javax.inject.Provider;

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
public final class NotiFetchListenerService_MembersInjector implements MembersInjector<NotiFetchListenerService> {
  private final Provider<NotificationRepository> repositoryProvider;

  private final Provider<AuthRepository> authRepositoryProvider;

  public NotiFetchListenerService_MembersInjector(
      Provider<NotificationRepository> repositoryProvider,
      Provider<AuthRepository> authRepositoryProvider) {
    this.repositoryProvider = repositoryProvider;
    this.authRepositoryProvider = authRepositoryProvider;
  }

  public static MembersInjector<NotiFetchListenerService> create(
      Provider<NotificationRepository> repositoryProvider,
      Provider<AuthRepository> authRepositoryProvider) {
    return new NotiFetchListenerService_MembersInjector(repositoryProvider, authRepositoryProvider);
  }

  @Override
  public void injectMembers(NotiFetchListenerService instance) {
    injectRepository(instance, repositoryProvider.get());
    injectAuthRepository(instance, authRepositoryProvider.get());
  }

  @InjectedFieldSignature("com.notifetch.app.notification.NotiFetchListenerService.repository")
  public static void injectRepository(NotiFetchListenerService instance,
      NotificationRepository repository) {
    instance.repository = repository;
  }

  @InjectedFieldSignature("com.notifetch.app.notification.NotiFetchListenerService.authRepository")
  public static void injectAuthRepository(NotiFetchListenerService instance,
      AuthRepository authRepository) {
    instance.authRepository = authRepository;
  }
}
