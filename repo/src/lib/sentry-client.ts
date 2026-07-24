import * as Sentry from "@sentry/nextjs";

/**
 * Sentry client-side configuration.
 *
 * v2.9.40: Error monitoring loop.
 *
 * The DSN is read from NEXT_PUBLIC_SENTRY_DSN env var. If not set, Sentry
 * is a no-op (won't crash, won't send data). This lets us ship the integration
 * code now and enable it later by just setting the env var on Vercel.
 *
 * To enable:
 *   1. Create a project at https://sentry.io (free tier: 5k errors/month)
 *   2. Get the DSN from Project Settings → Client Keys
 *   3. Add NEXT_PUBLIC_SENTRY_DSN to Vercel env vars
 *   4. Redeploy
 *
 * Once enabled, every unhandled error on notifetch.in will be reported to
 * Sentry with full stack trace, browser info, and breadcrumbs. The Sentry
 * dashboard shows new errors within seconds of them happening in prod.
 */
export function registerSentry() {
  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

  if (!dsn) {
    // No DSN configured — Sentry stays inactive. Safe for dev/preview environments.
    if (process.env.NODE_ENV === "production") {
      console.warn("[Sentry] NEXT_PUBLIC_SENTRY_DSN not set — error monitoring is OFF in production");
    }
    return;
  }

  Sentry.init({
    dsn,
    tracesSampleRate: 0.1, // 10% of transactions traced (perf monitoring)
    replaysSessionSampleRate: 0.01, // 1% of sessions recorded (session replay)
    replaysOnErrorSampleRate: 1.0, // 100% of error sessions recorded
    environment: process.env.NODE_ENV,
    beforeSend(event) {
      // Filter out noisy non-errors we don't care about
      if (event.request?.url?.includes("/api/health")) return null;
      return event;
    },
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: false, // Don't mask text — we need to see error context
        blockAllMedia: false,
      }),
    ],
  });
}
