"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import TiptapEditor from "@/components/editor/TiptapEditor";
import ArticleReader from "@/components/editor/ArticleReader";
import ImageUploaderInput from "@/components/common/ImageUploaderInput";
import { ArrowLeft, Save, Send, Eye, Loader2 } from "lucide-react";
import Link from "next/link";

export default function NewStoryPage() {
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [isPreview, setIsPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [imageUploadState, setImageUploadState] = useState({ isUploading: false, error: "" });
  const [canPublishDirectly, setCanPublishDirectly] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data)) setCategories(data);
      })
      .catch(() => {});

    fetch("/api/tags")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data)) setTags(data);
      })
      .catch(() => {});

    fetch("/api/auth/session", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        const user = data?.user;
        setCanPublishDirectly(user?.role === "ADMIN" || user?.autoApprove === true);
      })
      .catch(() => {});
  }, []);

  const handleSave = async (status: "DRAFT" | "PENDING_REVIEW" | "PUBLISHED") => {
    if (!title || !content) {
      setError("El título y el contenido son obligatorios");
      return;
    }
    if (imageUploadState.isUploading || imageUploadState.error) {
      setError(imageUploadState.error || "Espera a que termine la subida de la imagen.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          excerpt,
          content,
          featuredImage,
          categoryId: categoryId || null,
          seoTitle,
          seoDescription,
          tags: selectedTagIds,
          status,
        }),
      });

      const responseText = await res.text();
      let data: any = {};
      try {
        data = JSON.parse(responseText);
      } catch {
        if (res.status === 401) throw new Error("Tu sesión ha expirado. Por favor, inicia sesión de nuevo.");
        throw new Error(`Error en el servidor (${res.status}). Inténtalo nuevamente.`);
      }

      if (!res.ok) throw new Error(data.error || "Error al guardar la historia");

      router.push("/dashboard/stories");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const publishTargetStatus = canPublishDirectly ? "PUBLISHED" : "PENDING_REVIEW";
  const publishButtonLabel = canPublishDirectly ? "Publicar" : "Enviar a Revisión";

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/dashboard/stories" className="inline-flex items-center space-x-1 text-sm font-medium text-gray-500 hover:text-brand-500 transition">
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a mis historias</span>
        </Link>
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => setIsPreview(!isPreview)}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-semibold rounded-xl hover:bg-gray-200"
          >
            <Eye className="w-4 h-4" />
            <span>{isPreview ? "Volver a Editar" : "Vista Previa"}</span>
          </button>
          <button
            type="button"
            disabled={saving || imageUploadState.isUploading || Boolean(imageUploadState.error)}
            onClick={() => handleSave("DRAFT")}
            className="inline-flex items-center space-x-1.5 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs font-semibold rounded-xl hover:bg-gray-300"
          >
            <Save className="w-4 h-4" />
            <span>Guardar Borrador</span>
          </button>
          <button
            type="button"
            disabled={saving || imageUploadState.isUploading || Boolean(imageUploadState.error)}
            onClick={() => handleSave(publishTargetStatus)}
            className="inline-flex items-center space-x-1.5 px-4 py-2 bg-gradient-to-r from-brand-500 to-brand-800 text-white text-xs font-bold rounded-xl hover:opacity-90 transition shadow-sm"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            <span>{saving ? "Cargando ..." : publishButtonLabel}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 text-red-700 text-sm border border-red-200">
          {error}
        </div>
      )}

      {isPreview ? (
        <div className="p-8 bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 space-y-6">
          <div className="text-xs font-bold text-brand-500 uppercase tracking-wider">VISTA PREVIA DE LA HISTORIA</div>
          <h1 className="font-serif text-4xl font-bold text-gray-900 dark:text-white">{title || "Sin título"}</h1>
          {excerpt && <p className="text-lg text-gray-600 italic">{excerpt}</p>}
          {featuredImage && <img src={featuredImage} alt="Feature" className="rounded-2xl max-h-[400px] w-full object-cover" />}
          <ArticleReader content={content} />
        </div>
      ) : (
        <div className="space-y-6 bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título de la historia..."
              className="w-full font-serif text-3xl font-extrabold bg-transparent border-b border-gray-200 dark:border-gray-800 pb-3 focus:outline-none focus:border-brand-500 text-gray-900 dark:text-white placeholder-gray-400"
            />
          </div>

          <div>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Subtítulo o resumen corto (opcional)..."
              className="w-full text-base bg-transparent border-b border-gray-200 dark:border-gray-800 pb-3 focus:outline-none focus:border-brand-500 text-gray-600 dark:text-gray-300 resize-none placeholder-gray-400"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">Categoría</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-xs"
              >
                <option value="">Sin Categoría</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <ImageUploaderInput
              value={featuredImage}
              onChange={setFeaturedImage}
              label="Imagen Portada / Destacada"
              onUploadStateChange={setImageUploadState}
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">Contenido de la Historia</label>
            <TiptapEditor content={content} onChange={setContent} />
          </div>

          {tags.length > 0 && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">Etiquetas</label>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => {
                  const selected = selectedTagIds.includes(tag.id);
                  return (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() =>
                        setSelectedTagIds((current) =>
                          selected ? current.filter((id) => id !== tag.id) : [...current, tag.id]
                        )
                      }
                      className={`px-3 py-1.5 rounded-full border text-xs font-bold transition ${
                        selected
                          ? "bg-brand-500 text-white border-brand-500"
                          : "bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700"
                      }`}
                    >
                      #{tag.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
