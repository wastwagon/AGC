import { eventsContent, fallbackEvents } from "@/data/content";
import { placeholderImages } from "@/data/images";
import { getEvents } from "@/lib/content";
import { PageHero } from "@/components/PageHero";
import { EventsListingTabs } from "@/components/events/EventsListingTabs";
import type { CmsEvent } from "@/lib/content";

export const metadata = {
  title: "Events",
  description: "Upcoming events, conferences, and workshops advancing governance excellence across Africa.",
};

export const revalidate = 60;

export default async function EventsPage() {
  const cmsEvents = await getEvents();
  const events: CmsEvent[] = cmsEvents.length > 0 ? cmsEvents : (fallbackEvents as CmsEvent[]);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming = events.filter((e) => new Date(e.end_date || e.start_date) >= today);
  const past = events.filter((e) => new Date(e.end_date || e.start_date) < today);

  return (
    <>
      <PageHero
        title={eventsContent.title}
        subtitle={eventsContent.subtitle}
        image={placeholderImages.events}
        imageAlt="Events"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Events" }]}
      />

      <section className="page-section-warm border-t border-stone-200/60 py-16 sm:py-20 lg:py-24">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-accent-800">Convenings</p>
            <p className="page-prose mt-2 text-lg">{eventsContent.intro}</p>
          </div>

          {events.length > 0 && <EventsListingTabs upcoming={upcoming} past={past} />}

          {events.length === 0 && (
            <div className="mt-16 page-card p-12 text-center">
              <p className="page-prose">{eventsContent.intro}</p>
              <p className="page-prose mt-6">{eventsContent.emptyContact}</p>
              <a
                href="mailto:programs@africagovernancecentre.org"
                className="mt-6 inline-block font-medium text-accent-600 transition-colors hover:text-accent-700"
              >
                programs@africagovernancecentre.org
              </a>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
