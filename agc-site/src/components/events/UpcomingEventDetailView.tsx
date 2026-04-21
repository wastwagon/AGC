import Link from "next/link";
import { MapPin } from "lucide-react";
import { Button } from "@/components/Button";
import type { CmsEvent } from "@/lib/content";
import { eventsContent } from "@/data/content";
import { formatEventTimeRangeLower } from "@/lib/event-display";

function dateParts(iso: string): { month: string; day: string; year: string } {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return { month: "", day: "", year: "" };
  return {
    month: d.toLocaleDateString("en-GB", { month: "long" }),
    day: String(d.getDate()),
    year: String(d.getFullYear()),
  };
}

export function UpcomingEventDetailView({
  event,
  slug,
  breadcrumbs,
}: {
  event: CmsEvent;
  slug: string;
  breadcrumbs: { home: string; events: string };
}) {
  const { month, day, year } = dateParts(event.start_date);
  const timeCol = formatEventTimeRangeLower(event.start_date, event.end_date);
  const registerHref = `/events/register/${encodeURIComponent(slug)}`;

  return (
    <section className="border-b border-stone-200/90 bg-white">
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <nav aria-label="Breadcrumb" className="text-sm text-stone-500">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link href="/" className="font-medium text-stone-600 transition-colors hover:text-accent-700">
                {breadcrumbs.home}
              </Link>
            </li>
            <span className="text-stone-300/90">/</span>
            <li>
              <Link href="/events" className="font-medium text-stone-600 transition-colors hover:text-accent-700">
                {breadcrumbs.events}
              </Link>
            </li>
            <span className="text-stone-300/90">/</span>
            <li>
              <span className="font-semibold text-accent-800">{event.title}</span>
            </li>
          </ol>
        </nav>

        <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-14">
          <div className="flex flex-col items-center text-center lg:col-span-3 lg:items-stretch lg:text-left">
            <div className="h-2 w-full max-w-[11rem] bg-accent-600 lg:max-w-none" aria-hidden />
            <p className="mt-6 text-sm font-bold capitalize text-stone-900">{month}</p>
            <p className="mt-1 font-sans text-5xl font-bold tabular-nums leading-none text-stone-950 sm:text-6xl">{day}</p>
            <p className="mt-2 text-sm font-medium text-stone-600">{year}</p>
            <div className="mt-8 h-px w-full max-w-[11rem] bg-stone-200 lg:max-w-none" aria-hidden />
            {timeCol ? <p className="mt-6 max-w-[14rem] text-sm leading-snug text-stone-500 lg:max-w-none">{timeCol}</p> : null}
          </div>

          <div className="min-w-0 lg:col-span-9">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-stone-500">
              {eventsContent.gridBadges.upcoming}
            </p>
            <h1 className="page-heading mt-3 text-3xl font-bold leading-tight tracking-tight text-stone-950 sm:text-4xl lg:text-[2.35rem] lg:leading-snug">
              {event.title}
            </h1>
            <div className="mt-10">
              <Button
                asChild
                href={registerHref}
                variant="primary"
                size="lg"
                className="!rounded-none !bg-accent-600 px-8 py-3.5 text-sm font-semibold uppercase tracking-wide text-white shadow-sm hover:!bg-accent-700"
              >
                <span className="inline-flex items-center gap-2">
                  <MapPin className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
                  Register
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
