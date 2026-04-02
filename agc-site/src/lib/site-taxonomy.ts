import { prisma } from "@/lib/db";
import {
  defaultNewsCategoryOptions,
  defaultNewsTagOptions,
  defaultPublicationTypeOptions,
  type TaxonomyOption,
} from "@/data/taxonomy-defaults";

export const SITE_TAXONOMY_SLUG = "site-taxonomy";

export type SiteTaxonomyJson = {
  newsCategories: TaxonomyOption[];
  publicationTypes: TaxonomyOption[];
  newsTags: TaxonomyOption[];
};

function normalizeOptions(raw: unknown): TaxonomyOption[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((row) => {
      if (!row || typeof row !== "object") return null;
      const o = row as Record<string, unknown>;
      const slug = typeof o.slug === "string" ? o.slug.trim().toLowerCase().replace(/\s+/g, "-") : "";
      const label = typeof o.label === "string" ? o.label.trim() : "";
      const description = typeof o.description === "string" ? o.description.trim() : undefined;
      if (!slug || !label) return null;
      return { slug, label, ...(description ? { description } : {}) } satisfies TaxonomyOption;
    })
    .filter((x): x is TaxonomyOption => x !== null);
}

/** News categories, publication types, and news tags from DB, or code defaults. */
export async function getSiteTaxonomy(): Promise<SiteTaxonomyJson> {
  try {
    const row = await prisma.pageContent.findUnique({
      where: { slug: SITE_TAXONOMY_SLUG },
      select: { contentJson: true },
    });
    const json = row?.contentJson as Record<string, unknown> | null;
    if (!json) {
      return {
        newsCategories: defaultNewsCategoryOptions,
        publicationTypes: defaultPublicationTypeOptions,
        newsTags: defaultNewsTagOptions,
      };
    }
    const newsCategories = normalizeOptions(json.newsCategories);
    const publicationTypes = normalizeOptions(json.publicationTypes);
    const newsTags = normalizeOptions(json.newsTags);
    return {
      newsCategories: newsCategories.length ? newsCategories : defaultNewsCategoryOptions,
      publicationTypes: publicationTypes.length ? publicationTypes : defaultPublicationTypeOptions,
      newsTags: newsTags.length ? newsTags : defaultNewsTagOptions,
    };
  } catch {
    return {
      newsCategories: defaultNewsCategoryOptions,
      publicationTypes: defaultPublicationTypeOptions,
      newsTags: defaultNewsTagOptions,
    };
  }
}

export function getDefaultSiteTaxonomyJson(): SiteTaxonomyJson {
  return {
    newsCategories: defaultNewsCategoryOptions,
    publicationTypes: defaultPublicationTypeOptions,
    newsTags: defaultNewsTagOptions,
  };
}

export function labelForPublicationTypeSlug(slug: string, types: TaxonomyOption[]): string {
  return types.find((t) => t.slug === slug)?.label ?? slug.replace(/_/g, " ");
}

export function labelForNewsCategorySlug(slug: string, categories: TaxonomyOption[]): string {
  return categories.find((c) => c.slug === slug)?.label ?? slug;
}

/** One line per option: `slug | label` or `slug | label | description` */
export function parseTaxonomyLines(text: string): TaxonomyOption[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const parts = line.split("|").map((p) => p.trim());
      if (parts.length < 2) return null;
      const rawSlug = parts[0];
      const label = parts[1];
      const description = parts[2] || undefined;
      const slug = rawSlug
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      if (!slug || !label) return null;
      return { slug, label, ...(description ? { description } : {}) } satisfies TaxonomyOption;
    })
    .filter((x): x is TaxonomyOption => x !== null);
}

export function formatTaxonomyLines(items: TaxonomyOption[]): string {
  return items.map((i) => (i.description ? `${i.slug} | ${i.label} | ${i.description}` : `${i.slug} | ${i.label}`)).join("\n");
}
