/**
 * Next.js instrumentation hook — runs once on server startup.
 *
 * v2.9.40: Initializes Sentry server-side error monitoring.
 *
 * https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { registerSentryServer } = await import("@/lib/sentry-server");
    await registerSentryServer();
  }
}
