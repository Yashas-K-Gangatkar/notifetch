"use client";

import { useSession } from "next-auth/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PLATFORMS, DELIVERY_CATEGORIES, REGIONS } from "@/lib/data";
import {
  Mail,
  Smartphone,
  Bell,
  ArrowRight,
  Check,
  Zap,
  Globe,
  TrendingUp,
  Wallet,
  Link2,
  ArrowLeftRight,
} from "lucide-react";

interface HowItWorksSectionProps {
  onNavigate?: (sectionId: string) => void;
}

export function HowItWorksSection({ onNavigate }: HowItWorksSectionProps) {
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated" && !!session?.user;

  const steps = [
    {
      step: 1,
      icon: Mail,
      title: "Login with Email",
      description:
        "No passwords, no credit card. Sign in with your email address — we send you a one-time code and you're in. Google sign-in also works if you prefer.",
      accent: "from-amber-500/10 to-orange-500/10",
      iconBg: "bg-amber-500/10",
      iconColor: "text-amber-500",
      border: "border-amber-500/20",
    },
    {
      step: 2,
      icon: Link2,
      title: "Connect Your Platforms",
      description:
        `From your dashboard, pick the delivery apps you actually use — ${PLATFORMS.length}+ platforms across ${DELIVERY_CATEGORIES.length} categories in ${REGIONS.length} regions. Toggle them on. No platform credentials needed, no API keys, nothing stored on our servers.`,
      accent: "from-orange-500/10 to-red-500/10",
      iconBg: "bg-orange-500/10",
      iconColor: "text-orange-500",
      border: "border-orange-500/20",
    },
    {
      step: 3,
      icon: Smartphone,
      title: "Open the NotiFetch App",
      description:
        "Install the NotiFetch Android app on your phone (scan the QR code from the home page). Sign in with the same email. Grant notification access — that's how NotiFetch reads your existing delivery notifications.",
      accent: "from-red-500/10 to-pink-500/10",
      iconBg: "bg-red-500/10",
      iconColor: "text-red-500",
      border: "border-red-500/20",
    },
    {
      step: 4,
      icon: Bell,
      title: "Get Real-Time Notifications",
      description:
        "Whenever any of your connected delivery apps sends you a delivery notification, NotiFetch captures it instantly and mirrors it to your web dashboard. You see every order in one feed — value, pickup, dropoff, distance.",
      accent: "from-pink-500/10 to-purple-500/10",
      iconBg: "bg-pink-500/10",
      iconColor: "text-pink-500",
      border: "border-pink-500/20",
    },
    {
      step: 5,
      icon: ArrowLeftRight,
      title: "Open the Specific Delivery App",
      description:
        "Tap any notification in NotiFetch and it launches the correct delivery app. You accept the order in the partner app like normal. NotiFetch is just your aggregator and alert system, never a middleman.",
      accent: "from-purple-500/10 to-indigo-500/10",
      iconBg: "bg-purple-500/10",
      iconColor: "text-purple-500",
      border: "border-purple-500/20",
    },
    {
      step: 6,
      icon: Wallet,
      title: "Earn Money",
      description:
        "Complete the delivery in the partner app — that's where you actually get paid by the platform. NotiFetch tracks your earnings across every platform in one dashboard so you can see today's haul, weekly totals, and which apps are pulling their weight. One feed, every platform, every rupee.",
      accent: "from-indigo-500/10 to-green-500/10",
      iconBg: "bg-indigo-500/10",
      iconColor: "text-indigo-500",
      border: "border-indigo-500/20",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-14">
          <Badge
            variant="secondary"
            className="mb-4 px-4 py-1.5 text-sm bg-amber-500/10 text-amber-500 border-amber-500/20"
          >
            <Zap className="w-3.5 h-3.5 mr-1.5" />
            From Login to Earning in 6 Steps
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            <span className="block">How NotiFetch</span>
            <span className="block bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
              Actually Works.
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            NotiFetch isn&apos;t a delivery platform — it&apos;s the aggregator that sits on top of
            every delivery app you already use. Sign in once, install the companion app, and
            every delivery notification from every platform lands in one real-time feed.
            Tap, open, deliver, earn. That&apos;s it.
          </p>
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={step.step} className="relative">
                <Card className={`h-full bg-gradient-to-br ${step.accent} ${step.border} border hover:shadow-lg hover:-translate-y-1 transition-all duration-300`}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl ${step.iconBg} flex items-center justify-center`}>
                        <Icon className={`w-6 h-6 ${step.iconColor}`} />
                      </div>
                      <span className="text-4xl font-extrabold text-muted-foreground/15">
                        {String(step.step).padStart(2, "0")}
                      </span>
                    </div>
                    <h4 className="font-semibold text-lg mb-2">{step.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                  </CardContent>
                </Card>
                {/* Connector arrow for desktop */}
                {idx < steps.length - 1 && idx % 3 !== 2 && (
                  <div className="hidden lg:flex absolute top-1/2 -right-3 -translate-y-1/2 z-10">
                    <ArrowRight className="w-5 h-5 text-amber-500/60" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Big CTA card */}
        <Card className="border-amber-500/30 bg-gradient-to-br from-amber-500/5 via-orange-500/5 to-transparent overflow-hidden">
          <CardContent className="p-8 sm:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              <div className="lg:col-span-2">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-amber-500" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Ready to start?</h3>
                    <p className="text-sm text-muted-foreground">
                      One email · One app · Every delivery platform
                    </p>
                  </div>
                </div>
                <p className="text-lg text-foreground/90 mb-6 leading-relaxed">
                  Login with your email, connect the platforms you already use, install the
                  NotiFetch app, and start seeing every delivery notification in one feed.
                  No payment data collected, no platform credentials stored, no risk.
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  {isLoggedIn ? (
                    <Button
                      size="lg"
                      onClick={() => (window.location.href = "/dashboard")}
                      className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold shadow-xl shadow-amber-500/25"
                    >
                      Open My Dashboard
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      size="lg"
                      onClick={() => (window.location.href = "/auth/signin")}
                      className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold shadow-xl shadow-amber-500/25"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Login with Email — It&apos;s Free
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => onNavigate?.("platforms")}
                    className="border-border hover:bg-muted"
                  >
                    <Globe className="w-4 h-4 mr-2" />
                    See All Platforms
                  </Button>
                </div>
              </div>
              <div className="rounded-2xl bg-background/60 border border-amber-500/20 p-6">
                <p className="text-sm text-muted-foreground mb-3 font-semibold">What you get today</p>
                <div className="space-y-3">
                  {[
                    `All ${PLATFORMS.length}+ platforms unlocked`,
                    "Unlimited notifications, no caps",
                    "Real-time earnings dashboard",
                    "Multi-device sync (phone + web)",
                    "Zero payment data collected",
                  ].map((point) => (
                    <div key={point} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bottom note */}
        <p className="text-center text-sm text-muted-foreground mt-10 max-w-2xl mx-auto">
          NotiFetch reads notifications that already exist on your phone — we never ask for
          your delivery platform passwords, never log in on your behalf, and never store
          payment information. Your data stays yours.
        </p>
      </div>
    </section>
  );
}
