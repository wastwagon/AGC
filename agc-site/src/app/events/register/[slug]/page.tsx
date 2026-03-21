import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, MapPin, Users, Clock } from "lucide-react";
import { getEventBySlug, getTeam } from "@/lib/content";
import { fallbackEvents } from "@/data/content";
import type { CmsEvent, CmsEventAgendaItem } from "@/lib/content";
import { PageHero } from "@/components/PageHero";
import { placeholderImages } from "@/data/images";
import { EventRegistrationForm } from "@/components/EventRegistrationForm";
import { prisma } from "@/lib/db";

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

  const [team, registrationCount] = await Promise.all([
    getTeam(),
    prisma.eventRegistration.count({ where: { eventSlug: slug } }),
  ]);

  const speakerIds = Array.isArray(event.speaker_ids) ? event.speaker_ids : [];
  const speakers = speakerIds.length > 0 ? team.filter((t) => speakerIds.includes(t.id)) : [];
  const agenda = parseAgenda((event as { agenda?: unknown }).agenda);
  const venue = event.venue_name || event.location;
  const venueFull = event.venue_address || event.location;
  const isPastDeadline = event.registration_deadline && new Date(event.registration_deadline) < new Date();
  const isFull = typeof event.capacity === "number" && registrationCount >= event.capacity;
  const canRegister = !isPastDeadline && !isFull;

  return (
    <>
      <PageHero
        title={`Register for ${event.title}`}
        subtitle={venue || "Event registration"}
        image={placeholderImages.events}
        imageAlt={event.title}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Events", href: "/events" },
          { label: event.title, href: "/events" },
          { label: "Register" },
        ]}
      />

      <section className="page-section-paper border-t border-stone-200/80 py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <p className="mb-8 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-stone-500">
            Registration
          </p>
          <div className="grid gap-10 lg:grid-cols-[1fr_300px]">
            <div className="space-y-8">
              {(event.event_type || venueFull || speakers.length > 0 || agenda.length > 0) && (
                <div className="page-card p-6 sm:p-8">
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
                          {registrationCount} / {event.capacity} registered
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
                <EventRegistrationForm event={event} />
              ) : (
                <div className="page-card border-l-[4px] border-l-accent-600 p-8">
                  <h2 className="page-heading text-xl text-stone-900">{event.title}</h2>
                  <p className="mt-3 page-prose">
                    {isPastDeadline
                      ? "Registration for this event has closed. Thank you for your interest."
                      : "This event has reached maximum capacity. We hope to see you at a future gathering."}
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
              <div className="page-card bg-accent-900 p-6 text-[#fffcf7] shadow-md">
                <h3 className="font-serif text-lg font-semibold tracking-tight">At a glance</h3>
                <p className="mt-4 flex items-start gap-2 text-sm text-accent-100/95">
                  <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-accent-300" aria-hidden />
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
                {venue && (
                  <p className="mt-3 flex items-start gap-2 text-sm text-accent-100/90">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent-300" aria-hidden />
                    {venue}
                  </p>
                )}
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
