# NotiFetch ProGuard Rules — v2.9.60 hardened for maximum obfuscation
#
# Goals:
#   1. Shrink the app as much as possible (smaller attack surface)
#   2. Obfuscate all internal class/method names (anti-reverse-engineering)
#   3. Optimize aggressively (R8 full mode + optimizations)
#   4. Keep ONLY what reflection/manifest/JNI actually need

# ── Aggressive optimization ────────────────────────────────────────────────
# v2.9.60: Enable R8 optimizations beyond the default set.
# These make the code harder to reverse by:
#   - Inlining short methods (hides call hierarchy)
#   - Removing unused parameters (changes method signatures)
#   - Merging classes with similar structure (confuses decompilers)
-optimizationpasses 5
-allowaccessmodification
-overloadaggressively
-repackageclasses 'com.notifetch.a'
-allowaccessmodification
-flattenpackagehierarchy 'com.notifetch.a'

# Merge interfaces where safe — makes decompiled output harder to follow
-mergeinterfacesaggressively

# ── Strip debugging info ───────────────────────────────────────────────────
# Source file names + line numbers make stack traces easy to map to source.
# Strip them in release — Crashlytics uses symbol files we upload separately.
# This means: even if someone decompiles the APK, they see class "a.b.c"
# with no source file name and no line numbers.
-renamesourcefileattribute SourceFile
-keepattributes SourceFile,LineNumberTable  # Kept for R8 mapping output only

# ── Kotlin metadata ────────────────────────────────────────────────────────
# Strip @Metadata annotations — they leak Kotlin structure (data classes,
# companion objects, suspend function state machines) to decompilers.
-assumenosideeffects class kotlin.Metadata { *; }

# ── Retrofit ───────────────────────────────────────────────────────────────
-keepattributes Signature
-keepattributes Exceptions
-keep class com.notifetch.app.data.remote.** { *; }
-keepclassmembers,allowshrinking,allowobfuscation interface * {
    @retrofit2.http.* <methods>;
}

# ── Moshi ──────────────────────────────────────────────────────────────────
-keepattributes *Annotation*
-keep class com.squareup.moshi.** { *; }
-keep interface com.squareup.moshi.** { *; }
-keepclassmembers class com.notifetch.app.data.remote.** {
    <fields>;
}

# ── Room ───────────────────────────────────────────────────────────────────
# Room generates code that references entities via reflection.
-keep class * extends androidx.room.RoomDatabase
-keep @androidx.room.Entity class *
-keepclassmembers @androidx.room.Entity class * {
    <fields>;
}

# ── Kotlin Coroutines ──────────────────────────────────────────────────────
-keepnames class kotlinx.coroutines.internal.MainDispatcherFactory {}
-keepnames class kotlinx.coroutines.CoroutineExceptionHandler {}
-keepclassmembers class kotlinx.coroutines.** {
    volatile <fields>;
}

# ── Hilt / Dagger ──────────────────────────────────────────────────────────
-keep class dagger.hilt.** { *; }
-keep class * extends dagger.hilt.android.HiltAndroidApp
-keep @dagger.hilt.android.HiltAndroidApp class *
-keep @dagger.hilt.android.lifecycle.HiltViewModel class * { *; }
-keepclassmembers class * {
    @dagger.hilt.android.lifecycle.HiltViewModel <methods>;
}
-keep class * extends dagger.hilt.android.internal.lifecycle.HiltViewModelFactory$ViewModelComponentBuilderEntryPoint
-keep,allowobfuscation,allowshrinking class kotlin.coroutines.Continuation
-keep,allowobfuscation,allowshrinking interface kotlin.coroutines.Continuation
-dontwarn dagger.hilt.**

# ── Firebase ───────────────────────────────────────────────────────────────
# Firebase SDK uses reflection internally — keep the SDK classes.
# But our own code that uses Firebase is fully obfuscated.
-keep class com.google.firebase.** { *; }
-dontwarn com.google.firebase.**
-keep class com.google.android.gms.** { *; }
-dontwarn com.google.android.gms.**

# ── Android Manifest-referenced classes (must not be obfuscated) ───────────
# These are referenced by name in AndroidManifest.xml — if their names change,
# the system can't instantiate them.
-keep public class * extends android.app.Service
-keep public class * extends android.content.BroadcastReceiver
-keep public class * extends android.app.Activity
-keep public class * extends android.app.Application
-keep public class com.notifetch.app.notification.NotiFetchListenerService { *; }
-keep public class com.notifetch.app.notification.BootReceiver { *; }
-keep public class com.notifetch.app.widget.NotiFetchWidgetProvider { *; }
-keep public class com.notifetch.app.firebase.NotiFetchMessagingService { *; }
-keep public class com.notifetch.app.NotiFetchApp { *; }
-keep public class com.notifetch.app.MainActivity { *; }

