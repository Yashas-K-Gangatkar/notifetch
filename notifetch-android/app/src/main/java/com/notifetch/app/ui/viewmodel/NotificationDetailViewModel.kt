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

    // v2.9.78: Track if we've ever loaded the notification successfully.
    // If yes, don't clear to null on transient Flow emissions.
    private var hasLoadedOnce = false

    init {
        loadNotification()
    }

    private fun loadNotification() {
        viewModelScope.launch {
            repository.getNotificationById(notificationId).collect { notification ->
                // v2.9.78 FIX: Don't clear to null if we've already loaded it.
                // When the app goes to background (opening source app) and comes back,
                // the Flow might briefly emit null before re-querying the DB.
                // This caused "Notification no longer available" to flash.
                if (notification != null) {
                    hasLoadedOnce = true
                    val resolvedName = repository.getResolvedDisplayName(notification.packageName)
                    _uiState.value = NotificationDetailUiState(
                        notification = notification,
                        isLoading = false,
                        resolvedDisplayName = resolvedName
                    )
                    // Mark as read
                    if (!notification.isRead) {
                        repository.markAsRead(notification.id)
                    }
                } else if (!hasLoadedOnce) {
                    // Only show "not found" if we NEVER loaded it (first query returned null)
                    _uiState.value = NotificationDetailUiState(
                        notification = null,
                        isLoading = false,
                        resolvedDisplayName = null
                    )
                }
                // If hasLoadedOnce is true and notification is null, keep the last known state.
                // This prevents the "no longer available" flash during transient null emissions.
            }
        }
    }

    fun deleteNotification() {
        viewModelScope.launch {
            repository.deleteNotification(notificationId)
        }
    }
}
