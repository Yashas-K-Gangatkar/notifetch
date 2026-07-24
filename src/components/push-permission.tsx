"use client";

import { useEffect, useState, useCallback } from "react";
import { Bell, BellOff, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getFirebaseMessagingClient,
  getVapidKey,
  isFirebaseClientConfigured,
} from "@/lib/firebase-client";
import { getToken, onMessage } from "firebase/messaging";
import { track } from "@/lib/analytics";

type PermissionState = "loading" | "prompt" | "granted" | "denied" | "unsupported" | "unconfigured";

interface PushPermissionProps {
  /** If true, show a compact inline badge instead of a card UI */
  compact?: boolean;
  /** Callback when permission is granted and token is registered */
  onPermissionGranted?: () => void;
  /** Callback when permission is denied */
  onPermissionDenied?: () => void;
}

export function PushPermission({
  compact = false,
  onPermissionGranted,
  onPermissionDenied,
}: PushPermissionProps) {
  const [permissionState, setPermissionState] = useState<PermissionState>("loading");
  const [isRequesting, setIsRequesting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check initial permission state
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if Firebase client is configured
    if (!isFirebaseClientConfigured()) {
      setPermissionState("unconfigured");
      return;
    }

    // Check if notifications are supported
    if (!("Notification" in window)) {
      setPermissionState("unsupported");
      return;
    }

    // Check current permission state
    if (Notification.permission === "granted") {
      setPermissionState("granted");
    } else if (Notification.permission === "denied") {
      setPermissionState("denied");
    } else {
      setPermissionState("prompt");
    }
  }, []);

  // Listen for foreground messages when permission is granted
  useEffect(() => {
    if (permissionState !== "granted") return;

    let unsubscribe: (() => void) | undefined;

    async function setupForegroundListener() {
      try {
        const messaging = await getFirebaseMessagingClient();
        if (!messaging) return;

        unsubscribe = onMessage(messaging, (payload) => {
          console.log("[PushPermission] Foreground message received:", payload);

          // Show an in-app notification for foreground messages
          if (payload.notification) {
            const { title = "NotiFetch", body } = payload.notification;
            // Use the Notification API directly for foreground messages
            if ("Notification" in window && Notification.permission === "granted") {
              new Notification(title, {
                body: body || "",
                icon: "/icons/icon-192x192.png",
                badge: "/icons/icon-72x72.png",
                data: payload.data,
              });
            }
          }
        });
      } catch (err) {
        console.error("[PushPermission] Failed to set up foreground listener:", err);
      }
    }

    setupForegroundListener();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [permissionState]);

  /**
   * Register the FCM token with the server.
   */
  const registerToken = useCallback(async (token: string) => {
    try {
      const response = await fetch("/api/notifications/register-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fcmToken: token }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to register token");
      }

      console.log("[PushPermission] FCM token registered with server");
    } catch (err) {
      console.error("[PushPermission] Failed to register FCM token:", err);
      setError(err instanceof Error ? err.message : "Failed to register token");
    }
  }, []);

  /**
   * Request notification permission and get FCM token.
   */
  const requestPermission = useCallback(async () => {
    setIsRequesting(true);
    setError(null);

    try {
      // Request browser notification permission
      const permission = await Notification.requestPermission();

      if (permission !== "granted") {
        setPermissionState("denied");
        onPermissionDenied?.();
        setIsRequesting(false);
        return;
      }

      // Get Firebase messaging instance
      const messaging = await getFirebaseMessagingClient();
      if (!messaging) {
        setError("Firebase messaging is not available in this browser");
        setPermissionState("unsupported");
        setIsRequesting(false);
        return;
      }

      // Get VAPID key
      const vapidKey = getVapidKey();
      if (!vapidKey) {
        setError("VAPID key is not configured. Set NEXT_PUBLIC_FIREBASE_VAPID_KEY.");
        setPermissionState("unconfigured");
        setIsRequesting(false);
        return;
      }

      // Get FCM registration token
      const currentToken = await getToken(messaging, { vapidKey });

      if (!currentToken) {
        setError("Failed to get FCM token. Make sure the service worker is registered.");
        setPermissionState("prompt");
        setIsRequesting(false);
        return;
      }

      // Register the token with the server
      await registerToken(currentToken);

      track("push_notifications_enabled");
      setPermissionState("granted");
      onPermissionGranted?.();
    } catch (err) {
      console.error("[PushPermission] Error requesting permission:", err);
      setError(err instanceof Error ? err.message : "Failed to request permission");
      setPermissionState("prompt");
    } finally {
      setIsRequesting(false);
    }
  }, [registerToken, onPermissionGranted, onPermissionDenied]);

  // ─── Compact badge variant ────────────────────────────────────────────────
  if (compact) {
    if (permissionState === "granted") {
      return (
        <span className="inline-flex items-center gap-1.5 text-sm text-emerald-400">
          <Bell className="h-4 w-4" />
          Push On
        </span>
      );
    }

    if (permissionState === "denied" || permissionState === "unsupported" || permissionState === "unconfigured") {
      return (
        <span className="inline-flex items-center gap-1.5 text-sm text-zinc-500">
          <BellOff className="h-4 w-4" />
          Push Off
        </span>
      );
    }

    return (
      <Button
        size="sm"
        variant="outline"
        onClick={requestPermission}
        disabled={isRequesting}
        className="gap-1.5"
      >
        {isRequesting ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <Bell className="h-3.5 w-3.5" />
        )}
        Enable Push
      </Button>
    );
  }

  // ─── Full card variant ────────────────────────────────────────────────────

  // Loading state
  if (permissionState === "loading") {
    return (
      <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4">
        <div className="flex items-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin text-amber-400" />
          <div>
            <p className="text-sm font-medium text-zinc-200">Checking notification status...</p>
          </div>
        </div>
      </div>
    );
  }

  // Granted state
  if (permissionState === "granted") {
    return (
      <div className="rounded-lg border border-emerald-900/50 bg-emerald-950/30 p-4">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-emerald-400" />
          <div>
            <p className="text-sm font-medium text-emerald-300">Push notifications enabled</p>
            <p className="text-xs text-emerald-400/70">
              You&apos;ll receive order alerts and delivery updates.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Denied state
  if (permissionState === "denied") {
    return (
      <div className="rounded-lg border border-red-900/50 bg-red-950/30 p-4">
        <div className="flex items-center gap-3">
          <XCircle className="h-5 w-5 text-red-400" />
          <div>
            <p className="text-sm font-medium text-red-300">Notifications blocked</p>
            <p className="text-xs text-red-400/70">
              Enable notifications in your browser settings to receive order alerts.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Unsupported state
  if (permissionState === "unsupported") {
    return (
      <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4">
        <div className="flex items-center gap-3">
          <BellOff className="h-5 w-5 text-zinc-500" />
          <div>
            <p className="text-sm font-medium text-zinc-400">Notifications not supported</p>
            <p className="text-xs text-zinc-500">
              Your browser doesn&apos;t support push notifications.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Unconfigured state
  if (permissionState === "unconfigured") {
    return (
      <div className="rounded-lg border border-amber-900/50 bg-amber-950/30 p-4">
        <div className="flex items-center gap-3">
          <BellOff className="h-5 w-5 text-amber-400" />
          <div>
            <p className="text-sm font-medium text-amber-300">Push notifications not configured</p>
            <p className="text-xs text-amber-400/70">
              Firebase client configuration is missing. Contact support.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Prompt state — show the permission request UI
  return (
    <div className="rounded-lg border border-amber-900/50 bg-amber-950/30 p-4">
      <div className="flex items-start gap-3">
        <div className="rounded-full bg-amber-500/20 p-2">
          <Bell className="h-5 w-5 text-amber-400" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-amber-300">Enable push notifications</p>
          <p className="mt-1 text-xs text-amber-400/70">
            Get instant alerts for new orders, delivery updates, and earnings — directly on your device.
          </p>
          {error && (
            <p className="mt-2 text-xs text-red-400">{error}</p>
          )}
          <Button
            size="sm"
            onClick={requestPermission}
            disabled={isRequesting}
            className="mt-3 gap-1.5 bg-amber-500 text-black hover:bg-amber-400"
          >
            {isRequesting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Enabling...
              </>
            ) : (
              <>
                <Bell className="h-3.5 w-3.5" />
                Enable Notifications
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default PushPermission;
