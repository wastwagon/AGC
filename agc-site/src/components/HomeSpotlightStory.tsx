import Link from "next/link";
import type { HomePageCms } from "@/lib/home-page-data";

export function HomeSpotlightStory({ story }: { story: HomePageCms["homeSpotlightStory"] }) {
  const s = story;
  if (!s.headline?.trim()) return null;

  return (
    <section className="border-y border-stone-200/80 bg-[#fffcf7] py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14 lg:items-start">
          <div className="flex flex-col items-center gap-4 lg:col-span-4 lg:items-start">
            <div
              className="flex h-28 w-28 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-600 to-accent-800 font-sans text-3xl font-semibold text-white shadow-md sm:h-32 sm:w-32 sm:text-4xl"
              aria-hidden
            >
              {s.initials}
            </div>
          </div>
          <div className="lg:col-span-8">
            <p className="text-sm font-medium text-accent-800">{s.label}</p>
            <h2 className="mt-2 font-serif text-2xl font-semibold leading-snug tracking-tight text-stone-900 sm:text-3xl">
              {s.headline}
            </h2>
            <div className="mt-6 space-y-4 text-[17px] leading-relaxed text-stone-600">
              {s.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <div className="mt-8 border-t border-stone-200 pt-6">
              <p className="font-semibold text-stone-900">{s.name}</p>
              <p className="text-sm text-stone-600">{s.role}</p>
            </div>
            <Link
              href={s.ctaHref}
              className="mt-6 inline-flex text-sm font-semibold text-accent-700 underline decoration-accent-300 underline-offset-4 hover:text-accent-900"
            >
              {s.ctaLabel} →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
