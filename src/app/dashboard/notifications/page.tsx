"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Zap, Bell, ArrowLeft, Trash2, Check, CheckCheck,
  Filter, RefreshCw, Search, Package, ShoppingCart,
  Truck, Pill, Bike, MoreHorizontal
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
  isRead: boolean;
  createdAt: string;
}

const SOURCE_CONFIG: Record<string, { icon: React.ElementType; color: string; bgColor: string; label: string }> = {
  swiggy: { icon: Zap, color: "text-amber-500", bgColor: "bg-amber-500/10", label: "Swiggy" },
  zomato: { icon: Package, color: "text-red-500", bgColor: "bg-red-500/10", label: "Zomato" },
  amazon: { icon: ShoppingCart, color: "text-teal-500", bgColor: "bg-teal-500/10", label: "Amazon" },
  uber: { icon: Bike, color: "text-emerald-500", bgColor: "bg-emerald-500/10", label: "Uber Eats" },
  doordash: { icon: Truck, color: "text-red-400", bgColor: "bg-red-500/10", label: "DoorDash" },
  instacart: { icon: ShoppingCart, color: "text-orange-500", bgColor: "bg-orange-500/10", label: "Instacart" },
  pharmacy: { icon: Pill, color: "text-blue-500", bgColor: "bg-blue-500/10", label: "Pharmacy" },
  custom: { icon: Bell, color: "text-gray-500", bgColor: "bg-gray-500/10", label: "Other" },
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
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch(`/api/notifications?source=${filter}&limit=100`);
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
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
      n.source.toLowerCase().includes(q)
    );
  });

  const uniqueSources = [...new Set(notifications.map((n) => n.source))];

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center animate-pulse">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-semibold">Loading notifications...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <BackButton fallback="/dashboard" />
            <h1 className="text-lg font-bold">Notifications</h1>
            {unreadCount > 0 && (
              <Badge className="bg-amber-500 text-white text-[10px] h-5">
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
            >
              <CheckCheck className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Mark all read</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Search and filter */}
        <div className="space-y-3 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("all")}
              className="shrink-0"
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
                  className="shrink-0"
                >
                  {config.label}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Notification list */}
        {filteredNotifications.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-30" />
              <h3 className="font-semibold text-lg mb-2">No notifications yet</h3>
              <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                {searchQuery
                  ? "No notifications match your search. Try a different query."
                  : "Once you start receiving delivery notifications from platforms like Swiggy, Zomato, or Amazon, they&apos;ll appear here."}
              </p>
              {!searchQuery && (
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={async () => {
                    // Create a test notification
                    const sources = ["swiggy", "zomato", "amazon", "uber"];
                    const titles = [
                      "New order available!",
                      "Delivery pickup ready",
                      "Order assigned to you",
                      "Earnings update",
                    ];
                    const bodies = [
                      "Pick up from Koramangala - ₹45 delivery fee",
                      "Package ready at HSR Layout hub",
                      "Amazon Flex delivery - 4 packages",
                      "You earned ₹1,250 today",
                    ];
                    const i = Math.floor(Math.random() * sources.length);
                    await fetch("/api/notifications", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        title: titles[i],
                        body: bodies[i],
                        source: sources[i],
                      }),
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
              const Icon = config.icon;
              return (
                <Card
                  key={notification.id}
                  className={`transition-all hover:shadow-md ${
                    !notification.isRead ? "border-amber-500/30 bg-amber-500/5" : ""
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-10 h-10 rounded-full ${config.bgColor} flex items-center justify-center shrink-0`}
                      >
                        <Icon className={`w-5 h-5 ${config.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className={`text-sm ${!notification.isRead ? "font-semibold" : "font-medium"}`}>
                              {notification.title}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                              {notification.body}
                            </p>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleMarkAsRead(notification.id, notification.isRead)}>
                                {notification.isRead ? (
                                  <>
                                    <Check className="w-4 h-4 mr-2" />
                                    Mark as unread
                                  </>
                                ) : (
                                  <>
                                    <CheckCheck className="w-4 h-4 mr-2" />
                                    Mark as read
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDelete(notification.id)}
                                className="text-destructive"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-[10px] h-4">
                            {config.label}
                          </Badge>
                          <span className="text-[10px] text-muted-foreground">
                            {new Date(notification.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>
                      {!notification.isRead && (
                        <div className="w-2 h-2 rounded-full bg-amber-500 mt-2 shrink-0" />
                      )}
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
