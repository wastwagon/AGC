"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin, Mail, Search, Twitter, Linkedin, Instagram, Facebook } from "lucide-react";
import type { SiteSettings } from "@/lib/site-settings";
import { useOptionalMobileNav } from "./mobile/MobileNavContext";
import { SearchModal } from "./SearchModal";

const iconBtnClass =
  "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.11] ring-1 ring-white/[0.1] text-white/90 transition-[background-color,box-shadow,color] hover:bg-white/[0.2] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50";

export function HeaderTopbar({ siteSettings }: { siteSettings: SiteSettings }) {
  const mobileNav = useOptionalMobileNav();
  const [standaloneSearchOpen, setStandaloneSearchOpen] = useState(false);
  const chrome = siteSettings.chrome;

  function openSearch() {
    if (mobileNav) mobileNav.setSearchOpen(true);
    else setStandaloneSearchOpen(true);
  }
  const socialLinks = [
    { href: siteSettings.social.twitter, icon: Twitter, label: "Twitter" },
    { href: siteSettings.social.linkedin, icon: Linkedin, label: "LinkedIn" },
    { href: siteSettings.social.instagram, icon: Instagram, label: "Instagram" },
    { href: siteSettings.social.facebook, icon: Facebook, label: "Facebook" },
  ].filter((s) => s.href && s.href !== "#");

  return (
    <div className="relative border-b border-black/[0.14] bg-gradient-to-b from-[#1a3555] via-[#1e3a5f] to-[#182f4d] shadow-[inset_0_1px_0_rgba(255,255,255,0.07)]">
      {!mobileNav ? (
        <SearchModal
          isOpen={standaloneSearchOpen}
          onClose={() => setStandaloneSearchOpen(false)}
          copy={siteSettings.chrome.search}
        />
      ) : null}
      <div className="w-full px-4 py-3 sm:px-6 sm:py-3.5 lg:px-8 lg:py-2.5 xl:px-12 2xl:px-16">
        <div className="mx-auto flex max-w-[90rem] flex-col lg:flex-row lg:items-center lg:justify-between lg:gap-6">
          {/* Address + email: stacked with dividers until lg */}
          <address className="grid min-w-0 flex-1 grid-cols-1 gap-0 not-italic lg:flex lg:flex-row lg:flex-wrap lg:items-center lg:gap-x-8 xl:gap-x-10">
            <div className="flex gap-3 border-b border-white/[0.12] pb-3 sm:gap-3.5 sm:pb-3.5 lg:max-w-[min(100%,28rem)] lg:border-0 lg:pb-0 xl:max-w-[34rem]">
              <span className={iconBtnClass} aria-hidden>
                <MapPin className="h-[18px] w-[18px]" strokeWidth={2} />
              </span>
              <span className="min-w-0 flex-1 pt-0.5 text-[0.8125rem] font-medium leading-[1.55] tracking-[0.01em] text-slate-100 sm:text-sm lg:pt-1 lg:leading-snug">
                {siteSettings.address}
              </span>
            </div>

            <a
              href={`mailto:${siteSettings.email.programs}`}
              className="group flex min-h-[44px] gap-3 border-b border-white/[0.12] py-3 text-left sm:gap-3.5 sm:py-3.5 lg:min-h-0 lg:border-0 lg:border-l lg:border-white/[0.14] lg:py-0 lg:pl-6 xl:pl-8"
            >
              <span className={`${iconBtnClass} group-hover:bg-white/[0.17]`} aria-hidden>
                <Mail className="h-[18px] w-[18px]" strokeWidth={2} />
              </span>
              <span className="min-w-0 flex-1 self-center break-words text-[0.8125rem] font-medium leading-snug tracking-[0.01em] text-white underline-offset-2 transition-colors group-hover:text-accent-300 group-hover:underline sm:text-sm">
                {siteSettings.email.programs}
              </span>
            </a>
          </address>

          {/* Search, contact, social: own block; stacked on mobile/tablet, inline from lg */}
          <div className="flex min-w-0 flex-col gap-3 pt-3 sm:gap-3.5 sm:pt-3.5 lg:w-auto lg:shrink-0 lg:flex-row lg:items-center lg:gap-3 lg:border-l lg:border-white/[0.14] lg:pt-0 lg:pl-6">
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
                className="inline-flex min-h-[44px] min-w-0 flex-1 items-center justify-center rounded-lg bg-gradient-to-r from-accent-600 to-accent-500 px-4 py-2.5 text-center text-sm font-medium text-white shadow-sm transition-opacity hover:opacity-95 sm:px-5 lg:flex-initial"
              >
                {chrome.headerContactCta}
              </Link>
            </div>

            {socialLinks.length > 0 ? (
              <nav
                className="flex w-full items-center justify-center gap-2 border-t border-white/[0.1] pt-3 sm:justify-start lg:w-auto lg:justify-end lg:border-0 lg:border-l lg:border-white/[0.14] lg:pt-0 lg:pl-4"
                aria-label="Social media"
              >
                <p className="sr-only">Follow us on social media</p>
                <ul className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 lg:justify-end">
                  {socialLinks.map(({ href, icon: Icon, label }) => (
                    <li key={label}>
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={iconBtnClass}
                        aria-label={label}
                      >
                        <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
                      </a>
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
