/**
 * Pure parsers + serializers for site chrome JSON (safe for client or server).
 * Trimming matches the friendly CMS hidden-field output so DB and UI stay consistent.
 */
import type { SiteFooterChrome, SiteNavItem, SiteNavLink } from "@/data/site-chrome";

function readNavLink(x: unknown): SiteNavLink | null {
  if (!x || typeof x !== "object" || Array.isArray(x)) return null;
  const o = x as Record<string, unknown>;
  const href = typeof o.href === "string" ? o.href.trim() : "";
  const label = typeof o.label === "string" ? o.label.trim() : "";
  if (!href || !label) return null;
  return { href, label };
}

function parseNavItem(x: unknown): SiteNavItem | null {
  const link = readNavLink(x);
  if (!link) return null;
  const o = x as Record<string, unknown>;
  let subLinks: SiteNavLink[] | undefined;
  if (Array.isArray(o.subLinks)) {
    const sl = o.subLinks.map(readNavLink).filter((s): s is SiteNavLink => s !== null);
    if (sl.length > 0) subLinks = sl;
  }
  return { href: link.href, label: link.label, subLinks };
}

export function parseNavList(v: unknown): SiteNavItem[] | null {
  if (!Array.isArray(v)) return null;
  const items = v.map(parseNavItem).filter((x): x is SiteNavItem => x !== null);
  return items.length > 0 ? items : null;
}

export function parseLinkList(v: unknown): SiteNavLink[] | null {
  if (!Array.isArray(v)) return null;
  const items = v.map(readNavLink).filter((s): s is SiteNavLink => s !== null);
  return items.length > 0 ? items : null;
}

export function parseWorkThumbs(v: unknown): SiteFooterChrome["workThumbnails"] | null {
  if (!Array.isArray(v)) return null;
  const out: SiteFooterChrome["workThumbnails"] = [];
  for (const x of v) {
    if (!x || typeof x !== "object" || Array.isArray(x)) continue;
    const o = x as Record<string, unknown>;
    const href = typeof o.href === "string" ? o.href.trim() : "";
    const alt = typeof o.alt === "string" ? o.alt.trim() : "";
    if (!href || !alt) continue;
    const image = typeof o.image === "string" ? o.image.trim() : "";
    out.push(image ? { href, alt, image } : { href, alt });
  }
  return out.length > 0 ? out : null;
}

export function parseBottomNav(v: unknown): { href: string; label: string }[] | null {
  if (!Array.isArray(v)) return null;
  const out: { href: string; label: string }[] = [];
  for (const x of v) {
    if (!x || typeof x !== "object" || Array.isArray(x)) continue;
    const o = x as Record<string, unknown>;
    const href = typeof o.href === "string" ? o.href.trim() : "";
    const label = typeof o.label === "string" ? o.label.trim() : "";
    if (!href || !label) continue;
    out.push({ href, label });
  }
  return out.length > 0 ? out : null;
}

/** Editor row shape for main nav (matches SiteSettingsChromeLists). */
export type NavEditorRow = { href: string; label: string; subLinks: { href: string; label: string }[] };

/** Payload for `chromeNavJson` — same structure `mergeSiteChrome` expects after `parseNavList`. */
export function buildNavPayloadForSettings(rows: NavEditorRow[]): SiteNavItem[] {
  return rows
    .filter((r) => r.href.trim() && r.label.trim())
    .map((r) => {
      const sub = r.subLinks
        .filter((s) => s.href.trim() && s.label.trim())
        .map((s) => ({ href: s.href.trim(), label: s.label.trim() }));
      const item: SiteNavItem = { href: r.href.trim(), label: r.label.trim() };
      if (sub.length > 0) item.subLinks = sub;
      return item;
    });
}

export function serializeNavForSettings(rows: NavEditorRow[]): string {
  return JSON.stringify(buildNavPayloadForSettings(rows));
}

export function buildHrefLabelPayload(rows: { href: string; label: string }[]): SiteNavLink[] {
  return rows.filter((r) => r.href.trim() && r.label.trim()).map((r) => ({ href: r.href.trim(), label: r.label.trim() }));
}

export function serializeHrefLabelArray(rows: { href: string; label: string }[]): string {
  return JSON.stringify(buildHrefLabelPayload(rows));
}

export function buildWorkThumbsPayload(rows: { href: string; alt: string; image?: string }[]): SiteFooterChrome["workThumbnails"] {
  return rows
    .filter((r) => r.href.trim() && r.alt.trim())
    .map((r) => {
      const href = r.href.trim();
      const alt = r.alt.trim();
      const image = typeof r.image === "string" ? r.image.trim() : "";
      return image ? { href, alt, image } : { href, alt };
    });
}

export function serializeWorkThumbsForSettings(rows: { href: string; alt: string; image?: string }[]): string {
  return JSON.stringify(buildWorkThumbsPayload(rows));
}
