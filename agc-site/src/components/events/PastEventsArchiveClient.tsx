"use client";

import { useMemo, useState, useEffect, type ReactNode } from "react";
import Link from "next/link";
import { ChevronDown, Globe, List, Plus, Search } from "lucide-react";
import type { CmsEvent } from "@/lib/content";
import { eventsContent } from "@/data/content";
import {
  EVENT_CATEGORY_TAB_IDS,
  eventMatchesCategoryTab,
} from "@/lib/event-category-filter";

type DateFilter = "all" | "30d" | "6m" | "1y";

export type PastEventsArchiveCopy = (typeof eventsContent)["pastArchive"];

type PickerRow = { id: string; label: string; count: number };

function categoryKey(event: CmsEvent): string {
  return String((event as CmsEvent & { event_type?: string }).event_type || event.category || "").trim();
}

function categoryLabel(event: CmsEvent): string {
  return categoryKey(event).replace(/_/g, " ") || "event";
}

/** Region bucket from CMS event location / venue (database-sourced). */
function regionKey(event: CmsEvent): string {
  const loc = (event.location || "").trim();
  if (loc) return loc;
  const addr = (event.venue_address || "").trim();
  if (addr) return addr;
  return (event.venue_name || "").trim();
}

function formatScheduleLine(start: string, end?: string): string {
  const s = new Date(start);
  if (Number.isNaN(s.getTime())) return "";
  const weekday = s.toLocaleDateString("en-GB", { weekday: "long" });
  const timeOpts: Intl.DateTimeFormatOptions = { hour: "numeric", minute: "2-digit", hour12: true };
  const startT = s.toLocaleTimeString("en-GB", timeOpts);
  if (end && end !== start) {
    const e = new Date(end);
    if (!Number.isNaN(e.getTime())) {
      const endT = e.toLocaleTimeString("en-GB", timeOpts);
      return `${weekday}, ${startT} – ${endT}`;
    }
  }
  return `${weekday}, ${startT}`;
}

function dateParts(iso: string): { month: string; day: string; year: string } {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return { month: "", day: "", year: "" };
  return {
    month: d.toLocaleDateString("en-GB", { month: "long" }),
    day: String(d.getDate()),
    year: String(d.getFullYear()),
  };
}

function eventMatchesDateFilter(event: CmsEvent, filter: DateFilter): boolean {
  if (filter === "all") return true;
  const end = new Date(event.end_date || event.start_date);
  if (Number.isNaN(end.getTime())) return false;
  const now = new Date();
  now.setHours(23, 59, 59, 999);
  const start = new Date();
  if (filter === "30d") start.setDate(start.getDate() - 30);
  else if (filter === "6m") start.setMonth(start.getMonth() - 6);
  else start.setFullYear(start.getFullYear() - 1);
  start.setHours(0, 0, 0, 0);
  return end >= start && end <= now;
}

