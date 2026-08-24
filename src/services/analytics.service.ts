import { prisma } from "../lib/prisma";
import crypto from "crypto";

export interface TrackViewOptions {
  articleId: string;
  authorId: string;
  userAgent?: string;
  country?: string;
  referrer?: string;
  ipAddress?: string;
}

export async function trackArticleView(options: TrackViewOptions) {
  try {
    const today = new Date().toISOString().split("T")[0];
    const rawString = `${options.ipAddress || "anon"}-${options.userAgent || "ua"}-${today}`;
    const anonymousSessionHash = crypto.createHash("sha256").update(rawString).digest("hex");

    // Detect device type simple heuristic
    const ua = (options.userAgent || "").toLowerCase();
    let deviceType = "desktop";
    if (/mobile|android|iphone|ipad|tablet/i.test(ua)) {
      deviceType = "mobile";
    }

    // Save ArticleView
    await prisma.articleView.create({
      data: {
        articleId: options.articleId,
        authorId: options.authorId,
        country: options.country || "UNKNOWN",
        deviceType,
        referrer: options.referrer || null,
        anonymousSessionHash,
      },
    });

    // Increment total viewCount in Article atomically
    await prisma.article.update({
      where: { id: options.articleId },
      data: { viewCount: { increment: 1 } },
    });
  } catch (error) {
    console.error("Failed to track article view:", error);
  }
}

export async function getAuthorAnalytics(authorId: string) {
  const totalViews = await prisma.articleView.count({
    where: { authorId },
  });

  const publishedCount = await prisma.article.count({
    where: { authorId, status: "PUBLISHED" },
  });

  const draftCount = await prisma.article.count({
    where: { authorId, status: "DRAFT" },
  });

  const pendingCount = await prisma.article.count({
    where: { authorId, status: "PENDING_REVIEW" },
  });

  const topArticles = await prisma.article.findMany({
    where: { authorId, status: "PUBLISHED" },
    orderBy: { viewCount: "desc" },
    take: 5,
    select: { id: true, title: true, slug: true, viewCount: true, publishedAt: true },
  });

  return {
    totalViews,
    publishedCount,
    draftCount,
    pendingCount,
    topArticles,
  };
}

export async function getGlobalAnalytics() {
  const totalUsers = await prisma.user.count();
  const totalAuthors = await prisma.user.count({ where: { role: "AUTHOR" } });
  const totalArticles = await prisma.article.count();
  const publishedArticles = await prisma.article.count({ where: { status: "PUBLISHED" } });
  const pendingArticles = await prisma.article.count({ where: { status: "PENDING_REVIEW" } });
  const totalViews = await prisma.articleView.count();

  const topArticles = await prisma.article.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { viewCount: "desc" },
    take: 5,
    select: {
      id: true,
      title: true,
      slug: true,
      viewCount: true,
      author: { select: { name: true, username: true } },
    },
  });

  const topAuthors = await prisma.user.findMany({
    where: { role: "AUTHOR" },
    take: 5,
    select: {
      id: true,
      name: true,
      username: true,
      _count: { select: { articles: true, views: true } },
    },
  });

  return {
    totalUsers,
    totalAuthors,
    totalArticles,
    publishedArticles,
    pendingArticles,
    totalViews,
    topArticles,
    topAuthors,
  };
}
