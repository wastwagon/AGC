"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  Building2,
  Layers,
  Landmark,
  Calendar,
  Newspaper,
  Users,
  Heart,
  Handshake,
  Briefcase,
  X,
  ChevronRight,
  ChevronDown,
  BookOpen,
  Mail,
  MessageSquare,
} from "lucide-react";
import { LanguageSelector } from "@/components/LanguageSelector";
import type { SiteSettings } from "@/lib/site-settings";
import { SocialBrandIcon } from "@/components/SocialBrandIcon";
import { publicSocialSlots } from "@/data/public-social-row";
import { resolveHeaderPrimaryNav } from "@/data/site-chrome";
import { useMobileNav } from "./MobileNavContext";

const drawerLightSocialClass =
  "flex h-10 w-10 shrink-0 items-center justify-center rounded-none bg-accent-600 text-white ring-1 ring-accent-700/40 transition-colors hover:bg-accent-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500";

const drawerIconByHref: Record<string, LucideIcon> = {
  "/about": Building2,
  "/our-work": Layers,
  "/our-work/programs": Layers,
  "/our-work/projects": Layers,
  "/our-work/advisory": Layers,
  "/app-summit": Landmark,
  "/events": Calendar,
  "/news": Newspaper,
  "/publications": BookOpen,
  "/get-involved": Users,
  "/get-involved/volunteer": Heart,
  "/get-involved/partnership": Handshake,
  "/get-involved/join-us": Briefcase,
  "/#newsletter": Mail,
  "/contact": MessageSquare,
};

function drawerIconForHref(href: string): LucideIcon {
  return drawerIconByHref[href] ?? Layers;
}

function submenuPanelId(href: string) {
  return `drawer-submenu-${href.replace(/[^a-zA-Z0-9_-]/g, "_")}`;
}

