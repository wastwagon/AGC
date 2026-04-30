"use client";

import Image from "next/image";
import { ImageIcon } from "lucide-react";
import type { WorkAreaCard } from "@/lib/our-work-cards";
import { preferUnoptimizedImage } from "@/lib/image-delivery";

type Props = {
  cards: WorkAreaCard[];
  /** Shown when there are no cards */
  emptyMessage?: string;
};

export function WorkAreaCardGrid({
  cards,
  emptyMessage = "Nothing listed here yet—check back soon.",
}: Props) {
  if (cards.length === 0) {
    return (
      <div className="rounded-none border border-dashed border-border bg-white py-14 text-center">
        <p className="text-black">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => {
        const imageSrc = card.imageUrl?.trim() ?? "";
        const hasImage = imageSrc.length > 0;
        return (
          <article
            key={card.key}
            className="group flex flex-col overflow-hidden rounded-none border-0 bg-white shadow-md transition-shadow duration-300 hover:shadow-lg"
          >
            <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-[#f1f4f9]">
              {hasImage ? (
                <Image
                  src={imageSrc}
                  alt={card.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  unoptimized={preferUnoptimizedImage(imageSrc)}
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <ImageIcon className="h-12 w-12 text-slate-300" strokeWidth={1.25} aria-hidden />
                </div>
              )}
            </div>
            <div className="flex flex-1 flex-col p-6 sm:p-7">
              <h3 className="font-serif text-lg font-semibold leading-snug text-black">{card.title}</h3>
              <p className="page-prose-tight mt-3 flex-1 text-sm font-medium text-black">{card.description}</p>
            </div>
          </article>
        );
      })}
    </div>
  );
}
