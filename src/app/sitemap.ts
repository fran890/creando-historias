import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  let articles: any[] = [];
  let categories: any[] = [];

  try {
    articles = await prisma.article.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, updatedAt: true },
    });

    categories = await prisma.category.findMany({ select: { slug: true } });
  } catch (err) {
    console.error("Sitemap DB fetch fallback:", err);
  }

  const storyUrls: MetadataRoute.Sitemap = articles.map((art) => ({
    url: `${baseUrl}/stories/${art.slug}`,
    lastModified: art.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const categoryUrls: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${baseUrl}/category/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/search`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    ...storyUrls,
    ...categoryUrls,
  ];
}