export function MobileDrawer({ siteSettings }: { siteSettings: SiteSettings }) {
  /** Same order and About submenu as desktop (`Header` primary row). */
  const primaryNav = resolveHeaderPrimaryNav(siteSettings.chrome.nav);
  const chrome = siteSettings.chrome;
  const { mobileOpen, setMobileOpen, menuTriggerRef } = useMobileNav();
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!mobileOpen) setOpenSubmenus({});
  }, [mobileOpen]);

  // Escape closes; Tab cycles focus inside drawer (WCAG-friendly)
  useEffect(() => {
    if (!mobileOpen) return;
    const panel = document.getElementById("site-mobile-drawer");
    if (!panel) return;

    const selector =
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

    const getFocusable = () =>
      Array.from(panel.querySelectorAll<HTMLElement>(selector)).filter(
        (el) => !el.hasAttribute("disabled") && el.offsetParent !== null
      );

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setMobileOpen(false);
        requestAnimationFrame(() => menuTriggerRef.current?.focus());
        return;
      }
      if (e.key !== "Tab") return;
      const focusables = getFocusable();
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey) {
        if (active === first) {
          e.preventDefault();
          last.focus();
        }
      } else if (active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen, setMobileOpen, menuTriggerRef]);

  // Move focus into drawer when opened (mobile-first a11y)
  useEffect(() => {
    if (!mobileOpen) return;
    const t = window.setTimeout(() => {
      closeBtnRef.current?.focus();
    }, 100);
    return () => clearTimeout(t);
  }, [mobileOpen]);

  const navLinkClass =
    "group flex min-w-0 flex-1 items-center gap-3 rounded-xl px-3 py-3 text-[0.8125rem] font-medium uppercase tracking-wide text-[#1a365d] transition-colors hover:bg-stone-100 active:bg-stone-200/80";
  const iconWrapClass =
    "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-stone-100 text-accent-700 ring-1 ring-stone-200/90";

  function toggleSubmenu(href: string) {
    setOpenSubmenus((prev) => ({ ...prev, [href]: !prev[href] }));
  }

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-[60] bg-stone-900/40 backdrop-blur-[2px] transition-opacity lg:hidden"
          onClick={() => {
            setMobileOpen(false);
            requestAnimationFrame(() => menuTriggerRef.current?.focus());
          }}
          aria-label={chrome.mobileDrawerCloseAriaLabel}
        />
      )}
      <aside
        id="site-mobile-drawer"
        role="dialog"
        aria-modal="true"
        aria-label={chrome.mobileDrawerAriaLabel}
        className={`fixed left-0 top-0 z-[70] flex h-[100dvh] w-[min(88vw,22rem)] max-w-[23rem] flex-col border-r border-stone-200/90 bg-white shadow-[8px_0_40px_-12px_rgba(0,0,0,0.12)] transition-transform duration-300 ease-out motion-reduce:transition-none lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full pointer-events-none"
        }`}
        inert={!mobileOpen ? true : undefined}
      >
        {/* Header — language / translator + close (matches light chrome strip) */}
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-stone-200/90 bg-white px-4 py-3.5">
          <div className="min-w-0 flex-1 pt-0.5">
            <p className="mb-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-stone-500">
              {chrome.mobileLanguageEyebrow}
            </p>
            <LanguageSelector variant="light" languages={siteSettings.languages} />
          </div>
          <button
            ref={closeBtnRef}
            type="button"
            onClick={() => {
              setMobileOpen(false);
              requestAnimationFrame(() => menuTriggerRef.current?.focus());
            }}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-600 shadow-sm transition-colors hover:border-stone-300 hover:bg-stone-50 hover:text-stone-900"
            aria-label={chrome.mobileDrawerCloseAriaLabel}
          >
            <X className="h-5 w-5" strokeWidth={2.25} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain [scrollbar-color:rgba(28,25,23,0.2)_transparent] [scrollbar-width:thin]">
          <nav className="px-3 py-4" aria-label="Primary navigation">
            <ul className="space-y-0.5">
              {primaryNav.map((item) => {
                const Icon = drawerIconForHref(item.href);
                const hasSubs = Boolean(item.subLinks?.length);
                const expanded = Boolean(openSubmenus[item.href]);
                const panelId = submenuPanelId(item.href);

                if (hasSubs) {
                  return (
                    <li key={`${item.href}-${item.label}`}>
                      <div className="flex items-stretch overflow-hidden rounded-none ring-1 ring-transparent hover:ring-stone-200/80">
                        <Link
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                          className={`${navLinkClass} min-w-0 flex-1 rounded-r-none`}
                        >
                          <span className={iconWrapClass}>
                            <Icon className="h-[1.125rem] w-[1.125rem]" strokeWidth={2} aria-hidden />
                          </span>
                          <span className="min-w-0 flex-1 font-sans text-[0.8125rem] font-semibold leading-snug">
                            {item.label}
                          </span>
                        </Link>
                        <button
                          type="button"
                          onClick={() => toggleSubmenu(item.href)}
                          className="flex w-12 shrink-0 items-center justify-center border-l border-stone-200/90 bg-white text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-700"
                          aria-expanded={expanded}
                          aria-controls={panelId}
                          aria-label={expanded ? `Collapse ${item.label} submenu` : `Expand ${item.label} submenu`}
                        >
                          <ChevronDown
                            className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`}
                            aria-hidden
                          />
                        </button>
                      </div>
                      {expanded && item.subLinks?.length ? (
                        <ul
                          id={panelId}
                          className="mb-2 ml-[0.875rem] mt-1 space-y-0.5 border-l-2 border-accent-200 pl-3"
                        >
                          {item.subLinks.map((sub) => {
                            const SubIcon = drawerIconForHref(sub.href);
                            return (
                              <li key={sub.href}>
                                <Link
                                  href={sub.href}
                                  onClick={() => setMobileOpen(false)}
                                  className="group flex items-center gap-2.5 rounded-lg px-2 py-2.5 text-sm font-medium text-stone-800 transition-colors hover:bg-stone-50"
                                >
                                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-stone-50 text-accent-700 ring-1 ring-stone-200/80">
                                    <SubIcon className="h-4 w-4" strokeWidth={2} aria-hidden />
                                  </span>
                                  <span className="min-w-0 flex-1 font-sans font-medium leading-snug tracking-normal">
                                    {sub.label}
                                  </span>
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      ) : null}
                    </li>
                  );
                }

                return (
                  <li key={`${item.href}-${item.label}`}>
                    <Link href={item.href} onClick={() => setMobileOpen(false)} className={navLinkClass}>
                      <span className={iconWrapClass}>
                        <Icon className="h-[1.125rem] w-[1.125rem]" strokeWidth={2} aria-hidden />
                      </span>
                      <span className="min-w-0 flex-1 font-sans text-[0.8125rem] font-semibold leading-snug">
                        {item.label}
                      </span>
                      <ChevronRight
                        className="h-4 w-4 shrink-0 text-stone-400 transition-transform group-hover:translate-x-0.5 group-hover:text-stone-500"
                        aria-hidden
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Email + socials (search / contact use header controls) */}
          <section className="mx-3 mb-4 mt-1 rounded-none border border-stone-200/95 bg-stone-50/90 p-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
            <p className="mb-3 px-1 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-stone-500">
              Get in touch
            </p>
            <a
              href={`mailto:${siteSettings.email.programs}`}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 rounded-none border border-stone-200/80 bg-white px-3 py-3 text-left shadow-sm transition-colors hover:border-stone-300 hover:bg-stone-50/80"
            >
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-none bg-stone-100 text-accent-800 ring-1 ring-stone-200/80"
                aria-hidden
              >
                <Mail className="h-[18px] w-[18px]" strokeWidth={2} />
              </span>
              <span className="min-w-0 flex-1 break-words text-sm font-medium leading-snug text-stone-800">
                {siteSettings.email.programs}
              </span>
            </a>
            <nav className="mt-4 border-t border-stone-200/80 pt-3" aria-label="Social media">
              <p className="sr-only">Follow us on social media</p>
              <ul className="flex flex-wrap gap-2">
                {publicSocialSlots(siteSettings).map(({ href, brand, label }) => (
                  <li key={brand}>
                    {href ? (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={drawerLightSocialClass}
                        aria-label={label}
                        onClick={() => setMobileOpen(false)}
                      >
                        <SocialBrandIcon brand={brand} className="h-[18px] w-[18px]" />
                      </a>
                    ) : (
                      <span
                        className="flex h-10 w-10 shrink-0 cursor-not-allowed items-center justify-center rounded-none bg-stone-200 text-stone-400 ring-1 ring-stone-300/80"
                        aria-label={`${label} — not configured`}
                        title="Add URL in Admin → Site settings → Social links"
                      >
                        <SocialBrandIcon brand={brand} className="h-[18px] w-[18px]" />
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          </section>
        </div>
      </aside>
    </>
  );
}
