"use client";

import Link from "next/link";
import type { HomePageCms } from "@/lib/home-page-data";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useCallback, useSyncExternalStore } from "react";

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

/**
 * Editorial home hero: headline hierarchy, dual CTAs.
 * Slider images from CMS (home.heroSliderImages) or default; auto-advances when reduced motion is off.
 */
type HeroProps = {
  hero?: HomePageCms["heroContent"];
  /** Hero carousel image URLs. From CMS when set; otherwise pass default from page. */
  sliderImages: string[];
  /**
   * Looped MP4 from /public (e.g. `/media/hero-video-background.mp4`).
   * When set and motion is allowed, used instead of the image carousel.
   */
  backgroundVideoSrc?: string;
};

const EMPTY_HERO: HomePageCms["heroContent"] = {
  eyebrow: "",
  title: "",
  subtitle: "",
  cta: "",
  ctaHref: "/",
  ctaSecondary: "",
  ctaSecondaryHref: "/",
};

export function HeroConsultar({ hero: heroProp, sliderImages, backgroundVideoSrc }: HeroProps) {
  const heroContent = heroProp ?? EMPTY_HERO;
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

  return (
    <section className="group relative flex min-h-[380px] w-full flex-col overflow-hidden sm:min-h-[440px] lg:min-h-[min(68vh,560px)]">
      {/* Video (preferred when configured), else CMS slides, else gradient */}
      {useVideoBackground && backgroundVideoSrc ? (
        <div className="absolute inset-0 z-0" aria-hidden>
          <video
            className="h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          >
            <source src={backgroundVideoSrc} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-br from-accent-700/60 via-accent-600/44 to-accent-700/58" />
        </div>
      ) : slides.length === 0 ? (
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-accent-700 to-accent-600" aria-hidden />
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
            <div
              className="absolute inset-0 bg-gradient-to-br from-accent-700/60 via-accent-600/44 to-accent-700/58"
              aria-hidden
            />
          </div>
        ))
      )}

      {/* Main copy — left column, top-aligned */}
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col justify-start px-4 pb-10 pt-20 sm:px-6 sm:pb-12 sm:pt-24 lg:px-8 lg:pb-14 lg:pt-24">
        <div className="max-w-2xl [text-shadow:0_1px_2px_rgba(0,0,0,0.18),0_2px_16px_rgba(0,0,0,0.26)]">
          <p className="mb-4 max-w-lg text-sm font-medium leading-snug text-accent-100 sm:text-base">
            {heroContent.eyebrow}
          </p>
          <h1 className="font-serif text-5xl font-semibold leading-[1.1] tracking-tight text-white sm:text-6xl lg:text-7xl xl:text-[4.25rem]">
            {heroContent.title}
          </h1>
          <p className="mt-6 max-w-xl text-base leading-[1.65] text-white/90 sm:text-lg lg:text-xl xl:text-2xl">
            {heroContent.subtitle}
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Link
              href={heroContent.ctaHref}
              className="inline-flex items-center justify-center rounded-xl bg-white px-8 py-3.5 text-base font-semibold text-accent-900 shadow-md transition hover:bg-accent-50"
            >
              {heroContent.cta}
            </Link>
            <Link
              href={heroContent.ctaSecondaryHref}
              className="inline-flex items-center justify-center rounded-xl border border-white/50 bg-white/10 px-8 py-3.5 text-base font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
            >
              {heroContent.ctaSecondary}
            </Link>
          </div>
          {!useVideoBackground && slides.length > 1 && (
            <div className="mt-10 flex gap-1.5" role="tablist" aria-label="Hero slides">
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
