import Image from "next/image";
import Link from "next/link";
import type { HomePageCms } from "@/lib/home-page-data";
import { preferUnoptimizedImage } from "@/lib/image-delivery";

export function HomeSpotlightStory({
  story,
  portraitSrc,
}: {
  story: HomePageCms["homeSpotlightStory"];
  /** Resolved URL (e.g. after `resolveImageUrl` for media ids). */
  portraitSrc: string;
}) {
  const s = story;
  if (!s.headline?.trim()) return null;

  return (
    <section className="border-y border-stone-200/80 bg-white py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12 lg:items-start xl:gap-14">
          <div className="flex flex-col items-center gap-4 lg:col-span-5 lg:items-start">
            <div className="relative aspect-[4/5] w-full max-w-[min(100%,280px)] shrink-0 overflow-hidden shadow-md sm:max-w-[min(100%,320px)] lg:max-w-[min(100%,400px)]">
              <Image
                src={portraitSrc}
                alt={s.name?.trim() ? `Portrait: ${s.name}` : "Fellow spotlight portrait"}
                fill
                sizes="(max-width: 640px) 280px, (max-width: 1024px) 320px, 400px"
                className="object-cover object-center"
                unoptimized={preferUnoptimizedImage(portraitSrc)}
              />
            </div>
          </div>
          <div className="lg:col-span-7">
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
