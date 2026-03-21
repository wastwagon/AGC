"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X, Search } from "lucide-react";
import { siteConfig, ourWorkSubLinks, getInvolvedSubLinks } from "@/data/content";
import { NavDropdown } from "./NavDropdown";
import { LanguageSelector } from "./LanguageSelector";
import { HeaderTopbar } from "./HeaderTopbar";
import { SearchModal } from "./SearchModal";
import { useMobileNav } from "./mobile/MobileNavContext";

type NavItem = { href: string; label: string; subLinks?: { href: string; label: string }[] };

const navWithDropdowns: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/our-work", label: "Our Work", subLinks: ourWorkSubLinks },
  { href: "/app-summit", label: "APP Summit" },
  { href: "/events", label: "Events" },
  { href: "/news", label: "News" },
  { href: "/get-involved", label: "Get Involved", subLinks: getInvolvedSubLinks },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const { mobileOpen, setMobileOpen, searchOpen, setSearchOpen } = useMobileNav();
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
      {showTopbar && <HeaderTopbar />}

      <div className="wpo-site-header">
        <nav className="w-full px-4 py-0 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="flex h-20 items-center justify-between gap-4">
            <Link href="/" className="shrink-0">
              <Image
                src="/agc-logo.png"
                alt={siteConfig.name}
                width={160}
                height={48}
                className="h-10 w-auto object-contain lg:h-11"
                priority
              />
            </Link>

            <nav className="hidden shrink-0 items-center justify-center lg:flex" style={{ flex: "1 1 auto", minWidth: 0 }}>
              <ul className="flex items-center justify-center gap-1 whitespace-nowrap">
                {navWithDropdowns.map((item) =>
                  item.subLinks ? (
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
                <LanguageSelector />
              </div>
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="flex h-[50px] w-[55px] items-center justify-center rounded-lg bg-[#dadffb] text-accent-600 transition-colors hover:bg-accent-100 hover:text-accent-700"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>
              <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
              <Link
                href="/contact"
                className="hidden rounded-lg bg-gradient-to-r from-accent-600 to-accent-500 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-opacity hover:opacity-95 sm:inline-block"
              >
                Contact
              </Link>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileOpen}
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
