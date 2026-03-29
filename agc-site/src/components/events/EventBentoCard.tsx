"use client";

import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, ArrowUpRight } from "lucide-react";
import { eventsContent } from "@/data/content";
import { placeholderImages } from "@/data/images";
import { resolveImageUrlSync } from "@/lib/content";
import { preferUnoptimizedImage } from "@/lib/image-delivery";
import type { CmsEvent } from "@/lib/content";

function getEventImageUrl(event: { image?: string }): string | null {
  return resolveImageUrlSync(event.image ?? undefined);
}

function formatDateRange(start: string, end?: string): string {
  const opts: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };
  const startStr = new Date(start).toLocaleDateString("en-GB", opts);
  if (!end || end === start) return startStr;
  const endStr = new Date(end).toLocaleDateString("en-GB", opts);
  return `${startStr} – ${endStr}`;
}

export function EventBentoCard({
  event,
  isPast,
}: {
  event: CmsEvent;
  isPast: boolean;
}) {
  const imageUrl = getEventImageUrl(event) || placeholderImages.events;
  const dateStr = formatDateRange(event.start_date, event.end_date);
  const category =
    (event as CmsEvent & { event_type?: string }).event_type ||
    (event as CmsEvent & { category?: string }).category ||
    "event";
  const eventSlug = (event as CmsEvent & { slug?: string }).slug;
  const eventLink = !isPast && eventSlug ? `/events/register/${eventSlug}` : event.link || "#";

  return (
    <Link
      href={eventLink}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-[#fffcf7] shadow-sm transition-all duration-300 hover:border-accent-200/40 hover:shadow-md"
    >
      <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden">
        <Image
          src={imageUrl}
          alt={event.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
          unoptimized={preferUnoptimizedImage(imageUrl)}
        />
        <div className="absolute left-3 top-3">
          <span className="rounded-lg bg-white/95 px-2.5 py-1 text-xs font-semibold capitalize text-stone-800 shadow-sm ring-1 ring-stone-200/80">
            {String(category).replace(/_/g, " ")}
          </span>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="font-serif text-lg font-semibold leading-snug text-stone-900 line-clamp-3">{event.title}</h3>
        <p className="mt-2 flex items-center gap-2 text-sm text-slate-500">
          <Calendar className="h-3.5 w-3.5 shrink-0" aria-hidden />
          {dateStr}
        </p>
        {event.location && (
          <p className="mt-1 flex items-center gap-2 text-sm text-slate-500">
            <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
            {event.location}
          </p>
        )}
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-800 transition-colors group-hover:text-accent-900">
          {eventsContent.buttons.viewEvent}
          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
        </span>
      </div>
    </Link>
  );
}
