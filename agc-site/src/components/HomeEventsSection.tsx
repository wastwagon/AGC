import type { CmsEvent } from "@/lib/content";
import { Button } from "@/components/Button";
import { HomeHorizontalEventBand } from "@/components/home/HomeHorizontalEventBand";
import { HomeScrollReveal } from "@/components/home/HomeScrollReveal";

type HomeEventsSectionProps = {
  pastEvents: CmsEvent[];
  upcomingEvents: CmsEvent[];
};

const EVENTS_TITLE = "Events";

/**
 * Homepage events: white intro (title + blurb), then **Upcoming** band,
 * then **Past** band — each shows up to three items and a “See all events” CTA.
 */
export function HomeEventsSection({ pastEvents, upcomingEvents }: HomeEventsSectionProps) {
  const upcoming = upcomingEvents.slice(0, 3);
  const past = pastEvents.slice(0, 3);
  const hasAny = upcoming.length > 0 || past.length > 0;

  return (
    <>
      <HomeScrollReveal variant="fadeUp" start="top 88%" className="block w-full">
        <section className="border-t border-border bg-white pt-8 pb-2 sm:pt-10 sm:pb-3 lg:pt-12 lg:pb-3">
          <div className="mx-auto w-full max-w-none px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
            <div className="border-b border-border pb-3">
              <h2 className="font-sans text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">{EVENTS_TITLE}</h2>
            </div>

            {!hasAny ? (
              <div className="mt-10 border border-border bg-stone-50/90 p-8 text-center">
                <p className="text-slate-600">No published events yet.</p>
                <Button asChild href="/events" variant="outline" className="mt-6 rounded-none">
                  Browse events
                </Button>
              </div>
            ) : null}
          </div>
        </section>
      </HomeScrollReveal>

      {upcoming.length > 0 ? (
        <HomeScrollReveal variant="slideLeft" start="top 88%" className="block w-full">
          <HomeHorizontalEventBand title="Upcoming Events" events={upcoming} />
        </HomeScrollReveal>
      ) : null}

      {past.length > 0 ? (
        <HomeScrollReveal variant="slideRight" start="top 88%" className="block w-full">
          <HomeHorizontalEventBand title="Past Events" events={past} isPastBand />
        </HomeScrollReveal>
      ) : null}
    </>
  );
}
