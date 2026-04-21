"use client";

import type { HomePageCms } from "@/lib/home-page-data";
import { HOME_HERO_DISPLAY_TAGLINE, HOME_HERO_DISPLAY_TITLE } from "@/data/content";
import gsap from "gsap";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useCallback, useLayoutEffect, useRef, useSyncExternalStore } from "react";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribePrefersReducedMotion(onStoreChange: () => void) {
  const mq = window.matchMedia(REDUCED_MOTION_QUERY);
  mq.addEventListener("change", onStoreChange);
  return () => mq.removeEventListener("change", onStoreChange);
}

function getPrefersReducedMotionSnapshot() {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

function getPrefersReducedMotionServerSnapshot() {
  return false;
}

/** Home hero: headline + tagline only; slider/video from CMS. */
type HeroProps = {
  /** Retained for callers; copy is fixed in `content.ts` (`HOME_HERO_DISPLAY_*`). */
  hero?: HomePageCms["heroContent"];
  /** Hero carousel image URLs. From CMS when set; otherwise pass default from page. */
  sliderImages: string[];
  /**
   * Looped MP4 from /public (e.g. `/media/hero-video-background.mp4`).
   * When set and motion is allowed, used instead of the image carousel.
   */
  backgroundVideoSrc?: string;
};

/** Readable white type over photos — subtle black only (no brand tint). */
function HeroImageScrim() {
  return (
    <div
      className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/38 to-black/28"
      aria-hidden
    />
  );
}

export function HeroConsultar({ hero: _hero, sliderImages, backgroundVideoSrc }: HeroProps) {
  void _hero; // prop kept so `page.tsx` can pass CMS draft without refactors
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [current, setCurrent] = useState(0);
  const reducedMotion = useSyncExternalStore(
    subscribePrefersReducedMotion,
    getPrefersReducedMotionSnapshot,
    getPrefersReducedMotionServerSnapshot
  );
  const slides = sliderImages.filter((s) => typeof s === "string" && s.length > 0);
  const useVideoBackground =
    Boolean(backgroundVideoSrc?.trim()) && !reducedMotion;

  const next = useCallback(() => {
    if (slides.length <= 1) return;
    setCurrent((c) => (c + 1) % slides.length);
  }, [slides.length]);

  const prev = useCallback(() => {
    if (slides.length <= 1) return;
    setCurrent((c) => (c - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (reducedMotion || slides.length <= 1 || useVideoBackground) return;
    const id = setInterval(next, 6000);
    return () => clearInterval(id);
  }, [next, reducedMotion, slides.length, useVideoBackground]);

  useLayoutEffect(() => {
    const eyebrow = eyebrowRef.current;
    const title = titleRef.current;
    if (!eyebrow || !title) return;

    if (reducedMotion) {
      gsap.set([eyebrow, title], { autoAlpha: 1, y: 0, clearProps: "transform" });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(eyebrow, { autoAlpha: 0, y: 20 });
      gsap.set(title, { autoAlpha: 0, y: 36 });

      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      tl.to(eyebrow, { autoAlpha: 1, y: 0, duration: 1.05 });
      tl.to(title, { autoAlpha: 1, y: 0, duration: 1.35 }, "+=0.32");
    });

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section className="group relative flex min-h-[min(64vh,480px)] w-full flex-col overflow-hidden sm:min-h-[min(68vh,520px)] lg:min-h-[min(72vh,560px)] xl:min-h-[min(84vh,620px)]">
      {/* Video (preferred when configured), else CMS slides, else dark neutral fallback */}
      {useVideoBackground && backgroundVideoSrc ? (
        <div className="absolute inset-0 z-0" aria-hidden>
          <video
            className="h-full w-full object-cover object-center"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          >
            <source src={backgroundVideoSrc} type="video/mp4" />
          </video>
          <HeroImageScrim />
        </div>
      ) : slides.length === 0 ? (
        <div className="absolute inset-0 z-0 bg-slate-950" aria-hidden>
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-black" />
          <HeroImageScrim />
        </div>
      ) : (
        slides.map((src, i) => (
          <div
            key={src + i}
            className="absolute inset-0 transition-opacity duration-1000 motion-reduce:transition-none"
            style={{
              opacity: i === current ? 1 : 0,
              zIndex: i === current ? 1 : 0,
            }}
          >
            <div
              className="h-full w-full bg-cover bg-center"
              style={{ backgroundImage: `url(${src})` }}
              aria-hidden
            />
            <HeroImageScrim />
          </div>
        ))
      )}

      {/* Main copy — TBI-style: small caps sans eyebrow + large serif headline */}
      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center px-4 py-24 text-center sm:px-6 sm:py-28 lg:px-8 lg:py-32 xl:py-36">
        <div className="max-w-4xl [text-shadow:0_2px_24px_rgba(0,0,0,0.45)]">
          <p
            ref={eyebrowRef}
            className="mb-3 font-sans text-[0.6875rem] font-bold uppercase leading-normal tracking-[0.22em] text-white sm:mb-4 sm:text-xs sm:tracking-[0.24em]"
          >
            {HOME_HERO_DISPLAY_TITLE}
          </p>
          <h1
            ref={titleRef}
            className="text-balance font-serif text-[clamp(2.125rem,5.5vw,4rem)] font-semibold leading-[1.1] tracking-tight text-white sm:leading-[1.08] lg:text-[clamp(2.625rem,5vw,4.75rem)] lg:leading-[1.06] xl:text-[clamp(2.875rem,4.75vw,5.25rem)]"
          >
            {HOME_HERO_DISPLAY_TAGLINE}
          </h1>
          {!useVideoBackground && slides.length > 1 && (
            <div className="mt-6 flex justify-center gap-1.5 sm:mt-8" role="tablist" aria-label="Hero slides">
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={i === current}
                  aria-label={`Slide ${i + 1}`}
                  onClick={() => setCurrent(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    i === current ? "w-8 bg-white" : "w-1.5 bg-white/40 hover:bg-white/60"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {!useVideoBackground && slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            className="absolute left-2 top-1/3 z-20 -translate-y-1/2 rounded-full border border-white/20 bg-black/20 p-2.5 text-white backdrop-blur-sm transition hover:bg-black/40 sm:left-4 lg:top-[42%]"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={next}
            className="absolute right-2 top-1/3 z-20 -translate-y-1/2 rounded-full border border-white/20 bg-black/20 p-2.5 text-white backdrop-blur-sm transition hover:bg-black/40 sm:right-4 lg:top-[42%]"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

    </section>
  );
}
