import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, setSessionCookie } from "@/lib/auth";
import { LoginSchema } from "@/lib/validations/article";
import { recordAuditLog } from "@/services/audit.service";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = LoginSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { email: validated.email },
    });

    if (!user) {
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
    }

    if (user.isBlocked) {
      return NextResponse.json({ error: "Esta cuenta ha sido suspendida" }, { status: 403 });
    }

    const isValid = await verifyPassword(validated.password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
    }

    await setSessionCookie({
      userId: user.id,
      email: user.email,
      username: user.username,
      name: user.name,
      role: user.role as "ADMIN" | "AUTHOR",
    });

    await recordAuditLog({
      actorId: user.id,
      action: "user.login",
      entityType: "User",
      entityId: user.id,
    });

    return NextResponse.json({ success: true, role: user.role });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Error en inicio de sesión" }, { status: 400 });
  }
}
