"use client";

export const MAX_ORIGINAL_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;
export const MAX_WEBP_UPLOAD_SIZE_BYTES = 4 * 1024 * 1024;
export const MAX_IMAGE_DIMENSION = 1920;

export function formatFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function getWebpFilename(filename: string): string {
  const cleanName = filename.replace(/\.[^.]+$/, "") || "imagen";
  return `${cleanName}.webp`;
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new window.Image();

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("No se pudo leer la imagen seleccionada."));
    };
    img.src = objectUrl;
  });
}

function canvasToWebp(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("No se pudo convertir la imagen a WebP."));
          return;
        }
        resolve(blob);
      },
      "image/webp",
      quality
    );
  });
}

async function renderWebp(img: HTMLImageElement, maxDimension: number, quality: number): Promise<Blob> {
  const scale = Math.min(1, maxDimension / Math.max(img.naturalWidth, img.naturalHeight));
  const width = Math.max(1, Math.round(img.naturalWidth * scale));
  const height = Math.max(1, Math.round(img.naturalHeight * scale));
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) throw new Error("El navegador no pudo preparar la imagen.");

  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(img, 0, 0, width, height);

  return canvasToWebp(canvas, quality);
}

export async function prepareImageForUpload(
  file: File,
  onProgress?: (progress: number, label: string) => void
): Promise<File> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Selecciona una imagen valida.");
  }

  if (file.size > MAX_ORIGINAL_IMAGE_SIZE_BYTES) {
    throw new Error(
      `La imagen pesa ${formatFileSize(file.size)}. El maximo permitido antes de convertir es ${formatFileSize(
        MAX_ORIGINAL_IMAGE_SIZE_BYTES
      )}.`
    );
  }

  onProgress?.(8, "Leyendo imagen");
  const img = await loadImage(file);
  const attempts = [
    { maxDimension: MAX_IMAGE_DIMENSION, quality: 0.82 },
    { maxDimension: 1600, quality: 0.72 },
    { maxDimension: 1280, quality: 0.64 },
  ];

  let blob: Blob | null = null;

  for (let index = 0; index < attempts.length; index++) {
    const attempt = attempts[index];
    onProgress?.(18 + index * 10, "Convirtiendo a WebP");
    blob = await renderWebp(img, attempt.maxDimension, attempt.quality);
    if (blob.size <= MAX_WEBP_UPLOAD_SIZE_BYTES) break;
  }

  if (!blob || blob.size > MAX_WEBP_UPLOAD_SIZE_BYTES) {
    throw new Error(
      `La imagen convertida pesa ${formatFileSize(blob?.size || file.size)}. El maximo de subida es ${formatFileSize(
        MAX_WEBP_UPLOAD_SIZE_BYTES
      )}.`
    );
  }

  onProgress?.(52, `WebP listo (${formatFileSize(blob.size)})`);

  return new File([blob], getWebpFilename(file.name), {
    type: "image/webp",
    lastModified: Date.now(),
  });
}

export function uploadImageWithProgress(
  file: File,
  onProgress?: (progress: number, label: string) => void
): Promise<{ url: string; filename?: string; storage?: string }> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append("file", file);

    xhr.open("POST", "/api/upload");

    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable) {
        onProgress?.(65, "Subiendo imagen");
        return;
      }

      const uploadProgress = Math.round((event.loaded / event.total) * 40);
      onProgress?.(55 + uploadProgress, "Subiendo imagen");
    };

    xhr.onload = () => {
      const data = JSON.parse(xhr.responseText || "{}");
      if (xhr.status >= 200 && xhr.status < 300 && data.url) {
        onProgress?.(100, "Imagen subida");
        resolve(data);
        return;
      }
      reject(new Error(data.error || `No se pudo subir la imagen (${xhr.status}).`));
    };

    xhr.onerror = () => reject(new Error("Error de red al subir la imagen."));
    xhr.send(formData);
  });
}
