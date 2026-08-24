import { prisma } from "@/lib/prisma";
import TagManagerClient from "./TagManagerClient";

export default async function AdminTagsPage() {
  const tags = await prisma.tag.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { articles: true } } },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-white">Gestión de Etiquetas</h1>
        <p className="text-sm text-gray-400">Administra las etiquetas utilizadas para clasificar temas y palabras clave.</p>
      </div>

      <TagManagerClient tags={tags} />
    </div>
  );
}
