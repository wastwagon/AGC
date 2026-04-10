import { prisma } from "@/lib/db";
import type { HomePageCms } from "@/lib/home-page-types";
import { getBootstrapHomePageCms } from "@/lib/cms-bootstrap";
import { devPublicRead, shouldSkipPrismaCalls } from "@/lib/skip-db";

export type { HomePageCms } from "@/lib/home-page-types";

/** Merge base for the public site when CMS fields are missing — no marketing defaults. */
export function emptyHomePageCms(): HomePageCms {
  const emptyStat = { value: "", label: "", note: "" };
  return {
    heroSliderImages: [],
    heroContent: {
      eyebrow: "",
      title: "",
      subtitle: "",
      cta: "",
      ctaHref: "/",
      ctaSecondary: "",
      ctaSecondaryHref: "/",
    },
    homeTestimonial: { quote: "", name: "", title: "", organization: "", initials: "" },
    homeSpotlightStory: {
      label: "",
      headline: "",
      paragraphs: [],
      name: "",
      role: "",
      initials: "",
      ctaLabel: "",
      ctaHref: "/",
    },
    homeReach: { title: "", intro: "" },
    homeImpactMethodology: "",
    homeImpactStats: [emptyStat, emptyStat, emptyStat, emptyStat],
    heroPartnerStrip: [],
    homePartnerBlurb: "",
    homeCtaBand: {
      eyebrow: "",
      title: "",
      body: "",
      primaryCta: "",
      primaryHref: "/",
      secondaryCta: "",
      secondaryHref: "/",
    },
    homeNewsTeaser: { title: "", subtitle: "" },
    homeAppSummitTeaser: {
      title: "",
      description: "",
      ctaLabel: "",
      ctaHref: "/app-summit",
    },
  };
}

/** Admin seed / first-time editor template (copy lives in DB after save). */
export function getDefaultHomePageCms(): HomePageCms {
  return getBootstrapHomePageCms();
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
    if (key === "homeCtaBand" && typeof pv === "object" && !Array.isArray(pv)) {
      Object.assign(out.homeCtaBand, pv);
      continue;
    }
    if (key === "homeNewsTeaser" && typeof pv === "object" && !Array.isArray(pv)) {
      Object.assign(out.homeNewsTeaser, pv);
      continue;
    }
    if (key === "homeAppSummitTeaser" && typeof pv === "object" && !Array.isArray(pv)) {
      Object.assign(out.homeAppSummitTeaser, pv);
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
    if (key === "heroBackgroundVideoSrc" && typeof pv === "string") {
      out.heroBackgroundVideoSrc = pv;
      continue;
    }
    if (key === "homePartnerBlurb" && typeof pv === "string") {
      out.homePartnerBlurb = pv;
    }
  }
  return out;
}

/**
 * Public homepage: published `home` JSON merged over bootstrap defaults.
 * Missing keys in the DB (older rows) inherit bootstrap copy; explicit empty strings from admin win.
 * Draft / missing row → empty shell so the live site does not show unpublished drafts.
 */
export async function getHomePageCms(): Promise<HomePageCms> {
  if (shouldSkipPrismaCalls()) {
    return getBootstrapHomePageCms();
  }
  return devPublicRead(getBootstrapHomePageCms(), async () => {
    const row = await prisma.pageContent.findUnique({ where: { slug: "home" } });
    if (row?.status !== "published" || !row.contentJson || typeof row.contentJson !== "object") {
      return emptyHomePageCms();
    }
    return deepMergeHome(getBootstrapHomePageCms(), row.contentJson as Record<string, unknown>);
  });
}

/** Admin editor: bootstrap template when empty, else merge stored JSON over bootstrap for missing keys. */
export async function getHomePageCmsForEdit(): Promise<HomePageCms> {
  const bootstrap = getBootstrapHomePageCms();
  const row = await prisma.pageContent.findUnique({ where: { slug: "home" } });
  if (!row?.contentJson || typeof row.contentJson !== "object") {
    return bootstrap;
  }
  return deepMergeHome(bootstrap, row.contentJson as Record<string, unknown>);
}
