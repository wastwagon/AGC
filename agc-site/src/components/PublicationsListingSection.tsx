"use client";

import { useMemo, useState } from "react";
import type { CmsPublication } from "@/lib/content";
import type { TaxonomyOption } from "@/data/taxonomy-defaults";
import { PublicationCard } from "@/components/PublicationCard";

export type PublicationsListingItem = { item: CmsPublication; imageUrl: string };

const PAGE_SIZE = 9;

const selectClass =
  "min-h-[44px] w-full min-w-0 rounded-none border border-stone-300/90 bg-white px-3 py-2.5 text-sm text-stone-900 shadow-none focus:border-accent-600 focus:outline-none focus:ring-1 focus:ring-accent-500 sm:min-w-[140px] sm:flex-1";

const inputClass =
  "min-h-[44px] w-full min-w-0 rounded-none border border-stone-300/90 bg-white px-3 py-2.5 text-sm text-stone-900 shadow-none placeholder:text-stone-400 focus:border-accent-600 focus:outline-none focus:ring-1 focus:ring-accent-500 sm:min-w-[160px] sm:flex-1";

function publicationTypeSlugs(p: CmsPublication): string[] {
  if (p.types?.length) return p.types;
  if (p.type) return [p.type];
  return [];
}

function textMatches(item: CmsPublication, q: string): boolean {
  const s = q.trim().toLowerCase();
  if (!s) return true;
  const title = (item.title || "").toLowerCase();
  const excerpt = (item.excerpt || "").replace(/<[^>]*>/g, "").toLowerCase();
  return title.includes(s) || excerpt.includes(s);
}

type PublicationsListingSectionProps = {
  items: PublicationsListingItem[];
  publicationTypes: TaxonomyOption[];
  labels: {
    filter: string;
    textSearch: string;
    publicationType: string;
    reset: string;
    previous: string;
    next: string;
    all: string;
    noMatches: string;
  };
  intro?: React.ReactNode;
  draftsNotice?: React.ReactNode;
};

export function PublicationsListingSection({
  items,
  publicationTypes,
  labels,
  intro,
  draftsNotice,
}: PublicationsListingSectionProps) {
  const [search, setSearch] = useState("");
  const [pubType, setPubType] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return items.filter(({ item }) => {
      if (!textMatches(item, search)) return false;
      if (pubType) {
        const slugs = publicationTypeSlugs(item);
        if (!slugs.includes(pubType)) return false;
      }
      return true;
    });
  }, [items, search, pubType]);

  const totalPages = filtered.length === 0 ? 0 : Math.ceil(filtered.length / PAGE_SIZE);
  const currentPage = totalPages === 0 ? 1 : Math.min(Math.max(1, page), totalPages);
  const pageSlice = useMemo(() => {
    if (totalPages === 0) return [];
    const start = (currentPage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, currentPage, totalPages]);

  function resetFilters() {
    setSearch("");
    setPubType("");
    setPage(1);
  }

  return (
    <>
      {(intro || draftsNotice) && (
        <div className="mb-8 max-w-2xl space-y-4 border-b border-stone-200/80 pb-8">
          {intro}
          {draftsNotice}
        </div>
      )}

      <div className="border-b border-stone-200/80 pb-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <span className="shrink-0 text-sm font-semibold text-stone-800">{labels.filter}</span>
          <div className="flex w-full flex-1 flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end lg:justify-end">
            <label className="flex w-full min-w-0 flex-col gap-1 sm:w-auto sm:min-w-[160px] sm:flex-1">
              <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-stone-500">
                {labels.textSearch}
              </span>
              <input
                type="search"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder={labels.textSearch}
                className={inputClass}
                autoComplete="off"
              />
            </label>
            <label className="flex w-full min-w-0 flex-col gap-1 sm:w-auto sm:min-w-[180px] sm:flex-1">
              <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-stone-500">
                {labels.publicationType}
              </span>
              <select
                value={pubType}
                onChange={(e) => {
                  setPubType(e.target.value);
                  setPage(1);
                }}
                className={selectClass}
                aria-label={labels.publicationType}
              >
                <option value="">{labels.all}</option>
                {publicationTypes.map((t) => (
                  <option key={t.slug} value={t.slug}>
                    {t.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <button
            type="button"
            onClick={resetFilters}
            className="shrink-0 rounded-none border border-stone-400 bg-white px-5 py-2.5 text-sm font-semibold text-stone-800 transition-colors hover:bg-stone-50"
          >
            {labels.reset}
          </button>
        </div>
      </div>

      {filtered.length > 0 ? (
        <>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {pageSlice.map(({ item, imageUrl }) => (
              <PublicationCard
                key={item.id}
                item={item}
                imageUrl={imageUrl}
                href="/publications"
                publicationTypes={publicationTypes}
                variant="listing"
              />
            ))}
          </div>
          {totalPages > 1 && (
            <nav className="mt-14 flex justify-center" aria-label="Publications pagination">
              <div className="inline-flex overflow-hidden rounded-none border border-amber-800/50 bg-white">
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="!rounded-none min-w-[120px] px-5 py-3 text-sm font-semibold uppercase tracking-wide text-amber-900/90 transition-colors hover:bg-amber-50 disabled:pointer-events-none disabled:opacity-40"
                >
                  {labels.previous}
                </button>
                <div className="w-px shrink-0 bg-amber-800/50" aria-hidden />
                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="!rounded-none min-w-[120px] px-5 py-3 text-sm font-semibold uppercase tracking-wide text-amber-900/90 transition-colors hover:bg-amber-50 disabled:pointer-events-none disabled:opacity-40"
                >
                  {labels.next}
                </button>
              </div>
            </nav>
          )}
        </>
      ) : items.length > 0 ? (
        <p className="mt-12 text-center text-base text-stone-600">{labels.noMatches}</p>
      ) : null}
    </>
  );
}
