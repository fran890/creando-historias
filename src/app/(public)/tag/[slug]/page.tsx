import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Tag as TagIcon, Eye, Clock, ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  params: { slug: string };
  searchParams?: { page?: string };
}

const ITEMS_PER_PAGE = 12;

export async function generateMetadata({ params }: Props) {
  const tag = await prisma.tag.findUnique({ where: { slug: params.slug } });
  if (!tag) return { title: "Etiqueta no encontrada" };
  return { title: `Etiqueta: #${tag.name} - Creando-Historias` };
}

export default async function TagPage({ params, searchParams }: Props) {
  const page = Math.max(1, parseInt(searchParams?.page || "1", 10));
  const skip = (page - 1) * ITEMS_PER_PAGE;

  const tag = await prisma.tag.findUnique({
    where: { slug: params.slug },
    select: { id: true, name: true, slug: true },
  });

  if (!tag) notFound();

  // Parallelized count & paginated tag articles query
  const [totalCount, articleTags] = await Promise.all([
    prisma.articleTag.count({
      where: { tagId: tag.id, article: { status: "PUBLISHED" } },
    }),
    prisma.articleTag.findMany({
      where: { tagId: tag.id, article: { status: "PUBLISHED" } },
      orderBy: { article: { publishedAt: "desc" } },
      take: ITEMS_PER_PAGE,
      skip,
      select: {
        article: {
          select: {
            id: true,
            title: true,
            slug: true,
            excerpt: true,
            featuredImage: true,
            readingTime: true,
            viewCount: true,
            author: { select: { name: true, username: true } },
          },
        },
      },
    }),
  ]);

  const publishedArticles = articleTags.map((ta) => ta.article);
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-200 dark:border-gray-800 pb-6 space-y-2">
        <div className="flex items-center space-x-2 text-brand-500 font-bold text-xs uppercase tracking-wider">
          <TagIcon className="w-4 h-4" />
          <span>Etiqueta</span>
        </div>
        <h1 className="font-serif text-3xl font-black text-gray-900 dark:text-white">#{tag.name}</h1>
        <p className="text-xs text-gray-400 font-medium">{totalCount} publicaciones con esta etiqueta</p>
      </div>

      {publishedArticles.length === 0 ? (
        <p className="text-gray-500 py-12 text-center bg-white dark:bg-gray-900 rounded-3xl border border-dashed border-gray-300 dark:border-gray-800">
          No hay publicaciones con esta etiqueta.
        </p>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {publishedArticles.map((art) => (
              <article key={art.id} className="flex flex-col bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-xs hover:border-brand-300 transition group">
                {art.featuredImage && (
                  <Link href={`/stories/${art.slug}`} className="h-44 overflow-hidden bg-gray-100 dark:bg-gray-800 block">
                    <img src={art.featuredImage} alt={art.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                  </Link>
                )}
                <div className="p-5 flex flex-col justify-between flex-grow space-y-3">
                  <div className="space-y-1.5">
                    <h2 className="font-serif text-lg font-bold text-gray-900 dark:text-white hover:text-brand-500 transition line-clamp-2">
                      <Link href={`/stories/${art.slug}`}>{art.title}</Link>
                    </h2>
                    {art.excerpt && <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">{art.excerpt}</p>}
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100 dark:border-gray-800">
                    <Link href={`/author/${art.author.username}`} className="font-semibold text-gray-700 hover:text-brand-500">
                      Por {art.author.name}
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

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-4 pt-6 border-t border-gray-200 dark:border-gray-800">
              {page > 1 ? (
                <Link
                  href={`/tag/${tag.slug}?page=${page - 1}`}
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
                  href={`/tag/${tag.slug}?page=${page + 1}`}
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
    </div>
  );
}
