/**
 * News filtering and taxonomy helpers - WordPress-style management
 */
import type { CmsNews } from "./content";
import {
  defaultNewsCategoryOptions,
  defaultNewsTagOptions,
  type TaxonomyOption,
} from "@/data/taxonomy-defaults";

/** Resolve taxonomy item to slug */
function toSlug(item: string | { slug: string; name?: string }): string {
  return typeof item === "string" ? item : item.slug;
}

/** Get category label by slug (pass taxonomy from `getSiteTaxonomy()` when available) */
export function getCategoryLabel(slug: string, categories: TaxonomyOption[] = defaultNewsCategoryOptions): string {
  return categories.find((c) => c.slug === slug)?.label ?? slug;
}

/** Get tag label by slug (pass `getSiteTaxonomy().newsTags` when available) */
export function getTagLabel(slug: string, tags: TaxonomyOption[] = defaultNewsTagOptions): string {
  return tags.find((t) => t.slug === slug)?.label ?? slug;
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
export function getActiveCategorySlugs(
  items: CmsNews[],
  categories: TaxonomyOption[] = defaultNewsCategoryOptions
): string[] {
  const slugs = new Set<string>();
  items.forEach((item) => getNewsCategorySlugs(item).forEach((s) => slugs.add(s)));
  return categories.filter((c) => slugs.has(c.slug)).map((c) => c.slug);
}

/** Get all tag slugs that have at least one news item (order follows taxonomy) */
export function getActiveTagSlugs(
  items: CmsNews[],
  tags: TaxonomyOption[] = defaultNewsTagOptions
): string[] {
  const slugs = new Set<string>();
  items.forEach((item) => getNewsTagSlugs(item).forEach((s) => slugs.add(s)));
  return tags.filter((t) => slugs.has(t.slug)).map((t) => t.slug);
}
