"use client";

import { useState } from "react";

export default function SettingsForm({ settings }: { settings: any }) {
  const [platformShare, setPlatformShare] = useState(settings.platformSharePercentage);
  const [authorShare, setAuthorShare] = useState(settings.authorSharePercentage);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const handlePlatformChange = (val: number) => {
    setPlatformShare(val);
    setAuthorShare(100 - val);
  };

  const handleAuthorChange = (val: number) => {
    setAuthorShare(val);
    setPlatformShare(100 - val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platformSharePercentage: platformShare,
          authorSharePercentage: authorShare,
        }),
      });

      if (!res.ok) throw new Error("Error al guardar ajustes");
      setMessage("Configuración de reparto de ingresos actualizada correctamente");
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-8 bg-gray-900 border border-gray-800 rounded-3xl space-y-6">
      {message && (
        <div className="p-4 rounded-xl bg-blue-950 text-blue-300 text-sm border border-blue-800">
          {message}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1">
            Porcentaje para el Autor (%)
          </label>
          <input
            type="number"
            min="0"
            max="100"
            value={authorShare}
            onChange={(e) => handleAuthorChange(Number(e.target.value))}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-white font-bold text-lg"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1">
            Porcentaje para la Plataforma (%)
          </label>
          <input
            type="number"
            min="0"
            max="100"
            value={platformShare}
            onChange={(e) => handlePlatformChange(Number(e.target.value))}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-white font-bold text-lg"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition"
      >
        {saving ? "Guardando..." : "Guardar Ajustes de Reparto"}
      </button>
    </form>
  );
}
