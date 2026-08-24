"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, Shield, User, Ban, CheckCircle } from "lucide-react";

export default function UserManagementClient({ users }: { users: any[] }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"ADMIN" | "AUTHOR">("AUTHOR");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, username, password, role }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al crear usuario");

      setShowForm(false);
      setName("");
      setEmail("");
      setUsername("");
      setPassword("");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserBlock = async (userId: string, isBlocked: boolean) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isBlocked: !isBlocked }),
      });
      if (!res.ok) throw new Error("Error al modificar estado del usuario");
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const changeUserRole = async (userId: string, newRole: "ADMIN" | "AUTHOR") => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      if (!res.ok) throw new Error("Error al modificar rol");
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition"
        >
          <UserPlus className="w-4 h-4" />
          <span>{showForm ? "Cancelar" : "Nuevo Usuario / Autor"}</span>
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreateUser} className="p-6 bg-gray-900 border border-gray-800 rounded-2xl space-y-4 max-w-2xl">
          <h2 className="font-serif text-lg font-bold text-white">Crear Cuenta de Usuario / Autor</h2>
          {error && <p className="text-xs text-red-400 bg-red-950/40 p-3 rounded-lg border border-red-800">{error}</p>}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Nombre Completo</label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Username (público)</label>
              <input type="text" required value={username} onChange={(e) => setUsername(e.target.value)} className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Email</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Contraseña</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Rol</label>
              <select value={role} onChange={(e) => setRole(e.target.value as any)} className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white">
                <option value="AUTHOR">Autor (AUTHOR)</option>
                <option value="ADMIN">Administrador (ADMIN)</option>
              </select>
            </div>
          </div>
          <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700">
            {loading ? "Creando..." : "Guardar Usuario"}
          </button>
        </form>
      )}

      <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
        <div className="divide-y divide-gray-800">
          {users.map((u) => (
            <div key={u.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-white text-base">{u.name}</span>
                  <span className="text-xs text-gray-400">(@{u.username})</span>
                  <span className={`px-2 py-0.5 text-xs rounded font-semibold ${u.role === "ADMIN" ? "bg-amber-950 text-amber-300 border border-amber-800" : "bg-blue-950 text-blue-300 border border-blue-800"}`}>
                    {u.role}
                  </span>
                  {u.isBlocked && <span className="px-2 py-0.5 text-xs bg-red-950 text-red-300 border border-red-800 rounded font-semibold">BLOQUEADO</span>}
                </div>
                <p className="text-xs text-gray-400">{u.email} &bull; {u._count.articles} artículos creados</p>
              </div>

              <div className="flex items-center space-x-2">
                <select
                  value={u.role}
                  onChange={(e) => changeUserRole(u.id, e.target.value as any)}
                  className="p-1.5 bg-gray-800 border border-gray-700 rounded text-xs text-gray-300"
                >
                  <option value="AUTHOR">Cambiar a AUTHOR</option>
                  <option value="ADMIN">Cambiar a ADMIN</option>
                </select>

                <button
                  type="button"
                  onClick={() => toggleUserBlock(u.id, u.isBlocked)}
                  className={`p-2 rounded text-xs font-semibold transition ${u.isBlocked ? "bg-green-950 text-green-300 hover:bg-green-900" : "bg-red-950 text-red-300 hover:bg-red-900"}`}
                >
                  {u.isBlocked ? "Desbloquear" : "Bloquear"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
