import { cache } from "react";
import { siteConfig } from "@/data/content";
import {
  DEFAULT_SITE_CHROME,
  type SiteChrome,
  type SiteFooterChrome,
  type SiteNavItem,
  type SiteNavLink,
} from "@/data/site-chrome";
import { prisma } from "@/lib/db";

export type SiteSettings = {
  name: string;
  tagline: string;
  /** Media library id, path, or URL — header & mobile nav */
  logo: string;
  /** Optional darker-background logo (footer, drawer). Empty = same as header logo. */
  footerLogo: string;
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
  /** Header, footer, and mobile navigation copy (Admin → Site settings). */
  chrome: SiteChrome;
};

const DEFAULT_SITE_SETTINGS: SiteSettings = {
  ...siteConfig,
  chrome: DEFAULT_SITE_CHROME,
};

function isNavLink(x: unknown): x is SiteNavLink {
  if (!x || typeof x !== "object" || Array.isArray(x)) return false;
  const o = x as Record<string, unknown>;
  return typeof o.href === "string" && o.href.length > 0 && typeof o.label === "string";
}

function parseNavItem(x: unknown): SiteNavItem | null {
  if (!isNavLink(x)) return null;
  const o = x as Record<string, unknown>;
  const href = o.href as string;
  const label = o.label as string;
  let subLinks: SiteNavLink[] | undefined;
  if (Array.isArray(o.subLinks)) {
    const sl = o.subLinks.filter(isNavLink).map((s) => ({ href: s.href as string, label: s.label as string }));
    if (sl.length > 0) subLinks = sl;
  }
  return { href, label, subLinks };
}

function parseNavList(v: unknown): SiteNavItem[] | null {
  if (!Array.isArray(v)) return null;
  const items = v.map(parseNavItem).filter((x): x is SiteNavItem => x !== null);
  return items.length > 0 ? items : null;
}

function parseLinkList(v: unknown): SiteNavLink[] | null {
  if (!Array.isArray(v)) return null;
  const items = v.filter(isNavLink).map((s) => ({ href: s.href, label: s.label }));
  return items.length > 0 ? items : null;
}

function parseWorkThumbs(v: unknown): SiteFooterChrome["workThumbnails"] | null {
  if (!Array.isArray(v)) return null;
  const out: SiteFooterChrome["workThumbnails"] = [];
  for (const x of v) {
    if (!x || typeof x !== "object" || Array.isArray(x)) continue;
    const o = x as Record<string, unknown>;
    if (typeof o.href === "string" && o.href.length > 0 && typeof o.alt === "string") {
      out.push({ href: o.href, alt: o.alt });
    }
  }
  return out.length > 0 ? out : null;
}

function parseBottomNav(v: unknown): { href: string; label: string }[] | null {
  if (!Array.isArray(v)) return null;
  const out: { href: string; label: string }[] = [];
  for (const x of v) {
    if (!x || typeof x !== "object" || Array.isArray(x)) continue;
    const o = x as Record<string, unknown>;
    if (typeof o.href === "string" && o.href.length > 0 && typeof o.label === "string") {
      out.push({ href: o.href, label: o.label });
    }
  }
  return out.length > 0 ? out : null;
}

