"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PLATFORMS, DELIVERY_CATEGORIES, REGIONS } from "@/lib/data";
import {
  Sparkles,
  Gift,
  Check,
  Zap,
  Globe,
  Bell,
  TrendingUp,
  Calendar,
  Heart,
  Users,
  ArrowRight,
} from "lucide-react";

interface FreePreviewSectionProps {
  onNavigate?: (sectionId: string) => void;
}

export function FreePreviewSection({ onNavigate }: FreePreviewSectionProps) {
  const features = [
    {
      icon: Bell,
      title: "Unlimited Notifications",
      description: "Capture every delivery notification from every supported platform — no caps, no limits, no quotas.",
    },
    {
      icon: Globe,
      title: "All Platforms Unlocked",
      description: `${PLATFORMS.length}+ platforms across ${DELIVERY_CATEGORIES.length} categories in ${REGIONS.length} regions — every integration is open during the preview.`,
    },
    {
      icon: TrendingUp,
      title: "Real-Time Earnings Dashboard",
      description: "Track orders, earnings, and platform performance with live aggregation from your phone's notifications.",
    },
    {
      icon: Zap,
      title: "Instant Push Alerts",
      description: "Get pinged the moment a high-value order lands on any of your delivery apps. Never miss a beat.",
    },
    {
      icon: Users,
      title: "Multi-Device Sync",
      description: "Link your Android phone, web dashboard, and tablet — your feed stays in sync everywhere.",
    },
    {
      icon: Heart,
      title: "No Card, No Catch",
      description: "No credit card, no trial timer, no auto-charge after 6 months. We're earning your trust first.",
    },
  ];

  const timeline = [
    {
      phase: "Now → Month 6",
      title: "Free Preview Period",
      status: "active",
      points: [
        "Every feature unlocked, free for everyone",
        "No payment information collected",
        "Use the entire app — QSR, food, grocery, package, freight, all of it",
        "Help us harden the product with real-world usage",
      ],
    },
    {
      phase: "After Month 6",
      title: "Premium Tier Launch",
      status: "upcoming",
      points: [
        "A free tier will remain, with limited platform support",
        "Premium unlocks the full platform catalog + priority alerts",
        "Existing free-preview users keep everything they've used for 6 more months",
        "Pricing will be transparent and region-adjusted",
      ],
    },
  ];

  return (
    <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-14">
          <Badge
            variant="secondary"
            className="mb-4 px-4 py-1.5 text-sm bg-amber-500/10 text-amber-500 border-amber-500/20"
          >
            <Gift className="w-3.5 h-3.5 mr-1.5" />
            Free Preview · 6 Months On Us
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            <span className="block">No Paywalls.</span>
            <span className="block bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
              No Kidding.
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            We just launched. Instead of selling you a subscription on day one, we&apos;re
            giving the entire app away free for 6 months — every platform, every feature,
            every notification. Build your workflow, earn your money, and tell us what to fix.
            We&apos;ll add a premium tier later, with a real free tier still in place.
          </p>
        </div>

        {/* Big hero card */}
        <Card className="mb-12 border-amber-500/30 bg-gradient-to-br from-amber-500/5 via-orange-500/5 to-transparent overflow-hidden">
          <CardContent className="p-8 sm:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              <div className="lg:col-span-2">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-amber-500" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">NotiFetch Preview</h3>
                    <p className="text-sm text-muted-foreground">
                      All features · All platforms · No card required
                    </p>
                  </div>
                </div>
                <p className="text-lg text-foreground/90 mb-6 leading-relaxed">
                  Sign in, install the Android app, and start aggregating delivery notifications
                  across <span className="font-semibold text-amber-500">{PLATFORMS.length}+ platforms</span> today.
                  When the premium tier launches in 6 months, your account will keep working —
                  and your existing setup will be grandfathered into the free tier automatically.
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    size="lg"
                    onClick={() => (window.location.href = "/auth/signin")}
                    className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold shadow-xl shadow-amber-500/25"
                  >
                    Start Free — No Card Needed
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    <Calendar className="w-3.5 h-3.5 inline mr-1" />
                    Premium launches after 6 months of preview
                  </span>
                </div>
              </div>
              <div className="rounded-2xl bg-background/60 border border-amber-500/20 p-6 text-center">
                <p className="text-sm text-muted-foreground mb-1">Today&apos;s price</p>
                <div className="flex items-baseline justify-center gap-1 mb-1">
                  <span className="text-5xl font-extrabold bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
                    ₹0
                  </span>
                  <span className="text-muted-foreground">/ forever*</span>
                </div>
                <p className="text-xs text-muted-foreground mb-4">
                  *Free for 6 months, then a free tier remains
                </p>
                <div className="space-y-2 text-left">
                  {[
                    "All 80+ platforms unlocked",
                    "Unlimited notifications",
                    "Multi-device sync",
                    "No payment data collected",
                  ].map((point) => (
                    <div key={point} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-amber-500 shrink-0" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feature grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title} className="border-border/60 hover:border-amber-500/30 transition-colors">
                <CardContent className="p-6">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-amber-500" />
                  </div>
                  <h4 className="font-semibold mb-2">{feature.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {timeline.map((phase) => (
            <Card
              key={phase.phase}
              className={
                phase.status === "active"
                  ? "border-amber-500/40 bg-amber-500/[0.03]"
                  : "border-border/60 bg-muted/20"
              }
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge
                    variant="secondary"
                    className={
                      phase.status === "active"
                        ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                        : "bg-muted text-muted-foreground border-border"
                    }
                  >
                    {phase.phase}
                  </Badge>
                  {phase.status === "active" && (
                    <span className="text-xs font-semibold text-amber-500 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                      Active now
                    </span>
                  )}
                </div>
                <CardTitle className="text-xl mt-2">{phase.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {phase.points.map((point) => (
                    <li key={point} className="flex items-start gap-2 text-sm">
                      <Check
                        className={`w-4 h-4 mt-0.5 shrink-0 ${
                          phase.status === "active" ? "text-amber-500" : "text-muted-foreground"
                        }`}
                      />
                      <span className="text-muted-foreground">{point}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom note */}
        <p className="text-center text-sm text-muted-foreground mt-10 max-w-2xl mx-auto">
          We&apos;re a small team building the tool we wish existed. The 6-month free preview
          is our way of saying: try it, break it, tell us what&apos;s wrong. The premium tier
          will only launch once the app is genuinely worth paying for — and even then, a real
          free tier stays in place for everyone.
        </p>
      </div>
    </section>
  );
}
