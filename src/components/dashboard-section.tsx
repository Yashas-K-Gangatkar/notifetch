"use client";

import { useSession } from "next-auth/react";
import { Bell, LogIn, Zap, ArrowRight, MapPin, Clock, IndianRupee, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

// ─── Sample Data for Demo ─────────────────────────────────────────────────────

const SAMPLE_NOTIFICATIONS = [
  {
    id: "demo-1",
    title: "New Order Available",
    body: "Pick up from Koramangala Hub — Deliver to HSR Layout Sector 2",
    source: "swiggy",
    sourceIcon: "🔥",
    orderValue: 45,
    isRead: false,
    createdAt: new Date().toISOString(),
    distance: "3.2 km",
    eta: "18 min",
  },
  {
    id: "demo-2",
    title: "Delivery Request",
    body: "Pick up from Indiranagar Kitchen — Drop at MG Road",
    source: "zomato",
    sourceIcon: "🍅",
    orderValue: 38,
    isRead: false,
    createdAt: new Date(Date.now() - 120000).toISOString(),
    distance: "4.1 km",
    eta: "22 min",
  },
  {
    id: "demo-3",
    title: "Quick Commerce Order",
    body: "Pick up from Whitefield Dark Store — Deliver to ITPL Road",
    source: "blinkit",
    sourceIcon: "⚡",
    orderValue: 25,
    isRead: true,
    createdAt: new Date(Date.now() - 300000).toISOString(),
    distance: "1.8 km",
    eta: "12 min",
  },
  {
    id: "demo-4",
    title: "Parcel Delivery",
    body: "Pick up from Electronic City Hub — Deliver to BTM Layout",
    source: "amazon-flex",
    sourceIcon: "📦",
    orderValue: 52,
    isRead: true,
    createdAt: new Date(Date.now() - 600000).toISOString(),
    distance: "6.5 km",
    eta: "35 min",
  },
];

const SOURCE_COLORS: Record<string, { color: string; bgColor: string; borderColor: string }> = {
  swiggy: { color: "text-amber-400", bgColor: "bg-amber-500/10", borderColor: "border-amber-500/30" },
  zomato: { color: "text-red-400", bgColor: "bg-red-500/10", borderColor: "border-red-500/30" },
  blinkit: { color: "text-yellow-400", bgColor: "bg-yellow-500/10", borderColor: "border-yellow-500/30" },
  "amazon-flex": { color: "text-teal-400", bgColor: "bg-teal-500/10", borderColor: "border-teal-500/30" },
};

function timeAgo(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
}

// ─── Demo Notification Card ──────────────────────────────────────────────────

function DemoNotificationCard({ notification }: { notification: typeof SAMPLE_NOTIFICATIONS[0] }) {
  const colors = SOURCE_COLORS[notification.source] || { color: "text-muted-foreground", bgColor: "bg-muted", borderColor: "border-border" };

  return (
    <Card className={`transition-all ${notification.isRead ? "opacity-60" : "border-amber-500/20 shadow-sm shadow-amber-500/5"}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Source icon */}
          <div className={`w-10 h-10 rounded-xl ${colors.bgColor} ${colors.borderColor} border flex items-center justify-center shrink-0`}>
            <span className="text-lg">{notification.sourceIcon}</span>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-1">
              <h4 className="font-semibold text-sm truncate">{notification.title}</h4>
              {!notification.isRead && (
                <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
              )}
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
              {notification.body}
            </p>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <Badge variant="secondary" className="text-xs capitalize">
                {notification.source.replace("-", " ")}
              </Badge>
              {notification.distance && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {notification.distance}
                </span>
              )}
              {notification.eta && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {notification.eta}
                </span>
              )}
              <span className="flex items-center gap-1 font-medium text-foreground">
                <IndianRupee className="w-3 h-3" />
                {notification.orderValue}
              </span>
            </div>
          </div>

          {/* Time */}
          <span className="text-xs text-muted-foreground shrink-0">
            {timeAgo(notification.createdAt)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Dashboard Section Component ─────────────────────────────────────────────

export function DashboardSection({
  onAccept,
  onDecline,
  acceptedOrders,
}: {
  onAccept: (order: any) => void;
  onDecline: (orderId: string) => void;
  acceptedOrders: any[];
}) {
  const { data: session } = useSession();

  // If user is logged in, show a prompt to go to the real dashboard
  if (session) {
    return (
      <section id="dashboard" className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Your Live Dashboard</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            View your real-time notifications, track earnings, and manage all your delivery platforms from one place.
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold px-8 h-12">
              Open Dashboard
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    );
  }

  // If not logged in, show demo data so visitors can see the product in action
  return (
    <section id="dashboard" className="py-20 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500/10 mb-6">
            <Bell className="w-8 h-8 text-amber-400" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Live Notification Feed</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            See how NotiFetch aggregates orders from all your delivery apps into one real-time feed.
            <span className="text-amber-500 font-medium"> This is a preview — sign in to see your actual orders.</span>
          </p>
        </div>

        {/* Demo notification cards */}
        <div className="space-y-3 mb-8">
          {SAMPLE_NOTIFICATIONS.map((notification) => (
            <DemoNotificationCard key={notification.id} notification={notification} />
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Want to see <strong>your</strong> real orders? Sign in to connect your platforms.
          </p>
          <Link href="/auth/signin">
            <Button size="lg" className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold px-8 h-12">
              <LogIn className="w-4 h-4 mr-2" />
              Sign In to Get Started
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
