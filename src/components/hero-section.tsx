"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, ArrowRight, ChevronDown, Zap, TrendingUp, Globe, Mail, LayoutDashboard, Download, Play } from "lucide-react";
import { NFLogo } from "@/components/nf-logo";
import { PLATFORMS, DELIVERY_CATEGORIES, REGIONS } from "@/lib/data";

interface HeroProps {
  onNavigate: (sectionId: string) => void;
}

interface FloatingNotification {
  id: number;
  platform: string;
  value: string;
  x: number;
  y: number;
  delay: number;
  side: "left" | "right";
}

export function HeroSection({ onNavigate }: HeroProps) {
  const { data: session, status } = useSession();
  // v2.9.81 FIX: Only treat as logged-in when status is definitively "authenticated".
  // During "loading" state, show neither badge — prevents the flicker where logged-in
  // users briefly see "Login with Email" before NextAuth resolves the session.
  const isLoggedIn = status === "authenticated" && !!session?.user;
  const isLoading = status === "loading";

  const [notifications] = useState<FloatingNotification[]>(() => {
    const positions = [
      { x: 15, y: 20, v: 12.50 }, { x: 72, y: 35, v: 8.75 },
      { x: 25, y: 65, v: 22.30 }, { x: 80, y: 15, v: 15.00 },
      { x: 10, y: 45, v: 9.99 },  { x: 65, y: 70, v: 18.25 },
      { x: 35, y: 12, v: 11.40 }, { x: 88, y: 55, v: 7.50 },
      { x: 20, y: 80, v: 19.80 }, { x: 55, y: 25, v: 14.60 },
      { x: 45, y: 50, v: 6.30 },  { x: 78, y: 82, v: 16.90 },
    ];
    return positions.map((p, i) => ({
      id: i,
      platform: PLATFORMS[i % PLATFORMS.length].name,
      value: `$${p.v.toFixed(2)}`,
      x: p.x,
      y: p.y,
      delay: i * 0.8,
      side: i % 2 === 0 ? "left" as const : "right" as const,
    }));
  });

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 via-transparent to-transparent" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />

      {/* Floating notification icons */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`absolute animate-notification-pulse opacity-25`}
            style={{
              left: `${n.x}%`,
              top: `${n.y}%`,
              animationDelay: `${n.delay}s`,
              animationDuration: "3s",
            }}
          >
            <div
              className={`bg-muted/70 rounded-lg px-3 py-2 text-xs font-medium relative ${
                n.side === "left" ? "animate-slide-in-left" : "animate-slide-in-right"
              }`}
              style={{ animationDelay: `${n.delay}s` }}
            >
              <span className="flex items-center gap-1.5">
                <Bell className="w-3 h-3 text-amber-500" />
                {n.platform} • {n.value}
              </span>
              {/* DEMO sticker */}
              <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full shadow-md tracking-wide">
                DEMO
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Welcome / status badge — auth-aware */}
        <div className="animate-float-up" style={{ animationDelay: "0s" }}>
          {isLoading ? (
            // v2.9.81 FIX: During session loading, show a neutral badge instead of
            // the logged-out badge. Prevents the flicker from "Login" → "Welcome back".
            <Badge
              variant="secondary"
              className="mb-3 px-4 py-1.5 text-sm bg-muted/40 text-muted-foreground border-border"
            >
              <span className="inline-block w-3 h-3 rounded-full bg-muted-foreground/40 animate-pulse" />
              Loading…
            </Badge>
          ) : isLoggedIn ? (
            <Badge
              variant="secondary"
              className="mb-3 px-4 py-1.5 text-sm bg-green-500/10 text-green-500 border-green-500/20"
            >
              <LayoutDashboard className="w-3.5 h-3.5 mr-1.5" />
              Welcome back, {session.user.name || session.user.email?.split("@")[0]} — your dashboard is ready
            </Badge>
          ) : (
            <Badge
              variant="secondary"
              className="mb-3 px-4 py-1.5 text-sm bg-amber-500/10 text-amber-500 border-amber-500/20"
            >
              <Mail className="w-3.5 h-3.5 mr-1.5" />
              Login with Email · Free Forever · No Card Needed
            </Badge>
          )}
        </div>
        <div className="animate-float-up" style={{ animationDelay: "0.05s" }}>
          <Badge
            variant="secondary"
            className="mb-6 px-4 py-1.5 text-sm bg-muted/60 text-muted-foreground border-border"
          >
            <Globe className="w-3.5 h-3.5 mr-1.5" />
            {PLATFORMS.length}+ platforms · {DELIVERY_CATEGORIES.length} categories · {REGIONS.length} regions worldwide
          </Badge>
        </div>

        {/* Main heading */}
        <h1 className="animate-float-up text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-3" style={{ animationDelay: "0.1s" }}>
          <span className="block">One Feed.</span>
          <span className="block">All Platforms.</span>
          <span className="block bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
            Every Delivery. Worldwide.
          </span>
        </h1>

        {/* DID slogan */}
        <div className="animate-float-up mb-6" style={{ animationDelay: "0.15s" }}>
          <span className="inline-flex items-center gap-2 text-sm font-bold tracking-[0.2em] uppercase text-amber-500">
            <span className="h-px w-8 bg-amber-500/40" />
            Doing is Doing
            <span className="text-muted-foreground/60">— DID</span>
            <span className="h-px w-8 bg-amber-500/40" />
          </span>
        </div>

        {/* Subtitle */}
        <p className="animate-float-up text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed" style={{ animationDelay: "0.2s" }}>
          From food to freight, groceries to pharmacy, same-day to white-glove —
          NotiFetch reads your phone&apos;s existing delivery notifications and aggregates them
          into one real-time feed — no login credentials needed, no API access, zero risk.
        </p>

        {/* Problem icons */}
        <div className="animate-float-up flex items-center justify-center gap-2 sm:gap-3 md:gap-4 mb-10 flex-wrap" style={{ animationDelay: "0.3s" }}>
          {[
            { icon: "🍕", label: "Food" },
            { icon: "🛒", label: "Grocery" },
            { icon: "📦", label: "Package" },
            { icon: "💊", label: "Pharmacy" },
            { icon: "🚛", label: "Freight" },
            { icon: "🍔", label: "QSR" },
          ].map((item, i) => (
            <div
              key={i}
              className="w-12 h-16 sm:w-14 sm:h-20 md:w-16 md:h-24 rounded-xl bg-muted/60 border border-border flex flex-col items-center justify-center gap-1 shadow-lg"
            >
              <span className="text-xl sm:text-2xl">{item.icon}</span>
              <span className="text-[10px] text-muted-foreground">
                {item.label}
              </span>
            </div>
          ))}
          <ArrowRight className="w-6 h-6 text-amber-500 animate-pulse" />
          <div className="w-14 h-20 sm:w-16 sm:h-24 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex flex-col items-center justify-center gap-1 shadow-lg shadow-amber-500/10 p-1.5">
            <NFLogo className="w-10 h-5" />
            <span className="text-[10px] text-amber-500 font-bold">Fetch</span>
          </div>
        </div>

        {/* CTA Buttons — auth-aware */}
        <div className="animate-float-up flex flex-col sm:flex-row items-center justify-center gap-4 mb-8" style={{ animationDelay: "0.4s" }}>
          {isLoading ? (
            // v2.9.81 FIX: Show disabled button during loading to prevent flicker
            <Button
              size="lg"
              disabled
              className="bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold px-8 h-12 text-base shadow-xl shadow-amber-500/25 opacity-60"
            >
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
              Loading…
            </Button>
          ) : isLoggedIn ? (
            <Button
              size="lg"
              onClick={() => window.location.href = "/dashboard"}
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold px-8 h-12 text-base shadow-xl shadow-amber-500/25"
            >
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Open My Dashboard
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              size="lg"
              onClick={() => window.location.href = "/auth/signin"}
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold px-8 h-12 text-base shadow-xl shadow-amber-500/25"
            >
              <Mail className="w-4 h-4 mr-2" />
              Login with Email — It&apos;s Free
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>

        {/* Play Store download button */}
        <div className="animate-float-up flex flex-col sm:flex-row items-center justify-center gap-3 mb-8" style={{ animationDelay: "0.45s" }}>
          <a
            href="https://play.google.com/store/apps/details?id=com.notifetch.app"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-black text-white font-semibold px-6 h-11 rounded-xl hover:bg-black/90 transition-colors shadow-lg"
          >
            <Play className="w-4 h-4 fill-white" />
            Download on Play Store
            <Download className="w-3.5 h-3.5 ml-1" />
          </a>
        </div>

        {/* Stats bar — auth-aware (real data only when logged in) */}
        <div className="animate-float-up grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-10" style={{ animationDelay: "0.5s" }}>
          {[
            { value: `${PLATFORMS.length}`, label: "Real Platforms", icon: Globe },
            { value: DELIVERY_CATEGORIES.length.toString(), label: "Delivery Categories", icon: Zap },
            { value: REGIONS.length.toString(), label: "Global Regions", icon: Globe },
            { value: "190+", label: "Countries Supported", icon: Globe },
          ].map((stat) => (
            <div key={stat.label} className="flex items-center gap-2 text-center">
              <stat.icon className="w-4 h-4 text-amber-500 hidden sm:block" />
              <div>
                <div className="text-xl sm:text-2xl font-bold">{stat.value}</div>
                <div className="text-xs sm:text-sm text-muted-foreground">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6 text-muted-foreground" />
        </div>
      </div>
    </section>
  );
}
