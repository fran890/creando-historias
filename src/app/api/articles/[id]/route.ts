import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ArticleSchema } from "@/lib/validations/article";
import { validateArticleOwnership, sanitizeArticleInputForUserAsync } from "@/lib/security/ownership";
import { calculateReadingTime } from "@/lib/security/sanitizer";
import { recordAuditLog } from "@/services/audit.service";
import { z } from "zod";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Tu sesión ha expirado. Por favor, inicia sesión de nuevo." }, { status: 401 });
    }

    const ownership = await validateArticleOwnership(user, params.id);
    if (!ownership.authorized) {
      const status = ownership.reason === "UNAUTHENTICATED" ? 401 : ownership.reason === "ARTICLE_NOT_FOUND" ? 404 : 403;
      return NextResponse.json({ error: ownership.reason }, { status });
    }

    const body = await req.json();
    let { status, rejectionReason } = body;

    // Check DB for user's autoApprove privilege or Admin role
    const dbUser = await prisma.user.findUnique({
      where: { id: user.userId },
      select: { role: true, autoApprove: true },
    });
    const canAutoPublish = dbUser?.role === "ADMIN" || dbUser?.autoApprove === true;

    if (canAutoPublish && (status === "PENDING_REVIEW" || status === "PUBLISHED")) {
      status = "PUBLISHED";
    }

    // Security check: non-auto-approved authors cannot manually bypass review
    if (!canAutoPublish && !["DRAFT", "PENDING_REVIEW"].includes(status)) {
      return NextResponse.json({ error: "No tienes permisos para cambiar el estado a " + status }, { status: 403 });
    }

    // Business rule: Standard authors cannot publish directly from DRAFT without approval
    if (status === "PUBLISHED" && ownership.article.status === "DRAFT" && !canAutoPublish) {
      return NextResponse.json(
        { error: "No se puede publicar una historia en estado Borrador. El autor debe enviarla primero a revisión." },
        { status: 400 }
      );
    }

    const updateData: any = { status };
    if (status === "PUBLISHED" && !ownership.article.publishedAt) {
      updateData.publishedAt = new Date();
    }
    if (rejectionReason) {
      updateData.rejectionReason = rejectionReason;
    }

    const updatedArticle = await prisma.article.update({
      where: { id: params.id },
      data: updateData,
    });

    await recordAuditLog({
      actorId: user.userId,
      action: "article.status_update",
      entityType: "Article",
      entityId: params.id,
      metadata: { status },
    });

    try {
      const { revalidatePath } = await import("next/cache");
      revalidatePath("/");
      revalidatePath(`/stories/${updatedArticle.slug}`);
    } catch (err) {
      console.warn("Revalidation failed:", err);
    }

    return NextResponse.json(updatedArticle);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0]?.message || "Datos inválidos" }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || "Error al actualizar estado" }, { status: 400 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser();
    const ownership = await validateArticleOwnership(user, params.id);

    if (!ownership.authorized) {
      const status = ownership.reason === "UNAUTHENTICATED" ? 401 : ownership.reason === "ARTICLE_NOT_FOUND" ? 404 : 403;
      return NextResponse.json({ error: ownership.reason }, { status });
    }

    const body = await req.json();
    const validated = ArticleSchema.parse(body);
    const readingTime = calculateReadingTime(validated.content);

    const sanitizedInput = await sanitizeArticleInputForUserAsync(user!, {
      ...validated,
      readingTime,
    }, ownership.article.authorId);

    const updateData: any = {
      title: sanitizedInput.title,
      excerpt: sanitizedInput.excerpt || null,
      content: sanitizedInput.content,
      featuredImage: sanitizedInput.featuredImage || null,
      categoryId: sanitizedInput.categoryId || null,
      readingTime: sanitizedInput.readingTime,
      seoTitle: sanitizedInput.seoTitle || null,
      seoDescription: sanitizedInput.seoDescription || null,
      canonicalUrl: sanitizedInput.canonicalUrl || null,
      status: sanitizedInput.status,
    };

    if (sanitizedInput.status === "PUBLISHED" && !ownership.article.publishedAt) {
      updateData.publishedAt = new Date();
    }

    const updatedArticle = await prisma.article.update({
      where: { id: params.id },
      data: updateData,
    });

    await recordAuditLog({
      actorId: user!.userId,
      action: "article.update",
      entityType: "Article",
      entityId: updatedArticle.id,
      metadata: { status: updatedArticle.status },
    });

    try {
      const { revalidatePath } = await import("next/cache");
      revalidatePath("/");
      revalidatePath(`/stories/${updatedArticle.slug}`);
    } catch (err) {
      console.warn("Revalidation failed:", err);
    }

    return NextResponse.json(updatedArticle);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0]?.message || "Datos del artículo inválidos" }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || "Error al actualizar artículo" }, { status: 400 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser();
    const ownership = await validateArticleOwnership(user, params.id);

    if (!ownership.authorized) {
      const status = ownership.reason === "UNAUTHENTICATED" ? 401 : ownership.reason === "ARTICLE_NOT_FOUND" ? 404 : 403;
      return NextResponse.json({ error: ownership.reason }, { status });
    }

    await prisma.article.delete({ where: { id: params.id } });

    await recordAuditLog({
      actorId: user!.userId,
      action: "article.delete",
      entityType: "Article",
      entityId: params.id,
    });

    try {
      const { revalidatePath } = await import("next/cache");
      revalidatePath("/");
      revalidatePath(`/stories/${ownership.article.slug}`);
    } catch (err) {
      console.warn("Revalidation failed:", err);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: "Error al eliminar artículo" }, { status: 400 });
  }
}
