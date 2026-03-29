/**
 * Initial homepage JSON for seeding and for the admin editor when the `home` row
 * has no stored JSON yet. Public site merges published `home` contentJson over
 * an empty shell (see `home-page-data`).
 */
import {
  heroContent,
  homeTestimonial,
  homeSpotlightStory,
  homeImpactStats,
  homeImpactMethodology,
  heroPartnerStrip,
} from "@/data/content";
import type { HomePageCms } from "@/lib/home-page-types";

const DEFAULT_PARTNER_BLURB =
  "Our work is always collaborative—we don't arrive with ready-made answers.";

export function getBootstrapHomePageCms(): HomePageCms {
  return {
    heroSliderImages: [],
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
    homeNewsTeaser: {
      title: "Latest News",
      subtitle: "Stay updated with our latest research, events, and insights on governance across Africa.",
    },
    homeAppSummitTeaser: {
      title: "APP Summit",
      description: "Forums and expert roundtables advancing governance excellence across Africa.",
      ctaLabel: "Learn More",
      ctaHref: "/app-summit",
    },
  };
}
