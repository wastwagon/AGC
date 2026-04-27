"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { preferUnoptimizedImage } from "@/lib/image-delivery";
import { cn } from "@/lib/utils";

export type HomePillarCard = {
  title: string;
  /** Optional; kept for CMS payloads — not shown in the accordion UI. */
  description?: string;
  href: string;
  image?: string;
};

type Props = {
  /** Link label under each title (e.g. “Read more”) — from Admin → Page Content → our-work */
  readMoreLabel?: string;
  cards: HomePillarCard[];
};

const READ_MORE_FALLBACK = "Read more";

function chunkCards<T>(items: T[], chunkSize: number): T[][] {
  const rows: T[][] = [];
  for (let i = 0; i < items.length; i += chunkSize) {
    rows.push(items.slice(i, i + chunkSize));
  }
  return rows;
}

/**
 * Homepage work pillars — **up to three cards per row**. Each row uses a horizontal flex strip where the
 * hovered/focused card grows (Brookings-style); image on top, serif title, “Read more” reveals on hover (md+).
 * Touch: press feedback + image nudge without requiring hover.
 */
export function HeroFeaturesOverlap({ readMoreLabel = "", cards }: Props) {
  if (cards.length === 0) return null;

  const cta = readMoreLabel.trim() || READ_MORE_FALLBACK;
  const rows = chunkCards(cards, 3);

  return (
    <section className="relative border-0 bg-[#ffffff] pb-12 pt-12 sm:pb-14 sm:pt-14 lg:pb-16 lg:pt-16">
      <div className="container mx-auto max-w-7xl bg-[#ffffff] px-2 sm:px-4 lg:px-5">
        <div className="bg-[#ffffff] py-1 sm:py-1.5 md:py-2">
          <div className="flex flex-col gap-12 sm:gap-14 lg:gap-16">
            {rows.map((row, rowIndex) => (
              <div
                key={rowIndex}
                className="flex flex-col gap-4 sm:gap-5 md:h-[min(48vh,480px)] md:flex-row md:gap-3 md:overflow-hidden lg:h-[min(50vh,520px)]"
              >
                {row.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-label={`${item.title} — ${cta}`}
                    className={cn(
                      "group/card relative flex min-h-[260px] flex-col overflow-hidden bg-[#ffffff] outline-none touch-manipulation",
                      "transition-[transform,box-shadow] duration-300 ease-out",
                      "active:scale-[0.99] active:brightness-[0.98] md:active:scale-100 md:active:brightness-100",
                      "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgb(65,130,163)]",
                      "md:min-h-0 md:min-w-[3.5rem] md:flex-[1_1_0%] md:transition-[flex-grow,flex-shrink,flex-basis,transform] md:duration-700 md:ease-[cubic-bezier(0.32,0.72,0,1)]",
                      "md:hover:flex-[2.7_1_0%] md:focus-visible:flex-[2.7_1_0%] md:hover:z-[1] md:focus-visible:z-[1]",
                      "md:hover:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.18)] md:focus-visible:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.18)]"
                    )}
                  >
                    <div
                      className={cn(
                        "relative min-h-[180px] flex-1 overflow-hidden sm:min-h-[200px] md:min-h-0",
                        item.image
                          ? "bg-white"
                          : "border border-stone-200 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
                      )}
                    >
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt=""
                          fill
                          className={cn(
                            "object-cover object-center transition duration-700 ease-out",
                            "motion-reduce:transition-none motion-reduce:duration-0",
                            "scale-100 group-hover/card:scale-[1.03] group-focus-visible/card:scale-[1.03]",
                            "group-active/card:scale-[1.04] md:group-active/card:scale-[1.03]"
                          )}
                          sizes="(max-width: 768px) 100vw, 34vw"
                          unoptimized={preferUnoptimizedImage(item.image)}
                          aria-hidden
                        />
                      ) : (
                        <span className="absolute inset-0 flex items-center justify-center px-4 text-sm font-medium text-stone-400">
                          Image placeholder
                        </span>
                      )}
                      <span
                        className="pointer-events-none absolute right-3 top-3 z-10 hidden h-10 w-10 items-center justify-center rounded-full bg-white text-stone-900 shadow-md ring-1 ring-stone-200/90 transition duration-500 md:flex md:translate-y-1 md:opacity-0 group-hover/card:translate-y-0 group-hover/card:opacity-100 group-focus-visible/card:translate-y-0 group-focus-visible/card:opacity-100 group-active/card:translate-y-0 group-active/card:opacity-100"
                        aria-hidden
                      >
                        <ArrowRight className="h-4 w-4" strokeWidth={2.25} aria-hidden />
                      </span>
                    </div>

                    <div className="shrink-0 bg-transparent pt-3">
                      <h2 className="font-serif text-[1.35rem] font-semibold leading-snug tracking-tight text-stone-950 sm:text-2xl md:text-[clamp(1.125rem,1.55vw,1.7rem)] md:leading-[1.2] lg:text-[clamp(1.2rem,1.35vw,1.85rem)]">
                        {item.title}
                      </h2>
                      <span className="mt-2 block overflow-hidden text-[0.8125rem] font-normal text-stone-700 underline decoration-stone-400 underline-offset-[4px] transition-[opacity,transform,max-height,colors] duration-500 ease-out max-md:max-h-16 max-md:translate-y-0 max-md:opacity-100 md:max-h-0 md:translate-y-1 md:opacity-0 md:group-hover/card:max-h-16 md:group-hover/card:translate-y-0 md:group-hover/card:opacity-100 md:group-hover/card:decoration-[rgb(65,130,163)] md:group-hover/card:text-[rgb(45,105,135)] md:group-focus-visible/card:max-h-16 md:group-focus-visible/card:translate-y-0 md:group-focus-visible/card:opacity-100 md:group-focus-visible/card:decoration-[rgb(65,130,163)] md:group-focus-visible/card:text-[rgb(45,105,135)]">
                        {cta}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
