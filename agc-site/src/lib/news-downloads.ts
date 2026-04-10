/**
 * News articles can attach one or more downloadable documents (PDFs, calls, reports).
 * Stored in CMS as JSON: array of { label, href, description? }.
 */

export type NewsDocumentDownload = {
  label: string;
  href: string;
  description?: string;
};

export function normalizeNewsDownloads(item: { downloadResources?: unknown }): NewsDocumentDownload[] {
  const raw = item.downloadResources;
  if (raw === undefined || raw === null) return [];

  if (Array.isArray(raw)) {
    return raw
      .map((x) => {
        if (!x || typeof x !== "object") return null;
        const o = x as Record<string, unknown>;
        const label = typeof o.label === "string" ? o.label.trim() : "";
        const href = typeof o.href === "string" ? o.href.trim() : "";
        if (!label || !href) return null;
        const description = typeof o.description === "string" ? o.description.trim() : undefined;
        return { label, href, ...(description ? { description } : {}) } satisfies NewsDocumentDownload;
      })
      .filter((x): x is NewsDocumentDownload => x !== null);
  }

  if (typeof raw === "object") {
    const o = raw as Record<string, unknown>;
    const href = typeof o.href === "string" ? o.href.trim() : "";
    if (!href) return [];
    const label = typeof o.label === "string" && o.label.trim() ? o.label.trim() : "Download";
    const description = typeof o.description === "string" ? o.description.trim() : undefined;
    return [{ label, href, ...(description ? { description } : {}) }];
  }

  return [];
}
