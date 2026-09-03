import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import Pagination from "@/components/common/Pagination";
import HeaderBannerAd from "@/components/ads/HeaderBannerAd";
import SidebarAd from "@/components/ads/SidebarAd";
import StickyFloatingAd from "@/components/ads/StickyFloatingAd";
import { Clock, Folder } from "lucide-react";

interface Props {
  params: { slug: string };
  searchParams?: { page?: string };
}

const ITEMS_PER_PAGE = 12;

export async function generateMetadata({ params }: Props) {
  const category = await prisma.category.findUnique({ where: { slug: params.slug } });
  if (!category) return { title: "Categoría no encontrada" };
  return { title: `Categoría: ${category.name} - Creando-Historias` };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const page = Math.max(1, parseInt(searchParams?.page || "1", 10));
  const skip = (page - 1) * ITEMS_PER_PAGE;

  const category = await prisma.category.findUnique({
    where: { slug: params.slug },
    select: { id: true, name: true, slug: true, description: true },
  });

  if (!category) notFound();

  // Parallel count & paginated query using compound index [status, categoryId, publishedAt]
  const [totalCount, articles] = await Promise.all([
    prisma.article.count({
      where: { categoryId: category.id, status: "PUBLISHED" },
    }),
    prisma.article.findMany({
      where: { categoryId: category.id, status: "PUBLISHED" },
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
        author: { select: { name: true, username: true } },
      },
    }),
  ]);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8 space-y-6 sm:space-y-8">
      {/* Category Ad Banner */}
      <HeaderBannerAd />

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content Column */}
        <main className="w-full min-w-0 space-y-8">
          <div className="border-b border-gray-200 dark:border-gray-800 pb-6 space-y-2">
            <div className="flex items-center space-x-2 text-brand-500 font-bold text-xs uppercase tracking-wider">
              <Folder className="w-4 h-4" />
              <span>Categoría</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-black text-gray-900 dark:text-white">{category.name}</h1>
            {category.description && <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{category.description}</p>}
            <p className="text-xs text-gray-400 font-medium pt-1">{totalCount} publicaciones en total</p>
          </div>

          {articles.length === 0 ? (
            <p className="text-gray-500 py-12 text-center bg-white dark:bg-gray-900 rounded-3xl border border-dashed border-gray-300 dark:border-gray-800">
              No hay publicaciones disponibles en esta categoría.
            </p>
          ) : (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((art) => (
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

              {/* Standard Pagination Controls */}
              <Pagination currentPage={page} totalPages={totalPages} baseUrl={`/category/${category.slug}`} />
            </div>
          )}
        </main>

        {/* Right Sidebar with Native Ads (mobile: full-width below, desktop: sticky sidebar) */}
        <aside className="w-full lg:w-[300px] flex-shrink-0 space-y-6">
          <SidebarAd />
        </aside>
      </div>

      {/* Sticky bottom ad (mobile/tablet) */}
      <StickyFloatingAd />
    </div>
  );
}
