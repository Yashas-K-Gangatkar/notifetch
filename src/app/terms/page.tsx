import type { Metadata } from "next";
import Link from "next/link";
import { FileText, ArrowLeft, Mail, Scale, Users, CreditCard, AlertTriangle, Ban, ShieldCheck, Briefcase, Gavel, Handshake, XCircle, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Terms of Service - NotiFetch",
  description: "Read the Terms of Service for NotiFetch — understand your rights and responsibilities when using our platform.",
};

const sections = [
  {
    id: "acceptance",
    icon: Handshake,
    title: "1. Acceptance of Terms",
    items: [
      'By accessing or using the NotiFetch application ("Service"), you agree to be bound by these Terms of Service ("Terms")',
      "If you do not agree to these Terms, you may not access or use the Service",
      "We reserve the right to modify these Terms at any time. Continued use of the Service after changes constitutes acceptance of the updated Terms",
      "We will notify users of material changes via email or in-app notification at least 30 days before they take effect",
      "These Terms constitute a legally binding agreement between you and NotiFetch, Inc.",
    ],
  },
  {
    id: "description",
    icon: Briefcase,
    title: "2. Description of Service",
    items: [
      "NotiFetch is a notification reading and earnings analytics app for delivery drivers and gig workers",
      "NotiFetch reads delivery notifications from your phone using Android's NotificationListenerService. It does NOT access delivery platform APIs, ask for login credentials, or interact with delivery platforms in any way",
      "NotiFetch is NOT a delivery platform. We do not dispatch orders, assign deliveries, or employ drivers",
      "We read and display notifications that your phone already receives — we do not create, modify, or fulfill delivery orders",
      "Premium features include advanced analytics, priority notifications, multi-platform earnings comparison, and historical trend reports",
    ],
  },
  {
    id: "user-accounts",
    icon: Users,
    title: "3. User Accounts & Responsibility",
    items: [
      "You must be at least 18 years old (or the age of majority in your jurisdiction) to create an account",
      "You are responsible for maintaining the confidentiality of your account credentials",
      "You must provide accurate and complete information when creating your account",
      "You are responsible for all activities that occur under your account",
      "You must notify us immediately of any unauthorized use of your account at security@notifetch.app",
      "We reserve the right to suspend or terminate accounts that violate these Terms",
      "One person may maintain only one active NotiFetch account",
    ],
  },
  {
    id: "notification-listening",
    icon: Building2,
    title: "4. Notification Listening",
    items: [
      "NotiFetch reads notifications from your device using Android's NotificationListenerService API. You must grant explicit notification listener permission for this feature to work",
      "No credentials are shared with NotiFetch. We never ask for your delivery platform passwords, login information, or OAuth tokens. We simply read notifications your phone already receives",
      "No platform APIs are accessed. NotiFetch does NOT connect to, communicate with, or access any delivery platform's servers, APIs, or services in any way",
      "You may revoke notification listener permission at any time through your Android device settings. Revoking this permission will disable NotiFetch's core functionality",
      "NotiFetch is NOT affiliated with, endorsed by, or connected to any delivery platform. We simply read notifications that your phone already receives",
      "You are solely responsible for ensuring your use of NotiFetch complies with the terms of each delivery app installed on your device",
    ],
  },
  {
    id: "prohibited-uses",
    icon: Ban,
    title: "5. Prohibited Uses",
    items: [
      "Using the Service for any unlawful purpose or in violation of any applicable laws or regulations",
      "Attempting to gain unauthorized access to other users' accounts or our systems",
      "Using automated scripts, bots, or scraping tools to access the Service beyond what is provided through our API",
      "Reverse engineering, decompiling, or disassembling any part of the Service",
      "Impersonating any person or entity, or falsely representing your affiliation with any person or entity",
      "Interfering with or disrupting the Service, servers, or networks connected to the Service",
      "Using the Service to spam, harass, or harm other users",
      "Selling, reselling, or redistributing the Service or data derived from it without express written permission",
      "Using the Service in a manner that could damage, disable, or impair any delivery platform's operations",
      "Using NotiFetch in any way that violates the notification listener permissions granted by the user",
    ],
  },
  {
    id: "payment",
    icon: CreditCard,
    title: "6. Payment Terms",
    content: [
      {
        heading: "Premium Subscription",
        items: [
          "NotiFetch offers a free tier and a premium subscription with additional features",
          "Premium subscription pricing is displayed on our pricing page and may be updated with 30 days' notice",
          "Subscriptions are billed in advance on a monthly or annual basis, depending on your selected plan",
          "Payment is processed securely through Stripe or Razorpay. We do not store your full credit card information",
        ],
      },
      {
        heading: "Refunds",
        items: [
          "We offer a 14-day money-back guarantee for new premium subscribers",
          "After the 14-day period, subscriptions are non-refundable but you may cancel at any time",
          "Upon cancellation, you will retain access to premium features until the end of your current billing period",
          "Partial refunds for annual plans may be considered on a case-by-case basis — contact support@notifetch.app",
        ],
      },
      {
        heading: "Free Trial",
        items: [
          "We may offer free trial periods for premium features from time to time",
          "Trials convert to paid subscriptions at the end of the trial period unless cancelled before the trial expires",
          "You will receive email reminders before your trial expires",
        ],
      },
    ],
  },
  {
    id: "intellectual-property",
    icon: Scale,
    title: "7. Intellectual Property",
    items: [
      'The Service and its original content (excluding user-provided data), features, and functionality are owned by NotiFetch, Inc. and are protected by international copyright, trademark, and other intellectual property laws',
      'Our trademarks and trade dress, including the "NotiFetch" name, logo, and app design, may not be used without prior written consent',
      "You retain ownership of all data you provide, including your earnings data and notification information",
      "We retain ownership of aggregated, anonymized analytics derived from usage patterns that cannot identify individual users",
      "You grant us a limited, non-exclusive license to process your data solely for the purpose of providing the Service",
    ],
  },
  {
    id: "liability",
    icon: AlertTriangle,
    title: "8. Limitation of Liability",
    items: [
      "TO THE MAXIMUM EXTENT PERMITTED BY LAW, NOTIFETCH SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES",
      "Our total liability for any claim arising from or related to the Service shall not exceed the amount you paid us in the 12 months preceding the claim",
      "We are not liable for any loss of earnings, missed deliveries, or account issues on delivery apps installed on your device",
      "We are not liable for any downtime, service interruptions, or data loss caused by circumstances beyond our reasonable control",
      "We do not guarantee the accuracy of earnings calculations, which are derived from notifications received on your device and may contain discrepancies",
      "We are not responsible for the actions, policies, or changes of any delivery platform",
    ],
  },
  {
    id: "disclaimer",
    icon: ShieldCheck,
    title: "9. Disclaimer",
    items: [
      'THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED',
      "We do not warrant that the Service will be uninterrupted, error-free, or free of harmful components",
      "We are NOT a delivery platform. NotiFetch is an independent notification reading and analytics tool that reads notifications already on your device",
      "We do not guarantee specific earnings, delivery volumes, or acceptance rates as a result of using our Service",
      "Any reliance on information provided through the Service is at your own risk",
      "No advice or information obtained from NotiFetch shall create any warranty not expressly stated in these Terms",
    ],
  },
  {
    id: "indemnification",
    icon: Gavel,
    title: "10. Indemnification",
    items: [
      "You agree to indemnify, defend, and hold harmless NotiFetch, its officers, directors, employees, agents, and affiliates from any claims, liabilities, damages, losses, or expenses arising from your use of the Service",
      "This includes claims arising from your violation of these Terms, your violation of any rights of another party, or any content you submit or transmit through the Service",
      "We reserve the right to assume exclusive defense of any matter subject to indemnification, and you shall cooperate with our defense",
    ],
  },
  {
    id: "termination",
    icon: XCircle,
    title: "11. Termination",
    items: [
      "You may terminate your account at any time by contacting us or through your account settings",
      "We may terminate or suspend your account immediately, without prior notice, for conduct that we determine violates these Terms or is harmful to other users, us, or third parties",
      "Upon termination, your right to use the Service will immediately cease",
      "Provisions of these Terms that by their nature should survive termination shall survive, including without limitation: intellectual property, disclaimer, limitation of liability, and indemnification",
      "We will retain your data for 30 days after account deletion to allow for recovery, after which it will be permanently deleted subject to our Privacy Policy",
    ],
  },
  {
    id: "dispute-resolution",
    icon: Gavel,
    title: "12. Dispute Resolution",
    items: [
      "You agree to attempt to resolve any dispute informally by contacting us at legal@notifetch.app for at least 30 days before filing any legal claim",
      "If informal resolution fails, you agree that all disputes shall be resolved by binding arbitration administered by the American Arbitration Association (AAA) under its Consumer Arbitration Rules",
      "Arbitration shall be conducted in San Francisco, California, or at another mutually agreed location, and may be conducted remotely via video conference",
      "You may opt out of arbitration within 30 days of accepting these Terms by sending written notice to legal@notifetch.app",
      "Either party may seek injunctive relief in any court of competent jurisdiction for breach of intellectual property or confidentiality obligations",
      "You waive any right to participate in a class action lawsuit or class-wide arbitration",
    ],
  },
  {
    id: "governing-law",
    icon: Scale,
    title: "13. Governing Law",
    items: [
      "These Terms shall be governed by and construed in accordance with the laws of the State of California, United States, without regard to its conflict of law provisions",
      "Any disputes not subject to arbitration shall be resolved in the state or federal courts located in San Francisco County, California",
      "If any provision of these Terms is found to be unenforceable, the remaining provisions will remain in full force and effect",
      "Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights",
      "If you are accessing the Service from outside the United States, you are responsible for compliance with applicable local laws",
    ],
  },
  {
    id: "contact-tos",
    icon: Mail,
    title: "14. Contact Us",
    items: [
      "For questions about these Terms of Service, please contact us at:",
      "Email: legal@notifetch.app",
      "General support: support@notifetch.app",
      "Security concerns: security@notifetch.app",
      "NotiFetch, Inc. reserves the right to update these Terms as described in Section 1.",
    ],
  },
];

