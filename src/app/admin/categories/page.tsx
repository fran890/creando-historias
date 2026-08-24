import { prisma } from "@/lib/prisma";
import CategoryManagerClient from "./CategoryManagerClient";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { articles: true } } },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-white">Gestión de Categorías</h1>
        <p className="text-sm text-gray-400">Organiza el contenido de la plataforma en áreas temáticas.</p>
      </div>

      <CategoryManagerClient categories={categories} />
    </div>
  );
}
