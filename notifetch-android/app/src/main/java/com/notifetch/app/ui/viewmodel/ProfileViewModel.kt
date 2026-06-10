package com.notifetch.app.ui.viewmodel

import android.app.Application
import android.content.Intent
import androidx.activity.result.ActivityResult
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.google.android.gms.auth.api.signin.GoogleSignIn
import com.google.android.gms.auth.api.signin.GoogleSignInClient
import com.google.firebase.auth.FirebaseAuth
import com.notifetch.app.data.repository.AuthRepository
import com.notifetch.app.data.repository.NotificationRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

data class ProfileUiState(
    val isSignedIn: Boolean = false,
    val isAnonymous: Boolean = true,
    val userId: String? = null,
    val userEmail: String? = null,
    val userDisplayName: String? = null,
    val deviceId: String = "",
    val isSigningIn: Boolean = false,
    val error: String? = null
)

@HiltViewModel
class ProfileViewModel @Inject constructor(
    private val authRepository: AuthRepository,
    private val notificationRepository: NotificationRepository,
    private val googleSignInClient: GoogleSignInClient,
    private val firebaseAuth: FirebaseAuth
) : ViewModel() {

    private val _uiState = MutableStateFlow(ProfileUiState(deviceId = authRepository.getDeviceId()))
    val uiState: StateFlow<ProfileUiState> = _uiState.asStateFlow()

    init {
        checkAuthState()
    }

    private fun checkAuthState() {
        _uiState.value = _uiState.value.copy(
            isSignedIn = authRepository.isSignedIn(),
            isAnonymous = authRepository.isAnonymous(),
            deviceId = authRepository.getDeviceId(),
            userId = authRepository.getUserId(),
            userEmail = authRepository.getUserEmail(),
            userDisplayName = authRepository.getUserDisplayName()
        )
    }

    /**
     * Get the Google Sign-In intent to launch from the Activity.
     */
    fun getSignInIntent(): Intent = googleSignInClient.signInIntent

    /**
     * Handle Google Sign-In result from the Activity.
     */
    fun handleGoogleSignInResult(result: ActivityResult) {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isSigningIn = true, error = null)
            try {
                val task = GoogleSignIn.getSignedInAccountFromIntent(result.data)
                val account = task.getResult(com.google.android.gms.common.api.ApiException::class.java)
                val idToken = account.idToken
                    ?: throw Exception("No ID token received from Google. Make sure the SHA-1 fingerprint is registered in Firebase Console.")

                val signInResult = authRepository.signInWithGoogle(idToken)
                signInResult.onSuccess {
                    _uiState.value = _uiState.value.copy(
                        isSignedIn = true,
                        isAnonymous = false,
                        isSigningIn = false,
                        userId = authRepository.getUserId(),
                        userEmail = authRepository.getUserEmail(),
                        userDisplayName = authRepository.getUserDisplayName(),
                        error = null
                    )
                }.onFailure { error ->
                    val message = when {
                        error.message?.contains("INTERNAL", ignoreCase = true) == true ->
                            "Sign-in failed: SHA-1 certificate not registered in Firebase. Please contact support."
                        error.message?.contains("network", ignoreCase = true) == true ->
                            "Network error. Please check your internet connection and try again."
                        else -> error.message ?: "Google Sign-In failed"
                    }
                    _uiState.value = _uiState.value.copy(
                        isSigningIn = false,
                        error = message
                    )
                }
            } catch (e: com.google.android.gms.common.api.ApiException) {
                val message = when (e.statusCode) {
                    10 -> "Sign-in configuration error. The app's SHA-1 fingerprint must be registered in Firebase Console > Project Settings."
                    7 -> "Network error. Please check your internet connection."
                    12501 -> "Sign-in was cancelled."
                    else -> "Google Sign-In failed (error ${e.statusCode}): ${e.message}"
                }
                _uiState.value = _uiState.value.copy(
                    isSigningIn = false,
                    error = message
                )
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(
                    isSigningIn = false,
                    error = e.message ?: "Google Sign-In failed"
                )
            }
        }
    }

    /**
     * Sign out from Firebase and Google.
     */
    fun signOut() {
        viewModelScope.launch {
            try {
                authRepository.signOut()
                googleSignInClient.signOut()
                _uiState.value = _uiState.value.copy(
                    isSignedIn = false,
                    isAnonymous = true,
                    userId = null,
                    userEmail = null,
                    userDisplayName = null,
                    error = null
                )
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(
                    error = "Sign out failed: ${e.message}"
                )
            }
        }
    }

    /**
     * Delete all user data — DPDP Act 2023 §8 & GDPR Article 17 (Right to Erasure).
     * Removes all captured notifications from local database.
     */
    fun deleteAllData() {
        viewModelScope.launch {
            try {
                notificationRepository.deleteAllNotifications()
                _uiState.value = _uiState.value.copy(error = null)
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(
                    error = "Failed to delete data: ${e.message}"
                )
            }
        }
    }

    fun clearError() {
        _uiState.value = _uiState.value.copy(error = null)
    }
}
