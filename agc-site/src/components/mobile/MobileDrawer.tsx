"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  Home,
  Building2,
  Layers,
  Landmark,
  Calendar,
  Newspaper,
  HeartHandshake,
  Mail,
  Search,
  X,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import { LanguageSelector } from "@/components/LanguageSelector";
import type { SiteSettings } from "@/lib/site-settings";
import { useMobileNav } from "./MobileNavContext";

const drawerIconByHref: Record<string, LucideIcon> = {
  "/": Home,
  "/about": Building2,
  "/our-work": Layers,
  "/app-summit": Landmark,
  "/events": Calendar,
  "/news": Newspaper,
  "/publications": BookOpen,
  "/get-involved": HeartHandshake,
  "/contact": Mail,
};

function drawerIconForHref(href: string): LucideIcon {
  return drawerIconByHref[href] ?? Layers;
}

export function MobileDrawer({ siteSettings }: { siteSettings: SiteSettings }) {
  const primaryNav = siteSettings.chrome.nav;
  const chrome = siteSettings.chrome;
  const { mobileOpen, setMobileOpen, setSearchOpen, menuTriggerRef } = useMobileNav();
  const closeBtnRef = useRef<HTMLButtonElement>(null);

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

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-[60] bg-stone-950/55 backdrop-blur-[2px] transition-opacity lg:hidden"
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
        className={`fixed left-0 top-0 z-[70] flex h-[100dvh] w-[min(88vw,20rem)] max-w-[22rem] flex-col bg-gradient-to-b from-accent-900 via-[#152a32] to-accent-950 shadow-[8px_0_40px_-12px_rgba(0,0,0,0.45)] transition-transform duration-300 ease-out motion-reduce:transition-none lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full pointer-events-none"
        }`}
        aria-hidden={!mobileOpen}
      >
        {/* Header — close */}
        <div className="flex shrink-0 items-center justify-end gap-2 border-b border-white/10 px-4 py-3.5">
          <button
            ref={closeBtnRef}
            type="button"
            onClick={() => {
              setMobileOpen(false);
              requestAnimationFrame(() => menuTriggerRef.current?.focus());
            }}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            aria-label={chrome.mobileDrawerCloseAriaLabel}
          >
            <X className="h-5 w-5" strokeWidth={2.25} />
          </button>
        </div>

        {/* Scrollable nav — all items visible */}
        <nav
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-3 [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.25)_transparent]"
          aria-label="Primary navigation"
        >
          <ul className="space-y-0.5">
            {primaryNav.map((item) => {
              const Icon = drawerIconForHref(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="group flex items-center gap-3 rounded-xl px-3 py-3 text-[0.9375rem] font-medium text-white transition-colors hover:bg-white/10 active:bg-white/15"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-accent-100 ring-1 ring-white/10">
                      <Icon className="h-[1.125rem] w-[1.125rem]" strokeWidth={2} aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1 font-[family-name:var(--font-fraunces)] text-base tracking-tight">
                      {item.label}
                    </span>
                    <ChevronRight className="h-4 w-4 shrink-0 text-white/35 transition-transform group-hover:translate-x-0.5 group-hover:text-white/60" aria-hidden />
                  </Link>
                  {item.subLinks && item.subLinks.length > 0 ? (
                    <ul className="ml-[3.25rem] mt-1 space-y-0.5 border-l border-white/15 pl-3 pb-2">
                      {item.subLinks.map((sub) => (
                        <li key={sub.href}>
                          <Link
                            href={sub.href}
                            onClick={() => setMobileOpen(false)}
                            className="flex items-center gap-2 rounded-lg py-2.5 pl-1 text-sm text-white/80 transition-colors hover:text-white"
                          >
                            <BookOpen className="h-3.5 w-3.5 shrink-0 text-accent-200/80" aria-hidden />
                            {sub.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              );
            })}
          </ul>

          <button
            type="button"
            onClick={() => {
              setMobileOpen(false);
              setSearchOpen(true);
            }}
            className="mt-4 flex w-full items-center gap-3 rounded-xl border border-white/15 bg-white/5 px-3 py-3.5 text-left text-white transition-colors hover:bg-white/10"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-500/30 text-accent-100">
              <Search className="h-[1.125rem] w-[1.125rem]" strokeWidth={2} aria-hidden />
            </span>
            <span className="font-[family-name:var(--font-fraunces)] text-base">{chrome.mobileSearchButtonLabel}</span>
          </button>
        </nav>

        {/* Footer strip — language + CTA */}
        <div className="shrink-0 space-y-3 border-t border-white/10 bg-accent-950/80 px-3 py-4 backdrop-blur-sm">
          <div className="rounded-xl bg-white/5 px-2 py-2 ring-1 ring-white/10">
            <p className="mb-2 px-1 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-accent-200/90">
              {chrome.mobileLanguageEyebrow}
            </p>
            <LanguageSelector variant="dark" languages={siteSettings.languages} />
          </div>
          <Link
            href="/contact"
            onClick={() => setMobileOpen(false)}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3.5 text-center font-semibold text-accent-900 shadow-md transition hover:bg-accent-50"
          >
            <Mail className="h-4 w-4" aria-hidden />
            {chrome.mobileDrawerContactCta}
          </Link>
        </div>
      </aside>
    </>
  );
}
