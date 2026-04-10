"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";

type MobileNavContextValue = {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  openMenu: () => void;
  openSearch: () => void;
  /** Hamburger / close button in Header — for returning focus when drawer closes */
  menuTriggerRef: React.RefObject<HTMLButtonElement | null>;
};

const MobileNavContext = createContext<MobileNavContextValue | null>(null);

export function MobileNavProvider({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const menuTriggerRef = useRef<HTMLButtonElement>(null);

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
      menuTriggerRef,
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

/** For components (e.g. {@link HeaderTopbar}) that may render in admin without {@link MobileNavProvider}. */
export function useOptionalMobileNav() {
  return useContext(MobileNavContext);
}
