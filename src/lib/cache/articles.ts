import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSafePublicImageUrl, stripBase64DataUris } from "@/lib/images";

/**
 * High-performance cached article retriever by slug.
 * Uses Next.js Data Cache & Edge CDN with granular cache tag 'article-[slug]'.
 */
export async function getCachedArticleBySlug(slug: string) {
  const getArticle = unstable_cache(
    async () => {
      const article = await prisma.article.findUnique({
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

      if (!article) return null;

      // Clean massive embedded Base64 images (>200 chars) to prevent serving 3MB HTML pages
      return {
        ...article,
        content: stripBase64DataUris(article.content),
        featuredImage: article.featuredImage?.startsWith("data:")
          ? stripBase64DataUris(article.featuredImage)
          : article.featuredImage,
        author: {
          ...article.author,
          avatarUrl: getSafePublicImageUrl(article.author.avatarUrl),
        },
      };
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
        const relatedArticles = await prisma.article.findMany({
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

        return relatedArticles.map((article) => ({
          ...article,
          featuredImage: article.featuredImage?.startsWith("data:")
            ? stripBase64DataUris(article.featuredImage)
            : article.featuredImage,
        }));
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
 * High-performance cached home page data retriever with pagination support.
 */
export async function getCachedHomePageArticles(page: number = 1, limit: number = 8) {
  const safePage = Math.max(1, page);
  const skip = (safePage - 1) * limit;

  const getHomeData = unstable_cache(
    async () => {
      const [featuredArticles, recentArticles, categories, totalPublishedCount] = await Promise.all([
        prisma.article.findMany({
          where: { status: "PUBLISHED" },
          orderBy: { viewCount: "desc" },
          take: 5,
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
          skip,
          take: limit,
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

      const totalPages = Math.max(1, Math.ceil(totalPublishedCount / limit));

      return {
        featuredArticles,
        recentArticles,
        categories,
        totalPublishedCount,
        totalPages,
      };
    },
    [`homepage-articles-data-p${safePage}-l${limit}`],
    {
      tags: ["articles-homepage", "articles-all"],
      revalidate: 3600, // 1 hour, invalidated on article publish/edit
    }
  );

  return getHomeData();
}
