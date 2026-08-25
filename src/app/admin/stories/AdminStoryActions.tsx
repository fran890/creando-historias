"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, XCircle, Edit3, Trash2, Clock } from "lucide-react";
import Link from "next/link";
import CopyLinkButton from "@/components/common/CopyLinkButton";

interface Props {
  articleId: string;
  currentStatus: string;
  slug?: string;
}

export default function AdminStoryActions({ articleId, currentStatus, slug }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const updateStatus = async (status: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/articles/${articleId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al actualizar estado");
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("¿Eliminar definitivamente este artículo?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/articles/${articleId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error al eliminar");
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center space-x-2 flex-wrap gap-y-2">
      {/* Copy link button for Published stories */}
      {currentStatus === "PUBLISHED" && slug && (
        <CopyLinkButton slug={slug} variant="pill" />
      )}

      {/* Show Approve button ONLY if the story is in PENDING_REVIEW */}
      {currentStatus === "PENDING_REVIEW" && (
        <button
          type="button"
          disabled={loading}
          onClick={() => updateStatus("PUBLISHED")}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-xl transition disabled:opacity-50 shadow-xs"
        >
          <CheckCircle className="w-3.5 h-3.5" />
          <span>Aprobar y Publicar</span>
        </button>
      )}

      {/* If DRAFT, explain that author must submit to review first */}
      {currentStatus === "DRAFT" && (
        <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-gray-800 text-gray-400 border border-gray-700 text-[11px] font-medium rounded-xl">
          <Clock className="w-3.5 h-3.5 text-amber-500" />
          <span>Borrador (requiere envío del autor)</span>
        </span>
      )}

      {currentStatus === "PUBLISHED" && (
        <button
          type="button"
          disabled={loading}
          onClick={() => updateStatus("DRAFT")}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-amber-600/80 hover:bg-amber-700 text-white text-xs font-semibold rounded-xl transition disabled:opacity-50"
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Pasar a Borrador</span>
        </button>
      )}

      {currentStatus !== "REJECTED" && currentStatus === "PENDING_REVIEW" && (
        <button
          type="button"
          disabled={loading}
          onClick={() => updateStatus("REJECTED")}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-red-600/80 hover:bg-red-700 text-white text-xs font-semibold rounded-xl transition disabled:opacity-50"
        >
          <XCircle className="w-3.5 h-3.5" />
          <span>Rechazar</span>
        </button>
      )}

      <div className="flex items-center space-x-1">
        <Link
          href={`/dashboard/stories/${articleId}/edit`}
          className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition"
          title="Editar Historia"
        >
          <Edit3 className="w-4 h-4" />
        </Link>

        <button
          type="button"
          disabled={loading}
          onClick={handleDelete}
          className="p-2 text-red-400 hover:bg-red-950/50 rounded-xl transition disabled:opacity-50"
          title="Eliminar Historia"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
