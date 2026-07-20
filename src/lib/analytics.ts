/**
 * v2.9.81: Analytics event tracking
 *
 * Uses PostHog if NEXT_PUBLIC_POSTHOG_KEY is set, otherwise falls back to
 * a no-op (events are silently dropped). This lets us ship analytics without
 * requiring a PostHog account — set the env var when ready.
 *
 * Events tracked:
 *   - page_view: { path } — on every page navigation (auto-captured by PostHog)
 *   - sign_in: { method: 'google' | 'otp' } — on successful auth
 *   - sign_up: { method: 'google' | 'otp' } — on first-time user
 *   - dashboard_view: { notification_count, unread_count } — dashboard loaded
 *   - notification_open: { platform, category } — user opens a notification
 *   - notification_export: { format: 'csv' | 'json', count } — data export
 *   - pwa_install: { outcome: 'accepted' | 'dismissed' } — PWA prompt
 *   - share_earnings: { platform: 'whatsapp' | 'instagram' | 'copy' } — viral share
 *   - platform_toggle: { platform_id, enabled } — enable/disable platform
 *
 * All events are non-blocking (fire-and-forget). Failures are silently ignored.
 */

import { posthog } from "posthog-js";

type EventName =
  | "page_view"
  | "sign_in"
  | "sign_up"
  | "dashboard_view"
  | "notification_open"
  | "notification_export"
  | "pwa_install"
  | "share_earnings"
  | "platform_toggle";

interface EventProperties {
  [key: string]: string | number | boolean | null | undefined;
}

/**
 * Track an analytics event. Non-blocking, fire-and-forget.
 * Safe to call from client components.
 * If PostHog is not initialized (no env var), this is a no-op.
 */
export function track(event: EventName, properties?: EventProperties): void {
  if (typeof window === "undefined") return;

  try {
    // posthog is initialized by PostHogProvider on the client.
    // If not initialized, these calls are silently ignored.
    posthog.capture(event, properties || {});

    if (process.env.NODE_ENV === "development") {
      console.log("[analytics]", event, properties || {});
    }
  } catch {
    // Silently ignore — analytics should never break the app
  }
}

/**
 * Identify a user for analytics. Call after sign-in.
 */
export function identifyUser(userId: string, properties?: EventProperties): void {
  if (typeof window === "undefined") return;

  try {
    posthog.identify(userId, properties || {});
  } catch {
    // Silently ignore
  }
}

/**
 * Reset analytics state on sign-out.
 */
export function resetAnalytics(): void {
  if (typeof window === "undefined") return;

  try {
    posthog.reset();
  } catch {
    // Silently ignore
  }
}
