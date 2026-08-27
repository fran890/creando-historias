import { NextResponse } from "next/server";
import { trackArticleView } from "@/services/analytics.service";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { articleId, authorId } = body;

    if (!articleId || !authorId) {
      return NextResponse.json({ error: "Parámetros requeridos faltantes" }, { status: 400 });
    }

    const viewer = await getCurrentUser();
    if (viewer?.role === "ADMIN") {
      return NextResponse.json({ success: true, skipped: true, reason: "ADMIN_VIEW" });
    }

    const userAgent = req.headers.get("user-agent") || "";
    const referrer = req.headers.get("referer") || "";
    const country = req.headers.get("x-vercel-ip-country") || req.headers.get("cf-ipcountry") || "UNKNOWN";
    const ipAddress = req.headers.get("x-forwarded-for")?.split(",")[0] || "";

    await trackArticleView({
      articleId,
      authorId,
      userAgent,
      referrer,
      country,
      ipAddress,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Error en tracking" }, { status: 500 });
  }
}
