import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { updateMonetizationSettings } from "@/services/revenue.service";
import { SettingsSchema } from "@/lib/validations/article";
import { recordAuditLog } from "@/services/audit.service";

export async function PUT(req: Request) {
  try {
    const admin = await getCurrentUser();
    if (!admin || admin.role !== "ADMIN") return NextResponse.json({ error: "No autorizado" }, { status: 403 });

    const body = await req.json();
    const validated = SettingsSchema.parse(body);

    await updateMonetizationSettings(validated);

    await recordAuditLog({
      actorId: admin.userId,
      action: "settings.update",
      entityType: "PlatformSetting",
      entityId: "monetization",
      metadata: validated,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: "Error al actualizar configuración" }, { status: 400 });
  }
}
