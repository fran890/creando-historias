import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { recordAuditLog } from "@/services/audit.service";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const admin = await getCurrentUser();
    if (!admin || admin.role !== "ADMIN") {
      return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
    }

    const body = await req.json();
    const { role, isBlocked } = body;

    const updateData: any = {};
    if (role) updateData.role = role;
    if (typeof isBlocked === "boolean") updateData.isBlocked = isBlocked;

    const updated = await prisma.user.update({
      where: { id: params.id },
      data: updateData,
    });

    await recordAuditLog({
      actorId: admin.userId,
      action: "user.update",
      entityType: "User",
      entityId: params.id,
      metadata: updateData,
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: "Error al actualizar usuario" }, { status: 400 });
  }
}
