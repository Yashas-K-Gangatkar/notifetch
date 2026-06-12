"use client";

import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Check,
  X,
  Zap,
  Crown,
  ArrowRight,
  Bell,
  BarChart3,
  Mic,
  Shield,
  Filter,
  Globe,
  LayoutGrid,
  Languages,
  Star,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { REGIONS, PRICING, formatCurrency, getCurrencySymbol } from "@/lib/data";
import { RazorpayCheckout } from "@/components/razorpay-checkout";

export function PricingSection() {
  const router = useRouter();
  const { data: session } = useSession();
  const [selectedRegion, setSelectedRegion] = useState("india");
  const pricing = PRICING[selectedRegion] || PRICING["india"];
  const region = REGIONS.find((r) => r.id === selectedRegion);

  const handleGetStarted = useCallback(() => {
    if (!session) {
      router.push("/auth/signin");
    } else {
      router.push("/dashboard");
    }
  }, [session, router]);

  return (
    <section id="pricing" className="py-16 sm:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">
            Simple{" "}
            <span className="bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
              Pricing
            </span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Start free, upgrade when you&apos;re ready to maximize earnings
          </p>

          {/* Region selector for pricing */}
          <div className="mt-6 flex items-center justify-center gap-3">
            <Globe className="w-4 h-4 text-muted-foreground" />
            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
              <SelectTrigger className="w-64 bg-card border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {REGIONS.map((r) => (
                  <SelectItem key={r.id} value={r.id}>
                    {r.flag} {r.name} ({getCurrencySymbol(r.currency)})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Free tier */}
          <Card className="bg-card border-border relative">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <Zap className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <CardTitle className="text-xl">Free</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Get started
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <span className="text-4xl font-bold">
                  {formatCurrency(pricing.free, pricing.currency)}
                </span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <Separator className="mb-4" />
              <ul className="space-y-3">
                {[
                  { text: "50 notifications/day", included: true },
                  { text: "1 platform connection", included: true },
                  { text: "Basic notification feed", included: true },
                  { text: "Sound alerts", included: true },
                  { text: "Earnings dashboard", included: false },
                  { text: "Auto-accept rules", included: false },
                  { text: "Voice alerts", included: false },
                  { text: "Smart order ranking", included: false },
                ].map((feature) => (
                  <li
                    key={feature.text}
                    className={`flex items-center gap-2 text-sm ${
                      feature.included
                        ? "text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {feature.included ? (
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    ) : (
                      <X className="w-4 h-4 text-muted-foreground/50 shrink-0" />
                    )}
                    {feature.text}
                  </li>
                ))}
              </ul>
              <Button
                variant="outline"
                onClick={handleGetStarted}
                className="w-full mt-6 h-11 border-border"
              >
                Get Started Free
              </Button>
            </CardContent>
          </Card>

          {/* Pro tier */}
          <Card className="bg-card border-amber-500/30 relative shadow-xl shadow-amber-500/10">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <Badge className="bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold px-4 py-1">
                <Star className="w-3 h-3 mr-1" />
                Most Popular
              </Badge>
            </div>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <Star className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <CardTitle className="text-xl">Pro</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    For active gig workers
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <span className="text-4xl font-bold">
                  {formatCurrency(pricing.pro, pricing.currency)}
                </span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <Separator className="mb-4" />
              <ul className="space-y-3">
                {[
                  { text: "Unlimited notifications", included: true },
                  { text: "5 platform connections", included: true },
                  { text: "Advanced notification feed", included: true },
                  { text: "Sound + vibration alerts", included: true },
                  { text: "Earnings dashboard", included: true },
                  { text: "Multi-region support", included: true },
                  { text: "Auto-accept rules", included: false },
                  { text: "Voice alerts", included: false },
                  { text: "Smart order ranking", included: false },
                ].map((feature) => (
                  <li
                    key={feature.text}
                    className={`flex items-center gap-2 text-sm ${
                      feature.included
                        ? "text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {feature.included ? (
                      <Check className="w-4 h-4 text-amber-500 shrink-0" />
                    ) : (
                      <X className="w-4 h-4 text-muted-foreground/50 shrink-0" />
                    )}
                    {feature.text}
                  </li>
                ))}
              </ul>
              {session ? (
                <RazorpayCheckout
                  plan="pro"
                  period="monthly"
                  currentPlan={(session.user as Record<string, unknown>).plan as string}
                  onSuccess={() => window.location.reload()}
                  className="w-full mt-6 h-11 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold shadow-lg shadow-amber-500/25"
                  label={`Upgrade to Pro — ${formatCurrency(pricing.pro, pricing.currency)}/mo`}
                />
              ) : (
                <Button
                  onClick={handleGetStarted}
                  className="w-full mt-6 h-11 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold shadow-lg shadow-amber-500/25"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Premium tier */}
          <Card className="bg-card border-orange-500/30 relative">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                  <Crown className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <CardTitle className="text-xl">Premium</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Maximum earnings
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <span className="text-4xl font-bold">
                  {formatCurrency(pricing.premium, pricing.currency)}
                </span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <Separator className="mb-4" />
              <ul className="space-y-3">
                {[
                  { text: "Unlimited notifications", included: true },
                  { text: "Unlimited platform connections", included: true },
                  { text: "Advanced notification feed", included: true },
                  { text: "Sound + vibration alerts", included: true },
                  { text: "Full earnings dashboard", included: true },
                  { text: "All 8 regions worldwide", included: true },
                  { text: "Auto-accept rules", included: true },
                  { text: "Voice alerts & announcements", included: true },
                  { text: "Smart order ranking (AI-powered)", included: true },
                  { text: "Priority support", included: true },
                ].map((feature) => (
                  <li
                    key={feature.text}
                    className="flex items-center gap-2 text-sm"
                  >
                    <Check className="w-4 h-4 text-orange-500 shrink-0" />
                    <span className="font-medium">{feature.text}</span>
                  </li>
                ))}
              </ul>
              {session ? (
                <RazorpayCheckout
                  plan="premium"
                  period="monthly"
                  currentPlan={(session.user as Record<string, unknown>).plan as string}
                  onSuccess={() => window.location.reload()}
                  variant="outline"
                  className="w-full mt-6 h-11 border-orange-500/50 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950 font-bold"
                  label={`Upgrade to Premium — ${formatCurrency(pricing.premium, pricing.currency)}/mo`}
                />
              ) : (
                <Button
                  onClick={handleGetStarted}
                  variant="outline"
                  className="w-full mt-6 h-11 border-orange-500/50 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950 font-bold"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Guarantee */}
        <div className="mt-12 text-center">
          <Card className="bg-card border-border inline-block">
            <CardContent className="p-6 flex items-center gap-3">
              <Shield className="w-8 h-8 text-amber-500" />
              <div className="text-left">
                <p className="font-semibold">30-Day Money-Back Guarantee</p>
                <p className="text-sm text-muted-foreground">
                  Not satisfied? Get a full refund, no questions asked.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
