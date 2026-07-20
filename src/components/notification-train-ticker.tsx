"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { Bell, TrendingUp, MapPin, Clock } from "lucide-react";
import { PLATFORMS } from "@/lib/data";

/**
 * v2.9.13: Notification Train Ticker
 *
 * Two rows of "train cars" (notification cards) scrolling in opposite
 * directions, evoking a railway train passing by:
 *
 *   Top row:    →  →  →  →  →  →  (scrolls right →)
 *   Bottom row: ←  ←  ←  ←  ←  ←  (scrolls left ←)
 *
 * Each "car" is a delivery notification card showing:
 *   - Platform icon + name
 *   - Order value
 *   - Pickup → Dropoff
 *   - Time ago
 *
 * Animations are pure CSS (no JS) so they don't jank the page.
 * Pause on hover (desktop only — mobile users scroll past quickly).
 */
interface TickerNotification {
  platform: string;
  icon: string;
  value: string;
  pickup: string;
  dropoff: string;
  timeAgo: string;
  color: string;
  bgColor: string;
}

// Trademark-safe generic names — no real brand names (matches de-branded data.ts)
const SAMPLE_NOTIFICATIONS: TickerNotification[] = [
  { platform: "Food Delivery IN", icon: "🍽️", value: "₹247", pickup: "Indiranagar", dropoff: "Koramangala", timeAgo: "2m ago", color: "text-amber-600", bgColor: "bg-amber-500/10" },
  { platform: "Food Delivery IN 2", icon: "🍕", value: "₹312", pickup: "HSR Layout", dropoff: "Bellandur", timeAgo: "5m ago", color: "text-orange-600", bgColor: "bg-orange-500/10" },
  { platform: "Grocery Quick IN", icon: "🛒", value: "₹189", pickup: "Dark Store", dropoff: "Sector 56", timeAgo: "Just now", color: "text-yellow-600", bgColor: "bg-yellow-500/10" },
  { platform: "Quick Grocery IN", icon: "⚡", value: "₹156", pickup: "Cloud Store", dropoff: "Powai", timeAgo: "1m ago", color: "text-purple-600", bgColor: "bg-purple-500/10" },
  { platform: "Food Courier US", icon: "🚗", value: "$12.50", pickup: "Downtown", dropoff: "Midtown", timeAgo: "3m ago", color: "text-emerald-600", bgColor: "bg-emerald-500/10" },
  { platform: "Food Courier IN", icon: "🍕", value: "₹449", pickup: "Pizza Hub", dropoff: "JP Nagar", timeAgo: "8m ago", color: "text-blue-600", bgColor: "bg-blue-500/10" },
  { platform: "Courier US", icon: "🚪", value: "$18.75", pickup: "Restaurant", dropoff: "Brooklyn", timeAgo: "4m ago", color: "text-rose-700", bgColor: "bg-rose-700/10" },
  { platform: "Grocery IN", icon: "🛍️", value: "₹234", pickup: "Hub", dropoff: "Whitefield", timeAgo: "6m ago", color: "text-orange-600", bgColor: "bg-orange-500/10" },
  { platform: "Grocery EU", icon: "🥬", value: "₹567", pickup: "Warehouse", dropoff: "Indiranagar", timeAgo: "12m ago", color: "text-emerald-700", bgColor: "bg-emerald-700/10" },
  { platform: "Package Flex", icon: "📦", value: "₹85", pickup: "Sort Center", dropoff: "HSR Layout", timeAgo: "9m ago", color: "text-amber-700", bgColor: "bg-amber-700/10" },
  { platform: "Food Courier EU", icon: "🍔", value: "₹299", pickup: "Restaurant", dropoff: "Andheri East", timeAgo: "7m ago", color: "text-yellow-700", bgColor: "bg-yellow-700/10" },
  { platform: "Food Rider MENA", icon: "☕", value: "₹450", pickup: "Cafe", dropoff: "BKC", timeAgo: "10m ago", color: "text-emerald-800", bgColor: "bg-emerald-800/10" },
  { platform: "Package IN", icon: "📦", value: "₹1249", pickup: "Hub", dropoff: "Koramangala", timeAgo: "15m ago", color: "text-blue-700", bgColor: "bg-blue-700/10" },
  { platform: "Food Rider EU", icon: "🍕", value: "₹399", pickup: "Restaurant", dropoff: "Sector 18", timeAgo: "11m ago", color: "text-rose-700", bgColor: "bg-rose-700/10" },
  { platform: "Food Rider Asia", icon: "🍗", value: "₹349", pickup: "Restaurant", dropoff: "CP", timeAgo: "13m ago", color: "text-rose-600", bgColor: "bg-rose-500/10" },
  { platform: "Logistics Relay", icon: "🚚", value: "₹120", pickup: "Customer", dropoff: "3km away", timeAgo: "Just now", color: "text-amber-600", bgColor: "bg-amber-500/10" },
];

