import type { ReactNode } from "react";

/**
 * Sticky primary actions on small screens (thumb reach, safe-area).
 * Parent card should use horizontal padding e.g. `p-4 sm:p-8` so negative margins align.
 */
export function AdminFormStickyActions({ children }: { children: ReactNode }) {
  return (
    <div className="sticky bottom-0 z-10 -mx-4 mt-8 flex flex-wrap gap-3 border-t border-border bg-white/95 px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_-12px_rgba(15,23,42,0.12)] backdrop-blur-md supports-[backdrop-filter]:bg-white/90 sm:-mx-8 sm:px-8 md:static md:z-0 md:mx-0 md:mt-6 md:border-0 md:bg-transparent md:p-0 md:pb-0 md:shadow-none md:backdrop-blur-none">
      {children}
    </div>
  );
}
