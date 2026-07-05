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



# ── v2.9.60 Safe obfuscation additions ─────────────────────────────────────
# These are SAFE — they don't break reflection, they just remove info leaks.
# R8 full mode (enabled in gradle.properties) handles all class/method renaming.

# Strip source file names from stack traces (anti-reverse-engineering)
# Crashlytics uses the uploaded mapping.txt for symbolication instead.
-renamesourcefileattribute SourceFile

# Strip Log.d/Log.v/Log.i calls in release builds (reduces info leakage)
# Keep Log.w and Log.e — useful for Crashlytics context
-assumenosideeffects class android.util.Log {
    public static *** d(...);
    public static *** v(...);
    public static *** i(...);
    public static java.lang.String getStackTraceString(...);
}

# Strip Kotlin @Metadata annotations — prevents decompilers from
# reconstructing data classes, companion objects, suspend state machines
-assumenosideeffects class kotlin.Metadata { *; }

# v2.9.60: Explicitly keep the new stripGrantFlags helper's dependencies
# (the function itself is private, R8 will inline/rename it, but the
# Intent.selector and ClipData access must not be stripped)
-keepclassmembers class android.content.Intent {
    public android.content.Intent getSelector();
    public void setSelector(android.content.Intent);
    public android.content.ClipData getClipData();
    public void setClipData(android.content.ClipData);
    public int getFlags();
    public void setFlags(int);
    public void addFlags(int);
}
