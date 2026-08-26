import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ArticleSchema } from "@/lib/validations/article";
import { sanitizeArticleInputForUserAsync } from "@/lib/security/ownership";
import { generateSlug, calculateReadingTime } from "@/lib/security/sanitizer";
import { recordAuditLog } from "@/services/audit.service";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Tu sesión ha expirado. Por favor, inicia sesión de nuevo." }, { status: 401 });
    }

    const body = await req.json();
    const validated = ArticleSchema.parse(body);

    const baseSlug = generateSlug(validated.title);
    let slug = baseSlug;
    let count = 1;
    while (await prisma.article.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${count++}`;
    }

    const readingTime = calculateReadingTime(validated.content);

    const sanitizedInput = await sanitizeArticleInputForUserAsync(user, {
      ...validated,
      slug,
      readingTime,
    });

    const article = await prisma.article.create({
      data: {
        title: sanitizedInput.title,
        slug: sanitizedInput.slug,
        excerpt: sanitizedInput.excerpt || null,
        content: sanitizedInput.content,
        featuredImage: sanitizedInput.featuredImage || null,
        status: sanitizedInput.status || "DRAFT",
        categoryId: sanitizedInput.categoryId || null,
        readingTime: sanitizedInput.readingTime,
        seoTitle: sanitizedInput.seoTitle || null,
        seoDescription: sanitizedInput.seoDescription || null,
        canonicalUrl: sanitizedInput.canonicalUrl || null,
        authorId: sanitizedInput.authorId,
        publishedAt: sanitizedInput.status === "PUBLISHED" ? new Date() : null,
      },
    });

    await recordAuditLog({
      actorId: user.userId,
      action: "article.create",
      entityType: "Article",
      entityId: article.id,
      metadata: { title: article.title, status: article.status },
    });

    if (article.status === "PUBLISHED") {
      try {
        const { revalidatePath, revalidateTag } = await import("next/cache");
        revalidateTag(`article-${article.slug}`);
        revalidateTag("articles-homepage");
        revalidateTag("articles-all");
        revalidatePath("/");
        revalidatePath(`/stories/${article.slug}`);
      } catch (err) {
        console.warn("Revalidation failed:", err);
      }
    }

    return NextResponse.json(article);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0]?.message || "Datos del artículo inválidos" }, { status: 400 });
    }
    console.error("Error en POST /api/articles:", error);
    return NextResponse.json({ error: error.message || "Error interno al crear artículo" }, { status: 400 });
  }
}
