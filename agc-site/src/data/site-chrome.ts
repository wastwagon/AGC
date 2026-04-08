import { footerLinks } from "./content";

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
  /** Optional image ref (media id, `/uploads/...`, or URL) — resolved at runtime for the public footer. */
  workThumbnails: { href: string; alt: string; image?: string }[];
};

/** Header search modal copy (Admin → Site settings). */
export type SiteSearchChrome = {
  dialogAriaLabel: string;
  placeholder: string;
  closeAriaLabel: string;
  loading: string;
  emptyNoQuery: string;
  emptyNoResults: string;
  typeEvent: string;
  typeNews: string;
  typePublication: string;
};

/** Public page breadcrumb segment labels (Admin → Site settings). */
export type SiteBreadcrumbChrome = {
  home: string;
  about: string;
  ourWork: string;
  programs: string;
  projects: string;
  advisory: string;
  getInvolved: string;
  volunteer: string;
  partnership: string;
  joinUs: string;
  contact: string;
  news: string;
  events: string;
  publications: string;
  privacyPolicy: string;
  termsOfService: string;
  appSummit: string;
  team: string;
  eventRegister: string;
};

/** Footer newsletter block copy. */
export type SiteNewsletterChrome = {
  heading: string;
  description: string;
  placeholder: string;
  emailAriaLabel: string;
  submit: string;
  submitLoading: string;
  subscribed: string;
  successMessage: string;
  errorGeneric: string;
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
  search: SiteSearchChrome;
  newsletter: SiteNewsletterChrome;
  breadcrumbs: SiteBreadcrumbChrome;
};

function cloneLinks(links: readonly { href: string; label: string }[]): SiteNavLink[] {
  return links.map((l) => ({ href: l.href, label: l.label }));
}

export const defaultSiteNav: SiteNavItem[] = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/our-work", label: "Our Work" },
  { href: "/app-summit", label: "APP Summit" },
  { href: "/events", label: "Events" },
  { href: "/news", label: "News" },
  { href: "/get-involved", label: "Get Involved" },
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
      { href: "/our-work#programs", alt: "Programs" },
      { href: "/our-work#projects", alt: "Projects" },
      { href: "/our-work#advisory", alt: "Advisory" },
      { href: "/publications", alt: "Publications" },
      { href: "/app-summit", alt: "APP Summit" },
      { href: "/events", alt: "Events" },
    ],
  },
  search: {
    dialogAriaLabel: "Site search",
    placeholder: "Search events, news, publications…",
    closeAriaLabel: "Close search",
    loading: "Loading…",
    emptyNoQuery: "Start typing to search.",
    emptyNoResults: "No results found.",
    typeEvent: "Event",
    typeNews: "News",
    typePublication: "Publication",
  },
  newsletter: {
    heading: "Stay Updated",
    description: "Subscribe to our newsletter for updates.",
    placeholder: "your@email.com",
    emailAriaLabel: "Email for newsletter",
    submit: "Subscribe",
    submitLoading: "…",
    subscribed: "Subscribed",
    successMessage: "Thanks for subscribing!",
    errorGeneric: "Something went wrong.",
  },
  breadcrumbs: {
    home: "Home",
    about: "About Us",
    ourWork: "Our Work",
    programs: "Programs",
    projects: "Projects",
    advisory: "Advisory",
    getInvolved: "Get Involved",
    volunteer: "Volunteer",
    partnership: "Partnership",
    joinUs: "Work with us",
    contact: "Contact",
    news: "News",
    events: "Events",
    publications: "Publications",
    privacyPolicy: "Privacy Policy",
    termsOfService: "Terms of Service",
    appSummit: "APP Summit",
    team: "Our Team",
    eventRegister: "Register",
  },
};
