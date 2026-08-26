import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateSlug } from "@/lib/security/sanitizer";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const admin = await getCurrentUser();
    if (!admin || admin.role !== "ADMIN") return NextResponse.json({ error: "No autorizado" }, { status: 403 });

    const body = await req.json();
    const name = String(body.name || "").trim();
    const description = typeof body.description === "string" ? body.description.trim() : "";

    if (name.length < 2) {
      return NextResponse.json({ error: "El nombre debe tener al menos 2 caracteres" }, { status: 400 });
    }

    const category = await prisma.category.update({
      where: { id: params.id },
      data: {
        name,
        slug: generateSlug(name),
        description: description || null,
      },
    });

    try {
      const { revalidatePath, revalidateTag } = await import("next/cache");
      revalidatePath("/");
      revalidateTag("articles-homepage");
      revalidateTag("articles-all");
    } catch (err) {
      console.warn("Category revalidation failed:", err);
    }

    return NextResponse.json(category);
  } catch (error: any) {
    return NextResponse.json({ error: "Error al actualizar categoria" }, { status: 400 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const admin = await getCurrentUser();
    if (!admin || admin.role !== "ADMIN") return NextResponse.json({ error: "No autorizado" }, { status: 403 });

    await prisma.category.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: "Error al eliminar categoría" }, { status: 400 });
  }
}
