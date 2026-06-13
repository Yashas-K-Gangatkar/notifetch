import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/auth-helpers";
import { db } from "@/lib/db";

/**
 * GET /api/user/export
 * Export all user data in JSON format.
 *
 * DPDP Act 2023 §8: Right to access personal data
 * GDPR Article 15: Right of access by the data subject
 * GDPR Article 20: Right to data portability
 */
export async function GET(request: NextRequest) {
  try {
    const userId = await authenticateRequest(request);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch all user data
    const [user, notifications, sources, orders, earnings, payments, preferences, deviceAuths] =
      await Promise.all([
        db.user.findUnique({
          where: { id: userId },
          select: {
            id: true,
            email: true,
            name: true,
            phone: true,
            region: true,
            currency: true,
            language: true,
            plan: true,
            darkMode: true,
            createdAt: true,
            updatedAt: true,
          },
        }),
        db.notification.findMany({
          where: { userId },
          orderBy: { createdAt: "desc" },
        }),
        db.notificationSource.findMany({
          where: { userId },
        }),
        db.acceptedOrder.findMany({
          where: { userId },
        }),
        db.earningRecord.findMany({
          where: { userId },
        }),
        db.payment.findMany({
          where: { userId },
        }),
        db.preferences.findUnique({
          where: { userId },
        }),
        db.deviceAuth.findMany({
          where: { userId },
          select: {
            id: true,
            deviceId: true,
            deviceModel: true,
            appVersion: true,
            lastActiveAt: true,
            createdAt: true,
          },
        }),
      ]);

    const exportData = {
      exportDate: new Date().toISOString(),
      exportFormat: "NotiFetch_Data_Export_v1",
      legalBasis: "India DPDP Act 2023 Section 8, EU GDPR Article 15 and 20",
      user,
      notifications,
      notificationSources: sources,
      orders,
      earnings,
      payments,
      preferences,
      devices: deviceAuths,
    };

    // Audit log
    await db.auditLog.create({
      data: {
        userId,
        action: "DATA_EXPORT",
        entity: "User",
        entityId: userId,
        details: "Full data export requested (DPDP Act Section 8 / GDPR Art. 15)",
      },
    });

    return new NextResponse(JSON.stringify(exportData, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="notifetch-data-export-${new Date().toISOString().split("T")[0]}.json"`,
      },
    });
  } catch (error) {
    console.error("[API] Error exporting user data:", error);
    return NextResponse.json(
      { error: "Failed to export data" },
      { status: 500 }
    );
  }
}
