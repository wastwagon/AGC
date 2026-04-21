import Image from "next/image";
import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";
import { placeholderImages } from "@/data/images";
import type { CmsPublication } from "@/lib/content";
import { preferUnoptimizedImage } from "@/lib/image-delivery";
import { labelForPublicationTypeSlug } from "@/lib/site-taxonomy";
import type { TaxonomyOption } from "@/data/taxonomy-defaults";

type PublicationCardProps = {
  item: CmsPublication;
  imageUrl?: string;
  href?: string;
  /** From `getSiteTaxonomy().publicationTypes` for badge labels */
  publicationTypes?: TaxonomyOption[];
  /**
   * `listing` = news index style (square image, date line, title).
   * `related` = detail page grid (image + title).
   */
  variant?: "default" | "listing" | "related";
};

export function PublicationCard({
  item,
  imageUrl = placeholderImages.publications,
  href = "/publications",
  publicationTypes = [],
  variant = "default",
}: PublicationCardProps) {
  const date = item.date_published || item.date_created;
  const dateStr = date ? new Date(date).toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" }) : "";
  const excerpt = (item.excerpt || "").replace(/<[^>]*>/g, "").slice(0, 120);
  const linkHref = item.slug ? `${href.replace(/\/$/, "")}/${item.slug}` : href;

  const slugs =
    item.types?.length ? item.types : item.type ? [item.type] : [];
  const typeLabel =
    slugs.length > 0
      ? slugs.map((s) => labelForPublicationTypeSlug(s, publicationTypes)).join(" · ")
      : "Publication";

  function formatDateListing(iso: string | undefined): string {
    if (!iso) return "";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    return d
      .toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
      .toUpperCase();
  }

  if (variant === "listing") {
    const dateListing = formatDateListing(date);
    return (
      <article className="group flex flex-col">
        <Link href={linkHref} className="flex flex-col">
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-none bg-stone-100 ring-1 ring-stone-200/80">
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

  if (variant === "related") {
    return (
      <article className="group flex flex-col">
        <Link href={linkHref} className="flex flex-col">
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-none bg-stone-100 ring-1 ring-stone-200/80">
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

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-stone-200/90 bg-[#fffcf7] shadow-sm transition-all duration-300 hover:border-accent-200/60 hover:shadow-md">
      <Link href={linkHref} className="block flex-1">
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-t-2xl">
          <Image
            src={imageUrl}
            alt={item.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
        <div className="flex flex-1 flex-col p-6">
          <span className="mb-2 inline-block rounded-full bg-accent-100 px-2.5 py-0.5 text-xs font-medium text-accent-700">
            {typeLabel}
          </span>
          {dateStr && <p className="text-sm text-slate-500">{dateStr}</p>}
          <h2 className="mt-2 font-sans text-xl font-bold text-slate-900 line-clamp-2 group-hover:text-accent-600">
            {item.title}
          </h2>
          {excerpt && (
            <p className="mt-3 line-clamp-3 text-slate-600">
              {excerpt}
              {excerpt.length >= 120 ? "..." : ""}
            </p>
          )}
          <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-accent-600 transition-colors group-hover:text-accent-700">
            {item.file ? (
              <>
                <FileText className="h-4 w-4" />
                View / Download
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
