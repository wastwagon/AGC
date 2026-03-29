"use client";

import { MapPin, Mail } from "lucide-react";
import type { SiteSettings } from "@/lib/site-settings";

export function HeaderTopbar({ siteSettings }: { siteSettings: SiteSettings }) {
  const socialLinks = [
    { href: siteSettings.social.twitter, icon: "Twitter", label: "Twitter" },
    { href: siteSettings.social.linkedin, icon: "LinkedIn", label: "LinkedIn" },
    { href: siteSettings.social.instagram, icon: "Instagram", label: "Instagram" },
    { href: siteSettings.social.facebook, icon: "Facebook", label: "Facebook" },
  ].filter((s) => s.href && s.href !== "#");

  return (
    <div className="relative border-b border-black/[0.14] bg-gradient-to-b from-[#1a3555] via-[#1e3a5f] to-[#182f4d] shadow-[inset_0_1px_0_rgba(255,255,255,0.07)]">
      <div className="w-full px-4 py-3.5 sm:px-6 sm:py-3 md:py-2.5 lg:px-8 xl:px-12 2xl:px-16">
        <div className="mx-auto flex max-w-[90rem] flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-6">
          <address className="grid w-full min-w-0 gap-3.5 not-italic md:flex md:flex-row md:flex-wrap md:items-start md:gap-x-10 md:gap-y-2 lg:items-center">
            <div className="flex gap-3.5 text-left md:max-w-[min(100%,26rem)] lg:max-w-[32rem] xl:max-w-none">
              <span
                className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.11] ring-1 ring-white/[0.1]"
                aria-hidden
              >
                <MapPin className="h-[18px] w-[18px] text-white/90" strokeWidth={2} />
              </span>
              <span className="min-w-0 flex-1 pt-0.5 text-[0.8125rem] font-medium leading-[1.55] tracking-[0.01em] text-slate-100 sm:text-sm md:pt-1 md:leading-snug">
                {siteSettings.address}
              </span>
            </div>

            <a
              href={`mailto:${siteSettings.email.programs}`}
              className="group flex min-h-[44px] gap-3.5 border-t border-white/[0.12] pt-3.5 text-left md:min-h-0 md:border-t-0 md:border-l md:border-white/[0.14] md:pl-8 md:pt-0"
            >
              <span
                className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.11] ring-1 ring-white/[0.1] transition-[background-color,box-shadow] group-hover:bg-white/[0.17]"
                aria-hidden
              >
                <Mail className="h-[18px] w-[18px] text-white/90" strokeWidth={2} />
              </span>
              <span className="min-w-0 flex-1 self-center break-words text-[0.8125rem] font-medium leading-snug tracking-[0.01em] text-white underline-offset-2 transition-colors group-hover:text-accent-300 group-hover:underline sm:text-sm">
                {siteSettings.email.programs}
              </span>
            </a>
          </address>

          {socialLinks.length > 0 && (
            <div className="flex flex-col gap-2.5 border-t border-white/[0.12] pt-3.5 md:flex-row md:items-center md:border-t-0 md:border-l md:border-white/[0.14] md:pl-8 md:pt-0">
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-slate-400 md:shrink-0 md:pr-1 md:text-[0.7rem]">
                Follow us
              </p>
              <ul className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.8125rem] font-medium text-white/95 md:text-sm">
                {socialLinks.map(({ href, label }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-sm underline-offset-2 transition-colors hover:text-accent-300 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60"
                      aria-label={label}
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
