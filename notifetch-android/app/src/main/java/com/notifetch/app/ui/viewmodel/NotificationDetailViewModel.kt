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
    val isLoading: Boolean = true
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
                _uiState.value = NotificationDetailUiState(
                    notification = notification,
                    isLoading = false
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
