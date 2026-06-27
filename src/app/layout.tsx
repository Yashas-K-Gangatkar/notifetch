import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/components/providers";
import { PWARegister } from "@/components/pwa-register";
import { PWAInstallPrompt } from "@/components/pwa-install-prompt";
import { OfflineIndicator } from "@/components/offline-indicator";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SentryInit } from "@/components/sentry-init";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#f59e0b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "NotiFetch — One Feed. All Notifications. Every Platform. Worldwide.",
  description: "Aggregate all your delivery notifications into a single real-time feed — no credentials needed. From food to freight, groceries to pharmacy — every platform, every category, every continent.",
  keywords: ["delivery", "driver", "notifications", "notification listener", "earnings", "delivery aggregator", "gig worker", "multi-platform"],
  authors: [{ name: "NotiFetch" }],
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "32x32" },
      { url: "/icons/icon-192x192.png", sizes: "192x192" },
    ],
    apple: "/icons/icon-192x192.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "NotiFetch",
  },
  openGraph: {
    title: "NotiFetch — One Feed. All Notifications. Every Platform. Worldwide.",
    description: "Aggregate all your delivery notifications into a single real-time feed — no credentials needed. From food to freight, groceries to pharmacy — every platform, every category, every continent.",
    siteName: "NotiFetch",
    type: "website",
    url: "https://notifetch.in",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "NotiFetch — One Feed. All Notifications. Every Platform. Worldwide.",
    description: "Aggregate all your delivery notifications into a single real-time feed — no credentials needed.",
    creator: "@notifetch",
  },
  metadataBase: new URL("https://notifetch.in"),
  alternates: {
    canonical: "https://notifetch.in",
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <OfflineIndicator />
            <SentryInit />
            {children}
            <Toaster />
            <PWARegister />
            <PWAInstallPrompt />
            <Analytics />
            <SpeedInsights />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
