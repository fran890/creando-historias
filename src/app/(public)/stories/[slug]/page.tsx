import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ArticleReader from "@/components/editor/ArticleReader";
import SidebarAd from "@/components/ads/SidebarAd";
import ArticleNativeAd from "@/components/ads/ArticleNativeAd";
import StickyFloatingAd from "@/components/ads/StickyFloatingAd";
import HeaderBannerAd from "@/components/ads/HeaderBannerAd";
import CopyLinkButton from "@/components/common/CopyLinkButton";
import AnalyticsTracker from "@/components/analytics/AnalyticsTracker";
import { Clock, Eye, Calendar, ArrowLeft, BookOpen, Sparkles, User, Share2 } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

import { getCachedArticleBySlug, getCachedRelatedArticles } from "@/lib/cache/articles";
import { getOptimizedImageUrl } from "@/lib/images";

interface Props {
  params: { slug: string };
}

export const revalidate = 86400; // 24 hours (revalidated instantly on demand via revalidateTag)
export const dynamic = "force-static";
export const dynamicParams = true;

function isValidImageUrl(url: string | null | undefined): url is string {
  return !!url && (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("/"));
}

function stripBase64FromHtml(html: string): string {
  return html.replace(
    /src=["'](data:image\/[^"']+)["']/gi,
    'src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"'
  );
}

import { getValidBaseUrl } from "@/lib/url";

