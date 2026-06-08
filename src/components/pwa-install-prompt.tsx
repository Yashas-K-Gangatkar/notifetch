"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Smartphone, X, Download, QrCode } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [isInstalled, setIsInstalled] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(display-mode: standalone)").matches;
  });

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // Listen for successful install
    window.addEventListener("appinstalled", () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  // Expose deferredPrompt for dashboard install button
  useEffect(() => {
    if (deferredPrompt) {
      // @ts-expect-error custom property
      window.deferredPrompt = deferredPrompt;
    }
  }, [deferredPrompt]);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setIsInstalled(true);
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  if (isInstalled || !showPrompt) return null;

  return (
    <>
      {/* Floating install button */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowQR(!showQR)}
          className="h-12 w-12 rounded-full border-amber-500/30 bg-background/90 backdrop-blur-xl shadow-lg"
        >
          <QrCode className="w-5 h-5 text-amber-500" />
        </Button>
        <Button
          onClick={handleInstall}
          className="h-12 px-5 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold shadow-xl shadow-amber-500/25 gap-2"
        >
          <Download className="w-4 h-4" />
          Install App
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowPrompt(false)}
          className="h-8 w-8 rounded-full text-muted-foreground"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* QR Code popup */}
      {showQR && (
        <div className="fixed bottom-24 right-6 z-50 bg-card border border-border rounded-2xl p-5 shadow-2xl max-w-[280px]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-semibold">Install on Phone</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowQR(false)}
              className="h-6 w-6"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
          <div className="bg-white rounded-xl p-3 mb-3">
            <img
              src="/qr-code.png"
              alt="Scan to install NotiFetch"
              className="w-full h-auto rounded-lg"
            />
          </div>
          <p className="text-xs text-muted-foreground text-center leading-relaxed">
            Scan this QR code on your phone to open NotiFetch, then tap
            &quot;Add to Home Screen&quot; to install it as an app.
          </p>
        </div>
      )}
    </>
  );
}
