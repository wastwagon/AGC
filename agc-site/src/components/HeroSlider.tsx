"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type HeroSliderProps = {
  images: string[];
  alt: string;
  children: React.ReactNode;
};

export function HeroSlider({ images, alt, children }: HeroSliderProps) {
  const [index, setIndex] = useState(0);
  const slides = images.filter(Boolean);
  const singleImage = slides.length <= 1;

  useEffect(() => {
    if (singleImage) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 6000);
    return () => clearInterval(id);
  }, [singleImage, slides.length]);

  if (slides.length === 0) return null;

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        {singleImage ? (
          <Image src={slides[0]} alt={alt} fill className="object-cover" priority sizes="100vw" />
        ) : (
          <>
            {slides.map((src, i) => (
              <div
                key={src}
                className={`absolute inset-0 transition-opacity duration-700 ${
                  i === index ? "opacity-100 z-0" : "opacity-0 z-[-1]"
                }`}
              >
                <Image src={src} alt={`${alt} ${i + 1}`} fill className="object-cover" sizes="100vw" />
              </div>
            ))}
          </>
        )}
        <div className="absolute inset-0 bg-slate-900/60" />
      </div>
      {children}
      {!singleImage && (
        <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              className={`h-2 w-2 rounded-full transition-colors ${
                i === index ? "bg-accent-400" : "bg-white/50 hover:bg-white/70"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
