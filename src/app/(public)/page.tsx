import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import HeaderBannerAd from "@/components/ads/HeaderBannerAd";
import InContentAd from "@/components/ads/InContentAd";
import SidebarAd from "@/components/ads/SidebarAd";
import { Clock, Eye, User, Sparkles, Folder, TrendingUp, BookOpen, ArrowRight, Zap } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

export const revalidate = 60; // ISR 1 minute

function isValidImageUrl(url: string | null | undefined): url is string {
  return !!url && (url.startsWith("http://") || url.startsWith("https://"));
}

export default async function HomePage() {
  const [currentUser, featuredArticles, recentArticles, categories, stats] = await Promise.all([
    getCurrentUser(),
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
    Promise.all([
      prisma.article.count({ where: { status: "PUBLISHED" } }),
      prisma.user.count({ where: { role: "AUTHOR" } }),
    ]),
  ]);

  const [totalPublishedCount, totalAuthorsCount] = stats;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Premium Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-brand-950/40 via-gray-900/60 to-transparent p-8 sm:p-14 border border-brand-900/30 text-center space-y-6 max-w-4xl mx-auto shadow-2xl backdrop-blur-sm">
        {/* Glow Accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-brand-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 text-xs font-extrabold uppercase tracking-wider animate-pulse">
          <Sparkles className="w-4 h-4 text-brand-400" />
          <span>Plataforma Editorial Abierta</span>
        </div>

        <h1 className="relative z-10 font-display text-4xl sm:text-6xl font-black tracking-tight text-gray-900 dark:text-white leading-tight sm:leading-tight">
          Historias que inspiran, <br className="hidden sm:inline" />
          <span className="gradient-text">conocimiento que transforma</span>
        </h1>

        <p className="relative z-10 text-base sm:text-lg text-gray-600 dark:text-gray-300 font-sans max-w-2xl mx-auto leading-relaxed">
          Descubre publicaciones de calidad redactadas por autores expertos en literatura, ciencia, historia y opinión.
        </p>

        {/* Stats Highlight Pills */}
        <div className="relative z-10 pt-2 flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-gray-500 dark:text-gray-400">
          <span className="inline-flex items-center space-x-2 px-4 py-2 rounded-2xl bg-white/80 dark:bg-gray-900/80 border border-gray-200 dark:border-gray-800 shadow-xs">
            <BookOpen className="w-4 h-4 text-brand-500" />
            <span>{totalPublishedCount} Historias Publicadas</span>
          </span>
          <span className="inline-flex items-center space-x-2 px-4 py-2 rounded-2xl bg-white/80 dark:bg-gray-900/80 border border-gray-200 dark:border-gray-800 shadow-xs">
            <User className="w-4 h-4 text-purple-500" />
            <span>{totalAuthorsCount} Autores Activos</span>
          </span>
          <span className="inline-flex items-center space-x-2 px-4 py-2 rounded-2xl bg-white/80 dark:bg-gray-900/80 border border-gray-200 dark:border-gray-800 shadow-xs">
            <Zap className="w-4 h-4 text-amber-500" />
            <span>Lectura Rápida & Sin Interrupciones</span>
          </span>
        </div>
      </section>

      {/* Header Banner Ad */}
      <HeaderBannerAd />

      {/* Interactive Categories Pill Bar */}
      {categories.length > 0 && (
        <section className="flex flex-wrap gap-2.5 justify-center border-y border-gray-200/80 dark:border-gray-800/80 py-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-2xl text-xs font-bold bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-brand-500 hover:text-brand-500 dark:hover:border-brand-500 dark:hover:text-brand-400 transition-all duration-200 shadow-xs hover:shadow-glow"
            >
              <Folder className="w-3.5 h-3.5 text-brand-500 opacity-80" />
              <span>{cat.name}</span>
            </Link>
          ))}
        </section>
      )}

      {/* Main 2-Column Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
        {/* Main Content Column (8 cols) */}
        <div className="lg:col-span-8 space-y-10">
          {/* Featured Stories Section */}
          {featuredArticles.length > 0 && (
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-xl bg-brand-500/10 text-brand-500 flex items-center justify-center font-bold">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <h2 className="font-display text-2xl font-black text-gray-900 dark:text-white">Lo más destacado</h2>
                </div>
                <span className="text-xs font-semibold text-gray-400">Tendencias del mes</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {featuredArticles.map((art, idx) => (
                  <article
                    key={art.id}
                    className={`flex flex-col bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800/80 rounded-3xl overflow-hidden shadow-xs card-hover-glow group ${
                      idx === 0 ? "md:col-span-2" : ""
                    }`}
                  >
                    {art.featuredImage && isValidImageUrl(art.featuredImage) && (
                      <div className={`${idx === 0 ? "h-60 sm:h-72" : "h-44"} overflow-hidden bg-gray-100 dark:bg-gray-800 relative`}>
                        <img
                          src={art.featuredImage}
                          alt={art.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/60 via-transparent to-transparent opacity-60" />
                      </div>
                    )}
                    <div className="p-6 flex flex-col justify-between flex-grow space-y-4">
                      <div className="space-y-2">
                        {art.category && (
                          <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider text-brand-500 bg-brand-50 dark:bg-brand-950/50 px-3 py-1 rounded-full border border-brand-200 dark:border-brand-800/60">
                            {art.category.name}
                          </span>
                        )}
                        <h3 className={`font-serif font-bold leading-snug text-gray-900 dark:text-white group-hover:text-brand-500 transition duration-200 ${idx === 0 ? "text-xl sm:text-2xl" : "text-base"}`}>
                          <Link href={`/stories/${art.slug}`}>{art.title}</Link>
                        </h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">{art.excerpt}</p>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-500 font-medium">
                        <Link href={`/author/${art.author.username}`} className="flex items-center space-x-2 hover:text-brand-500 font-bold transition">
                          <User className="w-3.5 h-3.5 text-brand-500" />
                          <span>{art.author.name}</span>
                        </Link>
                        <div className="flex items-center space-x-3">
                          <span className="flex items-center space-x-1">
                            <Clock className="w-3.5 h-3.5 text-gray-400" />
                            <span>{art.readingTime} min</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* In-Content Ad Placement */}
          <InContentAd />

          {/* Recent Articles Feed */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center font-bold">
                  <BookOpen className="w-4 h-4" />
                </div>
                <h2 className="font-display text-2xl font-black text-gray-900 dark:text-white">Últimas publicaciones</h2>
              </div>
            </div>

            {recentArticles.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-3xl border border-dashed border-gray-300 dark:border-gray-800 space-y-2">
                <p className="text-gray-500 font-medium">No hay publicaciones públicas disponibles por el momento.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentArticles.map((art, idx) => (
                  <div key={art.id}>
                    <article className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800/80 rounded-3xl p-5 hover:border-brand-300 dark:hover:border-brand-700 transition duration-200 flex flex-col sm:flex-row gap-5 shadow-xs card-hover-glow">
                      {art.featuredImage && isValidImageUrl(art.featuredImage) && (
                        <div className="w-full sm:w-36 h-36 sm:h-28 rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                          <img
                            src={art.featuredImage}
                            alt={art.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-grow space-y-2 min-w-0 flex flex-col justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2 text-[11px] text-gray-500 font-medium">
                            <Link href={`/author/${art.author.username}`} className="font-bold text-gray-900 dark:text-gray-200 hover:text-brand-500 transition">
                              {art.author.name}
                            </Link>
                            <span>&bull;</span>
                            <span>{art.publishedAt ? formatDistanceToNow(new Date(art.publishedAt), { addSuffix: true, locale: es }) : ""}</span>
                            {art.category && (
                              <>
                                <span>&bull;</span>
                                <span className="text-brand-500 font-bold">{art.category.name}</span>
                              </>
                            )}
                          </div>
                          <h3 className="font-serif text-base font-bold text-gray-900 dark:text-white hover:text-brand-500 transition leading-snug line-clamp-2">
                            <Link href={`/stories/${art.slug}`}>{art.title}</Link>
                          </h3>
                          <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">{art.excerpt}</p>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 font-medium">
                          <span className="flex items-center space-x-1">
                            <Clock className="w-3.5 h-3.5 text-gray-400" />
                            <span>{art.readingTime} min lectura</span>
                          </span>
                          <Link href={`/stories/${art.slug}`} className="inline-flex items-center space-x-1 text-xs font-bold text-brand-500 hover:text-brand-600">
                            <span>Leer artículo</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    </article>

                    {/* In-feed ad placements */}
                    {(idx === 2 || idx === 6) && (
                      <div className="mt-4">
                        <InContentAd />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Bottom Ad */}
          <InContentAd />
        </div>

        {/* Sidebar Column (4 cols) */}
        <aside className="lg:col-span-4">
          <div className="lg:sticky lg:top-20 space-y-6">
            <SidebarAd />
            <div className="hidden lg:block">
              <InContentAd format="rectangle" />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
