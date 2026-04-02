/**
 * Media Library - WordPress-style central image management
 * Images stored in public/uploads/, metadata in data/media-library.json
 */
import { readFile, writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { MAX_MEDIA_UPLOAD_BYTES } from "@/lib/media-limits";

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");
const METADATA_PATH = path.join(process.cwd(), "data", "media-library.json");

export { MAX_MEDIA_UPLOAD_BYTES } from "@/lib/media-limits";

export interface MediaItem {
  id: string;
  filename: string;
  url: string;
  alt?: string;
  title?: string;
  width?: number;
  height?: number;
  size?: number;
  mimeType?: string;
  uploadedAt: string;
}

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"];
let metadataWriteQueue: Promise<unknown> = Promise.resolve();

async function ensureDirs(): Promise<void> {
  await mkdir(path.dirname(METADATA_PATH), { recursive: true });
  await mkdir(UPLOADS_DIR, { recursive: true });
}

export async function listMedia(): Promise<MediaItem[]> {
  try {
    if (!existsSync(METADATA_PATH)) return [];
    const raw = await readFile(METADATA_PATH, "utf-8");
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function getMediaById(id: string): Promise<MediaItem | null> {
  const items = await listMedia();
  return items.find((m) => m.id === id) ?? null;
}

/** Resolve media-xxx ID to full URL (for use in components) */
export async function getMediaUrlById(id: string | undefined): Promise<string | null> {
  if (!id?.startsWith("media-")) return null;
  const item = await getMediaById(id);
  return item ? getMediaUrl(item) : null;
}

export async function saveMediaMetadata(items: MediaItem[]): Promise<void> {
  await ensureDirs();
  await writeFile(METADATA_PATH, JSON.stringify(items, null, 2), "utf-8");
}

async function withMediaMetadataWriteLock<T>(operation: () => Promise<T>): Promise<T> {
  const run = metadataWriteQueue.then(operation, operation);
  metadataWriteQueue = run.then(
    () => undefined,
    () => undefined
  );
  return run;
}

export async function addMediaItem(item: MediaItem): Promise<void> {
  await withMediaMetadataWriteLock(async () => {
    const items = await listMedia();
    items.unshift(item);
    await saveMediaMetadata(items);
  });
}

export async function removeMediaItem(id: string): Promise<boolean> {
  return withMediaMetadataWriteLock(async () => {
    const items = await listMedia();
    const idx = items.findIndex((m) => m.id === id);
    if (idx === -1) return false;
    items.splice(idx, 1);
    await saveMediaMetadata(items);
    return true;
  });
}

export async function updateMediaItem(
  id: string,
  patch: { alt?: string; title?: string }
): Promise<MediaItem | null> {
  return withMediaMetadataWriteLock(async () => {
    const items = await listMedia();
    const idx = items.findIndex((m) => m.id === id);
    if (idx === -1) return null;
    const current = items[idx];
    const next: MediaItem = {
      ...current,
      ...(patch.alt !== undefined ? { alt: patch.alt } : {}),
      ...(patch.title !== undefined ? { title: patch.title } : {}),
    };
    items[idx] = next;
    await saveMediaMetadata(items);
    return next;
  });
}

export function getMediaUrl(item: MediaItem): string {
  return item.url.startsWith("/") ? item.url : `/${item.url.replace(/^\//, "")}`;
}

/** Resolve image reference: media ID (media-xxx), full URL, or path. Use for server components. */
export async function resolveImageUrl(
  ref: string | { id: string } | undefined
): Promise<string | null> {
  if (!ref) return null;
  const id = typeof ref === "object" ? ref?.id : ref;
  if (!id) return null;
  if (id.startsWith("media-")) return getMediaUrlById(id);
  if (id.startsWith("http") || id.startsWith("/")) return id;
  // Content layer paths (uploads/xxx)
  if (id.includes("/") || id.startsWith("uploads")) return id.startsWith("/") ? id : `/${id}`;
  return null;
}

export function isAllowedMimeType(mime: string): boolean {
  return ALLOWED_TYPES.includes(mime);
}

export function getUploadsDir(): string {
  return UPLOADS_DIR;
}

export function assertUploadWithinLimit(size: number): void {
  if (size > MAX_MEDIA_UPLOAD_BYTES) {
    throw new Error(`File too large. Maximum size is ${Math.round(MAX_MEDIA_UPLOAD_BYTES / (1024 * 1024))} MB.`);
  }
}
