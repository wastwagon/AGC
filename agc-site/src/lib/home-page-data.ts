import { prisma } from "@/lib/db";
import {
  heroContent,
  homeTestimonial,
  homeSpotlightStory,
  homeImpactStats,
  homeImpactMethodology,
  heroPartnerStrip,
} from "@/data/content";
import { heroSliderImages as defaultHeroSliderImages } from "@/data/images";

export type HomePageCms = {
  /** Hero carousel image URLs (from Media). When empty, fallback to env/default. */
  heroSliderImages: string[];
  heroContent: {
    eyebrow: string;
    title: string;
    subtitle: string;
    cta: string;
    ctaHref: string;
    ctaSecondary: string;
    ctaSecondaryHref: string;
  };
  homeTestimonial: {
    quote: string;
    name: string;
    title: string;
    organization: string;
    initials: string;
  };
  homeSpotlightStory: {
    label: string;
    headline: string;
    paragraphs: string[];
    name: string;
    role: string;
    initials: string;
    ctaLabel: string;
    ctaHref: string;
  };
  homeReach: { title: string; intro: string };
  homeImpactMethodology: string;
  homeImpactStats: { value: string; label: string; note: string }[];
  heroPartnerStrip: string[];
  /** Intro sentence beside partner list */
  homePartnerBlurb: string;
};

const DEFAULT_PARTNER_BLURB =
  "Our work is always collaborative—we don't arrive with ready-made answers.";

export function getDefaultHomePageCms(): HomePageCms {
  return {
    heroSliderImages: [...defaultHeroSliderImages],
    heroContent: {
      eyebrow: heroContent.eyebrow,
      title: heroContent.title,
      subtitle: heroContent.subtitle,
      cta: heroContent.cta,
      ctaHref: heroContent.ctaHref,
      ctaSecondary: heroContent.ctaSecondary,
      ctaSecondaryHref: heroContent.ctaSecondaryHref,
    },
    homeTestimonial: { ...homeTestimonial },
    homeSpotlightStory: {
      ...homeSpotlightStory,
      paragraphs: [...homeSpotlightStory.paragraphs],
    },
    homeReach: {
      title: "The shape of our work",
      intro:
        "We measure ourselves by relationships and depth as much as by scale. Here is a snapshot—always happy to share more in conversation.",
    },
    homeImpactMethodology,
    homeImpactStats: homeImpactStats.map((s) => ({ ...s })),
    heroPartnerStrip: [...heroPartnerStrip],
    homePartnerBlurb: DEFAULT_PARTNER_BLURB,
  };
}

function deepMergeHome(base: HomePageCms, patch: Record<string, unknown>): HomePageCms {
  const out: HomePageCms = structuredClone(base);
  for (const [key, pv] of Object.entries(patch)) {
    if (pv === undefined || pv === null) continue;
    if (key === "heroSliderImages" && Array.isArray(pv)) {
      out.heroSliderImages = pv.filter((u): u is string => typeof u === "string" && u.length > 0).slice(0, 10);
      continue;
    }
    if (key === "homeImpactStats" && Array.isArray(pv)) {
      const arr = pv as { value?: string; label?: string; note?: string }[];
      out.homeImpactStats = arr.map((s, i) => ({
        value: String(s?.value ?? out.homeImpactStats[i]?.value ?? ""),
        label: String(s?.label ?? out.homeImpactStats[i]?.label ?? ""),
        note: String(s?.note ?? out.homeImpactStats[i]?.note ?? ""),
      }));
      continue;
    }
    if (key === "heroContent" && typeof pv === "object" && !Array.isArray(pv)) {
      Object.assign(out.heroContent, pv);
      continue;
    }
    if (key === "homeTestimonial" && typeof pv === "object" && !Array.isArray(pv)) {
      Object.assign(out.homeTestimonial, pv);
      continue;
    }
    if (key === "homeSpotlightStory" && typeof pv === "object" && !Array.isArray(pv)) {
      const sp = pv as Record<string, unknown>;
      if (Array.isArray(sp.paragraphs)) {
        out.homeSpotlightStory.paragraphs = sp.paragraphs.map(String);
      }
      if (typeof sp.label === "string") out.homeSpotlightStory.label = sp.label;
      if (typeof sp.headline === "string") out.homeSpotlightStory.headline = sp.headline;
      if (typeof sp.name === "string") out.homeSpotlightStory.name = sp.name;
      if (typeof sp.role === "string") out.homeSpotlightStory.role = sp.role;
      if (typeof sp.initials === "string") out.homeSpotlightStory.initials = sp.initials;
      if (typeof sp.ctaLabel === "string") out.homeSpotlightStory.ctaLabel = sp.ctaLabel;
      if (typeof sp.ctaHref === "string") out.homeSpotlightStory.ctaHref = sp.ctaHref;
      continue;
    }
    if (key === "homeReach" && typeof pv === "object" && !Array.isArray(pv)) {
      Object.assign(out.homeReach, pv);
      continue;
    }
    if (key === "homeImpactMethodology" && typeof pv === "string") {
      out.homeImpactMethodology = pv;
      continue;
    }
    if (key === "heroPartnerStrip" && Array.isArray(pv)) {
      out.heroPartnerStrip = pv.map(String);
      continue;
    }
    if (key === "homePartnerBlurb" && typeof pv === "string") {
      out.homePartnerBlurb = pv;
    }
  }
  return out;
}

/** Public homepage: merge DB `home` contentJson only when that row is published */
export async function getHomePageCms(): Promise<HomePageCms> {
  const defaults = getDefaultHomePageCms();
  if (process.env.BUILD_WITHOUT_DB === "1") return defaults;
  const row = await prisma.pageContent.findUnique({ where: { slug: "home" } });
  if (row?.status !== "published" || !row.contentJson || typeof row.contentJson !== "object") {
    return defaults;
  }
  return deepMergeHome(defaults, row.contentJson as Record<string, unknown>);
}

/** Admin editor: merge defaults with stored JSON (any status) */
export async function getHomePageCmsForEdit(): Promise<HomePageCms> {
  const defaults = getDefaultHomePageCms();
  const row = await prisma.pageContent.findUnique({ where: { slug: "home" } });
  if (!row?.contentJson || typeof row.contentJson !== "object") {
    return defaults;
  }
  return deepMergeHome(defaults, row.contentJson as Record<string, unknown>);
}
