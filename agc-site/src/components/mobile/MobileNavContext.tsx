"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

type MobileNavContextValue = {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  openMenu: () => void;
  openSearch: () => void;
};

const MobileNavContext = createContext<MobileNavContextValue | null>(null);

export function MobileNavProvider({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const openMenu = useCallback(() => setMobileOpen(true), []);
  const openSearch = useCallback(() => setSearchOpen(true), []);

  const value = useMemo(
    () => ({
      mobileOpen,
      setMobileOpen,
      searchOpen,
      setSearchOpen,
      openMenu,
      openSearch,
    }),
    [mobileOpen, searchOpen, openMenu, openSearch]
  );

  return <MobileNavContext.Provider value={value}>{children}</MobileNavContext.Provider>;
}

export function useMobileNav() {
  const ctx = useContext(MobileNavContext);
  if (!ctx) {
    throw new Error("useMobileNav must be used within MobileNavProvider");
  }
  return ctx;
}
