package com.notifetch.app.notification

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import com.notifetch.app.worker.SyncWorker

class ScreenOnReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action == Intent.ACTION_SCREEN_ON) {
            SyncWorker.checkListenerHealthNow(context)
        }
    }
}
