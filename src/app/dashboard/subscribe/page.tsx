"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Zap, ArrowLeft, Check, Crown, Rocket, Sparkles,
  Bell, Globe, Headphones, Infinity, Shield, Star
} from "lucide-react";
import { BackButton } from "@/components/back-button";
import { RazorpayCheckout } from "@/components/razorpay-checkout";

interface UserData {
  plan: string;
  createdAt: string;
}

export default function SubscribePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  const fetchUser = useCallback(async () => {
    try {
      const res = await fetch("/api/user");
      if (res.ok) {
        const data = await res.json();
        setUserData(data.user);
      }
    } catch {
      // Silently handle
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === "authenticated") {
      fetchUser();
    }
  }, [status, fetchUser]);

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center animate-pulse">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-semibold">Loading plans...</span>
        </div>
      </div>
    );
  }

  const currentPlan = userData?.plan || "free";

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <BackButton fallback="/dashboard" />
            <h1 className="text-lg font-bold">Subscription</h1>
          </div>
          <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 capitalize">
            {currentPlan} Plan
          </Badge>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-3">Choose Your Plan</h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Start free and upgrade when you need more. No hidden fees, cancel anytime.
          </p>
        </div>

        {/* Plans grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Free Plan */}
          <Card className={`relative ${currentPlan === "free" ? "border-amber-500/50" : ""}`}>
            {currentPlan === "free" && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-amber-500 text-white">Current Plan</Badge>
              </div>
            )}
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Rocket className="w-6 h-6 text-gray-500" />
                Free
              </CardTitle>
              <div className="mt-2">
                <span className="text-4xl font-bold">₹0</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Perfect for getting started with NotiFetch.
              </p>
            </CardHeader>
            <CardContent>
              <Separator className="mb-4" />
              <ul className="space-y-3">
                {[
                  { label: "50 notifications/day", included: true },
                  { label: "2 platform connections", included: true },
                  { label: "Basic notification feed", included: true },
                  { label: "Sound alerts", included: true },
                  { label: "1 region", included: true },
                  { label: "Auto-accept rules", included: false },
                  { label: "Earnings dashboard", included: false },
                  { label: "Voice alerts", included: false },
                  { label: "Smart order ranking", included: false },
                ].map((feature) => (
                  <li key={feature.label} className={`flex items-center gap-2 text-sm ${!feature.included ? "opacity-40" : ""}`}>
                    {feature.included ? (
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    ) : (
                      <span className="w-4 h-4 shrink-0" />
                    )}
                    {feature.label}
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <Button
                  variant="outline"
                  className="w-full"
                  disabled={currentPlan === "free"}
                >
                  {currentPlan === "free" ? "Current Plan" : "Downgrade"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Pro Plan */}
          <Card className={`relative border-amber-500/30 ${currentPlan === "pro" ? "border-amber-500 ring-2 ring-amber-500/20" : ""}`}>
            {currentPlan === "pro" && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-amber-500 text-white">Current Plan</Badge>
              </div>
            )}
            <div className="absolute -top-3 right-4">
              <Badge className="bg-gradient-to-r from-amber-500 to-orange-600 text-white">
                <Sparkles className="w-3 h-3 mr-1" />
                Popular
              </Badge>
            </div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="w-6 h-6 text-amber-500" />
                Pro
              </CardTitle>
              <div className="mt-2">
                <span className="text-4xl font-bold">₹49</span>
                <span className="text-muted-foreground">/month</span>
                <p className="text-xs text-muted-foreground mt-0.5">Inclusive of all taxes</p>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                For drivers who want unlimited notifications from all platforms.
              </p>
            </CardHeader>
            <CardContent>
              <Separator className="mb-4" />
              <ul className="space-y-3">
                {[
                  { label: "Unlimited notifications", included: true },
                  { label: "All platform connections", included: true },
                  { label: "Advanced notification feed", included: true },
                  { label: "Sound + vibration alerts", included: true },
                  { label: "All 8 regions worldwide", included: true },
                  { label: "Auto-accept rules", included: true },
                  { label: "Earnings dashboard", included: true },
                  { label: "Voice alerts", included: false },
                  { label: "Smart order ranking (AI)", included: false },
                ].map((feature) => (
                  <li key={feature.label} className={`flex items-center gap-2 text-sm ${!feature.included ? "opacity-40" : ""}`}>
                    {feature.included ? (
                      <Check className="w-4 h-4 text-amber-500 shrink-0" />
                    ) : (
                      <span className="w-4 h-4 shrink-0" />
                    )}
                    {feature.label}
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                {currentPlan === "pro" ? (
                  <Button variant="outline" className="w-full" disabled>
                    Current Plan
                  </Button>
                ) : (
                  <RazorpayCheckout
                    plan="pro"
                    period="monthly"
                    currentPlan={currentPlan}
                    onSuccess={() => fetchUser()}
                    label={currentPlan === "free" ? "Upgrade to Pro — ₹49/mo" : "Upgrade to Pro"}
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold"
                    variant="default"
                  />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Premium Plan */}
          <Card className={`relative border-amber-500/50 shadow-xl shadow-amber-500/10 ${currentPlan === "premium" ? "border-amber-500 ring-2 ring-amber-500/20" : ""}`}>
            {currentPlan === "premium" && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-amber-500 text-white">Current Plan</Badge>
              </div>
            )}
            <div className="absolute -top-3 right-4">
              <Badge className="bg-gradient-to-r from-amber-500 to-orange-600 text-white">
                <Crown className="w-3 h-3 mr-1" />
                Maximum
              </Badge>
            </div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="w-6 h-6 text-amber-500" />
                Premium
              </CardTitle>
              <div className="mt-2">
                <span className="text-4xl font-bold">₹99</span>
                <span className="text-muted-foreground">/month</span>
                <p className="text-xs text-muted-foreground mt-0.5">Inclusive of all taxes</p>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Maximum earnings with every feature unlocked.
              </p>
            </CardHeader>
            <CardContent>
              <Separator className="mb-4" />
              <ul className="space-y-3">
                {[
                  { label: "Unlimited notifications", included: true },
                  { label: "All platform connections", included: true },
                  { label: "Advanced notification feed", included: true },
                  { label: "Sound + vibration alerts", included: true },
                  { label: "All 8 regions worldwide", included: true },
                  { label: "Auto-accept rules", included: true },
                  { label: "Full earnings dashboard", included: true },
                  { label: "Voice alerts & announcements", included: true },
                  { label: "Smart order ranking (AI-powered)", included: true },
                  { label: "Priority support", included: true },
                ].map((feature) => (
                  <li key={feature.label} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-amber-500 shrink-0" />
                    {feature.label}
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                {currentPlan === "premium" ? (
                  <Button variant="outline" className="w-full" disabled>
                    Current Plan
                  </Button>
                ) : (
                  <RazorpayCheckout
                    plan="premium"
                    period="monthly"
                    currentPlan={currentPlan}
                    onSuccess={() => fetchUser()}
                    label={currentPlan === "free" ? "Upgrade to Premium — ₹99/mo" : "Upgrade to Premium"}
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold"
                    variant="default"
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQ */}
        <div className="mt-12">
          <h3 className="text-xl font-bold text-center mb-6">Frequently Asked Questions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                q: "Can I cancel anytime?",
                a: "Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period.",
              },
              {
                q: "How does NotiFetch work?",
                a: "NotiFetch reads your phone's existing delivery notifications using Android's NotificationListenerService. No login credentials or API access needed.",
              },
              {
                q: "Is my data safe?",
                a: "Absolutely. We never access delivery platform APIs, store credentials, or share your data. All notification processing happens on your device.",
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept UPI, credit/debit cards, net banking, and wallets through Razorpay — India's most trusted payment gateway.",
              },
            ].map((faq) => (
              <Card key={faq.q}>
                <CardContent className="p-4">
                  <h4 className="font-medium text-sm mb-2">{faq.q}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Trademark Disclaimer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground max-w-2xl mx-auto">
            Platform names and logos shown on NotiFetch are the property of their respective owners.
            NotiFetch is not affiliated with, endorsed by, or connected to any delivery platform.
            Names are displayed for identification purposes only under nominative fair use.
          </p>
        </div>
      </main>
    </div>
  );
}
