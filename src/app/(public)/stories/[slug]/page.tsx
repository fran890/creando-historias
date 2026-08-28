import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ArticleReader from "@/components/editor/ArticleReader";
import InContentAd from "@/components/ads/InContentAd";
import SidebarAd from "@/components/ads/SidebarAd";
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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await getCachedArticleBySlug(params.slug);

  if (!article) return {};

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://creando-historias-beta.vercel.app";
  const canonicalUrl = `${baseUrl}/stories/${params.slug}`;
  const hasValidImage = isValidImageUrl(article.featuredImage);

  return {
    title: `${article.title} | Creando-Historias`,
    description: article.excerpt || `Lee ${article.title} por ${article.author.name} en Creando-Historias.`,
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
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

        {/* Main 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Article Column */}
          <div className="lg:col-span-8 space-y-6">
            <article
              itemScope
              itemType="https://schema.org/BlogPosting"
              className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200/80 dark:border-gray-800/80 shadow-xs overflow-hidden"
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

              <div className="p-6 sm:p-10 space-y-6">
                <header className="space-y-4">
                  {article.category && (
                    <Link
                      href={`/category/${article.category.slug}`}
                      className="inline-block text-xs font-extrabold uppercase tracking-wider text-brand-500 bg-brand-50 dark:bg-brand-950/50 px-3.5 py-1 rounded-full border border-brand-200 dark:border-brand-800/60"
                    >
                      {article.category.name}
                    </Link>
                  )}

                  <h1 itemProp="headline" className="font-serif text-3xl sm:text-5xl font-black text-gray-900 dark:text-white leading-tight">
                    {article.title}
                  </h1>

                  {article.excerpt && (
                    <p itemProp="description" className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 font-sans leading-relaxed">
                      {article.excerpt}
                    </p>
                  )}

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
                </header>

                {/* Article Body */}
                <div itemProp="articleBody" className="font-sans text-gray-800 dark:text-gray-200 leading-relaxed text-base sm:text-lg">
                  <ArticleReader content={stripBase64FromHtml(article.content)} />
                </div>


                {article.tags.length > 0 && (
                  <div className="pt-6 border-t border-gray-100 dark:border-gray-800/80 flex items-center flex-wrap gap-2">
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

            {/* Bottom Ad */}
            <InContentAd />
          </div>

          {/* Sidebar Column (4 cols) */}
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-20 space-y-6">
              <SidebarAd />

              {/* Author Card */}
              <div className="bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800/80 rounded-3xl p-6 space-y-4 shadow-xs">
                <div className="flex items-center space-x-2 text-xs font-bold text-brand-500 uppercase tracking-wider border-b border-gray-100 dark:border-gray-800 pb-3">
                  <User className="w-4 h-4" />
                  <span>Sobre el autor</span>
                </div>
                <Link href={`/author/${article.author.username}`} className="flex items-center space-x-3 group">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-500 to-brand-800 text-white flex items-center justify-center font-bold font-serif text-lg overflow-hidden shadow-glow">
                    {article.author.avatarUrl ? (
                      <img src={article.author.avatarUrl} alt={article.author.name} className="w-full h-full object-cover" />
                    ) : (
                      article.author.name.charAt(0)
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white group-hover:text-brand-500 transition text-base">
                      {article.author.name}
                    </p>
                    <p className="text-xs text-gray-500 font-medium">@{article.author.username}</p>
                  </div>
                </Link>
                {article.author.bio && (
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed font-sans">{article.author.bio}</p>
                )}
                <Link
                  href={`/author/${article.author.username}`}
                  className="block w-full text-center py-2.5 bg-gray-100 dark:bg-gray-800/60 hover:bg-brand-500 hover:text-white text-xs font-bold rounded-2xl transition"
                >
                  Ver todas sus historias
                </Link>
              </div>


            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
