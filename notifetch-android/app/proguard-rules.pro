# NotiFetch ProGuard Rules

# Retrofit
-keepattributes Signature
-keepattributes Exceptions
-keep class com.notifetch.app.data.remote.** { *; }
-keepclassmembers,allowshrinking,allowobfuscation interface * {
    @retrofit2.http.* <methods>;
}

# Moshi
-keepattributes Signature
-keepattributes *Annotation*
-keep class com.squareup.moshi.** { *; }
-keep interface com.squareup.moshi.** { *; }
-keepclassmembers class com.notifetch.app.data.remote.** {
    <fields>;
}

# Room
-keep class * extends androidx.room.RoomDatabase
-keep @androidx.room.Entity class *

# Kotlin Coroutines
-keepnames class kotlinx.coroutines.internal.MainDispatcherFactory {}
-keepnames class kotlinx.coroutines.CoroutineExceptionHandler {}
-keepclassmembers class kotlinx.coroutines.** {
    volatile <fields>;
}

# Hilt
-dontwarn dagger.hilt.**

# Firebase
-keep class com.google.firebase.** { *; }
-dontwarn com.google.firebase.**

# ── v2.9.9: Reflection-based PendingIntent access ─────────────────────────
# NotiFetchListenerService uses reflection to call PendingIntent.getTargetIntent()
# because the Kotlin compiler sometimes fails to resolve this method in certain
# SDK configurations (even though it's a public API since API 1).
# Without this keep rule, R8 minification may rename/remove the method, breaking
# deep-link extraction and causing "Open App" to fall back to Play Store.
-keep class android.app.PendingIntent { *; }
-keep class android.app.PendingIntent$* { *; }

# Also keep Notification.* classes used via reflection (MessagingStyle.Message)
-keep class android.app.Notification$MessagingStyle$Message { *; }
-keep class android.app.Notification$* { *; }

# Keep our Constants class (uses reflection-like access for package maps)
-keep class com.notifetch.app.util.Constants { *; }
-keep class com.notifetch.app.util.Constants$* { *; }

# Keep UserMode enum (used in reflection-style when expressions)
-keep class com.notifetch.app.util.UserMode { *; }

# BootReceiver must not be obfuscated (referenced from AndroidManifest)
-keep class com.notifetch.app.notification.BootReceiver { *; }
-keep class com.notifetch.app.notification.NotiFetchListenerService { *; }
-keep class com.notifetch.app.notification.PendingIntentCache { *; }
-keep class com.notifetch.app.notification.NotificationParser { *; }
-keep class com.notifetch.app.notification.NotificationParser$* { *; }


