package com.notifetch.app.ui.viewmodel

import androidx.lifecycle.SavedStateHandle
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.notifetch.app.data.local.CapturedNotification
import com.notifetch.app.data.repository.NotificationRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

data class NotificationDetailUiState(
    val notification: CapturedNotification? = null,
    val isLoading: Boolean = true,
    val resolvedDisplayName: String? = null
)

@HiltViewModel
class NotificationDetailViewModel @Inject constructor(
    savedStateHandle: SavedStateHandle,
    private val repository: NotificationRepository
) : ViewModel() {

    private val notificationId: Long = savedStateHandle["notificationId"] ?: -1L

    private val _uiState = MutableStateFlow(NotificationDetailUiState())
    val uiState: StateFlow<NotificationDetailUiState> = _uiState.asStateFlow()

    init {
        loadNotification()
    }

    private fun loadNotification() {
        viewModelScope.launch {
            repository.getNotificationById(notificationId).collect { notification ->
                // Resolve the display name through the PlatformConfig
                val resolvedName = if (notification != null) {
                    repository.getResolvedDisplayName(notification.packageName)
                } else null

                _uiState.value = NotificationDetailUiState(
                    notification = notification,
                    isLoading = false,
                    resolvedDisplayName = resolvedName
                )
                // Mark as read
                if (notification != null && !notification.isRead) {
                    repository.markAsRead(notification.id)
                }
            }
        }
    }

    fun deleteNotification() {
        viewModelScope.launch {
            repository.deleteNotification(notificationId)
        }
    }
}
