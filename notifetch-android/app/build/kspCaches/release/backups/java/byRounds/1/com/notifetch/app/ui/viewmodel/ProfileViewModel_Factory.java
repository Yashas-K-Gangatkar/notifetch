package com.notifetch.app.ui.viewmodel;

import com.google.android.gms.auth.api.signin.GoogleSignInClient;
import com.google.firebase.auth.FirebaseAuth;
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
public final class ProfileViewModel_Factory implements Factory<ProfileViewModel> {
  private final Provider<AuthRepository> authRepositoryProvider;

  private final Provider<NotificationRepository> notificationRepositoryProvider;

  private final Provider<GoogleSignInClient> googleSignInClientProvider;

  private final Provider<FirebaseAuth> firebaseAuthProvider;

  public ProfileViewModel_Factory(Provider<AuthRepository> authRepositoryProvider,
      Provider<NotificationRepository> notificationRepositoryProvider,
      Provider<GoogleSignInClient> googleSignInClientProvider,
      Provider<FirebaseAuth> firebaseAuthProvider) {
    this.authRepositoryProvider = authRepositoryProvider;
    this.notificationRepositoryProvider = notificationRepositoryProvider;
    this.googleSignInClientProvider = googleSignInClientProvider;
    this.firebaseAuthProvider = firebaseAuthProvider;
  }

  @Override
  public ProfileViewModel get() {
    return newInstance(authRepositoryProvider.get(), notificationRepositoryProvider.get(), googleSignInClientProvider.get(), firebaseAuthProvider.get());
  }

  public static ProfileViewModel_Factory create(Provider<AuthRepository> authRepositoryProvider,
      Provider<NotificationRepository> notificationRepositoryProvider,
      Provider<GoogleSignInClient> googleSignInClientProvider,
      Provider<FirebaseAuth> firebaseAuthProvider) {
    return new ProfileViewModel_Factory(authRepositoryProvider, notificationRepositoryProvider, googleSignInClientProvider, firebaseAuthProvider);
  }

  public static ProfileViewModel newInstance(AuthRepository authRepository,
      NotificationRepository notificationRepository, GoogleSignInClient googleSignInClient,
      FirebaseAuth firebaseAuth) {
    return new ProfileViewModel(authRepository, notificationRepository, googleSignInClient, firebaseAuth);
  }
}