function getAbsoluteImageUrl(url: string | null | undefined, baseUrl: string): string {
  if (!url) return `${baseUrl}/logo-sin-fondo.png`;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("/")) return `${baseUrl}${url}`;
  return `${baseUrl}/${url}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const rawSlug = params?.slug || "";
  const slug = decodeURIComponent(rawSlug);
  const article = await getCachedArticleBySlug(slug);

  const baseUrl = getValidBaseUrl(process.env.NEXT_PUBLIC_APP_URL);

  if (!article || article.status !== "PUBLISHED") {
    return {
      title: "Artículo no encontrado | Creando-Historias",
      description: "El artículo solicitado no existe o no está publicado.",
      robots: { index: false, follow: false },
    };
  }

  const canonicalUrl = `${baseUrl}/stories/${article.slug}`;
  const ogImageUrl = getAbsoluteImageUrl(article.featuredImage, baseUrl);
  const titleText = `${article.title} | Creando-Historias`;
  const descriptionText = article.excerpt || `Lee "${article.title}" escrito por ${article.author.name} en Creando-Historias.`;

  return {
    title: titleText,
    description: descriptionText,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: article.title,
      description: descriptionText,
      url: canonicalUrl,
      siteName: "Creando-Historias",
      locale: "es_ES",
      type: "article",
      publishedTime: article.publishedAt ? new Date(article.publishedAt).toISOString() : undefined,
      authors: [article.author.name],
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: descriptionText,
      images: [ogImageUrl],
      creator: `@${article.author.username}`,
    },
  };
}

export default async function StoryPage({ params }: Props) {
  const article = await getCachedArticleBySlug(params.slug);

  if (!article || article.status !== "PUBLISHED") {
    notFound();
  }

  const relatedArticles = await getCachedRelatedArticles(article.id, article.categoryId);

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
    <div className="relative bg-gray-50 dark:bg-[#090d16] min-h-screen">
      <AnalyticsTracker articleId={article.id} authorId={article.author.id} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header Ad Banner */}
      <HeaderBannerAd />

      <div className="max-w-7xl mx-auto px-0 sm:px-6 py-2 sm:py-6 space-y-4 sm:space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="px-4 sm:px-0 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-gray-500 hover:text-brand-500 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al inicio</span>
          </Link>
          <div className="flex items-center space-x-2">
            <CopyLinkButton slug={article.slug} variant="pill" />
          </div>
        </div>

        {/* Article + Sidebar Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Article Column */}
        <main className="w-full min-w-0 space-y-6">
          <article
            itemScope
            itemType="https://schema.org/BlogPosting"
            className="bg-white dark:bg-gray-900 rounded-none sm:rounded-3xl border-x-0 sm:border border-gray-200/80 dark:border-gray-800/80 shadow-xs overflow-hidden"
          >
            {/* Featured Image Header */}
            {validFeaturedImage && (
              <div className="w-full h-64 sm:h-96 bg-gray-100 dark:bg-gray-800 relative">
                <img
                  itemProp="image"
                  src={getOptimizedImageUrl(validFeaturedImage, 1200, 75)}
                  alt={article.title}
                  loading="eager"
                  // @ts-ignore
                  fetchpriority="high"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
              </div>
            )}

            <div className="p-4 sm:p-10 space-y-6">
              <div className="article-header space-y-4 max-w-[750px] mx-auto">
                {article.category && (
                  <Link
                    href={`/category/${article.category.slug}`}
                    className="inline-block text-xs font-extrabold uppercase tracking-wider text-brand-500 bg-brand-50 dark:bg-brand-950/50 px-3.5 py-1 rounded-full border border-brand-200 dark:border-brand-800/60"
                  >
                    {article.category.name}
                  </Link>
                )}

                <h1 itemProp="headline" className="font-serif text-3xl sm:text-4xl lg:text-[40px] font-black text-gray-900 dark:text-white leading-[1.25] tracking-tight">
                  {article.title}
                </h1>

                {article.excerpt && (
                  <p itemProp="description" className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 font-sans leading-relaxed">
                    {article.excerpt}
                  </p>
                )}

                {/* Publicidad recomendada en móvil: debajo de título y subtítulo */}
                <ArticleNativeAd placement="header" />

                {/* Author & Meta Row */}
                <div className="flex items-center justify-between py-4 border-y border-gray-100 dark:border-gray-800/80 text-sm text-gray-600 dark:text-gray-400 flex-wrap gap-4">
                  <Link href={`/author/${article.author.username}`} className="flex items-center space-x-3 group">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-500 to-brand-800 text-white flex items-center justify-center font-bold font-serif text-lg overflow-hidden shadow-glow group-hover:scale-105 transition-transform duration-300">
                      {article.author.avatarUrl ? (
                        <img src={article.author.avatarUrl} alt={article.author.name} className="w-full h-full object-cover" />
                      ) : (
                        article.author.name.charAt(0)
                      )}
                    </div>
                    <div>
                      <p itemProp="author" className="font-bold text-gray-900 dark:text-white group-hover:text-brand-500 transition text-sm sm:text-base">
                        {article.author.name}
                      </p>
                      <p className="text-xs text-gray-500 font-medium">@{article.author.username}</p>
                    </div>
                  </Link>

                  <div className="flex items-center space-x-4 text-xs font-semibold flex-wrap gap-y-2">
                    {article.publishedAt && (
                      <span className="flex items-center space-x-1.5" suppressHydrationWarning>
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <time itemProp="datePublished" dateTime={new Date(article.publishedAt).toISOString()} suppressHydrationWarning>
                          {format(new Date(article.publishedAt), "dd MMMM, yyyy", { locale: es })}
                        </time>
                      </span>
                    )}
                    <span className="flex items-center space-x-1.5">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span>{article.readingTime} min lectura</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Article Body */}
              <div itemProp="articleBody" className="font-sans text-gray-800 dark:text-gray-200 leading-relaxed text-base sm:text-lg">
                <ArticleReader content={stripBase64FromHtml(article.content)} />
              </div>

              {article.tags.length > 0 && (
                <div className="pt-6 border-t border-gray-100 dark:border-gray-800/80 flex items-center flex-wrap gap-2 max-w-[750px] mx-auto">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Etiquetas:</span>
                  {article.tags.map(({ tag }) => (
                    <Link
                      key={tag.id}
                      href={`/tag/${tag.slug}`}
                      className="px-3.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800/60 hover:bg-brand-500 hover:text-white text-xs font-bold text-gray-600 dark:text-gray-300 transition-colors duration-200"
                    >
                      #{tag.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </article>

          {/* Author Card - Full Width Central Column */}
          <div className="w-full bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800/80 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
            <div className="flex items-center space-x-2 text-xs font-bold text-brand-500 uppercase tracking-wider border-b border-gray-100 dark:border-gray-800 pb-3">
              <User className="w-4 h-4" />
              <span>Sobre el autor</span>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <Link href={`/author/${article.author.username}`} className="flex items-center space-x-4 group">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-500 to-brand-800 text-white flex items-center justify-center font-bold font-serif text-xl overflow-hidden shadow-glow flex-shrink-0 group-hover:scale-105 transition duration-300">
                  {article.author.avatarUrl ? (
                    <img src={article.author.avatarUrl} alt={article.author.name} className="w-full h-full object-cover" />
                  ) : (
                    article.author.name.charAt(0)
                  )}
                </div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white group-hover:text-brand-500 transition text-lg">
                    {article.author.name}
                  </p>
                  <p className="text-xs text-gray-500 font-medium">@{article.author.username}</p>
                </div>
              </Link>
              <Link
                href={`/author/${article.author.username}`}
                className="inline-flex items-center space-x-1.5 px-5 py-2.5 bg-gray-100 dark:bg-gray-800/60 hover:bg-brand-500 hover:text-white text-xs font-bold rounded-2xl transition shadow-xs"
              >
                <span>Ver todas sus historias</span>
              </Link>
            </div>
            {article.author.bio && (
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-sans pt-1 border-t border-gray-100 dark:border-gray-800/60">{article.author.bio}</p>
            )}
          </div>

          {/* Recommendations Grid */}
          {relatedArticles.length > 0 && (
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-xl bg-brand-500/10 text-brand-500 flex items-center justify-center font-bold">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <h3 className="font-display text-2xl font-black text-gray-900 dark:text-white">
                    Historias recomendadas
                  </h3>
                </div>
                <span className="text-xs font-bold text-gray-400 flex items-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Te puede interesar</span>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {relatedArticles.slice(0, 3).map((rel) => (
                  <article
                    key={rel.id}
                    className="flex flex-col bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800/80 rounded-3xl overflow-hidden shadow-xs card-hover-glow group"
                  >
                    {rel.featuredImage && isValidImageUrl(rel.featuredImage) ? (
                      <Link href={`/stories/${rel.slug}`} className="h-36 overflow-hidden bg-gray-200 dark:bg-gray-800 block">
                        <img
                          src={rel.featuredImage}
                          alt={rel.title}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                      </Link>
                    ) : (
                      <Link href={`/stories/${rel.slug}`} className="h-36 bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-300 dark:text-gray-600 block">
                        <BookOpen className="w-8 h-8" />
                      </Link>
                    )}
                    <div className="p-5 space-y-2 flex-grow flex flex-col justify-between">
                      <div>
                        {rel.category && (
                          <span className="text-[10px] font-extrabold text-brand-500 uppercase tracking-wider">
                            {rel.category.name}
                          </span>
                        )}
                        <h4 className="font-serif font-bold text-sm text-gray-900 dark:text-white group-hover:text-brand-500 transition line-clamp-2 leading-snug">
                          <Link href={`/stories/${rel.slug}`}>{rel.title}</Link>
                        </h4>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800 text-[11px] text-gray-500 font-medium">
                        <span className="font-bold">{rel.author.name}</span>
                        <span>{rel.readingTime} min</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {relatedArticles.length > 3 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {relatedArticles.slice(3, 6).map((rel) => (
                    <article
                      key={rel.id}
                      className="flex flex-col bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800/80 rounded-3xl overflow-hidden shadow-xs card-hover-glow group"
                    >
                      {rel.featuredImage && isValidImageUrl(rel.featuredImage) ? (
                        <Link href={`/stories/${rel.slug}`} className="h-36 overflow-hidden bg-gray-200 dark:bg-gray-800 block">
                          <img
                            src={rel.featuredImage}
                            alt={rel.title}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          />
                        </Link>
                      ) : (
                        <Link href={`/stories/${rel.slug}`} className="h-36 bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-300 dark:text-gray-600 block">
                          <BookOpen className="w-8 h-8" />
                        </Link>
                      )}
                      <div className="p-5 space-y-2 flex-grow flex flex-col justify-between">
                        <div>
                          {rel.category && (
                            <span className="text-[10px] font-extrabold text-brand-500 uppercase tracking-wider">
                              {rel.category.name}
                            </span>
                          )}
                          <h4 className="font-serif font-bold text-sm text-gray-900 dark:text-white group-hover:text-brand-500 transition line-clamp-2 leading-snug">
                            <Link href={`/stories/${rel.slug}`}>{rel.title}</Link>
                          </h4>
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800 text-[11px] text-gray-500 font-medium">
                          <span className="font-bold">{rel.author.name}</span>
                          <span>{rel.readingTime} min</span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          )}
        </main>

        {/* Right Sidebar with Native Ads (desktop) */}
        <aside className="hidden lg:block w-[300px] flex-shrink-0 space-y-6">
          <ArticleNativeAd placement="sidebar" />
        </aside>
        </div>
      </div>

      {/* Sticky Floating Bottom Ad (mobile/tablet) */}
      <StickyFloatingAd />
    </div>
  );
}
