"use client";

import { useState } from "react";
import { Globe } from "lucide-react";
import { siteConfig } from "@/data/content";

type LanguageSelectorProps = { variant?: "light" | "dark" };

export function LanguageSelector({ variant = "light" }: LanguageSelectorProps) {
  const [open, setOpen] = useState(false);
  const languages = siteConfig.languages ?? [{ code: "en", label: "English" }];
  const current = languages[0];

  const btn =
    variant === "dark"
      ? "inline-flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-white hover:bg-white/10 transition-colors"
      : "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors";

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={btn}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label="Select your preferred language"
      >
        <Globe className={`h-4 w-4 ${variant === "dark" ? "text-accent-200" : ""}`} />
        {current?.label ?? "English"}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-[80]" aria-hidden onClick={() => setOpen(false)} />
          <ul
            role="listbox"
            className={`absolute left-0 right-0 top-full z-[90] mt-1 min-w-[140px] rounded-lg border py-1 shadow-lg ${
              variant === "dark"
                ? "border-white/15 bg-accent-900 text-white ring-1 ring-white/10"
                : "border-slate-200 bg-white"
            }`}
          >
            {languages.map((lang) => (
              <li
                key={lang.code}
                role="option"
                aria-selected={current?.code === lang.code}
              >
                <span
                  className={`block px-4 py-2 text-sm ${
                    variant === "dark" ? "text-white/95 hover:bg-white/10" : "text-slate-700"
                  }`}
                >
                  {lang.label}
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
