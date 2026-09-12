import { randomUUID } from "crypto";
import { getCloudflareContext } from "@opennextjs/cloudflare";

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

async function getBucket() {
  const { env } = await getCloudflareContext({ async: true });
  return env.UPLOADS;
}

// Los archivos se guardan en R2 con esta key; se sirven de vuelta a través
// de /api/files/[...key], que hace streaming desde el bucket.
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

  const ext = extname(file.name) || guessExtension(file.type);
  const key = `${kind}/${randomUUID()}${ext}`;

  const bucket = await getBucket();
  await bucket.put(key, await file.arrayBuffer(), {
    httpMetadata: { contentType: file.type },
  });

  return `/api/files/${key}`;
}

export async function deleteUpload(publicUrl: string | null | undefined) {
  if (!publicUrl || !publicUrl.startsWith("/api/files/")) return;
  const key = publicUrl.replace("/api/files/", "");
  const bucket = await getBucket();
  try {
    await bucket.delete(key);
  } catch {
    // El archivo ya no existe; no es un error del flujo principal.
  }
}

function extname(filename: string): string {
  const match = /\.[^./\\]+$/.exec(filename);
  return match ? match[0] : "";
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
