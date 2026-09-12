import { mkdir, writeFile, unlink } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

const UPLOADS_ROOT = path.join(process.cwd(), "public", "uploads");

export type UploadKind = "photos" | "cvs" | "videos";

const LIMITS: Record<UploadKind, { maxBytes: number; types: string[] }> = {
  photos: {
    maxBytes: 5 * 1024 * 1024,
    types: ["image/jpeg", "image/png", "image/webp"],
  },
  cvs: {
    maxBytes: 10 * 1024 * 1024,
    types: ["application/pdf"],
  },
  videos: {
    maxBytes: 100 * 1024 * 1024,
    types: ["video/mp4", "video/webm", "video/quicktime"],
  },
};

export class UploadError extends Error {}

export async function saveUpload(
  file: File,
  kind: UploadKind
): Promise<string> {
  const limit = LIMITS[kind];

  if (!limit.types.includes(file.type)) {
    throw new UploadError(
      `Formato no permitido para ${kind}. Formatos válidos: ${limit.types.join(", ")}`
    );
  }
  if (file.size > limit.maxBytes) {
    throw new UploadError(
      `El archivo supera el tamaño máximo permitido (${Math.round(
        limit.maxBytes / (1024 * 1024)
      )}MB).`
    );
  }

  const dir = path.join(UPLOADS_ROOT, kind);
  await mkdir(dir, { recursive: true });

  const ext = path.extname(file.name) || guessExtension(file.type);
  const filename = `${randomUUID()}${ext}`;
  const filePath = path.join(dir, filename);

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filePath, buffer);

  return `/uploads/${kind}/${filename}`;
}

export async function deleteUpload(publicUrl: string | null | undefined) {
  if (!publicUrl || !publicUrl.startsWith("/uploads/")) return;
  const filePath = path.join(process.cwd(), "public", publicUrl);
  try {
    await unlink(filePath);
  } catch {
    // El archivo ya no existe; no es un error del flujo principal.
  }
}

function guessExtension(mime: string): string {
  const map: Record<string, string> = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "application/pdf": ".pdf",
    "video/mp4": ".mp4",
    "video/webm": ".webm",
    "video/quicktime": ".mov",
  };
  return map[mime] ?? "";
}
