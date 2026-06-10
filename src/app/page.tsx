"use client";

import { useState, useCallback, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero-section";
import { DashboardSection } from "@/components/dashboard-section";
import { EarningsSection } from "@/components/earnings-section";
import { PricingSection } from "@/components/pricing-section";
import { PlatformsSection } from "@/components/platforms-section";
import { SettingsSection } from "@/components/settings-section";
import { Separator } from "@/components/ui/separator";
import { Zap, Smartphone, Bell, Layers } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// ─── How It Works Section ────────────────────────────────────────────────────

function HowItWorksSection() {
  const steps = [
    {
      number: 1,
      title: "Install & Sign In",
      description:
        "Download the NotiFetch app on your Android phone and create your free account. Takes 30 seconds.",
      icon: Smartphone,
    },
    {
      number: 2,
      title: "Grant Notification Access",
      description:
        "Enable notification listener permission. NotiFetch reads your delivery alerts — no login credentials needed for any platform.",
      icon: Bell,
    },
    {
      number: 3,
      title: "One Feed, All Orders",
      description:
        "See orders from Swiggy, Zomato, Uber, Amazon Flex, and 28+ more in a single, real-time feed. Never miss an order again.",
      icon: Layers,
    },
  ];

  return (
    <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4">
          How NotiFetch Works
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Three simple steps to never miss a delivery order again. No API keys,
          no credentials, no complicated setup.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.number} className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/10 text-amber-500 text-xs font-bold mb-2">
                  {step.number}
                </div>
                <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Social Proof Section ────────────────────────────────────────────────────

function SocialProofSection() {
  const stats = [
    { value: "28+", label: "Platforms Supported" },
    { value: "30s", label: "Setup Time" },
    { value: "0", label: "Credentials Required" },
    { value: "24/7", label: "Real-time Alerts" },
  ];

  return (
    <section
      id="social-proof"
      className="py-16 px-4 sm:px-6 lg:px-8 border-y border-border"
    >
      <div className="max-w-5xl mx-auto text-center">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="text-3xl font-bold text-amber-500">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground">
          Trusted by delivery partners across India using Swiggy, Zomato,
          Blinkit, Zepto, Uber, and more.
        </p>
      </div>
    </section>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Home() {
  const [activeSection, setActiveSection] = useState("hero");

  // Track which section is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -40% 0px" }
    );

    const sections = document.querySelectorAll("section[id]");
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const handleNavigate = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar activeSection={activeSection} onNavigate={handleNavigate} />

      <main className="flex-1">
        <HeroSection onNavigate={handleNavigate} />
        <Separator className="max-w-7xl mx-auto" />

        {/* How It Works — 3-step section */}
        <HowItWorksSection />
        <Separator className="max-w-7xl mx-auto" />

        <DashboardSection onAccept={() => {}} onDecline={() => {}} acceptedOrders={[]} />
        <Separator className="max-w-7xl mx-auto" />

        <EarningsSection acceptedOrders={[]} />
        <Separator className="max-w-7xl mx-auto" />

        <PlatformsSection />
        <Separator className="max-w-7xl mx-auto" />

        {/* Social Proof — trust stats before pricing */}
        <SocialProofSection />

        <PricingSection />
        <Separator className="max-w-7xl mx-auto" />

        <SettingsSection />
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
                NotiFetch
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} NotiFetch. One Feed. All
              Notifications. Zero Credentials.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
