package com.notifetch.app.data.repository

import android.content.Context
import android.provider.Settings
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import com.google.firebase.auth.FirebaseAuth
import com.notifetch.app.data.remote.AuthPayload
import com.notifetch.app.data.remote.NotiFetchApi
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
    private val api: NotiFetchApi,
    private val firebaseAuth: FirebaseAuth
) {
    private val deviceId by lazy {
        Settings.Secure.getString(context.contentResolver, Settings.Secure.ANDROID_ID)
    }

    suspend fun signInAnonymously(): Result<String> {
        return try {
            val result = firebaseAuth.signInAnonymously().await()
            val token = result.user?.getIdToken(true)?.await()?.token ?: ""
            saveToken(token)
            Result.success(token)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun getCurrentToken(): String? {
        return try {
            firebaseAuth.currentUser?.getIdToken(false)?.await()?.token
        } catch (_: Exception) {
            getSavedToken()
        }
    }

    fun getDeviceId(): String = deviceId

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

    suspend fun getUserId(): String? {
        return context.dataStore.data.map { prefs ->
            prefs[USER_ID_KEY]
        }.first()
    }

    fun isSignedIn(): Boolean = firebaseAuth.currentUser != null

    companion object {
        private val TOKEN_KEY = stringPreferencesKey("auth_token")
        private val USER_ID_KEY = stringPreferencesKey("user_id")
    }
}
