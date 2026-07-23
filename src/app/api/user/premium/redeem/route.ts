import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/auth-helpers";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const userId = await authenticateRequest(request);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { referralCode } = body;
    if (!referralCode) return NextResponse.json({ error: "referralCode required" }, { status: 400 });

    const user = await db.user.findUnique({ where: { id: userId }, select: { id: true, referralCode: true, premiumUntil: true, redeemedCodes: true } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    if (user.referralCode === referralCode) return NextResponse.json({ error: "Can't redeem own code!" }, { status: 400 });

    const redeemed = (user.redeemedCodes as string[]) || [];
    if (redeemed.includes(referralCode)) return NextResponse.json({ error: "Already redeemed!" }, { status: 400 });

    const referrer = await db.user.findFirst({ where: { referralCode }, select: { id: true, referralCount: true, premiumUntil: true } });
    if (!referrer) return NextResponse.json({ error: "Invalid code" }, { status: 400 });

    const now = new Date();
    const REFEREE_DAYS = 7, REFERRER_DAYS = 3;
    const newPremium = new Date((user.premiumUntil && user.premiumUntil > now ? user.premiumUntil : now).getTime() + REFEREE_DAYS * 86400000);
    const newReferrerCount = (referrer.referralCount || 0) + 1;
    const monthBonus = newReferrerCount === 20 ? 30 : 0;
    const referrerPremium = new Date((referrer.premiumUntil &&referrer.premiumUntil > now ? referrer.premiumUntil : now).getTime() + (REFERRER_DAYS + monthBonus) * 86400000);

    await db.user.update({ where: { id: userId }, data: { premiumUntil: newPremium, redeemedCodes: { push: referralCode } } });
    await db.user.update({ where: { id: referrer.id }, data: { premiumUntil: referrerPremium, referralCount: newReferrerCount } });

    return NextResponse.json({ success: true, daysAwarded: REFEREE_DAYS, premiumUntil: newPremium.toISOString(), isPremium: true, monthBonusAwarded: monthBonus > 0, monthBonusDays: monthBonus });
  } catch (error) {
    console.error("[API] Error redeeming:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
