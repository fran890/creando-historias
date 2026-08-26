"use client";

import { useState } from "react";
import { Upload, User as UserIcon, Check, Loader2 } from "lucide-react";
import {
  formatFileSize,
  MAX_ORIGINAL_IMAGE_SIZE_BYTES,
  MAX_WEBP_UPLOAD_SIZE_BYTES,
  prepareImageForUpload,
  uploadImageWithProgress,
} from "@/lib/client/image-upload";

interface UserProfileProps {
  user: {
    id: string;
    name: string;
    username: string;
    email: string;
    avatarUrl?: string | null;
    bio?: string | null;
  };
}

export default function ProfileForm({ user }: UserProfileProps) {
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio || "");
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl || "");
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadLabel, setUploadLabel] = useState("");
  const [fileSummary, setFileSummary] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);
    setUploadLabel("");
    setFileSummary(`Original: ${formatFileSize(file.size)}`);
    setMessage(null);

    try {
      const webpFile = await prepareImageForUpload(file, (progress, label) => {
        setUploadProgress(progress);
        setUploadLabel(label);
      });

      setFileSummary(`Original: ${formatFileSize(file.size)} | WebP: ${formatFileSize(webpFile.size)}`);
      const data = await uploadImageWithProgress(webpFile, (progress, label) => {
        setUploadProgress(progress);
        setUploadLabel(label);
      });

      setAvatarUrl(data.url);
      setMessage({ type: "success", text: "Imagen WebP subida con exito" });
    } catch (err: any) {
      setUploadProgress(0);
      setUploadLabel("");
      setMessage({ type: "error", text: err.message || "Error al subir la imagen" });
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, bio, avatarUrl }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al guardar el perfil");

      setMessage({ type: "success", text: "Perfil actualizado correctamente" });
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Error al guardar" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
      {message && (
        <div
          className={`p-4 rounded-2xl text-xs font-semibold ${
            message.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="space-y-4">
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
          Foto de Perfil / Avatar
        </label>

        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-full border-4 border-brand-100 dark:border-gray-800 overflow-hidden bg-gray-100 dark:bg-gray-800 text-gray-400 flex items-center justify-center font-bold text-2xl flex-shrink-0 shadow">
            {avatarUrl ? (
              <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
            ) : (
              <UserIcon className="w-10 h-10" />
            )}
          </div>

          <div className="space-y-3 flex-grow text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <label className={`inline-flex items-center space-x-1.5 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold rounded-xl transition shadow-xs ${isUploading ? "cursor-wait opacity-80" : "cursor-pointer"}`}>
                {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                <span>{isUploading ? "Procesando WebP..." : "Seleccionar de mi equipo"}</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={isUploading}
                />
              </label>

              {avatarUrl && (
                <button
                  type="button"
                  onClick={() => {
                    setAvatarUrl("");
                    setFileSummary("");
                  }}
                  className="text-xs font-semibold text-red-600 hover:underline"
                >
                  Quitar avatar
                </button>
              )}
            </div>
            <p className="text-[11px] text-gray-400">
              Maximo por imagen: {formatFileSize(MAX_ORIGINAL_IMAGE_SIZE_BYTES)} antes de convertir; {formatFileSize(MAX_WEBP_UPLOAD_SIZE_BYTES)} ya en WebP.
            </p>
            {isUploading && (
              <div className="space-y-1">
                <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
                  <div
                    className="h-full bg-brand-500 transition-all duration-200"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 font-semibold">
                  {uploadLabel || "Preparando imagen"} {uploadProgress}%
                </p>
              </div>
            )}
            {fileSummary && <p className="text-[11px] text-gray-500 dark:text-gray-400">{fileSummary}</p>}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
          Nombre Publico
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
          Biografia del Autor
        </label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={4}
          placeholder="Escribe una breve descripcion sobre ti o tus materias de especialidad..."
          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>

      <div className="pt-4 flex justify-end">
        <button
          type="submit"
          disabled={isSaving || isUploading}
          className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-brand-500 to-brand-800 text-white font-bold text-xs rounded-xl hover:opacity-90 transition shadow"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
          <span>{isSaving ? "Guardando..." : "Guardar Cambios"}</span>
        </button>
      </div>
    </form>
  );
}
