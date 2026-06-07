"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Zap, LogOut, Bell, TrendingUp, Package, Settings, Smartphone } from "lucide-react";
import { signOut } from "next-auth/react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/auth/signin");
    }
  }, [status]);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      fetch("/api/user")
        .then((res) => res.json())
        .then((data) => setUserData(data.user))
        .catch(() => {});
    }
  }, [status, session]);

  if (status === "loading") {
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

  const plan = (userData?.plan as string) || "free";
  const initials = ((session.user.name || session.user.email || "U")[0] || "U").toUpperCase();

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <a href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
              NotiFetch
            </span>
          </a>
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

        {/* Quick stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Bell, label: "Notifications Today", value: "0", color: "text-amber-500" },
            { icon: Package, label: "Orders Today", value: "0", color: "text-blue-500" },
            { icon: TrendingUp, label: "Earnings Today", value: "$0.00", color: "text-green-500" },
            { icon: Smartphone, label: "Active Platforms", value: "0", color: "text-purple-500" },
          ].map((stat) => (
            <div key={stat.label} className="bg-card border border-border rounded-xl p-4">
              <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Setup notice */}
        <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-3">
            <Smartphone className="w-6 h-6 text-amber-500 mt-0.5" />
            <div>
              <h3 className="font-semibold text-amber-500">Get the Android App</h3>
              <p className="text-sm text-muted-foreground mt-1">
                To start receiving notifications from delivery apps, install the NotiFetch Android app.
                It uses Android&apos;s NotificationListenerService to read your delivery notifications —
                no credentials needed, no API access, zero risk.
              </p>
              <Button className="mt-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold">
                <Smartphone className="w-4 h-4 mr-2" />
                Download Android App
              </Button>
            </div>
          </div>
        </div>

        {/* Account info */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-semibold mb-4">Account Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Email</span>
              <p className="font-medium">{session.user.email}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Name</span>
              <p className="font-medium">{session.user.name || "Not set"}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Plan</span>
              <p className="font-medium capitalize">{plan}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Member Since</span>
              <p className="font-medium">
                {userData?.createdAt
                  ? new Date(userData.createdAt as string).toLocaleDateString()
                  : "Just now"}
              </p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-border">
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
