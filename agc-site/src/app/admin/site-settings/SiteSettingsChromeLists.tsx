"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { ImagePlus, Plus, Trash2 } from "lucide-react";
import { DEFAULT_SITE_CHROME, type SiteChrome, type SiteNavItem } from "@/data/site-chrome";
import { ImagePicker, type MediaItem } from "@/components/ImagePicker";
import {
  parseBottomNav,
  parseLinkList,
  parseNavList,
  parseWorkThumbs,
  serializeHrefLabelArray,
  serializeNavForSettings,
  serializeWorkThumbsForSettings,
} from "@/lib/site-chrome-parse";

const btn =
  "inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50";
const input = "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900";
const dangerBtn = "rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600";

type LinkEdit = { href: string; label: string };
type ThumbEdit = { href: string; alt: string; image: string };

/** Flat top-level links only (submenus are not shown on the public site). */
function navListToRows(nav: SiteNavItem[]): LinkEdit[] {
  return nav.map((i) => ({ href: i.href, label: i.label }));
}

function parseJsonField<T>(raw: string | undefined, parse: (v: unknown) => T | null, fallback: T): T {
  const t = raw?.trim();
  if (!t) return fallback;
  try {
    const v = JSON.parse(t) as unknown;
    return parse(v) ?? fallback;
  } catch {
    return fallback;
  }
}

function cloneLinks(links: { href: string; label: string }[]) {
  return links.map((x) => ({ ...x }));
}

function cloneThumbs(thumbs: { href: string; alt: string; image?: string }[]) {
  return thumbs.map((x) => ({ href: x.href, alt: x.alt, image: typeof x.image === "string" ? x.image : "" }));
}

type Props = {
  chrome: SiteChrome;
  initialDraft: Record<string, string> | null;
  /** Persist list changes into the same localStorage draft as the rest of the form. */
  onListsChange?: () => void;
};

