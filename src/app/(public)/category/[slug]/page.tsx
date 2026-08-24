import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { Clock, Eye, Folder } from "lucide-react";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props) {
  const category = await prisma.category.findUnique({ where: { slug: params.slug } });
  if (!category) return { title: "Categoría no encontrada" };
  return { title: `Categoría: ${category.name} - CreandoHistorias` };
}

export default async function CategoryPage({ params }: Props) {
  const currentUser = await getCurrentUser();

  const category = await prisma.category.findUnique({
    where: { slug: params.slug },
    include: {
      articles: {
        where: { status: "PUBLISHED" },
        orderBy: { publishedAt: "desc" },
        include: { author: { select: { name: true, username: true } } },
      },
    },
  });

  if (!category) notFound();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-200 dark:border-gray-800 pb-6 space-y-2">
        <div className="flex items-center space-x-2 text-brand-500 font-bold text-xs uppercase tracking-wider">
          <Folder className="w-4 h-4" />
          <span>Categoría</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-black text-gray-900 dark:text-white">{category.name}</h1>
        {category.description && <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{category.description}</p>}
      </div>

      {category.articles.length === 0 ? (
        <p className="text-gray-500 py-12 text-center bg-white dark:bg-gray-900 rounded-3xl border border-dashed border-gray-300 dark:border-gray-800">
          No hay publicaciones disponibles en esta categoría.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {category.articles.map((art) => (
            <article key={art.id} className="p-6 bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 space-y-3 hover:border-brand-300 transition">
              {art.featuredImage && (
                <div className="h-40 overflow-hidden rounded-2xl mb-2">
                  <img src={art.featuredImage} alt={art.title} className="w-full h-full object-cover" />
                </div>
              )}
              <h2 className="font-serif text-xl font-bold text-gray-900 dark:text-white hover:text-brand-500">
                <Link href={`/stories/${art.slug}`}>{art.title}</Link>
              </h2>
              {art.excerpt && <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">{art.excerpt}</p>}
              <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100 dark:border-gray-800">
                <Link href={`/author/${art.author.username}`} className="font-semibold text-gray-700 hover:text-brand-500">
                  Por {art.author.name}
                </Link>
                {currentUser && (
                  <span className="flex items-center space-x-1">
                    <Eye className="w-3.5 h-3.5" />
                    <span>{art.viewCount} vistas</span>
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
