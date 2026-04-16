"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Search } from "lucide-react";
import type { SiteSettings } from "@/lib/site-settings";
import { TOPBAR_SOCIAL_LINKS, topbarDarkIconButtonClass } from "@/data/topbar-social";
import { useOptionalMobileNav } from "./mobile/MobileNavContext";
import { SearchModal } from "./SearchModal";

export function HeaderTopbar({ siteSettings }: { siteSettings: SiteSettings }) {
  const mobileNav = useOptionalMobileNav();
  const [standaloneSearchOpen, setStandaloneSearchOpen] = useState(false);
  const chrome = siteSettings.chrome;

  function openSearch() {
    if (mobileNav) mobileNav.setSearchOpen(true);
    else setStandaloneSearchOpen(true);
  }

  return (
    <div className="relative hidden border-b border-black/10 bg-accent-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.07)] lg:block">
      {!mobileNav ? (
        <SearchModal
          isOpen={standaloneSearchOpen}
          onClose={() => setStandaloneSearchOpen(false)}
          copy={siteSettings.chrome.search}
        />
      ) : null}
      <div className="w-full px-4 py-3 sm:px-6 sm:py-3.5 lg:px-8 lg:py-2.5 xl:px-12 2xl:px-16">
        <div className="mx-auto flex max-w-[90rem] flex-col gap-3 sm:gap-3.5 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
          {/* Left: programs email only */}
          <div className="min-w-0 flex-1 border-b border-white/[0.12] pb-3 lg:border-0 lg:pb-0">
            <a
              href={`mailto:${siteSettings.email.programs}`}
              className="group flex min-h-[44px] max-w-full gap-3 text-left sm:gap-3.5 lg:min-h-0"
            >
              <span className={`${topbarDarkIconButtonClass} group-hover:bg-white/[0.17]`} aria-hidden>
                <Mail className="h-[18px] w-[18px]" strokeWidth={2} />
              </span>
              <span className="min-w-0 flex-1 self-center break-words text-[0.8125rem] font-medium leading-snug tracking-[0.01em] text-white underline-offset-2 transition-colors group-hover:text-accent-300 group-hover:underline sm:text-sm">
                {siteSettings.email.programs}
              </span>
            </a>
          </div>

          {/* Right: search, contact, social */}
          <div className="flex min-w-0 flex-col gap-3 sm:gap-3.5 lg:w-auto lg:shrink-0 lg:flex-row lg:items-center lg:gap-3 lg:border-l lg:border-white/[0.14] lg:pl-6">
            <div className="flex w-full min-w-0 gap-2 sm:gap-3 lg:w-auto lg:max-w-none">
              <button
                type="button"
                onClick={openSearch}
                className="flex min-h-[44px] min-w-0 flex-1 items-center justify-center gap-2 rounded-lg bg-[#dadffb] px-3 py-2.5 text-accent-700 transition-colors hover:bg-accent-100 hover:text-accent-800 sm:px-4 lg:h-11 lg:min-h-0 lg:w-[55px] lg:flex-initial lg:px-0"
                aria-label={chrome.headerSearchAriaLabel}
              >
                <Search className="h-5 w-5 shrink-0" aria-hidden />
                <span className="truncate text-sm font-medium lg:sr-only">{chrome.headerSearchAriaLabel}</span>
              </button>
              <Link
                href="/contact"
                className="inline-flex min-h-[44px] min-w-0 flex-1 items-center justify-center rounded-lg bg-accent-500 px-4 py-2.5 text-center text-sm font-medium text-white shadow-sm transition-opacity hover:opacity-95 sm:px-5 lg:flex-initial"
              >
                {chrome.headerContactCta}
              </Link>
            </div>

            <nav
              className="flex w-full items-center justify-center gap-2 border-t border-white/[0.1] pt-3 sm:justify-start lg:w-auto lg:justify-end lg:border-0 lg:border-l lg:border-white/[0.14] lg:pt-0 lg:pl-4"
              aria-label="Social media"
            >
              <p className="sr-only">Follow us on social media</p>
              <ul className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 lg:justify-end">
                {TOPBAR_SOCIAL_LINKS.map(({ href, icon: Icon, label }) => (
                  <li key={href}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={topbarDarkIconButtonClass}
                      aria-label={label}
                    >
                      <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
