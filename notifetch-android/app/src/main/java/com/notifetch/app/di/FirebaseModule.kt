package com.notifetch.app.di

import android.util.Log
import com.google.firebase.auth.FirebaseAuth
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object FirebaseModule {

    private const val TAG = "FirebaseModule"

    /**
     * Provides FirebaseAuth instance with graceful fallback.
     *
     * If Firebase is not configured (placeholder google-services.json),
     * this will log a warning and return the default instance.
     * The caller (AuthRepository) must handle the case where
     * Firebase operations fail at runtime.
     *
     * This ensures the app doesn't crash on launch when Firebase
     * is not yet set up — the core notification listener works
     * independently of Firebase.
     */
    @Provides
    @Singleton
    fun provideFirebaseAuth(): FirebaseAuth {
        return try {
            val auth = FirebaseAuth.getInstance()
            Log.d(TAG, "FirebaseAuth initialized successfully")
            auth
        } catch (e: Exception) {
            Log.w(TAG, "FirebaseAuth initialization failed — Firebase may not be configured. " +
                    "Core features (notification listener) will work. " +
                    "Cloud features (sync, FCM) require Firebase setup.", e)
            // Return the instance anyway — it may still work partially,
            // and AuthRepository will handle errors gracefully
            FirebaseAuth.getInstance()
        }
    }
}