export default function TermsOfServicePage() {
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
              <FileText className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-sm bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
              NotiFetch
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Title Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-sm font-medium mb-4">
            <FileText className="w-4 h-4" />
            Legal Document
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Please read these Terms of Service carefully before using NotiFetch. By using our service, you agree to these terms.
          </p>
          <p className="text-sm text-muted-foreground mt-3">
            Effective Date: <span className="font-semibold text-foreground">March 4, 2026</span>
            {" "}&middot; Last Updated: <span className="font-semibold text-foreground">March 4, 2026</span>
          </p>
        </div>

        {/* Important Notice */}
        <Card className="mb-10 border-amber-500/20 bg-amber-500/5">
          <CardContent className="p-6">
            <div className="flex gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold mb-1">Important Notice</h3>
                <p className="text-sm text-muted-foreground">
                  NotiFetch reads delivery notifications from your phone using Android's NotificationListenerService — 
                  we are NOT a delivery platform. We do not access delivery platform APIs, ask for login credentials, 
                  dispatch orders, employ drivers, or process deliveries. We simply read notifications your phone already receives.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

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
            <h3 className="font-bold text-lg mb-2">Questions About These Terms?</h3>
            <p className="text-muted-foreground mb-4">
              If you have any questions about these Terms of Service, our team is happy to help clarify.
            </p>
            <a href="mailto:legal@notifetch.app" className="text-amber-500 hover:text-amber-400 font-semibold transition-colors">
              legal@notifetch.app
            </a>
          </CardContent>
        </Card>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} NotiFetch, Inc. All rights reserved.
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
