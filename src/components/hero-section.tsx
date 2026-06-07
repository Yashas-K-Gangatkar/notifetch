"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, ArrowRight, ChevronDown, Smartphone, Zap, TrendingUp, Globe } from "lucide-react";
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
            className={`absolute animate-notification-pulse opacity-20`}
            style={{
              left: `${n.x}%`,
              top: `${n.y}%`,
              animationDelay: `${n.delay}s`,
              animationDuration: "3s",
            }}
          >
            <div
              className={`bg-muted/50 backdrop-blur-sm rounded-lg px-3 py-2 text-xs font-medium ${
                n.side === "left" ? "animate-slide-in-left" : "animate-slide-in-right"
              }`}
              style={{ animationDelay: `${n.delay}s` }}
            >
              <span className="flex items-center gap-1.5">
                <Bell className="w-3 h-3 text-amber-500" />
                {n.platform} • {n.value}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="animate-float-up" style={{ animationDelay: "0s" }}>
          <Badge
            variant="secondary"
            className="mb-6 px-4 py-1.5 text-sm bg-amber-500/10 text-amber-500 border-amber-500/20"
          >
            <Globe className="w-3.5 h-3.5 mr-1.5" />
            {PLATFORMS.length}+ platforms · {DELIVERY_CATEGORIES.length} categories · {REGIONS.length} regions worldwide
          </Badge>
        </div>

        {/* Main heading */}
        <h1 className="animate-float-up text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6" style={{ animationDelay: "0.1s" }}>
          <span className="block">One Feed.</span>
          <span className="block">All Platforms.</span>
          <span className="block bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
            Every Delivery. Worldwide.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="animate-float-up text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed" style={{ animationDelay: "0.2s" }}>
          From food to freight, groceries to pharmacy, same-day to white-glove —
          NotiFetch reads your phone's existing delivery notifications and aggregates them
          into one real-time feed — no login credentials needed, no API access, zero risk.
        </p>

        {/* Problem icons */}
        <div className="animate-float-up flex items-center justify-center gap-3 sm:gap-4 mb-10 flex-wrap" style={{ animationDelay: "0.3s" }}>
          {[
            { icon: "🍕", label: "Food" },
            { icon: "🛒", label: "Grocery" },
            { icon: "📦", label: "Package" },
            { icon: "💊", label: "Pharmacy" },
            { icon: "🚛", label: "Freight" },
          ].map((item, i) => (
            <div
              key={i}
              className="w-14 h-20 sm:w-16 sm:h-24 rounded-xl bg-muted/60 border border-border flex flex-col items-center justify-center gap-1 shadow-lg"
            >
              <span className="text-xl sm:text-2xl">{item.icon}</span>
              <span className="text-[10px] text-muted-foreground">
                {item.label}
              </span>
            </div>
          ))}
          <ArrowRight className="w-6 h-6 text-amber-500 animate-pulse" />
          <div className="w-14 h-20 sm:w-16 sm:h-24 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex flex-col items-center justify-center gap-1 shadow-lg shadow-amber-500/10">
            <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500" />
            <span className="text-[10px] text-amber-500 font-bold">Fetch</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="animate-float-up flex flex-col sm:flex-row items-center justify-center gap-4 mb-12" style={{ animationDelay: "0.4s" }}>
          <Button
            size="lg"
            onClick={() => onNavigate("pricing")}
            className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold px-8 h-12 text-base shadow-xl shadow-amber-500/25"
          >
            Start Free Trial
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => onNavigate("dashboard")}
            className="h-12 px-8 text-base border-border hover:bg-muted"
          >
            See How It Works
          </Button>
        </div>

        {/* Stats bar */}
        <div className="animate-float-up flex flex-wrap items-center justify-center gap-6 sm:gap-10" style={{ animationDelay: "0.5s" }}>
          {[
            { value: `${PLATFORMS.length}+`, label: "Global Platforms", icon: Globe },
            { value: DELIVERY_CATEGORIES.length.toString(), label: "Delivery Categories", icon: Zap },
            { value: "190+", label: "Countries", icon: Globe },
            { value: "$4.8M", label: "Earned This Month", icon: TrendingUp },
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
