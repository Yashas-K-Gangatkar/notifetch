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
  Bell, Globe, Headphones, Shield, CreditCard, CheckCircle2,
  AlertTriangle, WifiOff
} from "lucide-react";
import { BackButton } from "@/components/back-button";
import { RazorpayCheckout, getRazorpayScriptStatus } from "@/components/razorpay-checkout";
import { PLATFORMS, type PlanId } from "@/lib/data";

interface UserData {
  plan: string;
  createdAt: string;
}

interface NotificationSource {
  id: string;
  platformId: string;
  platformName: string;
  customName: string | null;
  category: string;
  listening: boolean;
}

export default function SubscribePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [existingPlatforms, setExistingPlatforms] = useState<NotificationSource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<PlanId | null>(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSavingPlatforms, setIsSavingPlatforms] = useState(false);
  const [paymentGatewayStatus, setPaymentGatewayStatus] = useState<"unknown" | "available" | "unavailable">("unknown");
  const [paymentConfigured, setPaymentConfigured] = useState(true);

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
        // Set selectedPlan to current plan
        setSelectedPlan(data.user?.plan || "free");
      }
    } catch {
      // Silently handle
    }
  }, []);

  const fetchExistingPlatforms = useCallback(async () => {
    try {
      const res = await fetch("/api/platforms");
      if (res.ok) {
        const data = await res.json();
        const sources: NotificationSource[] = data.sources || [];
        setExistingPlatforms(sources);
        // Pre-select platforms the user already has enabled
        const enabledIds = sources.filter((s: NotificationSource) => s.listening).map((s: NotificationSource) => s.platformId);
        setSelectedPlatforms(enabledIds);
      }
    } catch {
      // Silently handle
    }
  }, []);

  useEffect(() => {
    if (status === "authenticated") {
      Promise.all([fetchUser(), fetchExistingPlatforms()]).finally(() => setIsLoading(false));

      // Check if Razorpay payment gateway is available and configured
      const checkPaymentGateway = async () => {
        // Check if the payment API is configured by making a lightweight check
        try {
          const res = await fetch("/api/payments/create-order", {
            method: "OPTIONS",
          });
          // If we get any response, the endpoint exists
          // A 503 would indicate Razorpay is not configured
          if (res.status === 503) {
            setPaymentConfigured(false);
          }
        } catch {
          // Network error — might not be an issue with Razorpay itself
        }

        // Check if Razorpay script can be loaded
        const scriptStatus = getRazorpayScriptStatus();
        if (scriptStatus === "error") {
          setPaymentGatewayStatus("unavailable");
        } else if (scriptStatus === "ready") {
          setPaymentGatewayStatus("available");
        }
        // If "idle" or "loading", the RazorpayCheckout component will handle it
      };
      checkPaymentGateway();
    }
  }, [status, fetchUser, fetchExistingPlatforms]);

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
      price: "₹199",
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
      price: "₹399",
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
      price: "₹599",
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

  const isDowngrade = (planId: PlanId) => {
    const planOrder: Record<string, number> = { free: 0, starter: 1, pro: 2, premium: 3 };
    return planOrder[currentPlan] > planOrder[planId];
  };

  // Use the selectedPlan's limit for platform selection (allows preview of paid plan limits)
  // But for saving, we respect the current plan's actual limit
  const activePlan = plans.find(p => p.id === selectedPlan);
  const platformLimit = activePlan?.platformLimit || 2;
  const currentPlanData = plans.find(p => p.id === currentPlan);
  const currentPlanLimit = currentPlanData?.platformLimit || 2;
  const isPreviewingUpgrade = selectedPlan !== null && selectedPlan !== currentPlan && !isDowngrade(selectedPlan as PlanId);

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev => {
      if (prev.includes(platformId)) {
        return prev.filter(id => id !== platformId);
      }
      if (prev.length >= platformLimit) return prev;
      return [...prev, platformId];
    });
    setSaveSuccess(false);
  };

  // Save platform preferences to the database
  const savePlatformPreferences = async () => {
    setIsSavingPlatforms(true);
    try {
      // Get current enabled platform IDs
      const currentEnabledIds = existingPlatforms
        .filter(p => p.listening)
        .map(p => p.platformId);

      // Platforms to enable (new selections)
      const toEnable = selectedPlatforms.filter(id => !currentEnabledIds.includes(id));
      // Platforms to disable (removed selections)
      const toDisable = currentEnabledIds.filter(id => !selectedPlatforms.includes(id));

      // Enable new platforms
      for (const platformId of toEnable) {
        const platform = PLATFORMS.find(p => p.id === platformId);
        if (platform) {
          await fetch("/api/platforms", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              platformId: platform.id,
              platformName: platform.name,
              category: platform.category,
              packageName: platform.packageName,
            }),
          });
        }
      }

      // Disable removed platforms
      for (const platformId of toDisable) {
        await fetch(`/api/platforms?platformId=${platformId}`, {
          method: "DELETE",
        });
      }

      // Refresh existing platforms
      await fetchExistingPlatforms();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch {
      // Handle error
    } finally {
      setIsSavingPlatforms(false);
    }
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
            <h1 className="text-lg font-bold">Subscription & Platforms</h1>
          </div>
          <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 capitalize">
            {currentPlan} Plan
          </Badge>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-3">Choose Your Platforms & Plan</h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Select which platforms you want notifications from, then confirm. You can upgrade anytime for more platforms.
          </p>
        </div>

        {/* Platform Preference Selection — ALWAYS visible, shown FIRST */}
        <Card className="mb-8 bg-card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-amber-500" />
              <h3 className="text-lg font-bold">
                {selectedPlan === "premium" ? "All Platforms Available" : "Select Your Platforms"}
              </h3>
            </div>
            <p className="text-sm text-muted-foreground">
              {selectedPlan === "premium"
                ? "Premium gives you access to all platforms worldwide. Select which ones you want enabled."
                : `Choose up to ${platformLimit} platforms you want to receive notifications from. You can change these anytime.`}
            </p>
            {/* Free plan guidance */}
            {currentPlan === "free" && selectedPlan === "free" && (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 mt-2">
                <p className="text-sm text-amber-500 font-medium">
                  ✅ You can select up to 2 platforms on your Free plan right now. Select your platforms below and click "Confirm & Get Notifications" to start receiving alerts.
                </p>
              </div>
            )}
            {/* Upgrade preview message */}
            {isPreviewingUpgrade && selectedPlan && selectedPlan !== "free" && (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 mt-2">
                <p className="text-sm text-amber-500 font-medium">
                  🚀 With the {plans.find(p => p.id === selectedPlan)?.name} plan, you can select up to {platformLimit === 999 ? "unlimited" : platformLimit} platforms. Complete payment below to unlock them all.
                </p>
              </div>
            )}
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="text-amber-500 border-amber-500/20">
                {selectedPlatforms.length} / {selectedPlan === "premium" ? PLATFORMS.length : platformLimit} selected
              </Badge>
              {selectedPlatforms.length > 0 && (
                <Badge variant="outline" className="text-emerald-500 border-emerald-500/20">
                  Ready to receive notifications
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {/* Group by category */}
            {["food", "grocery", "package", "courier", "last-mile", "ride-transport"].map(category => {
              const categoryPlatforms = PLATFORMS.filter(p => p.category === category);
              if (categoryPlatforms.length === 0) return null;
              const categoryName = category === "ride-transport" ? "Ride & Transport" :
                category === "last-mile" ? "Last-Mile Delivery" :
                category === "courier" ? "Courier & Express" :
                category.charAt(0).toUpperCase() + category.slice(1);

              return (
                <div key={category} className="mb-4">
                  <p className="text-sm font-medium text-muted-foreground mb-2">{categoryName}</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {categoryPlatforms.map(platform => {
                      const isSelected = selectedPlatforms.includes(platform.id);
                      const isDisabled = !isSelected && selectedPlatforms.length >= platformLimit && selectedPlan !== "premium";

                      return (
                        <button
                          key={platform.id}
                          onClick={() => {
                            if (selectedPlan === "premium" || !isDisabled) {
                              togglePlatform(platform.id);
                            }
                          }}
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
                            disabled={isDisabled && selectedPlan !== "premium"}
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

            {/* Confirm Platform Selection Button */}
            <div className="mt-6 pt-4 border-t border-border">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium">
                    {selectedPlatforms.length === 0
                      ? "Select platforms to receive notifications"
                      : `${selectedPlatforms.length} platform${selectedPlatforms.length !== 1 ? "s" : ""} selected — you'll get notifications from these`}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    You can change your preferences anytime from Settings
                  </p>
                </div>
                <Button
                  onClick={savePlatformPreferences}
                  disabled={selectedPlatforms.length === 0 || isSavingPlatforms}
                  className={`w-full sm:w-auto ${
                    saveSuccess
                      ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                      : "bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold"
                  }`}
                >
                  {saveSuccess ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Saved!
                    </>
                  ) : isSavingPlatforms ? (
                    "Saving..."
                  ) : (
                    <>
                      <Bell className="w-4 h-4 mr-2" />
                      Confirm & Get Notifications
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Plans grid — shown after platform selection */}
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-amber-500" />
          {currentPlan === "free" ? "Want more platforms? Upgrade your plan" : "Change your plan"}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {plans.map((plan) => {
            const isCurrent = currentPlan === plan.id;
            const isHigher = isDowngrade(plan.id);

            return (
              <Card
                key={plan.id}
                className={`relative cursor-pointer transition-all bg-card ${
                  selectedPlan === plan.id
                    ? "ring-2 ring-amber-500/50 border-amber-500/50"
                    : ""
                } ${isCurrent ? "ring-1 ring-amber-500/30" : "hover:border-amber-500/20"}`}
                onClick={() => {
                  if (!isCurrent && !isHigher) {
                    setSelectedPlan(plan.id);
                    // Trim selected platforms if they exceed new plan limit
                    setSelectedPlatforms(prev => {
                      const limit = plan.platformLimit;
                      if (prev.length > limit) return prev.slice(0, limit);
                      return prev;
                    });
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
                    <Badge variant="outline" className="bg-background text-amber-500 border-amber-500/30">Current</Badge>
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
                    ) : isHigher ? (
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



        {/* Payment section — only for paid plan upgrades */}
        {selectedPlan && selectedPlan !== "free" && selectedPlan !== currentPlan && !isDowngrade(selectedPlan) && (
          <Card className="mb-8 border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-orange-500/5">
            <CardContent className="p-6">
              {/* Payment gateway warning */}
              {!paymentConfigured && (
                <div className="flex items-start gap-3 mb-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-amber-500">Payment system not configured</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Our payment gateway is being set up. Please try again later or contact support for manual activation.
                    </p>
                  </div>
                </div>
              )}
              {paymentGatewayStatus === "unavailable" && (
                <div className="flex items-start gap-3 mb-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <WifiOff className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-amber-500">Payment gateway may be blocked</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      The payment gateway script could not be loaded. This is usually caused by ad blockers or a slow connection.
                      Try disabling ad blockers for this site, or click the pay button to retry.
                    </p>
                  </div>
                </div>
              )}
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
                  {selectedPlatforms.length > 0 && (
                    <p className="text-xs text-amber-500 mt-1">
                      {selectedPlatforms.length} platform{selectedPlatforms.length !== 1 ? "s" : ""} will be enabled after payment
                    </p>
                  )}
                </div>
                <RazorpayCheckout
                  plan={selectedPlan as "starter" | "pro" | "premium"}
                  period="monthly"
                  currentPlan={currentPlan}
                  selectedPlatforms={selectedPlatforms}
                  onSuccess={() => {
                    fetchUser();
                    fetchExistingPlatforms();
                    savePlatformPreferences();
                  }}
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
              <Card key={faq.q} className="bg-card">
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
