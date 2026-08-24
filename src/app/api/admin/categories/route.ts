import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateSlug } from "@/lib/security/sanitizer";

export async function POST(req: Request) {
  try {
    const admin = await getCurrentUser();
    if (!admin || admin.role !== "ADMIN") return NextResponse.json({ error: "No autorizado" }, { status: 403 });

    const body = await req.json();
    const { name, description } = body;

    const slug = generateSlug(name);
    const category = await prisma.category.create({
      data: { name, slug, description: description || null },
    });

    return NextResponse.json(category);
  } catch (error: any) {
    return NextResponse.json({ error: "Error al crear categoría" }, { status: 400 });
  }
}
