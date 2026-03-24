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
    <div className="bg-[#1e3a5f] py-2">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <div className="flex flex-col items-center justify-between gap-2 md:flex-row md:items-center">
          <ul className="flex flex-wrap items-center justify-center gap-4 text-sm text-slate-200 md:justify-start">
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0" />
              <span>{siteSettings.address}</span>
            </li>
            <li>
              <a href={`mailto:${siteSettings.email.programs}`} className="flex items-center gap-2 text-white hover:text-accent-300 transition-colors">
                <Mail className="h-4 w-4 shrink-0" />
                {siteSettings.email.programs}
              </a>
            </li>
          </ul>
          {socialLinks.length > 0 && (
            <ul className="flex items-center gap-4 text-sm">
              <li className="text-slate-300">Follow us</li>
              {socialLinks.map(({ href, label }) => (
                <li key={label}>
                  <a href={href} target="_blank" rel="noopener noreferrer" className="text-white hover:text-accent-300 transition-colors" aria-label={label}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
