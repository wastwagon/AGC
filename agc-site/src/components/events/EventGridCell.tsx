import Link from "next/link";
import type { CmsEvent } from "@/lib/content";

function categoryLabel(event: CmsEvent): string {
  const raw =
    (event as CmsEvent & { event_type?: string }).event_type ||
    (event as CmsEvent & { category?: string }).category ||
    "event";
  return String(raw).replace(/_/g, " ").trim() || "event";
}

function formatScheduleLine(start: string, end?: string): string {
  const s = new Date(start);
  if (Number.isNaN(s.getTime())) return "";
  const weekday = s.toLocaleDateString("en-GB", { weekday: "long" });
  const timeOpts: Intl.DateTimeFormatOptions = { hour: "numeric", minute: "2-digit", hour12: true };
  const startT = s.toLocaleTimeString("en-GB", timeOpts);
  if (end && end !== start) {
    const e = new Date(end);
    if (!Number.isNaN(e.getTime())) {
      const endT = e.toLocaleTimeString("en-GB", timeOpts);
      return `${weekday}, ${startT} – ${endT}`;
    }
  }
  return `${weekday}, ${startT}`;
}

function dateParts(iso: string): { month: string; day: string; year: string } {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return { month: "", day: "", year: "" };
  return {
    month: d.toLocaleDateString("en-GB", { month: "long" }),
    day: String(d.getDate()),
    year: String(d.getFullYear()),
  };
}

export function EventGridCell({
  event,
  isPast,
  upcomingBadge,
  pastBadge,
}: {
  event: CmsEvent;
  isPast: boolean;
  upcomingBadge: string;
  pastBadge: string;
}) {
  const eventSlug = event.slug;
  const eventLink = eventSlug
    ? isPast
      ? `/events/register/${eventSlug}`
      : `/events/${eventSlug}`
    : event.link || "#";
  const { month, day, year } = dateParts(event.start_date);
  const schedule = formatScheduleLine(event.start_date, event.end_date);
  const location = [event.venue_name, event.venue_address, event.location].filter(Boolean).join(", ") || event.location || "";

  return (
    <article className="flex h-full flex-col">
      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-accent-700">{categoryLabel(event)}</p>

      <div className="mt-4 flex flex-col items-center justify-center rounded-none bg-accent-600 px-3 py-5 text-center text-white">
        <p className="text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-white/85">
          {isPast ? pastBadge : upcomingBadge}
        </p>
        <p className="mt-2 text-sm font-semibold capitalize text-white">{month}</p>
        <p className="font-sans text-4xl font-bold tabular-nums leading-none text-white sm:text-5xl">{day}</p>
        <p className="mt-1 text-xs font-medium text-white/90">{year}</p>
      </div>

      <h3 className="mt-5">
        <Link
          href={eventLink}
          className="font-sans text-lg font-bold leading-snug text-stone-900 underline decoration-transparent decoration-2 underline-offset-2 transition-colors hover:text-accent-800 hover:decoration-accent-600/40"
        >
          {event.title}
        </Link>
      </h3>

      {location ? <p className="mt-3 text-sm leading-relaxed text-stone-600">{location}</p> : null}
      {schedule ? <p className="mt-1 text-sm leading-relaxed text-stone-600">{schedule}</p> : null}
    </article>
  );
}
