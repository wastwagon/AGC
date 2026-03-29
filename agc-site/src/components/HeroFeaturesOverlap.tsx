"use client";

import Image from "next/image";
import Link from "next/link";
import { preferUnoptimizedImage } from "@/lib/image-delivery";

export type HomePillarCard = {
  title: string;
  description: string;
  href: string;
  image?: string;
};

type Props = {
  intro: string;
  /** Link suffix on each pillar card; set under Admin → Page Content → our-work */
  readMoreLabel?: string;
  cards: HomePillarCard[];
};

/**
 * Three “our work” pillars on the homepage — copy and image refs come from CMS (`our-work` page content).
 */
export function HeroFeaturesOverlap({ intro, readMoreLabel = "", cards }: Props) {
  if (cards.length === 0) return null;

  return (
    <section className="relative z-[11] -mt-[60px] border-0 pt-0 max-lg:mt-0">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {intro.trim() ? (
          <p className="mb-4 text-center text-sm text-stone-600 max-lg:hidden lg:mb-2 lg:text-left">{intro}</p>
        ) : null}
        <div className="grid auto-rows-fr gap-5 md:grid-cols-3 md:gap-6">
          {cards.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-stone-200/90 bg-[#fffcf7] shadow-sm transition hover:border-accent-200/60 hover:shadow-md ${
                i === 1 ? "md:-translate-y-1" : ""
              }`}
            >
              <div className="relative aspect-[16/10] w-full shrink-0 bg-stone-200/90">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    className="object-cover transition duration-300 group-hover:scale-[1.02]"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    unoptimized={preferUnoptimizedImage(item.image)}
                    aria-hidden
                  />
                ) : null}
              </div>

              <div className="flex flex-1 flex-col p-7 md:p-8">
                <h2 className="font-serif text-xl font-semibold leading-snug tracking-tight text-stone-900">{item.title}</h2>
                <p className="mt-3 flex-1 text-[15px] leading-relaxed text-stone-600">{item.description}</p>
                {readMoreLabel.trim() ? (
                  <span className="mt-6 inline-block text-sm font-medium text-accent-700 group-hover:underline">
                    {readMoreLabel}
                  </span>
                ) : null}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
