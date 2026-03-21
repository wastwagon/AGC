"use client";

import { useMemo, useState } from "react";
import { eventsContent } from "@/data/content";
import type { CmsEvent } from "@/lib/content";
import { EventBentoCard } from "./EventBentoCard";

type Tab = "upcoming" | "past";

function sortUpcoming(events: CmsEvent[]) {
  return [...events].sort(
    (a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
  );
}

function sortPast(events: CmsEvent[]) {
  return [...events].sort(
    (a, b) =>
      new Date(b.end_date || b.start_date).getTime() -
      new Date(a.end_date || a.start_date).getTime()
  );
}

export function EventsListingTabs({ upcoming, past }: { upcoming: CmsEvent[]; past: CmsEvent[] }) {
  const [tab, setTab] = useState<Tab>(() => (upcoming.length > 0 ? "upcoming" : "past"));

  const orderedUpcoming = useMemo(() => sortUpcoming(upcoming), [upcoming]);
  const orderedPast = useMemo(() => sortPast(past), [past]);

  const show = tab === "upcoming" ? orderedUpcoming : orderedPast;
  const empty =
    tab === "upcoming"
      ? "No upcoming events are scheduled right now. Check back soon or contact our Programs team."
      : "Past event summaries will appear here.";

  return (
    <div className="mt-14">
      <div className="flex justify-center">
        <div
          className="inline-flex rounded-full border border-stone-200/90 bg-stone-100/90 p-1 shadow-inner"
          role="tablist"
          aria-label="Event period"
        >
          <button
            type="button"
            role="tab"
            aria-selected={tab === "past"}
            className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all sm:px-8 ${
              tab === "past"
                ? "bg-white text-stone-900 shadow-sm"
                : "text-stone-500 hover:text-stone-700"
            }`}
            onClick={() => setTab("past")}
          >
            {eventsContent.sections.past}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === "upcoming"}
            className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all sm:px-8 ${
              tab === "upcoming"
                ? "bg-white text-stone-900 shadow-sm"
                : "text-stone-500 hover:text-stone-700"
            }`}
            onClick={() => setTab("upcoming")}
          >
            {eventsContent.sections.upcoming}
          </button>
        </div>
      </div>

      <div className="mt-10" role="tabpanel">
        {show.length === 0 ? (
          <p className="page-prose text-center text-stone-600">{empty}</p>
        ) : (
          <ul className="grid list-none gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {show.map((event) => (
              <li key={event.id} className="min-w-0">
                <EventBentoCard event={event} isPast={tab === "past"} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
