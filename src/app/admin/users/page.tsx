import { prisma } from "@/lib/prisma";
import UserManagementClient from "./UserManagementClient";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { articles: true, views: true } } },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-white">Gestión de Usuarios</h1>
        <p className="text-sm text-gray-400">Crea nuevos usuarios, modifica roles (ADMIN / AUTHOR) o bloquea cuentas.</p>
      </div>

      <UserManagementClient users={users} />
    </div>
  );
}
