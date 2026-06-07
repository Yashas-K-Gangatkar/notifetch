"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Zap, LogOut, Bell, TrendingUp, Package, Settings, Smartphone, ArrowLeft, Home, CreditCard, BellRing, BarChart3, Globe } from "lucide-react";
import { signOut } from "next-auth/react";
import { RazorpayCheckout } from "@/components/razorpay-checkout";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState<Record<string, unknown> | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

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
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/")}
              className="h-9 w-9 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
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

        {/* Quick nav cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { icon: Home, label: "Home", href: "/", color: "text-amber-500" },
            { icon: BarChart3, label: "Earnings", href: "/#earnings", color: "text-green-500" },
            { icon: Globe, label: "Platforms", href: "/#platforms", color: "text-blue-500" },
            { icon: CreditCard, label: "Pricing", href: "/#pricing", color: "text-purple-500" },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => router.push(item.href)}
              className="bg-card border border-border rounded-xl p-4 flex items-center gap-3 hover:bg-muted/50 transition-colors text-left"
            >
              <item.icon className={`w-5 h-5 ${item.color} shrink-0`} />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
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

        {/* Two columns: Install App + Upgrade */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Install Android App */}
          <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <Smartphone className="w-6 h-6 text-amber-500 mt-0.5 shrink-0" />
              <div className="flex-1">
                <h3 className="font-semibold text-amber-500">Install the Android App</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Open this page on your phone and tap &quot;Add to Home Screen&quot; to install NotiFetch as an app.
                  It works like a native Android app — no Play Store needed.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 mt-4">
                  <Button
                    onClick={() => {
                      // @ts-expect-error deferredPrompt is not standard
                      if (window.deferredPrompt) {
                        // @ts-expect-error deferredPrompt is not standard
                        window.deferredPrompt.prompt();
                      } else {
                        alert('Open this page on your phone\'s browser and tap "Add to Home Screen" or "Install App" to install NotiFetch.');
                      }
                    }}
                    className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold"
                  >
                    <Smartphone className="w-4 h-4 mr-2" />
                    Install App
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => router.push("/#hero")}
                    className="border-amber-500/30 text-amber-500 hover:bg-amber-500/10"
                  >
                    <BellRing className="w-4 h-4 mr-2" />
                    Scan QR Code
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Upgrade Plan */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-start gap-3">
              <CreditCard className="w-6 h-6 text-purple-500 mt-0.5 shrink-0" />
              <div className="flex-1">
                <h3 className="font-semibold">Upgrade Your Plan</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  You&apos;re on the <span className="text-amber-500 font-semibold capitalize">{plan}</span> plan.
                  Upgrade to unlock advanced analytics, priority notifications, and more.
                </p>
                <div className="mt-4">
                  {plan === "free" ? (
                    <RazorpayCheckout
                      plan="pro"
                      period="monthly"
                      currentPlan="free"
                      onSuccess={() => window.location.reload()}
                      label="Upgrade to Pro — ₹49/mo"
                    />
                  ) : (
                    <Button variant="outline" size="sm">
                      <Settings className="w-4 h-4 mr-2" />
                      Manage Subscription
                    </Button>
                  )}
                </div>
              </div>
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
          <div className="mt-4 pt-4 border-t border-border flex flex-wrap gap-3">
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
            <Button variant="ghost" size="sm" onClick={() => router.push("/")} className="text-muted-foreground">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