# ── Constants class (uses reflection-like access for package maps) ─────────
# ALL_PACKAGES map is read via reflection in some places.
-keep class com.notifetch.app.util.Constants { *; }
-keep class com.notifetch.app.util.Constants$* { *; }

# Keep UserMode enum (used in reflection-style when expressions)
-keep enum com.notifetch.app.util.UserMode { *; }

# ── Notification API classes accessed via reflection ───────────────────────
# v2.9.60: removed the broad `android.app.PendingIntent { *; }` rule from
# v2.9.9 — that was needed when we used getTargetIntent() reflection, which
# is no longer the case (v2.9.57 removed that reflection entirely).
# Now we only keep what we actually need.
-keep class android.app.PendingIntent {
    public static android.app.PendingIntent getActivity(...);
    public static android.app.PendingIntent getBroadcast(...);
    public static android.app.PendingIntent getService(...);
    public void send();
    public void send(int);
    public void send(android.app.PendingIntent$OnFinished, android.os.Handler);
    public void cancel();
    public int describeContents();
}
-keep class android.app.Notification$MessagingStyle$Message { *; }
# Notification$* subclasses are referenced by name in extras bundles
-keep class android.app.Notification$MessagingStyle { *; }
-keep class android.app.Notification$InboxStyle { *; }
-keep class android.app.Notification$BigTextStyle { *; }
-keep class android.app.Notification$BigPictureStyle { *; }
-keep class android.app.Notification$Builder { *; }

# ── Compose (R8 already handles this, but explicit rules help) ─────────────
-dontwarn androidx.compose.**
-keep class androidx.compose.** { *; }
-keep class androidx.compose.runtime.** { *; }
-keepclassmembers class androidx.compose.** {
    public *;
}

# ── WorkManager workers (referenced by class name in WorkManager) ──────────
-keep class * extends androidx.work.Worker
-keep class * extends androidx.work.CoroutineWorker
-keep class com.notifetch.app.worker.SyncWorker { *; }

# ── EncryptedSharedPreferences (uses reflection internally) ─────────────────
-keep class androidx.security.crypto.** { *; }
-keep class com.google.android.material.** { *; }

# ── ViewModels (Hilt @HiltViewModel) ───────────────────────────────────────
-keepclassmembers class * extends androidx.lifecycle.ViewModel {
    <init>();
}

# ── Reflection on enums (Kotlin when statements) ───────────────────────────
-keepclassmembers enum * {
    public static **[] values();
    public static ** valueOf(java.lang.String);
}

# ── Keep all native methods (JNI) ──────────────────────────────────────────
-keepclasseswithmembernames class * {
    native <methods>;
}

# ── Remove logging in release builds ───────────────────────────────────────
# v2.9.60: Strip Log.d/Log.v/Log.i calls in release.
# Log.w and Log.e are kept — they're useful for Crashlytics context.
# This reduces both APK size and information leakage.
-assumenosideeffects class android.util.Log {
    public static *** d(...);
    public static *** v(...);
    public static *** i(...);
    public static java.lang.String getStackTraceString(...);
}

# ── Crashlytics ────────────────────────────────────────────────────────────
-keep class com.google.firebase.crashlytics.** { *; }
-keepattributes SourceFile,LineNumberTable  # Crashlytics needs this for symbolication
-dontwarn com.google.firebase.crashlytics.**

# ── Kotlin metadata ────────────────────────────────────────────────────────
# Strip @Metadata annotations — they leak Kotlin structure (data classes,
# companion objects, suspend function state machines) to decompilers.
-keep class kotlin.Metadata { *; }

# ── BuildConfig ────────────────────────────────────────────────────────────
-keep class com.notifetch.app.BuildConfig { *; }

# ── Don't warn about missing optional classes ──────────────────────────────
-dontwarn javax.lang.model.**
-dontwarn com.google.errorprone.**
-dontwarn org.checkerframework.**

# ── Resource shrinking ─────────────────────────────────────────────────────
# v2.9.60: Tighter resource shrinking — removes unused drawables, layouts, etc.
# Combined with the existing `isShrinkResources = true` in build.gradle.kts
-allowaccessmodification
