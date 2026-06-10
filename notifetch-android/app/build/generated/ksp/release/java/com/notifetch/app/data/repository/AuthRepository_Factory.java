package com.notifetch.app.data.repository;

import android.content.Context;
import com.google.firebase.auth.FirebaseAuth;
import dagger.internal.DaggerGenerated;
import dagger.internal.Factory;
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
public final class AuthRepository_Factory implements Factory<AuthRepository> {
  private final Provider<Context> contextProvider;

  private final Provider<FirebaseAuth> firebaseAuthProvider;

  public AuthRepository_Factory(Provider<Context> contextProvider,
      Provider<FirebaseAuth> firebaseAuthProvider) {
    this.contextProvider = contextProvider;
    this.firebaseAuthProvider = firebaseAuthProvider;
  }

  @Override
  public AuthRepository get() {
    return newInstance(contextProvider.get(), firebaseAuthProvider.get());
  }

  public static AuthRepository_Factory create(Provider<Context> contextProvider,
      Provider<FirebaseAuth> firebaseAuthProvider) {
    return new AuthRepository_Factory(contextProvider, firebaseAuthProvider);
  }

  public static AuthRepository newInstance(Context context, FirebaseAuth firebaseAuth) {
    return new AuthRepository(context, firebaseAuth);
  }
}
