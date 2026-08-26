import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { uploadToCloudflareR2 } from "@/lib/storage/r2";
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
      return NextResponse.json({ error: "El archivo debe ser una imagen válida (JPG, PNG, WEBP, GIF, SVG)" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 1. Prioritize Cloudflare R2 Object Storage (Decoupled Cloud Storage + CDN)
    try {
      const r2Result = await uploadToCloudflareR2({
        buffer,
        filename: file.name,
        contentType: file.type,
      });

      if (r2Result?.url) {
        return NextResponse.json({
          success: true,
          url: r2Result.url,
          filename: file.name,
          storage: "cloudflare-r2",
        });
      }
    } catch (r2Error) {
      console.warn("[Cloudflare R2] Fallo de subida o no configurado:", r2Error);
    }

    // 2. Fallback to local disk (/public/uploads) for local development
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
        storage: "local-disk",
      });
    } catch (fsError) {
      console.error("[Upload] R2 no configurado y filesystem no disponible:", fsError);
      return NextResponse.json(
        {
          error:
            "No se pudo guardar la imagen. Configura Cloudflare R2 para producción antes de subir archivos.",
        },
        { status: 503 }
      );
    }
  } catch (error: any) {
    console.error("Error en upload route:", error);
    return NextResponse.json({ error: error?.message || "Error al procesar la imagen" }, { status: 500 });
  }
}
