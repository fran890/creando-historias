"use client";

import { useState } from "react";
import { Upload, Image as ImageIcon, Loader2, X } from "lucide-react";

interface ImageUploaderInputProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export default function ImageUploaderInput({ value, onChange, label = "Imagen Destacada" }: ImageUploaderInputProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        // Client-side FileReader fallback if server returns error
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            onChange(event.target.result as string);
            setIsUploading(false);
          }
        };
        reader.readAsDataURL(file);
        return;
      }

      const data = await res.json();
      onChange(data.url);
    } catch (err: any) {
      // FileReader client-side fallback
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onChange(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploading(false);
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
              onClick={() => onChange("")}
              className="p-2 bg-red-600 text-white rounded-xl text-xs font-bold flex items-center space-x-1 hover:bg-red-700 transition shadow-xs"
            >
              <X className="w-4 h-4" />
              <span>Quitar Imagen</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {/* File Picker & URL input side by side */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* File Upload Button */}
            <label className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-4 py-3 bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold rounded-2xl cursor-pointer transition shadow-xs flex-shrink-0">
              {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              <span>{isUploading ? "Procesando..." : "Seleccionar de mi equipo"}</span>
              <input
                type="file"
                accept="image/*"
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
              onChange={(e) => onChange(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="flex-grow w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {error && <p className="text-xs text-red-600 font-semibold">{error}</p>}
        </div>
      )}
    </div>
  );
}
