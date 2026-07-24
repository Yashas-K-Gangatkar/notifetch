import { NextRequest, NextResponse } from "next/server";
import { sendOTP } from "@/lib/auth";

// IP-based rate limiting for OTP send (prevents email bombing)
const ipLimiter = new Map<string, { count: number; resetAt: number }>();
const IP_SEND_MAX = 10;              // max OTP requests per IP
const IP_SEND_WINDOW = 60 * 60 * 1000; // 1 hour

// v2.9.59 SECURITY FIX: Also rate limit by email to prevent email bombing
// via IP spoofing (x-forwarded-for is client-controllable)
const emailLimiter = new Map<string, { count: number; resetAt: number }>();
const EMAIL_SEND_MAX = 3;             // max OTP requests per email
const EMAIL_SEND_WINDOW = 60 * 60 * 1000; // 1 hour

function checkIpLimit(ip: string): boolean {
  const now = Date.now();
  const entry = ipLimiter.get(ip);
  if (!entry || now > entry.resetAt) {
    ipLimiter.set(ip, { count: 1, resetAt: now + IP_SEND_WINDOW });
    return true;
  }
  if (entry.count >= IP_SEND_MAX) return false;
  entry.count++;
  return true;
}

function checkEmailLimit(email: string): boolean {
  const now = Date.now();
  const entry = emailLimiter.get(email);
  if (!entry || now > entry.resetAt) {
    emailLimiter.set(email, { count: 1, resetAt: now + EMAIL_SEND_WINDOW });
    return true;
  }
  if (entry.count >= EMAIL_SEND_MAX) return false;
  entry.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // IP rate limit check
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
      || request.headers.get("x-real-ip")
      || "unknown";
    if (!checkIpLimit(ip)) {
      return NextResponse.json(
        { error: "Too many OTP requests from this IP. Please try again later." },
        { status: 429 }
      );
    }

    const { email } = await request.json();
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
    if (email.length > 320) {
      return NextResponse.json({ error: "Email is too long" }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    // v2.9.59 SECURITY FIX: Rate limit by email (not just IP)
    // Prevents email bombing via x-forwarded-for spoofing
    const normalizedEmail = email.toLowerCase().trim();
    if (!checkEmailLimit(normalizedEmail)) {
      return NextResponse.json(
        { error: "Too many OTP requests for this email. Please try again later." },
        { status: 429 }
      );
    }

    const result = await sendOTP(normalizedEmail);
    if (!result.success) {
      // Return 429 for rate limit errors, 500 for others
      if (result.error?.includes("Too many")) {
        return NextResponse.json({ error: result.error }, { status: 429 });
      }
      return NextResponse.json({ error: result.error || "Failed to send OTP" }, { status: 500 });
    }

    return NextResponse.json({ message: "OTP sent successfully" }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
