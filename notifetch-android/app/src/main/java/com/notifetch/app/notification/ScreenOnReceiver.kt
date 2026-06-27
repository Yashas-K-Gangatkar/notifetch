package com.notifetch.app.notification

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.util.Log
import com.notifetch.app.worker.SyncWorker

/**
 * v2.9.35: Triggers an immediate listener health check when the screen turns on.
 *
 * Why this exists:
 *   WorkManager periodic workers are constrained to a 15-minute minimum interval,
 *   and on Realme/Oppo/Vivo/Xiaomi they are often delayed by 30-60 minutes when
 *   the app is in the background. When Realme kills NotiFetchListenerService,
 *   the user can be "blind" to incoming delivery notifications for that entire
 *   window — losing money.
 *
 *   This receiver fires [SyncWorker.checkListenerHealthNow] whenever the screen
 *   turns on, which kicks a OneTimeWorkRequest that calls forceListenerRebind()
 *   if the listener is dead. This brings the worst-case blind window down from
 *   "15-60 minutes" to "next time the user touches their phone".
 *
 * Registration:
 *   Registered at runtime in NotiFetchApp.onCreate(). NOT registered in the
 *   AndroidManifest because Android 8+ (API 26+) blocks manifest receivers for
 *   implicit broadcasts like ACTION_SCREEN_ON. Runtime registration is the
 *   correct approach per the Android documentation:
 *   https://developer.android.com/guide/components/broadcasts#context-registered-receivers
 *
 * Lifecycle:
 *   The receiver lives for the lifetime of the application process. When the
 *   process is killed, the receiver is gone — but that's fine, because if the
 *   process is gone, the SyncWorker periodic schedule will pick up the next
 *   rebind on its own when the process restarts.
 */
class ScreenOnReceiver : BroadcastReceiver() {

    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action == Intent.ACTION_SCREEN_ON) {
            Log.d(TAG, "Screen turned on — firing one-shot listener health check")
            SyncWorker.checkListenerHealthNow(context)
        }
    }

    companion object {
        private const val TAG = "ScreenOnReceiver"
    }
}
