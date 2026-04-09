"use client";

import { useEffect, useMemo, useState } from "react";
import { Globe } from "lucide-react";
import type { SiteSettings } from "@/lib/site-settings";

type LanguageSelectorProps = { variant?: "light" | "dark"; languages?: SiteSettings["languages"] };

const DEFAULT_LANGUAGE_OPTIONS: SiteSettings["languages"] = [
  { code: "en", label: "English" },
  { code: "fr", label: "Français" },
  { code: "pt", label: "Português" },
  { code: "sw", label: "Kiswahili" },
  { code: "am", label: "አማርኛ" },
  { code: "es", label: "Español" },
  { code: "ha", label: "Hausa" },
];
const GOOGLE_INCLUDED_LANGS = DEFAULT_LANGUAGE_OPTIONS.map((x) => x.code).join(",");

declare global {
  interface Window {
    google?: {
      translate?: {
        TranslateElement?: new (
          options: Record<string, unknown>,
          elementId: string
        ) => unknown;
      };
    };
    googleTranslateElementInit?: () => void;
  }
}

export function LanguageSelector({ variant = "light", languages }: LanguageSelectorProps) {
  const [open, setOpen] = useState(false);
  const hasCustomLanguages = Array.isArray(languages) && languages.length > 1;
  const languageList = hasCustomLanguages ? languages : DEFAULT_LANGUAGE_OPTIONS;
  const [selectedCode, setSelectedCode] = useState(languageList[0]?.code ?? "en");
  const current = useMemo(
    () => languageList.find((lang) => lang.code === selectedCode) ?? languageList[0],
    [languageList, selectedCode]
  );

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("agc:preferred-language");
      if (!saved) return;
      if (languageList.some((lang) => lang.code === saved)) setSelectedCode(saved);
    } catch {
      // Ignore storage failures.
    }
  }, [languageList]);

  useEffect(() => {
    if (document.getElementById("agc-google-translate-script")) return;
    window.googleTranslateElementInit = () => {
      if (!window.google?.translate?.TranslateElement) return;
      new window.google.translate.TranslateElement(
        { pageLanguage: "en", autoDisplay: false, includedLanguages: GOOGLE_INCLUDED_LANGS },
        "agc-google-translate-element"
      );
    };
    const script = document.createElement("script");
    script.id = "agc-google-translate-script";
    script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const setGoogleTranslateCookie = (code: string) => {
    const val = `/en/${code}`;
    document.cookie = `googtrans=${val};path=/`;
    document.cookie = `googtrans=${val};domain=${window.location.hostname};path=/`;
  };

  const onSelectLanguage = (code: string) => {
    setSelectedCode(code);
    setOpen(false);
    try {
      window.localStorage.setItem("agc:preferred-language", code);
    } catch {
      // Ignore storage failures.
    }
    const combo = document.querySelector(".goog-te-combo") as HTMLSelectElement | null;
    if (combo) {
      combo.value = code;
      combo.dispatchEvent(new Event("change"));
      return;
    }
    // Fallback for slow script load/init: set cookie and refresh.
    setGoogleTranslateCookie(code);
    window.location.reload();
  };

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
            {languageList.map((lang) => (
              <li
                key={lang.code}
                role="option"
                aria-selected={current?.code === lang.code}
              >
                <button
                  type="button"
                  onClick={() => onSelectLanguage(lang.code)}
                  className={`block px-4 py-2 text-sm ${
                    variant === "dark"
                      ? "w-full text-left text-white/95 hover:bg-white/10"
                      : "w-full text-left text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {lang.label}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
      <div id="agc-google-translate-element" className="sr-only" aria-hidden />
    </div>
  );
}
