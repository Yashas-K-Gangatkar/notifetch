"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Zap, LogOut, Bell, TrendingUp, Package, Smartphone,
  ArrowLeft, BellRing, BarChart3, Globe,
  User, Settings, ShieldCheck, Calendar, Activity,
  ExternalLink, CheckCircle2, MapPin, IndianRupee,
  Clock, Filter, RefreshCw, Wifi
} from "lucide-react";
import { signOut } from "next-auth/react";
import { PushPermission } from "@/components/push-permission";
import { BackButton } from "@/components/back-button";
import { track, identifyUser } from "@/lib/analytics";

interface UserData {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  plan: string;
  createdAt: string;
  darkMode: boolean;
  notificationsEnabled: boolean;
}

interface NotificationItem {
  id: string;
  title: string;
  body: string;
  source: string;
  platform?: string;
  packageName?: string;
  category?: string;
  orderValue?: number;
  pickupLocation?: string;
  dropoffLocation?: string;
  distance?: string;
  isRead: boolean;
  createdAt: string;
  receivedAt?: string;
}

// Category-based platform colors (NOT brand colors — legal compliance)
// Colors are assigned by delivery category, not by brand identity
const PLATFORM_COLORS: Record<string, string> = {
  // Food Delivery — warm oranges/reds
  "Food & Ride Partner": "#E8751A",
  "Food Dasher": "#D94F4F",
  "Food Courier US": "#D4A017",
  "Food Rider EU": "#4DB6AC",
  "Food Courier UK": "#E67E22",
  "Food Courier EU": "#E67E22",
  "Food Courier DE": "#E67E22",
  "Food Rider Asia": "#E91E8C",
  "Food Delivery IN": "#E8751A",
  "Food Delivery IN 2": "#D94F4F",
  "Food Courier BR": "#9C27B0",
  "Food Courier LATAM": "#E67E22",
  "Food Courier Nordics": "#42A5F5",
  "Food Courier EU 2": "#F1C40F",
  "Food Courier JP": "#D94F4F",
  "Food Rider MENA": "#E67E22",
  "Food Courier AU": "#9C27B0",
  "Food Rider HK": "#F1C40F",
  // Grocery — greens
  "Grocery Shopper": "#E67E22",
  "Grocery Courier": "#9C27B0",
  "Grocery Quick IN": "#F1C40F",
  "Grocery IN": "#D94F4F",
  "Grocery LATAM": "#F1C40F",
  "Grocery AU": "#66BB6A",
  "Quick Grocery IN": "#8B5CF6",
  "Grocery EU": "#66BB6A",
  "Grocery Shopper US": "#66BB6A",
  // Package — blues/teals
  "Package Flex": "#26A69A",
  "Package Courier US": "#7E57C2",
  "Package IN": "#00BCD4",
  "Package Courier Asia": "#E67E22",
  "Package Courier IN": "#66BB6A",
  // Courier — indigos
  "Courier US": "#F1C40F",
  "Courier US 2": "#42A5F5",
  "Courier EU": "#5C6BC0",
  "Courier PH": "#E67E22",
  // Last-Mile — teals
  "Logistics Relay": "#26A69A",
  "Last Mile IN": "#42A5F5",
  "Last Mile ID": "#E67E22",
  "Last Mile MENA": "#42A5F5",
  "Last Mile SEA": "#E67E22",
  "Last Mile IN 3": "#E67E22",
  // Ride — greens/violets
  "Ride Partner US": "#E91E8C",
  "Ride Partner IN": "#F1C40F",
  "Ride Partner SEA": "#66BB6A",
  "Ride Partner MENA": "#66BB6A",
  "Ride Partner LATAM": "#E67E22",
  "Ride Partner EU": "#66BB6A",
  // Other
  "Logistics IN": "#42A5F5",
  "Bike Taxi IN": "#F1C40F",
  "Driver Partner IN": "#E67E22",
  "Super App ID": "#66BB6A",
  // Legacy brand-name keys for backward compatibility
  "Swiggy Partner": "#E8751A",
  "Swiggy Delivery": "#E8751A",
  "Zomato Delivery": "#D94F4F",
  "Zomato Delivery Partner": "#D94F4F",
  "Amazon Flex": "#26A69A",
  "Uber Driver": "#E8751A",
  "Ola Driver": "#F1C40F",
  "DoorDash Dasher": "#D94F4F",
  "Instacart Shopper": "#E67E22",
  "Lyft Driver": "#E91E8C",
  "Grab Driver": "#66BB6A",
  "Bolt Driver": "#66BB6A",
  "Deliveroo Rider": "#4DB6AC",
  "Wolt Courier": "#42A5F5",
};

