'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { placeholderImages } from '@/data/images';

type Program = {
  id?: number;
  title: string;
  description: string;
  backgroundImage?: string;
};

type ProgramsCarouselProps = {
  programs: Program[];
};

export function ProgramsCarousel({ programs }: ProgramsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!programs || programs.length === 0) {
    return (
      <div className="relative w-full overflow-hidden rounded-none bg-slate-100 p-8 text-center">
        <p className="text-slate-600">No items to display.</p>
      </div>
    );
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? programs.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === programs.length - 1 ? 0 : prev + 1));
  };

  const current = programs[currentIndex];
  const bgImage = current.backgroundImage || placeholderImages.hero;

  return (
    <div className="relative w-full overflow-hidden rounded-none">
      {/* Background with gradient overlay */}
      <div
        className="relative aspect-video w-full bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(8,13,20,0.1) 0%, rgba(6,10,16,0.62) 58%, rgba(0,0,0,0.86) 100%), url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/10" aria-hidden />

        {/* Content */}
        <div className="relative z-10 flex h-full flex-col justify-between p-8 sm:p-12 lg:p-16">
          <div />

          {/* Text content - centered vertically */}
          <div className="flex flex-1 flex-col justify-center">
            <h2 className="max-w-[30ch] font-serif text-[2rem] font-semibold leading-[1.1] text-white sm:text-[2.5rem] lg:text-[3rem]">
              {current.title}
            </h2>
            <p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-white/95 sm:text-xl">
              {current.description}
            </p>
          </div>

          {/* Navigation - bottom area */}
          <div className="flex items-end justify-between pt-8">
            {/* Left/Right arrows */}
            <div className="flex gap-4">
              <button
                onClick={goToPrevious}
                aria-label="Previous program"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-white/40 text-white transition-all hover:border-white hover:bg-white/10"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={goToNext}
                aria-label="Next program"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-white/40 text-white transition-all hover:border-white hover:bg-white/10"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            {/* Counter badge */}
            <div className="flex h-10 items-center justify-center rounded-full border border-white/40 px-4 text-sm font-medium text-white">
              {currentIndex + 1}/{programs.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
