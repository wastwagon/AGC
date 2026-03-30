import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, ArrowUpRight } from "lucide-react";
import { placeholderImages } from "@/data/images";
import { resolveImageUrlSync } from "@/lib/content";
import { preferUnoptimizedImage } from "@/lib/image-delivery";

type EventCardProps = {
  event: {
    id: number;
    title: string;
    start_date: string;
    end_date?: string;
    location?: string;
    description?: string;
    image?: string;
    link?: string;
    category?: string;
  };
};

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

export function EventCard({ event }: EventCardProps) {
  const imageUrl = getEventImageUrl(event) || placeholderImages.events;
  const dateStr = formatDateRange(event.start_date, event.end_date);
  const category = event.category || "event";
  const eventLink = event.link || "/events";

  return (
    <Link
      href={eventLink}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:border-accent-200/80 hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <Image
          src={imageUrl}
          alt={event.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          unoptimized={preferUnoptimizedImage(imageUrl)}
        />
        <div className="absolute left-3 top-3">
          <span className="rounded-lg bg-white/90 px-2.5 py-1 text-xs font-medium text-slate-700 backdrop-blur-sm">
            {category.replace(/_/g, " ")}
          </span>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="font-sans text-lg font-bold text-slate-900 line-clamp-2 group-hover:text-accent-600">
          {event.title}
        </h3>
        <p className="mt-2 flex items-center gap-2 text-sm text-slate-500">
          <Calendar className="h-3.5 w-3.5 shrink-0" />
          {dateStr}
        </p>
        {event.location && (
          <p className="mt-1 flex items-center gap-2 text-sm text-slate-500">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            {event.location}
          </p>
        )}
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent-600 transition-colors group-hover:text-accent-700">
          View Event
          <ArrowUpRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  );
}
