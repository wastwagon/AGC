import { useEffect, useState } from "react";
import type { MediaItem } from "@/components/ImagePicker";

/**
 * Resolves a preview URL for admin image fields: absolute URLs, site paths, or media IDs (via /api/media).
 */
export function useImageFieldPreview(image: string) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const v = image.trim();
    if (!v) {
      setPreviewUrl(null);
      setLoading(false);
      return;
    }
    if (v.startsWith("http://") || v.startsWith("https://")) {
      setPreviewUrl(v);
      setLoading(false);
      return;
    }
    if (v.startsWith("/")) {
      setPreviewUrl(v);
      setLoading(false);
      return;
    }
    if (!v.startsWith("media-")) {
      setPreviewUrl(null);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setPreviewUrl(null);
    (async () => {
      try {
        const res = await fetch("/api/media");
        const data = (await res.json()) as { items?: MediaItem[] };
        const found = data.items?.find((m) => m.id === v);
        if (!cancelled) setPreviewUrl(found?.url ?? null);
      } catch {
        if (!cancelled) setPreviewUrl(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [image]);

  return { previewUrl, loading };
}
