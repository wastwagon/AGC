import { ourWorkSubLinks, getInvolvedSubLinks, footerLinks } from "./content";

export type SiteNavLink = { href: string; label: string };
export type SiteNavItem = SiteNavLink & { subLinks?: SiteNavLink[] };

export type SiteFooterChrome = {
  contactHeading: string;
  quickLinksHeading: string;
  ourWorkHeading: string;
  getInvolvedLabel: string;
  rightsReserved: string;
  adminLabel: string;
  quickLinks: SiteNavLink[];
  legal: SiteNavLink[];
  workThumbnails: { href: string; alt: string }[];
};

export type SiteChrome = {
  skipToContentLabel: string;
  headerContactCta: string;
  headerSearchAriaLabel: string;
  mobileDrawerAriaLabel: string;
  mobileDrawerCloseAriaLabel: string;
  mobileSearchButtonLabel: string;
  mobileDrawerContactCta: string;
  mobileLanguageEyebrow: string;
  nav: SiteNavItem[];
  bottomNav: { href: string; label: string }[];
  footer: SiteFooterChrome;
};

function cloneLinks(links: readonly { href: string; label: string }[]): SiteNavLink[] {
  return links.map((l) => ({ href: l.href, label: l.label }));
}

export const defaultSiteNav: SiteNavItem[] = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/our-work", label: "Our Work", subLinks: cloneLinks(ourWorkSubLinks) },
  { href: "/app-summit", label: "APP Summit" },
  { href: "/events", label: "Events" },
  { href: "/news", label: "News" },
  { href: "/get-involved", label: "Get Involved", subLinks: cloneLinks(getInvolvedSubLinks) },
  { href: "/contact", label: "Contact" },
];

export const DEFAULT_SITE_CHROME: SiteChrome = {
  skipToContentLabel: "Skip to content",
  headerContactCta: "Contact",
  headerSearchAriaLabel: "Search",
  mobileDrawerAriaLabel: "Site navigation",
  mobileDrawerCloseAriaLabel: "Close menu",
  mobileSearchButtonLabel: "Search the site",
  mobileDrawerContactCta: "Contact us",
  mobileLanguageEyebrow: "Language",
  nav: defaultSiteNav.map((item) => ({
    href: item.href,
    label: item.label,
    subLinks: item.subLinks ? cloneLinks(item.subLinks) : undefined,
  })),
  bottomNav: [
    { href: "/", label: "Home" },
    { href: "/our-work", label: "Work" },
    { href: "/events", label: "Events" },
    { href: "/news", label: "News" },
    { href: "__menu__", label: "Menu" },
  ],
  footer: {
    contactHeading: "Contact",
    quickLinksHeading: "Quick Links",
    ourWorkHeading: "Our Work",
    getInvolvedLabel: "Get Involved",
    rightsReserved: "All rights reserved.",
    adminLabel: "Admin",
    quickLinks: cloneLinks(footerLinks.quickLinks),
    legal: cloneLinks(footerLinks.legal),
    workThumbnails: [
      { href: "/our-work/programs", alt: "Programs" },
      { href: "/our-work/projects", alt: "Projects" },
      { href: "/our-work/advisory", alt: "Advisory" },
      { href: "/app-summit", alt: "APP Summit" },
      { href: "/events", alt: "Events" },
      { href: "/news", alt: "News" },
    ],
  },
};
