import { eventsContent, fallbackEvents } from "@/data/content";
import { placeholderImages } from "@/data/images";
import { getEvents } from "@/lib/content";
import { cmsStaticOrEmpty, getMergedPageContent } from "@/lib/page-content";
import { PageHero } from "@/components/PageHero";
import { HomeScrollReveal } from "@/components/home/HomeScrollReveal";
import type { CmsEvent } from "@/lib/content";
import { resolveImageUrl } from "@/lib/media";
import { resolveEventsForPublic } from "@/lib/cms-fallback";
import { CmsDraftNotice } from "@/components/CmsDraftNotice";
import { getBreadcrumbLabels } from "@/lib/breadcrumbs";
import { PastEventsArchiveClient } from "@/components/events/PastEventsArchiveClient";

export const metadata = {
  title: "Past events",
  description: "Search and browse our archive of workshops, dialogues, and convenings.",
};

export const revalidate = 30;

export default async function PastEventsPage() {
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
  const eventsWithDisplayImages: CmsEvent[] = await Promise.all(
    events.map(async (e) => ({
      ...e,
      image: (await resolveImageUrl(e.image)) || undefined,
    }))
  );
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const past = eventsWithDisplayImages.filter((e) => new Date(e.end_date || e.start_date) < today);
  /** CMS `events` JSON may omit keys not in the editor; always layer defaults from `eventsContent`. */
  const archive = {
    ...eventsContent.pastArchive,
    ...(typeof content.pastArchive === "object" && content.pastArchive !== null ? content.pastArchive : {}),
  };
  const gridEmpty = {
    ...eventsContent.gridEmpty,
    ...(typeof content.gridEmpty === "object" && content.gridEmpty !== null ? content.gridEmpty : {}),
  };

  return (
    <>
      <PageHero
        title={archive.title}
        subtitle={archive.subtitle}
        image={heroImage}
        imageAlt="Events"
        breadcrumbs={[
          { label: bc.home, href: "/" },
          { label: bc.events, href: "/events" },
          { label: archive.title },
        ]}
      />

      <HomeScrollReveal variant="fadeUp" start="top 88%" className="block w-full">
        <section className="border-t border-stone-200/80 bg-white py-16 sm:py-20 lg:py-24">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            {eventsDraftsOnly && <CmsDraftNotice entityLabel="events" adminHref="/admin/events" />}
            <PastEventsArchiveClient events={past} copy={archive} emptyPastMessage={gridEmpty.past} />
          </div>
        </section>
      </HomeScrollReveal>
    </>
  );
}
