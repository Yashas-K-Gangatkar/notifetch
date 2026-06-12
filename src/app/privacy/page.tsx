"use client";

import { BackButton } from "@/components/back-button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Shield,
  Building2,
  Database,
  Smartphone,
  Target,
  Minimize2,
  Scale,
  Lock,
  Globe,
  Clock,
  UserCheck,
  Trash2,
  Baby,
  ArrowRightLeft,
  Cookie,
  FileEdit,
  Mail,
  UserCog,
  AlertTriangle,
} from "lucide-react";

interface SectionContent {
  heading?: string;
  paragraphs?: string[];
  items?: string[];
}

interface Section {
  id: string;
  icon: React.ElementType;
  title: string;
  content: SectionContent[];
}

const sections: Section[] = [
  {
    id: "introduction",
    icon: Shield,
    title: "1. Introduction",
    content: [
      {
        paragraphs: [
          'NotiFetch ("we," "our," or "us") is committed to protecting the privacy and personal data of our users. This Privacy Policy explains how we collect, use, store, and share information when you use our mobile application and web platform (collectively, the "Service"). This policy is designed to be transparent and accessible, ensuring you understand exactly what data we process and why.',
          "This Privacy Policy is compliant with the Digital Personal Data Protection Act, 2023 (\"DPDP Act\") of India, the European Union's General Data Protection Regulation (\"GDPR\"), the California Consumer Privacy Act (\"CCPA\"), and Google Play Store Data Safety requirements. Where these regulations overlap, we apply the highest standard of protection to your data.",
          "By using NotiFetch, you acknowledge that you have read and understood this Privacy Policy. If you do not agree with the practices described herein, you should discontinue use of the Service. We encourage you to review this policy periodically, as we may update it from time to time in accordance with the changes described in Section 16.",
          "NotiFetch is a notification reading and earnings analytics application designed for delivery partners and gig workers. It reads delivery-related notifications from your device to aggregate earnings data, display order information, and provide analytics. We want to be clear: NotiFetch is NOT a delivery platform, does not dispatch orders, and does not interact with any delivery platform's APIs or servers.",
        ],
      },
    ],
  },
  {
    id: "data-controller",
    icon: Building2,
    title: "2. Data Controller Information",
    content: [
      {
        paragraphs: [
          'The data controller responsible for your personal data under the GDPR (Article 4(7)) and the DPDP Act (Section 2(4)) is NotiFetch, Inc. As the data controller, we determine the purposes and means of processing your personal data and are accountable for ensuring your data rights are upheld.',
        ],
      },
      {
        heading: "Controller Details",
        items: [
          'Entity Name: NotiFetch, Inc.',
          'App Website: https://d2-liart-nine.vercel.app',
          'Support Email: support@notifetch.app',
          'Legal Inquiries: legal@notifetch.app',
          'Data Protection Officer (GDPR): dpo@notifetch.app',
          'Grievance Officer (India DPDP): See Section 18 below',
        ],
      },
      {
        paragraphs: [
          "For the purposes of the CCPA, NotiFetch, Inc. is a \"business\" as defined under California Civil Code §1798.140(d) that collects, sells, or shares personal information of California residents. We do not sell personal information. We are a single legal entity and do not share common branding or corporate ownership with any other business that would constitute a \"business\" under the CCPA.",
        ],
      },
    ],
  },
  {
    id: "data-collected",
    icon: Database,
    title: "3. What Data We Collect",
    content: [
      {
        heading: "Notification Data (Primary Data Collection)",
        paragraphs: [
          "The core function of NotiFetch is to read delivery-related notifications from your Android device. When you grant notification listener permission, we collect the following data points from each notification that originates from a recognized delivery partner application:",
        ],
        items: [
          "Notification title: The headline text displayed in the notification banner",
          "Notification text: The primary body text of the notification",
          "Notification bigText: The expanded text content visible when the notification is expanded on the device",
          "Notification subText: Any supplementary text displayed in the notification",
          "PackageName: The Android package identifier of the source application (e.g., com.ubercab.driver) — used solely to identify the delivery platform",
          "Timestamp: The date and time the notification was posted to the device",
          "Extracted order data: Order value, pickup location, dropoff location, and distance — parsed from the notification text using on-device pattern matching",
        ],
      },
      {
        heading: "What We Explicitly Do NOT Collect",
        paragraphs: [
          "We are committed to data minimization and want to be unequivocally clear about the boundaries of our data collection. The following categories of data are NEVER collected, stored, or transmitted by NotiFetch:",
        ],
        items: [
          "Raw notification extras or bundle data: We do not access the full Notification.extras Bundle, which may contain sensitive metadata beyond visible text",
          "Authentication tokens or session cookies: We never intercept or store OAuth tokens, session identifiers, or any credential material",
          "Login credentials: NotiFetch never asks for, reads, or stores passwords, PINs, or any authentication information for any application",
          "Notifications from non-delivery apps: We ONLY process notifications from our curated list of 55+ recognized delivery partner packages. Banking, social media, messaging, health, and all other personal app notifications are completely ignored and never accessed",
          "Personal messages or communications: No SMS, chat, email, or social media content is ever read or stored",
        ],
      },
      {
        heading: "Account and Authentication Data",
        items: [
          "Email address: Collected during account creation via Google OAuth or email OTP verification through Resend",
          "Display name: Your name as provided by Google OAuth or entered manually",
          "Profile picture: Obtained from Google OAuth if available; never required",
          "Firebase Anonymous Auth token: Used for Android app authentication without requiring personal identifiers",
          "Account preferences: Theme settings, notification preferences, platform customizations, and display configurations",
        ],
      },
      {
        heading: "Payment Data",
        items: [
          "Payment transactions are processed entirely by Razorpay (for users in India) and Stripe (for international users). NotiFetch does not collect, store, or have access to your full credit card number, CVV, or bank account details",
          "We store only a transaction reference ID and the subscription status (active, cancelled, expired) for our records",
          "Razorpay and Stripe each operate under their own privacy policies and PCI-DSS compliance frameworks",
        ],
      },
      {
        heading: "Device and Technical Data",
        items: [
          "Device model and OS version: Used for compatibility and bug resolution",
          "Firebase Cloud Messaging token: Required to deliver push notifications about new delivery opportunities",
          "App version: Collected to ensure feature compatibility and manage updates",
          "Crash reports: Anonymized stack traces sent via Firebase Crashlytics to diagnose and fix technical issues",
        ],
      },
    ],
  },
  {
    id: "how-collected",
    icon: Smartphone,
    title: "4. How We Collect Data",
    content: [
      {
        heading: "Notification Listener Service",
        paragraphs: [
          "NotiFetch collects notification data through Android's NotificationListenerService API, a system-level API provided by the Android operating system. This API allows an application to receive callbacks when notifications are posted or removed from the device's notification bar. It is important to understand how this mechanism works and its inherent privacy safeguards.",
          "When you enable notification access for NotiFetch in your Android device settings (Settings → Apps → Special app access → Notification access), the Android system grants our app the ability to receive notifications as they are posted. This permission must be granted explicitly by you; it cannot be enabled programmatically or without your direct interaction with the system settings. You may revoke this permission at any time through the same settings, which immediately terminates all notification reading by NotiFetch.",
          "Our implementation includes a critical architectural safeguard: a package name allowlist. NotiFetch maintains a curated list of 55+ recognized delivery partner application package identifiers (e.g., com.ubercab.driver, com.grabtaxi.passenger, com.swiggy.delivery). When a notification is posted to the device, our NotificationListenerService callback first checks the source package name against this allowlist. If the notification does not originate from a recognized delivery partner, it is immediately discarded — no data is read, extracted, or stored from that notification. This means banking apps, social media, messaging platforms, health apps, and all other personal applications are never accessed by NotiFetch, even though the Android system delivers all notifications to our listener.",
          "The platform names displayed within the NotiFetch app are customizable by you. We employ a user choice model where you may rename or relabel the detected delivery platforms to your preference. This means the display names in the app may differ from the actual package names, providing you with personalization while we retain only the package identifier for filtering purposes.",
        ],
      },
      {
        heading: "Authentication Data Collection",
        paragraphs: [
          "Account creation data is collected through two methods. For Google OAuth, we use the standard OAuth 2.0 authorization flow, which provides us with your email address and display name from your Google profile. You choose which Google account to use, and Google controls the scope of data shared with us. For email OTP, we use Resend's email delivery service to send a one-time verification code to the email address you provide. We do not collect any additional data during this verification process.",
          "For Android device authentication, we use Firebase Anonymous Authentication, which creates a unique identifier for your device without requiring any personal information. This anonymous token is used solely to associate your device's notification data with your account when you choose to enable cloud sync.",
        ],
      },
    ],
  },
  {
    id: "why-collected",
    icon: Target,
    title: "5. Why We Collect Data (Purpose Limitation)",
    content: [
      {
        paragraphs: [
          "In compliance with the DPDP Act Section 4 (consent for processing), GDPR Article 5(1)(b) (purpose limitation), and CCPA's requirement to disclose the business purposes for data collection, we process your data only for the following specific, explicit, and legitimate purposes:",
        ],
      },
      {
        heading: "Primary Purposes",
        items: [
          "Earnings aggregation and dashboard: To compile, display, and analyze your delivery earnings across multiple platforms in a unified dashboard, providing you with comprehensive financial visibility",
          "Real-time order feed: To display incoming delivery opportunities from your notification stream, including order value, pickup location, dropoff location, and distance, enabling faster decision-making",
          "Historical analytics: To generate earnings trends, performance metrics, and comparative analytics across delivery platforms over time",
          "Push notifications: To alert you about new delivery opportunities that match your preferences via Firebase Cloud Messaging",
        ],
      },
      {
        heading: "Secondary Purposes",
        items: [
          "Account management: To create, authenticate, and maintain your NotiFetch account, including subscription management and profile customization",
          "Service improvement: To analyze anonymized usage patterns for improving app performance, user experience, and developing new features that benefit our user community",
          "Security and fraud prevention: To detect unauthorized access, prevent abuse of the Service, and protect the integrity of our platform and our users",
          "Legal compliance: To fulfill our obligations under applicable laws, respond to valid legal processes, and enforce our Terms of Service",
          "Customer support: To respond to your inquiries, resolve issues, and provide technical assistance when you contact our support team",
        ],
      },
      {
        paragraphs: [
          "We do not process your data for any purpose that is incompatible with the purposes described above. If we intend to process your data for a new purpose, we will notify you and, where required by law, obtain your consent prior to such processing, in accordance with the DPDP Act Section 4 and GDPR Article 6(4).",
        ],
      },
    ],
  },
  {
    id: "data-minimization",
    icon: Minimize2,
    title: "6. Data Minimization",
    content: [
      {
        paragraphs: [
          "NotiFetch adheres strictly to the principle of data minimization as required by the DPDP Act Section 7(3) (data may only be collected to the extent necessary), GDPR Article 5(1)(c), and CCPA's data collection disclosure requirements. We collect only the minimum amount of personal data necessary to provide the Service as described in this policy.",
          "Our data minimization practices are embedded in our technical architecture. The NotificationListenerService implementation reads only the visible text content of notifications (title, text, bigText, subText) and the source package name. We deliberately do not access the Notification.extras Bundle, which could contain additional metadata beyond what is displayed to you. This architectural decision ensures that we never collect more data than what you can already see on your notification shade.",
          "Our package name allowlist is itself a data minimization measure: by filtering notifications at the source and discarding any notification not from a recognized delivery partner, we ensure that vast categories of personal data — banking alerts, health notifications, social media messages, personal communications — are never accessed, even transiently. This approach goes beyond what the Android API requires and represents our commitment to collecting only what is necessary.",
          "Furthermore, the extracted order data (value, pickup, dropoff, distance) is derived from the notification text using on-device pattern matching algorithms. No additional data is fetched from any external source, API, or server to supplement this information. The data you see in NotiFetch is precisely and only what was displayed in the notification on your device.",
        ],
      },
    ],
  },
  {
    id: "legal-basis",
    icon: Scale,
    title: "7. Legal Basis for Processing (GDPR Article 6)",
    content: [
      {
        paragraphs: [
          "Under the GDPR, all processing of personal data must have a lawful basis as specified in Article 6. NotiFetch relies on the following legal bases for processing your personal data:",
        ],
      },
      {
        heading: "Consent (Article 6(1)(a))",
        items: [
          "Processing of notification data: You provide explicit, informed consent when you enable notification listener access for NotiFetch through Android system settings. This consent is specific to the purpose of reading delivery notifications, and you may withdraw it at any time by revoking notification access in your device settings",
          "Push notification delivery: You consent to receive FCM push notifications when you enable this feature in the app",
          "Optional cloud sync: When you choose to sync notification data to our backend, you provide affirmative consent for this data transfer and storage",
        ],
      },
      {
        heading: "Performance of a Contract (Article 6(1)(b))",
        items: [
          "Processing notification data to display your earnings dashboard, order feed, and analytics constitutes processing necessary for the performance of the contract between you and NotiFetch when you register for and use the Service",
          "Account creation and authentication: Processing necessary to set up and maintain your account as part of the service contract",
          "Subscription management: Processing payment references and subscription status to deliver the premium features you have subscribed to",
        ],
      },
      {
        heading: "Legitimate Interests (Article 6(1)(f))",
        items: [
          "Service improvement and analytics: Processing anonymized and aggregated usage data to improve the Service, fix bugs, and develop new features. Our legitimate interest is maintaining and improving a service that benefits our users",
          "Security and fraud prevention: Monitoring for and preventing unauthorized access, abuse, and fraud. Our legitimate interest is protecting our platform, our users, and our business from harm",
          "Crash reporting: Collecting anonymized stack traces to diagnose and fix technical issues. Our legitimate interest is maintaining a stable and reliable Service",
        ],
      },
      {
        heading: "Legal Obligation (Article 6(1)(c))",
        items: [
          "Retention of payment transaction records as required by financial regulations in applicable jurisdictions",
          "Disclosure of data when required by valid legal process, court order, or regulatory requirement",
        ],
      },
      {
        paragraphs: [
          "When we rely on consent, you have the right to withdraw your consent at any time. Withdrawal of consent does not affect the lawfulness of processing carried out prior to the withdrawal. When we rely on legitimate interests, you have the right to object to such processing as described in Section 10.",
        ],
      },
    ],
  },
  {
    id: "data-storage-security",
    icon: Lock,
    title: "8. Data Storage and Security",
    content: [
      {
        heading: "Local Storage (On-Device)",
        paragraphs: [
          "Notification data is primarily stored locally on your Android device using the Room database, a SQLite-based persistence library provided by Google as part of the Android Jetpack suite. This local-first architecture means that your notification data remains on your device by default. Cloud sync is an opt-in feature that you must explicitly enable; it is not activated automatically.",
          "The local Room database is stored in your app's private data directory, which is protected by Android's application sandbox model. Other applications cannot access this data unless your device is rooted and you have granted superuser permissions to another app. We strongly advise against using NotiFetch on rooted devices, as this may compromise the security of your locally stored data.",
        ],
      },
      {
        heading: "Cloud Storage (When Sync is Enabled)",
        paragraphs: [
          "When you opt in to cloud sync, your notification data is transmitted over an encrypted TLS 1.3 connection to our backend infrastructure. The backend is hosted on Vercel, a platform that maintains SOC 2 Type II compliance and provides automatic SSL/TLS encryption for all connections. Your data is stored in a PostgreSQL database hosted by Neon on AWS infrastructure, which provides encryption at rest using AES-256 and maintains compliance with major security standards including SOC 2, ISO 27001, and HIPAA eligibility.",
          "Our database architecture ensures logical isolation between user data. Each user's notification data is associated with their unique user ID and cannot be accessed by other users. Access to the production database is restricted to authorized personnel using role-based access controls with multi-factor authentication, following the principle of least privilege.",
        ],
      },
      {
        heading: "Security Measures",
        items: [
          "Encryption in transit: All data transmitted between your device and our servers is encrypted using TLS 1.3, the latest and most secure version of the Transport Layer Security protocol",
          "Encryption at rest: Cloud-stored data is encrypted using AES-256 on Neon's AWS infrastructure",
          "Access controls: Role-based access with principle of least privilege. Only authorized personnel can access user data, and all access is logged and auditable",
          "Regular security assessments: We conduct periodic security reviews and vulnerability assessments of our infrastructure and application code",
          "Incident response: We maintain a comprehensive incident response plan. In the event of a personal data breach, we will notify affected users and relevant supervisory authorities within 72 hours as required by GDPR Article 33",
          "No credential storage: NotiFetch never stores passwords, API keys, OAuth tokens, or session credentials for any delivery platform or third-party service",
        ],
      },
    ],
  },
  {
    id: "third-party",
    icon: Globe,
    title: "9. Third-Party Services",
    content: [
      {
        paragraphs: [
          "NotiFetch uses the following third-party services to operate and deliver the Service. Each third-party service operates under its own privacy policy, and we have evaluated each provider to ensure they meet our standards for data protection. Where required by the GDPR Article 28, we maintain Data Processing Agreements (DPAs) with each processor.",
        ],
      },
      {
        heading: "Infrastructure and Hosting",
        items: [
          "Vercel (Backend Hosting): Our backend application is deployed on Vercel's platform. Vercel processes HTTP requests on our behalf and may temporarily log request metadata. Vercel maintains SOC 2 Type II compliance. Data may be processed in Vercel's data centers in the United States and Europe. Privacy policy: vercel.com/legal/privacy-policy",
          "Neon / AWS (Database Hosting): Our PostgreSQL database is hosted by Neon on AWS infrastructure. Neon stores and manages our database, which contains synced notification data and user account information. Neon maintains SOC 2 Type II compliance and ISO 27001 certification. Data is stored in AWS regions as configured. Privacy policy: neon.tech/privacy",
        ],
      },
      {
        heading: "Authentication",
        items: [
          "Google OAuth: Used for sign-in with Google. Google shares your email address, name, and profile picture with us upon your authorization. Google's processing is governed by Google's Privacy Policy. Privacy policy: policies.google.com/privacy",
          "Resend (Email OTP): Used to deliver one-time verification codes to your email address. Resend processes only the delivery of the email and does not retain the content of the OTP. Privacy policy: resend.com/legal/privacy-policy",
          "Firebase Anonymous Auth: Used for Android device authentication. Creates an anonymous identifier without collecting personal data. Privacy policy: firebase.google.com/policies/analytics",
        ],
      },
      {
        heading: "Payments",
        items: [
          "Razorpay (India): Processes subscription payments for users in India. Razorpay collects and processes payment card data and banking information directly — NotiFetch never receives full card numbers or banking credentials. Razorpay is PCI-DSS Level 1 compliant and certified by the Reserve Bank of India. Privacy policy: razorpay.com/privacy",
          "Stripe (International): Processes subscription payments for users outside India. Stripe collects and processes payment card data directly — NotiFetch never receives full card numbers. Stripe is PCI-DSS Level 1 compliant. Privacy policy: stripe.com/privacy",
        ],
      },
      {
        heading: "Push Notifications and Analytics",
        items: [
          "Firebase Cloud Messaging (FCM): Delivers push notifications to your device. FCM processes device tokens and notification payloads for delivery purposes. Privacy policy: firebase.google.com/policies/analytics",
          "Firebase Crashlytics: Collects anonymized crash reports and stack traces to help us diagnose and fix bugs. No personally identifiable information is collected in crash reports. Privacy policy: firebase.google.com/policies/analytics",
        ],
      },
      {
        paragraphs: [
          "We do NOT sell, rent, or trade your personal data to any third party for any purpose. We share data with third-party service providers only to the extent necessary for them to perform their designated functions on our behalf, and we require each provider to maintain appropriate security and privacy protections as specified in our Data Processing Agreements.",
        ],
      },
    ],
  },
  {
    id: "data-retention",
    icon: Clock,
    title: "10. Data Retention",
    content: [
      {
        paragraphs: [
          "In compliance with the DPDP Act Section 7(4) (data shall be retained only for as long as necessary), GDPR Article 5(1)(e) (storage limitation), and CCPA's disclosure requirements, we retain your personal data only for as long as necessary to fulfill the purposes described in this policy. Our retention periods are as follows:",
        ],
      },
      {
        heading: "Retention Periods",
        items: [
          "Notification data: Automatically deleted 30 days after collection. This automatic deletion applies to both locally stored data (Room database) and cloud-synced data (PostgreSQL). You may also manually delete notification data at any time through the app or by contacting us",
          "Account data: Retained for the duration your account is active. Upon account deletion, all associated data is permanently deleted within 30 days, except where retention is required by law",
          "Payment records: Transaction reference IDs and subscription statuses are retained for 7 years as required by financial regulations in applicable jurisdictions. Full payment card details are never stored by NotiFetch",
          "Usage analytics (anonymized): Anonymized and aggregated usage data that cannot identify individual users may be retained indefinitely for service improvement purposes",
          "Crash reports: Anonymized crash data is retained for 90 days, after which it is permanently deleted",
          "Firebase Cloud Messaging tokens: Retained while your account is active or until you disable push notifications. Deleted within 30 days of account deletion or token invalidation",
          "Authentication data: Retained for the duration of your account. Deleted within 30 days of account deletion",
        ],
      },
      {
        paragraphs: [
          "When the applicable retention period expires, your data is securely and permanently deleted from our systems. For cloud-synced data, deletion is performed using secure deletion methods that prevent recovery. For locally stored data, deletion is performed through the Room database, which permanently removes records from the SQLite database file.",
        ],
      },
    ],
  },
  {
    id: "your-rights",
    icon: UserCheck,
    title: "11. Your Rights",
    content: [
      {
        paragraphs: [
          "Depending on your jurisdiction, you are entitled to various rights regarding your personal data. NotiFetch is committed to facilitating the exercise of these rights regardless of where you reside, though specific rights may vary by applicable law.",
        ],
      },
      {
        heading: "Rights Under the DPDP Act (India)",
        items: [
          "Right to access (Section 9(1)): You have the right to obtain a summary of your personal data that is being processed by NotiFetch, including the categories of data processed, the purposes of processing, and the identity of any fiduciaries with whom your data has been shared",
          "Right to correction and erasure (Section 9(2)): You have the right to correct, update, or erase your personal data. You may request the deletion of your data at any time, and we are obligated to comply within the timeframe prescribed by the DPDP Act",
          "Right to nominate (Section 9(3)): You have the right to nominate another individual to exercise your data rights on your behalf in the event of your death or incapacity",
          "Right to withdraw consent (Section 8): You may withdraw your consent for data processing at any time. Withdrawal of consent shall not affect the lawfulness of processing based on consent before its withdrawal. Upon withdrawal, we will cease processing your data and delete it within the prescribed timeframe, except where retention is required by law",
          "Right to grievance redressal (Section 10): You have the right to file a grievance with our Grievance Officer if you believe your data rights have been violated. See Section 18 for Grievance Officer details",
        ],
      },
      {
        heading: "Rights Under the GDPR (EU/EEA)",
        items: [
          "Right of access (Article 15): You have the right to obtain confirmation of whether your personal data is being processed, and access to that data along with information about the purposes, categories, recipients, retention periods, and your rights",
          "Right to rectification (Article 16): You have the right to request the correction of inaccurate personal data and the completion of incomplete data",
          "Right to erasure / 'Right to be Forgotten' (Article 17): You have the right to request the deletion of your personal data. We will comply unless retention is necessary for legal obligations, the establishment/exercise/defense of legal claims, or archiving purposes in the public interest",
          "Right to restriction of processing (Article 18): You have the right to request restriction of processing when you contest the accuracy of data, when processing is unlawful but you prefer restriction over erasure, when we no longer need the data but you need it for legal claims, or when you have objected to processing pending verification of our legitimate grounds",
          "Right to data portability (Article 20): You have the right to receive your personal data in a structured, commonly used, and machine-readable format (JSON/CSV), and to transmit that data to another controller without hindrance",
          "Right to object (Article 21): You have the right to object to processing based on legitimate interests or the performance of a task in the public interest. We will cease processing unless we demonstrate compelling legitimate grounds that override your interests",
          "Right not to be subject to automated decision-making (Article 22): You have the right not to be subject to decisions based solely on automated processing that produce legal or similarly significant effects. NotiFetch does not engage in automated decision-making that produces such effects",
          "Right to lodge a complaint (Article 77): You have the right to lodge a complaint with a supervisory authority in the EU/EEA member state of your habitual residence, place of work, or place of the alleged infringement",
        ],
      },
      {
        heading: "Rights Under the CCPA (California)",
        items: [
          "Right to know (Cal. Civ. Code §1798.100): You have the right to request disclosure of the categories and specific pieces of personal information we have collected about you in the preceding 12 months, the purposes for which it was collected, the categories of sources, and the categories of third parties with whom it was shared",
          "Right to delete (Cal. Civ. Code §1798.105): You have the right to request deletion of your personal information. We will comply and direct our service providers to delete the data from their records, subject to enumerated exceptions (e.g., legal compliance, security, debugging)",
          "Right to opt-out of sale (Cal. Civ. Code §1798.120): NotiFetch does NOT sell personal information, and we do NOT share personal information for cross-context behavioral advertising. No action is required on your part to opt out, as we do not engage in these practices",
          "Right to non-discrimination (Cal. Civ. Code §1798.125): We will not discriminate against you for exercising any of your CCPA rights. We will not deny, charge different prices, or provide a different level of quality of service because you exercised a privacy right",
          "Right to limit use of sensitive personal information (Cal. Civ. Code §1798.121): NotiFetch does not collect or process sensitive personal information as defined under the CCPA beyond what is strictly necessary to provide the Service",
        ],
      },
      {
        heading: "Exercising Your Rights",
        paragraphs: [
          "To exercise any of the rights described above, you may contact us at support@notifetch.app or dpo@notifetch.app. We will verify your identity before processing your request to protect against unauthorized access to your personal data. We aim to respond to all verified requests within 30 days, or within 15 days for California residents as required by the CCPA (with a possible 45-day extension for complex requests). You will not be charged a fee for making a request, unless the request is manifestly unfounded or excessive.",
        ],
      },
    ],
  },
  {
    id: "data-deletion-export",
    icon: Trash2,
    title: "12. Data Deletion and Export",
    content: [
      {
        paragraphs: [
          "We believe that you should always be in control of your data. NotiFetch provides straightforward mechanisms for you to delete or export your personal data at any time, without requiring you to contact support (though our support team is always available to assist you).",
        ],
      },
      {
        heading: "Data Deletion",
        items: [
          "In-app deletion: You can delete individual notification records or all notification data directly from the app's settings. Deletion is immediate and irreversible for locally stored data, and cloud-synced data is deleted within 24 hours of the sync",
          "Account deletion: You can delete your entire account through the app's profile settings. Account deletion permanently removes your profile, preferences, notification data, and all associated information. The deletion process is initiated immediately, with full completion within 30 days",
          "Notification listener revocation: You can revoke notification access permission at any time through your Android device settings (Settings → Apps → Special app access → Notification access). This immediately stops all notification collection, though previously collected data remains until you delete it or the 30-day auto-deletion period expires",
          "Request-based deletion: You may also request data deletion by contacting us at support@notifetch.app. We will process verified deletion requests within the timeframes required by applicable law",
        ],
      },
      {
        heading: "Data Export",
        items: [
          "You can export all your personal data from NotiFetch in machine-readable formats (JSON and CSV) directly through the app's settings. This export includes your notification data, earnings records, account information, and preferences",
          "The exported data is generated on-demand and provided as a downloadable file, enabling you to transfer your data to another service or retain it for your personal records in compliance with GDPR Article 20 (data portability) and CCPA disclosure requirements",
          "Export requests can also be made by contacting us at support@notifetch.app. We will provide your data in a structured, commonly used, and machine-readable format within 30 days of verification",
        ],
      },
    ],
  },
  {
    id: "childrens-privacy",
    icon: Baby,
    title: "13. Children's Privacy",
    content: [
      {
        paragraphs: [
          "NotiFetch is not intended for use by individuals under the age of 18. In compliance with the DPDP Act Section 9, which specifically addresses the processing of children's data, the GDPR's enhanced protections for minors (Article 8), and the CCPA's provisions regarding consumers under 16, we do not knowingly collect personal data from children.",
          "Under the DPDP Act Section 9, we are prohibited from processing personal data that is likely to cause harm to children, and we are required to obtain verifiable parental consent before processing a child's data. Given that NotiFetch processes earnings and financial data from delivery platforms — activities inherently associated with adult users — our service is not designed for, marketed to, or directed at children.",
          "If we become aware that we have inadvertently collected personal data from a person under the age of 18, we will take immediate steps to delete that data from our systems, including any cloud-synced data, within 24 hours. If you are a parent or guardian and believe your child has provided personal data to NotiFetch, please contact us immediately at support@notifetch.app so we can take appropriate action.",
          "Our age verification is performed during account creation. Users must confirm they are at least 18 years of age to create an account. While we do not use third-party age verification services, the nature of the Service — aggregating earnings data from delivery platforms that themselves require users to be adults — provides an additional practical safeguard against use by minors.",
        ],
      },
    ],
  },
  {
    id: "international-transfers",
    icon: ArrowRightLeft,
    title: "14. International Data Transfers",
    content: [
      {
        paragraphs: [
          "NotiFetch is a global service with users across multiple jurisdictions, including India, the European Union, the United Kingdom, and the United States. When your data is transferred across international borders, we ensure that appropriate safeguards are in place in compliance with the DPDP Act, GDPR Chapter V (Articles 44-50), and other applicable data transfer regulations.",
        ],
      },
      {
        heading: "Transfer Mechanisms",
        items: [
          "Standard Contractual Clauses (SCCs): Where data is transferred from the EU/EEA to countries that have not been deemed to provide an adequate level of data protection, we rely on Standard Contractual Clauses approved by the European Commission, which impose obligations on both the data exporter and importer to ensure that your data receives an adequate level of protection",
          "Adequacy decisions: Where the European Commission has recognized a country as providing an adequate level of data protection, transfers to that country may proceed on that basis. We monitor adequacy decisions and update our transfer mechanisms accordingly",
          "India DPDP compliance: For users in India, we comply with the DPDP Act's requirements regarding the transfer of personal data outside India. We ensure that your data is transferred only to countries that the Indian government has approved, or that appropriate safeguards are in place to protect your data during international transfers",
          "Intra-group transfers: Where data is transferred within the NotiFetch group of companies, we maintain binding internal policies and procedures that ensure a consistent level of data protection across all entities",
        ],
      },
      {
        heading: "Data Processing Locations",
        items: [
          "Vercel (backend): May process data in data centers located in the United States and Europe, with automatic edge routing based on request origin",
          "Neon / AWS (database): Data is stored in the AWS region configured for our database deployment. You may contact us for the current region configuration",
          "Firebase (authentication, FCM, Crashlytics): Google processes data in accordance with its global infrastructure, with primary processing in the United States and Europe",
          "Razorpay (India payments): Data processing occurs within India, in compliance with RBI data localization requirements",
          "Stripe (international payments): Data may be processed in the United States and other jurisdictions as described in Stripe's privacy policy",
        ],
      },
    ],
  },
  {
    id: "cookies",
    icon: Cookie,
    title: "15. Cookies",
    content: [
      {
        paragraphs: [
          "NotiFetch's web platform uses cookies and similar tracking technologies to provide and improve the Service. Our mobile application does not use traditional browser cookies, but may use locally stored identifiers for similar purposes. This section describes our cookie practices in compliance with the GDPR (Article 6(1)(a) consent requirement for non-essential cookies) and the ePrivacy Directive.",
        ],
      },
      {
        heading: "Types of Cookies We Use",
        items: [
          "Essential cookies: These cookies are strictly necessary for the operation of the Service and cannot be disabled. They include session authentication cookies (NextAuth.js), CSRF protection tokens, and security-related cookies. These cookies do not track you across other websites or services",
          "Functional cookies: These cookies store your preferences such as theme selection (light/dark mode), notification settings, and display configurations. They enhance your experience but are not essential for the Service to function. You may disable these through your browser settings, though some features may be affected",
          "Analytics cookies: We may use privacy-focused analytics cookies to understand how users interact with our web platform. These cookies help us identify popular features, diagnose usability issues, and improve the overall experience. All analytics data is aggregated and anonymized",
        ],
      },
      {
        heading: "What We Do NOT Do",
        items: [
          "We do NOT use advertising cookies or allow third-party ad tracking networks to set cookies on our platform",
          "We do NOT use cookies to track you across other websites or applications",
          "We do NOT sell cookie-based tracking data to third parties",
          "All cookies on our platform are first-party cookies set by NotiFetch, not by external advertising or tracking networks",
        ],
      },
      {
        paragraphs: [
          "You can manage your cookie preferences through your browser settings. Most browsers allow you to block or delete cookies, set preferences for certain sites, and block third-party cookies. Please note that disabling essential cookies may affect the functionality of the Service. For more information about cookies, visit allaboutcookies.org.",
        ],
      },
    ],
  },
  {
    id: "changes",
    icon: FileEdit,
    title: "16. Changes to This Policy",
    content: [
      {
        paragraphs: [
          "We may update this Privacy Policy from time to time to reflect changes in our practices, technologies, legal requirements, or other factors. When we make material changes to this policy, we will notify you through one or more of the following methods: a prominent notice within the NotiFetch application, an email notification to the address associated with your account, or a notification on our website at https://d2-liart-nine.vercel.app.",
          "In compliance with the DPDP Act Section 8 (notice of changes to processing practices) and GDPR Article 13(3) (obligation to inform data subjects of changes), we will provide you with notice of material changes at least 15 days before they take effect. For changes that require new consent under the GDPR or the DPDP Act, we will obtain your affirmative consent before implementing the changes. Your continued use of the Service after the effective date of any changes constitutes your acceptance of the updated Privacy Policy.",
          "We maintain a version history of this Privacy Policy, and you may request a copy of any previous version by contacting us at support@notifetch.app. The \"Last Updated\" date at the top of this policy always reflects the date of the most recent revision. We encourage you to review this policy periodically to stay informed about how we protect your data.",
        ],
      },
    ],
  },
  {
    id: "contact",
    icon: Mail,
    title: "17. Contact Information",
    content: [
      {
        paragraphs: [
          "If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, we encourage you to contact us through the following channels. We are committed to responding to all verified requests within the timeframes required by applicable law.",
        ],
      },
      {
        heading: "Contact Channels",
        items: [
          "General support and privacy inquiries: support@notifetch.app",
          "Data Protection Officer (GDPR matters): dpo@notifetch.app",
          "Legal inquiries: legal@notifetch.app",
          "Security concerns and vulnerability reports: security@notifetch.app",
          "CCPA rights requests: privacy@notifetch.app (California residents may also call our toll-free number at 1-800-NOTI-FETCH)",
          "App Website: https://d2-liart-nine.vercel.app",
        ],
      },
      {
        heading: "Response Times",
        items: [
          "General inquiries: We aim to respond within 7 business days",
          "Data access and portability requests: Within 30 days of identity verification (GDPR Article 12(3))",
          "Data deletion requests: Within 30 days, or within 15 days for California residents under CCPA (Cal. Civ. Code §1798.105)",
          "Grievance Officer (India): Within 30 days as prescribed under the DPDP Act Section 10",
          "Data breach notifications: Within 72 hours of becoming aware of a breach affecting your personal data (GDPR Article 33)",
        ],
      },
      {
        paragraphs: [
          "Before processing any request related to your personal data, we will verify your identity to prevent unauthorized access. This verification may require you to confirm your email address, provide account details, or complete additional security steps. We will inform you of the verification process at the time of your request.",
        ],
      },
    ],
  },
  {
    id: "grievance-officer",
    icon: UserCog,
    title: "18. Grievance Officer (India DPDP Act)",
    content: [
      {
        paragraphs: [
          "In compliance with the Digital Personal Data Protection Act, 2023, Section 10, NotiFetch has appointed a Grievance Officer to address and resolve grievances raised by Data Principals (users) in India. The Grievance Officer is responsible for acknowledging and resolving your complaints related to the processing of your personal data.",
        ],
      },
      {
        heading: "Grievance Officer Details",
        items: [
          "Designation: Grievance Officer — Data Protection",
          "Email: grievance@notifetch.app",
          "Contact Hours: Monday to Friday, 9:00 AM to 6:00 PM IST (Indian Standard Time)",
          "Response Time: Acknowledgment within 48 hours of receipt; resolution within 30 calendar days as prescribed under the DPDP Act Section 10(2)",
        ],
      },
      {
        paragraphs: [
          "To file a grievance, please send an email to grievance@notifetch.app with the subject line \"Data Protection Grievance\" and include your registered email address, a clear description of your grievance, and any relevant supporting information. The Grievance Officer will acknowledge receipt of your grievance within 48 hours and work towards a resolution within the prescribed timeframe.",
          "If you are not satisfied with the resolution provided by the Grievance Officer, you have the right to escalate your grievance to the Data Protection Board of India as established under the DPDP Act. The Board serves as the independent supervisory authority responsible for enforcing the provisions of the DPDP Act and protecting the rights of Data Principals.",
        ],
      },
    ],
  },
];

