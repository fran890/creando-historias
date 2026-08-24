import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { Clock, Eye, User, Sparkles, Folder } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

export const revalidate = 60; // ISR 1 minute

export default async function HomePage() {
  const currentUser = await getCurrentUser();

  const featuredArticles = await prisma.article.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { viewCount: "desc" },
    take: 3,
    include: {
      author: { select: { name: true, username: true, avatarUrl: true } },
      category: { select: { name: true, slug: true } },
    },
  });

  const recentArticles = await prisma.article.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    take: 10,
    include: {
      author: { select: { name: true, username: true, avatarUrl: true } },
      category: { select: { name: true, slug: true } },
    },
  });

  const categories = await prisma.category.findMany({
    take: 8,
    include: { _count: { select: { articles: { where: { status: "PUBLISHED" } } } } },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-4 max-w-3xl mx-auto pt-6">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-brand-50 dark:bg-brand-950/50 border border-brand-200 dark:border-brand-800 text-brand-600 dark:text-brand-300 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Plataforma Editorial Abierta</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl font-black tracking-tight text-gray-900 dark:text-white leading-tight">
          Historias que inspiran, conocimiento que transforma
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 font-sans">
          Descubre artículos de calidad redactados por autores expertos en diversas materias.
        </p>
      </section>

      {/* Categories Bar */}
      {categories.length > 0 && (
        <section className="flex flex-wrap gap-2 justify-center border-y border-gray-200 dark:border-gray-800 py-4">
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

      {/* Featured Grid */}
      {featuredArticles.length > 0 && (
        <section className="space-y-6">
          <h2 className="font-serif text-2xl font-bold text-gray-900 dark:text-white">Lo más destacado</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredArticles.map((art) => (
              <article
                key={art.id}
                className="flex flex-col bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition group"
              >
                {art.featuredImage && (
                  <div className="h-48 overflow-hidden bg-gray-100 dark:bg-gray-800">
                    <img
                      src={art.featuredImage}
                      alt={art.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>
                )}
                <div className="p-6 flex flex-col justify-between flex-grow space-y-4">
                  <div className="space-y-2">
                    {art.category && (
                      <span className="text-[10px] font-bold text-brand-500 uppercase tracking-wider bg-brand-50 dark:bg-brand-950/40 px-2.5 py-0.5 rounded-full border border-brand-200 dark:border-brand-800">
                        {art.category.name}
                      </span>
                    )}
                    <h3 className="font-serif text-xl font-bold leading-snug text-gray-900 dark:text-white group-hover:text-brand-500 transition">
                      <Link href={`/stories/${art.slug}`}>{art.title}</Link>
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">{art.excerpt}</p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-500">
                    <Link href={`/author/${art.author.username}`} className="flex items-center space-x-1.5 hover:text-brand-500 font-semibold">
                      <User className="w-3.5 h-3.5" />
                      <span>{art.author.name}</span>
                    </Link>
                    <div className="flex items-center space-x-3 text-xs">
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
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Recent Feed */}
      <section className="space-y-6">
        <h2 className="font-serif text-2xl font-bold text-gray-900 dark:text-white">Últimas publicaciones</h2>
        {recentArticles.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-3xl border border-dashed border-gray-300 dark:border-gray-800">
            <p className="text-gray-500">No hay publicaciones públicas disponibles por el momento.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            {recentArticles.map((art) => (
              <article key={art.id} className="p-6 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2 max-w-3xl">
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
                  <h3 className="font-serif text-lg font-bold text-gray-900 dark:text-white hover:text-brand-500 transition">
                    <Link href={`/stories/${art.slug}`}>{art.title}</Link>
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">{art.excerpt}</p>
                </div>
                <div className="flex items-center space-x-4 text-xs text-gray-500 flex-shrink-0">
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    <span>{art.readingTime} min</span>
                  </span>
                  {currentUser && (
                    <span className="flex items-center space-x-1">
                      <Eye className="w-3.5 h-3.5 text-gray-400" />
                      <span>{art.viewCount} vistas</span>
                    </span>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
