import fs from "fs/promises";
import path from "path";

export interface UploadResult {
  url: string;
  filename: string;
  sizeBytes: number;
}

export interface StorageService {
  uploadFile(fileBuffer: Buffer, originalFilename: string, mimeType: string): Promise<UploadResult>;
}

export class LocalStorageService implements StorageService {
  private uploadDir: string;

  constructor() {
    this.uploadDir = path.join(process.cwd(), "public", "uploads");
  }

  async uploadFile(fileBuffer: Buffer, originalFilename: string, mimeType: string): Promise<UploadResult> {
    // Validate MIME Type
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedMimeTypes.includes(mimeType)) {
      throw new Error("Formato de imagen no soportado. Usa JPEG, PNG, WebP o GIF.");
    }

    // Validate size (max 5MB)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (fileBuffer.length > MAX_SIZE) {
      throw new Error("El archivo excede el tamaño máximo permitido de 5MB.");
    }

    // Ensure directory exists
    await fs.mkdir(this.uploadDir, { recursive: true });

    const ext = path.extname(originalFilename) || ".jpg";
    const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}${ext}`;
    const filePath = path.join(this.uploadDir, filename);

    await fs.writeFile(filePath, fileBuffer);

    return {
      url: `/uploads/${filename}`,
      filename,
      sizeBytes: fileBuffer.length,
    };
  }
}

export const storageAdapter: StorageService = new LocalStorageService();
