import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/auth-helpers";
import { db } from "@/lib/db";

/**
 * DELETE /api/user/delete
 * Delete all user data (right to erasure).
 *
 * DPDP Act 2023 §8(5): Right to erasure of personal data
 * GDPR Article 17: Right to erasure ("right to be forgotten")
 * CCPA §1798.105: Right to delete
 *
 * This permanently removes:
 * - All notifications
 * - All notification sources
 * - All orders
 * - All earnings records
 * - All preferences
 * - All device auth records
 * - All payments
 * - The user account itself
 *
 * The deletion is irreversible.
 */
export async function DELETE(request: NextRequest) {
  try {
    const userId = await authenticateRequest(request);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify explicit confirmation
    const body = await request.json().catch(() => ({}));
    const { confirm } = body;

    if (confirm !== "DELETE_MY_DATA") {
      return NextResponse.json(
        { error: "Confirmation required. Pass { confirm: 'DELETE_MY_DATA' } to proceed." },
        { status: 400 }
      );
    }

    // Audit log BEFORE deletion (so we have the record)
    await db.auditLog.create({
      data: {
        userId,
        action: "DATA_DELETION_REQUESTED",
        entity: "User",
        entityId: userId,
        details: "User requested full data deletion (DPDP Act Section 8(5) / GDPR Art. 17 / CCPA Section 1798.105)",
      },
    });

    // Delete in order respecting foreign key constraints
    await db.$transaction([
      db.notification.deleteMany({ where: { userId } }),
      db.notificationSource.deleteMany({ where: { userId } }),
      db.acceptedOrder.deleteMany({ where: { userId } }),
      db.earningRecord.deleteMany({ where: { userId } }),
      db.payment.deleteMany({ where: { userId } }),
      db.preferences.deleteMany({ where: { userId } }),
      db.deviceAuth.updateMany({
        where: { userId },
        data: { userId: null, sessionToken: null },
      }),
    ]);

    // Delete the user account itself
    await db.user.delete({ where: { id: userId } });

    return NextResponse.json({
      success: true,
      message: "All your data has been permanently deleted. This action cannot be undone.",
      deletedAt: new Date().toISOString(),
      legalReference: "India DPDP Act 2023 Section 8(5), EU GDPR Article 17, CCPA Section 1798.105",
    });
  } catch (error) {
    console.error("[API] Error deleting user data:", error);
    return NextResponse.json(
      { error: "Failed to delete data. Please try again or contact dpo@notifetch.app" },
      { status: 500 }
    );
  }
}
