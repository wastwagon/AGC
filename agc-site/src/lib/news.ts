/**
 * News filtering and taxonomy helpers - WordPress-style management
 */
import type { CmsNews } from "./content";
import { newsCategories, newsTags } from "@/data/content";

/** Resolve taxonomy item to slug */
function toSlug(item: string | { slug: string; name?: string }): string {
  return typeof item === "string" ? item : item.slug;
}

/** Get category label by slug */
export function getCategoryLabel(slug: string): string {
  return newsCategories.find((c) => c.slug === slug)?.label ?? slug;
}

/** Get tag label by slug */
export function getTagLabel(slug: string): string {
  return newsTags.find((t) => t.slug === slug)?.label ?? slug;
}

/** Extract category slugs from a news item */
export function getNewsCategorySlugs(item: CmsNews): string[] {
  const cats = (item as { categories?: (string | { slug: string })[] }).categories;
  if (!cats?.length) return [];
  return cats.map(toSlug);
}

/** Extract tag slugs from a news item */
export function getNewsTagSlugs(item: CmsNews): string[] {
  const tags = (item as { tags?: (string | { slug: string })[] }).tags;
  if (!tags?.length) return [];
  return tags.map(toSlug);
}

/** Filter news by category slug */
export function filterNewsByCategory(items: CmsNews[], categorySlug: string): CmsNews[] {
  if (!categorySlug) return items;
  return items.filter((item) => getNewsCategorySlugs(item).includes(categorySlug));
}

/** Filter news by tag slug */
export function filterNewsByTag(items: CmsNews[], tagSlug: string): CmsNews[] {
  if (!tagSlug) return items;
  return items.filter((item) => getNewsTagSlugs(item).includes(tagSlug));
}

/** Get all category slugs that have at least one news item */
export function getActiveCategorySlugs(items: CmsNews[]): string[] {
  const slugs = new Set<string>();
  items.forEach((item) => getNewsCategorySlugs(item).forEach((s) => slugs.add(s)));
  return newsCategories.filter((c) => slugs.has(c.slug)).map((c) => c.slug);
}

/** Get all tag slugs that have at least one news item */
export function getActiveTagSlugs(items: CmsNews[]): string[] {
  const slugs = new Set<string>();
  items.forEach((item) => getNewsTagSlugs(item).forEach((s) => slugs.add(s)));
  return newsTags.filter((t) => slugs.has(t.slug)).map((t) => t.slug);
}