const tocItems = sections.map((s) => ({
  id: s.id,
  title: s.title,
  icon: s.icon,
}));

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Fixed Top Nav */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center gap-3">
          <BackButton fallback="/" />
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <h1 className="font-bold text-base">Privacy Policy</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Title Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-sm font-medium mb-4">
            <Shield className="w-4 h-4" />
            Legal Document
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Your privacy matters to us. This policy explains how NotiFetch collects, uses, and protects your personal data when you use our service, in compliance with the India DPDP Act 2023, EU GDPR, CCPA, and Google Play Store Data Safety requirements.
          </p>
          <p className="text-sm text-muted-foreground mt-3">
            Effective Date: <span className="font-semibold text-foreground">June 9, 2026</span>
            {" "}&middot; Last Updated: <span className="font-semibold text-foreground">June 9, 2026</span>
          </p>
        </div>

        {/* Important Notice */}
        <Card className="mb-8 border-amber-500/20 bg-amber-500/5">
          <CardContent className="p-4 sm:p-6">
            <div className="flex gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold mb-1">Important Notice</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  NotiFetch reads delivery notifications from your phone using Android&apos;s NotificationListenerService —
                  we are NOT a delivery platform. We do not access delivery platform APIs, ask for login credentials,
                  dispatch orders, employ drivers, or process deliveries. We ONLY read notifications from 55+ recognized
                  delivery partner apps. Banking, social media, and personal app notifications are NEVER accessed.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Compliance Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: "India DPDP 2023", desc: "Digital Personal Data Protection" },
            { label: "EU GDPR", desc: "General Data Protection Regulation" },
            { label: "CCPA", desc: "California Consumer Privacy Act" },
            { label: "Play Store", desc: "Data Safety Compliant" },
          ].map((badge) => (
            <Card key={badge.label} className="border-border/50 text-center">
              <CardContent className="p-3 sm:p-4">
                <Shield className="w-5 h-5 text-amber-500 mx-auto mb-1.5" />
                <p className="text-xs font-semibold mb-0.5">{badge.label}</p>
                <p className="text-[10px] sm:text-[11px] text-muted-foreground leading-tight">{badge.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Table of Contents */}
        <Card className="mb-10 border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground font-semibold">
              Table of Contents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {tocItems.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    <Icon className="w-4 h-4 text-amber-500 shrink-0" />
                    <span className="truncate">{item.title}</span>
                  </a>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Sections */}
        <div className="space-y-8">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <Card key={section.id} id={section.id} className="scroll-mt-20 border-border/50">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-amber-500" />
                    </div>
                    <CardTitle className="text-lg sm:text-xl font-bold leading-tight">
                      {section.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-5">
                  {section.content.map((block, idx) => (
                    <div key={idx}>
                      {block.heading && (
                        <h3 className="font-semibold text-foreground mb-2 text-sm sm:text-base">
                          {block.heading}
                        </h3>
                      )}
                      {block.paragraphs && block.paragraphs.length > 0 && (
                        <div className="space-y-3">
                          {block.paragraphs.map((para, pIdx) => (
                            <p key={pIdx} className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                              {para}
                            </p>
                          ))}
                        </div>
                      )}
                      {block.items && block.items.length > 0 && (
                        <ul className="space-y-2 mt-2">
                          {block.items.map((item, i) => (
                            <li key={i} className="flex gap-3 text-muted-foreground leading-relaxed text-sm sm:text-base">
                              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-amber-500/60 shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Bottom Contact Card */}
        <Card className="mt-12 bg-gradient-to-br from-amber-500/5 to-orange-600/5 border-amber-500/20">
          <CardContent className="p-6 text-center">
            <Mail className="w-8 h-8 text-amber-500 mx-auto mb-3" />
            <h3 className="font-bold text-lg mb-2">Questions About Your Privacy?</h3>
            <p className="text-muted-foreground mb-4 max-w-md mx-auto leading-relaxed">
              We&apos;re here to help. Reach out to our team for any privacy-related inquiries or to exercise your data rights under the DPDP Act, GDPR, or CCPA.
            </p>
            <div className="space-y-1.5">
              <a href="mailto:support@notifetch.app" className="block text-amber-500 hover:text-amber-400 font-semibold transition-colors">
                support@notifetch.app
              </a>
              <a href="mailto:dpo@notifetch.app" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Data Protection Officer: dpo@notifetch.app
              </a>
              <a href="mailto:grievance@notifetch.app" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Grievance Officer (India): grievance@notifetch.app
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-border text-center pb-8">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} NotiFetch, Inc. All rights reserved.
          </p>
        </footer>
      </main>
    </div>
  );
}
