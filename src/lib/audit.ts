import { db } from "@/lib/db";

export async function audit(params: {
  userId?: string | null;
  action: string;
  entity: string;
  entityId?: string | null;
  details?: string | null;
  ip?: string | null;
}) {
  try {
    await db.auditLog.create({
      data: {
        userId: params.userId ?? null,
        action: params.action,
        entity: params.entity,
        entityId: params.entityId ?? null,
        details: params.details ?? null,
        ip: params.ip ?? null,
      },
    });
  } catch (error) {
    // Fail silently to avoid blocking main flows if logging fails
    console.error("[AUDIT] Failed to write audit log:", error);
  }
}
