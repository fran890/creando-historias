import { prisma } from "../lib/prisma";

export interface RecordAuditParams {
  actorId: string;
  action: string;
  entityType: string;
  entityId: string;
  metadata?: Record<string, any>;
}

export async function recordAuditLog(params: RecordAuditParams) {
  try {
    await prisma.auditLog.create({
      data: {
        actorId: params.actorId,
        action: params.action,
        entityType: params.entityType,
        entityId: params.entityId,
        metadata: params.metadata ? JSON.stringify(params.metadata) : null,
      },
    });
  } catch (error) {
    console.error("AuditLog Creation Failed:", error);
  }
}
