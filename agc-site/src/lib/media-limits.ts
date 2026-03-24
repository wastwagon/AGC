/** Client-safe upload limits (no Node/fs imports). */

export const MAX_MEDIA_UPLOAD_BYTES = 5 * 1024 * 1024;

export function formatMaxUploadBytes(): string {
  return `${Math.round(MAX_MEDIA_UPLOAD_BYTES / (1024 * 1024))} MB`;
}
