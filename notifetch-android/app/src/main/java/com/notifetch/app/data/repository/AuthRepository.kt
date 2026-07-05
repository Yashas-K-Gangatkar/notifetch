package com.notifetch.app.data.repository

import android.content.Context
import android.provider.Settings
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import androidx.security.crypto.EncryptedSharedPreferences
import androidx.security.crypto.MasterKey
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
     *
     * v2.9.60: If [saveToken] fails (EncryptedSharedPreferences unavailable),
     * we still return success — the user IS signed in to Firebase, which is
     * what matters. The token just won't be persisted for offline use, so
     * the next cold start will require Firebase to re-fetch it (network call).
     */
    suspend fun signInWithGoogle(idToken: String): Result<String> {
        return try {
            val credential = GoogleAuthProvider.getCredential(idToken, null)
            val result = firebaseAuth.signInWithCredential(credential).await()
            val uid = result.user?.uid
                ?: return Result.failure(Exception("User ID is null after sign-in"))
            val token = result.user?.getIdToken(true)?.await()?.token
                ?: return Result.failure(Exception("Auth token is null after sign-in"))
            // Best-effort persistence — don't fail sign-in if encryption is unavailable.
            try {
                saveToken(token)
            } catch (e: Exception) {
                android.util.Log.w("AuthRepository", "EncryptedSharedPreferences unavailable — token not persisted: ${e.message}")
            }
            saveUserId(uid)
            Result.success(uid)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    /**
     * Sign out from Firebase and clear stored credentials.
     */
    suspend fun signOut() {
        firebaseAuth.signOut()
        context.dataStore.edit { prefs ->
            prefs.remove(TOKEN_KEY)
            prefs.remove(USER_ID_KEY)
        }
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
        // v2.9.60 SECURITY HARDENING: EncryptedSharedPreferences is now MANDATORY.
        // v2.9.59 fell back to plain DataStore if encryption failed — that fallback
        // was itself a vulnerability: a device with a corrupted Keystore would
        // silently store the auth token in plaintext, readable by any app with
        // backup privileges (or via adb on rooted devices).
        //
        // New behavior: if EncryptedSharedPreferences fails, we DO NOT persist
        // the token. The user will simply be prompted to sign in again on the
        // next app launch. This is the correct fail-closed behavior.
        //
        // EncryptedSharedPreferences can fail on:
        //   - Devices with corrupted Android Keystore (rare, but happens after OTA)
        //   - Devices with broken Keymaster HAL (some cheap MediaTek ROMs)
        //   - Rooted devices with Magisk Hide conflicting with Keystore
        // In all these cases, fail-closed is safer than fail-open.
        val masterKey = MasterKey.Builder(context)
            .setKeyScheme(MasterKey.KeyScheme.AES256_GCM)
            .build()
        val sharedPreferences = EncryptedSharedPreferences.create(
            context,
            "notifetch_secure_prefs",
            masterKey,
            EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
            EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
        )
        sharedPreferences.edit().putString("auth_token", token).apply()
    }

    private suspend fun getSavedToken(): String? {
        // v2.9.60: Same fail-closed behavior — no plaintext fallback.
        return try {
            val masterKey = MasterKey.Builder(context)
                .setKeyScheme(MasterKey.KeyScheme.AES256_GCM)
                .build()
            val sharedPreferences = EncryptedSharedPreferences.create(
                context,
                "notifetch_secure_prefs",
                masterKey,
                EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
                EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
            )
            sharedPreferences.getString("auth_token", null)
        } catch (e: Exception) {
            // EncryptedSharedPreferences unavailable — return null.
            // Caller (getCurrentToken) will fall back to FirebaseAuth.currentUser.getIdToken()
            // which makes a network call to Firebase. This is the desired behavior:
            // we never leak a plaintext token, and the user stays signed in via
            // Firebase's own session (which is stored securely by Firebase SDK).
            null
        }
    }

    suspend fun saveUserId(uid: String) {
        context.dataStore.edit { prefs ->
            prefs[USER_ID_KEY] = uid
        }
    }

    /**
     * Delete all user data from local storage.
     * Called as part of the "Delete All My Data" flow.
     *
     * v2.9.60 FIX: Also clears EncryptedSharedPreferences — v2.9.59 only cleared
     * DataStore, leaving the encrypted auth token on disk after account deletion.
     * This was both a privacy bug (token survived deletion) and a correctness
     * bug (the next sign-in would read the stale token).
     */
    suspend fun clearAllLocalData() {
        // 1) Clear DataStore (non-sensitive prefs: user_id, onboarding flags, etc.)
        context.dataStore.edit { prefs ->
            prefs.clear()
        }
        // 2) Clear EncryptedSharedPreferences (auth token).
        //    Best-effort — if Keystore is broken, there's nothing to clear anyway.
        try {
            val masterKey = MasterKey.Builder(context)
                .setKeyScheme(MasterKey.KeyScheme.AES256_GCM)
                .build()
            val sharedPreferences = EncryptedSharedPreferences.create(
                context,
                "notifetch_secure_prefs",
                masterKey,
                EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
                EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
            )
            sharedPreferences.edit().clear().apply()
        } catch (_: Exception) {
            // EncryptedSharedPreferences unavailable — nothing to clear.
        }
    }

    /**
     * v2.9.60: Migration helper — call once on app launch to wipe any plaintext
     * tokens that were stored by v2.9.59's fallback path. After migration, the
     * TOKEN_KEY in DataStore should never be set again.
     *
     * Safe to call multiple times. Idempotent.
     */
    suspend fun migratePlaintextTokenIfNeeded() {
        try {
            val plaintextToken = context.dataStore.data
                .map { prefs -> prefs[TOKEN_KEY] }
                .first()
            if (plaintextToken != null) {
                // Migrate to EncryptedSharedPreferences, then wipe the plaintext copy.
                saveToken(plaintextToken)
                context.dataStore.edit { prefs -> prefs.remove(TOKEN_KEY) }
                android.util.Log.i("AuthRepository", "Migrated plaintext auth token to EncryptedSharedPreferences")
            }
        } catch (_: Exception) {
            // EncryptedSharedPreferences unavailable — leave plaintext token in place
            // rather than logging the user out. We'll retry migration on next launch.
        }
    }

    companion object {
        val TOKEN_KEY = stringPreferencesKey("auth_token")
        val USER_ID_KEY = stringPreferencesKey("user_id")
    }
}
