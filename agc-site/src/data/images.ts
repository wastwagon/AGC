/**
 * All images are served from the media library (public/uploads/)
 * Upload images via /admin/media and reference by URL (e.g. /uploads/hero.jpg)
 * Env vars NEXT_PUBLIC_*_IMAGE override defaults (must be /uploads/ paths)
 */
const MEDIA_PLACEHOLDER = "/uploads/placeholder.svg";

export const placeholderImages = {
  hero: process.env.NEXT_PUBLIC_HERO_IMAGE || MEDIA_PLACEHOLDER,
  about: process.env.NEXT_PUBLIC_ABOUT_IMAGE || MEDIA_PLACEHOLDER,
  programs: process.env.NEXT_PUBLIC_PROGRAMS_IMAGE || MEDIA_PLACEHOLDER,
  projects: process.env.NEXT_PUBLIC_PROJECTS_IMAGE || MEDIA_PLACEHOLDER,
  advisory: process.env.NEXT_PUBLIC_ADVISORY_IMAGE || MEDIA_PLACEHOLDER,
  events: process.env.NEXT_PUBLIC_EVENTS_IMAGE || MEDIA_PLACEHOLDER,
  news: process.env.NEXT_PUBLIC_NEWS_IMAGE || MEDIA_PLACEHOLDER,
  getInvolved: process.env.NEXT_PUBLIC_GET_INVOLVED_IMAGE || MEDIA_PLACEHOLDER,
  contact: process.env.NEXT_PUBLIC_CONTACT_IMAGE || MEDIA_PLACEHOLDER,
  appSummit: process.env.NEXT_PUBLIC_APP_SUMMIT_IMAGE || MEDIA_PLACEHOLDER,
  applications: process.env.NEXT_PUBLIC_APPLICATIONS_IMAGE || MEDIA_PLACEHOLDER,
  publications: process.env.NEXT_PUBLIC_PUBLICATIONS_IMAGE || MEDIA_PLACEHOLDER,
};

/** Hero slider images - from media library. Set NEXT_PUBLIC_HERO_SLIDER_IMAGES (comma-separated /uploads/ paths) */
export const heroSliderImages = (() => {
  const custom = process.env.NEXT_PUBLIC_HERO_SLIDER_IMAGES;
  if (custom) return custom.split(",").map((s) => s.trim()).filter(Boolean);
  return [placeholderImages.hero];
})();
