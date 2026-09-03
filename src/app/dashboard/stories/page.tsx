import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PlusCircle, Edit3, Eye } from "lucide-react";
import { format } from "date-fns";
import CopyLinkButton from "@/components/common/CopyLinkButton";
import Pagination from "@/components/common/Pagination";

interface Props {
  searchParams?: { page?: string };
}

export default async function AuthorStoriesPage({ searchParams }: Props) {
  const user = (await getCurrentUser())!;
  const currentPage = Math.max(1, parseInt(searchParams?.page || "1", 10) || 1);
  const pageSize = 10;

  const totalCount = await prisma.article.count({
    where: { authorId: user.userId },
  });
  const totalPages = Math.ceil(totalCount / pageSize);

  const articles = await prisma.article.findMany({
    where: { authorId: user.userId },
    orderBy: { updatedAt: "desc" },
    skip: (currentPage - 1) * pageSize,
    take: pageSize,
    include: { category: true },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300">Publicada</span>;
      case "PENDING_REVIEW":
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">En Revisión</span>;
      case "REJECTED":
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300">Rechazada</span>;
      default:
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">Borrador</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-gray-900 dark:text-white">Mis Historias</h1>
          <p className="text-sm text-gray-500">Gestiona tus borradores y publicaciones.</p>
        </div>
        <Link
          href="/dashboard/stories/new"
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium rounded-xl transition shadow-xs"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Nueva Historia</span>
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-xs">
        {articles.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            Aún no has creado ninguna historia. ¡Comienza a escribir ahora!
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-800">
            {articles.map((art) => (
              <div key={art.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1 max-w-2xl">
                  <div className="flex items-center space-x-3">
                    {getStatusBadge(art.status)}
                    {art.category && <span className="text-xs font-medium text-gray-400">{art.category.name}</span>}
                  </div>
                  <h2 className="font-serif text-lg font-bold text-gray-900 dark:text-white">
                    {art.status === "PUBLISHED" ? (
                      <Link href={`/stories/${art.slug}`} className="hover:text-brand-500 transition">
                        {art.title}
                      </Link>
                    ) : (
                      art.title
                    )}
                  </h2>
                  <p className="text-xs text-gray-400">
                    Última modificación: {format(new Date(art.updatedAt), "dd/MM/yyyy HH:mm")}
                  </p>
                </div>

                <div className="flex items-center space-x-3 flex-wrap gap-y-2">
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <Eye className="w-3.5 h-3.5" />
                    <span>{art.viewCount} vistas</span>
                  </div>

                  {art.status === "PUBLISHED" && (
                    <CopyLinkButton slug={art.slug} variant="pill" />
                  )}

                  <Link
                    href={`/dashboard/stories/${art.id}/edit`}
                    className="inline-flex items-center space-x-1 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-brand-500 hover:text-white text-xs font-medium rounded-xl transition"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Editar</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Pagination currentPage={currentPage} totalPages={totalPages} baseUrl="/dashboard/stories" />
    </div>
  );
}
