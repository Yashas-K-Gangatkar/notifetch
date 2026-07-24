"use client";

import { useEffect } from "react";
import { registerSentry } from "@/lib/sentry-client";

/**
 * v2.9.40: Initializes Sentry on the client side.
 *
 * This component mounts inside the root layout and calls registerSentry()
 * once on mount. Sentry then captures all unhandled errors for the rest of
 * the session.
 *
 * If NEXT_PUBLIC_SENTRY_DSN is not set, registerSentry() is a no-op.
 */
export function SentryInit() {
  useEffect(() => {
    registerSentry();
  }, []);

  return null; // Renders nothing — just runs the side effect
}
