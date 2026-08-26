"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Edit3, Save, Trash2, X } from "lucide-react";

export default function CategoryManagerClient({ categories }: { categories: any[] }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [editingDescription, setEditingDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al crear categoria");

      setName("");
      setDescription("");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (category: any) => {
    setEditingId(category.id);
    setEditingName(category.name);
    setEditingDescription(category.description || "");
    setError("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName("");
    setEditingDescription("");
  };

  const handleUpdate = async (id: string) => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editingName, description: editingDescription }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al actualizar categoria");

      cancelEdit();
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Eliminar categoria?")) return;
    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error al eliminar");
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <form onSubmit={handleCreate} className="p-6 bg-gray-900 border border-gray-800 rounded-2xl space-y-4 h-fit">
        <h2 className="font-serif text-lg font-bold text-white">Nueva Categoria</h2>
        {error && <p className="text-xs text-red-400">{error}</p>}
        <div>
          <label className="block text-xs text-gray-400 mb-1">Nombre</label>
          <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white" />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">Descripcion</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full p-2.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white resize-none" />
        </div>
        <button type="submit" disabled={loading} className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg disabled:opacity-60">
          {loading ? "Guardando..." : "Crear Categoria"}
        </button>
      </form>

      <div className="md:col-span-2 bg-gray-900 rounded-2xl border border-gray-800 divide-y divide-gray-800">
        {categories.map((cat) => (
          <div key={cat.id} className="p-4 flex items-center justify-between gap-4">
            {editingId === cat.id ? (
              <div className="flex-1 space-y-3">
                <input
                  type="text"
                  required
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  className="w-full p-2.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white"
                />
                <textarea
                  value={editingDescription}
                  onChange={(e) => setEditingDescription(e.target.value)}
                  rows={2}
                  className="w-full p-2.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white resize-none"
                />
              </div>
            ) : (
              <div>
                <h3 className="font-bold text-white text-sm">{cat.name}</h3>
                {cat.description && <p className="text-xs text-gray-400">{cat.description}</p>}
                <span className="text-xs text-blue-400">{cat._count.articles} articulos</span>
              </div>
            )}

            <div className="flex items-center gap-2">
              {editingId === cat.id ? (
                <>
                  <button onClick={() => handleUpdate(cat.id)} disabled={loading} className="p-2 text-green-400 hover:bg-green-950/40 rounded-lg disabled:opacity-60" title="Guardar">
                    <Save className="w-4 h-4" />
                  </button>
                  <button onClick={cancelEdit} className="p-2 text-gray-400 hover:bg-gray-800 rounded-lg" title="Cancelar">
                    <X className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <button onClick={() => startEdit(cat)} className="p-2 text-blue-400 hover:bg-blue-950/40 rounded-lg" title="Editar">
                  <Edit3 className="w-4 h-4" />
                </button>
              )}
              <button onClick={() => handleDelete(cat.id)} className="p-2 text-red-400 hover:bg-red-950/40 rounded-lg" title="Eliminar">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
