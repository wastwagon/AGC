/**
 * Local media under `/public/uploads` should not go through the Next.js image optimizer
 * unless the deployment hostname is fully covered by `next.config` `images.remotePatterns`.
 * Using `unoptimized` for these URLs avoids 400s on VPS/staging hosts (e.g. sslip.io, raw IPs).
 */
export function isLocalUploadImageSrc(src: string): boolean {
  if (!src) return false;
  if (src.startsWith("/uploads/")) return true;
  // Absolute URL to this app’s uploads (same-origin in browser)
  try {
    if (src.includes("/uploads/")) return true;
  } catch {
    /* ignore */
  }
  return false;
}

/** SVG is passed through unoptimized for predictable rendering. */
export function preferUnoptimizedImage(src: string): boolean {
  return isLocalUploadImageSrc(src) || src.endsWith(".svg");
}
