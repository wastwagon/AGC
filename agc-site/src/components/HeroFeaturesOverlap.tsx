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
 * Sits below the hero (no negative margin) so the intro pill and cards don’t collide with hero copy.
 */
export function HeroFeaturesOverlap({ intro, readMoreLabel = "", cards }: Props) {
  if (cards.length === 0) return null;

  return (
    <section className="relative border-0 bg-[#fffcf7] pt-10 sm:pt-12 lg:pt-12 pb-8 sm:pb-10 lg:pb-12 ">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {intro.trim() ? (
          <div className="mb-8 flex justify-center sm:mb-10 lg:mb-12 lg:justify-start">
            {/*
              Solid fill + no backdrop-blur: avoids dark rectangular “blur layer” artifacts over the hero.
              w-fit keeps the pill hugging the copy; shadow stays soft and rounded.
            */}
            <p className="max-w-xl w-fit text-balance rounded-2xl border border-stone-200/90 bg-[#fffcf7] px-5 py-3 text-center text-base font-semibold leading-snug text-stone-900 shadow-[0_10px_40px_-12px_rgba(28,25,23,0.18)] sm:px-6 sm:py-3.5 sm:text-lg lg:text-left">
              {intro}
            </p>
          </div>
        ) : null}
        <div
          className={`grid auto-rows-fr gap-5 md:grid-cols-3 md:gap-6 ${intro.trim() ? "mt-2 sm:mt-3" : ""}`}
        >
          {cards.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="group flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-stone-200/90 bg-[#fffcf7] shadow-sm transition hover:border-accent-200/60 hover:shadow-md"
            >
              <div className="relative aspect-[16/10] w-full shrink-0 bg-sky-100/90">
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
                ) : (
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-sky-800/35">
                    Image placeholder
                  </span>
                )}
              </div>

              <div className="flex flex-1 flex-col p-7 md:p-8">
                <h2 className="font-sans text-xl font-semibold leading-snug tracking-tight text-stone-900">{item.title}</h2>
                <p className="mt-3 flex-1 text-[15px] leading-relaxed text-stone-600">{item.description}</p>
                {readMoreLabel.trim() ? (
                  <span className="mt-auto pt-6 text-sm font-medium text-accent-800 underline underline-offset-2 group-hover:text-accent-900">
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
