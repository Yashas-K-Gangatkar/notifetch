import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/auth-helpers";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const userId = await authenticateRequest(request);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await db.user.findUnique({
      where: { id: userId },
      select: { premiumUntil: true, referralCount: true, referralCode: true },
    });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const now = new Date();
    const isPremium = user.premiumUntil ? user.premiumUntil > now : false;
    const daysRemaining = user.premiumUntil && user.premiumUntil > now
      ? Math.ceil((user.premiumUntil.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : 0;

    return NextResponse.json({ isPremium, premiumUntil: user.premiumUntil?.toISOString() || null, daysRemaining, referralCount: user.referralCount || 0, referralCode: user.referralCode || null });
  } catch (error) {
    console.error("[API] Error fetching premium:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
