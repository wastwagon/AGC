"use client";

import { useMemo, useState } from "react";
import type { CmsEvent } from "@/lib/content";
import { cn } from "@/lib/utils";
import {
  DEFAULT_EVENT_CATEGORY_TAB_ID,
  eventMatchesCategoryTab,
  isEventCategoryTabId,
} from "@/lib/event-category-filter";
import { EventsPageGrids } from "@/components/events/EventsPageGrids";

export type EventFilterTab = { id: string; label: string };

type Props = {
  upcoming: CmsEvent[];
  past: CmsEvent[];
  tabs: EventFilterTab[];
  filterAriaLabel: string;
};

export function EventsPageCategoryFilters({ upcoming, past, tabs, filterAriaLabel }: Props) {
  const resolvedTabs = useMemo(
    () => tabs.filter((t) => isEventCategoryTabId(t.id)),
    [tabs]
  );

  const { displayTabs, defaultActiveId } = useMemo(() => {
    const displayTabs =
      resolvedTabs.length > 0 ? resolvedTabs : [{ id: "all", label: "All" }];
    const defaultActiveId = displayTabs.some((t) => t.id === "all")
      ? DEFAULT_EVENT_CATEGORY_TAB_ID
      : displayTabs[0]!.id;
    return { displayTabs, defaultActiveId };
  }, [resolvedTabs]);

  const [active, setActive] = useState(defaultActiveId);

  const upcomingFiltered = useMemo(() => {
    return upcoming.filter((e) => eventMatchesCategoryTab(active, e));
  }, [upcoming, active]);

  const pastFiltered = useMemo(() => {
    return past.filter((e) => eventMatchesCategoryTab(active, e));
  }, [past, active]);

  return (
    <div className="w-full">
      <div
        role="tablist"
        aria-label={filterAriaLabel}
        className="mt-10 flex flex-wrap gap-2.5 sm:gap-3"
      >
        {displayTabs.map((t) => {
          const selected = active === t.id;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={selected}
              id={`events-filter-${t.id}`}
              onClick={() => setActive(t.id)}
              className={cn(
                "min-h-[44px] border-0 px-4 py-2 text-sm font-medium transition-colors",
                "rounded-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-600",
                selected ? "bg-accent-600 text-white" : "bg-[#f1f4f9] text-[#1d2d50] hover:bg-[#e4eaf3]"
              )}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      <EventsPageGrids upcoming={upcomingFiltered} past={pastFiltered} />
    </div>
  );
}
