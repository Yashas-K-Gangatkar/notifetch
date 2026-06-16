"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Zap, ArrowLeft, Gift, Sparkles, Check, Calendar, Bell,
  Globe, Heart, ArrowRight, Clock
} from "lucide-react";
import { BackButton } from "@/components/back-button";
import { PLATFORMS, DELIVERY_CATEGORIES } from "@/lib/data";

export default function SubscribePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center animate-pulse">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-semibold">Loading...</span>
        </div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <BackButton fallback="/dashboard" />
            <h1 className="text-lg font-bold">Plan &amp; Preview</h1>
          </div>
          <Badge
            variant="secondary"
            className="bg-amber-500/10 text-amber-500 border-amber-500/20"
          >
            <Gift className="w-3 h-3 mr-1" />
            Free Preview
          </Badge>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Hero card */}
        <Card className="mb-8 border-amber-500/30 bg-gradient-to-br from-amber-500/5 via-orange-500/5 to-transparent overflow-hidden">
          <CardContent className="p-8 sm:p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-8 h-8 text-amber-500" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold mb-4">
              You&apos;re on the{" "}
              <span className="bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
                Free Preview
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-6">
              NotiFetch is in its first 6 months. Every feature, every platform, every notification
              is unlocked for free — no payment information on file, no auto-charge when the preview
              ends. When the premium tier launches, your account will keep working with everything
              you&apos;ve been using grandfathered into a free tier.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button
                onClick={() => router.push("/dashboard")}
                className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold"
              >
                Back to Dashboard
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <span className="text-sm text-muted-foreground inline-flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Premium launches in ~6 months
              </span>
            </div>
          </CardContent>
        </Card>

        {/* What you get right now */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Check className="w-5 h-5 text-amber-500" />
              What you have right now — free
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { icon: Bell, label: `Unlimited notifications across all ${PLATFORMS.length}+ platforms` },
                { icon: Globe, label: `Every category unlocked — food, grocery, QSR, package, freight, etc.` },
                { icon: Sparkles, label: "Real-time earnings dashboard with live aggregation" },
                { icon: Zap, label: "Instant push alerts for high-value orders" },
                { icon: Calendar, label: "Multi-device sync (phone + web + tablet)" },
                { icon: Heart, label: "Zero payment data collected — nothing to cancel" },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                    <Icon className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <span className="text-sm">{item.label}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* What happens after 6 months */}
        <Card className="mb-8 border-border/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="w-5 h-5 text-amber-500" />
              What happens after the preview ends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-amber-500">1</span>
                </div>
                <div>
                  <p className="font-semibold mb-1">A real free tier stays in place</p>
                  <p className="text-sm text-muted-foreground">
                    The app doesn&apos;t suddenly become paid. A meaningful free tier — covering a
                    limited set of platforms — will remain available forever.
                  </p>
                </div>
              </div>
              <Separator />
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-amber-500">2</span>
                </div>
                <div>
                  <p className="font-semibold mb-1">Premium tier launches with the full platform catalog</p>
                  <p className="text-sm text-muted-foreground">
                    Power users who want every platform (especially niche ones) can upgrade to a
                    premium tier. Pricing will be transparent and region-adjusted.
                  </p>
                </div>
              </div>
              <Separator />
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-amber-500">3</span>
                </div>
                <div>
                  <p className="font-semibold mb-1">Existing preview users are grandfathered</p>
                  <p className="text-sm text-muted-foreground">
                    Anyone who used NotiFetch during the 6-month preview keeps access to the platforms
                    they were using for an additional 6 months — no charge, no surprise.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { value: `${PLATFORMS.length}+`, label: "Platforms open" },
            { value: DELIVERY_CATEGORIES.length.toString(), label: "Categories" },
            { value: "₹0", label: "Today's price" },
          ].map((stat) => (
            <Card key={stat.label} className="border-border/60 text-center">
              <CardContent className="p-5">
                <p className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
                  {stat.value}
                </p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <Card className="bg-muted/20 border-border/60">
          <CardContent className="p-6 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Got feedback during the preview? We&apos;re building this in public.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button variant="outline" onClick={() => router.push("/dashboard")}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <Button variant="outline" onClick={() => router.push("/")}>
                <Globe className="w-4 h-4 mr-2" />
                Explore Platforms
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
