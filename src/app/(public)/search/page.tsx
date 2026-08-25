import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { Search as SearchIcon, Eye, Clock } from "lucide-react";

interface Props {
  searchParams: { q?: string };
}

const SEARCH_LIMIT = 20;

export default async function SearchPage({ searchParams }: Props) {
  const currentUser = await getCurrentUser();
  const query = (searchParams.q || "").trim();

  const results = query
    ? await prisma.article.findMany({
        where: {
          status: "PUBLISHED",
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { excerpt: { contains: query, mode: "insensitive" } },
          ],
        },
        take: SEARCH_LIMIT,
        orderBy: { publishedAt: "desc" },
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
      })
    : [];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div className="space-y-4">
        <h1 className="font-serif text-3xl font-bold text-gray-900 dark:text-white">Buscar publicaciones</h1>
        <form method="GET" action="/search" className="flex items-center gap-2">
          <div className="relative flex-grow">
            <SearchIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Buscar por título o palabras clave..."
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-2xl font-bold text-sm transition shadow-sm"
          >
            Buscar
          </button>
        </form>
      </div>

      {query && (
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Se encontraron <strong className="text-gray-900 dark:text-white">{results.length}</strong> resultados para &quot;{query}&quot;
          </p>

          {results.length === 0 ? (
            <p className="text-gray-500 py-12 text-center bg-white dark:bg-gray-900 rounded-3xl border border-dashed border-gray-300 dark:border-gray-800">
              No se encontraron artículos que coincidan con tu búsqueda.
            </p>
          ) : (
            <div className="space-y-4">
              {results.map((art) => (
                <article key={art.id} className="p-6 bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 space-y-2 hover:border-brand-300 transition">
                  <h2 className="font-serif text-xl font-bold text-gray-900 dark:text-white hover:text-brand-500 transition">
                    <Link href={`/stories/${art.slug}`}>{art.title}</Link>
                  </h2>
                  {art.excerpt && <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">{art.excerpt}</p>}
                  <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100 dark:border-gray-800">
                    <Link href={`/author/${art.author.username}`} className="font-semibold text-gray-700 hover:text-brand-500">
                      Por {art.author.name}
                    </Link>
                    <div className="flex items-center space-x-3">
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        <span>{art.readingTime} min</span>
                      </span>
                      {currentUser && (
                        <span className="flex items-center space-x-1">
                          <Eye className="w-3.5 h-3.5" />
                          <span>{art.viewCount} vistas</span>
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
