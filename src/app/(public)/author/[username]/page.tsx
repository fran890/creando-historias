import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import SidebarAd from "@/components/ads/SidebarAd";
import NativeMatchedAd from "@/components/ads/NativeMatchedAd";
import StickyFloatingAd from "@/components/ads/StickyFloatingAd";
import AdSenseScript from "@/components/ads/AdSenseScript";
import { BookOpen, Eye, Clock, Calendar, ArrowLeft, Folder, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface Props {
  params: { username: string };
  searchParams?: { page?: string };
}

const ITEMS_PER_PAGE = 12;

export async function generateMetadata({ params }: Props) {
  const author = await prisma.user.findUnique({ where: { username: params.username } });
  if (!author) return { title: "Autor no encontrado" };
  return { title: `${author.name} – CreandoHistorias` };
}

export default async function AuthorProfilePage({ params, searchParams }: Props) {
  const page = Math.max(1, parseInt(searchParams?.page || "1", 10));
  const skip = (page - 1) * ITEMS_PER_PAGE;

  const author = await prisma.user.findUnique({
    where: { username: params.username },
    select: {
      id: true,
      name: true,
      username: true,
      bio: true,
      avatarUrl: true,
      _count: { select: { articles: true, views: true } },
    },
  });

  if (!author) notFound();

  // Parallelized count & paginated query using compound index [status, authorId, publishedAt]
  const [totalPublishedCount, articles, categories] = await Promise.all([
    prisma.article.count({
      where: { authorId: author.id, status: "PUBLISHED" },
    }),
    prisma.article.findMany({
      where: { authorId: author.id, status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
      take: ITEMS_PER_PAGE,
      skip,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        featuredImage: true,
        readingTime: true,
        viewCount: true,
        publishedAt: true,
        category: { select: { name: true, slug: true } },
      },
    }),
    prisma.category.findMany({ take: 6 }),
  ]);

  const totalPages = Math.ceil(totalPublishedCount / ITEMS_PER_PAGE);

  return (
    <div className="relative pb-24 bg-gray-50 dark:bg-gray-950 min-h-screen">
      <AdSenseScript />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        <div>
          <Link
            href="/"
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-gray-500 hover:text-brand-500 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al inicio</span>
          </Link>
        </div>

        {/* Hero Author Profile Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-600 via-purple-700 to-brand-900 text-white p-8 sm:p-12 shadow-lg">
          <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-white/90 shadow-xl overflow-hidden flex-shrink-0 bg-white text-brand-600 font-serif font-black text-4xl flex items-center justify-center">
              {author.avatarUrl ? (
                <img src={author.avatarUrl} alt={author.name} className="w-full h-full object-cover" />
              ) : (
                author.name.charAt(0)
              )}
            </div>

            <div className="space-y-3 flex-grow">
              <div>
                <span className="inline-block text-[11px] font-bold uppercase tracking-wider bg-white/20 text-white px-3 py-1 rounded-full mb-2 border border-white/20">
                  Perfil de Autor Oficial
                </span>
                <h1 className="font-serif text-3xl sm:text-5xl font-black tracking-tight">{author.name}</h1>
                <p className="text-sm font-medium opacity-80">@{author.username}</p>
              </div>

              {author.bio && (
                <p className="text-sm sm:text-base opacity-95 max-w-2xl font-sans leading-relaxed">
                  {author.bio}
                </p>
              )}

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2 text-xs font-semibold">
                <span className="inline-flex items-center space-x-1.5 bg-white/10 px-3.5 py-1.5 rounded-xl border border-white/20">
                  <BookOpen className="w-4 h-4" />
                  <span>{totalPublishedCount} Historias Publicadas</span>
                </span>
                <span className="inline-flex items-center space-x-1.5 bg-white/10 px-3.5 py-1.5 rounded-xl border border-white/20">
                  <Eye className="w-4 h-4" />
                  <span>{author._count.views} Vistas Acumuladas</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <main className="lg:col-span-8 space-y-8">
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-4">
              <h2 className="font-serif text-2xl font-bold text-gray-900 dark:text-white">
                Publicaciones de {author.name}
              </h2>
              <span className="text-xs text-gray-500">{totalPublishedCount} resultados</span>
            </div>

            {articles.length === 0 ? (
              <div className="p-12 text-center bg-white dark:bg-gray-900 rounded-3xl border border-dashed border-gray-300 dark:border-gray-800 space-y-2">
                <p className="text-gray-500 font-medium">Este autor aún no ha publicado historias.</p>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {articles.map((art, index) => {
                    const shouldShowAd = (index + 1) % 4 === 0 && index < articles.length - 1;
                    return (
                      <div key={art.id} className="contents">
                        <article className="flex flex-col bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm hover:shadow-md transition group">
                          {art.featuredImage && (
                            <div className="h-48 overflow-hidden bg-gray-100 dark:bg-gray-800 relative">
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
                                <span className="inline-block text-[10px] font-bold text-brand-500 uppercase tracking-wider bg-brand-50 dark:bg-brand-950/40 px-2.5 py-0.5 rounded-full border border-brand-200 dark:border-brand-800">
                                  {art.category.name}
                                </span>
                              )}
                              <h3 className="font-serif text-xl font-bold leading-snug text-gray-900 dark:text-white group-hover:text-brand-500 transition">
                                <Link href={`/stories/${art.slug}`}>{art.title}</Link>
                              </h3>
                              {art.excerpt && (
                                <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-3 leading-relaxed">
                                  {art.excerpt}
                                </p>
                              )}
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800 text-[11px] text-gray-500">
                              <div className="flex items-center space-x-1.5">
                                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                                <span>{art.publishedAt ? format(new Date(art.publishedAt), "dd MMM, yyyy", { locale: es }) : ""}</span>
                              </div>
                              <div className="flex items-center space-x-3">
                                <span className="flex items-center space-x-1">
                                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                                  <span>{art.readingTime} min</span>
                                </span>

                              </div>
                            </div>
                          </div>
                        </article>

                        {shouldShowAd && <NativeMatchedAd />}
                      </div>
                    );
                  })}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center space-x-4 pt-6 border-t border-gray-200 dark:border-gray-800">
                    {page > 1 ? (
                      <Link
                        href={`/author/${author.username}?page=${page - 1}`}
                        className="inline-flex items-center space-x-1 px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-brand-500 hover:text-white transition"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span>Anterior</span>
                      </Link>
                    ) : (
                      <span className="inline-flex items-center space-x-1 px-4 py-2 opacity-40 text-xs font-bold text-gray-400 cursor-not-allowed">
                        <ChevronLeft className="w-4 h-4" />
                        <span>Anterior</span>
                      </span>
                    )}

                    <span className="text-xs font-semibold text-gray-500">
                      Página {page} de {totalPages}
                    </span>

                    {page < totalPages ? (
                      <Link
                        href={`/author/${author.username}?page=${page + 1}`}
                        className="inline-flex items-center space-x-1 px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-brand-500 hover:text-white transition"
                      >
                        <span>Siguiente</span>
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    ) : (
                      <span className="inline-flex items-center space-x-1 px-4 py-2 opacity-40 text-xs font-bold text-gray-400 cursor-not-allowed">
                        <span>Siguiente</span>
                        <ChevronRight className="w-4 h-4" />
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}
          </main>

          <aside className="lg:col-span-4 space-y-8">
            <SidebarAd slotId="author-sidebar-ad-1" />

            {categories.length > 0 && (
              <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
                <div className="flex items-center space-x-2 border-b border-gray-100 dark:border-gray-800 pb-3">
                  <Folder className="w-4 h-4 text-brand-500" />
                  <h3 className="font-serif font-bold text-gray-900 dark:text-white text-base">Categorías Destacadas</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/category/${cat.slug}`}
                      className="text-xs font-semibold px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-brand-500 hover:text-white transition"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>

      <StickyFloatingAd slotId="author-floating-ad-1" />
    </div>
  );
}
