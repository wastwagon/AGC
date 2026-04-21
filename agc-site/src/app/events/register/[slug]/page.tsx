import { notFound } from "next/navigation";
import Link from "next/link";
import { getEventBySlug, getTeam } from "@/lib/content";
import { eventsContent, fallbackEvents } from "@/data/content";
import { cmsStaticOrEmpty, getMergedPageContent } from "@/lib/page-content";
import type { CmsEvent, CmsEventAgendaItem } from "@/lib/content";
import { HomeScrollReveal } from "@/components/home/HomeScrollReveal";
import { placeholderImages } from "@/data/images";
import { resolveImageUrl } from "@/lib/media";
import { EventRegistrationForm } from "@/components/EventRegistrationForm";
import { PastEventDetailView } from "@/components/events/PastEventDetailView";
import { prisma } from "@/lib/db";
import { getBreadcrumbLabels } from "@/lib/breadcrumbs";
import { DEFAULT_SITE_CHROME } from "@/data/site-chrome";
import { eventLocationSentence, formatRegistrationScheduleLine } from "@/lib/event-display";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const cmsEvent = await getEventBySlug(slug);
  const event = cmsEvent ?? (fallbackEvents as CmsEvent[]).find((e) => e.slug === slug);
  const isPastEvent = event
    ? new Date(event.end_date || event.start_date).getTime() < Date.now()
    : false;
  const title = event ? `${isPastEvent ? "Past event" : "Register"} – ${event.title}` : "Event Registration";
  return { title, description: event?.description?.replace(/<[^>]*>/g, "").slice(0, 160) };
}

export const revalidate = 60;

function parseAgenda(agenda: unknown): CmsEventAgendaItem[] {
  if (!agenda || !Array.isArray(agenda)) return [];
  return agenda.filter((a): a is CmsEventAgendaItem => a && typeof a === "object" && "title" in a);
}

