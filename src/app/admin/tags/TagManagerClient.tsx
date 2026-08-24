"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tag as TagIcon, Trash2 } from "lucide-react";

export default function TagManagerClient({ tags }: { tags: any[] }) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al crear etiqueta");

      setName("");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar etiqueta?")) return;
    try {
      const res = await fetch(`/api/admin/tags/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error al eliminar");
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <form onSubmit={handleCreate} className="p-6 bg-gray-900 border border-gray-800 rounded-2xl space-y-4 h-fit">
        <h2 className="font-serif text-lg font-bold text-white">Nueva Etiqueta</h2>
        {error && <p className="text-xs text-red-400">{error}</p>}
        <div>
          <label className="block text-xs text-gray-400 mb-1">Nombre de la Etiqueta</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="ej. InteligenciaArtificial"
            className="w-full p-2.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white"
          />
        </div>
        <button type="submit" disabled={loading} className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg">
          {loading ? "Guardando..." : "Crear Etiqueta"}
        </button>
      </form>

      <div className="md:col-span-2 bg-gray-900 rounded-2xl border border-gray-800 divide-y divide-gray-800">
        {tags.length === 0 ? (
          <p className="p-6 text-sm text-gray-400 text-center">No hay etiquetas creadas.</p>
        ) : (
          tags.map((t) => (
            <div key={t.id} className="p-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TagIcon className="w-4 h-4 text-blue-400" />
                <span className="font-bold text-white text-sm">#{t.name}</span>
                <span className="text-xs text-gray-400">({t._count.articles} uso)</span>
              </div>
              <button onClick={() => handleDelete(t.id)} className="p-2 text-red-400 hover:bg-red-950/40 rounded-lg">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
