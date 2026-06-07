import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { db } from "@/lib/db";

// ─── Crash if NEXTAUTH_SECRET is missing in production ───────────────────────
if (process.env.NODE_ENV === "production" && !process.env.NEXTAUTH_SECRET) {
  throw new Error(
    "FATAL: NEXTAUTH_SECRET must be set in production. " +
    "Generate one with: openssl rand -base64 32"
  );
}

// ─── In-memory rate limiter for OTP send ─────────────────────────────────────
const otpSendLimiter = new Map<string, { count: number; resetAt: number }>();
const OTP_SEND_MAX = 5;           // max OTP requests per email
const OTP_SEND_WINDOW = 15 * 60 * 1000; // 15 minutes

function checkOtpSendLimit(email: string): boolean {
  const now = Date.now();
  const entry = otpSendLimiter.get(email);
  if (!entry || now > entry.resetAt) {
    otpSendLimiter.set(email, { count: 1, resetAt: now + OTP_SEND_WINDOW });
    return true;
  }
  if (entry.count >= OTP_SEND_MAX) return false;
  entry.count++;
  return true;
}

// ─── In-memory rate limiter for OTP verify (brute-force protection) ──────────
const otpVerifyLimiter = new Map<string, { attempts: number; lockedUntil: number }>();
const OTP_VERIFY_MAX_ATTEMPTS = 5;
const OTP_VERIFY_LOCKOUT = 15 * 60 * 1000; // 15 minutes lockout

function checkOtpVerifyLimit(email: string): { allowed: boolean; remainingAttempts: number } {
  const entry = otpVerifyLimiter.get(email);
  const now = Date.now();

  if (!entry || now > entry.lockedUntil) {
    otpVerifyLimiter.set(email, { attempts: 0, lockedUntil: 0 });
    return { allowed: true, remainingAttempts: OTP_VERIFY_MAX_ATTEMPTS };
  }

  if (entry.attempts >= OTP_VERIFY_MAX_ATTEMPTS) {
    return { allowed: false, remainingAttempts: 0 };
  }

  return { allowed: true, remainingAttempts: OTP_VERIFY_MAX_ATTEMPTS - entry.attempts };
}

function recordFailedVerifyAttempt(email: string): void {
  const entry = otpVerifyLimiter.get(email) || { attempts: 0, lockedUntil: 0 };
  entry.attempts++;
  if (entry.attempts >= OTP_VERIFY_MAX_ATTEMPTS) {
    entry.lockedUntil = Date.now() + OTP_VERIFY_LOCKOUT;
  }
  otpVerifyLimiter.set(email, entry);
}

function clearVerifyAttempts(email: string): void {
  otpVerifyLimiter.delete(email);
}

// ─── OTP Generation ─────────────────────────────────────────────────────────
export function generateOTP(): string {
  // Use crypto.randomInt for cryptographic randomness (not Math.random)
  const { randomInt } = require("crypto");
  return randomInt(100000, 1000000).toString();
}

// ─── Send OTP (stored in DB, NOT in-memory) ─────────────────────────────────
export async function sendOTP(email: string): Promise<{ success: boolean; error?: string }> {
  // Rate limit check
  if (!checkOtpSendLimit(email)) {
    return { success: false, error: "Too many OTP requests. Please try again in 15 minutes." };
  }

  const code = generateOTP();
  const expires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

  // Delete any existing OTP for this email, then create new one
  await db.verificationToken.deleteMany({ where: { identifier: email } });
  await db.verificationToken.create({
    data: { identifier: email, token: code, expires },
  });

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_API_KEY) {
    // In development, we skip sending but still store the OTP in DB.
    // NEVER log OTPs to console in any environment.
    if (process.env.NODE_ENV === "development") {
      console.log("[DEV] OTP email would be sent to: " + email);
    }
    return { success: true };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: "Bearer " + RESEND_API_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "NotiFetch <noreply@notifetch.app>",
        to: [email],
        subject: "Your NotiFetch Login Code",
        html: '<div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;padding:32px;text-align:center"><h1 style="color:#f59e0b;font-size:24px">NotiFetch</h1><p style="color:#9ca3af;font-size:14px">One Feed. All Notifications. Zero Credentials.</p><div style="background:#1f2937;border-radius:12px;padding:32px;margin-top:24px"><p style="color:#d1d5db;font-size:14px">Your login code is:</p><p style="font-size:36px;font-weight:bold;color:#f59e0b;letter-spacing:8px">' + code + '</p><p style="color:#9ca3af;font-size:12px">This code expires in 5 minutes.</p></div><p style="color:#6b7280;font-size:12px;margin-top:24px">If you did not request this code, you can safely ignore this email.</p></div>',
      }),
    });
    if (!response.ok) return { success: false, error: "Failed to send email" };
    return { success: true };
  } catch {
    return { success: false, error: "Failed to send email" };
  }
}

