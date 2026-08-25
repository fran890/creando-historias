import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import HeaderBannerAd from "@/components/ads/HeaderBannerAd";
import InContentAd from "@/components/ads/InContentAd";
import SidebarAd from "@/components/ads/SidebarAd";
import { Clock, Eye, User, Sparkles, Folder, TrendingUp, BookOpen } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

export const revalidate = 60; // ISR 1 minute

function isValidImageUrl(url: string | null | undefined): url is string {
  return !!url && (url.startsWith("http://") || url.startsWith("https://"));
}

export default async function HomePage() {
  const [currentUser, featuredArticles, recentArticles, categories] = await Promise.all([
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
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-0">
      {/* Hero Section — compact */}
      <section className="text-center space-y-3 max-w-3xl mx-auto pt-4 pb-6">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-brand-50 dark:bg-brand-950/50 border border-brand-200 dark:border-brand-800 text-brand-600 dark:text-brand-300 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Plataforma Editorial Abierta</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-black tracking-tight text-gray-900 dark:text-white leading-tight">
          Historias que inspiran, conocimiento que transforma
        </h1>
        <p className="text-base text-gray-600 dark:text-gray-400 font-sans">
          Descubre artículos de calidad redactados por autores expertos en diversas materias.
        </p>
      </section>

      {/* Header Banner Ad — full width, directly after hero */}
      <HeaderBannerAd />

      {/* Categories Bar */}
      {categories.length > 0 && (
        <section className="flex flex-wrap gap-2 justify-center border-y border-gray-200 dark:border-gray-800 py-3 mt-0">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-gray-100 dark:bg-gray-800 hover:bg-brand-500 hover:text-white transition text-gray-700 dark:text-gray-300"
            >
              <Folder className="w-3 h-3 opacity-60" />
              <span>{cat.name}</span>
            </Link>
          ))}
        </section>
      )}

      {/* Main 2-Column Layout: Content + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">
        {/* Main Content Column */}
        <div className="lg:col-span-8 space-y-8">
          {/* Featured Grid */}
          {featuredArticles.length > 0 && (
            <section className="space-y-5">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-brand-500" />
                <h2 className="font-serif text-2xl font-bold text-gray-900 dark:text-white">Lo más destacado</h2>
              </div>
              {/* Hero card + 3 side cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {featuredArticles.map((art, idx) => (
                  <article
                    key={art.id}
                    className={`flex flex-col bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition group ${idx === 0 ? "md:col-span-2" : ""}`}
                  >
                    {art.featuredImage && isValidImageUrl(art.featuredImage) && (
                      <div className={`${idx === 0 ? "h-56 sm:h-72" : "h-40"} overflow-hidden bg-gray-100 dark:bg-gray-800`}>
                        <img
                          src={art.featuredImage}
                          alt={art.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                      </div>
                    )}
                    <div className="p-5 flex flex-col justify-between flex-grow space-y-3">
                      <div className="space-y-1.5">
                        {art.category && (
                          <span className="text-[10px] font-bold text-brand-500 uppercase tracking-wider bg-brand-50 dark:bg-brand-950/40 px-2.5 py-0.5 rounded-full border border-brand-200 dark:border-brand-800">
                            {art.category.name}
                          </span>
                        )}
                        <h3 className={`font-serif font-bold leading-snug text-gray-900 dark:text-white group-hover:text-brand-500 transition ${idx === 0 ? "text-xl sm:text-2xl" : "text-base"}`}>
                          <Link href={`/stories/${art.slug}`}>{art.title}</Link>
                        </h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">{art.excerpt}</p>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-500">
                        <Link href={`/author/${art.author.username}`} className="flex items-center space-x-1.5 hover:text-brand-500 font-semibold">
                          <User className="w-3.5 h-3.5" />
                          <span>{art.author.name}</span>
                        </Link>
                        <div className="flex items-center space-x-3">
                          <span className="flex items-center space-x-1">
                            <Clock className="w-3 h-3 text-gray-400" />
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

          {/* In-Content Ad between featured and recent */}
          <InContentAd />

          {/* Recent Articles Feed */}
          <section className="space-y-5">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-brand-500" />
              <h2 className="font-serif text-2xl font-bold text-gray-900 dark:text-white">Últimas publicaciones</h2>
            </div>
            {recentArticles.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-2xl border border-dashed border-gray-300 dark:border-gray-800">
                <p className="text-gray-500">No hay publicaciones públicas disponibles por el momento.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentArticles.map((art, idx) => (
                  <div key={art.id}>
                    <article className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 hover:border-brand-300 dark:hover:border-brand-700 transition flex flex-col sm:flex-row gap-4">
                      {art.featuredImage && isValidImageUrl(art.featuredImage) && (
                        <div className="w-full sm:w-32 h-32 sm:h-24 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                          <img
                            src={art.featuredImage}
                            alt={art.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-grow space-y-1.5 min-w-0">
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <Link href={`/author/${art.author.username}`} className="font-semibold text-gray-900 dark:text-gray-200 hover:text-brand-500">
                            {art.author.name}
                          </Link>
                          <span>&bull;</span>
                          <span>{art.publishedAt ? formatDistanceToNow(new Date(art.publishedAt), { addSuffix: true, locale: es }) : ""}</span>
                          {art.category && (
                            <>
                              <span>&bull;</span>
                              <span className="text-brand-500 font-semibold">{art.category.name}</span>
                            </>
                          )}
                        </div>
                        <h3 className="font-serif text-base font-bold text-gray-900 dark:text-white hover:text-brand-500 transition leading-snug">
                          <Link href={`/stories/${art.slug}`}>{art.title}</Link>
                        </h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">{art.excerpt}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500 pt-1">
                          <span className="flex items-center space-x-1">
                            <Clock className="w-3 h-3 text-gray-400" />
                            <span>{art.readingTime} min</span>
                          </span>
                          {currentUser && (
                            <span className="flex items-center space-x-1">
                              <Eye className="w-3 h-3 text-gray-400" />
                              <span>{art.viewCount}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </article>

                    {/* In-feed ad placements: after 3rd and 7th items */}
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

          {/* Bottom ad after all content */}
          <InContentAd />
        </div>

        {/* Sidebar Column — sticky with multiple ad slots */}
        <aside className="lg:col-span-4">
          <div className="lg:sticky lg:top-20 space-y-6">
            <SidebarAd />
            {/* Additional sidebar ad slot */}
            <div className="hidden lg:block">
              <InContentAd format="rectangle" />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
