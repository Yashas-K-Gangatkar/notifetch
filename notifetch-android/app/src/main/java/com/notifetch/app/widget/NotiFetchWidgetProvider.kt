package com.notifetch.app.widget

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.widget.RemoteViews
import com.notifetch.app.MainActivity
import com.notifetch.app.R
import com.notifetch.app.data.local.NotiFetchDatabase
import com.notifetch.app.util.Helpers
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

/**
 * v2.9.12: Home Screen Widget
 *
 * Shows the latest 3 captured notifications on the user's home screen.
 * Tapping any item opens NotiFetch directly to that notification's detail.
 */
class NotiFetchWidgetProvider : AppWidgetProvider() {

    override fun onUpdate(
        context: Context,
        appWidgetManager: AppWidgetManager,
        appWidgetIds: IntArray
    ) {
        appWidgetIds.forEach { appWidgetId ->
            updateWidget(context, appWidgetManager, appWidgetId)
        }
    }

    override fun onReceive(context: Context, intent: Intent) {
        super.onReceive(context, intent)
        if (intent.action == ACTION_REFRESH_WIDGET) {
            val appWidgetManager = AppWidgetManager.getInstance(context)
            val appWidgetIds = appWidgetManager.getAppWidgetIds(
                ComponentName(context, NotiFetchWidgetProvider::class.java)
            )
            appWidgetIds.forEach { appWidgetId ->
                updateWidget(context, appWidgetManager, appWidgetId)
            }
        }
    }

    private fun updateWidget(
        context: Context,
        appWidgetManager: AppWidgetManager,
        appWidgetId: Int
    ) {
        CoroutineScope(Dispatchers.IO).launch {
            try {
                val dao = NotiFetchDatabase.getDatabase(context).notificationDao()
                val notifications = dao.getLatestNotifications(3)

                val views = RemoteViews(context.packageName, R.layout.widget_notifetch)

                if (notifications.isEmpty()) {
                    views.setTextViewText(R.id.widget_title, "NotiFetch")
                    views.setTextViewText(R.id.widget_subtitle, "Waiting for notifications...")
                    views.setTextViewText(R.id.widget_item_1, "Tap to open NotiFetch")
                    views.setTextViewText(R.id.widget_item_2, "")
                    views.setTextViewText(R.id.widget_item_3, "")
                } else {
                    views.setTextViewText(R.id.widget_title, "NotiFetch — Latest")
                    views.setTextViewText(
                        R.id.widget_subtitle,
                        "${notifications.size} recent notification${if (notifications.size > 1) "s" else ""}"
                    )
                    val items = listOf(R.id.widget_item_1, R.id.widget_item_2, R.id.widget_item_3)
                    for (i in items.indices) {
                        if (i < notifications.size) {
                            val n = notifications[i]
                            val time = Helpers.formatRelativeTime(n.receivedAt)
                            views.setTextViewText(
                                items[i],
                                "${n.platform} • $time\n${n.title.take(50)}"
                            )
                            val pendingIntent = PendingIntent.getActivity(
                                context,
                                n.id.toInt(),
                                Intent(context, MainActivity::class.java).apply {
                                    action = "OPEN_NOTIFICATION_DETAIL"
                                    putExtra("notificationId", n.id)
                                    flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
                                },
                                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
                            )
                            views.setOnClickPendingIntent(items[i], pendingIntent)
                        } else {
                            views.setTextViewText(items[i], "")
                        }
                    }
                }

                val homeIntent = PendingIntent.getActivity(
                    context,
                    0,
                    Intent(context, MainActivity::class.java).apply {
                        flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
                    },
                    PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
                )
                views.setOnClickPendingIntent(R.id.widget_root, homeIntent)

                withContext(Dispatchers.Main) {
                    appWidgetManager.updateAppWidget(appWidgetId, views)
                }
            } catch (e: Exception) {
                android.util.Log.e("NotiFetchWidget", "Update failed", e)
            }
        }
    }

    companion object {
        const val ACTION_REFRESH_WIDGET = "com.notifetch.app.REFRESH_WIDGET"

        fun refreshAllWidgets(context: Context) {
            val intent = Intent(context, NotiFetchWidgetProvider::class.java).apply {
                action = ACTION_REFRESH_WIDGET
            }
            context.sendBroadcast(intent)
        }
    }
}
