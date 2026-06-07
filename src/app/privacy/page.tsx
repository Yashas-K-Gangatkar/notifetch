import type { Metadata } from "next";
import Link from "next/link";
import { Shield, ArrowLeft, Mail, Clock, Database, Eye, Lock, Globe, Cookie, UserCheck, Trash2, Download, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Privacy Policy - DeliveryBoost",
  description: "Learn how DeliveryBoost collects, uses, and protects your personal data.",
};

const sections = [
  {
    id: "data-collection",
    icon: Database,
    title: "1. Data We Collect",
    content: [
      {
        heading: "Information You Provide",
        items: [
          "Email address and phone number for account creation and communication",
          "Display name and profile preferences",
          "Payment information for premium subscriptions (processed securely by Stripe or Razorpay — we never store full card numbers)",
        ],
      },
      {
        heading: "Delivery Platform Tokens",
        items: [
          "OAuth tokens and session credentials you authorize to connect your delivery platform accounts (Uber Eats, DoorDash, Instacart, etc.)",
          "These tokens are stored encrypted and used solely to retrieve your order notifications and earnings data on your behalf",
        ],
      },
      {
        heading: "Automatically Collected Data",
        items: [
          "Location data (with your permission) to help prioritize nearby high-paying orders",
          "Device information (OS, browser type, screen size) for optimizing the app experience",
          "Push notification tokens (Firebase Cloud Messaging) to deliver real-time order alerts",
          "Usage analytics: pages visited, features used, session duration, and crash reports",
        ],
      },
      {
        heading: "Earnings & Order Data",
        items: [
          "Aggregated earnings data from connected platforms for your dashboard and analytics",
          "Order details (restaurant, payout, distance, tip) displayed in your real-time feed",
          "Historical earnings trends and performance metrics calculated from your data",
        ],
      },
    ],
  },
  {
    id: "how-data-used",
    icon: Eye,
    title: "2. How We Use Your Data",
    items: [
      "Provide, maintain, and improve the DeliveryBoost service including real-time notification aggregation",
      "Display your combined earnings dashboard and order feed across all connected platforms",
      "Send push notifications about new delivery opportunities matching your preferences",
      "Process premium subscription payments and manage your account",
      "Provide customer support and respond to your inquiries",
      "Analyze usage patterns to improve app performance, user experience, and develop new features",
      "Detect and prevent fraud, abuse, or security breaches",
      "Comply with legal obligations and enforce our Terms of Service",
    ],
  },
  {
    id: "third-party-sharing",
    icon: Globe,
    title: "3. Third-Party Sharing",
    items: [
      "We do NOT sell your personal data to third parties — ever",
      "Delivery platforms: We interact with Uber Eats, DoorDash, Instacart, and similar services solely through your authorized connections to retrieve your notifications and earnings data",
      "Payment processors: Stripe and Razorpay receive only the data necessary to process your subscription payments. We do not share full card details",
      "Push notification services: Firebase Cloud Messaging receives device tokens needed to deliver notifications",
      "Analytics providers: We may use privacy-focused analytics that do not sell or share your data",
      "Legal requirements: We may disclose data when required by law, subpoena, or to protect our rights and safety",
    ],
  },
  {
    id: "data-retention",
    icon: Clock,
    title: "4. Data Retention",
    items: [
      "Account data: Retained while your account is active and for 30 days after deletion to allow recovery",
      "Earnings data: Retained for the duration of your account to provide historical analytics. Deleted within 30 days of account deletion",
      "Platform tokens: Removed immediately upon disconnection of a delivery platform or account deletion",
      "Usage analytics: Anonymized after 90 days and retained in aggregate form only",
      "Payment records: Retained for 7 years as required by financial regulations",
      "You may request early deletion of any data subject to legal retention requirements",
    ],
  },
  {
    id: "user-rights",
    icon: UserCheck,
    title: "5. Your Rights",
    content: [
      {
        heading: "Access",
        items: [
          "You have the right to request a copy of all personal data we hold about you",
          "You can view most of your data directly through your account settings and dashboard",
        ],
      },
      {
        heading: "Deletion",
        items: [
          "You may request deletion of your account and all associated data at any time",
          "Account deletion removes your profile, platform connections, and preferences within 30 days",
          "Some data may be retained in anonymized or aggregate form where it cannot identify you",
        ],
      },
      {
        heading: "Export",
        items: [
          "You can export your earnings data and account information in a machine-readable format (JSON/CSV)",
          "Request an export through your account settings or by contacting us at legal@deliveryboost.app",
        ],
      },
      {
        heading: "Rectification",
        items: [
          "You can update your personal information at any time through your account settings",
          "Contact us if you believe any data we hold is inaccurate",
        ],
      },
    ],
  },
  {
    id: "gdpr",
    icon: Scale,
    title: "6. GDPR Compliance (EU Users)",
    items: [
      "Legal basis: We process your data based on (a) your consent, (b) contractual necessity to provide the service, (c) legitimate interests for security and improvement, or (d) legal obligations",
      "Right to object: You may object to processing based on legitimate interests at any time",
      "Right to restrict: You may request that we restrict certain processing of your data",
      "Data portability: You have the right to receive your data in a structured, commonly used format",
      "Right to withdraw consent: Where processing is based on consent, you may withdraw it at any time without affecting the lawfulness of prior processing",
      "Supervisory authority: You have the right to lodge a complaint with your local data protection authority",
      "Data Processing Agreement: We maintain DPAs with all third-party processors in compliance with GDPR Article 28",
    ],
  },
  {
    id: "ccpa",
    icon: UserCheck,
    title: "7. CCPA Compliance (California Users)",
    items: [
      "Right to know: You may request disclosure of the categories and specific pieces of personal information we collect, the purposes, and the third parties with whom data is shared",
      "Right to delete: You may request deletion of your personal information, subject to certain exceptions",
      "Right to opt-out of sale: We do NOT sell your personal information. No action is needed to opt out",
      "Right to non-discrimination: We will not discriminate against you for exercising any of your CCPA rights",
      "Categories of data collected: Identifiers (email, phone), commercial information (earnings, payment), internet activity (usage data), geolocation data, and professional information",
      "To exercise your CCPA rights, contact us at legal@deliveryboost.app or call 1-800-DELBOOST",
    ],
  },
  {
    id: "cookies",
    icon: Cookie,
    title: "8. Cookies & Tracking",
    items: [
      "Essential cookies: Used for authentication, session management, and security (cannot be disabled)",
      "Functional cookies: Store your preferences such as theme, notification settings, and platform connections",
      "Analytics cookies: Help us understand how users interact with the app so we can improve the experience",
      "We do NOT use advertising cookies or allow third-party ad tracking",
      "You can manage cookie preferences through your browser settings or our in-app privacy controls",
      "First-party cookies only: All cookies are set by DeliveryBoost and not by external advertising networks",
    ],
  },
  {
    id: "security",
    icon: Lock,
    title: "9. Security Measures",
    items: [
      "Encryption in transit: All data is encrypted using TLS 1.3 during transmission",
      "Encryption at rest: Sensitive data including platform tokens and payment information is encrypted using AES-256",
      "Access controls: Role-based access with principle of least privilege. Only authorized personnel can access user data",
      "Regular audits: We conduct quarterly security assessments and annual penetration testing",
      "Incident response: We maintain a comprehensive incident response plan with 72-hour breach notification to affected users",
      "Infrastructure: Hosted on secure cloud infrastructure with SOC 2 Type II compliance",
      "Token security: Delivery platform tokens are stored with individual encryption keys and rotated regularly",
      "No password storage: We use OAuth and third-party authentication providers — we never store plaintext passwords",
    ],
  },
  {
    id: "contact",
    icon: Mail,
    title: "10. Contact Us",
    items: [
      "For privacy inquiries, data requests, or to exercise your rights, contact:",
      "Email: legal@deliveryboost.app",
      "Response time: We will respond to all verified requests within 30 days (15 days for California residents under CCPA)",
      "Data Protection Officer: Available at dpo@deliveryboost.app for GDPR-related matters",
    ],
  },
];

