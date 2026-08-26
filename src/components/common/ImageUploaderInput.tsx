"use client";

import { useState } from "react";
import { Upload, Loader2, X } from "lucide-react";
import {
  formatFileSize,
  MAX_ORIGINAL_IMAGE_SIZE_BYTES,
  MAX_WEBP_UPLOAD_SIZE_BYTES,
  prepareImageForUpload,
  uploadImageWithProgress,
} from "@/lib/client/image-upload";

interface ImageUploaderInputProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  onUploadStateChange?: (state: { isUploading: boolean; error: string }) => void;
}

export default function ImageUploaderInput({
  value,
  onChange,
  label = "Imagen Destacada",
  onUploadStateChange,
}: ImageUploaderInputProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState("");
  const [fileSummary, setFileSummary] = useState("");

  const setUploadState = (uploading: boolean, message: string) => {
    setIsUploading(uploading);
    setError(message);
    onUploadStateChange?.({ isUploading: uploading, error: message });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setProgress(0);
    setProgressLabel("");
    setFileSummary(`Original: ${formatFileSize(file.size)}`);
    setUploadState(true, "");

    try {
      const webpFile = await prepareImageForUpload(file, (nextProgress, label) => {
        setProgress(nextProgress);
        setProgressLabel(label);
      });

      setFileSummary(`Original: ${formatFileSize(file.size)} | WebP: ${formatFileSize(webpFile.size)}`);
      const data = await uploadImageWithProgress(webpFile, (nextProgress, label) => {
        setProgress(nextProgress);
        setProgressLabel(label);
      });
      onChange(data.url);
      setUploadState(false, "");
    } catch (err: any) {
      setProgress(0);
      setProgressLabel("");
      setUploadState(false, err.message || "Error al subir la imagen.");
    } finally {
      e.target.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
        {label}
      </label>

      {/* Preview Box if image exists */}
      {value ? (
        <div className="relative rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-800 h-44 group">
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center space-x-3">
            <button
              type="button"
              onClick={() => {
                onChange("");
                setFileSummary("");
                setUploadState(false, "");
              }}
              className="p-2 bg-red-600 text-white rounded-xl text-xs font-bold flex items-center space-x-1 hover:bg-red-700 transition shadow-xs"
            >
              <X className="w-4 h-4" />
              <span>Quitar Imagen</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">
            Maximo por imagen: {formatFileSize(MAX_ORIGINAL_IMAGE_SIZE_BYTES)} antes de convertir; {formatFileSize(MAX_WEBP_UPLOAD_SIZE_BYTES)} ya en WebP.
          </p>

          {/* File Picker & URL input side by side */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* File Upload Button */}
            <label className={`w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-4 py-3 bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold rounded-2xl transition shadow-xs flex-shrink-0 ${isUploading ? "cursor-wait opacity-80" : "cursor-pointer"}`}>
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

            <span className="text-xs text-gray-400 font-semibold uppercase">o pega URL</span>

            {/* URL Input Fallback */}
            <input
              type="url"
              value={value}
              onChange={(e) => {
                onChange(e.target.value);
                setFileSummary("");
                setUploadState(false, "");
              }}
              placeholder="https://images.unsplash.com/..."
              className="flex-grow w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {isUploading && (
            <div className="space-y-1">
              <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
                <div
                  className="h-full bg-brand-500 transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 font-semibold">
                {progressLabel || "Preparando imagen"} {progress}%
              </p>
            </div>
          )}

          {fileSummary && <p className="text-[11px] text-gray-500 dark:text-gray-400">{fileSummary}</p>}
          {error && <p className="text-xs text-red-600 font-semibold">{error}</p>}
        </div>
      )}
    </div>
  );
}
