package com.notifetch.app.di;

import com.notifetch.app.data.remote.NotiFetchApi;
import dagger.internal.DaggerGenerated;
import dagger.internal.Factory;
import dagger.internal.Preconditions;
import dagger.internal.QualifierMetadata;
import dagger.internal.ScopeMetadata;
import javax.annotation.processing.Generated;
import javax.inject.Provider;
import retrofit2.Retrofit;

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
public final class NetworkModule_ProvideNotiFetchApiFactory implements Factory<NotiFetchApi> {
  private final Provider<Retrofit> retrofitProvider;

  public NetworkModule_ProvideNotiFetchApiFactory(Provider<Retrofit> retrofitProvider) {
    this.retrofitProvider = retrofitProvider;
  }

  @Override
  public NotiFetchApi get() {
    return provideNotiFetchApi(retrofitProvider.get());
  }

  public static NetworkModule_ProvideNotiFetchApiFactory create(
      Provider<Retrofit> retrofitProvider) {
    return new NetworkModule_ProvideNotiFetchApiFactory(retrofitProvider);
  }

  public static NotiFetchApi provideNotiFetchApi(Retrofit retrofit) {
    return Preconditions.checkNotNullFromProvides(NetworkModule.INSTANCE.provideNotiFetchApi(retrofit));
  }
}