export default function PrivacyPolicyPage() {
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
              <Shield className="w-4 h-4 text-white" />
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
            <Shield className="w-4 h-4" />
            Legal Document
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Your privacy matters to us. This policy explains how DeliveryBoost collects, uses, and protects your personal data when you use our service.
          </p>
          <p className="text-sm text-muted-foreground mt-3">
            Effective Date: <span className="font-semibold text-foreground">March 4, 2026</span>
            {" "}&middot; Last Updated: <span className="font-semibold text-foreground">March 4, 2026</span>
          </p>
        </div>

        {/* Quick Navigation */}
        <Card className="mb-10 border-border/50">
          <CardContent className="p-6">
            <h2 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">Quick Navigation</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    <Icon className="w-4 h-4 text-amber-500 shrink-0" />
                    {section.title}
                  </a>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Sections */}
        <div className="space-y-10">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <section key={section.id} id={section.id} className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-amber-500" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold">{section.title}</h2>
                </div>

                {"content" in section ? (
                  <div className="space-y-5 pl-0 sm:pl-12">
                    {section.content!.map((block, idx) => (
                      <div key={idx}>
                        <h3 className="font-semibold text-foreground mb-2">{block.heading}</h3>
                        <ul className="space-y-2">
                          {block.items.map((item, i) => (
                            <li key={i} className="flex gap-3 text-muted-foreground leading-relaxed">
                              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-amber-500/60 shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ) : (
                  <ul className="space-y-3 pl-0 sm:pl-12">
                    {"items" in section && section.items?.map((item, i) => (
                      <li key={i} className="flex gap-3 text-muted-foreground leading-relaxed">
                        <span className="mt-2 w-1.5 h-1.5 rounded-full bg-amber-500/60 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}

                <Separator className="mt-10 bg-border/50" />
              </section>
            );
          })}
        </div>

        {/* Bottom Contact Card */}
        <Card className="mt-12 bg-gradient-to-br from-amber-500/5 to-orange-600/5 border-amber-500/20">
          <CardContent className="p-6 text-center">
            <Mail className="w-8 h-8 text-amber-500 mx-auto mb-3" />
            <h3 className="font-bold text-lg mb-2">Questions About Your Privacy?</h3>
            <p className="text-muted-foreground mb-4">
              We&apos;re here to help. Reach out to our team for any privacy-related inquiries or to exercise your data rights.
            </p>
            <a href="mailto:legal@deliveryboost.app" className="text-amber-500 hover:text-amber-400 font-semibold transition-colors">
              legal@deliveryboost.app
            </a>
          </CardContent>
        </Card>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} DeliveryBoost. All rights reserved.
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
