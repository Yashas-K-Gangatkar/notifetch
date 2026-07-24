"use client";

import { useEffect, useState } from "react";
import { WifiOff } from "lucide-react";

/**
 * OfflineIndicator shows a small banner at the top of the page
 * when the user goes offline.
 */
export function OfflineIndicator() {
  const [isOffline, setIsOffline] = useState(() => {
    if (typeof window === "undefined") return false;
    return !navigator.onLine;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] bg-amber-500 text-black text-center py-2 px-4 text-sm font-medium flex items-center justify-center gap-2">
      <WifiOff className="w-4 h-4" />
      You&apos;re offline — some features may not be available
    </div>
  );
}