export function mergeSiteChrome(patch: unknown): SiteChrome {
  const base = DEFAULT_SITE_CHROME;
  if (patch === null || patch === undefined || typeof patch !== "object" || Array.isArray(patch)) {
    return mergeSiteChrome({});
  }
  const p = patch as Record<string, unknown>;
  const footerPatch =
    p.footer && typeof p.footer === "object" && !Array.isArray(p.footer)
      ? (p.footer as Record<string, unknown>)
      : {};
  const searchPatch =
    p.search && typeof p.search === "object" && !Array.isArray(p.search)
      ? (p.search as Record<string, unknown>)
      : {};
  const newsletterPatch =
    p.newsletter && typeof p.newsletter === "object" && !Array.isArray(p.newsletter)
      ? (p.newsletter as Record<string, unknown>)
      : {};

  const nav = parseNavList(p.nav) ?? base.nav.map((i) => ({ ...i, subLinks: i.subLinks?.map((s) => ({ ...s })) }));
  const bottomNav = parseBottomNav(p.bottomNav) ?? [...base.bottomNav];
  const quickLinks = parseLinkList(footerPatch.quickLinks);
  const legal = parseLinkList(footerPatch.legal);
  const workThumbnails = parseWorkThumbs(footerPatch.workThumbnails);

  const pickStr = (v: unknown, fallback: string) =>
    typeof v === "string" && v.trim() !== "" ? v.trim() : fallback;

  return {
    skipToContentLabel: pickStr(p.skipToContentLabel, base.skipToContentLabel),
    headerContactCta: pickStr(p.headerContactCta, base.headerContactCta),
    headerSearchAriaLabel: pickStr(p.headerSearchAriaLabel, base.headerSearchAriaLabel),
    mobileDrawerAriaLabel: pickStr(p.mobileDrawerAriaLabel, base.mobileDrawerAriaLabel),
    mobileDrawerCloseAriaLabel: pickStr(p.mobileDrawerCloseAriaLabel, base.mobileDrawerCloseAriaLabel),
    mobileSearchButtonLabel: pickStr(p.mobileSearchButtonLabel, base.mobileSearchButtonLabel),
    mobileDrawerContactCta: pickStr(p.mobileDrawerContactCta, base.mobileDrawerContactCta),
    mobileLanguageEyebrow: pickStr(p.mobileLanguageEyebrow, base.mobileLanguageEyebrow),
    nav,
    bottomNav,
    footer: {
      contactHeading: pickStr(footerPatch.contactHeading, base.footer.contactHeading),
      quickLinksHeading: pickStr(footerPatch.quickLinksHeading, base.footer.quickLinksHeading),
      ourWorkHeading: pickStr(footerPatch.ourWorkHeading, base.footer.ourWorkHeading),
      getInvolvedLabel: pickStr(footerPatch.getInvolvedLabel, base.footer.getInvolvedLabel),
      rightsReserved: pickStr(footerPatch.rightsReserved, base.footer.rightsReserved),
      adminLabel: pickStr(footerPatch.adminLabel, base.footer.adminLabel),
      quickLinks: quickLinks ?? base.footer.quickLinks.map((l) => ({ ...l })),
      legal: legal ?? base.footer.legal.map((l) => ({ ...l })),
      workThumbnails: workThumbnails ?? base.footer.workThumbnails.map((t) => ({ ...t })),
    },
    search: {
      dialogAriaLabel: pickStr(searchPatch.dialogAriaLabel, base.search.dialogAriaLabel),
      placeholder: pickStr(searchPatch.placeholder, base.search.placeholder),
      closeAriaLabel: pickStr(searchPatch.closeAriaLabel, base.search.closeAriaLabel),
      loading: pickStr(searchPatch.loading, base.search.loading),
      emptyNoQuery: pickStr(searchPatch.emptyNoQuery, base.search.emptyNoQuery),
      emptyNoResults: pickStr(searchPatch.emptyNoResults, base.search.emptyNoResults),
      typeEvent: pickStr(searchPatch.typeEvent, base.search.typeEvent),
      typeNews: pickStr(searchPatch.typeNews, base.search.typeNews),
      typePublication: pickStr(searchPatch.typePublication, base.search.typePublication),
    },
    newsletter: {
      heading: pickStr(newsletterPatch.heading, base.newsletter.heading),
      description: pickStr(newsletterPatch.description, base.newsletter.description),
      placeholder: pickStr(newsletterPatch.placeholder, base.newsletter.placeholder),
      emailAriaLabel: pickStr(newsletterPatch.emailAriaLabel, base.newsletter.emailAriaLabel),
      submit: pickStr(newsletterPatch.submit, base.newsletter.submit),
      submitLoading: pickStr(newsletterPatch.submitLoading, base.newsletter.submitLoading),
      subscribed: pickStr(newsletterPatch.subscribed, base.newsletter.subscribed),
      successMessage: pickStr(newsletterPatch.successMessage, base.newsletter.successMessage),
      errorGeneric: pickStr(newsletterPatch.errorGeneric, base.newsletter.errorGeneric),
    },
  };
}

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
    footerLogo: typeof src.footerLogo === "string" ? src.footerLogo : DEFAULT_SITE_SETTINGS.footerLogo,
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
    chrome: mergeSiteChrome(src.chrome),
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

export type {
  SiteChrome,
  SiteNavItem,
  SiteNavLink,
  SiteSearchChrome,
  SiteNewsletterChrome,
} from "@/data/site-chrome";
