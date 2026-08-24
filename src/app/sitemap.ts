import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const articles = await prisma.article.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true, updatedAt: true },
  });

  const categories = await prisma.category.findMany({ select: { slug: true } });

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
