"use client";

import { useRouter } from "next/navigation";
import { newsContent } from "@/data/content";
import type { TaxonomyOption } from "@/data/taxonomy-defaults";
import { ChevronDown, Filter } from "lucide-react";

type NewsFiltersProps = {
  /** Category definitions (from Admin → Taxonomy / site defaults) */
  categoryOptions: TaxonomyOption[];
  activeCategorySlugs: string[];
  /** Current category slug from URL (e.g. /news/category/appi) */
  currentCategory?: string;
};

export function NewsFilters({ categoryOptions, activeCategorySlugs, currentCategory }: NewsFiltersProps) {
  const router = useRouter();
  const filters = newsContent.filters;

  const categoriesToShow = categoryOptions.filter((c) => activeCategorySlugs.includes(c.slug));

  if (categoriesToShow.length === 0) return null;

  const options = [
    { value: "", label: filters.allCategories },
    ...categoriesToShow.map((c) => ({ value: c.slug, label: c.label })),
  ];

  const currentValue = currentCategory ?? "";

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value;
    router.push(value ? `/news/category/${value}` : "/news");
  }

  return (
    <div className="mb-10">
      <label
        htmlFor="news-category-filter"
        className="mb-2 block text-xs font-semibold uppercase tracking-wider text-black"
      >
        {filters.filterBy}
      </label>
      <div className="group relative w-full max-w-xs rounded-none bg-white shadow-sm transition-shadow hover:shadow-md focus-within:ring-2 focus-within:ring-accent-500/15 sm:max-w-none sm:w-auto">
        <Filter className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-accent-700/80" aria-hidden />
        <select
          id="news-category-filter"
          value={currentValue}
          onChange={handleChange}
          className="w-full min-w-0 cursor-pointer appearance-none rounded-none border-0 bg-transparent py-3.5 pl-11 pr-12 text-sm font-medium text-black transition-colors hover:text-accent-800 focus:outline-none sm:min-w-[240px] sm:w-auto"
          aria-label={filters.filterBy}
        >
          {options.map((opt) => (
            <option key={opt.value || "all"} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-black" aria-hidden />
      </div>
    </div>
  );
}
