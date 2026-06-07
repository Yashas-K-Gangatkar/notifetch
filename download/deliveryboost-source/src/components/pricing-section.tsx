"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
} from "lucide-react";

export function PricingSection() {
  return (
    <section id="pricing" className="py-16 sm:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
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
                    Get started with the basics
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <Separator className="mb-4" />
              <ul className="space-y-3">
                {[
                  {
                    icon: Bell,
                    text: "2 platform connections",
                    included: true,
                  },
                  {
                    icon: Filter,
                    text: "Basic notification feed",
                    included: true,
                  },
                  {
                    icon: Zap,
                    text: "Sound alerts",
                    included: true,
                  },
                  {
                    icon: Shield,
                    text: "Auto-accept rules",
                    included: false,
                  },
                  {
                    icon: BarChart3,
                    text: "Earnings dashboard",
                    included: false,
                  },
                  {
                    icon: Mic,
                    text: "Voice alerts",
                    included: false,
                  },
                  {
                    icon: Crown,
                    text: "Smart order ranking",
                    included: false,
                  },
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
                className="w-full mt-6 h-11 border-border"
              >
                Get Started Free
              </Button>
            </CardContent>
          </Card>

          {/* Premium tier */}
          <Card className="bg-card border-amber-500/30 relative shadow-xl shadow-amber-500/10">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <Badge className="bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold px-4 py-1">
                <Crown className="w-3 h-3 mr-1" />
                Most Popular
              </Badge>
            </div>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <Crown className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <CardTitle className="text-xl">Premium</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Unlock maximum earnings
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <span className="text-4xl font-bold">$9.99</span>
                <span className="text-muted-foreground">/month</span>
                <p className="text-xs text-amber-500 mt-1 font-medium">
                  7-day free trial included
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <Separator className="mb-4" />
              <ul className="space-y-3">
                {[
                  {
                    icon: Bell,
                    text: "Unlimited platform connections",
                    included: true,
                  },
                  {
                    icon: Filter,
                    text: "Advanced notification feed",
                    included: true,
                  },
                  {
                    icon: Zap,
                    text: "Sound + vibration alerts",
                    included: true,
                  },
                  {
                    icon: Shield,
                    text: "Auto-accept rules",
                    included: true,
                  },
                  {
                    icon: BarChart3,
                    text: "Full earnings dashboard",
                    included: true,
                  },
                  {
                    icon: Mic,
                    text: "Voice alerts & announcements",
                    included: true,
                  },
                  {
                    icon: Crown,
                    text: "Smart order ranking (AI-powered)",
                    included: true,
                  },
                ].map((feature) => (
                  <li
                    key={feature.text}
                    className="flex items-center gap-2 text-sm"
                  >
                    <Check className="w-4 h-4 text-amber-500 shrink-0" />
                    <span className="font-medium">{feature.text}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full mt-6 h-11 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold shadow-lg shadow-amber-500/25">
                Start 7-Day Free Trial
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <p className="text-xs text-muted-foreground text-center mt-2">
                Cancel anytime. No commitment.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* FAQ / Guarantee */}
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
