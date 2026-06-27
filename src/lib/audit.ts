import { db } from "./db";

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
        userId: params.userId || null,
        action: params.action,
        entity: params.entity,
        entityId: params.entityId || null,
        details: params.details || null,
        ip: params.ip || null,
      },
    });
  } catch (error) {
    console.error("[Audit] Failed to create audit log:", error);
  }
}
