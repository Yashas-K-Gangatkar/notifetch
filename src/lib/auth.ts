import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { db } from "@/lib/db";

const otpStore = new Map<string, { code: string; expires: number }>();

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function sendOTP(email: string): Promise<{ success: boolean; error?: string }> {
  const code = generateOTP();
  otpStore.set(email, { code, expires: Date.now() + 5 * 60 * 1000 });
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_API_KEY) {
    console.log("[DEV] OTP for " + email + ": " + code);
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
  } catch { return { success: false, error: "Failed to send email" }; }
}

export function verifyOTP(email: string, code: string): boolean {
  const stored = otpStore.get(email);
  if (!stored) return false;
  if (Date.now() > stored.expires) { otpStore.delete(email); return false; }
  if (stored.code !== code) return false;
  otpStore.delete(email);
  return true;
}

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
        if (!credentials?.email || !credentials?.code) throw new Error("Email and OTP code are required");
        if (!verifyOTP(credentials.email, credentials.code)) throw new Error("Invalid or expired OTP code");
        let user = await db.user.findUnique({ where: { email: credentials.email } });
        if (!user) {
          user = await db.user.create({ data: { email: credentials.email, emailVerified: new Date() } });
        } else if (!user.emailVerified) {
          await db.user.update({ where: { id: user.id }, data: { emailVerified: new Date() } });
        }
        return { id: user.id, email: user.email, name: user.name, image: user.image, plan: user.plan, role: user.role };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/auth/signin" },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) { token.id = user.id; token.plan = (user as Record<string, unknown>).plan ?? "free"; token.role = (user as Record<string, unknown>).role ?? "driver"; }
      if (account?.provider === "google" && user) {
        const existingUser = await db.user.findUnique({ where: { email: user.email! } });
        if (!existingUser) {
          const newUser = await db.user.create({ data: { email: user.email!, name: user.name ?? null, image: user.image ?? null, emailVerified: new Date() } });
          token.id = newUser.id; token.plan = newUser.plan; token.role = newUser.role;
        } else {
          token.id = existingUser.id; token.plan = existingUser.plan; token.role = existingUser.role;
          const existingAccount = await db.account.findUnique({ where: { provider_providerAccountId: { provider: "google", providerAccountId: account.providerAccountId } } });
          if (!existingAccount) {
            await db.account.create({ data: { userId: existingUser.id, type: "oauth", provider: "google", providerAccountId: account.providerAccountId, access_token: account.access_token, refresh_token: account.refresh_token, expires_at: account.expires_at, token_type: account.token_type, scope: account.scope, id_token: account.id_token } });
          }
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) { session.user.id = token.id as string; (session.user as Record<string, unknown>).plan = token.plan; (session.user as Record<string, unknown>).role = token.role; }
      return session;
    },
  },
};
