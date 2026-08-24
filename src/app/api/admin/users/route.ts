import { NextResponse } from "next/server";
import { getCurrentUser, hashPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { RegisterUserSchema } from "@/lib/validations/article";
import { recordAuditLog } from "@/services/audit.service";

export async function POST(req: Request) {
  try {
    const admin = await getCurrentUser();
    if (!admin || admin.role !== "ADMIN") {
      return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
    }

    const body = await req.json();
    const validated = RegisterUserSchema.parse(body);

    const existing = await prisma.user.findFirst({
      where: { OR: [{ email: validated.email }, { username: validated.username }] },
    });

    if (existing) {
      return NextResponse.json({ error: "El email o username ya está en uso" }, { status: 400 });
    }

    const passwordHash = await hashPassword(validated.password);

    const user = await prisma.user.create({
      data: {
        name: validated.name,
        username: validated.username,
        email: validated.email,
        passwordHash,
        role: validated.role,
      },
    });

    await recordAuditLog({
      actorId: admin.userId,
      action: "user.create",
      entityType: "User",
      entityId: user.id,
      metadata: { role: user.role, username: user.username },
    });

    return NextResponse.json(user);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Error al crear usuario" }, { status: 400 });
  }
}
