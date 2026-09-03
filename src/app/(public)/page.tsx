import Link from "next/link";
import { getCachedHomePageArticles } from "@/lib/cache/articles";
import Pagination from "@/components/common/Pagination";
import HeaderBannerAd from "@/components/ads/HeaderBannerAd";
import StickyFloatingAd from "@/components/ads/StickyFloatingAd";
import { Clock, User, Folder, TrendingUp, BookOpen, ArrowRight, Zap } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

export const revalidate = 3600; // 1 hour ISR fallback

function isValidImageUrl(url: string | null | undefined): url is string {
  return !!url && (url.startsWith("http://") || url.startsWith("https://"));
}

interface HomePageProps {
  searchParams?: { page?: string };
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const currentPage = Math.max(1, parseInt(searchParams?.page || "1", 10) || 1);
  const homeData = await getCachedHomePageArticles(currentPage, 8);

  const { featuredArticles, recentArticles, categories, totalPublishedCount, totalPages } = homeData;

  return (
    <div className="max-w-4xl mx-auto px-0 sm:px-6 py-4 sm:py-8 space-y-6 sm:space-y-8">
      {/* Modern & Inspiring Hero Section */}
      <section className="bg-gradient-to-b from-white via-gray-50/70 to-white dark:from-gray-900 dark:via-gray-900/90 dark:to-gray-900 border-x-0 sm:border border-gray-200/80 dark:border-gray-800/80 rounded-none sm:rounded-3xl p-6 sm:p-10 text-center space-y-5 w-full shadow-xs">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 border border-gray-200/80 dark:border-gray-700/80 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Plataforma Editorial Abierta</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl lg:text-[40px] font-black tracking-tight text-gray-900 dark:text-white leading-[1.25]">
          Historias que inspiran, <br className="hidden sm:inline" />
          conocimiento que transforma
        </h1>

        <p className="text-base text-gray-600 dark:text-gray-400 font-sans max-w-xl mx-auto leading-relaxed">
          Descubre artículos de calidad redactados por autores expertos en diversas materias.
        </p>

        {/* Clean Stats Highlight Pills */}
        <div className="pt-1 flex flex-wrap items-center justify-center gap-3 text-xs font-medium text-gray-600 dark:text-gray-400">
          <span className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200/80 dark:border-gray-700/60">
            <BookOpen className="w-3.5 h-3.5 text-brand-500" />
            <span>{totalPublishedCount} Historias Publicadas</span>
          </span>
          <span className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200/80 dark:border-gray-700/60">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>Lectura Rápida & Sin Interrupciones</span>
          </span>
        </div>
      </section>

      {/* Categories Bar */}
      {categories.length > 0 && (
        <section className="w-full flex flex-wrap gap-2 justify-center border-y border-gray-200/80 dark:border-gray-800/80 py-3.5">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition text-gray-700 dark:text-gray-300"
            >
              <Folder className="w-3 h-3 opacity-60" />
              <span>{cat.name}</span>
            </Link>
          ))}
        </section>
      )}

      {/* Homepage Ad Banner */}
      <HeaderBannerAd />

      {/* Featured Stories Section */}
      {featuredArticles.length > 0 && (
        <section className="space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              <h2 className="font-serif text-2xl font-bold text-gray-900 dark:text-white">Lo más destacado</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredArticles.map((art, idx) => (
              <article
                key={art.id}
                className={`flex flex-col bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-xs hover:border-gray-400 dark:hover:border-gray-600 transition group ${
                  idx === 0 ? "md:col-span-2" : ""
                }`}
              >
                {art.featuredImage && isValidImageUrl(art.featuredImage) && (
                  <Link
                    href={`/stories/${art.slug}`}
                    className={`block ${idx === 0 ? "h-56 sm:h-72" : "h-40"} overflow-hidden bg-gray-100 dark:bg-gray-800 relative`}
                  >
                    <img
                      src={art.featuredImage}
                      alt={art.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  </Link>
                )}
                <div className="p-5 flex flex-col justify-between flex-grow space-y-3">
                  <div className="space-y-1.5">
                    {art.category && (
                      <span className="text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider bg-gray-100 dark:bg-gray-800 px-2.5 py-0.5 rounded-full">
                        {art.category.name}
                      </span>
                    )}
                    <h3 className={`font-serif font-bold leading-snug text-gray-900 dark:text-white group-hover:text-gray-600 dark:group-hover:text-gray-300 transition ${idx === 0 ? "text-xl sm:text-2xl" : "text-base"}`}>
                      <Link href={`/stories/${art.slug}`}>{art.title}</Link>
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">{art.excerpt}</p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-500 font-medium">
                    <Link href={`/author/${art.author.username}`} className="flex items-center space-x-1.5 hover:text-gray-900 dark:hover:text-white font-semibold">
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

      {/* Recent Articles Feed */}
      <section className="space-y-5">
        <div className="flex items-center space-x-2">
          <BookOpen className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          <h2 className="font-serif text-2xl font-bold text-gray-900 dark:text-white">Últimas publicaciones</h2>
        </div>

        {recentArticles.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-2xl border border-dashed border-gray-300 dark:border-gray-800">
            <p className="text-gray-500">No hay publicaciones públicas disponibles por el momento.</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-4">
              {recentArticles.map((art) => (
                <div key={art.id}>
                  <article className="bg-white dark:bg-gray-900 border-x-0 sm:border border-gray-200 dark:border-gray-800 rounded-none sm:rounded-2xl p-4 sm:p-5 hover:border-gray-400 dark:hover:border-gray-600 transition flex flex-col sm:flex-row gap-4 shadow-xs">
                    {art.featuredImage && isValidImageUrl(art.featuredImage) && (
                      <Link
                        href={`/stories/${art.slug}`}
                        className="w-full sm:w-32 h-32 sm:h-24 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0 block"
                      >
                        <img
                          src={art.featuredImage}
                          alt={art.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                      </Link>
                    )}
                    <div className="flex-grow space-y-1.5 min-w-0 flex flex-col justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <Link href={`/author/${art.author.username}`} className="font-semibold text-gray-900 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-300">
                            {art.author.name}
                          </Link>
                          <span>&bull;</span>
                          <span suppressHydrationWarning>{art.publishedAt ? formatDistanceToNow(new Date(art.publishedAt), { addSuffix: true, locale: es }) : ""}</span>
                          {art.category && (
                            <>
                              <span>&bull;</span>
                              <span className="font-semibold text-gray-700 dark:text-gray-300">{art.category.name}</span>
                            </>
                          )}
                        </div>
                        <h3 className="font-serif text-base font-bold text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition leading-snug line-clamp-2">
                          <Link href={`/stories/${art.slug}`}>{art.title}</Link>
                        </h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">{art.excerpt}</p>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3 h-3 text-gray-400" />
                          <span>{art.readingTime} min</span>
                        </span>
                        <Link href={`/stories/${art.slug}`} className="inline-flex items-center space-x-1 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                          <span>Leer artículo</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </article>
                </div>
              ))}
            </div>

            {/* Pagination Numerator */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              baseUrl="/"
            />
          </div>
        )}
      </section>
      {/* Sticky bottom ad */}
      <StickyFloatingAd />
    </div>
  );
}
