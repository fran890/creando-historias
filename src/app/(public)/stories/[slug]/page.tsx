import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import ArticleReader from "@/components/editor/ArticleReader";
import AnalyticsTracker from "@/components/analytics/AnalyticsTracker";
import HeaderBannerAd from "@/components/ads/HeaderBannerAd";
import SidebarAd from "@/components/ads/SidebarAd";
import NativeMatchedAd from "@/components/ads/NativeMatchedAd";
import StickyFloatingAd from "@/components/ads/StickyFloatingAd";
import { Clock, Eye, Calendar, Tag as TagIcon, ArrowLeft, Sparkles } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { Metadata } from "next";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await prisma.article.findUnique({
    where: { slug: params.slug },
    include: { author: true },
  });

  if (!article || article.status !== "PUBLISHED") {
    return { title: "Historia no encontrada" };
  }

  const title = article.seoTitle || `${article.title} - CreandoHistorias`;
  const description = article.seoDescription || article.excerpt || "";

  return {
    title,
    description,
    alternates: {
      canonical: article.canonicalUrl || `${process.env.NEXT_PUBLIC_APP_URL}/stories/${article.slug}`,
    },
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: article.publishedAt?.toISOString(),
      authors: [article.author.name],
      images: article.featuredImage ? [{ url: article.featuredImage }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: article.featuredImage ? [article.featuredImage] : [],
    },
  };
}

export default async function StoryPage({ params }: Props) {
  const currentUser = await getCurrentUser();

  const article = await prisma.article.findUnique({
    where: { slug: params.slug },
    include: {
      author: { select: { id: true, name: true, username: true, avatarUrl: true, bio: true } },
      category: true,
      tags: { include: { tag: true } },
    },
  });

  if (!article || article.status !== "PUBLISHED") {
    notFound();
  }

  // Recommended stories
  const recommendedArticles = await prisma.article.findMany({
    where: { status: "PUBLISHED", id: { not: article.id } },
    take: 3,
    include: { author: { select: { name: true, username: true } } },
  });

  // Schema.org JSON-LD Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.excerpt,
    image: article.featuredImage || undefined,
    datePublished: article.publishedAt?.toISOString(),
    dateModified: article.updatedAt.toISOString(),
    author: {
      "@type": "Person",
      name: article.author.name,
      url: `${process.env.NEXT_PUBLIC_APP_URL}/author/${article.author.username}`,
    },
  };

  return (
    <div className="relative pb-24 bg-gray-50 dark:bg-gray-950 min-h-screen">
      {/* Background Analytics Tracker */}
      <AnalyticsTracker articleId={article.id} authorId={article.author.id} />

      {/* JSON-LD Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-gray-500 hover:text-brand-500 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al inicio</span>
          </Link>
        </div>

        {/* Header Ad Placement */}
        <HeaderBannerAd />

        {/* Main 2-Column Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Article Column (8 cols) */}
          <main className="lg:col-span-8 bg-white dark:bg-gray-900 p-6 sm:p-10 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-8">
            <header className="space-y-6">
              {article.category && (
                <Link
                  href={`/category/${article.category.slug}`}
                  className="inline-block text-xs font-bold uppercase tracking-wider text-brand-500 bg-brand-50 dark:bg-brand-950/40 px-3.5 py-1 rounded-full border border-brand-200 dark:border-brand-800"
                >
                  {article.category.name}
                </Link>
              )}

              <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight">
                {article.title}
              </h1>

              {article.excerpt && (
                <p className="text-xl text-gray-600 dark:text-gray-300 font-sans leading-relaxed">
                  {article.excerpt}
                </p>
              )}

              {/* Author Metadata Row */}
              <div className="flex items-center justify-between py-4 border-y border-gray-200 dark:border-gray-800 text-sm text-gray-600 dark:text-gray-400">
                <Link href={`/author/${article.author.username}`} className="flex items-center space-x-3 group">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-brand-500 to-brand-800 text-white flex items-center justify-center font-bold font-serif text-lg overflow-hidden shadow-sm">
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

                <div className="flex items-center space-x-4 text-xs font-medium">
                  {article.publishedAt && (
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>{format(new Date(article.publishedAt), "dd MMMM, yyyy", { locale: es })}</span>
                    </span>
                  )}
                  <span className="flex items-center space-x-1">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>{article.readingTime} min lectura</span>
                  </span>
                  {currentUser && (
                    <span className="flex items-center space-x-1">
                      <Eye className="w-4 h-4 text-gray-400" />
                      <span>{article.viewCount} vistas</span>
                    </span>
                  )}
                </div>
              </div>
            </header>

            {/* Featured Image */}
            {article.featuredImage && (
              <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-800 max-h-[480px]">
                <img src={article.featuredImage} alt={article.title} className="w-full h-full object-cover" />
              </div>
            )}

            {/* Main Article Body with Dynamic In-Article Ads */}
            <ArticleReader content={article.content} enableInArticleAds={true} />

            {/* Tags List */}
            {article.tags.length > 0 && (
              <div className="pt-6 border-t border-gray-200 dark:border-gray-800 flex flex-wrap items-center gap-2">
                <TagIcon className="w-4 h-4 text-gray-400 mr-2" />
                {article.tags.map(({ tag }) => (
                  <Link
                    key={tag.id}
                    href={`/tag/${tag.slug}`}
                    className="text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-lg hover:bg-brand-500 hover:text-white transition"
                  >
                    #{tag.name}
                  </Link>
                ))}
              </div>
            )}

            {/* Author Bio Box */}
            <div className="p-6 bg-brand-50/50 dark:bg-gray-800/50 border border-brand-100 dark:border-gray-800 rounded-2xl flex items-start space-x-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-brand-500 to-brand-800 text-white flex items-center justify-center font-bold text-xl flex-shrink-0">
                {article.author.name.charAt(0)}
              </div>
              <div className="space-y-1">
                <h3 className="font-serif font-bold text-gray-900 dark:text-white text-lg">Escrito por {article.author.name}</h3>
                {article.author.bio && <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{article.author.bio}</p>}
                <Link
                  href={`/author/${article.author.username}`}
                  className="inline-block text-xs font-bold text-brand-500 hover:underline pt-2"
                >
                  Ver más historias de este autor &rarr;
                </Link>
              </div>
            </div>

            {/* Recommended Stories Grid */}
            <div className="pt-8 border-t border-gray-200 dark:border-gray-800 space-y-6">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-brand-500" />
                <h3 className="font-serif text-2xl font-bold text-gray-900 dark:text-white">Te podría interesar</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {recommendedArticles.map((rec) => (
                  <article key={rec.id} className="p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-2 hover:border-brand-300 transition">
                    <span className="text-[10px] font-bold text-brand-500 uppercase tracking-wider">Recomendado</span>
                    <h4 className="font-serif text-lg font-bold text-gray-900 dark:text-white hover:text-brand-500">
                      <Link href={`/stories/${rec.slug}`}>{rec.title}</Link>
                    </h4>
                    <p className="text-xs text-gray-500 line-clamp-2">{rec.excerpt}</p>
                  </article>
                ))}

                <NativeMatchedAd />
              </div>
            </div>
          </main>

          {/* Right Sidebar Column (4 cols) */}
          <aside className="lg:col-span-4 space-y-8">
            <SidebarAd />
          </aside>
        </div>
      </div>

      {/* Floating Bottom Sticky Ad */}
      <StickyFloatingAd />
    </div>
  );
}
