"use client";

import Image from "next/image";
import Link from "next/link";
import { workContent } from "@/data/content";
import { placeholderImages } from "@/data/images";

const items = [
  { ...workContent.programs, href: "/our-work/programs", image: placeholderImages.programs },
  { ...workContent.projects, href: "/our-work/projects", image: placeholderImages.projects },
  { ...workContent.advisory, href: "/our-work/advisory", image: placeholderImages.advisory },
];

export function HeroFeaturesOverlap() {
  return (
    <section className="relative z-[11] -mt-[60px] border-0 pt-0 max-lg:mt-0">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <p className="mb-4 text-center text-sm text-stone-600 max-lg:hidden lg:mb-2 lg:text-left">
          Three ways we show up alongside partners
        </p>
        <div className="grid auto-rows-fr gap-5 md:grid-cols-3 md:gap-6">
          {items.map((item, i) => (
            <Link
              key={item.title}
              href={item.href}
              className={`group flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-stone-200/90 bg-[#fffcf7] shadow-sm transition hover:border-accent-200/60 hover:shadow-md ${
                i === 1 ? "md:-translate-y-1" : ""
              }`}
            >
              <div className="relative aspect-[16/10] w-full shrink-0 bg-stone-200/90">
                <Image
                  src={item.image}
                  alt=""
                  fill
                  className="object-cover transition duration-300 group-hover:scale-[1.02]"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  aria-hidden
                />
              </div>

              <div className="flex flex-1 flex-col p-7 md:p-8">
                <h2 className="font-serif text-xl font-semibold leading-snug tracking-tight text-stone-900">
                  {item.title}
                </h2>
                <p className="mt-3 flex-1 text-[15px] leading-relaxed text-stone-600">{item.description}</p>
                <span className="mt-6 inline-block text-sm font-medium text-accent-700 group-hover:underline">
                  Read more
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
