"use client";

import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { MobileNavProvider, useMobileNav } from "./mobile/MobileNavContext";
import { MobileDrawer } from "./mobile/MobileDrawer";
import { MobileBottomNav } from "./mobile/MobileBottomNav";
import type { SiteSettings } from "@/lib/site-settings";

/**
 * When the drawer is open, main/footer/nav below the header are inert.
 * Header stays interactive so the menu toggle can close the drawer.
 */
function PublicLayoutWithInert({
  children,
  siteSettings,
  brandLogoSrc,
}: {
  children: React.ReactNode;
  siteSettings: SiteSettings;
  brandLogoSrc: string;
}) {
  const { mobileOpen } = useMobileNav();
  return (
    <div className="flex min-h-screen flex-1 flex-col">
      <Header siteSettings={siteSettings} brandLogoSrc={brandLogoSrc} />
      <div
        className="flex min-h-0 flex-1 flex-col"
        {...(mobileOpen ? { inert: true as boolean } : {})}
        aria-hidden={mobileOpen}
      >
        {/* Bottom padding on <xl so fixed tab bar + safe area don’t cover content */}
        <div className="flex min-h-0 flex-1 flex-col pb-[calc(4.5rem+env(safe-area-inset-bottom,0px))] xl:pb-0">
          {children}
        </div>
        <Footer siteSettings={siteSettings} brandLogoSrc={brandLogoSrc} />
        <MobileBottomNav />
      </div>
      <MobileDrawer siteSettings={siteSettings} brandLogoSrc={brandLogoSrc} />
    </div>
  );
}

/** Renders public site Header and Footer only on non-admin routes */
export function SiteChrome({
  children,
  siteSettings,
  brandLogoSrc = "/agc-logo.png",
}: {
  children: React.ReactNode;
  siteSettings: SiteSettings;
  brandLogoSrc?: string;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <MobileNavProvider>
      <PublicLayoutWithInert siteSettings={siteSettings} brandLogoSrc={brandLogoSrc}>
        {children}
      </PublicLayoutWithInert>
    </MobileNavProvider>
  );
}
