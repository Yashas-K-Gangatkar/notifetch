"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Code, Rocket, Heart, Globe, Mail, Smartphone } from "lucide-react";
import { BackButton } from "@/components/back-button";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <BackButton fallback="/" />
            <h1 className="text-lg font-bold">About NotiFetch</h1>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="text-center mb-12">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-amber-500/25">
            <Rocket className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">About NotiFetch</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Founded and developed by Yashas K — built with passion for the gig economy workforce.
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><User className="w-5 h-5 text-amber-500" />Founder & Developer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3"><User className="w-5 h-5 text-muted-foreground mt-0.5" /><div><p className="font-medium">Yashas K</p><p className="text-sm text-muted-foreground">Founder & Developer</p></div></div>
              <div className="flex items-start gap-3"><Globe className="w-5 h-5 text-muted-foreground mt-0.5" /><div><p className="font-medium">Bengaluru, India</p><p className="text-sm text-muted-foreground">Location</p></div></div>
              <div className="flex items-start gap-3"><Code className="w-5 h-5 text-muted-foreground mt-0.5" /><div><p className="font-medium">Full-Stack Developer</p><p className="text-sm text-muted-foreground">Kotlin, TypeScript, Next.js, Prisma, Android</p></div></div>
              <div className="flex items-start gap-3"><Smartphone className="w-5 h-5 text-muted-foreground mt-0.5" /><div><p className="font-medium"><a href="https://play.google.com/store/apps/details?id=com.notifetch.app" target="_blank" rel="noopener noreferrer" className="text-amber-500 hover:underline">NotiFetch on Google Play</a></p><p className="text-sm text-muted-foreground">Download the app</p></div></div>
              <div className="flex items-start gap-3"><Mail className="w-5 h-5 text-muted-foreground mt-0.5" /><div><p className="font-medium">support@notifetch.app</p><p className="text-sm text-muted-foreground">Contact</p></div></div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader><CardTitle className="flex items-center gap-2"><Heart className="w-5 h-5 text-amber-500" />The Story</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>NotiFetch was founded by <strong className="text-foreground">Yashas K</strong> in 2026. As a developer based in Bengaluru, India, Yashas saw firsthand how delivery riders struggle to manage notifications from multiple gig apps simultaneously.</p>
              <p>When a rider runs 3-5 delivery apps at the same time, notifications constantly overwrite each other. A high-paying order from one app gets buried under a message from another, and by the time the rider sees it, the order is gone — along with the earning.</p>
              <p>Yashas built NotiFetch to solve this problem. Using Android&apos;s Notification Listener Service — a legitimate Google-provided API — NotiFetch captures all delivery notifications and aggregates them into a single, clean, real-time feed. No credentials needed, no API access, zero risk.</p>
              <p>Today, NotiFetch supports <strong className="text-foreground">119+ delivery platforms</strong> across <strong className="text-foreground">19 categories</strong> and <strong className="text-foreground">8 global regions</strong>. It&apos;s available on Google Play Store and has users across India, the US, UK, Europe, and Southeast Asia.</p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader><CardTitle className="flex items-center gap-2"><Rocket className="w-5 h-5 text-amber-500" />Mission</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">To be the universal delivery companion app for gig workers worldwide. Just as Spotify aggregates all music in one place, NotiFetch aggregates all delivery notifications in one feed. Our tagline: <strong className="text-foreground">&quot;One Feed. All Notifications. Zero Credentials.&quot;</strong></p>
          </CardContent>
        </Card>

        <Card className="border-amber-500/30">
          <CardContent className="py-4">
            <p className="text-xs text-muted-foreground text-center">
              <strong>Note:</strong> NotiFetch (the delivery notification aggregator app by Yashas K) is not affiliated with &quot;notifetch&quot; (the Linux command-line tool by Flammable-Duck on GitHub). These are two completely different projects by different developers.
            </p>
          </CardContent>
        </Card>

        <div className="mt-8 pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            © 2026 NotiFetch. Founded by <strong className="text-foreground">Yashas K</strong>. Built with passion for the gig economy.
          </p>
        </div>
      </main>
    </div>
  );
}
