import { notFound, redirect } from "next/navigation";
import { getEventBySlug } from "@/lib/content";
import { fallbackEvents } from "@/data/content";
import type { CmsEvent } from "@/lib/content";
import { UpcomingEventDetailView } from "@/components/events/UpcomingEventDetailView";
import { getBreadcrumbLabels } from "@/lib/breadcrumbs";
import { DEFAULT_SITE_CHROME } from "@/data/site-chrome";
import { placeholderImages } from "@/data/images";
import { resolveImageUrl } from "@/lib/media";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const cmsEvent = await getEventBySlug(slug);
  const event = cmsEvent ?? (fallbackEvents as CmsEvent[]).find((e) => e.slug === slug);
  return {
    title: event ? `Event – ${event.title}` : "Event",
    description: event?.description?.replace(/<[^>]*>/g, "").slice(0, 160),
  };
}

export default async function PublicEventDetailPage({ params }: Props) {
  const { slug } = await params;
  const cmsEvent = await getEventBySlug(slug);
  const events = cmsEvent ? [cmsEvent] : (fallbackEvents as CmsEvent[]);
  const event = events.find((e) => e.slug === slug);

  if (!event) notFound();

  const isPast = new Date(event.end_date || event.start_date).getTime() < Date.now();
  if (isPast) {
    redirect(`/events/register/${encodeURIComponent(slug)}`);
  }

  const bc = await getBreadcrumbLabels().catch(() => DEFAULT_SITE_CHROME.breadcrumbs);
  const heroImageRef = event.image?.trim() || placeholderImages.events;
  const heroImage =
    (await resolveImageUrl(heroImageRef)) ?? (heroImageRef.startsWith("/") ? heroImageRef : `/${heroImageRef}`);

  return (
    <UpcomingEventDetailView
      event={event}
      slug={slug}
      breadcrumbs={{ home: bc.home, events: bc.events, current: "Upcoming event" }}
      heroImage={heroImage}
    />
  );
}
