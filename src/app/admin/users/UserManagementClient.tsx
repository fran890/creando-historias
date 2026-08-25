"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, Shield, CheckCircle, Zap, Percent, Save, Ban } from "lucide-react";

export default function UserManagementClient({ users }: { users: any[] }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"ADMIN" | "AUTHOR">("AUTHOR");
  const [autoApprove, setAutoApprove] = useState(false);
  const [customAuthorShare, setCustomAuthorShare] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingShareUserId, setEditingShareUserId] = useState<string | null>(null);
  const [shareInputValues, setShareInputValues] = useState<Record<string, string>>({});
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
        body: JSON.stringify({
          name,
          email,
          username,
          password,
          role,
          autoApprove,
          customAuthorShare: customAuthorShare ? parseInt(customAuthorShare, 10) : null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al crear usuario");

      setShowForm(false);
      setName("");
      setEmail("");
      setUsername("");
      setPassword("");
      setAutoApprove(false);
      setCustomAuthorShare("");
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

  const toggleAutoApprove = async (userId: string, currentAutoApprove: boolean) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ autoApprove: !currentAutoApprove }),
      });
      if (!res.ok) throw new Error("Error al actualizar permiso de auto-publicación");
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

  const handleSaveCustomShare = async (userId: string) => {
    const rawVal = shareInputValues[userId];
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customAuthorShare: rawVal }),
      });
      if (!res.ok) throw new Error("Error al guardar porcentaje personalizado");
      setEditingShareUserId(null);
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Nombre Completo</label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2.5 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Username (público)</label>
              <input type="text" required value={username} onChange={(e) => setUsername(e.target.value)} className="w-full p-2.5 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Email</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2.5 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Contraseña</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2.5 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Rol</label>
              <select value={role} onChange={(e) => setRole(e.target.value as any)} className="w-full p-2.5 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white">
                <option value="AUTHOR">Autor (AUTHOR)</option>
                <option value="ADMIN">Administrador (ADMIN)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">% Ingresos Autor (Opcional)</label>
              <input
                type="number"
                min="0"
                max="100"
                placeholder="70 (Por defecto)"
                value={customAuthorShare}
                onChange={(e) => setCustomAuthorShare(e.target.value)}
                className="w-full p-2.5 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <input
              type="checkbox"
              id="autoApproveCheck"
              checked={autoApprove}
              onChange={(e) => setAutoApprove(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 bg-gray-800 border-gray-700"
            />
            <label htmlFor="autoApproveCheck" className="text-xs font-semibold text-gray-300">
              Permitir publicar historias directamente sin revisión previa
            </label>
          </div>

          <button type="submit" disabled={loading} className="px-5 py-2.5 bg-blue-600 text-white text-xs font-semibold rounded-xl hover:bg-blue-700 transition">
            {loading ? "Creando..." : "Guardar Usuario"}
          </button>
        </form>
      )}

      <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
        <div className="divide-y divide-gray-800">
          {users.map((u) => {
            const authorPct = u.customAuthorShare !== null && u.customAuthorShare !== undefined ? u.customAuthorShare : 70;
            const platformPct = 100 - authorPct;
            const isEditingShare = editingShareUserId === u.id;

            return (
              <div key={u.id} className="p-6 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                      <span className="font-bold text-white text-base">{u.name}</span>
                      <span className="text-xs text-gray-400">(@{u.username})</span>
                      
                      <span className={`px-2 py-0.5 text-xs rounded font-bold ${u.role === "ADMIN" ? "bg-amber-950 text-amber-300 border border-amber-800" : "bg-blue-950 text-blue-300 border border-blue-800"}`}>
                        {u.role}
                      </span>

                      {(u.role === "ADMIN" || u.autoApprove) && (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 text-[11px] font-bold bg-green-950 text-green-300 border border-green-800 rounded-full">
                          <Zap className="w-3 h-3 text-green-400" />
                          <span>Publicación Directa</span>
                        </span>
                      )}

                      {u.isBlocked && <span className="px-2 py-0.5 text-xs bg-red-950 text-red-300 border border-red-800 rounded font-semibold">BLOQUEADO</span>}
                    </div>
                    <p className="text-xs text-gray-400">{u.email} &bull; {u._count.articles} artículos creados</p>
                  </div>

                  {/* Top Action Buttons */}
                  <div className="flex items-center space-x-2 flex-wrap gap-y-2">
                    <select
                      value={u.role}
                      onChange={(e) => changeUserRole(u.id, e.target.value as any)}
                      className="p-2 bg-gray-800 border border-gray-700 rounded-xl text-xs text-gray-300"
                    >
                      <option value="AUTHOR">Rol: AUTHOR</option>
                      <option value="ADMIN">Rol: ADMIN</option>
                    </select>

                    <button
                      type="button"
                      onClick={() => toggleUserBlock(u.id, u.isBlocked)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold transition ${u.isBlocked ? "bg-green-950 text-green-300 hover:bg-green-900 border border-green-800" : "bg-red-950 text-red-300 hover:bg-red-900 border border-red-800"}`}
                    >
                      {u.isBlocked ? "Desbloquear" : "Bloquear"}
                    </button>
                  </div>
                </div>

                {/* Bottom Row: Auto-Approve Toggle & Revenue Share Control */}
                <div className="pt-3 border-t border-gray-800/60 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  
                  {/* Auto-Approve Toggle */}
                  <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-xl border border-gray-800">
                    <div>
                      <span className="font-bold text-gray-200 block">Aprobación Directa de Historias</span>
                      <span className="text-[11px] text-gray-400">
                        {u.role === "ADMIN" ? "Los Administradores publican directamente por defecto" : u.autoApprove ? "Este usuario no requiere revisión previa" : "Requiere aprobación del administrador"}
                      </span>
                    </div>
                    {u.role !== "ADMIN" && (
                      <button
                        type="button"
                        onClick={() => toggleAutoApprove(u.id, u.autoApprove)}
                        className={`px-3 py-1.5 rounded-lg font-bold text-xs transition ${
                          u.autoApprove
                            ? "bg-green-900/60 text-green-300 border border-green-700 hover:bg-green-800"
                            : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        }`}
                      >
                        {u.autoApprove ? "Habilitado" : "Deshabilitado"}
                      </button>
                    )}
                  </div>

                  {/* Revenue Share Customizer */}
                  <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-xl border border-gray-800">
                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-1.5 font-bold text-gray-200">
                        <Percent className="w-3.5 h-3.5 text-brand-400" />
                        <span>Reparto de Ganancias</span>
                      </div>
                      <div className="text-[11px] text-gray-400 flex items-center space-x-2">
                        <span>Autor: <strong className="text-white">{authorPct}%</strong></span>
                        <span>&bull;</span>
                        <span>Plataforma/Admin: <strong className="text-white">{platformPct}%</strong></span>
                        {u.customAuthorShare !== null && u.customAuthorShare !== undefined && (
                          <span className="text-[10px] bg-brand-950 text-brand-300 px-1.5 py-0.2 rounded border border-brand-800 font-bold">Personalizado</span>
                        )}
                      </div>
                    </div>

                    <div>
                      {isEditingShare ? (
                        <div className="flex items-center space-x-1">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={shareInputValues[u.id] ?? authorPct}
                            onChange={(e) => setShareInputValues({ ...shareInputValues, [u.id]: e.target.value })}
                            className="w-16 p-1 bg-gray-900 border border-gray-700 rounded text-xs text-white text-center"
                          />
                          <button
                            type="button"
                            onClick={() => handleSaveCustomShare(u.id)}
                            className="p-1 bg-blue-600 hover:bg-blue-700 text-white rounded"
                            title="Guardar porcentaje"
                          >
                            <Save className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingShareUserId(u.id);
                            setShareInputValues({ ...shareInputValues, [u.id]: authorPct.toString() });
                          }}
                          className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg text-xs font-semibold transition"
                        >
                          Modificar %
                        </button>
                      )}
                    </div>

                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
