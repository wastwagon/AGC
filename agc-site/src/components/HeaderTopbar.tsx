"use client";

import { MapPin, Mail, Twitter, Linkedin, Instagram, Facebook } from "lucide-react";
import type { SiteSettings } from "@/lib/site-settings";

const iconBtnClass =
  "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.11] ring-1 ring-white/[0.1] text-white/90 transition-[background-color,box-shadow,color] hover:bg-white/[0.2] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50";

export function HeaderTopbar({ siteSettings }: { siteSettings: SiteSettings }) {
  const socialLinks = [
    { href: siteSettings.social.twitter, icon: Twitter, label: "Twitter" },
    { href: siteSettings.social.linkedin, icon: Linkedin, label: "LinkedIn" },
    { href: siteSettings.social.instagram, icon: Instagram, label: "Instagram" },
    { href: siteSettings.social.facebook, icon: Facebook, label: "Facebook" },
  ].filter((s) => s.href && s.href !== "#");

  return (
    <div className="relative border-b border-black/[0.14] bg-gradient-to-b from-[#1a3555] via-[#1e3a5f] to-[#182f4d] shadow-[inset_0_1px_0_rgba(255,255,255,0.07)]">
      <div className="w-full px-4 py-3.5 sm:px-6 sm:py-3 md:py-2.5 lg:px-8 xl:px-12 2xl:px-16">
        <div className="mx-auto flex max-w-[90rem] flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-6">
          <address className="grid w-full min-w-0 flex-1 gap-3.5 not-italic md:flex md:flex-row md:flex-wrap md:items-center md:gap-x-10 md:gap-y-2 lg:items-center">
            <div className="flex gap-3.5 text-left md:max-w-[min(100%,26rem)] lg:max-w-[32rem] xl:max-w-none">
              <span className={iconBtnClass} aria-hidden>
                <MapPin className="h-[18px] w-[18px]" strokeWidth={2} />
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
                className={`${iconBtnClass} group-hover:bg-white/[0.17]`}
                aria-hidden
              >
                <Mail className="h-[18px] w-[18px]" strokeWidth={2} />
              </span>
              <span className="min-w-0 flex-1 self-center break-words text-[0.8125rem] font-medium leading-snug tracking-[0.01em] text-white underline-offset-2 transition-colors group-hover:text-accent-300 group-hover:underline sm:text-sm">
                {siteSettings.email.programs}
              </span>
            </a>
          </address>

          {socialLinks.length > 0 ? (
            <nav
              className="flex shrink-0 items-center justify-start border-t border-white/[0.12] pt-3.5 md:ml-auto md:justify-end md:border-l md:border-t-0 md:border-white/[0.14] md:pl-8 md:pt-0"
              aria-label="Social media"
            >
              <p className="sr-only">Follow us on social media</p>
              <ul className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                {socialLinks.map(({ href, icon: Icon, label }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={iconBtnClass}
                      aria-label={label}
                    >
                      <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
        </div>
      </div>
    </div>
  );
}
