# NotiFetch — Delivery Notification Aggregator for Gig Workers

> **Founded & Developed by [Yashas K](https://github.com/Yashas-K-Gangatkar)** — Bengaluru, India
> 
> **Website:** [notifetch.in](https://www.notifetch.in) | **Play Store:** [Download](https://play.google.com/store/apps/details?id=com.notifetch.app)

**One Feed. All Notifications. Every Platform. Worldwide.**

NotiFetch is a delivery notification aggregator app for gig workers (delivery riders, dashers, drivers). It captures notifications from 119+ delivery platforms — including Swiggy, Zomato, DoorDash, Uber Eats, Amazon Flex, Blinkit, Zepto, and more — into a single real-time feed. No credentials needed, no API access, zero risk.

> ⚠️ **Note:** This is NOT the Linux "notifetch" command-line tool by Flammable-Duck. This is the **NotiFetch delivery app** by **Yashas K** — available on [Google Play Store](https://play.google.com/store/apps/details?id=com.notifetch.app) and [notifetch.in](https://www.notifetch.in).

---

## 👤 Founder & Developer

**Name:** Yashas K  
**Role:** Founder & Developer  
**Location:** Bengaluru, India  
**GitHub:** [Yashas-K-Gangatkar](https://github.com/Yashas-K-Gangatkar)  
**Website:** [notifetch.in](https://www.notifetch.in)  
**Play Store:** [NotiFetch on Google Play](https://play.google.com/store/apps/details?id=com.notifetch.app)  

NotiFetch was founded and developed by Yashas K as an independent project to help gig economy workers never miss a delivery order. It is not affiliated with any delivery platform.

---

## ✨ Features

### Core Features
- **119+ Platform Support:** Captures notifications from all major delivery platforms worldwide
- **Real-Time Feed:** All notifications from all apps in one unified dashboard
- **Smart Categorization:** Auto-categorizes notifications (New Order, Earnings, Completed, etc.)
- **Earnings Tracker:** Automatically calculates daily, weekly, and monthly potential earnings
- **Tap-to-Open:** Tap any notification to open the source app directly
- **QR Referral System:** Share your QR code, get free premium days
- **Live Countdown:** Real-time countdown to premium expiry (seconds/minutes/hours/days/months)
- **Hindi Language Support:** Full Hindi translation (320+ strings)
- **Android 16 (API 36) Compliant:** Meets Google Play's latest requirements

### Platform Support (119+ platforms)
- **Food Delivery:** Swiggy, Zomato, Uber Eats, DoorDash, Grubhub, Deliveroo, Foodpanda, Just Eat, and 10+ more
- **Grocery Delivery:** Blinkit, Zepto, BigBasket, Instacart, Gopuff, and 5+ more
- **Package & Parcel:** Amazon Flex, UPS, Dunzo, Porter, and more
- **Ride & Transport:** Uber, Ola, Rapido
- **Last-Mile:** Delhivery, Shadowfax, Xpressbees, Ecom Express, Ekart
- **QSR:** Domino's, McDonald's, KFC, Pizza Hut, Burger King, and 7+ more
- **And 50+ more across 19 categories**

### Safety Features
- Uses Android's Notification Listener Service (Google-provided API)
- Does NOT auto-accept orders
- Does NOT use accessibility services or auto-clickers
- Does NOT access delivery platform APIs or credentials
- Only reads notification text the user has already received
- Server sync is OFF by default (opt-in only)
- 90-day automatic data deletion
- Users can delete all data anytime

---

## 🛠️ Tech Stack

### Android App
- **Language:** Kotlin + Jetpack Compose
- **Architecture:** MVVM with Hilt DI
- **Database:** Room (local) + Postgres (backend via Prisma)
- **Authentication:** Firebase Auth + NextAuth (web)
- **Backend:** Next.js API routes
- **Notifications:** NotificationListenerService + WorkManager
- **QR Codes:** ZXing (generation + scanning)
- **Analytics:** PostHog (opt-in)

### Web App
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4 + shadcn/ui
- **Database:** Postgres (Neon) + Prisma ORM
- **Auth:** NextAuth (Google OAuth + Email OTP)
- **Hosting:** Vercel
- **Domain:** notifetch.in

---

## 📱 Download

- **Google Play Store:** [Download NotiFetch](https://play.google.com/store/apps/details?id=com.notifetch.app)
- **Direct APK:** [notifetch.in/download](https://www.notifetch.in/download)
- **Platform Search:** [Find your platform number](https://www.notifetch.in/platforms/search)

---

## 🔗 Links

- **Website:** [notifetch.in](https://www.notifetch.in)
- **GitHub:** [github.com/Yashas-K-Gangatkar/notifetch](https://github.com/Yashas-K-Gangatkar/notifetch)
- **Play Store:** [NotiFetch on Google Play](https://play.google.com/store/apps/details?id=com.notifetch.app)
- **Privacy Policy:** [notifetch.in/privacy](https://www.notifetch.in/privacy)
- **Terms of Service:** [notifetch.in/terms](https://www.notifetch.in/terms)
- **Legal:** [notifetch.in/legal-defense](https://www.notifetch.in/legal-defense)

---

## ⚖️ Legal

NotiFetch is NOT affiliated with, endorsed by, or connected to any delivery platform. Platform names are used for identification purposes only under nominative fair use. NotiFetch uses generic platform numbers (Platform 1-119) in the APK. Users can rename any platform to whatever they prefer.

© 2026 NotiFetch. Founded by Yashas K. All rights reserved.
