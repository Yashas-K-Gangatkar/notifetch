"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function NotificationsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[NotificationsError]", error);
  }, [error]);

  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Failed to load notifications</h3>
        <p className="text-sm text-muted-foreground mb-4">Please try refreshing the page.</p>
        <Button onClick={reset} size="sm" className="bg-gradient-to-r from-amber-500 to-orange-600 text-white">
          Retry
        </Button>
      </div>
    </div>
  );
}
