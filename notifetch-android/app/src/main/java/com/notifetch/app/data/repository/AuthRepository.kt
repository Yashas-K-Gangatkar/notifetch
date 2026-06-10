package com.notifetch.app.data.repository

import android.content.Context
import android.provider.Settings
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.GoogleAuthProvider
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.tasks.await
import javax.inject.Inject
import javax.inject.Singleton

val Context.dataStore: DataStore<Preferences> by preferencesDataStore(name = "notifetch_prefs")

@Singleton
class AuthRepository @Inject constructor(
    @ApplicationContext private val context: Context,
    private val firebaseAuth: FirebaseAuth
) {
    private val _deviceId by lazy {
        Settings.Secure.getString(context.contentResolver, Settings.Secure.ANDROID_ID)
    }

    /**
     * Sign in with Google — uses the ID token from Google Sign-In to authenticate with Firebase.
     */
    suspend fun signInWithGoogle(idToken: String): Result<String> {
        return try {
            val credential = GoogleAuthProvider.getCredential(idToken, null)
            val result = firebaseAuth.signInWithCredential(credential).await()
            val uid = result.user?.uid ?: ""
            val token = result.user?.getIdToken(true)?.await()?.token ?: ""
            saveToken(token)
            saveUserId(uid)
            Result.success(uid)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    /**
     * Sign in with Firebase email link (for "Send login code" flow).
     */
    suspend fun signInWithEmailLink(email: String, emailLink: String): Result<String> {
        return try {
            val result = firebaseAuth.signInWithEmailLink(email, emailLink).await()
            val uid = result.user?.uid ?: ""
            val token = result.user?.getIdToken(true)?.await()?.token ?: ""
            saveToken(token)
            saveUserId(uid)
            Result.success(uid)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    /**
     * Anonymous sign-in — used as fallback or for users who don't want to authenticate.
     */
    suspend fun signInAnonymously(): Result<String> {
        return try {
            val result = firebaseAuth.signInAnonymously().await()
            val uid = result.user?.uid ?: ""
            val token = result.user?.getIdToken(true)?.await()?.token ?: ""
            saveToken(token)
            saveUserId(uid)
            Result.success(uid)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    /**
     * Sign out from Firebase.
     */
    fun signOut() {
        firebaseAuth.signOut()
    }

    suspend fun getCurrentToken(): String? {
        return try {
            firebaseAuth.currentUser?.getIdToken(false)?.await()?.token
        } catch (_: Exception) {
            getSavedToken()
        }
    }

    fun getDeviceId(): String = _deviceId

    fun isSignedIn(): Boolean = firebaseAuth.currentUser != null

    fun isAnonymous(): Boolean = firebaseAuth.currentUser?.isAnonymous ?: true

    fun getUserEmail(): String? = firebaseAuth.currentUser?.email

    fun getUserDisplayName(): String? = firebaseAuth.currentUser?.displayName

    fun getUserPhotoUrl(): String? = firebaseAuth.currentUser?.photoUrl?.toString()

    fun getUserId(): String? = firebaseAuth.currentUser?.uid

    private suspend fun saveToken(token: String) {
        context.dataStore.edit { prefs ->
            prefs[TOKEN_KEY] = token
        }
    }

    private suspend fun getSavedToken(): String? {
        return context.dataStore.data.map { prefs ->
            prefs[TOKEN_KEY]
        }.first()
    }

    suspend fun saveUserId(uid: String) {
        context.dataStore.edit { prefs ->
            prefs[USER_ID_KEY] = uid
        }
    }

    companion object {
        private val TOKEN_KEY = stringPreferencesKey("auth_token")
        private val USER_ID_KEY = stringPreferencesKey("user_id")
    }
}
