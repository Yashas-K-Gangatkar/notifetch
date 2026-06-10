package com.notifetch.app.di;

import android.content.Context;
import com.google.android.gms.auth.api.signin.GoogleSignInClient;
import dagger.internal.DaggerGenerated;
import dagger.internal.Factory;
import dagger.internal.Preconditions;
import dagger.internal.QualifierMetadata;
import dagger.internal.ScopeMetadata;
import javax.annotation.processing.Generated;
import javax.inject.Provider;

@ScopeMetadata("javax.inject.Singleton")
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
public final class FirebaseModule_ProvideGoogleSignInClientFactory implements Factory<GoogleSignInClient> {
  private final Provider<Context> contextProvider;

  public FirebaseModule_ProvideGoogleSignInClientFactory(Provider<Context> contextProvider) {
    this.contextProvider = contextProvider;
  }

  @Override
  public GoogleSignInClient get() {
    return provideGoogleSignInClient(contextProvider.get());
  }

  public static FirebaseModule_ProvideGoogleSignInClientFactory create(
      Provider<Context> contextProvider) {
    return new FirebaseModule_ProvideGoogleSignInClientFactory(contextProvider);
  }

  public static GoogleSignInClient provideGoogleSignInClient(Context context) {
    return Preconditions.checkNotNullFromProvides(FirebaseModule.INSTANCE.provideGoogleSignInClient(context));
  }
}
