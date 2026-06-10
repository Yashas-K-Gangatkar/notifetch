"use client";

import { useSession } from "next-auth/react";
import { Zap, Bell, Shield, ArrowRight, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PLATFORMS, DELIVERY_CATEGORIES, REGIONS } from "@/lib/data";

export function HeroSection({ onNavigate }: { onNavigate: (id: string) => void }) {
  const { data: session } = useSession();

  return (
    <section id="hero" className="relative min-h-[90vh] flex items-center justify-center px-4 py-20 overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-orange-500/5 to-transparent" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm mb-8">
          <Zap className="w-4 h-4" />
          <span>{PLATFORMS.length}+ platforms · {DELIVERY_CATEGORIES.length} categories · {REGIONS.length} regions</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6">
          <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 bg-clip-text text-transparent">
            One Feed.
          </span>
          <br />
          <span className="text-foreground">All Notifications.</span>
          <br />
          <span className="text-muted-foreground">Zero Credentials.</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
          Aggregate all your delivery partner notifications into a single real-time feed.
          Track earnings, manage orders, and stay on top of every platform — no API access needed.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          {session ? (
            <Link href="/dashboard">
              <Button size="lg" className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold px-8 h-12">
                Go to Dashboard
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          ) : (
            <Link href="/auth/signin">
              <Button size="lg" className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold px-8 h-12">
                Get Started Free
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          )}
          <a
            href="https://play.google.com/store/apps/details?id=com.notifetch.app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" size="lg" className="px-8 h-12 gap-2">
              <Download className="w-4 h-4" />
              Download App
            </Button>
          </a>
          <Button variant="ghost" size="lg" onClick={() => onNavigate("platforms")} className="px-8 h-12">
            See All Platforms
          </Button>
        </div>

        {/* Trust indicators */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>No credentials stored</span>
          </div>
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-amber-400" />
            <span>Notification-based only</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-orange-400" />
            <span>Works with 30+ apps</span>
          </div>
        </div>
      </div>
    </section>
  );
}
