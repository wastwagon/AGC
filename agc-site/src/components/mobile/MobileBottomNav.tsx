"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import { Home, Layers, Calendar, Newspaper, Menu } from "lucide-react";
import { useMobileNav } from "./MobileNavContext";

type BottomNavTab = {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Opens the full navigation drawer instead of navigating */
  isMenu?: boolean;
};

const bottomIconByHref: Record<string, LucideIcon> = {
  "/": Home,
  "/our-work": Layers,
  "/events": Calendar,
  "/news": Newspaper,
  "__menu__": Menu,
};

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function MobileBottomNav({ bottomNav }: { bottomNav: { href: string; label: string }[] }) {
  const pathname = usePathname() ?? "/";
  const { openMenu } = useMobileNav();

  const tabs: BottomNavTab[] = bottomNav.map((t) => {
    const isMenu = t.href === "__menu__";
    const icon = bottomIconByHref[t.href] ?? Layers;
    return { href: t.href, label: t.label, icon, isMenu };
  });

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-[55] border-t border-white/20 bg-white backdrop-blur-xl shadow-[0_-8px_32px_-12px_rgba(14,31,38,0.18)] md:hidden"
      style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
      aria-label="Quick navigation"
    >
      <ul className="mx-auto flex max-w-lg items-stretch justify-around px-1 pt-1.5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = !tab.isMenu && isActive(pathname, tab.href);

          if (tab.isMenu) {
            return (
              <li key="menu" className="flex min-w-0 flex-1">
                <button
                  type="button"
                  onClick={openMenu}
                  className="flex w-full flex-col items-center gap-0.5 rounded-t-xl px-1 py-2 text-[0.65rem] font-semibold uppercase tracking-wide text-black transition-colors hover:text-accent-700"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent-100/90 text-accent-800 ring-1 ring-accent-200/60 shadow-sm">
                    <Icon className="h-5 w-5" strokeWidth={2.25} aria-hidden />
                  </span>
                  <span className="text-[0.6rem] leading-tight">{tab.label}</span>
                </button>
              </li>
            );
          }

          return (
            <li key={tab.href} className="flex min-w-0 flex-1">
              <Link
                href={tab.href}
                className={`flex w-full flex-col items-center gap-0.5 rounded-t-xl px-1 py-2 text-[0.65rem] font-semibold uppercase tracking-wide transition-colors ${
                  active
                    ? "text-accent-800"
                    : "text-black hover:text-accent-700"
                }`}
              >
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-2xl transition-all ${
                    active
                      ? "bg-accent-600 text-white shadow-md shadow-accent-600/25 ring-2 ring-accent-400/30"
                      : "bg-white/90 text-black ring-1 ring-border/80 shadow-sm"
                  }`}
                >
                  <Icon className="h-[1.15rem] w-[1.15rem]" strokeWidth={active ? 2.5 : 2} aria-hidden />
                </span>
                <span className="max-w-full truncate text-[0.6rem] leading-tight">{tab.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
