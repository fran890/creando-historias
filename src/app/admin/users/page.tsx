import { prisma } from "@/lib/prisma";
import UserManagementClient from "./UserManagementClient";
import Pagination from "@/components/common/Pagination";

interface Props {
  searchParams?: { page?: string };
}

export default async function AdminUsersPage({ searchParams }: Props) {
  const currentPage = Math.max(1, parseInt(searchParams?.page || "1", 10) || 1);
  const pageSize = 10;

  const totalUsers = await prisma.user.count();
  const totalPages = Math.ceil(totalUsers / pageSize);

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    skip: (currentPage - 1) * pageSize,
    take: pageSize,
    include: { _count: { select: { articles: true, views: true } } },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-white">Gestión de Usuarios</h1>
        <p className="text-sm text-gray-400">Crea nuevos usuarios, modifica roles (ADMIN / AUTHOR) o bloquea cuentas.</p>
      </div>

      <UserManagementClient users={users} />

      <Pagination currentPage={currentPage} totalPages={totalPages} baseUrl="/admin/users" />
    </div>
  );
}