function eventMatchesSearch(event: CmsEvent, q: string): boolean {
  const s = q.trim().toLowerCase();
  if (!s) return true;
  const hay = [
    event.title,
    event.description,
    event.location,
    event.venue_name,
    event.venue_address,
    categoryLabel(event),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return hay.includes(s);
}

/** Inline `<details>` filter: labels from Admin `pastArchive` merge; options from `events` (DB). */
function FilterDropdown({
  summaryLabel,
  icon,
  rows,
  selected,
  onToggle,
  listFilter,
  onListFilterChange,
  emptyMessage,
  filterInputId,
  listPlaceholder,
  rowChecked,
  preserveLabelCase,
}: {
  summaryLabel: string;
  icon: ReactNode;
  rows: PickerRow[];
  selected: Set<string>;
  onToggle: (id: string) => void;
  listFilter: string;
  onListFilterChange: (v: string) => void;
  emptyMessage: string;
  filterInputId: string;
  listPlaceholder: string;
  /** When set, controls checkbox state (e.g. “All” when selection is empty). */
  rowChecked?: (row: PickerRow) => boolean;
  /** Disable `capitalize` on labels (canonical tab titles). */
  preserveLabelCase?: boolean;
}) {
  const q = listFilter.trim().toLowerCase();
  const visibleRows = q
    ? rows.filter((r) => r.label.toLowerCase().includes(q) || r.id.toLowerCase().includes(q))
    : rows;

  const selectedSuffix = selected.size > 0 ? ` (${selected.size})` : "";

  return (
    <details className="group border-b border-stone-200 last:border-b-0">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-2 py-3 text-sm font-semibold text-stone-800 transition-colors hover:bg-stone-100/50 [&::-webkit-details-marker]:hidden">
        <span className="flex min-w-0 items-center gap-2">
          <span className="shrink-0 text-stone-500">{icon}</span>
          <span className="min-w-0 truncate">
            {summaryLabel}
            <span className="font-normal text-stone-500">{selectedSuffix}</span>
          </span>
        </span>
        <ChevronDown
          className="h-4 w-4 shrink-0 text-stone-400 transition-transform group-open:rotate-180"
          aria-hidden
        />
      </summary>
      <div className="border-t border-stone-200 bg-white/90 pb-3 pt-2">
        {rows.length > 0 ? (
          <>
            <div className="relative px-1 pb-2">
              <label htmlFor={filterInputId} className="sr-only">
                Filter {summaryLabel.toLowerCase()}
              </label>
              <input
                id={filterInputId}
                type="search"
                value={listFilter}
                onChange={(e) => onListFilterChange(e.target.value)}
                placeholder={listPlaceholder}
                className="w-full rounded-none border border-stone-200 bg-white py-2 pl-2 pr-8 text-xs text-stone-900 placeholder:text-stone-400 focus:border-accent-600 focus:outline-none focus:ring-1 focus:ring-accent-500"
                onClick={(e) => e.stopPropagation()}
              />
              <Search className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-stone-400" aria-hidden />
            </div>
            {visibleRows.length === 0 ? (
              <p className="px-2 py-3 text-center text-xs text-stone-500">No matches.</p>
            ) : (
              <ul className="max-h-56 space-y-0 overflow-y-auto overscroll-contain border-t border-stone-100">
                {visibleRows.map((row) => (
                  <li key={row.id} className="border-b border-stone-100 last:border-b-0">
                    <label className="flex cursor-pointer items-center gap-2 px-2 py-2.5 text-sm text-stone-800 hover:bg-stone-50">
                      <input
                        type="checkbox"
                        checked={rowChecked ? rowChecked(row) : selected.has(row.id)}
                        onChange={() => onToggle(row.id)}
                        className="h-4 w-4 shrink-0 rounded border-stone-400 text-accent-600 focus:ring-accent-500"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <span
                        className={`min-w-0 flex-1 leading-snug ${preserveLabelCase ? "" : "capitalize"}`}
                      >
                        {row.label}
                      </span>
                      <span className="shrink-0 tabular-nums text-xs text-stone-500">({row.count})</span>
                    </label>
                  </li>
                ))}
              </ul>
            )}
          </>
        ) : (
          <p className="px-2 py-4 text-center text-sm text-stone-500">{emptyMessage}</p>
        )}
      </div>
    </details>
  );
}

function PastEventRow({ event }: { event: CmsEvent }) {
  const eventSlug = event.slug;
  const eventLink = eventSlug ? `/events/register/${eventSlug}` : event.link || "#";
  const { month, day, year } = dateParts(event.start_date);
  const schedule = formatScheduleLine(event.start_date, event.end_date);
  const location = [event.venue_name, event.venue_address, event.location].filter(Boolean).join(", ") || event.location || "";

  return (
    <div className="flex flex-col gap-6 border-b border-stone-200 py-10 sm:flex-row sm:items-stretch sm:gap-8">
      <div className="flex w-full shrink-0 flex-col items-center justify-center rounded-none bg-accent-600 px-4 py-5 text-center text-white sm:w-36">
        <p className="text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-white/85">{eventsContent.gridBadges.past}</p>
        <p className="mt-2 text-sm font-semibold capitalize text-white">{month}</p>
        <p className="font-sans text-4xl font-bold tabular-nums leading-none text-white sm:text-5xl">{day}</p>
        <p className="mt-1 text-xs font-medium text-white/90">{year}</p>
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-accent-600">
          {categoryLabel(event).toUpperCase()}
        </p>
        <h3 className="mt-2">
          <Link
            href={eventLink}
            className="font-sans text-xl font-bold leading-snug text-stone-950 underline decoration-transparent transition-colors hover:text-accent-800 hover:decoration-accent-600/40 sm:text-2xl"
          >
            {event.title}
          </Link>
        </h3>
        {location ? <p className="mt-3 text-sm text-stone-600">{location}</p> : null}
        {schedule ? <p className="mt-1 text-sm text-stone-600">{schedule}</p> : null}
      </div>
    </div>
  );
}

/**
 * Past events archive filters.
 * - **Copy** (`title`, `topicLabel`, `regionLabel`, …): from Admin → Pages → **events** → `content_json.pastArchive` (merged on the server).
 * - **Topic**: fixed taxonomy like `/events` (`eventCategoryFilters`); counts and matching use `event-category-filter` (not raw DB tokens).
 * - **Region**: derived from **`events`** locations (published past events from the database).
 */
export function PastEventsArchiveClient({
  events,
  copy = eventsContent.pastArchive,
  emptyPastMessage = eventsContent.gridEmpty.past,
  categoryFilters = eventsContent.eventCategoryFilters,
}: {
  events: CmsEvent[];
  copy?: PastEventsArchiveCopy;
  emptyPastMessage?: string;
  /** Same labels as `/events` category tabs (Admin → Pages → events `eventCategoryFilters`). */
  categoryFilters?: { id: string; label: string }[];
}) {
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [selectedTopics, setSelectedTopics] = useState<Set<string>>(new Set());
  const [selectedRegions, setSelectedRegions] = useState<Set<string>>(new Set());
  const [pageSize, setPageSize] = useState(10);
  const [visibleCount, setVisibleCount] = useState(10);
  const [topicListFilter, setTopicListFilter] = useState("");
  const [regionListFilter, setRegionListFilter] = useState("");

  const topicRows: PickerRow[] = useMemo(() => {
    const labelById = new Map(categoryFilters.map((t) => [t.id, t.label]));
    const tabIds = EVENT_CATEGORY_TAB_IDS.filter((id): id is string => id !== "all");
    const rows = tabIds.map((id) => ({
      id,
      label: labelById.get(id) ?? id.replace(/_/g, " "),
      count: events.filter((e) => eventMatchesCategoryTab(id, e)).length,
    }));
    return [{ id: "__all__", label: "All", count: events.length }, ...rows];
  }, [events, categoryFilters]);

  const regionRows: PickerRow[] = useMemo(() => {
    const counts = new Map<string, number>();
    events.forEach((e) => {
      const k = regionKey(e);
      if (!k) return;
      counts.set(k, (counts.get(k) ?? 0) + 1);
    });
    return Array.from(counts.entries())
      .map(([id, count]) => ({ id, label: id, count }))
      .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
  }, [events]);

  const filtered = useMemo(() => {
    return events.filter((e) => {
      if (!eventMatchesSearch(e, search)) return false;
      if (!eventMatchesDateFilter(e, dateFilter)) return false;
      if (selectedTopics.size > 0) {
        const matchesAnyTopic = [...selectedTopics].some((tid) => eventMatchesCategoryTab(tid, e));
        if (!matchesAnyTopic) return false;
      }
      if (selectedRegions.size > 0) {
        const rk = regionKey(e);
        if (!rk || !selectedRegions.has(rk)) return false;
      }
      return true;
    });
  }, [events, search, dateFilter, selectedTopics, selectedRegions]);

  const topicsSig = useMemo(() => [...selectedTopics].sort().join("|"), [selectedTopics]);
  const regionsSig = useMemo(() => [...selectedRegions].sort().join("|"), [selectedRegions]);

  useEffect(() => {
    setVisibleCount(Math.min(pageSize, filtered.length));
  }, [search, dateFilter, pageSize, filtered.length, topicsSig, regionsSig]);

  const visible = filtered.slice(0, Math.min(visibleCount, filtered.length));
  const canShowMore = visibleCount < filtered.length;

  function toggleTopic(key: string) {
    if (key === "__all__") {
      setSelectedTopics(new Set());
      return;
    }
    setSelectedTopics((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function toggleRegion(key: string) {
    setSelectedRegions((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  return (
    <div className="bg-white">
      <header className="border-b border-stone-200 pb-8">
        <div className="h-1 w-16 rounded-none bg-accent-600" aria-hidden />
        <h1 className="page-heading mt-5 text-4xl font-bold tracking-tight text-stone-950 sm:text-5xl">{copy.title}</h1>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-stone-600">{copy.subtitle}</p>
      </header>

      <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-14">
        <aside className="min-w-0 lg:col-span-4">
          <div className="rounded-none border border-stone-200/90 bg-white p-6">
            <div className="relative">
              <label htmlFor="past-ev-search" className="sr-only">
                {copy.searchPlaceholder}
              </label>
              <input
                id="past-ev-search"
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={copy.searchPlaceholder}
                className="w-full rounded-none border border-stone-300/90 bg-white py-2.5 pl-3 pr-10 text-sm text-stone-900 shadow-none placeholder:text-stone-400 focus:border-accent-600 focus:outline-none focus:ring-1 focus:ring-accent-500"
              />
              <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" aria-hidden />
            </div>

            <p className="mt-8 text-sm font-bold text-stone-900">{copy.filterBy}</p>
            <label className="mt-4 flex cursor-default items-center gap-2 border-b border-stone-200 py-3 text-sm text-stone-800">
              <input type="checkbox" checked readOnly className="h-4 w-4 rounded border-stone-400 text-accent-600" />
              <span>
                {copy.eventCheckboxLabel}{" "}
                <span className="text-stone-500">({events.length})</span>
              </span>
            </label>

            <FilterDropdown
              summaryLabel={copy.topicLabel}
              icon={<List className="h-4 w-4" strokeWidth={2} aria-hidden />}
              rows={topicRows}
              selected={selectedTopics}
              onToggle={toggleTopic}
              listFilter={topicListFilter}
              onListFilterChange={setTopicListFilter}
              emptyMessage={copy.topicEmpty}
              filterInputId="past-archive-topic-filter"
              listPlaceholder={copy.listFilterPlaceholder?.trim() || "Filter list…"}
              rowChecked={(row) =>
                row.id === "__all__" ? selectedTopics.size === 0 : selectedTopics.has(row.id)
              }
              preserveLabelCase
            />

            <FilterDropdown
              summaryLabel={copy.regionLabel}
              icon={<Globe className="h-4 w-4" strokeWidth={2} aria-hidden />}
              rows={regionRows}
              selected={selectedRegions}
              onToggle={toggleRegion}
              listFilter={regionListFilter}
              onListFilterChange={setRegionListFilter}
              emptyMessage={copy.filterComingSoon}
              filterInputId="past-archive-region-filter"
              listPlaceholder={copy.listFilterPlaceholder?.trim() || "Filter list…"}
            />

            <p className="mt-6 border-t border-stone-200 pt-4 text-sm font-bold text-stone-900">{copy.dateHeading}</p>
            <ul className="mt-3 space-y-0 divide-y divide-stone-200 border-t border-stone-200">
              {(
                [
                  ["all", copy.dateAll],
                  ["30d", copy.date30d],
                  ["6m", copy.date6m],
                  ["1y", copy.date1y],
                ] as const
              ).map(([value, label]) => (
                <li key={value}>
                  <label className="flex cursor-pointer items-center gap-3 py-3 text-sm text-stone-800">
                    <input
                      type="radio"
                      name="past-date"
                      checked={dateFilter === value}
                      onChange={() => setDateFilter(value)}
                      className="h-4 w-4 border-stone-400 text-accent-600 focus:ring-accent-500"
                    />
                    {label}
                  </label>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <div className="min-w-0 lg:col-span-8">
          <p className="text-sm text-stone-500">
            <span className="font-semibold text-stone-800">{filtered.length}</span> {copy.resultsFoundSuffix}
          </p>

          <div className="mt-6">
            {visible.length === 0 ? (
              <p className="border border-stone-200/90 bg-white px-6 py-12 text-center text-stone-600">
                {emptyPastMessage}
              </p>
            ) : (
              visible.map((event) => <PastEventRow key={event.id} event={event} />)
            )}
          </div>

          {canShowMore ? (
            <div className="mt-10 flex justify-center">
              <button
                type="button"
                onClick={() => setVisibleCount((c) => Math.min(c + pageSize, filtered.length))}
                className="flex w-full max-w-xl items-center justify-center gap-2 rounded-none border-2 border-stone-900 bg-white px-6 py-4 text-sm font-bold text-stone-900 transition-colors hover:bg-stone-50"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-stone-900">
                  <Plus className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden />
                </span>
                {copy.showMore}
              </button>
            </div>
          ) : null}

          <div className="mt-8 flex justify-end">
            <label className="flex items-center gap-2 text-sm text-stone-500">
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="rounded-none border border-stone-300 bg-white px-2 py-1.5 text-sm font-semibold text-stone-900 focus:border-accent-600 focus:outline-none focus:ring-1 focus:ring-accent-500"
              >
                {[10, 25, 50].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
              <span>{copy.resultsAtATime}</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
