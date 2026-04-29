import Image from "next/image";
import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";
import { normalizeNewsDownloads } from "@/lib/news-downloads";
import { placeholderImages } from "@/data/images";
import type { CmsNews } from "@/lib/content";
import { preferUnoptimizedImage } from "@/lib/image-delivery";
import { getNewsCategorySlugs } from "@/lib/news";

type NewsCardProps = {
  item: CmsNews;
  /** Pre-resolved image URL (from media library, CMS, or placeholder). If not provided, falls back to placeholder. */
  imageUrl?: string;
  /** Base path for links - e.g. /news for list, /news/[slug] for detail when available */
  href?: string;
  /** `homeTeaser` = homepage; `listing` = news index; `related` = detail page grid (image + title, square). */
  variant?: "default" | "homeTeaser" | "listing" | "related";
};

function formatNewsDateShort(iso: string | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function formatNewsDateListing(iso: string | undefined): string {
  const s = formatNewsDateShort(iso);
  return s ? s.toUpperCase() : "";
}

/**
 * News card: default = full card with excerpt + read more; `homeTeaser` = slim row for homepage (image, title, date).
 */
export function NewsCard({
  item,
  imageUrl = placeholderImages.news,
  href = "/news",
  variant = "default",
}: NewsCardProps) {
  const date = item.date_published || item.date_created;
  const dateStrLong = date ? new Date(date).toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" }) : "";
  const dateStrShort = formatNewsDateShort(date);
  const excerpt = (item.excerpt || item.content || "").replace(/<[^>]*>/g, "").slice(0, 150);
  const linkHref = item.slug ? `${href.replace(/\/$/, "")}/${item.slug}` : href;
  const hasDownloads = normalizeNewsDownloads(item).length > 0;

  if (variant === "homeTeaser") {
    const category = getNewsCategorySlugs(item)[0]?.replace(/-/g, " ").toUpperCase() || "NEWS";
    return (
      <article className="group flex flex-col bg-white">
        <Link href={linkHref} className="flex flex-col">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-none bg-stone-100">
            <Image
              src={imageUrl}
              alt={item.title}
              fill
              unoptimized={preferUnoptimizedImage(imageUrl)}
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>
          <div className="pt-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-black">{category}</p>
            <h2 className="mt-2 font-serif text-[2rem] font-semibold leading-[1.08] tracking-tight text-black">
              {item.title}
            </h2>
          </div>
          {dateStrShort ? (
            <p className="mt-3 text-[11px] font-medium uppercase tracking-[0.08em] text-black">{dateStrShort.toUpperCase()}</p>
          ) : null}
          {excerpt ? (
            <p className="mt-3 text-base font-medium leading-relaxed text-black">
              {excerpt}
              {excerpt.length >= 150 ? "..." : ""}
            </p>
          ) : null}
        </Link>
      </article>
    );
  }

  if (variant === "related") {
    return (
      <article className="group flex flex-col">
        <Link href={linkHref} className="flex flex-col">
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-none bg-stone-100 ring-1 ring-border/80">
            <Image
              src={imageUrl}
              alt={item.title}
              fill
              unoptimized={preferUnoptimizedImage(imageUrl)}
              className="object-cover transition-opacity duration-200 group-hover:opacity-95"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>
          <h2 className="mt-3 font-sans text-base font-semibold leading-snug text-accent-800 transition-colors group-hover:text-accent-950 sm:text-lg">
            {item.title}
          </h2>
        </Link>
      </article>
    );
  }

  if (variant === "listing") {
    const dateListing = formatNewsDateListing(date);
    return (
      <article className="group flex flex-col">
        <Link href={linkHref} className="flex flex-col">
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-none bg-stone-100 ring-1 ring-border/80">
            <Image
              src={imageUrl}
              alt={item.title}
              fill
              unoptimized={preferUnoptimizedImage(imageUrl)}
              className="object-cover transition-opacity duration-200 group-hover:opacity-95"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>
          {dateListing ? (
            <p className="mt-3 font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-accent-600">
              {dateListing}
            </p>
          ) : null}
          <h2 className="mt-2 font-sans text-lg font-semibold leading-snug text-accent-800 transition-colors group-hover:text-accent-950 sm:text-xl">
            {item.title}
          </h2>
        </Link>
      </article>
    );
  }

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border/90 bg-[#fffcf7] shadow-sm transition-all duration-300 hover:border-accent-200/60 hover:shadow-md">
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
          {dateStrLong && (
            <p className="text-sm font-medium text-accent-600">{dateStrLong}</p>
          )}
          <h2 className="mt-2 font-sans text-xl font-bold text-slate-900 line-clamp-2 group-hover:text-accent-600">
            {item.title}
          </h2>
          {excerpt && (
            <p className="mt-3 line-clamp-3 text-slate-600">
              {excerpt}
              {excerpt.length >= 150 ? "..." : ""}
            </p>
          )}
          <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-accent-600 transition-colors group-hover:text-accent-700">
            {hasDownloads ? (
              <>
                <FileText className="h-4 w-4 shrink-0" aria-hidden />
                Read more · Documents
              </>
            ) : (
              <>
                Read More
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </span>
        </div>
      </Link>
    </article>
  );
}
