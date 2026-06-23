"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Zap, Bell, Trash2, Check, CheckCheck,
  RefreshCw, Search, MapPin, IndianRupee,
  Clock, Package, Navigation, MoreHorizontal
} from "lucide-react";
import { BackButton } from "@/components/back-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NotificationItem {
  id: string;
  title: string;
  body: string;
  source: string;
  sourceIcon: string | null;
  platform?: string;
  packageName?: string;
  category?: string;
  orderValue?: number;
  pickupLocation?: string;
  dropoffLocation?: string;
  distance?: string;
  bigText?: string;
  isRead: boolean;
  createdAt: string;
  receivedAt?: string;
}

const PLATFORM_COLORS: Record<string, string> = {
  // Category-based colors (legal compliance — not brand colors)
  "Food & Ride Partner": "#E8751A", "Food Dasher": "#D94F4F",
  "Food Rider EU": "#4DB6AC", "Food Rider Asia": "#E91E8C",
  "Food Delivery IN": "#E8751A", "Food Delivery IN 2": "#D94F4F",
  "Food Courier BR": "#9C27B0", "Food Courier LATAM": "#E67E22",
  "Food Courier Nordics": "#42A5F5", "Food Courier JP": "#D94F4F",
  "Food Rider MENA": "#E67E22", "Food Courier AU": "#9C27B0",
  "Grocery Shopper": "#E67E22", "Grocery Quick IN": "#F1C40F",
  "Quick Grocery IN": "#8B5CF6", "Grocery Shopper US": "#66BB6A",
  "Package Flex": "#26A69A", "Package Courier US": "#7E57C2",
  "Package IN": "#00BCD4", "Package Courier Asia": "#E67E22",
  "Logistics Relay": "#26A69A", "Last Mile IN": "#42A5F5",
  "Last Mile MENA": "#42A5F5", "Last Mile SEA": "#E67E22",
  "Ride Partner US": "#E91E8C", "Ride Partner IN": "#F1C40F",
  "Ride Partner SEA": "#66BB6A", "Ride Partner EU": "#66BB6A",
  "Logistics IN": "#42A5F5", "Bike Taxi IN": "#F1C40F",
  "Super App ID": "#66BB6A", "Last Mile IN 3": "#E67E22",
  // Legacy backward compatibility
  "Swiggy Partner": "#E8751A", "Swiggy Delivery": "#E8751A",
  "Zomato Delivery": "#D94F4F", "Amazon Flex": "#26A69A",
  "Uber Driver": "#E8751A", "Ola Driver": "#F1C40F",
  "DoorDash Dasher": "#D94F4F", "Instacart Shopper": "#E67E22",
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

const SOURCE_CONFIG: Record<string, { color: string; bgColor: string; label: string }> = {
  swiggy: { color: "text-amber-500", bgColor: "bg-amber-500/10", label: "Swiggy" },
  swiggy_partner: { color: "text-amber-500", bgColor: "bg-amber-500/10", label: "Swiggy Partner" },
  zomato: { color: "text-red-500", bgColor: "bg-red-500/10", label: "Zomato" },
  zomato_delivery: { color: "text-red-500", bgColor: "bg-red-500/10", label: "Zomato Delivery" },
  amazon: { color: "text-teal-500", bgColor: "bg-teal-500/10", label: "Amazon" },
  amazon_flex: { color: "text-teal-500", bgColor: "bg-teal-500/10", label: "Amazon Flex" },
  zepto: { color: "text-violet-500", bgColor: "bg-violet-500/10", label: "Zepto" },
  blinkit: { color: "text-yellow-500", bgColor: "bg-yellow-500/10", label: "Blinkit" },
  bigbasket: { color: "text-green-500", bgColor: "bg-green-500/10", label: "BigBasket" },
  dunzo: { color: "text-emerald-500", bgColor: "bg-emerald-500/10", label: "Dunzo" },
  porter: { color: "text-blue-500", bgColor: "bg-blue-500/10", label: "Porter" },
  rapido: { color: "text-yellow-500", bgColor: "bg-yellow-500/10", label: "Rapido" },
  ola: { color: "text-teal-500", bgColor: "bg-teal-500/10", label: "Ola" },
  uber: { color: "text-gray-500", bgColor: "bg-gray-500/10", label: "Uber" },
  flipkart: { color: "text-blue-500", bgColor: "bg-blue-500/10", label: "Flipkart" },
  shadowfax: { color: "text-orange-500", bgColor: "bg-orange-500/10", label: "Shadowfax" },
  custom: { color: "text-gray-500", bgColor: "bg-gray-500/10", label: "Other" },
};

function getSourceConfig(source: string) {
  return SOURCE_CONFIG[source.toLowerCase()] || SOURCE_CONFIG.custom;
}

export default function NotificationsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const [todayCount, setTodayCount] = useState(0);
  const [todayEarnings, setTodayEarnings] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  const fetchNotifications = useCallback(async () => {
    try {
      const sourceFilter = filter !== "all" ? `&source=${filter}` : "";
      const res = await fetch(`/api/notifications?limit=100${sourceFilter}`);
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
        setTodayCount(data.todayCount || 0);
        setTodayEarnings(data.todayEarnings || 0);
      }
    } catch {
      // Silently handle
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [filter]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchNotifications();
    }
  }, [status, fetchNotifications]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchNotifications();
  };

  const handleMarkAsRead = async (id: string, isRead: boolean) => {
    try {
      const res = await fetch(`/api/notifications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead: !isRead }),
      });
      if (res.ok) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, isRead: !isRead } : n))
        );
        setUnreadCount((prev) => (isRead ? prev + 1 : prev - 1));
      }
    } catch {
      // Silently handle
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await Promise.all(
        notifications
          .filter((n) => !n.isRead)
          .map((n) =>
            fetch(`/api/notifications/${n.id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ isRead: true }),
            })
          )
      );
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch {
      // Silently handle
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/notifications/${id}`, { method: "DELETE" });
      if (res.ok) {
        const deleted = notifications.find((n) => n.id === id);
        setNotifications((prev) => prev.filter((n) => n.id !== id));
        if (deleted && !deleted.isRead) {
          setUnreadCount((prev) => prev - 1);
        }
      }
    } catch {
      // Silently handle
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      n.title.toLowerCase().includes(q) ||
      n.body.toLowerCase().includes(q) ||
      n.source.toLowerCase().includes(q) ||
      (n.platform && n.platform.toLowerCase().includes(q)) ||
      (n.pickupLocation && n.pickupLocation.toLowerCase().includes(q)) ||
      (n.dropoffLocation && n.dropoffLocation.toLowerCase().includes(q))
    );
  });

  const uniqueSources = [...new Set(notifications.map((n) => n.source))];

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center animate-glow-pulse">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <span className="text-sm text-muted-foreground">Loading notifications...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass bg-background/80 border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <BackButton fallback="/dashboard" />
            <h1 className="text-lg font-bold">Notifications</h1>
            {unreadCount > 0 && (
              <Badge className="bg-amber-500 text-white text-[10px] h-5 animate-pulse">
                {unreadCount} unread
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllRead}
              disabled={unreadCount === 0}
              className="text-muted-foreground"
            >
              <CheckCheck className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Mark all read</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRefresh}
              disabled={isRefreshing}
              aria-label="Refresh notifications"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Today's summary */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-amber-500/5 border border-amber-500/10 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-amber-500">{todayCount}</p>
            <p className="text-[10px] text-muted-foreground">Today</p>
          </div>
          <div className="bg-green-500/5 border border-green-500/10 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-green-500">₹{todayEarnings.toLocaleString("en-IN")}</p>
            <p className="text-[10px] text-muted-foreground">Earnings</p>
          </div>
          <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-blue-500">{unreadCount}</p>
            <p className="text-[10px] text-muted-foreground">Unread</p>
          </div>
        </div>

        {/* Search and filter */}
        <div className="space-y-3 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by title, platform, location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 rounded-xl"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("all")}
              className="shrink-0 rounded-lg"
            >
              All
            </Button>
            {uniqueSources.map((source) => {
              const config = getSourceConfig(source);
              return (
                <Button
                  key={source}
                  variant={filter === source ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter(source)}
                  className="shrink-0 rounded-lg"
                >
                  {config.label}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Notification list */}
        {filteredNotifications.length === 0 ? (
          <Card className="rounded-2xl">
            <CardContent className="py-16 text-center">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
                <Bell className="w-8 h-8 text-amber-500 opacity-50" />
              </div>
              <h3 className="font-semibold text-lg mb-2">No notifications yet</h3>
              <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                {searchQuery
                  ? "No notifications match your search. Try a different query."
                  : "Install the NotiFetch Android app and enable notification access to start capturing delivery partner notifications in real-time."}
              </p>
              {!searchQuery && (
                <Button
                  variant="outline"
                  className="mt-4 rounded-xl"
                  onClick={async () => {
                    const testNotifs = [
                      { title: "New Order Available!", body: "Pick up from Koramangala - ₹45 delivery fee, 3.2 km", source: "swiggy_partner", platform: "Swiggy Partner", category: "NEW_ORDER", orderValue: 45, pickupLocation: "Koramangala", dropoffLocation: "Indiranagar", distance: "3.2 km" },
                      { title: "Delivery Pickup Ready", body: "Package ready at HSR Layout hub - ₹60 payout", source: "zomato_delivery", platform: "Zomato Delivery", category: "ORDER_UPDATE", orderValue: 60, pickupLocation: "HSR Layout Hub" },
                      { title: "Order Assigned", body: "Amazon Flex delivery - 4 packages, ₹120 estimated", source: "amazon_flex", platform: "Amazon Flex", category: "NEW_ORDER", orderValue: 120, distance: "8.5 km" },
                      { title: "Earnings Update", body: "You earned ₹1,250 today across 14 deliveries", source: "swiggy_partner", platform: "Swiggy Partner", category: "EARNINGS", orderValue: 1250 },
                    ];
                    const i = Math.floor(Math.random() * testNotifs.length);
                    await fetch("/api/notifications", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(testNotifs[i]),
                    });
                    fetchNotifications();
                  }}
                >
                  Create Test Notification
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {filteredNotifications.map((notification) => {
              const config = getSourceConfig(notification.source);
              const platformColor = notification.platform ? PLATFORM_COLORS[notification.platform] : undefined;
              return (
                <Card
                  key={notification.id}
                  className={`rounded-xl transition-all hover:shadow-md hover:border-amber-500/20 cursor-pointer ${
                    !notification.isRead ? "border-amber-500/30 bg-amber-500/[0.02]" : ""
                  }`}
                  onClick={() => handleMarkAsRead(notification.id, notification.isRead)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      {/* Platform icon */}
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 text-lg"
                        style={{ backgroundColor: platformColor ? `${platformColor}15` : undefined }}
                      >
                        {notification.category ? CATEGORY_ICONS[notification.category] || "📋" : "📋"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className={`text-sm ${!notification.isRead ? "font-semibold" : "font-medium"}`}>
                              {notification.title}
                              {!notification.isRead && (
                                <span className="inline-block w-2 h-2 rounded-full bg-amber-500 ml-2 animate-pulse" />
                              )}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                              {notification.body}
                            </p>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 shrink-0"
                                onClick={(e) => e.stopPropagation()}
                                aria-label={`Actions for ${notification.title}`}
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleMarkAsRead(notification.id, notification.isRead); }}>
                                {notification.isRead ? (
                                  <><Check className="w-4 h-4 mr-2" />Mark as unread</>
                                ) : (
                                  <><CheckCheck className="w-4 h-4 mr-2" />Mark as read</>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) => { e.stopPropagation(); handleDelete(notification.id); }}
                                className="text-destructive"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        {/* Rich data badges */}
                        <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                          {notification.platform ? (
                            <Badge
                              variant="outline"
                              className="text-[10px] h-5 gap-1"
                              style={{
                                borderColor: platformColor ? `${platformColor}40` : undefined,
                                color: platformColor || undefined,
                                backgroundColor: platformColor ? `${platformColor}10` : undefined,
                              }}
                            >
                              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: platformColor }} />
                              {notification.platform}
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-[10px] h-4">{config.label}</Badge>
                          )}
                          {notification.category && (
                            <Badge variant="outline" className={`text-[10px] h-5 ${CATEGORY_COLORS[notification.category] || ""}`}>
                              {notification.category.replace(/_/g, " ")}
                            </Badge>
                          )}
                          {notification.orderValue != null && notification.orderValue > 0 && (
                            <Badge variant="outline" className="text-[10px] h-5 text-green-500 border-green-500/20 bg-green-500/5">
                              ₹{notification.orderValue.toLocaleString("en-IN")}
                            </Badge>
                          )}
                          {notification.distance && (
                            <Badge variant="outline" className="text-[10px] h-5 text-blue-500 border-blue-500/20 bg-blue-500/5">
                              <Navigation className="w-2.5 h-2.5 mr-0.5" />
                              {notification.distance}
                            </Badge>
                          )}
                          <span className="text-[10px] text-muted-foreground ml-auto">
                            <Clock className="w-2.5 h-2.5 inline mr-0.5" />
                            {new Date(notification.createdAt).toLocaleTimeString("en-IN", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>

                        {/* Pickup / Dropoff route */}
                        {(notification.pickupLocation || notification.dropoffLocation) && (
                          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-muted-foreground bg-muted/30 rounded-lg px-2 py-1.5">
                            {notification.pickupLocation && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-green-500" />
                                <span className="truncate max-w-[120px]">{notification.pickupLocation}</span>
                              </span>
                            )}
                            {notification.pickupLocation && notification.dropoffLocation && (
                              <span className="text-border">→</span>
                            )}
                            {notification.dropoffLocation && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-red-500" />
                                <span className="truncate max-w-[120px]">{notification.dropoffLocation}</span>
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
