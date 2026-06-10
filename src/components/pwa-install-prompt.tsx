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

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (isInstalled) return;

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
      if (outcome === "accepted") {
        setIsInstalled(true);
        setShowFab(false);
        setShowModal(false);
      }
      setDeferredPrompt(null);
    }
  };

  if (isInstalled || !showFab) return null;

  return (
    <>
      {/* Floating Install Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setShowModal(true)}
          className="h-14 w-14 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-xl shadow-amber-500/25"
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
              <div className="bg-card rounded-xl p-3">
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
                className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold"
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
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
