import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No se proporcionó ningún archivo" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "El archivo debe ser una imagen válida (JPG, PNG, WEBP, GIF)" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Data = `data:${file.type};base64,${buffer.toString("base64")}`;

    // Try saving to local disk (/public/uploads)
    try {
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      await mkdir(uploadsDir, { recursive: true });

      const fileExtension = path.extname(file.name) || ".jpg";
      const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}${fileExtension}`;
      const filePath = path.join(uploadsDir, filename);

      await writeFile(filePath, buffer);
      const publicUrl = `/uploads/${filename}`;

      return NextResponse.json({
        success: true,
        url: publicUrl,
        filename: file.name,
      });
    } catch (fsError) {
      // In serverless environments (Vercel) where filesystem is read-only, fallback to Base64 Data URL
      console.warn("Entorno Serverless (sistema de archivos de solo lectura), usando Data URL Base64");
      return NextResponse.json({
        success: true,
        url: base64Data,
        filename: file.name,
      });
    }
  } catch (error: any) {
    console.error("Error en upload route:", error);
    return NextResponse.json({ error: error?.message || "Error al procesar la imagen" }, { status: 500 });
  }
}
