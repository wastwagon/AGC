"use client";

import { useState } from "react";
import type { CmsEvent } from "@/lib/content";
import { Button } from "@/components/Button";
import { EventCard } from "@/components/EventCard";

type HomeEventsSectionProps = {
  pastEvents: CmsEvent[];
  upcomingEvents: CmsEvent[];
};

export function HomeEventsSection({ pastEvents, upcomingEvents }: HomeEventsSectionProps) {
  const [showPast, setShowPast] = useState(true);
  const displayEvents = showPast ? pastEvents : upcomingEvents;
  const emptyMessage = showPast
    ? "No past events at the moment."
    : "No upcoming events at the moment. Check back soon.";

  return (
    <section className="border-t border-slate-200 bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-serif text-3xl font-bold text-slate-900 sm:text-4xl">Events</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            Discover conferences and workshops that advance governance excellence across Africa.
          </p>
        </div>

        {/* Premium toggle - Past Events first (left), Upcoming Events (right) */}
        <div className="mt-10 flex justify-center">
          <div
            role="tablist"
            aria-label="Event type"
            className="inline-flex rounded-full border border-slate-200/80 bg-slate-100/80 p-1"
          >
            <button
              role="tab"
              aria-selected={showPast}
              onClick={() => setShowPast(true)}
              className={`rounded-full px-6 py-2.5 text-sm font-medium transition-all duration-300 ${
                showPast
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Past Events
            </button>
            <button
              role="tab"
              aria-selected={!showPast}
              onClick={() => setShowPast(false)}
              className={`rounded-full px-6 py-2.5 text-sm font-medium transition-all duration-300 ${
                !showPast
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Upcoming Events
            </button>
          </div>
        </div>

        {displayEvents.length > 0 ? (
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {displayEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center">
            <p className="text-slate-600">{emptyMessage}</p>
            <Button asChild href="/events" variant="outline" className="mt-6">
              View Events
            </Button>
          </div>
        )}

        <div className="mt-12 text-center">
          <Button asChild href="/events" variant="outline">
            View All Events
          </Button>
        </div>
      </div>
    </section>
  );
}
