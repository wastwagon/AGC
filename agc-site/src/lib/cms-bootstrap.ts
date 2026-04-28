/**
 * Initial homepage JSON for seeding and for the admin editor when the `home` row
 * has no stored JSON yet. Public site merges published `home` contentJson over
 * an empty shell (see `home-page-data`).
 */
import {
  heroContent,
  defaultHomeHeroBackgroundImage,
  homeTestimonial,
  homeSpotlightStory,
  homeImpactStats,
  homeImpactMethodology,
} from "@/data/content";
import type { HomePageCms } from "@/lib/home-page-types";

const DEFAULT_PARTNER_BLURB =
  "Stay up to date with our research and events >";

export function getBootstrapHomePageCms(): HomePageCms {
  return {
    heroSliderImages: [defaultHomeHeroBackgroundImage],
    /** Empty = image carousel; set to `/media/…mp4` in Admin → Home settings to use video instead. */
    heroBackgroundVideoSrc: "",
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
      title: "The Scope of Our Work",
      intro: "",
    },
    homeImpactMethodology,
    homeImpactStats: homeImpactStats.map((s) => ({ ...s })),
    homePartnerBlurb: DEFAULT_PARTNER_BLURB,
    homeCtaBand: {
      eyebrow: "Why we exist",
      title:
        "Everyone deserves institutions they can trust—schools that teach, clinics that heal, budgets that add up.",
      body: "That is human development in practice. We help governments and civic actors strengthen governance—through evidence, training, and patient partnership—so prosperity and dignity are not reserved for the few.",
      primaryCta: "Get involved",
      primaryHref: "/get-involved",
      secondaryCta: "About the Centre",
      secondaryHref: "/about",
    },
    homeEventsTitle: "Events",
    homeNewsTeaser: {
      title: "Latest News",
      subtitle: "",
    },
  };
}
