import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Shield, FileText, Scale, Mail, ExternalLink, Lock, Cookie, UserCheck, Clock, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Legal Hub - DeliveryBoost",
  description: "Access DeliveryBoost legal documents including Privacy Policy and Terms of Service.",
};

const legalDocuments = [
  {
    id: "privacy",
    title: "Privacy Policy",
    description: "Understand how DeliveryBoost collects, uses, and protects your personal data. Covers data collection, third-party sharing, GDPR & CCPA compliance, cookies, and your rights.",
    href: "/privacy",
    icon: Shield,
    highlights: [
      "Data we collect & how it's used",
      "Third-party sharing practices",
      "GDPR & CCPA compliance",
      "Your rights: access, delete, export",
      "Cookies & tracking policy",
      "Security measures",
    ],
  },
  {
    id: "terms",
    title: "Terms of Service",
    description: "Read the terms and conditions that govern your use of DeliveryBoost. Covers account responsibility, prohibited uses, payment terms, and dispute resolution.",
    href: "/terms",
    icon: FileText,
    highlights: [
      "Service description & disclaimer",
      "User accounts & responsibility",
      "Platform connections & authorization",
      "Payment terms & refund policy",
      "Limitation of liability",
      "Dispute resolution & arbitration",
    ],
  },
];

const complianceBadges = [
  { icon: Shield, label: "GDPR Compliant", description: "Full compliance with EU data protection regulations" },
  { icon: UserCheck, label: "CCPA Compliant", description: "California Consumer Privacy Act compliance" },
  { icon: Lock, label: "SOC 2 Type II", description: "Infrastructure meets rigorous security standards" },
  { icon: Cookie, label: "No Ad Tracking", description: "We never sell your data or use advertising cookies" },
];

export default function LegalHubPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <Scale className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-sm bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
              DeliveryBoost
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Title Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-sm font-medium mb-4">
            <Scale className="w-4 h-4" />
            Legal
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">Legal Hub</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Transparency is core to how we operate. Access all of our legal documents and compliance information below.
          </p>
          <p className="text-sm text-muted-foreground mt-3">
            Last Updated: <span className="font-semibold text-foreground">March 4, 2026</span>
          </p>
        </div>

        {/* Compliance Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
          {complianceBadges.map((badge) => {
            const Icon = badge.icon;
            return (
              <Card key={badge.label} className="border-border/50 text-center">
                <CardContent className="p-4">
                  <Icon className="w-6 h-6 text-amber-500 mx-auto mb-2" />
                  <p className="text-xs font-semibold mb-0.5">{badge.label}</p>
                  <p className="text-[11px] text-muted-foreground leading-tight">{badge.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Legal Documents */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {legalDocuments.map((doc) => {
            const Icon = doc.icon;
            return (
              <Link key={doc.id} href={doc.href} className="group">
                <Card className="h-full border-border/50 hover:border-amber-500/30 hover:bg-amber-500/[0.02] transition-all duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-amber-500" />
                      </div>
                      <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-amber-500 transition-colors" />
                    </div>
                    <CardTitle className="text-lg group-hover:text-amber-500 transition-colors">{doc.title}</CardTitle>
                    <CardDescription className="text-sm leading-relaxed">{doc.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      {doc.highlights.map((highlight, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span className="w-1 h-1 rounded-full bg-amber-500/60 shrink-0" />
                          {highlight}
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pt-3 border-t border-border/50">
                      <span className="text-sm font-medium text-amber-500 group-hover:text-amber-400 transition-colors flex items-center gap-1">
                        Read Full Document
                        <ExternalLink className="w-3 h-3" />
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Key Commitments */}
        <Card className="mb-10 border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-5">
              <BookOpen className="w-5 h-5 text-amber-500" />
              <h2 className="font-bold text-lg">Our Key Commitments</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: Lock, title: "We never sell your data", desc: "Your personal information is never sold to third parties for advertising or any other purpose." },
                { icon: Shield, title: "We don't store passwords", desc: "Platform connections use OAuth tokens only. We never see or store your delivery platform passwords." },
                { icon: UserCheck, title: "You own your data", desc: "You can access, export, or delete your data at any time. Full control is always in your hands." },
                { icon: Clock, title: "30-day data deletion", desc: "When you delete your account, all your data is permanently removed within 30 days." },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="flex gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="w-8 h-8 rounded-md bg-amber-500/10 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-amber-500" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{item.title}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Contact Section */}
        <Card className="bg-gradient-to-br from-amber-500/5 to-orange-600/5 border-amber-500/20">
          <CardContent className="p-6 text-center">
            <Mail className="w-8 h-8 text-amber-500 mx-auto mb-3" />
            <h3 className="font-bold text-lg mb-2">Legal Inquiries</h3>
            <p className="text-muted-foreground mb-4 max-w-md mx-auto">
              For legal questions, data requests, or to exercise your privacy rights, reach out to our legal team.
            </p>
            <div className="space-y-2">
              <a href="mailto:legal@deliveryboost.app" className="block text-amber-500 hover:text-amber-400 font-semibold transition-colors">
                legal@deliveryboost.app
              </a>
              <a href="mailto:dpo@deliveryboost.app" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Data Protection Officer: dpo@deliveryboost.app
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} DeliveryBoost, Inc. All rights reserved.
          </p>
          <div className="flex items-center justify-center gap-4 mt-3">
            <Link href="/privacy" className="text-sm text-amber-500 hover:text-amber-400 transition-colors">Privacy Policy</Link>
            <span className="text-muted-foreground">&middot;</span>
            <Link href="/terms" className="text-sm text-amber-500 hover:text-amber-400 transition-colors">Terms of Service</Link>
            <span className="text-muted-foreground">&middot;</span>
            <Link href="/legal" className="text-sm text-amber-500 hover:text-amber-400 transition-colors">Legal Hub</Link>
          </div>
        </footer>
      </main>
    </div>
  );
}
