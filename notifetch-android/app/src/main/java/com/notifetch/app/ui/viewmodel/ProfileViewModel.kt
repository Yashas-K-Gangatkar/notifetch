package com.notifetch.app.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
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
    val userId: String? = null,
    val deviceId: String = "",
    val isSigningIn: Boolean = false,
    val error: String? = null
)

@HiltViewModel
class ProfileViewModel @Inject constructor(
    private val authRepository: AuthRepository,
    private val notificationRepository: NotificationRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(ProfileUiState(deviceId = authRepository.getDeviceId()))
    val uiState: StateFlow<ProfileUiState> = _uiState.asStateFlow()

    init {
        checkAuthState()
    }

    private fun checkAuthState() {
        _uiState.value = _uiState.value.copy(
            isSignedIn = authRepository.isSignedIn(),
            deviceId = authRepository.getDeviceId()
        )
        viewModelScope.launch {
            val uid = authRepository.getUserId()
            _uiState.value = _uiState.value.copy(userId = uid)
        }
    }

    fun signInAnonymously() {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isSigningIn = true, error = null)
            val result = authRepository.signInAnonymously()
            result.onSuccess { token ->
                _uiState.value = _uiState.value.copy(
                    isSignedIn = true,
                    isSigningIn = false,
                    userId = authRepository.isSignedIn().toString()
                )
            }.onFailure { error ->
                _uiState.value = _uiState.value.copy(
                    isSigningIn = false,
                    error = error.message ?: "Sign-in failed"
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
