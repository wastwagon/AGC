import { eventsContent, fallbackEvents } from "@/data/content";
import { placeholderImages } from "@/data/images";
import { getEvents } from "@/lib/content";
import { cmsStaticOrEmpty, getMergedPageContent } from "@/lib/page-content";
import { PageHero } from "@/components/PageHero";
import { HomeScrollReveal } from "@/components/home/HomeScrollReveal";
import { EventsPageGrids } from "@/components/events/EventsPageGrids";
import type { CmsEvent } from "@/lib/content";
import { resolveImageUrl } from "@/lib/media";
import { resolveEventsForPublic } from "@/lib/cms-fallback";
import { CmsDraftNotice } from "@/components/CmsDraftNotice";
import { getBreadcrumbLabels } from "@/lib/breadcrumbs";

export const metadata = {
  title: "Events",
  description: "Upcoming events, conferences, and workshops advancing governance excellence across Africa.",
};

export const revalidate = 30;

export default async function EventsPage() {
  const [cmsEvents, merged, bc] = await Promise.all([
    getEvents(),
    getMergedPageContent<typeof eventsContent>("events", cmsStaticOrEmpty(eventsContent)),
    getBreadcrumbLabels(),
  ]);
  const content = merged as unknown as typeof eventsContent & { heroImage?: string };
  const heroImage = (await resolveImageUrl(content.heroImage)) || placeholderImages.events;
  const { items: events, cmsDraftsOnly: eventsDraftsOnly } = await resolveEventsForPublic(
    cmsEvents,
    fallbackEvents as CmsEvent[]
  );
  /** Client cards use sync URL helpers; resolve media- IDs and paths here (same pattern as the home page). */
  const eventsWithDisplayImages: CmsEvent[] = await Promise.all(
    events.map(async (e) => ({
      ...e,
      image: (await resolveImageUrl(e.image)) || undefined,
    }))
  );
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming = eventsWithDisplayImages.filter((e) => new Date(e.end_date || e.start_date) >= today);
  const past = eventsWithDisplayImages.filter((e) => new Date(e.end_date || e.start_date) < today);

  return (
    <>
      <PageHero
        title={content.title}
        subtitle={content.subtitle}
        image={heroImage}
        imageAlt="Events"
        breadcrumbs={[{ label: bc.home, href: "/" }, { label: bc.events }]}
      />

      <HomeScrollReveal variant="fadeUp" start="top 88%" className="block w-full">
        <section className="border-t border-stone-200/80 bg-white py-16 sm:py-20 lg:py-24">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl space-y-4">
            <p className="text-sm font-medium text-accent-800">Convenings</p>
            <p className="page-prose mt-2 text-lg">{content.intro}</p>
            {eventsDraftsOnly && <CmsDraftNotice entityLabel="events" adminHref="/admin/events" />}
          </div>

          {events.length > 0 && <EventsPageGrids upcoming={upcoming} past={past} />}

          {events.length === 0 && (
            <div className="mt-16 page-card p-12 text-center">
              <p className="page-prose">{content.intro}</p>
              <p className="page-prose mt-6">{content.emptyContact}</p>
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
      </HomeScrollReveal>
    </>
  );
}
