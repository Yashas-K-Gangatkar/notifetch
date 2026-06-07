import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "next-themes";
import { PWARegister } from "@/components/pwa-register";

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
  title: "DeliveryBoost - One Feed. All Platforms. Every Delivery. Worldwide.",
  description: "Aggregate all your delivery notifications into a single real-time feed. From food to freight, groceries to pharmacy — every platform, every category, every continent.",
  keywords: ["delivery", "driver", "Uber Eats", "DoorDash", "Swiggy", "Zomato", "Instacart", "notifications", "earnings", "delivery aggregator"],
  authors: [{ name: "DeliveryBoost" }],
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
    title: "DeliveryBoost",
  },
  openGraph: {
    title: "DeliveryBoost - One Feed. All Platforms. Every Delivery. Worldwide.",
    description: "Aggregate all your delivery notifications into a single real-time feed.",
    siteName: "DeliveryBoost",
    type: "website",
  },
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
          {children}
          <Toaster />
          <PWARegister />
        </ThemeProvider>
      </body>
    </html>
  );
}
