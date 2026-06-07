import { NextRequest, NextResponse } from "next/server";
import { sendOTP } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    if (!email || typeof email !== "string") return NextResponse.json({ error: "Email is required" }, { status: 400 });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    const result = await sendOTP(email.toLowerCase().trim());
    if (!result.success) return NextResponse.json({ error: result.error || "Failed to send OTP" }, { status: 500 });
    return NextResponse.json({ message: "OTP sent successfully" }, { status: 200 });
  } catch { return NextResponse.json({ error: "Internal server error" }, { status: 500 }); }
}
