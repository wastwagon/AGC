"use client";

import Link from "next/link";
import { BarChart3, Target, Users } from "lucide-react";
import { workContent } from "@/data/content";

const items = [
  { ...workContent.programs, href: "/our-work/programs", icon: BarChart3 },
  { ...workContent.projects, href: "/our-work/projects", icon: Target },
  { ...workContent.advisory, href: "/our-work/advisory", icon: Users },
];

export function HeroFeaturesOverlap() {
  return (
    <section className="relative z-[11] -mt-[60px] border-0 pt-0 max-lg:mt-0">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <p className="mb-4 text-center text-sm text-stone-600 max-lg:hidden lg:mb-2 lg:text-left">
          Three ways we show up alongside partners
        </p>
        <div className="grid gap-5 md:grid-cols-3 md:gap-6">
          {items.map((item, i) => (
            <Link
              key={item.title}
              href={item.href}
              className={`group rounded-2xl border border-stone-200/90 bg-[#fffcf7] p-7 shadow-sm transition hover:border-accent-200/60 hover:shadow-md md:p-8 ${
                i === 1 ? "md:-translate-y-1" : ""
              }`}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-100 text-accent-700 transition-colors group-hover:bg-accent-200/80">
                <item.icon className="h-7 w-7" strokeWidth={1.75} />
              </div>
              <h2 className="mt-5 font-serif text-xl font-semibold leading-snug tracking-tight text-stone-900">
                {item.title}
              </h2>
              <p className="mt-3 text-[15px] leading-relaxed text-stone-600">{item.description}</p>
              <span className="mt-5 inline-block text-sm font-medium text-accent-700 group-hover:underline">
                Read more
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
