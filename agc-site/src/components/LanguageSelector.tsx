"use client";

import { useState } from "react";
import { Globe } from "lucide-react";
import { siteConfig } from "@/data/content";

export function LanguageSelector() {
  const [open, setOpen] = useState(false);
  const languages = siteConfig.languages ?? [{ code: "en", label: "English" }];
  const current = languages[0];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label="Select your preferred language"
      >
        <Globe className="h-4 w-4" />
        {current?.label ?? "English"}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" aria-hidden onClick={() => setOpen(false)} />
          <ul
            role="listbox"
            className="absolute right-0 top-full z-50 mt-1 min-w-[140px] rounded-lg border border-slate-200 bg-white py-1 shadow-lg"
          >
            {languages.map((lang) => (
              <li
                key={lang.code}
                role="option"
                aria-selected={current?.code === lang.code}
              >
                <span className="block px-4 py-2 text-sm text-slate-700">{lang.label}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
