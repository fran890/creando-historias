import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";

/**
 * High-performance cached article retriever by slug.
 * Uses Next.js Data Cache & Edge CDN with granular cache tag 'article-[slug]'.
 */
export async function getCachedArticleBySlug(slug: string) {
  const getArticle = unstable_cache(
    async () => {
      return prisma.article.findUnique({
        where: { slug },
        select: {
          id: true,
          title: true,
          slug: true,
          content: true,
          excerpt: true,
          featuredImage: true,
          status: true,
          viewCount: true,
          readingTime: true,
          publishedAt: true,
          categoryId: true,
          author: {
            select: {
              id: true,
              name: true,
              username: true,
              bio: true,
              avatarUrl: true,
              customAuthorShare: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          tags: {
            select: {
              tag: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                },
              },
            },
          },
        },
      });
    },
    [`article-by-slug-${slug}`],
    {
      tags: [`article-${slug}`, "articles-all"],
      revalidate: 86400, // 24 hours fallback, invalidated on demand via revalidateTag
    }
  );

  return getArticle();
}

/**
 * High-performance cached related articles retriever.
 */
export async function getCachedRelatedArticles(articleId: string, categoryId: string | null) {
  const getRelated = unstable_cache(
    async () => {
      try {
        return await prisma.article.findMany({
          where: {
            status: "PUBLISHED",
            NOT: { id: articleId },
            ...(categoryId ? { categoryId } : {}),
          },
          take: 6,
          orderBy: { publishedAt: "desc" },
          select: {
            id: true,
            title: true,
            slug: true,
            excerpt: true,
            featuredImage: true,
            readingTime: true,
            publishedAt: true,
            author: { select: { name: true, username: true } },
            category: { select: { name: true, slug: true } },
          },
        });
      } catch (err) {
        console.error("Failed to fetch related articles:", err);
        return [];
      }
    },
    [`related-articles-${articleId}`],
    {
      tags: ["articles-all", "articles-homepage"],
      revalidate: 3600, // 1 hour
    }
  );

  return getRelated();
}

/**
 * High-performance cached home page data retriever.
 */
export async function getCachedHomePageArticles() {
  const getHomeData = unstable_cache(
    async () => {
      const [featuredArticles, recentArticles, categories, totalPublishedCount] = await Promise.all([
        prisma.article.findMany({
          where: { status: "PUBLISHED" },
          orderBy: { viewCount: "desc" },
          take: 4,
          select: {
            id: true,
            title: true,
            slug: true,
            excerpt: true,
            featuredImage: true,
            readingTime: true,
            viewCount: true,
            author: { select: { name: true, username: true } },
            category: { select: { name: true, slug: true } },
          },
        }),
        prisma.article.findMany({
          where: { status: "PUBLISHED" },
          orderBy: { publishedAt: "desc" },
          take: 12,
          select: {
            id: true,
            title: true,
            slug: true,
            excerpt: true,
            featuredImage: true,
            readingTime: true,
            viewCount: true,
            publishedAt: true,
            author: { select: { name: true, username: true } },
            category: { select: { name: true, slug: true } },
          },
        }),
        prisma.category.findMany({
          take: 8,
          select: { id: true, name: true, slug: true },
        }),
        prisma.article.count({ where: { status: "PUBLISHED" } }),
      ]);

      return {
        featuredArticles,
        recentArticles,
        categories,
        totalPublishedCount,
      };
    },
    ["homepage-articles-data"],
    {
      tags: ["articles-homepage", "articles-all"],
      revalidate: 3600, // 1 hour, invalidated on article publish/edit
    }
  );

  return getHomeData();
}
