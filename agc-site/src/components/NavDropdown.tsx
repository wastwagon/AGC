"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

type NavDropdownProps = {
  label: string;
  href: string;
  items: { href: string; label: string }[];
};

export function NavDropdown({ label, href, items }: NavDropdownProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isActive = pathname === href || items.some((i) => pathname.startsWith(i.href));

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <Link
        href={href}
        className={`relative inline-flex items-center gap-1 px-3 py-4 text-base font-medium transition-colors hover:text-accent-600 lg:px-4 ${
          isActive ? "text-accent-600" : "text-[#232f4b]"
        }`}
      >
        <span className={`absolute left-1/2 top-0 h-1 w-0 -translate-x-1/2 rounded-sm bg-accent-500 transition-all duration-300 group-hover:w-3/4 group-hover:opacity-100 ${isActive ? "w-3/4 opacity-100" : "opacity-0"}`} />
        {label}
        <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </Link>
      {open && (
        <ul className="absolute left-0 top-full z-50 min-w-[220px] rounded-md bg-white py-5 shadow-[0px_2px_20px_rgba(62,65,159,0.09)]">
          {items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`block px-5 py-2.5 text-base font-medium transition-colors hover:text-accent-600 ${
                  pathname === item.href ? "text-accent-600" : "text-slate-600"
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