const CATEGORY_ICONS: Record<string, string> = {
  NEW_ORDER: "🔔",
  ORDER_UPDATE: "📦",
  COMPLETED: "✅",
  CANCELLED: "❌",
  EARNINGS: "💰",
  AVAILABILITY: "🟢",
  GENERAL: "📋",
};

const CATEGORY_COLORS: Record<string, string> = {
  NEW_ORDER: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  ORDER_UPDATE: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  COMPLETED: "bg-green-500/10 text-green-500 border-green-500/20",
  CANCELLED: "bg-red-500/10 text-red-500 border-red-500/20",
  EARNINGS: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  AVAILABILITY: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  GENERAL: "bg-gray-500/10 text-gray-500 border-gray-500/20",
};

// v2.9.81: Format a Date as "just now", "30s ago", "5m ago", etc.
function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 5) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return date.toLocaleString();
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [todayCount, setTodayCount] = useState(0);
  const [todayEarnings, setTodayEarnings] = useState(0);
  const [platformStats, setPlatformStats] = useState<{ platform: string; count: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  // v2.9.81: Track last sync time for "Last synced X ago" indicator
  const [lastSyncAt, setLastSyncAt] = useState<Date | null>(null);
  const [, forceRender] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  const fetchDashboardData = useCallback(async () => {
    if (status === "authenticated" && session?.user?.id) {
      try {
        const [userRes, notifRes] = await Promise.all([
          fetch("/api/user"),
          fetch("/api/notifications?limit=10"),
        ]);
        if (userRes.ok) {
          const data = await userRes.json();
          setUserData(data.user);
        }
        if (notifRes.ok) {
          const data = await notifRes.json();
          setNotifications(data.notifications || []);
          setUnreadCount(data.unreadCount || 0);
          setTodayCount(data.todayCount || 0);
          setTodayEarnings(data.todayEarnings || 0);
          setPlatformStats(data.platformStats || []);
          // v2.9.81: Record sync time for "Last synced" indicator
          setLastSyncAt(new Date());
        }
      } catch {
        // Silently handle errors
      } finally {
        setIsLoading(false);
      }
    }
  }, [status, session]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // v2.9.81: Track dashboard view + identify user for analytics
  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      identifyUser(session.user.id, {
        email: session.user.email || "",
        name: session.user.name || "",
      });
      track("dashboard_view", {
        notification_count: notifications.length,
        unread_count: unreadCount,
      });
    }
  }, [status, session, notifications.length, unreadCount]);

  // v2.9.81: Re-render every 15s so "Last synced Xs ago" stays fresh
  useEffect(() => {
    const tick = setInterval(() => forceRender((n) => n + 1), 15_000);
    return () => clearInterval(tick);
  }, []);

  // v2.9.35: Auto-poll for new notifications every 30s when the tab is visible.
  // Uses the Page Visibility API so we don't waste requests when the user
  // is on another tab. Also re-fetches immediately when the tab regains focus.
  // v2.9.81 FIX: Only poll when status === "authenticated". Previously, if the
  // session expired or user signed out, polling would continue firing 401s.
  useEffect(() => {
    // Don't start polling if not authenticated
    if (status !== "authenticated") return;

    let interval: ReturnType<typeof setInterval> | null = null;

    const startPolling = () => {
      if (interval) return; // already polling
      interval = setInterval(() => {
        fetchDashboardData();
      }, 30_000); // 30 seconds
    };

    const stopPolling = () => {
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopPolling();
      } else {
        // Tab regained focus — fetch immediately, then resume polling
        fetchDashboardData();
        startPolling();
      }
    };

    // Start polling if tab is initially visible
    if (!document.hidden) {
      startPolling();
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      stopPolling();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [fetchDashboardData, status]);

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center animate-glow-pulse">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: "0ms" }} />
            <div className="w-2 h-2 rounded-full bg-orange-500 animate-bounce" style={{ animationDelay: "150ms" }} />
            <div className="w-2 h-2 rounded-full bg-amber-600 animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
          <span className="text-sm text-muted-foreground">Loading NotiFetch...</span>
        </div>
      </div>
    );
  }

  if (!session) return null;

  const initials = ((session.user.name || session.user.email || "U")[0] || "U").toUpperCase();
  const memberSince = userData?.createdAt
    ? new Date(userData.createdAt).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Just now";

  const filteredNotifications = selectedPlatform
    ? notifications.filter((n) => n.platform === selectedPlatform)
    : notifications;

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <BackButton fallback="/" />
            <a href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text hidden sm:inline">
                NotiFetch
              </span>
            </a>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs px-2.5 py-1 rounded-full bg-green-500/10 text-green-500 font-semibold border border-green-500/20 inline-flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Active
            </span>
            <div className="flex items-center gap-2">
              {session.user.image ? (
                <img src={session.user.image} alt="" className="w-8 h-8 rounded-full ring-2 ring-amber-500/30" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center ring-2 ring-amber-500/30">
                  <span className="text-xs text-white font-bold">{initials}</span>
                </div>
              )}
              <span className="text-sm font-medium hidden sm:block">
                {session.user.name || session.user.email?.split("@")[0]}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-muted-foreground hover:text-foreground"
              aria-label="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Dashboard content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Welcome */}
        <div className="mb-8">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">
                Welcome back, {session.user.name || session.user.email?.split("@")[0]}! 👋
              </h1>
              <p className="text-muted-foreground mt-1">
                Your delivery notifications are being aggregated in real-time from all platforms.
              </p>
            </div>
            {/* v2.9.81: Last synced indicator */}
            {lastSyncAt && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                Last synced {formatTimeAgo(lastSyncAt)}
              </div>
            )}
          </div>
        </div>

        {/* Quick action cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { icon: Bell, label: "Notifications", href: "/dashboard/notifications", color: "text-amber-500", bg: "bg-amber-500/10", badge: unreadCount > 0 ? unreadCount : undefined },
            { icon: User, label: "Profile", href: "/dashboard/profile", color: "text-blue-500", bg: "bg-blue-500/10" },
            { icon: Settings, label: "Settings", href: "/dashboard/settings", color: "text-gray-500", bg: "bg-gray-500/10" },
            { icon: Globe, label: "Platforms", href: "/", color: "text-purple-500", bg: "bg-purple-500/10" },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => router.push(item.href)}
              className="bg-card border border-border rounded-xl p-4 flex items-center gap-3 hover:bg-muted/50 hover:border-amber-500/20 transition-all text-left relative group"
            >
              <div className={`w-10 h-10 rounded-lg ${item.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <item.icon className={`w-5 h-5 ${item.color} shrink-0`} />
              </div>
              <span className="text-sm font-medium">{item.label}</span>
              {item.badge && (
                <span className="absolute top-2 right-2 bg-amber-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                  {item.badge > 9 ? "9+" : item.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Bell, label: "Today's Notifications", value: todayCount.toString(), color: "text-amber-500", bg: "from-amber-500/5 to-orange-500/5", border: "border-amber-500/10" },
            { icon: IndianRupee, label: "Today's Earnings", value: `₹${todayEarnings.toLocaleString("en-IN")}`, color: "text-green-500", bg: "from-green-500/5 to-emerald-500/5", border: "border-green-500/10" },
            { icon: Package, label: "Unread", value: unreadCount.toString(), color: "text-blue-500", bg: "from-blue-500/5 to-indigo-500/5", border: "border-blue-500/10" },
            { icon: Globe, label: "Connected Platforms", value: platformStats.length.toString(), color: "text-purple-500", bg: "from-purple-500/5 to-violet-500/5", border: "border-purple-500/10" },
          ].map((stat) => (
            <div key={stat.label} className={`bg-gradient-to-br ${stat.bg} border ${stat.border} rounded-xl p-5`}>
              <stat.icon className={`w-5 h-5 ${stat.color} mb-3`} />
              <p className="text-2xl sm:text-3xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Platform Stats */}
        {platformStats.length > 0 && (
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Active Platforms</h3>
            <div className="flex flex-wrap gap-2">
              {platformStats.map((stat) => (
                <button
                  key={stat.platform}
                  onClick={() => setSelectedPlatform(selectedPlatform === stat.platform ? null : stat.platform)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm transition-all ${
                    selectedPlatform === stat.platform
                      ? "border-amber-500/40 bg-amber-500/10 text-amber-500"
                      : "border-border bg-card hover:bg-muted/50"
                  }`}
                >
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: PLATFORM_COLORS[stat.platform] || "#888" }}
                  />
                  <span>{stat.platform}</span>
                  <span className="text-muted-foreground">({stat.count})</span>
                </button>
              ))}
              {selectedPlatform && (
                <button
                  onClick={() => setSelectedPlatform(null)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border bg-card text-sm text-muted-foreground hover:bg-muted/50"
                >
                  <Filter className="w-3 h-3" />
                  Clear filter
                </button>
              )}
            </div>
          </div>
        )}

        {/* Two columns: Install App + Push Notifications */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Install Android App */}
          <div className="bg-gradient-to-br from-amber-500/5 to-orange-500/5 border border-amber-500/20 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                <Smartphone className="w-6 h-6 text-amber-500" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">Install the App</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Scan the QR code below on your phone and tap &quot;Add to Home Screen&quot; to install NotiFetch as an app with real notification capture.
                </p>
                <div className="flex justify-center my-4">
                  <div className="bg-white rounded-2xl p-3 inline-block shadow-lg shadow-black/5">
                    <img
                      src="/qr-code.png"
                      alt="QR code to install NotiFetch"
                      className="w-36 h-36 rounded-xl"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                      }}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Wifi className="w-3 h-3" />
                  <span>Requires Android 7.0+ with Notification Access permission</span>
                </div>
              </div>
            </div>
          </div>

          {/* Push Notifications */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0">
                <BellRing className="w-6 h-6 text-purple-500" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">Push Notifications</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Enable push notifications to get instant alerts for new delivery notifications from all your platforms.
                </p>
              </div>
            </div>
            <PushPermission />
          </div>
        </div>

        {/* Recent Activity */}
        <Card className="mb-8 border-border rounded-2xl overflow-hidden">
          <CardHeader className="pb-3 bg-muted/30">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Activity className="w-5 h-5 text-amber-500" />
                Recent Notifications
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => fetchDashboardData()}
                className="text-muted-foreground"
                aria-label="Refresh dashboard"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
                  <Bell className="w-8 h-8 text-amber-500 opacity-50" />
                </div>
                <p className="text-muted-foreground font-medium">
                  {selectedPlatform ? `No notifications from ${selectedPlatform}` : "No notifications yet"}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Install the NotiFetch Android app to start capturing delivery partner notifications in real-time.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredNotifications.map((notif, index) => {
                  const platformColor = notif.platform ? PLATFORM_COLORS[notif.platform] : undefined;
                  return (
                    <div
                      key={notif.id}
                      className={`flex items-start gap-3 p-4 rounded-xl border border-border/50 hover:border-amber-500/20 hover:bg-muted/30 transition-all cursor-pointer ${
                        notif.isRead ? "opacity-60" : ""
                      } ${!notif.isRead ? "bg-amber-500/[0.02]" : ""}`}
                      style={{ animationDelay: `${index * 50}ms` }}
                      onClick={() => router.push("/dashboard/notifications")}
                    >
                      {/* Platform indicator */}
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-lg"
                        style={{ backgroundColor: platformColor ? `${platformColor}15` : undefined }}
                      >
                        {notif.category ? CATEGORY_ICONS[notif.category] || "📋" : "📋"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-semibold truncate">{notif.title}</p>
                          {!notif.isRead && (
                            <div className="w-2 h-2 rounded-full bg-amber-500 shrink-0 animate-pulse" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">{notif.body}</p>
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          {notif.platform && (
                            <Badge
                              variant="outline"
                              className="text-[10px] h-5 gap-1"
                              style={{
                                borderColor: platformColor ? `${platformColor}40` : undefined,
                                color: platformColor,
                                backgroundColor: platformColor ? `${platformColor}10` : undefined,
                              }}
                            >
                              <div
                                className="w-1.5 h-1.5 rounded-full"
                                style={{ backgroundColor: platformColor }}
                              />
                              {notif.platform}
                            </Badge>
                          )}
                          {notif.category && (
                            <Badge variant="outline" className={`text-[10px] h-5 ${CATEGORY_COLORS[notif.category] || ""}`}>
                              {notif.category.replace(/_/g, " ")}
                            </Badge>
                          )}
                          {notif.orderValue != null && notif.orderValue > 0 && (
                            <Badge variant="outline" className="text-[10px] h-5 text-green-500 border-green-500/20 bg-green-500/5">
                              ₹{notif.orderValue.toLocaleString("en-IN")}
                            </Badge>
                          )}
                          {notif.distance && (
                            <Badge variant="outline" className="text-[10px] h-5 text-blue-500 border-blue-500/20 bg-blue-500/5">
                              {notif.distance}
                            </Badge>
                          )}
                          <span className="text-[10px] text-muted-foreground ml-auto">
                            {new Date(notif.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                        {/* Show pickup/dropoff if available — responsive truncation */}
                        {(notif.pickupLocation || notif.dropoffLocation) && (
                          <div className="flex items-center gap-1 mt-2 text-[10px] text-muted-foreground flex-wrap">
                            {notif.pickupLocation && (
                              <>
                                <MapPin className="w-3 h-3 text-green-500 shrink-0" />
                                <span className="truncate max-w-[80px] sm:max-w-[120px] md:max-w-[160px]">{notif.pickupLocation}</span>
                              </>
                            )}
                            {notif.pickupLocation && notif.dropoffLocation && (
                              <span className="text-border shrink-0">→</span>
                            )}
                            {notif.dropoffLocation && (
                              <>
                                <MapPin className="w-3 h-3 text-red-500 shrink-0" />
                                <span className="truncate max-w-[80px] sm:max-w-[120px] md:max-w-[160px]">{notif.dropoffLocation}</span>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full mt-3 text-amber-500 hover:text-amber-400 hover:bg-amber-500/5"
                  onClick={() => router.push("/dashboard/notifications")}
                >
                  View All Notifications
                  <ExternalLink className="w-3 h-3 ml-1" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Account info */}
        <Card className="border-border rounded-2xl overflow-hidden">
          <CardHeader className="pb-3 bg-muted/30">
            <CardTitle className="flex items-center gap-2 text-lg">
              <ShieldCheck className="w-5 h-5 text-amber-500" />
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <Avatar className="w-16 h-16 ring-2 ring-amber-500/20">
                {session.user.image ? (
                  <AvatarImage src={session.user.image} alt={session.user.name || "User"} />
                ) : null}
                <AvatarFallback className="bg-gradient-to-br from-orange-500 to-amber-500 text-white text-xl font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-lg">{session.user.name || "User"}</p>
                <p className="text-sm text-muted-foreground">{session.user.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div className="p-3 rounded-lg bg-muted/30">
                <span className="text-muted-foreground text-xs">Status</span>
                <p className="font-medium inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-green-500" />
                  Active
                </p>
              </div>
              <div className="p-3 rounded-lg bg-muted/30">
                <span className="text-muted-foreground text-xs">Member Since</span>
                <p className="font-medium">{memberSince}</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/30">
                <span className="text-muted-foreground text-xs">Notifications</span>
                <p className="font-medium">
                  {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
                  {unreadCount > 0 && <CheckCircle2 className="w-3 h-3 text-amber-500 ml-1 inline" />}
                </p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-border flex flex-wrap gap-3">
              <Button variant="outline" size="sm" onClick={() => router.push("/dashboard/profile")} className="hover:border-amber-500/30">
                <Settings className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
              <Button variant="ghost" size="sm" onClick={() => router.push("/")} className="text-muted-foreground">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
