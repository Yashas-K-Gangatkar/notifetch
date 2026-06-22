"use client";

import { useState, useCallback, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero-section";
import { NotificationTrainTicker } from "@/components/notification-train-ticker";
import { PageLoadAnimation } from "@/components/page-load-animation";
import { HowItWorksSection } from "@/components/how-it-works-section";
import { DashboardSection } from "@/components/dashboard-section";
import { EarningsSection } from "@/components/earnings-section";
import { PlatformsSection } from "@/components/platforms-section";
import { SettingsSection } from "@/components/settings-section";
import { Separator } from "@/components/ui/separator";
import { Zap } from "lucide-react";
import type { DeliveryOrder } from "@/lib/data";

export default function Home() {
  const [activeSection, setActiveSection] = useState("hero");
  const [acceptedOrders, setAcceptedOrders] = useState<DeliveryOrder[]>([]);

  // Track which section is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -40% 0px" }
    );

    const sections = document.querySelectorAll("section[id]");
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const handleNavigate = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const handleAccept = useCallback((order: DeliveryOrder) => {
    setAcceptedOrders((prev) => [...prev, order]);
  }, []);

  const handleDecline = useCallback((_orderId: string) => {
    // Order declined - could track analytics here
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* v2.9.13: Page Load Animation — plays once per session */}
      <PageLoadAnimation />

      <Navbar activeSection={activeSection} onNavigate={handleNavigate} />

      <main className="flex-1">
        <HeroSection onNavigate={handleNavigate} />

        {/* v2.9.13: Notification Train Ticker — live "railway train" of notifications */}
        <NotificationTrainTicker />

        <Separator className="max-w-7xl mx-auto" />
        <HowItWorksSection onNavigate={handleNavigate} />
        <Separator className="max-w-7xl mx-auto" />
        <DashboardSection
          onAccept={handleAccept}
          onDecline={handleDecline}
          acceptedOrders={acceptedOrders}
        />
        <Separator className="max-w-7xl mx-auto" />
        <EarningsSection acceptedOrders={acceptedOrders} />
        <Separator className="max-w-7xl mx-auto" />
        <PlatformsSection />
        <Separator className="max-w-7xl mx-auto" />
        <SettingsSection />
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
                NotiFetch
              </span>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              &copy; {new Date().getFullYear()} NotiFetch. One Feed. All
              Notifications. Zero Credentials.
            </p>
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-amber-500">
              Doing is Doing — DID
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-border/50 text-center">
            <p className="text-xs text-muted-foreground/70 max-w-3xl mx-auto">
              NotiFetch is an independent notification aggregation tool. NotiFetch is NOT affiliated with, endorsed by, sponsored by, or partnered with any delivery platform, restaurant, or brand. All trademarks, logos, and brand names are the property of their respective owners. NotiFetch uses generic platform names by default. Users may customize display names at their own discretion. NotiFetch only reads notification content that the user can already see on their device — it does not access credentials, OTPs, or payment information.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
