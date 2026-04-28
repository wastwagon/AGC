import Link from "next/link";
import type { CmsEvent } from "@/lib/content";
import { cn } from "@/lib/utils";

function eventHref(e: CmsEvent, isPastBand: boolean): string {
  const l = e.link?.trim();
  if (l && /^https?:\/\//i.test(l)) return l;
  if (!e.slug) return "/events";
  return isPastBand ? `/events/register/${e.slug}` : `/events/${e.slug}`;
}

function dateParts(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return { month: "—", day: "—", year: "" };
  return {
    month: d.toLocaleDateString("en-GB", { month: "long" }),
    day: d.getDate(),
    year: String(d.getFullYear()),
  };
}

function categoryLabel(e: CmsEvent): string {
  const raw = (e.category || e.event_type || "Event").replace(/_/g, " ");
  return raw.toUpperCase();
}

function locationLine(e: CmsEvent): string {
  const parts = [e.venue_name, e.location, e.venue_address].map((s) => s?.trim()).filter(Boolean);
  return parts.join(" · ") || "Details on the events page";
}

function scheduleLine(e: CmsEvent): string {
  const start = new Date(e.start_date);
  if (Number.isNaN(start.getTime())) return "";
  const weekday = start.toLocaleDateString("en-GB", { weekday: "long" });
  const t1 = start.toLocaleTimeString("en-GB", { hour: "numeric", minute: "2-digit", hour12: true });
  if (!e.end_date || e.end_date === e.start_date) {
    return `${weekday}, ${t1}`;
  }
  const end = new Date(e.end_date);
  const sameDay = start.toDateString() === end.toDateString();
  const t2 = end.toLocaleTimeString("en-GB", { hour: "numeric", minute: "2-digit", hour12: true });
  if (sameDay) return `${weekday}, ${t1} – ${t2}`;
  return `${weekday}, ${t1} · Ends ${end.toLocaleDateString("en-GB", { month: "short", day: "numeric" })} ${t2}`;
}

function EventBandItem({ event, isPastBand }: { event: CmsEvent; isPastBand: boolean }) {
  const { month, day, year } = dateParts(event.start_date);
  const href = eventHref(event, isPastBand);

  return (
    <Link
      href={href}
      className="group flex min-h-[120px] flex-col transition-colors hover:bg-stone-50 sm:min-h-[100px] md:min-h-[140px] md:flex-row md:items-stretch"
    >
      <div className="flex w-full shrink-0 flex-col items-center justify-center border-t-[3px] border-white bg-accent-600 px-3 py-4 text-center text-white sm:w-[7.5rem] md:w-32 md:py-5">
        <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/90">{month}</span>
        <span className="mt-0.5 text-[2.25rem] font-bold leading-none tracking-tight sm:text-4xl">{day}</span>
        <span className="mt-1 text-[11px] font-medium text-white/75">{year}</span>
      </div>
      <div className="flex flex-1 flex-col justify-center gap-1 border-t border-border px-4 py-4 sm:px-5 md:border-t-0 md:border-l md:border-border md:py-5 md:pl-6">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-accent-800">{categoryLabel(event)}</p>
        <h3 className="font-sans text-base font-bold leading-snug text-slate-900 sm:text-lg md:text-xl">{event.title}</h3>
        <p className="mt-1 text-sm leading-snug text-black">{locationLine(event)}</p>
        <p className="text-sm text-black">{scheduleLine(event)}</p>
      </div>
    </Link>
  );
}

type HomeHorizontalEventBandProps = {
  title: string;
  events: CmsEvent[];
  /** Past events link to the archive detail URL; upcoming links to the public event page. */
  isPastBand?: boolean;
  ctaHref?: string;
  ctaLabel?: string;
  /** Extra margin classes when stacking under another band */
  className?: string;
};

/**
 * Homepage events band: white panel, dark typography, date stack + copy with column dividers,
 * Accent CTA (no photo background).
 */
export function HomeHorizontalEventBand({
  title,
  events,
  isPastBand = false,
  ctaHref = "/events",
  ctaLabel = "See all events",
  className = "",
}: HomeHorizontalEventBandProps) {
  if (events.length === 0) return null;

  return (
    <section className={cn("bg-white pt-5 pb-8 sm:pt-6 sm:pb-10 lg:pt-6 lg:pb-10", className)}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-sans text-lg font-bold tracking-tight text-slate-900 sm:text-xl">{title}</h2>

        <div className="mt-5 grid grid-cols-1 divide-y divide-border md:mt-6 md:grid-cols-3 md:divide-x md:divide-y-0">
          {events.map((event) => (
            <EventBandItem key={event.id} event={event} isPastBand={isPastBand} />
          ))}
        </div>

        <div className="mt-6 flex justify-center md:mt-8">
          <Link
            href={ctaHref}
            className="inline-flex min-h-[44px] items-center justify-center rounded-none bg-accent-600 px-10 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-600"
          >
            {ctaLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
