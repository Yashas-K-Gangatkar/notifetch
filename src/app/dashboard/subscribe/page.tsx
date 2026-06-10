"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Zap, Check, ArrowLeft,
  Bell, Globe, Headphones, Shield
} from "lucide-react";
import { BackButton } from "@/components/back-button";
import { RazorpayCheckout } from "@/components/razorpay-checkout";
import { PLATFORMS, type PlanId } from "@/lib/data";

interface UserData {
  plan: string;
  createdAt: string;
}

export default function SubscribePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<PlanId | null>(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);

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

  const currentPlan = userData?.plan || "free";

  // Plan definitions with INR pricing (India)
  const plans = [
    {
      id: "free" as PlanId,
      name: "Free",
      price: "₹0",
      period: "/month",
      description: "Get started with the basics",
      platformLimit: 2,
      unlimitedPlatforms: false,
      icon: "⚡",
      features: [
        "2 platform connections",
        "Basic notification feed",
        "Sound alerts",
        "1 region",
      ],
      excluded: [
        "5+ platform connections",
        "Auto-accept rules",
        "Earnings dashboard",
        "Voice alerts",
        "Smart order ranking",
      ],
    },
    {
      id: "starter" as PlanId,
      name: "Starter",
      price: "₹170",
      period: "/month",
      description: "For part-time drivers with a few platforms",
      platformLimit: 5,
      unlimitedPlatforms: false,
      icon: "🚀",
      features: [
        "5 platform connections",
        "Advanced notification feed",
        "Sound + vibration alerts",
        "All regions",
        "Auto-accept rules",
        "Basic earnings dashboard",
      ],
      excluded: [
        "8+ platform connections",
        "Voice alerts",
        "Smart order ranking",
      ],
    },
    {
      id: "pro" as PlanId,
      name: "Pro",
      price: "₹420",
      period: "/month",
      description: "For active drivers across multiple platforms",
      platformLimit: 8,
      unlimitedPlatforms: false,
      icon: "👑",
      features: [
        "8 platform connections",
        "Advanced notification feed",
        "Sound + vibration + voice alerts",
        "All regions",
        "Auto-accept rules",
        "Full earnings dashboard",
        "Smart order ranking (AI-powered)",
        "Priority support",
      ],
      excluded: [
        "Unlimited platform connections",
        "Custom platform preferences",
      ],
      popular: true,
    },
    {
      id: "premium" as PlanId,
      name: "Premium",
      price: "₹830",
      period: "/month",
      description: "Unlimited everything for full-time professionals",
      platformLimit: 999,
      unlimitedPlatforms: true,
      icon: "💎",
      features: [
        "Unlimited platform connections",
        "Advanced notification feed",
        "All alerts + custom sounds",
        "All regions worldwide",
        "Auto-accept rules",
        "Full earnings dashboard",
        "Smart order ranking (AI-powered)",
        "Priority support + early access",
        "Custom platform preferences",
        "14 languages supported",
      ],
      excluded: [],
    },
  ];

  const activePlan = plans.find(p => p.id === selectedPlan);
  const platformLimit = activePlan?.platformLimit || 0;

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev => {
      if (prev.includes(platformId)) {
        return prev.filter(id => id !== platformId);
      }
      if (prev.length >= platformLimit) return prev;
      return [...prev, platformId];
    });
  };

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

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-3">Choose Your Plan</h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Start free and upgrade when you need more platforms. No hidden fees, cancel anytime.
          </p>
        </div>

        {/* Plans grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {plans.map((plan) => {
            const isCurrent = currentPlan === plan.id;
            const isHigherPlan =
              (currentPlan === "premium") ||
              (currentPlan === "pro" && (plan.id === "starter" || plan.id === "free")) ||
              (currentPlan === "starter" && plan.id === "free");

            return (
              <Card
                key={plan.id}
                className={`relative cursor-pointer transition-all ${
                  selectedPlan === plan.id
                    ? "ring-2 ring-amber-500/50 border-amber-500/50"
                    : ""
                } ${isCurrent ? "opacity-60" : "hover:border-amber-500/20"}`}
                onClick={() => {
                  if (!isCurrent && !isHigherPlan) {
                    setSelectedPlan(plan.id);
                    setSelectedPlatforms([]);
                  }
                }}
              >
                {plan.popular && (
                  <div className="absolute -top-3 right-4">
                    <Badge className="bg-gradient-to-r from-amber-500 to-orange-600 text-white">
                      Popular
                    </Badge>
                  </div>
                )}
                {isCurrent && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-amber-500 text-white">Current</Badge>
                  </div>
                )}
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">{plan.icon}</span>
                    <h3 className="text-lg font-bold">{plan.name}</h3>
                  </div>
                  <div>
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground text-sm">{plan.period}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {plan.unlimitedPlatforms ? "Unlimited platforms" : `Up to ${plan.platformLimit} platforms`}
                  </p>
                  <p className="text-xs text-muted-foreground">{plan.description}</p>
                </CardHeader>
                <CardContent>
                  <Separator className="mb-3" />
                  <ul className="space-y-2">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-xs">
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                    {plan.excluded.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-xs text-muted-foreground/50">
                        <span className="w-3.5 h-3.5 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4">
                    {isCurrent ? (
                      <Button variant="outline" className="w-full" disabled>
                        Current Plan
                      </Button>
                    ) : isHigherPlan ? (
                      <Button variant="outline" className="w-full" disabled>
                        Downgrade
                      </Button>
                    ) : (
                      <Button
                        variant={selectedPlan === plan.id ? "default" : "outline"}
                        className={`w-full ${
                          selectedPlan === plan.id
                            ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white"
                            : ""
                        }`}
                      >
                        Select {plan.name}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Platform Preference Selection */}
        {selectedPlan && selectedPlan !== "free" && !plans.find(p => p.id === selectedPlan)?.unlimitedPlatforms && (
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-amber-500" />
                <h3 className="text-lg font-bold">Select Your Platforms</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Choose up to {platformLimit} platforms you want to receive notifications from.
                You can change these anytime in Settings.
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="text-amber-500 border-amber-500/20">
                  {selectedPlatforms.length} / {platformLimit} selected
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {/* Group by category */}
              {["food", "grocery", "package", "courier", "last-mile", "ride-transport"].map(category => {
                const categoryPlatforms = PLATFORMS.filter(p => p.category === category);
                if (categoryPlatforms.length === 0) return null;
                const categoryName = category === "ride-transport" ? "Ride & Transport" :
                  category === "last-mile" ? "Last-Mile Delivery" :
                  category.charAt(0).toUpperCase() + category.slice(1);

                return (
                  <div key={category} className="mb-4">
                    <p className="text-sm font-medium text-muted-foreground mb-2">{categoryName}</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                      {categoryPlatforms.map(platform => {
                        const isSelected = selectedPlatforms.includes(platform.id);
                        const isDisabled = !isSelected && selectedPlatforms.length >= platformLimit;

                        return (
                          <button
                            key={platform.id}
                            onClick={() => !isDisabled && togglePlatform(platform.id)}
                            className={`flex items-center gap-2 p-2.5 rounded-lg border text-sm transition-all ${
                              isSelected
                                ? "border-amber-500/40 bg-amber-500/10 text-amber-500"
                                : isDisabled
                                  ? "border-border/50 opacity-40 cursor-not-allowed"
                                  : "border-border hover:border-amber-500/20 hover:bg-muted/30"
                            }`}
                          >
                            <Checkbox
                              checked={isSelected}
                              disabled={isDisabled}
                              className="pointer-events-none"
                            />
                            <span className="truncate text-xs">{platform.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}

        {/* Premium: Show all platforms available */}
        {selectedPlan === "premium" && (
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-purple-500" />
                <h3 className="text-lg font-bold">All Platforms Included</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Premium gives you access to all {PLATFORMS.length}+ platforms worldwide.
                You can customize which ones to enable in Settings after upgrading.
              </p>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {PLATFORMS.map(platform => (
                  <Badge
                    key={platform.id}
                    variant="outline"
                    className="text-xs py-1 px-2.5"
                  >
                    {platform.icon} {platform.name}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Payment section */}
        {selectedPlan && selectedPlan !== "free" && currentPlan !== selectedPlan && (
          <Card className="mb-8 border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-orange-500/5">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold">
                    Upgrade to {plans.find(p => p.id === selectedPlan)?.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {plans.find(p => p.id === selectedPlan)?.price}/month —{" "}
                    {plans.find(p => p.id === selectedPlan)?.unlimitedPlatforms
                      ? "Unlimited platforms"
                      : `Up to ${plans.find(p => p.id === selectedPlan)?.platformLimit} platforms`}
                  </p>
                </div>
                <RazorpayCheckout
                  plan={selectedPlan}
                  period="monthly"
                  currentPlan={currentPlan}
                  onSuccess={() => fetchUser()}
                  label={`Pay ${plans.find(p => p.id === selectedPlan)?.price}/month`}
                  className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold"
                  variant="default"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* FAQ */}
        <div className="mt-8">
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
                q: "What if I need more platforms?",
                a: "You can upgrade your plan anytime to get more platform connections. Starter gives you 5, Pro gives 8, and Premium gives unlimited access.",
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
      </main>
    </div>
  );
}