// ─── Verify OTP (from DB, with brute-force protection) ──────────────────────
export async function verifyOTP(email: string, code: string): Promise<{ valid: boolean; error?: string }> {
  // Brute-force check
  const limitCheck = checkOtpVerifyLimit(email);
  if (!limitCheck.allowed) {
    return { valid: false, error: "Too many failed attempts. Please request a new OTP." };
  }

  // Look up in database
  const token = await db.verificationToken.findUnique({
    where: { identifier_token: { identifier: email, token: code } },
  });

  if (!token) {
    recordFailedVerifyAttempt(email);
    return { valid: false, error: "Invalid OTP code" };
  }

  // Check expiration
  if (token.expires < new Date()) {
    await db.verificationToken.delete({ where: { identifier_token: { identifier: email, token: code } } });
    recordFailedVerifyAttempt(email);
    return { valid: false, error: "OTP has expired. Please request a new one." };
  }

  // Valid — delete used token and clear attempts
  await db.verificationToken.delete({ where: { identifier_token: { identifier: email, token: code } } }).catch(() => {});
  clearVerifyAttempts(email);

  return { valid: true };
}

// ─── Auth Options ────────────────────────────────────────────────────────────
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "otp",
      name: "Email OTP",
      credentials: {
        email: { label: "Email", type: "email" },
        code: { label: "OTP Code", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.code) {
          throw new Error("Email and OTP code are required");
        }

        const result = await verifyOTP(credentials.email, credentials.code);
        if (!result.valid) {
          throw new Error(result.error || "Invalid or expired OTP code");
        }

        let user = await db.user.findUnique({ where: { email: credentials.email } });
        if (!user) {
          user = await db.user.create({ data: { email: credentials.email, emailVerified: new Date() } });
        } else if (!user.emailVerified) {
          await db.user.update({ where: { id: user.id }, data: { emailVerified: new Date() } });
        }
        return { id: user.id, email: user.email, name: user.name, image: user.image, plan: user.plan, role: user.role };
      },
    }),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
  ],
  session: { strategy: "jwt", maxAge: 24 * 60 * 60 }, // 24-hour JWT expiry
  pages: { signIn: "/auth/signin" },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign-in: set claims from DB
      if (user) {
        token.id = user.id;
        token.plan = (user as Record<string, unknown>).plan ?? "free";
        token.role = (user as Record<string, unknown>).role ?? "driver";
      }

      // Google OAuth: link or create user
      if (account?.provider === "google" && user) {
        const existingUser = await db.user.findUnique({ where: { email: user.email! } });
        if (!existingUser) {
          const newUser = await db.user.create({
            data: {
              email: user.email!,
              name: user.name ?? null,
              image: user.image ?? null,
              emailVerified: new Date(),
            },
          });
          token.id = newUser.id;
          token.plan = newUser.plan;
          token.role = newUser.role;
        } else {
          token.id = existingUser.id;
          token.plan = existingUser.plan;
          token.role = existingUser.role;
          const existingAccount = await db.account.findUnique({
            where: {
              provider_providerAccountId: {
                provider: "google",
                providerAccountId: account.providerAccountId,
              },
            },
          });
          if (!existingAccount) {
            await db.account.create({
              data: {
                userId: existingUser.id,
                type: "oauth",
                provider: "google",
                providerAccountId: account.providerAccountId,
                access_token: account.access_token,
                refresh_token: account.refresh_token,
                expires_at: account.expires_at,
                token_type: account.token_type,
                scope: account.scope,
                id_token: account.id_token,
              },
            });
          }
        }
      }

      // Re-validate plan/role from DB on every token refresh (every hour by default)
      // This prevents stale JWT claims after subscription changes
      if (token.id && !user && !account) {
        try {
          const dbUser = await db.user.findUnique({
            where: { id: token.id as string },
            select: { plan: true, role: true },
          });
          if (dbUser) {
            token.plan = dbUser.plan;
            token.role = dbUser.role;
          }
        } catch {
          // If DB lookup fails, keep existing claims (don't block login)
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as Record<string, unknown>).plan = token.plan;
        (session.user as Record<string, unknown>).role = token.role;
      }
      return session;
    },
  },
};
