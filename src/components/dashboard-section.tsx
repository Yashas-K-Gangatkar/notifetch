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
  DollarSign,
  TrendingUp,
  Package,
  Filter,
  Volume2,
} from "lucide-react";
import {
  PLATFORMS,
  generateOrder,
  getPlatformById,
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
  const [orders, setOrders] = useState<DeliveryOrder[]>(() => {
    const initial: DeliveryOrder[] = [];
    for (let i = 0; i < 5; i++) {
      const order = generateOrder();
      order.timeRemaining = Math.floor(Math.random() * 20 + 10);
      initial.push(order);
    }
    return initial;
  });
  const [activeFilters, setActiveFilters] = useState<Set<string>>(
    new Set(PLATFORMS.map((p) => p.id))
  );
  const [isPaused, setIsPaused] = useState(false);
  const [totalCount, setTotalCount] = useState(5);

  // Simulate incoming orders
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      const newOrder = generateOrder();
      setOrders((prev) => {
        const filtered = prev.filter(
          (o) => o.accepted === null && o.timeRemaining > 0
        );
        return [newOrder, ...filtered].slice(0, 20);
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
      if (next.has(platformId)) {
        next.delete(platformId);
      } else {
        next.add(platformId);
      }
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

  const filteredOrders = orders.filter((o) => activeFilters.has(o.platform));
  const pendingOrders = filteredOrders.filter((o) => o.accepted === null);
  const resolvedOrders = filteredOrders.filter((o) => o.accepted !== null);
  const totalEarnings = acceptedOrders.reduce((sum, o) => sum + o.value, 0);
  const bestPlatform = PLATFORMS.reduce((best, p) =>
    p.earningsToday > best.earningsToday ? p : best
  );

  return (
    <section id="dashboard" className="py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">
            Live{" "}
            <span className="bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
              Dashboard
            </span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Real-time delivery notifications from all your platforms
          </p>
        </div>

        {/* Summary bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
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
                <DollarSign className="w-5 h-5 text-emerald-500" />
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
                <TrendingUp className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Best Platform Today
                </p>
                <p className="text-xl font-bold">{bestPlatform.name}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters & Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-muted-foreground" />
            {PLATFORMS.map((p) => (
              <button
                key={p.id}
                onClick={() => toggleFilter(p.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  activeFilters.has(p.id)
                    ? `${p.bgColor} ${p.color} ${p.borderColor}`
                    : "bg-muted text-muted-foreground border-transparent"
                }`}
              >
                {p.name}
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
                  <p className="text-sm">New notifications will appear here</p>
                </div>
              )}

              {pendingOrders.map((order, idx) => {
                const platform = getPlatformById(order.platform);
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
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{platform.icon}</span>
                            <Badge
                              variant="secondary"
                              className={`${platform.bgColor} ${platform.color} font-semibold`}
                            >
                              {platform.name}
                            </Badge>
                            {isUrgent && (
                              <Badge className="bg-red-500/20 text-red-400 border-red-500/30 animate-pulse">
                                URGENT
                              </Badge>
                            )}
                          </div>
                          <span className="text-2xl font-bold text-amber-500">
                            ${order.value.toFixed(2)}
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
                              {order.distance} mi
                            </span>
                            <span className="flex items-center gap-1">
                              <DollarSign className="w-3 h-3" />$
                              {(order.value / order.distance).toFixed(2)}/mi
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
                                • ${order.value.toFixed(2)}
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
