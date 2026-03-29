import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { placeholderImages } from "@/data/images";
import type { CmsNews } from "@/lib/content";
import { preferUnoptimizedImage } from "@/lib/image-delivery";

type NewsCardProps = {
  item: CmsNews;
  /** Pre-resolved image URL (from media library, CMS, or placeholder). If not provided, falls back to placeholder. */
  imageUrl?: string;
  /** Base path for links - e.g. /news for list, /news/[slug] for detail when available */
  href?: string;
};

/**
 * Consultar-style news card: image top, categories, date, title, excerpt, Read More link
 * Vertical layout for grid use
 */
export function NewsCard({ item, imageUrl = placeholderImages.news, href = "/news" }: NewsCardProps) {
  const date = item.date_published || item.date_created;
  const dateStr = date ? new Date(date).toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" }) : "";
  const excerpt = (item.excerpt || item.content || "").replace(/<[^>]*>/g, "").slice(0, 150);
  const linkHref = item.slug ? `${href.replace(/\/$/, "")}/${item.slug}` : href;

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-stone-200/90 bg-[#fffcf7] shadow-sm transition-all duration-300 hover:border-accent-200/60 hover:shadow-md">
      <Link href={linkHref} className="block flex-1">
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-t-2xl">
          <Image
            src={imageUrl}
            alt={item.title}
            fill
            unoptimized={preferUnoptimizedImage(imageUrl)}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
        <div className="flex flex-1 flex-col p-6">
          {dateStr && (
            <p className="text-sm text-slate-500">{dateStr}</p>
          )}
          <h2 className="mt-2 font-serif text-xl font-bold text-slate-900 line-clamp-2 group-hover:text-accent-600">
            {item.title}
          </h2>
          {excerpt && (
            <p className="mt-3 line-clamp-3 text-slate-600">
              {excerpt}
              {excerpt.length >= 150 ? "..." : ""}
            </p>
          )}
          <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-accent-600 transition-colors group-hover:text-accent-700">
            Read More
            <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </Link>
    </article>
  );
}
