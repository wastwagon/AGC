"use client";

import Link from "next/link";
import { Mail, Search } from "lucide-react";
import type { SiteSettings } from "@/lib/site-settings";
import type { SiteNavItem } from "@/data/site-chrome";
import { SocialBrandIcon } from "@/components/SocialBrandIcon";
import { publicSocialSlots } from "@/data/public-social-row";
import { donateHref } from "@/data/content";
import { useOptionalMobileNav } from "@/components/mobile/MobileNavContext";

const TOPBAR_LABEL_FALLBACK: Record<string, string> = {
  "/events": "Events",
  "/news": "News",
  "/aypf": "AYPF",
  "/awpls": "AWPLS",
  "/get-involved/volunteer": "Volunteer",
};

function topbarSlots(): { href: string; label?: string }[] {
  return [
    { href: "/news" },
    { href: donateHref, label: "Donate" },
    { href: "/aypf" },
    { href: "/awpls", label: "AWPLS" },
    { href: "/get-involved/volunteer" },
  ];
}

/** Utility links on the top bar (also removed from the main row below to avoid duplicates). */
export function topbarRightNavItems(nav: SiteNavItem[]): SiteNavItem[] {
  const byHref = new Map(nav.map((i) => [i.href, i]));
  const out: SiteNavItem[] = [];
  for (const slot of topbarSlots()) {
    const fromNav = byHref.get(slot.href);
    const label =
      slot.label ?? fromNav?.label ?? TOPBAR_LABEL_FALLBACK[slot.href] ?? slot.href.replace(/^\//, "");
    out.push({ href: slot.href, label });
  }
  return out;
}

/** Main header row should not repeat items already shown in the top bar. */
export function mainRowNavExcludingTopbar(nav: SiteNavItem[]): SiteNavItem[] {
  const exclude = new Set(topbarSlots().map((s) => s.href));
  return nav.filter((item) => !exclude.has(item.href));
}

export function HeaderTopbar({ siteSettings }: { siteSettings: SiteSettings }) {
  const programsMail = siteSettings.email.programs?.trim();
  const rightLinks = topbarRightNavItems(siteSettings.chrome.nav);
  const mobileNav = useOptionalMobileNav();
  const searchPlaceholder = siteSettings.chrome.search.placeholder;

  // Tailwind: no spaces inside arbitrary `[]` classes — spaces split the class string and drop `bg-*`.
  return (
    <div className="relative hidden bg-accent-600 text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12)] lg:block">
      <div className="w-full px-4 py-2.5 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <div className="mx-auto flex max-w-[90rem] flex-wrap items-center justify-between gap-x-4 gap-y-2">
          {/* Left: programs email + social */}
          <div className="flex min-w-0 flex-shrink-0 flex-wrap items-center gap-x-4 gap-y-2">
            {programsMail ? (
              <a
                href={`mailto:${programsMail}`}
                className="inline-flex min-h-[44px] max-w-full items-center gap-2 text-[0.8125rem] font-medium text-white/95 underline-offset-2 hover:text-white hover:underline sm:text-sm lg:min-h-0"
              >
                <Mail className="h-4 w-4 shrink-0 text-white" strokeWidth={2} aria-hidden />
                <span className="break-all">{programsMail}</span>
              </a>
            ) : null}

            <nav className="flex flex-wrap items-center gap-1 sm:gap-1.5" aria-label="Social media">
              <p className="sr-only">Follow us on social media</p>
              <ul className="flex flex-wrap items-center gap-1 sm:gap-1.5">
                {publicSocialSlots(siteSettings).map(({ href, brand, label }) => (
                  <li key={brand}>
                    {href ? (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-10 w-10 items-center justify-center rounded-md text-white/90 transition-colors hover:bg-white/15 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80"
                        aria-label={label}
                      >
                        <SocialBrandIcon brand={brand} className="h-[1.125rem] w-[1.125rem]" />
                      </a>
                    ) : (
                      <span
                        className="flex h-10 w-10 items-center justify-center rounded-md text-white/35"
                        aria-label={`${label} — add URL in Site settings`}
                        title="Add URL in Admin → Site settings → Social links"
                      >
                        <SocialBrandIcon brand={brand} className="h-[1.125rem] w-[1.125rem]" />
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Right: search (underline only) + quick links */}
          <div className="flex min-w-0 flex-1 flex-wrap items-center justify-end gap-x-4 gap-y-2 lg:gap-x-5 xl:gap-x-6">
            {mobileNav ? (
              <button
                type="button"
                onClick={() => mobileNav.setSearchOpen(true)}
                className="group inline-flex min-h-[40px] max-w-[min(100%,18rem)] flex-shrink-0 items-center gap-2 border-0 border-b border-white/45 bg-transparent py-1.5 pl-0.5 pr-1 text-left shadow-none transition-colors hover:border-white hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80"
                aria-label={siteSettings.chrome.headerSearchAriaLabel}
              >
                <Search
                  className="h-4 w-4 shrink-0 text-white/95 transition-colors group-hover:text-white"
                  strokeWidth={2.25}
                  aria-hidden
                />
                <span className="truncate text-[0.8125rem] font-medium normal-case tracking-normal text-white/85 group-hover:text-white">
                  {searchPlaceholder}
                </span>
              </button>
            ) : null}

            {rightLinks.length > 0 ? (
              <nav className="min-w-0 shrink-0" aria-label="Quick links">
                <ul className="inline-flex flex-nowrap items-center justify-end gap-x-3 sm:gap-x-4 lg:gap-x-5">
                  {rightLinks.map((item) => (
                    <li key={item.href} className="flex items-center">
                      <Link
                        href={item.href}
                        className="whitespace-nowrap px-1 py-1 text-xs font-semibold uppercase tracking-wide text-white/95 transition-colors hover:bg-white/10 hover:text-white sm:text-[0.8125rem]"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
