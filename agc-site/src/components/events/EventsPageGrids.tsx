import type { CmsEvent } from "@/lib/content";
import { eventsContent } from "@/data/content";
import { EventGridCell } from "./EventGridCell";
import { Button } from "@/components/Button";

function EventGrid({ events, isPast }: { events: CmsEvent[]; isPast: boolean }) {
  if (events.length === 0) {
    return (
      <p className="border border-border/90 bg-white px-6 py-12 text-center text-black">
        {isPast ? eventsContent.gridEmpty.past : eventsContent.gridEmpty.upcoming}
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-px bg-[#f1f4f9] sm:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <div key={event.id} className="min-w-0 bg-white p-6 sm:p-8 lg:p-10">
          <EventGridCell
            event={event}
            isPast={isPast}
            upcomingBadge={eventsContent.gridBadges.upcoming}
            pastBadge={eventsContent.gridBadges.past}
          />
        </div>
      ))}
    </div>
  );
}

export function EventsPageGrids({ upcoming, past }: { upcoming: CmsEvent[]; past: CmsEvent[] }) {
  const orderedUpcoming = [...upcoming].sort(
    (a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
  );
  const orderedPast = [...past].sort(
    (a, b) =>
      new Date(b.end_date || b.start_date).getTime() - new Date(a.end_date || a.start_date).getTime()
  );

  return (
    <div className="mt-14 space-y-20 lg:space-y-24">
      <section aria-labelledby="events-upcoming-heading">
        <div className="border-t border-border/90 pt-2">
          <h2
            id="events-upcoming-heading"
            className="page-heading text-3xl font-bold tracking-tight text-black sm:text-4xl"
          >
            {eventsContent.gridHeadings.upcoming}
          </h2>
        </div>
        <div className="mt-8">
          <EventGrid events={orderedUpcoming} isPast={false} />
        </div>
      </section>

      <section id="past-events" aria-labelledby="events-past-heading">
        <div className="border-t border-border/90 pt-2">
          <h2
            id="events-past-heading"
            className="page-heading text-3xl font-bold tracking-tight text-black sm:text-4xl"
          >
            {eventsContent.gridHeadings.past}
          </h2>
        </div>
        <div className="mt-8">
          <EventGrid events={orderedPast} isPast />
        </div>
        {orderedPast.length > 0 && (
          <div className="mt-12 flex justify-center">
            <Button
              asChild
              href="/events/past"
              variant="primary"
              className="!rounded-none !bg-accent-600 px-8 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-sm hover:!bg-accent-700"
            >
              {eventsContent.seeAllPastEvents}
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}