export default async function EventRegisterPage({ params }: Props) {
  const { slug } = await params;
  const cmsEvent = await getEventBySlug(slug);
  const events = cmsEvent ? [cmsEvent] : (fallbackEvents as CmsEvent[]);
  const event = events.find((e) => e.slug === slug);

  if (!event) notFound();

  const [team, bc] = await Promise.all([
    getTeam().catch(() => [] as Awaited<ReturnType<typeof getTeam>>),
    getBreadcrumbLabels().catch(() => DEFAULT_SITE_CHROME.breadcrumbs),
  ]);

  const isPastEvent = new Date(event.end_date || event.start_date).getTime() < Date.now();

  let confirmedCount = 0;
  let waitlistCount = 0;
  if (!isPastEvent) {
    try {
      const [c, w] = await Promise.all([
        prisma.eventRegistration.count({ where: { eventSlug: slug, waitlisted: false } }),
        prisma.eventRegistration.count({ where: { eventSlug: slug, waitlisted: true } }),
      ]);
      confirmedCount = c;
      waitlistCount = w;
    } catch {
      /* DB unavailable (e.g. dev / CI without Postgres) — treat as zero registrations */
    }
  }

  const speakerIds = Array.isArray(event.speaker_ids) ? event.speaker_ids : [];
  const speakers = speakerIds.length > 0 ? team.filter((t) => speakerIds.includes(t.id)) : [];
  const agenda = parseAgenda((event as { agenda?: unknown }).agenda);
  const locationBody = eventLocationSentence(event);
  const isPastDeadline = event.registration_deadline && new Date(event.registration_deadline) < new Date();
  const isFull = typeof event.capacity === "number" && confirmedCount >= event.capacity;
  const allowWaitlist = Boolean(event.allow_waitlist);
  const canRegister = !isPastEvent && !isPastDeadline && (!isFull || allowWaitlist);
  const registeringWaitlist = !isPastEvent && isFull && allowWaitlist && !isPastDeadline;

  if (isPastEvent) {
    const eventsPage = await getMergedPageContent<typeof eventsContent>("events", cmsStaticOrEmpty(eventsContent));
    const pageCopy = eventsPage as unknown as typeof eventsContent & { heroImage?: string };
    const heroImage =
      (await resolveImageUrl(event.image)) ||
      (await resolveImageUrl(pageCopy.heroImage)) ||
      placeholderImages.events;
    return (
      <PastEventDetailView
        event={event}
        slug={slug}
        breadcrumbs={{
          home: bc.home,
          events: bc.events,
          current: eventsContent.gridBadges.past,
        }}
        speakers={speakers}
        agenda={agenda}
        heroImage={heroImage}
      />
    );
  }

  const scheduleLine = formatRegistrationScheduleLine(event.start_date, event.end_date);

  return (
    <>
      <HomeScrollReveal variant="fadeUp" start="top 88%" className="block w-full">
        <section className="border-t border-stone-200/80 bg-white py-12 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <nav aria-label="Breadcrumb" className="text-sm text-stone-500">
              <ol className="flex flex-wrap items-center gap-1.5">
                <li>
                  <Link href="/" className="font-medium text-stone-600 transition-colors hover:text-accent-700">
                    {bc.home}
                  </Link>
                </li>
                <span className="text-stone-300/90">/</span>
                <li>
                  <Link href="/events" className="font-medium text-stone-600 transition-colors hover:text-accent-700">
                    {bc.events}
                  </Link>
                </li>
                <span className="text-stone-300/90">/</span>
                <li>
                  <Link
                    href={`/events/${encodeURIComponent(slug)}`}
                    className="font-medium text-stone-600 transition-colors hover:text-accent-700"
                  >
                    {event.title}
                  </Link>
                </li>
                <span className="text-stone-300/90">/</span>
                <li>
                  <span className="font-semibold text-accent-800">{bc.eventRegister}</span>
                </li>
              </ol>
            </nav>

            <h1 className="page-heading mt-8 text-3xl font-bold tracking-tight text-stone-950 sm:text-4xl">{event.title}</h1>
            {scheduleLine ? <p className="mt-5 text-base font-semibold text-stone-900">{scheduleLine}</p> : null}
            {locationBody ? (
              <p className="mt-5 text-base leading-relaxed text-stone-800">
                <span className="font-bold">{eventsContent.locationLabel}</span> {locationBody}
              </p>
            ) : null}

            {event.description ? (
              <div
                className="prose prose-stone prose-lg mt-10 max-w-none text-stone-800 prose-headings:font-semibold prose-a:text-accent-700"
                dangerouslySetInnerHTML={{ __html: event.description }}
              />
            ) : null}

            {event.event_type ? (
              <p className="mt-10 text-sm text-stone-700">
                <span className="font-semibold uppercase tracking-wider text-stone-500">Type </span>
                <span className="capitalize">{event.event_type.replace(/_/g, " ")}</span>
              </p>
            ) : null}

            {speakers.length > 0 ? (
              <div className="mt-10">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-500">Speakers</h2>
                <ul className="mt-3 space-y-2 text-stone-800">
                  {speakers.map((s) => (
                    <li key={s.id}>
                      <span className="font-medium">{s.name}</span>
                      {s.role ? <span className="text-stone-500"> · {s.role}</span> : null}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {agenda.length > 0 ? (
              <div className="mt-10">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-500">Agenda</h2>
                <ul className="mt-4 space-y-4 text-stone-800">
                  {agenda.map((item, i) => (
                    <li key={i} className="flex gap-4">
                      {item.time ? <span className="shrink-0 text-sm font-semibold text-accent-800">{item.time}</span> : null}
                      <div>
                        <span className="font-medium">{item.title}</span>
                        {item.description ? <p className="mt-1 text-sm text-stone-600">{item.description}</p> : null}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="mt-16 border-t border-stone-200 pt-14">
              <h2 className="text-center text-xl font-bold tracking-tight text-stone-950 sm:text-2xl">
                {eventsContent.registerToAttendHeading}
              </h2>

              {canRegister ? (
                <div>
                  {registeringWaitlist ? (
                    <div className="mx-auto mt-6 max-w-xl rounded-none border border-amber-200 bg-amber-50/90 px-4 py-3 text-sm text-amber-950">
                      <p className="font-medium">Capacity is full — you’re joining the waitlist</p>
                      <p className="mt-1 text-amber-900/90">
                        You’ll receive a badge for reference; check-in stays blocked until organisers confirm a spot.
                      </p>
                    </div>
                  ) : null}
                  <p className="mt-6 text-center">
                    <a
                      href={`/api/events/ics?slug=${encodeURIComponent(slug)}`}
                      download
                      className="text-sm font-medium text-accent-800 underline decoration-accent-300 underline-offset-2 hover:text-accent-950"
                    >
                      Add to calendar (.ics)
                    </a>
                  </p>
                  <EventRegistrationForm event={event} embedded />
                </div>
              ) : (
                <div className="mx-auto mt-8 max-w-xl border border-stone-200 bg-stone-50/80 px-6 py-8 text-center">
                  <p className="page-prose text-stone-800">
                    {isPastDeadline
                      ? "Registration for this event has closed. Thank you for your interest."
                      : "This event has reached maximum capacity and the waitlist is not open for this event."}
                  </p>
                  <Link
                    href={`/events/${encodeURIComponent(slug)}`}
                    className="mt-6 inline-flex text-sm font-medium text-accent-800 underline decoration-accent-300 underline-offset-2 hover:text-accent-950"
                  >
                    ← Event details
                  </Link>
                  <Link
                    href="/events"
                    className="mt-3 block text-sm font-medium text-stone-600 underline-offset-2 hover:text-stone-900"
                  >
                    All events
                  </Link>
                </div>
              )}
            </div>

            <p className="mt-12 text-sm">
              <Link
                href={`/events/${encodeURIComponent(slug)}`}
                className="font-medium text-accent-800 underline decoration-accent-300 underline-offset-2 hover:text-accent-950"
              >
                ← Back to event details
              </Link>
            </p>
          </div>
        </section>
      </HomeScrollReveal>
    </>
  );
}
