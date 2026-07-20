"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Smartphone, Download } from "lucide-react";
import { track } from "@/lib/analytics";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showFab, setShowFab] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isInstalled, setIsInstalled] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(display-mode: standalone)").matches;
  });
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (isInstalled) return;

    // Check if user previously dismissed the prompt
    try {
      const dismissedAt = localStorage.getItem("notifetch_pwa_dismissed");
      if (dismissedAt) {
        const dismissedDate = new Date(parseInt(dismissedAt, 10));
        const daysSince = (Date.now() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24);
        // Re-show after 30 days
        if (daysSince < 30) {
          setDismissed(true);
          return;
        } else {
          // 30 days passed — clear the dismissal so we can show again
          localStorage.removeItem("notifetch_pwa_dismissed");
        }
      }
    } catch {
      // localStorage unavailable — proceed with default behavior
    }

    // Show floating button after 3 seconds
    const timer = setTimeout(() => {
      setShowFab(true);
    }, 3000);

    // Listen for beforeinstallprompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // Listen for successful install
    window.addEventListener("appinstalled", () => {
      setIsInstalled(true);
      setShowFab(false);
      setShowModal(false);
      setDeferredPrompt(null);
      // Clear any previous dismissal
      try { localStorage.removeItem("notifetch_pwa_dismissed"); } catch {}
    });

    return () => {
      clearTimeout(timer);
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, [isInstalled]);

  const handleInstall = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      track("pwa_install", { outcome }); // v2.9.81: analytics
      if (outcome === "accepted") {
        setIsInstalled(true);
        setShowFab(false);
        setShowModal(false);
      }
      setDeferredPrompt(null);
    }
  };

  const handleDontShowAgain = () => {
    track("pwa_install", { outcome: "dismissed" }); // v2.9.81: analytics
    try {
      localStorage.setItem("notifetch_pwa_dismissed", Date.now().toString());
    } catch {}
    setDismissed(true);
    setShowFab(false);
    setShowModal(false);
  };

  if (isInstalled || !showFab || dismissed) return null;

  return (
    <>
      {/* Floating Install Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setShowModal(true)}
          className="h-14 w-14 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-xl shadow-amber-500/25"
          size="icon"
          aria-label="Install NotiFetch app"
        >
          <Download className="w-6 h-6" />
        </Button>
      </div>

      {/* Install Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-amber-500" />
              Install NotiFetch
            </DialogTitle>
            <DialogDescription>
              Install NotiFetch on your device for the best experience — quick access, offline support, and push notifications.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {/* QR Code */}
            <div className="flex justify-center mb-4">
              <div className="bg-white rounded-xl p-3">
                <img
                  src="/qr-code.png"
                  alt="Scan QR code to install NotiFetch"
                  className="w-48 h-48 rounded-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                  }}
                />
              </div>
            </div>
            <p className="text-sm text-muted-foreground text-center mb-4">
              Scan with your phone camera to open NotiFetch, then tap &quot;Add to Home Screen&quot;.
            </p>

            {/* Install button (if browser supports it) */}
            {deferredPrompt ? (
              <Button
                onClick={handleInstall}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold"
              >
                <Download className="w-4 h-4 mr-2" />
                Install App
              </Button>
            ) : (
              <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-sm text-center">
                <p className="text-amber-600 dark:text-amber-400 font-medium">
                  On your phone, open this page in your browser and tap &quot;Add to Home Screen&quot; or &quot;Install App&quot;.
                </p>
              </div>
            )}

            {/* Don't show again — gives users control, re-prompts after 30 days */}
            <button
              onClick={handleDontShowAgain}
              className="w-full mt-3 text-xs text-muted-foreground hover:text-foreground transition-colors py-2"
              aria-label="Don't show install prompt again for 30 days"
            >
              Don&apos;t show again for 30 days
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
