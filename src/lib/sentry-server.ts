import * as Sentry from "@sentry/nextjs";

/**
 * Sentry server-side configuration.
 *
 * Used by instrumentation.ts to initialize Sentry on the server (API routes,
 * server components, edge functions). Catches errors that happen server-side
 * (DB failures, Firebase Admin errors, etc.) and reports them to Sentry.
 *
 * Reads SENTRY_DSN env var (server-side only — NOT exposed to client).
 * If not set, Sentry is a no-op.
 */
export async function registerSentryServer() {
  const dsn = process.env.SENTRY_DSN;

  if (!dsn) {
    return;
  }

  Sentry.init({
    dsn,
    tracesSampleRate: 0.1,
    environment: process.env.NODE_ENV,
    beforeSend(event) {
      // Don't report health check endpoint errors — they're expected during outages
      if (event.request?.url?.includes("/api/health")) return null;
      return event;
    },
  });
}
