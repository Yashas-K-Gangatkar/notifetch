import type { NextConfig } from "next";

const securityHeaders = [
  // Prevent clickjacking
  { key: "X-Frame-Options", value: "DENY" },
  // Prevent MIME-sniffing
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Referrer policy
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // XSS Protection (legacy but still useful for older browsers)
  { key: "X-XSS-Protection", value: "1; mode=block" },
  // HSTS — force HTTPS for 1 year
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
  // Permissions Policy — deny browser features we don't use
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(self)",
  },
  // Content Security Policy
  // v2.9.81 SECURITY FIX: 'unsafe-eval' is now restricted to development only.
  // In production, only 'unsafe-inline' (needed for Next.js inline scripts) is allowed.
  // 'unsafe-eval' was previously global — it's required for Next.js HMR in dev but
  // is a known XSS vector in production. Next.js 16 works without it in prod.
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self' blob: data:",
      `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""} blob: https://checkout.razorpay.com https://*.razorpay.com https://js.stripe.com`,
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://*.razorpay.com",
      "font-src 'self' https://fonts.gstatic.com https://*.razorpay.com",
      "img-src 'self' data: blob: https:",
      "connect-src 'self' blob: wss: https://api.resend.com https://*.googleapis.com https://*.google.com https://*.razorpay.com",
      "frame-src 'self' https://js.stripe.com https://*.google.com https://*.razorpay.com",
      "worker-src 'self' blob: https://*.razorpay.com",
      "frame-ancestors 'none'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  skipTrailingSlashRedirect: true,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/array/:path*",
        destination: "https://us-assets.i.posthog.com/array/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
    ];
  },
};

export default nextConfig;
