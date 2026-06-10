package com.notifetch.app.firebase;

import com.notifetch.app.data.remote.NotiFetchApi;
import com.notifetch.app.data.repository.AuthRepository;
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
public final class NotiFetchMessagingService_MembersInjector implements MembersInjector<NotiFetchMessagingService> {
  private final Provider<NotiFetchApi> apiProvider;

  private final Provider<AuthRepository> authRepositoryProvider;

  public NotiFetchMessagingService_MembersInjector(Provider<NotiFetchApi> apiProvider,
      Provider<AuthRepository> authRepositoryProvider) {
    this.apiProvider = apiProvider;
    this.authRepositoryProvider = authRepositoryProvider;
  }

  public static MembersInjector<NotiFetchMessagingService> create(
      Provider<NotiFetchApi> apiProvider, Provider<AuthRepository> authRepositoryProvider) {
    return new NotiFetchMessagingService_MembersInjector(apiProvider, authRepositoryProvider);
  }

  @Override
  public void injectMembers(NotiFetchMessagingService instance) {
    injectApi(instance, apiProvider.get());
    injectAuthRepository(instance, authRepositoryProvider.get());
  }

  @InjectedFieldSignature("com.notifetch.app.firebase.NotiFetchMessagingService.api")
  public static void injectApi(NotiFetchMessagingService instance, NotiFetchApi api) {
    instance.api = api;
  }

  @InjectedFieldSignature("com.notifetch.app.firebase.NotiFetchMessagingService.authRepository")
  public static void injectAuthRepository(NotiFetchMessagingService instance,
      AuthRepository authRepository) {
    instance.authRepository = authRepository;
  }
}
