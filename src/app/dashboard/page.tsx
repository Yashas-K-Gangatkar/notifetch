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
  ArrowLeft, CreditCard, BellRing, BarChart3, Globe,
  User, Settings, ShieldCheck, Calendar, Activity,
  ExternalLink, CheckCircle2
} from "lucide-react";
import { signOut } from "next-auth/react";
import { RazorpayCheckout } from "@/components/razorpay-checkout";
import { PushPermission } from "@/components/push-permission";
import { BackButton } from "@/components/back-button";

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
  isRead: boolean;
  createdAt: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
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
          fetch("/api/notifications?limit=5"),
        ]);
        if (userRes.ok) {
          const data = await userRes.json();
          setUserData(data.user);
        }
        if (notifRes.ok) {
          const data = await notifRes.json();
          setNotifications(data.notifications || []);
          setUnreadCount(data.unreadCount || 0);
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

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center animate-pulse">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-semibold">Loading NotiFetch...</span>
        </div>
      </div>
    );
  }

  if (!session) return null;

  const plan = userData?.plan || "free";
  const initials = ((session.user.name || session.user.email || "U")[0] || "U").toUpperCase();
  const memberSince = userData?.createdAt
    ? new Date(userData.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Just now";

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <BackButton fallback="/" />
            <a href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent hidden sm:inline">
                NotiFetch
              </span>
            </a>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs px-2 py-1 rounded-full bg-amber-500/10 text-amber-500 font-medium capitalize">
              {plan}
            </span>
            <div className="flex items-center gap-2">
              {session.user.image ? (
                <img src={session.user.image} alt="" className="w-8 h-8 rounded-full" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
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
          <h1 className="text-2xl sm:text-3xl font-bold">
            Welcome back, {session.user.name || session.user.email?.split("@")[0]}!
          </h1>
          <p className="text-muted-foreground mt-1">
            Your delivery notifications are being aggregated in real-time.
          </p>
        </div>

        {/* Quick action cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { icon: Bell, label: "Notifications", href: "/dashboard/notifications", color: "text-amber-500", badge: unreadCount > 0 ? unreadCount : undefined },
            { icon: User, label: "Profile", href: "/dashboard/profile", color: "text-blue-500" },
            { icon: Settings, label: "Settings", href: "/dashboard/settings", color: "text-gray-500" },
            { icon: CreditCard, label: "Subscribe", href: "/dashboard/subscribe", color: "text-purple-500" },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => router.push(item.href)}
              className="bg-card border border-border rounded-xl p-4 flex items-center gap-3 hover:bg-muted/50 transition-colors text-left relative"
            >
              <item.icon className={`w-5 h-5 ${item.color} shrink-0`} />
              <span className="text-sm font-medium">{item.label}</span>
              {item.badge && (
                <span className="absolute top-2 right-2 bg-amber-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {item.badge > 9 ? "9+" : item.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Bell, label: "Unread Notifications", value: unreadCount.toString(), color: "text-amber-500" },
            { icon: Package, label: "Total Notifications", value: notifications.length.toString(), color: "text-blue-500" },
            { icon: Smartphone, label: "Plan", value: plan.charAt(0).toUpperCase() + plan.slice(1), color: "text-purple-500" },
            { icon: Calendar, label: "Member Since", value: userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "Now", color: "text-green-500" },
          ].map((stat) => (
            <div key={stat.label} className="bg-card border border-border rounded-xl p-4">
              <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Two columns: Install App + Push Notifications */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Install Android App */}
          <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <Smartphone className="w-6 h-6 text-amber-500 mt-0.5 shrink-0" />
              <div className="flex-1">
                <h3 className="font-semibold text-amber-500">Install the App</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Scan the QR code below on your phone and tap &quot;Add to Home Screen&quot; to install NotiFetch as an app.
                </p>
                <div className="flex justify-center my-4">
                  <div className="bg-white rounded-xl p-2 inline-block">
                    <img
                      src="/qr-code.png"
                      alt="QR code to install NotiFetch"
                      className="w-32 h-32 rounded-lg"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Push Notifications */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-start gap-3 mb-4">
              <BellRing className="w-6 h-6 text-purple-500 mt-0.5 shrink-0" />
              <div className="flex-1">
                <h3 className="font-semibold">Push Notifications</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Enable push notifications to get instant alerts for new delivery notifications.
                </p>
              </div>
            </div>
            <PushPermission />
          </div>
        </div>

        {/* Upgrade Plan */}
        {plan === "free" && (
          <div className="bg-card border border-border rounded-xl p-6 mb-8">
            <div className="flex items-start gap-3">
              <CreditCard className="w-6 h-6 text-purple-500 mt-0.5 shrink-0" />
              <div className="flex-1">
                <h3 className="font-semibold">Upgrade Your Plan</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  You&apos;re on the <span className="text-amber-500 font-semibold">Free</span> plan.
                  Upgrade to Pro for unlimited notifications, all platforms, and priority support.
                </p>
                <div className="mt-4">
                  <RazorpayCheckout
                    plan="pro"
                    period="monthly"
                    currentPlan="free"
                    onSuccess={() => fetchDashboardData()}
                    label="Upgrade to Pro — ₹49/mo"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recent Activity */}
        <Card className="mb-8">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Activity className="w-5 h-5 text-amber-500" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            {notifications.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-muted-foreground font-medium">No notifications yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Once you start receiving delivery notifications, they&apos;ll appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`flex items-start gap-3 p-3 rounded-lg border border-border/50 ${
                      notif.isRead ? "opacity-60" : ""
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Bell className="w-4 h-4 text-amber-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{notif.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{notif.body}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-[10px] h-4">
                          {notif.source}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(notif.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    {!notif.isRead && (
                      <div className="w-2 h-2 rounded-full bg-amber-500 mt-2 shrink-0" />
                    )}
                  </div>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full mt-2 text-amber-500 hover:text-amber-400"
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
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <ShieldCheck className="w-5 h-5 text-amber-500" />
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <Avatar className="w-14 h-14">
                {session.user.image ? (
                  <AvatarImage src={session.user.image} alt={session.user.name || "User"} />
                ) : null}
                <AvatarFallback className="bg-gradient-to-br from-amber-500 to-orange-600 text-white text-lg font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-lg">{session.user.name || "User"}</p>
                <p className="text-sm text-muted-foreground">{session.user.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Plan</span>
                <p className="font-medium capitalize">{plan}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Member Since</span>
                <p className="font-medium">{memberSince}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Notifications</span>
                <p className="font-medium">
                  {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
                  {unreadCount > 0 && <CheckCircle2 className="w-3 h-3 text-amber-500 ml-1 inline" />}
                </p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-border flex flex-wrap gap-3">
              <Button variant="outline" size="sm" onClick={() => router.push("/dashboard/profile")}>
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
