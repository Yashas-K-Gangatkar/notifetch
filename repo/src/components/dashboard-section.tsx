"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Bell,
  Check,
  X,
  MapPin,
  Clock,
  TrendingUp,
  Package,
  Filter,
  Volume2,
  Globe,
  LayoutGrid,
} from "lucide-react";
import {
  PLATFORMS,
  DELIVERY_CATEGORIES,
  REGIONS,
  generateOrder,
  generateInitialOrders,
  getPlatformById,
  getCategoryById,
  formatCurrency,
  type DeliveryOrder,
} from "@/lib/data";

interface DashboardProps {
  onAccept: (order: DeliveryOrder) => void;
  onDecline: (orderId: string) => void;
  acceptedOrders: DeliveryOrder[];
}

export function DashboardSection({
  onAccept,
  onDecline,
  acceptedOrders,
}: DashboardProps) {
  const [orders, setOrders] = useState<DeliveryOrder[]>(() => generateInitialOrders());
  const [activeFilters, setActiveFilters] = useState<Set<string>>(
    new Set(PLATFORMS.map((p) => p.id))
  );
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<Set<string>>(
    new Set(DELIVERY_CATEGORIES.map((c) => c.id))
  );
  const [isPaused, setIsPaused] = useState(false);
  const [totalCount, setTotalCount] = useState(7);
  const [showAllCategoryFilters, setShowAllCategoryFilters] = useState(false);

  // Simulate incoming orders
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      const newOrder = generateOrder();
      setOrders((prev) => {
        const filtered = prev.filter(
          (o) => o.accepted === null && o.timeRemaining > 0
        );
        return [newOrder, ...filtered].slice(0, 30);
      });
      setTotalCount((prev) => prev + 1);
    }, 4000);
    return () => clearInterval(interval);
  }, [isPaused]);

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setOrders((prev) =>
        prev.map((o) =>
          o.accepted === null && o.timeRemaining > 0
            ? { ...o, timeRemaining: o.timeRemaining - 1 }
            : o
        )
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleFilter = useCallback((platformId: string) => {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      if (next.has(platformId)) next.delete(platformId);
      else next.add(platformId);
      return next;
    });
  }, []);

  const toggleCategoryFilter = useCallback((categoryId: string) => {
    setActiveCategoryFilter((prev) => {
      const next = new Set(prev);
      if (next.has(categoryId)) next.delete(categoryId);
      else next.add(categoryId);
      return next;
    });
  }, []);

  const handleAccept = useCallback(
    (order: DeliveryOrder) => {
      setOrders((prev) =>
        prev.map((o) => (o.id === order.id ? { ...o, accepted: true } : o))
      );
      onAccept(order);
    },
    [onAccept]
  );

  const handleDecline = useCallback(
    (orderId: string) => {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, accepted: false } : o))
      );
      onDecline(orderId);
    },
    [onDecline]
  );

  // Get connected platforms for filter display
  const connectedPlatforms = PLATFORMS.filter((p) => p.connected);
  const filteredOrders = orders.filter(
    (o) => activeFilters.has(o.platform) && activeCategoryFilter.has(o.category)
  );
  const pendingOrders = filteredOrders.filter((o) => o.accepted === null);
  const resolvedOrders = filteredOrders.filter((o) => o.accepted !== null);
  const totalEarnings = acceptedOrders.reduce((sum, o) => sum + o.value, 0);
  const bestPlatform = connectedPlatforms.length > 0
    ? connectedPlatforms.reduce((best, p) =>
        p.earningsToday > best.earningsToday ? p : best
      )
    : PLATFORMS[0];

  // Show limited category filters initially
  const visibleCategories = showAllCategoryFilters
    ? DELIVERY_CATEGORIES
    : DELIVERY_CATEGORIES.slice(0, 8);

  return (
    <section id="dashboard" className="py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">
            Live{" "}
            <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
              Dashboard
            </span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Real-time delivery notifications from all your platforms worldwide
          </p>
          <p className="text-xs text-muted-foreground/70 mt-3 max-w-2xl mx-auto">
            <span className="inline-block bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full font-semibold tracking-wide">DEMO</span>
            {" "}This is how it works — sample orders shown below illustrate what you&apos;ll see when your NotiFetch Android app captures real notifications.
            <a href="https://play.google.com/store/apps/details?id=com.notifetch.app" target="_blank" rel="noopener noreferrer" className="ml-1 text-amber-500 hover:text-amber-400 font-medium underline">Download the app →</a>
          </p>
        </div>

        {/* Summary bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <Card className="bg-card border-border">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <Package className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Orders Today</p>
                <p className="text-xl font-bold">{totalCount}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Earnings</p>
                <p className="text-xl font-bold">
                  ${totalEarnings.toFixed(2)}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                <Globe className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Best Platform</p>
                <p className="text-xl font-bold">{bestPlatform.name}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
                <LayoutGrid className="w-5 h-5 text-violet-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Categories</p>
                <p className="text-xl font-bold">{new Set(orders.map(o => o.category)).size} active</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Category Filters */}
        <div className="mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <LayoutGrid className="w-4 h-4 text-muted-foreground shrink-0" />
            {visibleCategories.map((c) => (
              <button
                key={c.id}
                onClick={() => toggleCategoryFilter(c.id)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all ${
                  activeCategoryFilter.has(c.id)
                    ? `${c.bgColor} ${c.color} ${c.borderColor}`
                    : "bg-muted text-muted-foreground border-transparent"
                }`}
              >
                {c.icon} {c.name}
              </button>
            ))}
            {DELIVERY_CATEGORIES.length > 8 && (
              <button
                onClick={() => setShowAllCategoryFilters(!showAllCategoryFilters)}
                className="px-2.5 py-1 rounded-full text-[11px] font-medium text-amber-500 hover:bg-amber-500/10"
              >
                {showAllCategoryFilters
                  ? "Show Less"
                  : `+${DELIVERY_CATEGORIES.length - 8} more`}
              </button>
            )}
          </div>
        </div>

        {/* Platform Filters & Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-muted-foreground" />
            {connectedPlatforms.map((p) => (
              <button
                key={p.id}
                onClick={() => toggleFilter(p.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  activeFilters.has(p.id)
                    ? `${p.bgColor} ${p.color} ${p.borderColor}`
                    : "bg-muted text-muted-foreground border-transparent"
                }`}
              >
                {p.icon} {p.name}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={isPaused ? "default" : "outline"}
              size="sm"
              onClick={() => setIsPaused(!isPaused)}
              className={isPaused ? "bg-amber-500 hover:bg-amber-600 text-white" : ""}
            >
              <Volume2 className="w-3.5 h-3.5 mr-1.5" />
              {isPaused ? "Resume Feed" : "Pause Feed"}
            </Button>
            <Badge variant="secondary" className="bg-amber-500/10 text-amber-500">
              <Bell className="w-3 h-3 mr-1" />
              {pendingOrders.length} pending
            </Badge>
          </div>
        </div>

        {/* Notification feed */}
        <ScrollArea className="h-[600px] rounded-xl border border-border bg-card">
          <div className="p-4 space-y-3">
            {pendingOrders.length === 0 && resolvedOrders.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>Waiting for orders...</p>
                <p className="text-sm">New notifications from around the world will appear here</p>
              </div>
            )}

            {pendingOrders.map((order, idx) => {
              const platform = getPlatformById(order.platform);
              const category = getCategoryById(order.category);
              if (!platform) return null;
              const isUrgent = order.timeRemaining <= 10;

              return (
                <div
                  key={order.id}
                  className="animate-float-up"
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  <Card
                    className={`border ${platform.borderColor} ${platform.bgColor} overflow-hidden transition-all hover:shadow-lg`}
                  >
                    <CardContent className="p-4">
                      {/* Header row */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-lg">{platform.icon}</span>
                          <Badge
                            variant="secondary"
                            className={`${platform.bgColor} ${platform.color} font-semibold`}
                          >
                            {platform.name}
                          </Badge>
                          <Badge className="bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30 text-[9px] font-bold tracking-wider">
                            DEMO
                          </Badge>
                          {category && (
                            <Badge
                              variant="outline"
                              className={`${category.bgColor} ${category.color} ${category.borderColor} text-[10px]`}
                            >
                              {category.icon} {category.name}
                            </Badge>
                          )}
                          {isUrgent && (
                            <Badge className="bg-red-500/20 text-red-400 border-red-500/30 animate-pulse">
                              URGENT
                            </Badge>
                          )}
                        </div>
                        <span className="text-2xl font-bold text-amber-500">
                          {formatCurrency(order.value, order.currency)}
                        </span>
                      </div>

                      {/* Details */}
                      <div className="space-y-2 mb-3">
                        <div className="flex items-start gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                          <span className="text-muted-foreground">
                            Pickup:{" "}
                            <span className="text-foreground">{order.pickup}</span>
                          </span>
                        </div>
                        <div className="flex items-start gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                          <span className="text-muted-foreground">
                            Drop-off:{" "}
                            <span className="text-foreground">
                              {order.dropoff}
                            </span>
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {order.distance} {order.distanceUnit}
                          </span>
                          <span className="flex items-center gap-1">
                            {formatCurrency(+(order.value / order.distance).toFixed(2), order.currency)}/{order.distanceUnit}
                          </span>
                        </div>
                      </div>

                      {/* Timer bar */}
                      <div className="mb-3">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-muted-foreground">
                            Time to accept
                          </span>
                          <span
                            className={`font-mono font-bold ${
                              isUrgent ? "text-red-400" : "text-amber-500"
                            }`}
                          >
                            {order.timeRemaining}s
                          </span>
                        </div>
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-1000 ${
                              isUrgent
                                ? "bg-red-500"
                                : "bg-amber-500"
                            }`}
                            style={{
                              width: `${Math.max(
                                0,
                                (order.timeRemaining / 45) * 100
                              )}%`,
                            }}
                          />
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleAccept(order)}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                        >
                          <Check className="w-4 h-4 mr-1.5" />
                          Accept
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleDecline(order.id)}
                          className="flex-1 border-border hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30"
                        >
                          <X className="w-4 h-4 mr-1.5" />
                          Decline
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })}

            {/* Resolved orders */}
            {resolvedOrders.length > 0 && (
              <>
                <Separator className="my-2" />
                <p className="text-xs text-muted-foreground text-center py-1">
                  Recent Activity
                </p>
                {resolvedOrders.slice(0, 5).map((order) => {
                  const platform = getPlatformById(order.platform);
                  if (!platform) return null;
                  return (
                    <div
                      key={order.id}
                      className="opacity-50 hover:opacity-75 transition-opacity"
                    >
                      <Card className="border-border/50">
                        <CardContent className="p-3 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span>{platform.icon}</span>
                            <span className="text-sm font-medium">
                              {platform.name}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              • {formatCurrency(order.value, order.currency)}
                            </span>
                          </div>
                          <Badge
                            variant={
                              order.accepted ? "default" : "secondary"
                            }
                            className={
                              order.accepted
                                ? "bg-emerald-500/20 text-emerald-400"
                                : "bg-muted text-muted-foreground"
                            }
                          >
                            {order.accepted ? "Accepted" : "Declined"}
                          </Badge>
                        </CardContent>
                      </Card>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </ScrollArea>
      </div>
    </section>
  );
}
