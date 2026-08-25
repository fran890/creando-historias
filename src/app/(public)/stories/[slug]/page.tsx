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
import { Clock, Eye, Calendar, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface Props {
  params: { slug: string };
}

export const revalidate = 60; // ISR 1 minute

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

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://creandohistorias.com";
  const canonicalUrl = `${baseUrl}/stories/${params.slug}`;

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
      images: article.featuredImage ? [{ url: article.featuredImage }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt || undefined,
      images: article.featuredImage ? [article.featuredImage] : [],
    },
  };
}

export default async function StoryPage({ params }: Props) {
  // Parallelized database queries for maximum performance
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

  // RBAC check for unpublished articles
  if (article.status !== "PUBLISHED") {
    const isOwner = currentUser?.userId === article.author.id;
    const isAdmin = currentUser?.role === "ADMIN";

    if (!isOwner && !isAdmin) {
      notFound();
    }
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.excerpt,
    image: article.featuredImage ? [article.featuredImage] : undefined,
    datePublished: article.publishedAt,
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
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-gray-500 hover:text-brand-500 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al inicio</span>
          </Link>

          <CopyLinkButton slug={article.slug} variant="pill" />
        </div>

        {/* Header Ad Placement */}
        <HeaderBannerAd />

        {/* Main 2-Column Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Article Column (8 cols) */}
          <main className="lg:col-span-8 bg-white dark:bg-gray-900 p-6 sm:p-10 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xs space-y-8">
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
              <div className="flex items-center justify-between py-4 border-y border-gray-200 dark:border-gray-800 text-sm text-gray-600 dark:text-gray-400 flex-wrap gap-4">
                <Link href={`/author/${article.author.username}`} className="flex items-center space-x-3 group">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-brand-500 to-brand-800 text-white flex items-center justify-center font-bold font-serif text-lg overflow-hidden shadow-xs">
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

                <div className="flex items-center space-x-4 text-xs font-medium flex-wrap gap-y-2">
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
              <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-800">
                <img
                  src={article.featuredImage}
                  alt={article.title}
                  className="w-full max-h-[500px] object-cover"
                />
              </div>
            )}

            {/* Article Body Content */}
            <div className="prose dark:prose-invert max-w-none font-sans text-gray-800 dark:text-gray-200 leading-relaxed">
              <ArticleReader content={article.content} />
            </div>

            {/* In-Article Ad Placement */}
            <InContentAd />

            {/* Tags Footer */}
            {article.tags.length > 0 && (
              <div className="pt-6 border-t border-gray-200 dark:border-gray-800 flex items-center space-x-2 flex-wrap gap-y-2">
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
          </main>

          {/* Sidebar Column (4 cols) */}
          <aside className="lg:col-span-4 space-y-8">
            <SidebarAd />
          </aside>
        </div>
      </div>
    </div>
  );
}
