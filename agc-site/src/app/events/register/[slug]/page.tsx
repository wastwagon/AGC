import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, MapPin, Users, Clock } from "lucide-react";
import { getEventBySlug, getTeam } from "@/lib/content";
import { eventsContent, fallbackEvents } from "@/data/content";
import { cmsStaticOrEmpty, getMergedPageContent } from "@/lib/page-content";
import type { CmsEvent, CmsEventAgendaItem } from "@/lib/content";
import { PageHero } from "@/components/PageHero";
import { placeholderImages } from "@/data/images";
import { resolveImageUrl } from "@/lib/media";
import { EventRegistrationForm } from "@/components/EventRegistrationForm";
import { prisma } from "@/lib/db";
import { getBreadcrumbLabels } from "@/lib/breadcrumbs";
import { DEFAULT_SITE_CHROME } from "@/data/site-chrome";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const cmsEvent = await getEventBySlug(slug);
  const event = cmsEvent ?? (fallbackEvents as CmsEvent[]).find((e) => e.slug === slug);
  const title = event ? `Register – ${event.title}` : "Event Registration";
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

  const [team, bc, eventsPage] = await Promise.all([
    getTeam().catch(() => [] as Awaited<ReturnType<typeof getTeam>>),
    getBreadcrumbLabels().catch(() => DEFAULT_SITE_CHROME.breadcrumbs),
    getMergedPageContent<typeof eventsContent>("events", cmsStaticOrEmpty(eventsContent)),
  ]);
  const pageCopy = eventsPage as unknown as typeof eventsContent & { heroImage?: string };

  let confirmedCount = 0;
  let waitlistCount = 0;
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

  const speakerIds = Array.isArray(event.speaker_ids) ? event.speaker_ids : [];
  const speakers = speakerIds.length > 0 ? team.filter((t) => speakerIds.includes(t.id)) : [];
  const agenda = parseAgenda((event as { agenda?: unknown }).agenda);
  const venue = event.venue_name || event.location;
  const venueFull = event.venue_address || event.location;
  const isPastDeadline = event.registration_deadline && new Date(event.registration_deadline) < new Date();
  const isFull = typeof event.capacity === "number" && confirmedCount >= event.capacity;
  const allowWaitlist = Boolean(event.allow_waitlist);
  const canRegister = !isPastDeadline && (!isFull || allowWaitlist);
  const registeringWaitlist = isFull && allowWaitlist && !isPastDeadline;

  const heroImage =
    (await resolveImageUrl(event.image)) ||
    (await resolveImageUrl(pageCopy.heroImage)) ||
    placeholderImages.events;

  return (
    <>
      <PageHero
        title={`Register for ${event.title}`}
        subtitle={venue || pageCopy.subtitle}
        image={heroImage}
        imageAlt={event.title}
        breadcrumbs={[
          { label: bc.home, href: "/" },
          { label: bc.events, href: "/events" },
          { label: event.title, href: "/events" },
          { label: bc.eventRegister },
        ]}
      />

      <section className="page-section-paper border-t border-stone-200/80 py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <p className="mb-8 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-stone-500">
            Registration
          </p>
          <div className="grid gap-8 lg:grid-cols-[1fr_minmax(280px,320px)] lg:gap-10">
            <div className="space-y-8">
              {(event.event_type || venueFull || speakers.length > 0 || agenda.length > 0) && (
                <div className="rounded-2xl border border-stone-200/90 bg-white p-6 shadow-md shadow-stone-900/5 sm:p-8">
                  <h3 className="page-heading text-lg text-stone-900">Event details</h3>
                  <dl className="mt-5 space-y-4">
                    {event.event_type && (
                      <div>
                        <dt className="text-xs font-semibold uppercase tracking-wider text-stone-500">Type</dt>
                        <dd className="mt-1 capitalize text-stone-800">{event.event_type.replace(/_/g, " ")}</dd>
                      </div>
                    )}
                    {venueFull && (
                      <div>
                        <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-stone-500">
                          <MapPin className="h-3.5 w-3.5" aria-hidden />
                          Venue
                        </dt>
                        <dd className="mt-1 page-prose text-[0.95rem] text-stone-700">{venueFull}</dd>
                      </div>
                    )}
                    {event.capacity && (
                      <div>
                        <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-stone-500">
                          <Users className="h-3.5 w-3.5" aria-hidden />
                          Capacity
                        </dt>
                        <dd className="mt-1 text-stone-800">
                          {confirmedCount} / {event.capacity} confirmed
                          {waitlistCount > 0 ? (
                            <span className="text-stone-500"> · {waitlistCount} waitlist</span>
                          ) : null}
                        </dd>
                      </div>
                    )}
                    {event.registration_deadline && (
                      <div>
                        <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-stone-500">
                          <Clock className="h-3.5 w-3.5" aria-hidden />
                          Registration deadline
                        </dt>
                        <dd className="mt-1 text-stone-800">
                          {new Date(event.registration_deadline).toLocaleDateString("en-GB", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </dd>
                      </div>
                    )}
                  </dl>
                  {speakers.length > 0 && (
                    <div className="mt-8 border-t border-stone-200/80 pt-6">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-500">Speakers</h4>
                      <ul className="mt-3 space-y-2">
                        {speakers.map((s) => (
                          <li key={s.id} className="text-stone-800">
                            {s.name}
                            {s.role && <span className="text-stone-500"> · {s.role}</span>}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {agenda.length > 0 && (
                    <div className="mt-8 border-t border-stone-200/80 pt-6">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-500">Agenda</h4>
                      <ul className="mt-3 space-y-4">
                        {agenda.map((item, i) => (
                          <li key={i} className="flex gap-4">
                            {item.time && (
                              <span className="shrink-0 text-sm font-semibold text-accent-800">{item.time}</span>
                            )}
                            <div>
                              <span className="font-medium text-stone-800">{item.title}</span>
                              {item.description && (
                                <p className="mt-1 text-sm page-prose-tight">{item.description}</p>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {canRegister ? (
                <div className="space-y-6">
                  {registeringWaitlist ? (
                    <div className="rounded-xl border border-amber-200 bg-amber-50/90 px-4 py-3 text-sm text-amber-950">
                      <p className="font-medium">Capacity is full — you’re joining the waitlist</p>
                      <p className="mt-1 text-amber-900/90">
                        You’ll receive a badge for reference; check-in stays blocked until organisers confirm a spot.
                      </p>
                    </div>
                  ) : null}
                  <div className="flex flex-wrap gap-3">
                    <a
                      href={`/api/events/ics?slug=${encodeURIComponent(slug)}`}
                      download
                      className="inline-flex items-center text-sm font-medium text-accent-800 underline decoration-accent-300 underline-offset-2 hover:text-accent-950"
                    >
                      Add to calendar (.ics)
                    </a>
                  </div>
                  <EventRegistrationForm event={event} />
                </div>
              ) : (
                <div className="page-card border-l-[4px] border-l-accent-600 p-8">
                  <h2 className="page-heading text-xl text-stone-900">{event.title}</h2>
                  <p className="mt-3 page-prose">
                    {isPastDeadline
                      ? "Registration for this event has closed. Thank you for your interest."
                      : "This event has reached maximum capacity and the waitlist is not open for this event."}
                  </p>
                  <Link
                    href="/events"
                    className="mt-6 inline-flex text-sm font-medium text-accent-800 transition-colors hover:text-accent-950"
                  >
                    ← Back to events
                  </Link>
                </div>
              )}
            </div>
            <aside className="lg:sticky lg:top-24 lg:self-start">
              {/* Do not combine with .page-card — globals force a cream bg and wipe bg-accent-900. */}
              <div className="rounded-2xl border border-accent-800/40 bg-gradient-to-b from-accent-950 to-accent-900 p-6 text-white shadow-lg shadow-stone-900/20 ring-1 ring-white/10 sm:p-7">
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-teal-200/90">At a glance</p>
                <h3 className="mt-2 font-serif text-xl font-semibold leading-snug tracking-tight text-white">
                  {event.title}
                </h3>
                <div className="mt-6 space-y-4 border-t border-white/15 pt-5">
                  <p className="flex items-start gap-3 text-sm leading-relaxed text-white">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-teal-200">
                      <Calendar className="h-4 w-4" strokeWidth={2} aria-hidden />
                    </span>
                    <span>
                      {new Date(event.start_date).toLocaleDateString("en-GB", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                      {event.end_date && event.end_date !== event.start_date && (
                        <>
                          {" "}
                          – {new Date(event.end_date).toLocaleDateString("en-GB", { month: "long", day: "numeric", year: "numeric" })}
                        </>
                      )}
                    </span>
                  </p>
                  {venue ? (
                    <p className="flex items-start gap-3 text-sm leading-relaxed text-white">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-teal-200">
                        <MapPin className="h-4 w-4" strokeWidth={2} aria-hidden />
                      </span>
                      <span>{venue}</span>
                    </p>
                  ) : null}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