/**
 * Single notification "train car" card.
 */
function TrainCar({ n }: { n: TickerNotification }) {
  return (
    <div
      className={`flex-shrink-0 mx-2 px-4 py-3 rounded-xl border border-border/60 bg-card/95 backdrop-blur-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all min-w-[280px] max-w-[280px]`}
    >
      {/* Header: platform + value */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <span className="text-base">{n.icon}</span>
          <span className={`text-sm font-bold ${n.color}`}>{n.platform}</span>
        </div>
        <span className="text-sm font-extrabold text-foreground">{n.value}</span>
      </div>

      {/* Route: pickup → dropoff */}
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <MapPin className="w-3 h-3 text-emerald-500 shrink-0" />
        <span className="truncate">{n.pickup}</span>
        <span className="text-amber-500 font-bold">→</span>
        <MapPin className="w-3 h-3 text-red-500 shrink-0" />
        <span className="truncate">{n.dropoff}</span>
      </div>

      {/* Footer: time + bell */}
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50">
        <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
          <Clock className="w-2.5 h-2.5" />
          {n.timeAgo}
        </span>
        <span className="flex items-center gap-1 text-[10px] text-amber-500">
          <Bell className="w-2.5 h-2.5" />
          <TrendingUp className="w-2.5 h-2.5" />
        </span>
      </div>
    </div>
  );
}

/**
 * The full "railway train" ticker — 2 rows scrolling opposite directions.
 * v2.9.81 FIX: Pauses CSS animation when section is offscreen (IntersectionObserver).
 * Previously ran continuously, consuming CPU/GPU even when scrolled out of view.
 */
export function NotificationTrainTicker() {
  // Triple the data so the loop is seamless (CSS animation repeats)
  const topRow = useMemo(() => [...SAMPLE_NOTIFICATIONS, ...SAMPLE_NOTIFICATIONS, ...SAMPLE_NOTIFICATIONS], []);
  const bottomRow = useMemo(() => [...SAMPLE_NOTIFICATIONS.slice().reverse(), ...SAMPLE_NOTIFICATIONS.slice().reverse(), ...SAMPLE_NOTIFICATIONS.slice().reverse()], []);

  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0 } // trigger as soon as any part is visible
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  // v2.9.81: Use animation-play-state to pause when offscreen.
  // This saves CPU/GPU cycles on mobile devices when the ticker is scrolled away.
  const animationPlayState = isVisible ? "running" : "paused";

  return (
    <section ref={sectionRef} className="relative py-10 bg-gradient-to-b from-background via-amber-500/5 to-background overflow-hidden">
      {/* Section label */}
      <div className="max-w-7xl mx-auto px-4 mb-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
          <span className="text-xs font-bold tracking-wide uppercase text-amber-600 dark:text-amber-400">
            Live notifications from across the world
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Every notification here is being captured right now — from real users, on real apps, across 8 regions.
        </p>
      </div>

      {/* Top row — scrolls RIGHT → */}
      <div
        className="flex gap-0 hover:[animation-play-state:paused] mb-3"
        style={{
          animation: "trainRight 60s linear infinite",
          animationPlayState,
          width: "max-content",
        }}
      >
        {topRow.map((n, i) => (
          <TrainCar key={`top-${i}`} n={n} />
        ))}
      </div>

      {/* Bottom row — scrolls LEFT ← */}
      <div
        className="flex gap-0 hover:[animation-play-state:paused]"
        style={{
          animation: "trainLeft 70s linear infinite",
          animationPlayState,
          width: "max-content",
        }}
      >
        {bottomRow.map((n, i) => (
          <TrainCar key={`bot-${i}`} n={n} />
        ))}
      </div>

      {/* Edge fade gradients */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent pointer-events-none z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent pointer-events-none z-10" />

      {/* Inline keyframes (scoped to this component via unique names) */}
      <style jsx>{`
        @keyframes trainRight {
          0% { transform: translateX(0); }
          100% { transform: translateX(33.333%); }
        }
        @keyframes trainLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
      `}</style>
    </section>
  );
}
