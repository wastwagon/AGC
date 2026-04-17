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
          {/* Stronger on the left where type sits; lighter toward the right so the photo reads. */}
          <div className="absolute inset-0 bg-gradient-to-r from-accent-700/72 via-accent-600/48 to-accent-600/12" />
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
              className="absolute inset-0 bg-gradient-to-r from-accent-700/72 via-accent-600/48 to-accent-600/12"
              aria-hidden
            />
          </div>
        ))
      )}

      {/* Main copy — left column, top-aligned */}
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col justify-start px-4 pb-10 pt-20 sm:px-6 sm:pb-12 sm:pt-24 lg:px-8 lg:pb-14 lg:pt-28">
        <div className="max-w-2xl lg:max-w-[34rem] [text-shadow:0_1px_2px_rgba(0,0,0,0.22),0_3px_20px_rgba(0,0,0,0.28)]">
          {heroContent.eyebrow?.trim() ? (
            <p className="mb-5 max-w-xl text-[0.6875rem] font-semibold uppercase leading-relaxed tracking-[0.14em] text-white/90 sm:text-xs">
              {heroContent.eyebrow}
            </p>
          ) : null}
          <h1 className="text-balance font-serif text-3xl font-semibold leading-[1.12] tracking-tight text-white sm:text-4xl sm:leading-[1.1] lg:text-[2.35rem] lg:leading-[1.08] xl:text-[2.65rem] xl:leading-[1.06]">
            {heroContent.title}
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-base font-normal leading-[1.72] text-white/95 sm:text-lg sm:leading-[1.7] lg:mt-7 lg:text-xl lg:leading-[1.68]">
            {heroContent.subtitle}
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center lg:mt-12">
            <Link
              href={heroContent.ctaHref}
              className="inline-flex min-h-[48px] min-w-[44px] items-center justify-center rounded-xl bg-white px-8 py-3.5 text-[0.9375rem] font-semibold text-accent-900 shadow-md ring-1 ring-white/20 transition hover:bg-[#fffcf7] hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {heroContent.cta}
            </Link>
            <Link
              href={heroContent.ctaSecondaryHref}
              className="inline-flex min-h-[48px] min-w-[44px] items-center justify-center rounded-xl border-2 border-white/70 bg-white/12 px-8 py-3.5 text-[0.9375rem] font-semibold text-white shadow-sm backdrop-blur-sm transition hover:border-white hover:bg-white/22 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
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
