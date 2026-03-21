"use client";

import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { MobileNavProvider } from "./mobile/MobileNavContext";
import { MobileDrawer } from "./mobile/MobileDrawer";
import { MobileBottomNav } from "./mobile/MobileBottomNav";

/** Renders public site Header and Footer only on non-admin routes */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <MobileNavProvider>
      <div className="flex min-h-screen flex-1 flex-col">
        <Header />
        {/* Bottom padding on <xl so fixed tab bar + safe area don’t cover content */}
        <div className="flex min-h-0 flex-1 flex-col pb-[calc(4.5rem+env(safe-area-inset-bottom,0px))] xl:pb-0">
          {children}
        </div>
        <Footer />
        <MobileDrawer />
        <MobileBottomNav />
      </div>
    </MobileNavProvider>
  );
}
