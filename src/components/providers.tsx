"use client";

import { SessionProvider } from "next-auth/react";
import { PostHogProvider } from "@/components/posthog-provider";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <PostHogProvider>{children}</PostHogProvider>
    </SessionProvider>
  );
}
