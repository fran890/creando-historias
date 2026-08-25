import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import ArticleReader from "@/components/editor/ArticleReader";
import HeaderBannerAd from "@/components/ads/HeaderBannerAd";
import InContentAd from "@/components/ads/InContentAd";
import SidebarAd from "@/components/ads/SidebarAd";
import CopyLinkButton from "@/components/common/CopyLinkButton";
import AnalyticsTracker from "@/components/analytics/AnalyticsTracker";
import { Clock, Eye, Calendar, ArrowLeft, BookOpen, Sparkles } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface Props {
  params: { slug: string };
}

export const revalidate = 60;

function isValidImageUrl(url: string | null | undefined): url is string {
  return !!url && (url.startsWith("http://") || url.startsWith("https://"));
}

function stripBase64FromHtml(html: string): string {
  return html.replace(
    /src=["'](data:image\/[^"']+)["']/gi,
    'src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"'
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await prisma.article.findUnique({
    where: { slug: params.slug },
    select: {
      title: true,
      excerpt: true,
      featuredImage: true,
      author: { select: { name: true } },
    },
  });

  if (!article) return {};

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://creando-historias-beta.vercel.app";
  const canonicalUrl = `${baseUrl}/stories/${params.slug}`;
  const hasValidImage = isValidImageUrl(article.featuredImage);

  return {
    title: `${article.title} | Creando Historias`,
    description: article.excerpt || `Lee ${article.title} por ${article.author.name} en Creando Historias.`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: article.title,
      description: article.excerpt || undefined,
      url: canonicalUrl,
      type: "article",
      images: hasValidImage ? [{ url: article.featuredImage as string }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt || undefined,
      images: hasValidImage ? [article.featuredImage as string] : [],
    },
  };
}

export default async function StoryPage({ params }: Props) {
  const [currentUser, article] = await Promise.all([
    getCurrentUser(),
    prisma.article.findUnique({
      where: { slug: params.slug },
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
    }),
  ]);

  if (!article) {
    notFound();
  }

  if (article.status !== "PUBLISHED") {
    const isOwner = currentUser?.userId === article.author.id;
    const isAdmin = currentUser?.role === "ADMIN";
    if (!isOwner && !isAdmin) {
      notFound();
    }
  }

  let relatedArticles: Array<{
    id: string; title: string; slug: string; excerpt: string | null;
    featuredImage: string | null; readingTime: number;
    publishedAt: Date | null;
    author: { name: string; username: string };
    category: { name: string; slug: string } | null;
  }> = [];
  try {
    relatedArticles = await prisma.article.findMany({
      where: {
        status: "PUBLISHED",
        NOT: { id: article.id },
        ...(article.categoryId ? { categoryId: article.categoryId } : {}),
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
  } catch (e) {
    console.error("Failed to fetch related articles:", e);
  }

  const validFeaturedImage = isValidImageUrl(article.featuredImage) ? article.featuredImage : undefined;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://creando-historias-beta.vercel.app";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.excerpt,
    image: validFeaturedImage ? [validFeaturedImage] : undefined,
    datePublished: article.publishedAt,
    author: {
      "@type": "Person",
      name: article.author.name,
      url: `${baseUrl}/author/${article.author.username}`,
    },
  };

  return (
    <div className="relative bg-gray-50 dark:bg-gray-950 min-h-screen">
      <AnalyticsTracker articleId={article.id} authorId={article.author.id} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Navigation */}
        <div className="mb-4 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-gray-500 hover:text-brand-500 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al inicio</span>
          </Link>
          <CopyLinkButton slug={article.slug} variant="pill" />
        </div>

        {/* Full-width Header Ad */}
        <HeaderBannerAd />

        {/* Main 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Article Column */}
          <div className="lg:col-span-8 space-y-6">
            <article
              itemScope
              itemType="https://schema.org/BlogPosting"
              className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xs overflow-hidden"
            >
              {/* Featured Image — full bleed at top */}
              {validFeaturedImage && (
                <div className="w-full h-56 sm:h-72 bg-gray-100 dark:bg-gray-800">
                  <img
                    itemProp="image"
                    src={validFeaturedImage}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="p-6 sm:p-8 space-y-6">
                <header className="space-y-4">
                  {article.category && (
                    <Link
                      href={`/category/${article.category.slug}`}
                      className="inline-block text-xs font-bold uppercase tracking-wider text-brand-500 bg-brand-50 dark:bg-brand-950/40 px-3 py-1 rounded-full border border-brand-200 dark:border-brand-800"
                    >
                      {article.category.name}
                    </Link>
                  )}

                  <h1 itemProp="headline" className="font-serif text-2xl sm:text-4xl font-extrabold text-gray-900 dark:text-white leading-tight">
                    {article.title}
                  </h1>

                  {article.excerpt && (
                    <p itemProp="description" className="text-lg text-gray-600 dark:text-gray-300 font-sans leading-relaxed">
                      {article.excerpt}
                    </p>
                  )}

                  {/* Author & Meta */}
                  <div className="flex items-center justify-between py-3 border-y border-gray-200 dark:border-gray-800 text-sm text-gray-600 dark:text-gray-400 flex-wrap gap-3">
                    <Link href={`/author/${article.author.username}`} className="flex items-center space-x-3 group">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-500 to-brand-800 text-white flex items-center justify-center font-bold font-serif text-base overflow-hidden shadow-xs">
                        {article.author.avatarUrl ? (
                          <img src={article.author.avatarUrl} alt={article.author.name} className="w-full h-full object-cover" />
                        ) : (
                          article.author.name.charAt(0)
                        )}
                      </div>
                      <div>
                        <p itemProp="author" className="font-bold text-gray-900 dark:text-white group-hover:text-brand-500 transition text-sm">
                          {article.author.name}
                        </p>
                        <p className="text-xs text-gray-500">@{article.author.username}</p>
                      </div>
                    </Link>
                    <div className="flex items-center space-x-3 text-xs font-medium flex-wrap gap-y-1">
                      {article.publishedAt && (
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          <time itemProp="datePublished" dateTime={new Date(article.publishedAt).toISOString()}>
                            {format(new Date(article.publishedAt), "dd MMM yyyy", { locale: es })}
                          </time>
                        </span>
                      )}
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        <span>{article.readingTime} min</span>
                      </span>
                      {currentUser && (
                        <span className="flex items-center space-x-1">
                          <Eye className="w-3.5 h-3.5 text-gray-400" />
                          <span>{article.viewCount}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </header>

                {/* Article Body */}
                <div itemProp="articleBody" className="font-sans text-gray-800 dark:text-gray-200 leading-relaxed">
                  <ArticleReader content={stripBase64FromHtml(article.content)} />
                </div>

                {/* Post-article ad */}
                <InContentAd />

                {/* Tags */}
                {article.tags.length > 0 && (
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-800 flex items-center flex-wrap gap-2">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Etiquetas:</span>
                    {article.tags.map(({ tag }) => (
                      <Link
                        key={tag.id}
                        href={`/tag/${tag.slug}`}
                        className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-brand-500 hover:text-white text-xs font-medium text-gray-600 dark:text-gray-300 transition"
                      >
                        #{tag.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </article>

            {/* Ad between article and recommendations */}
            <InContentAd />

            {/* Recommendations Grid */}
            {relatedArticles.length > 0 && (
              <section className="space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-5 h-5 text-brand-500" />
                    <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white">
                      Historias recomendadas
                    </h3>
                  </div>
                  <span className="text-xs text-gray-400 font-semibold flex items-center space-x-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Te puede interesar</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {relatedArticles.slice(0, 3).map((rel) => (
                    <article
                      key={rel.id}
                      className="flex flex-col bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700/60 rounded-2xl overflow-hidden hover:border-brand-300 dark:hover:border-brand-700 transition group"
                    >
                      {rel.featuredImage && isValidImageUrl(rel.featuredImage) && (
                        <div className="h-32 overflow-hidden bg-gray-200 dark:bg-gray-800">
                          <img
                            src={rel.featuredImage}
                            alt={rel.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          />
                        </div>
                      )}
                      <div className="p-4 space-y-1.5 flex-grow flex flex-col justify-between">
                        <div>
                          {rel.category && (
                            <span className="text-[10px] font-bold text-brand-500 uppercase tracking-wider">
                              {rel.category.name}
                            </span>
                          )}
                          <h4 className="font-serif font-bold text-sm text-gray-900 dark:text-white group-hover:text-brand-500 transition line-clamp-2 leading-snug">
                            <Link href={`/stories/${rel.slug}`}>{rel.title}</Link>
                          </h4>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-gray-200/60 dark:border-gray-700/60 text-[11px] text-gray-500 mt-2">
                          <span className="font-semibold">{rel.author.name}</span>
                          <span>{rel.readingTime} min</span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                {/* Ad within recommendations */}
                {relatedArticles.length > 3 && <InContentAd />}

                {/* Second row of recommendations */}
                {relatedArticles.length > 3 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {relatedArticles.slice(3, 6).map((rel) => (
                      <article
                        key={rel.id}
                        className="flex flex-col bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700/60 rounded-2xl overflow-hidden hover:border-brand-300 dark:hover:border-brand-700 transition group"
                      >
                        {rel.featuredImage && isValidImageUrl(rel.featuredImage) && (
                          <div className="h-32 overflow-hidden bg-gray-200 dark:bg-gray-800">
                            <img
                              src={rel.featuredImage}
                              alt={rel.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                            />
                          </div>
                        )}
                        <div className="p-4 space-y-1.5 flex-grow flex flex-col justify-between">
                          <div>
                            {rel.category && (
                              <span className="text-[10px] font-bold text-brand-500 uppercase tracking-wider">
                                {rel.category.name}
                              </span>
                            )}
                            <h4 className="font-serif font-bold text-sm text-gray-900 dark:text-white group-hover:text-brand-500 transition line-clamp-2 leading-snug">
                              <Link href={`/stories/${rel.slug}`}>{rel.title}</Link>
                            </h4>
                          </div>
                          <div className="flex items-center justify-between pt-2 border-t border-gray-200/60 dark:border-gray-700/60 text-[11px] text-gray-500 mt-2">
                            <span className="font-semibold">{rel.author.name}</span>
                            <span>{rel.readingTime} min</span>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* Bottom page ad */}
            <InContentAd />
          </div>

          {/* Sidebar — sticky with multiple ad slots */}
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-20 space-y-6">
              <SidebarAd />

              {/* Author Card */}
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 space-y-3">
                <Link href={`/author/${article.author.username}`} className="flex items-center space-x-3 group">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-brand-500 to-brand-800 text-white flex items-center justify-center font-bold font-serif text-lg overflow-hidden shadow-xs">
                    {article.author.avatarUrl ? (
                      <img src={article.author.avatarUrl} alt={article.author.name} className="w-full h-full object-cover" />
                    ) : (
                      article.author.name.charAt(0)
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white group-hover:text-brand-500 transition">
                      {article.author.name}
                    </p>
                    <p className="text-xs text-gray-500">@{article.author.username}</p>
                  </div>
                </Link>
                {article.author.bio && (
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{article.author.bio}</p>
                )}
              </div>

              {/* Second sidebar ad */}
              <div className="hidden lg:block">
                <InContentAd format="rectangle" />
              </div>

              {/* Third sidebar ad for long scrolls */}
              <div className="hidden lg:block">
                <SidebarAd />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
