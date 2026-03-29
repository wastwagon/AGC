import { cache } from "react";
import { siteConfig } from "@/data/content";
import { prisma } from "@/lib/db";

export type SiteSettings = {
  name: string;
  tagline: string;
  /** Media library id, `/uploads/...`, or full URL — used for header/footer logo when set */
  logo: string;
  email: {
    programs: string;
    media: string;
    info: string;
  };
  phone: string;
  address: string;
  officeHours: string;
  social: {
    twitter: string;
    linkedin: string;
    instagram: string;
    facebook: string;
  };
  languages: { code: string; label: string }[];
};

const DEFAULT_SITE_SETTINGS: SiteSettings = {
  ...siteConfig,
};

function sanitizeSiteSettings(value: unknown): SiteSettings {
  const src = value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
  const email = src.email && typeof src.email === "object" && !Array.isArray(src.email)
    ? (src.email as Record<string, unknown>)
    : {};
  const social = src.social && typeof src.social === "object" && !Array.isArray(src.social)
    ? (src.social as Record<string, unknown>)
    : {};

  const languages = Array.isArray(src.languages)
    ? src.languages
        .filter((x): x is Record<string, unknown> => !!x && typeof x === "object" && !Array.isArray(x))
        .map((x) => ({
          code: typeof x.code === "string" ? x.code : "",
          label: typeof x.label === "string" ? x.label : "",
        }))
        .filter((x) => x.code && x.label)
    : DEFAULT_SITE_SETTINGS.languages;

  return {
    name: typeof src.name === "string" ? src.name : DEFAULT_SITE_SETTINGS.name,
    tagline: typeof src.tagline === "string" ? src.tagline : DEFAULT_SITE_SETTINGS.tagline,
    logo: typeof src.logo === "string" ? src.logo : DEFAULT_SITE_SETTINGS.logo,
    email: {
      programs: typeof email.programs === "string" ? email.programs : DEFAULT_SITE_SETTINGS.email.programs,
      media: typeof email.media === "string" ? email.media : DEFAULT_SITE_SETTINGS.email.media,
      info: typeof email.info === "string" ? email.info : DEFAULT_SITE_SETTINGS.email.info,
    },
    phone: typeof src.phone === "string" ? src.phone : DEFAULT_SITE_SETTINGS.phone,
    address: typeof src.address === "string" ? src.address : DEFAULT_SITE_SETTINGS.address,
    officeHours: typeof src.officeHours === "string" ? src.officeHours : DEFAULT_SITE_SETTINGS.officeHours,
    social: {
      twitter: typeof social.twitter === "string" ? social.twitter : DEFAULT_SITE_SETTINGS.social.twitter,
      linkedin: typeof social.linkedin === "string" ? social.linkedin : DEFAULT_SITE_SETTINGS.social.linkedin,
      instagram: typeof social.instagram === "string" ? social.instagram : DEFAULT_SITE_SETTINGS.social.instagram,
      facebook: typeof social.facebook === "string" ? social.facebook : DEFAULT_SITE_SETTINGS.social.facebook,
    },
    languages,
  };
}

export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  try {
    const row = await prisma.pageContent.findUnique({
      where: { slug: "site-settings" },
      select: { contentJson: true },
    });
    if (!row?.contentJson) return DEFAULT_SITE_SETTINGS;
    return sanitizeSiteSettings(row.contentJson);
  } catch {
    return DEFAULT_SITE_SETTINGS;
  }
});
