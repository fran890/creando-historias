import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateSlug } from "@/lib/security/sanitizer";

export async function POST(req: Request) {
  try {
    const admin = await getCurrentUser();
    if (!admin || admin.role !== "ADMIN") return NextResponse.json({ error: "No autorizado" }, { status: 403 });

    const body = await req.json();
    const { name } = body;

    const slug = generateSlug(name);
    const tag = await prisma.tag.create({
      data: { name, slug },
    });

    return NextResponse.json(tag);
  } catch (error: any) {
    return NextResponse.json({ error: "Error al crear etiqueta" }, { status: 400 });
  }
}