export function SiteSettingsChromeLists({ chrome, initialDraft, onListsChange }: Props) {
  const [thumbPickerIndex, setThumbPickerIndex] = useState<number | null>(null);

  const [navRows, setNavRows] = useState<LinkEdit[]>(() =>
    cloneLinks(navListToRows(parseJsonField(initialDraft?.chromeNavJson, parseNavList, chrome.nav)))
  );

  const [bottomRows, setBottomRows] = useState<LinkEdit[]>(() =>
    cloneLinks(parseJsonField(initialDraft?.chromeBottomNavJson, parseBottomNav, chrome.bottomNav))
  );

  const [quickRows, setQuickRows] = useState<LinkEdit[]>(() =>
    cloneLinks(parseJsonField(initialDraft?.chromeFooterQuickLinksJson, parseLinkList, chrome.footer.quickLinks))
  );

  const [legalRows, setLegalRows] = useState<LinkEdit[]>(() =>
    cloneLinks(parseJsonField(initialDraft?.chromeFooterLegalJson, parseLinkList, chrome.footer.legal))
  );

  const [thumbRows, setThumbRows] = useState<ThumbEdit[]>(() =>
    cloneThumbs(parseJsonField(initialDraft?.chromeFooterWorkThumbsJson, parseWorkThumbs, chrome.footer.workThumbnails))
  );

  const navJson = useMemo(() => serializeNavForSettings(navRows), [navRows]);
  const bottomJson = useMemo(() => serializeHrefLabelArray(bottomRows), [bottomRows]);
  const quickJson = useMemo(() => serializeHrefLabelArray(quickRows), [quickRows]);
  const legalJson = useMemo(() => serializeHrefLabelArray(legalRows), [legalRows]);
  const thumbsJson = useMemo(() => serializeWorkThumbsForSettings(thumbRows), [thumbRows]);

  useEffect(() => {
    onListsChange?.();
  }, [navJson, bottomJson, quickJson, legalJson, thumbsJson, onListsChange]);

  return (
    <div className="mt-6 space-y-8">
      <input type="hidden" name="chromeNavJson" value={navJson} readOnly />
      <input type="hidden" name="chromeBottomNavJson" value={bottomJson} readOnly />
      <input type="hidden" name="chromeFooterQuickLinksJson" value={quickJson} readOnly />
      <input type="hidden" name="chromeFooterLegalJson" value={legalJson} readOnly />
      <input type="hidden" name="chromeFooterWorkThumbsJson" value={thumbsJson} readOnly />

      <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Main navigation</h3>
            <p className="mt-0.5 text-xs text-slate-600">
              Top header and mobile drawer — one row per link. Legacy items saved with sub-menus are merged into this flat list on the live site.
            </p>
          </div>
          <button type="button" className={btn} onClick={() => setNavRows((prev) => [...prev, { href: "", label: "" }])}>
            <Plus className="h-4 w-4" />
            Add item
          </button>
        </div>
        <ul className="mt-4 space-y-4">
          {navRows.map((row, i) => (
            <li key={i} className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
              <div className="flex flex-wrap items-start gap-2">
                <div className="grid min-w-0 flex-1 gap-2 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-medium text-slate-600">URL path</label>
                    <input
                      className={`${input} mt-0.5`}
                      value={row.href}
                      onChange={(e) => {
                        const v = e.target.value;
                        setNavRows((prev) => {
                          const next = [...prev];
                          const cur = next[i];
                          if (cur) next[i] = { ...cur, href: v };
                          return next;
                        });
                      }}
                      placeholder="/about"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-600">Label</label>
                    <input
                      className={`${input} mt-0.5`}
                      value={row.label}
                      onChange={(e) => {
                        const v = e.target.value;
                        setNavRows((prev) => {
                          const next = [...prev];
                          const cur = next[i];
                          if (cur) next[i] = { ...cur, label: v };
                          return next;
                        });
                      }}
                      placeholder="About Us"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  className={dangerBtn}
                  aria-label="Remove item"
                  onClick={() =>
                    setNavRows((prev) => {
                      const next = prev.filter((_, j) => j !== i);
                      return next.length === 0 ? [{ href: "", label: "" }] : next;
                    })
                  }
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
        <button type="button" className="mt-3 text-xs text-slate-500 underline hover:text-slate-700" onClick={() => setNavRows(navListToRows(DEFAULT_SITE_CHROME.nav))}>
          Reset main nav to site defaults
        </button>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Mobile bottom bar</h3>
            <p className="mt-0.5 text-xs text-slate-600">Tabs along the bottom on small screens. Use path <code className="rounded bg-white px-1">__menu__</code> for the menu tab.</p>
          </div>
          <button type="button" className={btn} onClick={() => setBottomRows((prev) => [...prev, { href: "", label: "" }])}>
            <Plus className="h-4 w-4" />
            Add tab
          </button>
        </div>
        <ul className="mt-3 space-y-2">
          {bottomRows.map((row, i) => (
            <li key={i} className="flex flex-wrap items-end gap-2 rounded-lg border border-slate-200 bg-white p-2">
              <div className="grid min-w-0 flex-1 gap-2 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-medium text-slate-600">Path</label>
                  <input className={`${input} mt-0.5`} value={row.href} onChange={(e) => setBottomRows((p) => p.map((r, j) => (j === i ? { ...r, href: e.target.value } : r)))} placeholder="/ or __menu__" />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600">Label</label>
                  <input className={`${input} mt-0.5`} value={row.label} onChange={(e) => setBottomRows((p) => p.map((r, j) => (j === i ? { ...r, label: e.target.value } : r)))} placeholder="Home" />
                </div>
              </div>
              <button type="button" className={dangerBtn} aria-label="Remove" onClick={() => setBottomRows((p) => p.filter((_, j) => j !== i))}>
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
        <button type="button" className="mt-3 text-xs text-slate-500 underline hover:text-slate-700" onClick={() => setBottomRows(DEFAULT_SITE_CHROME.bottomNav.map((x) => ({ ...x })))}>
          Reset to defaults
        </button>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Footer — quick links</h3>
            <p className="mt-0.5 text-xs text-slate-600">First column of footer links.</p>
          </div>
          <button type="button" className={btn} onClick={() => setQuickRows((prev) => [...prev, { href: "", label: "" }])}>
            <Plus className="h-4 w-4" />
            Add link
          </button>
        </div>
        <LinkRowsEditor rows={quickRows} onChange={setQuickRows} />
        <button type="button" className="mt-3 text-xs text-slate-500 underline hover:text-slate-700" onClick={() => setQuickRows(DEFAULT_SITE_CHROME.footer.quickLinks.map((x) => ({ ...x })))}>
          Reset to defaults
        </button>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Footer — legal links</h3>
            <p className="mt-0.5 text-xs text-slate-600">Privacy, terms, etc.</p>
          </div>
          <button type="button" className={btn} onClick={() => setLegalRows((prev) => [...prev, { href: "", label: "" }])}>
            <Plus className="h-4 w-4" />
            Add link
          </button>
        </div>
        <LinkRowsEditor rows={legalRows} onChange={setLegalRows} />
        <button type="button" className="mt-3 text-xs text-slate-500 underline hover:text-slate-700" onClick={() => setLegalRows(DEFAULT_SITE_CHROME.footer.legal.map((x) => ({ ...x })))}>
          Reset to defaults
        </button>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Footer — “Our work” thumbnails</h3>
            <p className="mt-0.5 text-xs text-slate-600">
              Tiles link to the paths below. Set an image per tile (Media Library or paste a <code className="text-[11px]">/uploads/…</code> URL); leave empty to use the built-in default for that link.
            </p>
          </div>
          <button
            type="button"
            className={btn}
            onClick={() => setThumbRows((prev) => [...prev, { href: "", alt: "", image: "" }])}
          >
            <Plus className="h-4 w-4" />
            Add tile
          </button>
        </div>
        <ul className="mt-3 space-y-3">
          {thumbRows.map((row, i) => (
            <li key={i} className="rounded-lg border border-slate-200 bg-white p-3">
              <div className="flex flex-wrap items-start gap-2">
                <div className="grid min-w-0 flex-1 gap-2 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-medium text-slate-600">Link path</label>
                    <input
                      className={`${input} mt-0.5`}
                      value={row.href}
                      onChange={(e) => setThumbRows((p) => p.map((r, j) => (j === i ? { ...r, href: e.target.value } : r)))}
                      placeholder="/our-work/programs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-600">Image alt text</label>
                    <input
                      className={`${input} mt-0.5`}
                      value={row.alt}
                      onChange={(e) => setThumbRows((p) => p.map((r, j) => (j === i ? { ...r, alt: e.target.value } : r)))}
                      placeholder="Programs"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  className={dangerBtn}
                  aria-label="Remove"
                  onClick={() => setThumbRows((p) => p.filter((_, j) => j !== i))}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-2">
                <label className="text-xs font-medium text-slate-600">Tile image</label>
                <div className="mt-0.5 flex flex-wrap items-center gap-2">
                  <input
                    className={`${input} min-w-[12rem] flex-1`}
                    value={row.image}
                    onChange={(e) => setThumbRows((p) => p.map((r, j) => (j === i ? { ...r, image: e.target.value } : r)))}
                    placeholder="media-… or /uploads/…"
                  />
                  <button
                    type="button"
                    className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    onClick={() => setThumbPickerIndex(i)}
                    title="Pick from Media Library"
                  >
                    <ImagePlus className="h-4 w-4" />
                    Media
                  </button>
                  {row.image.trim() && (row.image.startsWith("/") || row.image.startsWith("http")) ? (
                    <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md border border-slate-200 bg-slate-100">
                      <Image src={row.image} alt="" fill className="object-cover" sizes="48px" unoptimized />
                    </span>
                  ) : null}
                </div>
              </div>
            </li>
          ))}
        </ul>
        <button
          type="button"
          className="mt-3 text-xs text-slate-500 underline hover:text-slate-700"
          onClick={() =>
            setThumbRows(
              DEFAULT_SITE_CHROME.footer.workThumbnails.map((x) => ({
                href: x.href,
                alt: x.alt,
                image: typeof x.image === "string" ? x.image : "",
              }))
            )
          }
        >
          Reset to defaults
        </button>
      </div>

      <ImagePicker
        open={thumbPickerIndex !== null}
        onClose={() => setThumbPickerIndex(null)}
        onSelect={(item: MediaItem) => {
          if (thumbPickerIndex === null) return;
          const ref = item.url?.trim() || item.id;
          setThumbRows((rows) =>
            rows.map((r, j) => (j === thumbPickerIndex ? { ...r, image: ref } : r))
          );
          setThumbPickerIndex(null);
        }}
      />
    </div>
  );
}

function LinkRowsEditor({ rows, onChange }: { rows: LinkEdit[]; onChange: (r: LinkEdit[]) => void }) {
  return (
    <ul className="mt-3 space-y-2">
      {rows.map((row, i) => (
        <li key={i} className="flex flex-wrap items-end gap-2 rounded-lg border border-slate-200 bg-white p-2">
          <div className="grid min-w-0 flex-1 gap-2 sm:grid-cols-2">
            <div>
              <label className="text-xs font-medium text-slate-600">Path</label>
              <input
                className={`${input} mt-0.5`}
                value={row.href}
                onChange={(e) => onChange(rows.map((r, j) => (j === i ? { ...r, href: e.target.value } : r)))}
                placeholder="/publications"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600">Label</label>
              <input
                className={`${input} mt-0.5`}
                value={row.label}
                onChange={(e) => onChange(rows.map((r, j) => (j === i ? { ...r, label: e.target.value } : r)))}
                placeholder="Publications"
              />
            </div>
          </div>
          <button type="button" className={dangerBtn} aria-label="Remove" onClick={() => onChange(rows.filter((_, j) => j !== i))}>
            <Trash2 className="h-4 w-4" />
          </button>
        </li>
      ))}
    </ul>
  );
}
