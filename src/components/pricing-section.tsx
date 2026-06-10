"use client";

import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
  ArrowRight,
  Globe,
  Shield,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { REGIONS, getPricingForRegion, formatCurrency, getCurrencySymbol, type PlanTier } from "@/lib/data";

export function PricingSection() {
  const router = useRouter();
  const { data: session } = useSession();
  const [selectedRegion, setSelectedRegion] = useState("india");
  const plans = getPricingForRegion(selectedRegion);
  const region = REGIONS.find((r) => r.id === selectedRegion);

  const handleGetStarted = useCallback(() => {
    if (!session) {
      router.push("/auth/signin");
    } else {
      router.push("/dashboard");
    }
  }, [session, router]);

  const handleUpgrade = useCallback(() => {
    if (!session) {
      router.push("/auth/signin");
    } else {
      router.push("/dashboard/subscribe");
    }
  }, [session, router]);

  const getCardStyle = (plan: PlanTier) => {
    switch (plan.id) {
      case "starter":
        return "border-blue-500/30 shadow-lg shadow-blue-500/5";
      case "pro":
        return "border-amber-500/30 shadow-lg shadow-amber-500/5";
      case "premium":
        return "border-purple-500/30 shadow-xl shadow-purple-500/10";
      default:
        return "border-border";
    }
  };

  const getButtonStyle = (plan: PlanTier) => {
    switch (plan.id) {
      case "starter":
        return "bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold shadow-lg shadow-blue-500/25";
      case "pro":
        return "bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold shadow-lg shadow-amber-500/25";
      case "premium":
        return "bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white font-bold shadow-lg shadow-purple-500/25";
      default:
        return "border-border";
    }
  };

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
            Start free, upgrade when you&apos;re ready to maximize earnings worldwide
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

        {/* 4-column plan grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {plans.map((plan) => {
            const isPopular = plan.id === "pro";
            const currency = region?.currency || "USD";

            return (
              <Card
                key={plan.id}
                className={`bg-card relative ${getCardStyle(plan)}`}
              >
                {/* Popular badge */}
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="pb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-xl">
                      {plan.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">{plan.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {plan.description}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <span className="text-3xl font-bold">
                      {formatCurrency(plan.price, currency)}
                    </span>
                    <span className="text-muted-foreground">/month</span>
                    {plan.id !== "free" && (
                      <p className="text-xs text-amber-500 mt-1 font-medium">
                        {plan.unlimitedPlatforms
                          ? "Unlimited platforms"
                          : `Up to ${plan.platformLimit} platforms`}
                      </p>
                    )}
                  </div>
                </CardHeader>

                <CardContent>
                  <Separator className="mb-4" />
                  <ul className="space-y-2.5">
                    {plan.features.map((feature) => (
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

                  <div className="mt-6">
                    {plan.id === "free" ? (
                      <Button
                        variant="outline"
                        onClick={handleGetStarted}
                        className="w-full h-11"
                      >
                        Get Started Free
                      </Button>
                    ) : (
                      <Button
                        onClick={handleUpgrade}
                        className={`w-full h-11 ${getButtonStyle(plan)}`}
                      >
                        Upgrade to {plan.name}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
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
