"use client";

import { useEffect } from "react";
import posthog from "posthog-js";

/**
 * v2.9.81: PostHog Provider
 *
 * Initializes PostHog on the client if NEXT_PUBLIC_POSTHOG_KEY is set.
 * If the env var is not set, this component is a no-op (PostHog never loads).
 *
 * Wrap this around the app in providers.tsx. It runs client-side only.
 */
export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (!key) return; // PostHog not configured — analytics calls become no-ops

    try {
      posthog.init(key, {
        api_host: "https://app.posthog.com",
        autocapture: false, // we track events manually via lib/analytics.ts
        capture_pageview: true,
        capture_pageleave: false,
        disable_session_recording: true,
        persistence: "localStorage+cookie",
        loaded: () => {
          if (process.env.NODE_ENV === "development") {
            console.log("[posthog] loaded");
          }
        },
      });
    } catch {
      // Silently ignore — analytics should never break the app
    }
  }, []);

  return <>{children}</>;
}
