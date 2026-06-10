"use client";

import { BackButton } from "@/components/back-button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Handshake,
  Smartphone,
  ShieldOff,
  UserCheck,
  Bookmark,
  CheckCircle,
  Ban,
  Eye,
  KeyRound,
  Scale,
  AlertTriangle,
  Shield,
  XCircle,
  Trash2,
  Gavel,
  MapPin,
  RefreshCw,
  Mail,
  Layers,
  FileText,
  AlertOctagon,
  ExternalLink,
} from "lucide-react";

const LAST_UPDATED = "June 9, 2026";

const tocSections = [
  { id: "acceptance", number: "1", title: "Acceptance of Terms", icon: Handshake },
  { id: "description", number: "2", title: "Description of Service", icon: Smartphone },
  { id: "no-affiliation", number: "3", title: "No Affiliation with Delivery Platforms", icon: ShieldOff },
  { id: "user-responsibility", number: "4", title: "User Responsibility for Platform ToS Compliance", icon: UserCheck },
  { id: "nominative-fair-use", number: "5", title: "Nominative Fair Use Notice", icon: Bookmark },
  { id: "acceptable-use", number: "6", title: "Acceptable Use", icon: CheckCircle },
  { id: "prohibited-uses", number: "7", title: "Prohibited Uses", icon: Ban },
  { id: "user-data-privacy", number: "8", title: "User Data and Privacy", icon: Eye },
  { id: "consent-permissions", number: "9", title: "Consent and Permissions", icon: KeyRound },
  { id: "intellectual-property", number: "10", title: "Intellectual Property", icon: Scale },
  { id: "limitation-liability", number: "11", title: "Limitation of Liability", icon: AlertTriangle },
  { id: "indemnification", number: "12", title: "Indemnification", icon: Shield },
  { id: "disclaimers", number: "13", title: "Disclaimers", icon: AlertOctagon },
  { id: "account-termination", number: "14", title: "Account Termination", icon: XCircle },
  { id: "data-deletion", number: "15", title: "Data Deletion Rights", icon: Trash2 },
  { id: "governing-law", number: "16", title: "Governing Law", icon: MapPin },
  { id: "dispute-resolution", number: "17", title: "Dispute Resolution", icon: Gavel },
  { id: "changes-to-terms", number: "18", title: "Changes to Terms", icon: RefreshCw },
  { id: "contact-info", number: "19", title: "Contact Information", icon: Mail },
  { id: "severability", number: "20", title: "Severability", icon: Layers },
];

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Fixed Top Nav */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center gap-3">
          <BackButton fallback="/" />
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <h1 className="font-bold text-sm sm:text-base truncate">Terms of Service</h1>
          </div>
          <Badge variant="secondary" className="ml-auto text-[10px] sm:text-xs shrink-0">
            Last Updated: {LAST_UPDATED}
          </Badge>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1">
        {/* Title Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-sm font-medium mb-4">
            <FileText className="w-4 h-4" />
            Legal Document
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">Terms of Service</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Please read these Terms of Service carefully before using NotiFetch. By accessing or using our
            application, you acknowledge that you have read, understood, and agree to be bound by these Terms.
            If you do not agree, you must discontinue use of the Service immediately.
          </p>
          <p className="text-sm text-muted-foreground mt-3">
            Effective Date: <span className="font-semibold text-foreground">June 9, 2026</span>
            {" "}&middot; Last Updated: <span className="font-semibold text-foreground">{LAST_UPDATED}</span>
          </p>
        </div>

        {/* CRITICAL: No Affiliation Banner */}
        <Alert className="mb-8 border-red-500/30 bg-red-500/5 dark:border-red-500/40 dark:bg-red-500/10">
          <ShieldOff className="h-5 w-5 text-red-600 dark:text-red-400" />
          <AlertTitle className="text-red-700 dark:text-red-300 font-bold text-base">
            CRITICAL DISCLAIMER — NO AFFILIATION WITH DELIVERY PLATFORMS
          </AlertTitle>
          <AlertDescription className="text-red-700/80 dark:text-red-300/80 space-y-2">
            <p>
              NotiFetch is <strong>NOT affiliated with, endorsed by, authorized by, or connected to</strong> any
              delivery platform, including but not limited to Swiggy, Zomato, Uber Eats, DoorDash, Grubhub,
              Postmates, Deliveroo, Dunzo, Blinkit, Zepto, or any other food delivery, grocery delivery, or
              logistics platform.
            </p>
            <p>
              NotiFetch does <strong>NOT access any delivery platform&apos;s APIs, servers, databases, or services</strong>.
              It does not store credentials, authentication tokens, or login information. It is an independent,
              third-party personal notification management tool that reads notifications already displayed on
              the user&apos;s own Android device through the operating system&apos;s NotificationListenerService API.
            </p>
            <p className="font-semibold">
              Any display of platform names or logos within NotiFetch is done under nominative fair use solely
              for identification purposes and does not imply any partnership, sponsorship, or endorsement.
            </p>
          </AlertDescription>
        </Alert>

        {/* Table of Contents */}
        <Card className="mb-10">
          <CardContent className="p-6">
            <h2 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">
              Table of Contents
            </h2>
            <nav>
              <ol className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {tocSections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <li key={section.id}>
                      <a
                        href={`#${section.id}`}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      >
                        <Icon className="w-4 h-4 text-amber-500 shrink-0" />
                        <span className="font-medium text-foreground/70 mr-1">{section.number}.</span>
                        {section.title}
                      </a>
                    </li>
                  );
                })}
              </ol>
            </nav>
          </CardContent>
        </Card>

        {/* Sections */}
        <div className="space-y-8">
          {/* 1. Acceptance of Terms */}
          <Card id="acceptance" className="scroll-mt-20">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                  <Handshake className="w-5 h-5 text-amber-500" />
                </div>
                <h2 className="text-xl font-bold">1. Acceptance of Terms</h2>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  By downloading, installing, accessing, or using the NotiFetch mobile application
                  (&quot;Service&quot; or &quot;App&quot;), you affirm that you have read, understood, and agree to be
                  legally bound by these Terms of Service (&quot;Terms&quot;), our Privacy Policy available at
                  https://notifetch.app/privacy, and all applicable laws and regulations. These
                  Terms constitute a legally binding agreement between you (&quot;User,&quot; &quot;you,&quot; or &quot;your&quot;) and
                  NotiFetch (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;).
                </p>
                <p>
                  If you do not agree to these Terms in their entirety, you are expressly prohibited from
                  accessing or using the Service and must uninstall the application from your device
                  immediately. Your continued use of the Service following the publication of any
                  modifications to these Terms shall constitute your unconditional acceptance of such
                  changes.
                </p>
                <p>
                  You represent and warrant that you are at least 18 years of age (or the age of legal
                  majority in your jurisdiction) and possess the legal capacity to enter into these Terms.
                  If you are using the Service on behalf of an entity, you further represent and warrant
                  that you have the authority to bind that entity to these Terms.
                </p>
                <p>
                  These Terms are effective as of the date of your first use of the Service and remain in
                  effect until terminated by either party in accordance with the provisions herein. We
                  reserve the right to refuse access to the Service to any person for any reason at any
                  time, subject to applicable law.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 2. Description of Service */}
          <Card id="description" className="scroll-mt-20">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                  <Smartphone className="w-5 h-5 text-amber-500" />
                </div>
                <h2 className="text-xl font-bold">2. Description of Service</h2>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  NotiFetch is a personal notification management and earnings analytics tool designed for
                  delivery partners and gig workers. The Service operates by utilizing Android&apos;s
                  NotificationListenerService API to read and organize notifications that the user&apos;s device
                  has already received from delivery partner applications installed on the same device.
                  NotiFetch does not create, modify, intercept, or redirect any notifications — it merely
                  presents and organizes the notification content that the user has already received and can
                  view in their device&apos;s notification shade.
                </p>
                <p>
                  The core functionality of NotiFetch is limited to reading notifications from specific,
                  pre-identified delivery partner application packages on the user&apos;s Android device.
                  NotiFetch <strong>only reads notifications from designated delivery partner packages</strong>{" "}
                  — it <strong>never reads, accesses, or processes notifications</strong> from banking
                  applications, social media platforms, messaging applications, healthcare applications, or
                  any other personal, financial, or sensitive applications on the user&apos;s device. This
                  package-scoped access is a fundamental architectural constraint enforced at the code level
                  and cannot be overridden by the user or by any third party.
                </p>
                <p>
                  NotiFetch does <strong>not</strong> access, connect to, or communicate with any delivery
                  platform&apos;s APIs, servers, web services, or backend systems. It does not transmit any
                  data to, or receive any data from, any delivery platform. NotiFetch does not authenticate
                  on behalf of the user with any delivery platform, does not store any credentials, auth
                  tokens, session cookies, or login information, and does not perform any action on any
                  delivery platform&apos;s system or application.
                </p>
                <p>
                  The Service provides users with a consolidated, organized view of their delivery-related
                  notifications, along with optional analytics and earnings tracking features. Premium plans
                  offer advanced features such as historical trend analysis, multi-platform earnings
                  comparison, and priority notification display. Free and paid plans are available, with
                  payments processed through Razorpay (for users in India) and Stripe (for international
                  users).
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 3. No Affiliation with Delivery Platforms — VERY PROMINENT */}
          <Card id="no-affiliation" className="scroll-mt-20 border-2 border-red-500/40 dark:border-red-500/50 shadow-lg shadow-red-500/5">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-lg bg-red-500/15 flex items-center justify-center shrink-0">
                  <ShieldOff className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">3. No Affiliation with Delivery Platforms</h2>
                  <Badge variant="destructive" className="mt-1 text-[10px]">CRITICAL SECTION</Badge>
                </div>
              </div>

              <div className="bg-red-500/5 dark:bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-5">
                <p className="font-bold text-red-700 dark:text-red-300 text-base">
                  IMPORTANT: Please read this section carefully. It defines the legal relationship between
                  NotiFetch and delivery platforms, and limits our liability with respect to those platforms.
                </p>
              </div>

              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  NotiFetch is an <strong>independent, third-party software application</strong> developed
                  and operated solely by NotiFetch. NotiFetch is <strong>not affiliated with, endorsed by,
                  sponsored by, authorized by, or connected to</strong> any delivery platform, food delivery
                  service, grocery delivery service, logistics company, or ride-hailing platform, including
                  but not limited to Swiggy, Zomato, Uber, Uber Eats, DoorDash, Grubhub, Postmates,
                  Deliveroo, Dunzo, Blinkit, Zepto, Instacart, Amazon Flex, or any subsidiary, affiliate,
                  or related entity thereof.
                </p>
                <p>
                  No delivery platform has endorsed, approved, sponsored, or authorized NotiFetch, and
                  NotiFetch has not sought, received, or requires any such endorsement, approval,
                  sponsorship, or authorization. The use of any delivery platform&apos;s name, trademark, service
                  mark, or logo within the NotiFetch application is done strictly under the doctrine of
                  nominative fair use for the sole purpose of identifying the source of notifications
                  displayed to the user, as further described in Section 5 (Nominative Fair Use Notice).
                </p>
                <p>
                  NotiFetch does <strong>not access, interact with, or interface with</strong> any delivery
                  platform&apos;s proprietary systems, including but not limited to their APIs, web services,
                  backend servers, databases, or authentication systems. NotiFetch does not act as an agent,
                  intermediary, or representative of any delivery platform. NotiFetch does not dispatch,
                  assign, accept, reject, modify, or fulfill any delivery orders on any platform. NotiFetch
                  is not a delivery platform itself and does not employ, contract with, or compensate any
                  delivery partner or driver.
                </p>
                <p>
                  Any resemblance between NotiFetch&apos;s features and the features of any delivery platform
                  is purely coincidental and does not imply any partnership, joint venture, or agency
                  relationship. Users must not represent or imply to any third party that NotiFetch is
                  affiliated with or endorsed by any delivery platform. Any claims, disputes, or issues
                  arising from or related to any delivery platform must be directed to the respective
                  platform and not to NotiFetch.
                </p>
                <p>
                  This disclaimer is made in compliance with applicable laws, including the principles of
                  trademark fair use, and is intended to prevent any confusion regarding the nature of the
                  relationship between NotiFetch and any delivery platform. NotiFetch acknowledges that all
                  delivery platform names, trademarks, service marks, and logos referenced in the application
                  are the exclusive property of their respective owners.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 4. User Responsibility for Platform ToS Compliance */}
          <Card id="user-responsibility" className="scroll-mt-20 border-2 border-amber-500/40">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                  <UserCheck className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">4. User Responsibility for Platform ToS Compliance</h2>
                  <Badge className="mt-1 bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/20 text-[10px] hover:bg-amber-500/20">
                    USER LIABILITY
                  </Badge>
                </div>
              </div>

              <div className="bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 mb-5">
                <p className="font-bold text-amber-700 dark:text-amber-300 text-sm">
                  YOU ARE SOLELY RESPONSIBLE for ensuring that your use of NotiFetch complies with the Terms
                  of Service of every delivery platform you use. NotiFetch cannot and does not guarantee that
                  using our Service will not violate any platform&apos;s terms.
                </p>
              </div>

              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  As a user of NotiFetch, you acknowledge and agree that you bear <strong>sole and exclusive
                  responsibility</strong> for ensuring that your use of the NotiFetch application complies
                  with the Terms of Service, Community Guidelines, Partner Agreements, and any other
                  policies or agreements (collectively, &quot;Platform Terms&quot;) of each and every delivery
                  platform whose notifications are read or displayed by NotiFetch. NotiFetch does not
                  monitor, review, or assess whether its features or functionality are compatible with, or
                  compliant with, any delivery platform&apos;s Terms of Service.
                </p>
                <p>
                  NotiFetch makes <strong>no representation, warranty, or guarantee</strong> that using its
                  Service will not result in a violation of any delivery platform&apos;s Terms of Service, or
                  that any delivery platform will permit, tolerate, or not take action against users who use
                  NotiFetch. Some delivery platforms may prohibit the use of third-party applications that
                  read or process their notifications, and it is your duty to review and understand each
                  platform&apos;s policies before using NotiFetch in conjunction with that platform.
                </p>
                <p>
                  If any delivery platform takes adverse action against you — including but not limited to
                  account suspension, account termination, reduction in order assignments, deactivation, or
                  any other disciplinary measure — as a result of your use of NotiFetch, you acknowledge
                  that <strong>NotiFetch shall have no liability whatsoever</strong> for such action. You
                  expressly waive any claim against NotiFetch arising from or related to any delivery
                  platform&apos;s enforcement of its own Terms of Service against you.
                </p>
                <p>
                  You are strongly advised to review the Terms of Service of every delivery platform
                  application installed on your device before granting NotiFetch notification access. If you
                  are uncertain whether NotiFetch&apos;s functionality is permitted by a particular platform&apos;s
                  terms, you should not use NotiFetch in connection with that platform, or you should seek
                  clarification from the platform directly. NotiFetch shall not be liable for any loss of
                  earnings, account access, or platform privileges resulting from your use of the Service.
                </p>
                <p>
                  This allocation of responsibility is a fundamental term of these Terms of Service and forms
                  the basis of the agreement between you and NotiFetch. Without this limitation, NotiFetch
                  would not be able to offer the Service on the terms described herein.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 5. Nominative Fair Use Notice */}
          <Card id="nominative-fair-use" className="scroll-mt-20">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                  <Bookmark className="w-5 h-5 text-amber-500" />
                </div>
                <h2 className="text-xl font-bold">5. Nominative Fair Use Notice</h2>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  NotiFetch may display the names, trademarks, service marks, trade dress, or logos of
                  third-party delivery platforms within the application for the sole purpose of identifying
                  the source of notifications that the user has received on their device. This use is made
                  under the doctrine of <strong>nominative fair use</strong> (also known as &quot;fair
                  reference&quot;), as recognized under Indian trademark law (Trade Marks Act, 1999, Section 30),
                  United States trademark law (Lanham Act, 15 U.S.C. § 1115(b)(4)), and equivalent
                  provisions in the European Union and other jurisdictions.
                </p>
                <p>
                  The nominative fair use doctrine permits the use of a third party&apos;s trademark to refer
                  to the trademark owner&apos;s goods or services, provided that: (a) the product or service
                  in question is not readily identifiable without use of the trademark; (b) only so much of
                  the mark is used as is reasonably necessary to identify the product or service; and (c)
                  the user does nothing that would suggest sponsorship or endorsement by the trademark
                  holder. NotiFetch&apos;s use of delivery platform names and logos satisfies all three
                  prongs of this test.
                </p>
                <p>
                  Within NotiFetch, the display names assigned to each delivery platform are fully
                  customizable by the user. The default display names use the brand names of the respective
                  platforms under nominative fair use for identification purposes only. Users may change
                  these display names to any name of their choosing at any time through the application&apos;s
                  settings. NotiFetch does not claim any ownership, authorship, or affiliation with any
                  third-party trademarks displayed within the application.
                </p>
                <p>
                  All trademarks, service marks, trade names, logos, and brand identifiers referenced in
                  the NotiFetch application are and remain the exclusive property of their respective
                  owners. The inclusion of any such mark in the application does not imply endorsement,
                  sponsorship, partnership, affiliation, or certification by the mark owner. NotiFetch
                  respects the intellectual property rights of all third parties and will promptly comply
                  with any valid takedown or modification request from a trademark owner.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 6. Acceptable Use */}
          <Card id="acceptable-use" className="scroll-mt-20">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                  <CheckCircle className="w-5 h-5 text-amber-500" />
                </div>
                <h2 className="text-xl font-bold">6. Acceptable Use</h2>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  NotiFetch is designed and intended exclusively as a <strong>personal notification
                  management and organization tool</strong> for delivery partners and gig workers. The
                  Service is to be used solely to read, organize, and manage notifications that the user
                  has already received on their Android device from delivery partner applications. The
                  acceptable use of NotiFetch includes, but is not limited to: viewing delivery
                  notifications in a consolidated interface; organizing notifications by platform, type, or
                  priority; tracking personal earnings derived from notification data; analyzing personal
                  delivery trends and patterns; and managing notification preferences and settings.
                </p>
                <p>
                  Users may utilize NotiFetch only in a manner that is consistent with all applicable
                  local, state, national, and international laws and regulations, including but not limited
                  to the Information Technology Act, 2000 (India), the Digital Personal Data Protection Act,
                  2023 (India), the General Data Protection Regulation (EU), the Computer Fraud and Abuse
                  Act (United States), and Google Play Store policies. Users must comply with all terms and
                  conditions imposed by their device manufacturer, operating system provider, and any
                  delivery platform whose notifications are being read.
                </p>
                <p>
                  Users must not use NotiFetch in any manner that circumvents, interferes with, disrupts,
                  or degrades the operation of any delivery platform, any other user&apos;s experience, or any
                  third-party service. Users must not use NotiFetch to gain any unfair advantage in the
                  allocation, acceptance, or processing of delivery orders on any platform. NotiFetch is
                  intended to enhance the user&apos;s personal productivity and organization — not to game,
                  exploit, or manipulate any platform&apos;s systems or algorithms.
                </p>
                <p>
                  The notification listener permission granted to NotiFetch must be used exclusively for
                  the purposes described in these Terms. Users must not attempt to expand the scope of
                  notification access beyond the delivery partner packages specified by the application, or
                  to use the notification data for any purpose other than personal notification management
                  and analytics.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 7. Prohibited Uses */}
          <Card id="prohibited-uses" className="scroll-mt-20 border-2 border-destructive/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-lg bg-destructive/10 flex items-center justify-center shrink-0">
                  <Ban className="w-5 h-5 text-destructive" />
                </div>
                <h2 className="text-xl font-bold">7. Prohibited Uses</h2>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  You are strictly prohibited from using NotiFetch or the notification data accessed through
                  the Service for any of the following purposes. Violation of any of these prohibitions
                  constitutes a material breach of these Terms and may result in immediate account
                  termination, legal action, and reporting to relevant authorities.
                </p>
                <ul className="space-y-3">
                  <li className="flex gap-3">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-destructive/60 shrink-0" />
                    <span>
                      <strong>Auto-Accepting Orders:</strong> Using NotiFetch, or any data or functionality
                      provided by NotiFetch, to automatically accept, claim, or secure delivery orders on
                      any platform. NotiFetch does not have the capability to interact with, click on, or
                      respond to notifications on behalf of the user, and any attempt to use the Service
                      for this purpose is strictly prohibited.
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-destructive/60 shrink-0" />
                    <span>
                      <strong>Scraping or Data Harvesting:</strong> Using NotiFetch to systematically
                      collect, scrape, mine, or harvest data from any delivery platform for any commercial
                      purpose, including but not limited to competitive analysis, price monitoring, or
                      resale of data to third parties. The notification data accessed by NotiFetch is
                      intended solely for the user&apos;s personal, non-commercial use.
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-destructive/60 shrink-0" />
                    <span>
                      <strong>Credential Harvesting:</strong> Attempting to capture, collect, store, or
                      transmit any login credentials, authentication tokens, session cookies, passwords,
                      OTPs (one-time passwords), or any other security credentials from any delivery
                      platform or any other application. NotiFetch&apos;s architecture is specifically designed
                      to prevent such access, and any circumvention of these protections is a violation of
                      these Terms and applicable law, including Section 43 of the India IT Act, 2000 and
                      the US Computer Fraud and Abuse Act (18 U.S.C. § 1030).
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-destructive/60 shrink-0" />
                    <span>
                      <strong>Gaming the System:</strong> Using NotiFetch to gain an unfair competitive
                      advantage over other delivery partners on any platform, including but not limited to
                      exploiting platform algorithms, manipulating acceptance rates, circumventing platform
                      throttling or penalty mechanisms, or any form of automated or semi- automated order
                      selection that violates the spirit of fair competition on any platform.
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-destructive/60 shrink-0" />
                    <span>
                      <strong>Reverse Engineering:</strong> Decompiling, disassembling, reverse compiling,
                      reverse engineering, or otherwise attempting to derive the source code, underlying
                      ideas, algorithms, or structure of NotiFetch or any delivery platform&apos;s application
                      through the use of NotiFetch.
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-destructive/60 shrink-0" />
                    <span>
                      <strong>Unauthorized Access:</strong> Attempting to gain unauthorized access to any
                      delivery platform&apos;s systems, servers, databases, APIs, or networks through
                      NotiFetch, or using NotiFetch as a vector for any form of cyberattack, including but
                      not limited to denial-of-service attacks, man-in-the-middle attacks, or injection
                      attacks, in violation of Section 43 of the India IT Act, 2000, the US Computer Fraud
                      and Abuse Act, and equivalent laws in other jurisdictions.
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-destructive/60 shrink-0" />
                    <span>
                      <strong>Reselling or Redistributing Data:</strong> Selling, licensing, renting,
                      leasing, redistributing, or otherwise making available any data obtained through
                      NotiFetch to any third party, whether for commercial or non-commercial purposes,
                      without the express prior written consent of NotiFetch.
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-destructive/60 shrink-0" />
                    <span>
                      <strong>Interference with Platform Operations:</strong> Using NotiFetch in any manner
                      that interferes with, disrupts, degrades, or impairs the operation of any delivery
                      platform, including its ability to dispatch orders, communicate with delivery
                      partners, process payments, or maintain the integrity of its marketplace.
                    </span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* 8. User Data and Privacy */}
          <Card id="user-data-privacy" className="scroll-mt-20">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                  <Eye className="w-5 h-5 text-amber-500" />
                </div>
                <h2 className="text-xl font-bold">8. User Data and Privacy</h2>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  NotiFetch is committed to protecting the privacy and security of all user data. Our data
                  practices are governed by our Privacy Policy, available at
                  https://notifetch.app/privacy, which is incorporated into these Terms by
                  reference. By using the Service, you consent to the collection, processing, storage, and
                  use of your data as described in the Privacy Policy.
                </p>
                <p>
                  NotiFetch reads notification data solely from designated delivery partner application
                  packages on the user&apos;s device. It <strong>never reads, accesses, or processes
                  notifications</strong> from banking applications, social media platforms, messaging
                  applications (including WhatsApp, Telegram, SMS, or any other messaging service),
                  healthcare applications, or any other personal, financial, or sensitive applications.
                  This package-scoped access restriction is enforced at the code level and cannot be
                  overridden by the user or any third party.
                </p>
                <p>
                  In compliance with the Digital Personal Data Protection Act, 2023 (India), NotiFetch acts
                  as a Data Fiduciary with respect to the personal data it processes. We process personal
                  data only for legitimate and lawful purposes, maintain reasonable security safeguards to
                  prevent unauthorized access, and do not share personal data with any third party without
                  the user&apos;s consent unless required by law. Users have the right to access, correct,
                  update, and delete their personal data as outlined in our Privacy Policy and Section 15
                  (Data Deletion Rights) of these Terms.
                </p>
                <p>
                  For users located in the European Union, NotiFetch complies with the General Data
                  Protection Regulation (GDPR) (EU) 2016/679. We process personal data only on the basis
                  of lawful processing conditions as set out in Article 6 of the GDPR, including consent,
                  contractual necessity, and legitimate interests. EU users have the right to access,
                  rectify, erase, restrict processing, data portability, and object to processing, as
                  further detailed in our Privacy Policy. Our Data Protection Officer can be reached at
                  dpo@notifetch.app.
                </p>
                <p>
                  NotiFetch does <strong>not store any delivery platform credentials, authentication tokens,
                  session cookies, or login information</strong>. Notification data is processed locally on
                  the user&apos;s device, and only data necessary for the provision of the Service is
                  transmitted to our servers. All data transmission is encrypted using TLS 1.3, and
                  sensitive data at rest is encrypted using AES-256 encryption.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 9. Consent and Permissions */}
          <Card id="consent-permissions" className="scroll-mt-20">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                  <KeyRound className="w-5 h-5 text-amber-500" />
                </div>
                <h2 className="text-xl font-bold">9. Consent and Permissions</h2>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  NotiFetch requires the user to grant explicit Android notification listener permission
                  through the Android operating system&apos;s standard security settings. This permission is
                  required for the core functionality of the Service — namely, reading and organizing
                  delivery-related notifications from the user&apos;s device. The user must navigate to
                  their device&apos;s Settings &gt; Apps &gt; Special App Access &gt; Notification Access and
                  explicitly enable notification access for NotiFetch. This permission is never granted
                  automatically or without the user&apos;s affirmative action.
                </p>
                <p>
                  In compliance with the Digital Personal Data Protection Act, 2023 (India) and the EU
                  GDPR, NotiFetch obtains <strong>free, specific, informed, and unambiguous consent</strong>{" "}
                  from the user before processing any personal data. Consent is collected through a clear
                  and conspicuous in-app consent flow that explains: (a) the specific data being collected;
                  (b) the purpose for which the data is being collected; (c) how the data will be processed
                  and stored; (d) the user&apos;s right to withdraw consent at any time; and (e) the
                  consequences of withholding or withdrawing consent.
                </p>
                <p>
                  The user may revoke the notification listener permission at any time through their
                  Android device settings. Revoking this permission will disable NotiFetch&apos;s core
                  notification reading functionality but will not affect the user&apos;s account or
                  previously stored data. The user may also delete their account and all associated data
                  as described in Section 15 (Data Deletion Rights).
                </p>
                <p>
                  NotiFetch does not request, require, or collect any permissions beyond those strictly
                  necessary for the provision of the Service. We adhere to the principle of data
                  minimization as required by the DPDP Act 2023 (India) and Article 5(1)(c) of the EU
                  GDPR, and we collect only the minimum data necessary to provide the features the user
                  has actively chosen to use.
                </p>
                <p>
                  For users in India, in compliance with Section 43A of the Information Technology Act,
                  2000 and the IT (Reasonable Security Practices and Procedures and Sensitive Personal
                  Data or Information) Rules, 2011, NotiFetch ensures that all sensitive personal data
                  or information is collected, processed, and stored in accordance with reasonable
                  security practices and procedures. We publish our privacy practices in our Privacy
                  Policy and obtain consent before collecting any sensitive personal data.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 10. Intellectual Property */}
          <Card id="intellectual-property" className="scroll-mt-20">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                  <Scale className="w-5 h-5 text-amber-500" />
                </div>
                <h2 className="text-xl font-bold">10. Intellectual Property</h2>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  The NotiFetch application, including but not limited to its source code, object code,
                  user interface design, visual design, graphics, icons, logos, trademarks, service marks,
                  text, documentation, and all other content and materials (collectively, &quot;NotiFetch
                  IP&quot;), is owned exclusively by NotiFetch and is protected by applicable intellectual
                  property laws, including the Copyright Act, 1957 (India), the Indian Design Act, 2000,
                  the Digital Millennium Copyright Act (United States), and equivalent laws in other
                  jurisdictions.
                </p>
                <p>
                  The &quot;NotiFetch&quot; name, logo, and all related names, logos, product and service names,
                  designs, and slogans are trademarks or service marks of NotiFetch. You may not use
                  these marks without the prior written permission of NotiFetch. All other names, logos,
                  product and service names, designs, and slogans on the Service are the trademarks of
                  their respective owners, and their use in the application is governed by Section 5
                  (Nominative Fair Use Notice) of these Terms.
                </p>
                <p>
                  You retain all ownership rights in the data you provide to the Service, including your
                  personal information, earnings data, and notification content. NotiFetch does not claim
                  any ownership interest in your data. However, by using the Service, you grant NotiFetch
                  a limited, non-exclusive, non-transferable, revocable license to process, store, and
                  display your data solely for the purpose of providing the Service to you.
                </p>
                <p>
                  NotiFetch retains ownership of any aggregated, anonymized, or de-identified data derived
                  from the use of the Service, provided that such data cannot reasonably be used to
                  identify any individual user. This aggregated data may be used by NotiFetch for
                  analytics, service improvement, and other lawful purposes, and may be shared with third
                  parties in a form that does not identify any individual user.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 11. Limitation of Liability */}
          <Card id="limitation-liability" className="scroll-mt-20">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                </div>
                <h2 className="text-xl font-bold">11. Limitation of Liability</h2>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, NOTIFETCH, ITS OFFICERS, DIRECTORS,
                  EMPLOYEES, AGENTS, AFFILIATES, SUCCESSORS, AND ASSIGNS SHALL NOT BE LIABLE FOR ANY
                  INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, PUNITIVE, OR EXEMPLARY DAMAGES, INCLUDING
                  BUT NOT LIMITED TO LOSS OF PROFITS, LOSS OF REVENUE, LOSS OF EARNINGS, LOSS OF DATA,
                  LOSS OF GOODWILL, LOSS OF BUSINESS OPPORTUNITY, OR ANY OTHER INTANGIBLE LOSSES,
                  REGARDLESS OF WHETHER SUCH DAMAGES ARE BASED ON CONTRACT, TORT, STRICT LIABILITY, OR
                  ANY OTHER LEGAL THEORY, AND WHETHER OR NOT NOTIFETCH HAS BEEN ADVISED OF THE
                  POSSIBILITY OF SUCH DAMAGES.
                </p>
                <p>
                  IN NO EVENT SHALL NOTIFETCH&apos;S TOTAL AGGREGATE LIABILITY FOR ANY AND ALL CLAIMS ARISING
                  FROM OR RELATED TO THESE TERMS OR THE SERVICE EXCEED THE GREATER OF: (A) THE TOTAL
                  AMOUNT PAID BY YOU TO NOTIFETCH IN THE TWELVE (12) MONTHS IMMEDIATELY PRECEDING THE
                  DATE OF THE CLAIM; OR (B) INR 1,000 (ONE THOUSAND INDIAN RUPEES). THIS LIMITATION
                  APPLIES REGARDLESS OF THE LEGAL THEORY ON WHICH THE CLAIM IS BASED.
                </p>
                <p>
                  NotiFetch shall not be liable for any loss of earnings, missed delivery opportunities,
                  account suspension or deactivation on any delivery platform, reduction in order
                  assignments, or any other adverse action taken by any delivery platform against the user.
                  These risks are borne exclusively by the user, as described in Section 4 (User
                  Responsibility for Platform ToS Compliance).
                </p>
                <p>
                  NotiFetch shall not be liable for any interruption, cessation, or degradation of the
                  Service caused by circumstances beyond our reasonable control, including but not limited
                  to acts of God, natural disasters, war, terrorism, riots, embargoes, acts of civil or
                  military authorities, fire, floods, accidents, strikes, shortages of labor, fuel,
                  materials, or supplies, failure of telecommunications or internet infrastructure,
                  changes in Android operating system policies or APIs, or actions by delivery platforms
                  that prevent NotiFetch from functioning.
                </p>
                <p>
                  This limitation of liability is a fundamental term of these Terms and reflects the
                  allocation of risk between the parties. The fees charged for the Service, if any, are
                  based on this limitation of liability. Nothing in these Terms shall exclude or limit
                  liability for death or personal injury caused by negligence, fraud, or any other
                  liability that cannot be excluded or limited by applicable law, including liability
                  under Section 43A of the India IT Act, 2000 for failure to implement reasonable
                  security practices.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 12. Indemnification */}
          <Card id="indemnification" className="scroll-mt-20">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                  <Shield className="w-5 h-5 text-amber-500" />
                </div>
                <h2 className="text-xl font-bold">12. Indemnification</h2>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  You agree to indemnify, defend, and hold harmless NotiFetch, its officers, directors,
                  employees, agents, affiliates, successors, and assigns (collectively, the
                  &quot;Indemnified Parties&quot;) from and against any and all claims, demands, actions, suits,
                  proceedings, damages, liabilities, losses, costs, and expenses (including reasonable
                  attorneys&apos; fees and costs) arising out of or related to: (a) your use of or access to
                  the Service; (b) your violation of these Terms; (c) your violation of any applicable
                  law, rule, or regulation, including but not limited to the India IT Act, 2000, the DPDP
                  Act, 2023, the EU GDPR, and the US CFAA; (d) your violation of any third party&apos;s
                  rights, including any delivery platform&apos;s Terms of Service or intellectual property
                  rights; or (e) any content or data you submit, transmit, or process through the
                  Service.
                </p>
                <p>
                  Without limiting the generality of the foregoing, you specifically agree to indemnify
                  the Indemnified Parties against any claims made by any delivery platform arising from
                  your use of NotiFetch in connection with that platform, including but not limited to
                  claims of breach of the platform&apos;s Terms of Service, unauthorized access to the
                  platform&apos;s systems, violation of the platform&apos;s intellectual property rights, or any
                  other claim arising from your use of notification data originating from the platform.
                </p>
                <p>
                  NotiFetch reserves the right to assume the exclusive defense and control of any matter
                  subject to indemnification, and you shall not settle any such matter without the prior
                  written consent of NotiFetch. You shall cooperate fully with NotiFetch in the defense
                  of any indemnified claim, including providing all relevant information and materials
                  within your possession or control. If you are required to make a payment to a third
                  party in connection with any indemnified claim, you shall promptly reimburse NotiFetch
                  for all costs and expenses incurred in connection therewith.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 13. Disclaimers */}
          <Card id="disclaimers" className="scroll-mt-20">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                  <AlertOctagon className="w-5 h-5 text-amber-500" />
                </div>
                <h2 className="text-xl font-bold">13. Disclaimers</h2>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  THE SERVICE IS PROVIDED ON AN &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; BASIS WITHOUT WARRANTIES OF
                  ANY KIND, WHETHER EXPRESS, IMPLIED, STATUTORY, OR OTHERWISE, INCLUDING BUT NOT LIMITED
                  TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE,
                  NON-INFRINGEMENT, AND QUIET ENJOYMENT. NOTIFETCH DOES NOT WARRANT THAT THE SERVICE
                  WILL BE UNINTERRUPTED, TIMELY, SECURE, OR ERROR-FREE, OR THAT THE RESULTS OBTAINED
                  FROM THE USE OF THE SERVICE WILL BE ACCURATE, RELIABLE, OR COMPLETE.
                </p>
                <p>
                  NotiFetch does not warrant or guarantee the accuracy, completeness, or reliability of
                  any earnings calculations, order details, or notification content displayed within the
                  application. All such data is derived from notifications received on the user&apos;s device
                  and may contain errors, omissions, or discrepancies due to factors beyond our control,
                  including but not limited to notification formatting changes by delivery platforms,
                  delayed or missing notifications, or operating system-level modifications to
                  notification content.
                </p>
                <p>
                  NotiFetch is not a delivery platform and does not provide delivery, logistics, or
                  transportation services. NotiFetch does not guarantee that the Service will enhance
                  the user&apos;s earnings, improve order acceptance rates, or provide any specific financial
                  or operational benefit. Any reliance on the Service for business, financial, or
                  operational decisions is at the user&apos;s sole risk.
                </p>
                <p>
                  No advice, information, or statement made by NotiFetch, its employees, agents, or
                  representatives, whether orally or in writing, shall create any warranty not expressly
                  stated in these Terms. NotiFetch disclaims all liability for any harm or damages
                  resulting from your reliance on any information or content provided through the Service.
                </p>
                <p>
                  NotiFetch does not endorse, guarantee, or assume responsibility for any content,
                  products, or services offered by any third party, including any delivery platform. Any
                  transaction or interaction between you and any delivery platform is solely between you
                  and that platform, and NotiFetch bears no responsibility or liability for such
                  interactions.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 14. Account Termination */}
          <Card id="account-termination" className="scroll-mt-20">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                  <XCircle className="w-5 h-5 text-amber-500" />
                </div>
                <h2 className="text-xl font-bold">14. Account Termination</h2>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  You may terminate your NotiFetch account at any time by navigating to your account
                  settings within the application and selecting the &quot;Delete Account&quot; option, or by
                  contacting us at legal@notifetch.app with a written request for account termination.
                  Upon termination, your right to access and use the Service will cease immediately.
                </p>
                <p>
                  NotiFetch reserves the right to suspend, restrict, or terminate your account, without
                  prior notice or liability, for any reason, including but not limited to: (a) your
                  breach of any provision of these Terms; (b) your violation of any applicable law or
                  regulation; (c) your use of the Service in any manner that is harmful to NotiFetch,
                  its users, or any third party; (d) your violation of any delivery platform&apos;s Terms
                  of Service that comes to NotiFetch&apos;s attention; or (e) any conduct that NotiFetch
                  reasonably determines to be inappropriate, unethical, or contrary to the spirit of
                  these Terms.
                </p>
                <p>
                  In the event of account termination, whether initiated by you or by NotiFetch, the
                  following provisions shall survive: Sections 3 (No Affiliation), 4 (User
                  Responsibility), 5 (Nominative Fair Use Notice), 8 (User Data and Privacy), 10
                  (Intellectual Property), 11 (Limitation of Liability), 12 (Indemnification), 13
                  (Disclaimers), 16 (Governing Law), and 17 (Dispute Resolution). These provisions
                  shall continue to apply to you indefinitely following termination.
                </p>
                <p>
                  If you have an active paid subscription at the time of account termination, you will
                  retain access to premium features until the end of your current billing period. No
                  refunds will be issued for partial billing periods, except as required by applicable
                  law or as described in our refund policy. Upon account deletion, your data will be
                  handled in accordance with Section 15 (Data Deletion Rights) and our Privacy Policy.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 15. Data Deletion Rights */}
          <Card id="data-deletion" className="scroll-mt-20">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                  <Trash2 className="w-5 h-5 text-amber-500" />
                </div>
                <h2 className="text-xl font-bold">15. Data Deletion Rights</h2>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  You have the right to request the deletion of your personal data at any time, subject
                  to certain limited exceptions as required by applicable law. To request deletion, you
                  may use the &quot;Delete Account&quot; feature in the application settings, or submit a written
                  request to legal@notifetch.app. We will process your deletion request within thirty
                  (30) days of receipt and confirm the deletion in writing.
                </p>
                <p>
                  In compliance with the Digital Personal Data Protection Act, 2023 (India), you have
                  the right to: (a) obtain confirmation from NotiFetch as to whether or not your
                  personal data is being processed; (b) access the specific categories of personal data
                  being processed; (c) obtain a copy of your personal data in a machine-readable format;
                  (d) request correction of inaccurate or incomplete personal data; and (e) request the
                  erasure of your personal data, subject to exceptions for legal compliance, security of
                  the State, and prevention of offences.
                </p>
                <p>
                  In compliance with the EU GDPR, you have the right to erasure (&quot;right to be
                  forgotten&quot;) under Article 17, subject to the grounds for refusal listed in Article
                  17(3), including compliance with a legal obligation, the establishment, exercise, or
                  defense of legal claims, and public health purposes. Where we have made your personal
                  data public and are obliged to erase it, we shall take reasonable steps to inform
                  other controllers processing that data of your erasure request.
                </p>
                <p>
                  Upon account deletion, NotiFetch will: (a) delete your account profile and
                  preferences within thirty (30) days; (b) delete notification data stored on our
                  servers within thirty (30) days; (c) anonymize or aggregate any usage data that
                  cannot identify you individually; and (d) retain only such data as is required by
                  applicable law, including financial records required by tax and accounting regulations
                  for a period of seven (7) years. Data retained for legal compliance will be stored
                  securely and used only for the purpose for which retention is required.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 16. Governing Law */}
          <Card id="governing-law" className="scroll-mt-20">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-amber-500" />
                </div>
                <h2 className="text-xl font-bold">16. Governing Law</h2>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  These Terms of Service shall be governed by and construed in accordance with the laws
                  of <strong>India</strong>, without regard to its conflict of law principles. The
                  courts of <strong>Bengaluru, Karnataka, India</strong> shall have exclusive
                  jurisdiction over any disputes arising from or related to these Terms or the Service,
                  subject to the dispute resolution provisions in Section 17.
                </p>
                <p>
                  Without limiting the foregoing, these Terms are specifically designed to comply with
                  the Information Technology Act, 2000 (India), including Section 43 (penalty for
                  unauthorized access), Section 43A (compensation for failure to protect data), and
                  Section 72A (punishment for disclosure of information in breach of lawful contract);
                  the Digital Personal Data Protection Act, 2023 (India); the General Data Protection
                  Regulation (EU) 2016/679; the Computer Fraud and Abuse Act (18 U.S.C. § 1030)
                  (United States); and Google Play Store policies, including the Google Play Developer
                  Program Policies and the Google Play Terms of Service.
                </p>
                <p>
                  For users located in the European Union, the mandatory provisions of applicable EU
                  consumer protection law shall apply notwithstanding the governing law specified above.
                  Nothing in these Terms shall deprive you of mandatory consumer protections afforded
                  by the laws of your country of residence.
                </p>
                <p>
                  If you are accessing the Service from a jurisdiction outside India, you are
                  responsible for ensuring that your use of the Service complies with all applicable
                  local, state, national, and international laws and regulations. NotiFetch makes no
                  representation that the Service is appropriate or available for use in all
                  jurisdictions, and access to the Service from jurisdictions where the content or
                  functionality of the Service is illegal is prohibited.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 17. Dispute Resolution */}
          <Card id="dispute-resolution" className="scroll-mt-20">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                  <Gavel className="w-5 h-5 text-amber-500" />
                </div>
                <h2 className="text-xl font-bold">17. Dispute Resolution</h2>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  In the event of any dispute, controversy, or claim arising out of or relating to
                  these Terms, the Service, or the relationship between you and NotiFetch
                  (collectively, a &quot;Dispute&quot;), you agree to first attempt to resolve the Dispute
                  informally by submitting a written complaint to legal@notifetch.app with a detailed
                  description of the Dispute and the relief sought. NotiFetch will acknowledge receipt
                  of your complaint within seven (7) business days and will attempt to resolve the
                  Dispute in good faith within thirty (30) days of receipt.
                </p>
                <p>
                  If the informal resolution process fails to resolve the Dispute within thirty (30)
                  days, either party may initiate arbitration proceedings. All Disputes that are not
                  resolved informally shall be resolved by <strong>binding arbitration</strong> in
                  accordance with the Arbitration and Conciliation Act, 1996 (India). The arbitration
                  shall be conducted by a sole arbitrator appointed mutually by the parties. If the
                  parties cannot agree on an arbitrator within fifteen (15) days, the arbitrator shall
                  be appointed by the Bengaluru Arbitration Centre or such other institution as may be
                  agreed upon by the parties.
                </p>
                <p>
                  The arbitration proceedings shall be conducted in English and shall take place in
                  Bengaluru, Karnataka, India. The arbitrator may conduct hearings remotely via video
                  conference if agreed by both parties or if circumstances require. The arbitrator&apos;s
                  decision shall be final and binding on both parties and may be enforced in any court
                  of competent jurisdiction. The costs of arbitration shall be borne as determined by
                  the arbitrator.
                </p>
                <p>
                  Notwithstanding the foregoing, either party may seek injunctive or other equitable
                  relief in any court of competent jurisdiction for breaches of intellectual property
                  rights, confidentiality obligations, or any matter requiring urgent interim relief.
                  The obligation to arbitrate shall not be construed as a waiver of either party&apos;s
                  right to seek such interim or equitable relief.
                </p>
                <p>
                  You agree that any arbitration or court proceedings shall be conducted on an
                  individual basis only, and not as part of a class action, collective action, or
                  representative action. You expressly waive any right to participate in a class
                  action, collective action, or representative action against NotiFetch. The
                  arbitrator may consolidate only claims brought by or against the same party and may
                  not consolidate claims of different users.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 18. Changes to Terms */}
          <Card id="changes-to-terms" className="scroll-mt-20">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                  <RefreshCw className="w-5 h-5 text-amber-500" />
                </div>
                <h2 className="text-xl font-bold">18. Changes to Terms</h2>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  NotiFetch reserves the right to modify, amend, or update these Terms of Service at
                  any time, in its sole discretion. All changes to these Terms will be effective
                  immediately upon publication on our website at
                  https://notifetch.app/terms, unless otherwise specified. The &quot;Last
                  Updated&quot; date at the top of these Terms will be revised to reflect the date of the
                  most recent modification.
                </p>
                <p>
                  For material changes to these Terms — including changes that affect the scope of
                  data collection, user liability, payment terms, or dispute resolution — NotiFetch
                  will provide at least <strong>thirty (30) days&apos; prior written notice</strong> to
                  users via email and/or in-app notification. The notice will include a summary of the
                  material changes and a link to the revised Terms. Your continued use of the Service
                  after the effective date of any changes constitutes your acceptance of the revised
                  Terms.
                </p>
                <p>
                  If you do not agree with the revised Terms, you must discontinue use of the Service
                  and delete your account before the effective date of the changes. If you continue to
                  use the Service after the changes take effect, you will be bound by the revised
                  Terms. NotiFetch will maintain previous versions of these Terms and will make them
                  available upon request.
                </p>
                <p>
                  In compliance with the DPDP Act, 2023 (India) and the EU GDPR, if any changes to
                  these Terms affect the processing of your personal data, we will obtain your
                  affirmative consent before implementing such changes where consent is the legal basis
                  for processing. We will also update our Privacy Policy accordingly and notify you of
                  any changes to our data practices.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 19. Contact Information */}
          <Card id="contact-info" className="scroll-mt-20">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-amber-500" />
                </div>
                <h2 className="text-xl font-bold">19. Contact Information</h2>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  If you have any questions, concerns, or feedback regarding these Terms of Service,
                  the Service, or your rights under applicable law, please contact us using the
                  information provided below. We are committed to responding to all inquiries in a
                  timely and comprehensive manner.
                </p>
                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                    <span className="font-medium text-foreground">Legal Inquiries:</span>
                    <a href="mailto:legal@notifetch.app" className="text-amber-600 dark:text-amber-400 hover:underline">
                      legal@notifetch.app
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                    <span className="font-medium text-foreground">General Support:</span>
                    <a href="mailto:support@notifetch.app" className="text-amber-600 dark:text-amber-400 hover:underline">
                      support@notifetch.app
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                    <span className="font-medium text-foreground">Data Protection Officer (EU):</span>
                    <a href="mailto:dpo@notifetch.app" className="text-amber-600 dark:text-amber-400 hover:underline">
                      dpo@notifetch.app
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <ExternalLink className="w-4 h-4 text-amber-500 shrink-0" />
                    <span className="font-medium text-foreground">Website:</span>
                    <a href="https://notifetch.app" target="_blank" rel="noopener noreferrer" className="text-amber-600 dark:text-amber-400 hover:underline">
                      https://notifetch.app
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <ExternalLink className="w-4 h-4 text-amber-500 shrink-0" />
                    <span className="font-medium text-foreground">Privacy Policy:</span>
                    <a href="https://notifetch.app/privacy" target="_blank" rel="noopener noreferrer" className="text-amber-600 dark:text-amber-400 hover:underline">
                      https://notifetch.app/privacy
                    </a>
                  </div>
                </div>
                <p>
                  For data access, deletion, or portability requests under the DPDP Act, 2023 (India)
                  or the EU GDPR, please submit your request to legal@notifetch.app with the subject
                  line &quot;Data Rights Request.&quot; We will verify your identity and respond within the
                  timeframes prescribed by applicable law: thirty (30) days under the DPDP Act and
                  thirty (30) days (extendable by sixty (60) days for complex requests) under the GDPR.
                </p>
                <p>
                  For GDPR-related complaints, EU users may also contact their local Data Protection
                  Authority. A list of EU Data Protection Authorities is available at
                  https://www.edpb.europa.eu/about-edpb/about-edpb/members_en. Indian users may
                  approach the Data Protection Board of India established under the DPDP Act, 2023.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 20. Severability */}
          <Card id="severability" className="scroll-mt-20">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                  <Layers className="w-5 h-5 text-amber-500" />
                </div>
                <h2 className="text-xl font-bold">20. Severability</h2>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  If any provision of these Terms of Service is held to be invalid, illegal, void,
                  unenforceable, or in conflict with applicable law by a court of competent
                  jurisdiction or an arbitrator, such provision shall be modified to the minimum extent
                  necessary to make it valid, legal, and enforceable, while preserving the parties&apos;
                  original intent. If such modification is not possible, the offending provision shall
                  be severed from these Terms without affecting the validity, legality, or
                  enforceability of the remaining provisions.
                </p>
                <p>
                  The invalidity or unenforceability of any provision of these Terms shall not affect
                  the validity or enforceability of any other provision, and all other provisions shall
                  continue in full force and effect. The parties agree that any provision held to be
                  invalid or unenforceable shall be replaced by a valid and enforceable provision that
                  achieves, to the greatest extent possible, the economic, legal, and commercial
                  objectives of the invalid or unenforceable provision.
                </p>
                <p>
                  Without limiting the generality of the foregoing, if the limitation of liability in
                  Section 11 or the indemnification obligations in Section 12 are held to be
                  unenforceable in any jurisdiction, such provisions shall be modified to the maximum
                  extent permitted by law in that jurisdiction, and the remaining provisions of these
                  Terms shall continue to apply in full force and effect.
                </p>
                <p>
                  The section headings in these Terms are for convenience of reference only and shall
                  not affect the interpretation or construction of any provision. No provision of these
                  Terms shall be construed against any party by reason of its authorship. The language
                  in these Terms shall be interpreted as to its fair meaning and not strictly for or
                  against any party.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Contact Card */}
        <Card className="mt-12 bg-gradient-to-br from-amber-500/5 to-orange-600/5 border-amber-500/20">
          <CardContent className="p-6 text-center">
            <Mail className="w-8 h-8 text-amber-500 mx-auto mb-3" />
            <h3 className="font-bold text-lg mb-2">Questions About These Terms?</h3>
            <p className="text-muted-foreground mb-4 max-w-lg mx-auto">
              If you have any questions, concerns, or need clarification about these Terms of Service,
              our legal team is here to help. We aim to respond within 7 business days.
            </p>
            <a
              href="mailto:legal@notifetch.app"
              className="inline-flex items-center gap-2 text-amber-600 dark:text-amber-400 hover:text-amber-500 font-semibold transition-colors"
            >
              legal@notifetch.app
              <ExternalLink className="w-4 h-4" />
            </a>
          </CardContent>
        </Card>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-border text-center pb-8">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} NotiFetch. All rights reserved.
          </p>
          <div className="flex items-center justify-center gap-4 mt-3 flex-wrap">
            <a
              href="/privacy"
              className="text-sm text-amber-600 dark:text-amber-400 hover:text-amber-500 transition-colors"
            >
              Privacy Policy
            </a>
            <span className="text-muted-foreground">&middot;</span>
            <a
              href="/terms"
              className="text-sm text-amber-600 dark:text-amber-400 hover:text-amber-500 transition-colors"
            >
              Terms of Service
            </a>
            <span className="text-muted-foreground">&middot;</span>
            <a
              href="/legal"
              className="text-sm text-amber-600 dark:text-amber-400 hover:text-amber-500 transition-colors"
            >
              Legal Hub
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
}
