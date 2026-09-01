import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Pagination from "@/components/common/Pagination";
import { UserCheck, Eye, BookOpen } from "lucide-react";

interface Props {
  searchParams?: { page?: string };
}

export default async function AdminAuthorsPage({ searchParams }: Props) {
  const currentPage = Math.max(1, parseInt(searchParams?.page || "1", 10) || 1);
  const pageSize = 8;

  const totalAuthors = await prisma.user.count({ where: { role: "AUTHOR" } });
  const totalPages = Math.ceil(totalAuthors / pageSize);

  const authors = await prisma.user.findMany({
    where: { role: "AUTHOR" },
    orderBy: { createdAt: "desc" },
    skip: (currentPage - 1) * pageSize,
    take: pageSize,
    include: {
      _count: { select: { articles: true, views: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-white">Directorio de Autores</h1>
        <p className="text-sm text-gray-400">Listado consolidado de autores y volumen de lecturas acumuladas.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {authors.map((author) => (
          <div key={author.id} className="p-6 bg-gray-900 rounded-2xl border border-gray-800 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-blue-600 text-white font-bold text-lg flex items-center justify-center">
                {author.name.charAt(0)}
              </div>
              <div>
                <h2 className="font-bold text-white text-lg">{author.name}</h2>
                <p className="text-xs text-gray-400">@{author.username} &bull; {author.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-800 text-xs">
              <div className="bg-gray-800/50 p-3 rounded-xl space-y-1">
                <span className="text-gray-400">Historias Creadas</span>
                <p className="text-xl font-bold text-white">{author._count.articles}</p>
              </div>
              <div className="bg-gray-800/50 p-3 rounded-xl space-y-1">
                <span className="text-gray-400">Total de Vistas</span>
                <p className="text-xl font-bold text-blue-400">{author._count.views}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Pagination currentPage={currentPage} totalPages={totalPages} baseUrl="/admin/authors" />
    </div>
  );
}
