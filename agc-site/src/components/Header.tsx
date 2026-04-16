"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import type { SiteSettings } from "@/lib/site-settings";
import { NavDropdown } from "./NavDropdown";
import { LanguageSelector } from "./LanguageSelector";
import { HeaderTopbar } from "./HeaderTopbar";
import { SearchModal } from "./SearchModal";
import { useMobileNav } from "./mobile/MobileNavContext";
import { preferUnoptimizedImage } from "@/lib/image-delivery";

export function Header({ siteSettings, brandLogoSrc }: { siteSettings: SiteSettings; brandLogoSrc: string }) {
  const navWithDropdowns = siteSettings.chrome.nav;
  const { mobileOpen, setMobileOpen, searchOpen, setSearchOpen, menuTriggerRef } = useMobileNav();
  const [scrolled, setScrolled] = useState(false);
  const showTopbar = true;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header
      className={`sticky top-0 z-50 w-full bg-white transition-shadow duration-300 ${
        scrolled ? "shadow-[0_4px_24px_-8px_rgba(28,25,23,0.08)]" : "border-b border-stone-200/90"
      }`}
    >
      {showTopbar && <HeaderTopbar siteSettings={siteSettings} />}

      <div className="wpo-site-header">
        <nav className="w-full px-4 py-0 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="flex h-20 items-center justify-between gap-4 lg:h-20">
            <Link href="/" className="flex border w-[200px] shrink-0 items-center lg:w-[220px]">
              <Image
                src={brandLogoSrc}
                alt={siteSettings.name}
                width={200}
                height={60}
                className="h-10 w-auto object-contain lg:h-11"
                priority
                unoptimized={preferUnoptimizedImage(brandLogoSrc)}
              />
            </Link>

            <nav className="hidden shrink-0 items-center justify-center lg:flex" style={{ flex: "1 1 auto", minWidth: 0 }}>
              <ul className="flex items-center justify-center gap-1 whitespace-nowrap">
                {navWithDropdowns.map((item) =>
                  item.subLinks && item.subLinks.length > 0 ? (
                    <li key={item.href} className="group relative">
                      <NavDropdown label={item.label} href={item.href} items={item.subLinks} />
                    </li>
                  ) : (
                    <li key={item.href} className="group">
                      <Link
                        href={item.href}
                        className="relative block px-3 py-4 text-base font-medium text-[#232f4b] transition-colors hover:text-accent-600 lg:px-4"
                      >
                        <span className="absolute left-1/2 top-0 h-1 w-0 -translate-x-1/2 rounded-sm bg-accent-500 opacity-0 transition-all duration-300 group-hover:w-3/4 group-hover:opacity-100" />
                        {item.label}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </nav>

            <div className="flex items-center gap-3">
              <div className="hidden sm:block">
                <LanguageSelector languages={siteSettings.languages} />
              </div>
              <SearchModal
                isOpen={searchOpen}
                onClose={() => setSearchOpen(false)}
                copy={siteSettings.chrome.search}
              />
              <button
                ref={menuTriggerRef}
                type="button"
                className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileOpen}
                aria-controls="site-mobile-drawer"
              >
                {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
