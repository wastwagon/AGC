"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";
import type { SiteSettings } from "@/lib/site-settings";
import { preferUnoptimizedImage } from "@/lib/image-delivery";
import { NewsletterSignup } from "./NewsletterSignup";
import { SocialBrandIcon } from "@/components/SocialBrandIcon";
import { publicSocialSlots } from "@/data/public-social-row";
import { donateHref } from "@/data/content";

const iconBoxLightClass =
  "flex h-9 w-9 shrink-0 items-center justify-center rounded-none border border-accent-200/80 bg-white text-accent-600";

/**
 * Newsletter strip (accent) + institute-style light panel: wide brand column with **large logo**,
 * tagline, Donate, tel | email, social row — then link columns and contact + legal.
 */
export function Footer({ siteSettings, brandLogoSrc }: { siteSettings: SiteSettings; brandLogoSrc: string }) {
  const { footer: footerChrome, newsletter: newsletterCopy } = siteSettings.chrome;
  const socialRow = publicSocialSlots(siteSettings);
  const phoneClean = siteSettings.phone.replace(/\s/g, "");
  const contactLine = (
    <p className="mt-5 text-sm text-slate-600">
      <span className="font-medium text-slate-800">Tel:</span>{" "}
      <a href={`tel:${phoneClean}`} className="text-slate-700 underline decoration-slate-300 underline-offset-2 hover:text-accent-600">
        {siteSettings.phone}
      </a>
      <span className="mx-2 text-slate-300">|</span>
      <a
        href={`mailto:${siteSettings.email.programs}`}
        className="text-slate-700 underline decoration-slate-300 underline-offset-2 hover:text-accent-600"
      >
        {siteSettings.email.programs}
      </a>
    </p>
  );

  return (
    <footer className="relative overflow-hidden pb-[calc(4.25rem+env(safe-area-inset-bottom,0px))] md:pb-0">
      {/* —— Tier 1: Newsletter — */}
      <div id="newsletter" className="scroll-mt-24 bg-accent-600 px-4 py-14 text-white sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-6xl text-center">
          <h2 className="font-sans text-[1.35rem] font-semibold leading-tight tracking-tight text-white sm:text-2xl md:text-[1.75rem]">
            {newsletterCopy.heading}
          </h2>
          <div className="mx-auto mt-5 h-1.5 w-16 rounded-none bg-[#c86f2c]" aria-hidden />
          {newsletterCopy.description?.trim() ? (
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/70 sm:text-[15px]">
              {newsletterCopy.description}
            </p>
          ) : null}
          <div className="mx-auto mt-8 w-full max-w-2xl sm:max-w-3xl">
            <NewsletterSignup copy={newsletterCopy} variant="footerHero" />
          </div>
        </div>
      </div>

      {/* —— Tier 2: Light panel — three columns (large logo + links + contact & legal) — */}
      <div className="border-t border-white/15 bg-white text-slate-800">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-10 xl:gap-14">
            {/* Column 1 — brand: large logo, blurb, Donate, contact line, socials */}
            <div className="min-h-0 lg:col-span-5">
              <Link href="/" className="inline-block w-full max-w-[min(100%,22rem)] sm:max-w-[26rem] lg:max-w-[min(100%,28rem)]">
                <Image
                  src={brandLogoSrc}
                  alt={siteSettings.name}
                  width={480}
                  height={160}
                  className="h-auto w-full object-contain object-left"
                  unoptimized={preferUnoptimizedImage(brandLogoSrc)}
                />
              </Link>
              <p className="mt-6 max-w-xl text-[15px] leading-[1.85] text-slate-600">{siteSettings.tagline}</p>
              <Link
                href={donateHref}
                className="mt-8 inline-flex min-h-[44px] items-center justify-center rounded-none bg-accent-600 px-8 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-accent-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-600"
              >
                Donate
              </Link>
              {contactLine}
              <nav className="mt-6" aria-label="Social media">
                <ul className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                  {socialRow.map(({ href, brand, label }) => (
                    <li key={label}>
                      {href ? (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-accent-600 shadow-sm transition-colors hover:border-slate-300 hover:bg-slate-50"
                          aria-label={label}
                        >
                          <SocialBrandIcon brand={brand} />
                        </a>
                      ) : (
                        <span
                          className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-accent-600/35 shadow-sm"
                          aria-label={`${label} — add URL in Site settings`}
                          title="Add URL in Admin → Site settings → Social links"
                        >
                          <SocialBrandIcon brand={brand} />
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            {/* Column 2 — quick links */}
            <div className="lg:col-span-3 lg:pl-2">
              <h3 className="mb-5 font-sans text-base font-bold text-accent-600">{footerChrome.quickLinksHeading}</h3>
              <ul className="space-y-3">
                {footerChrome.quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[15px] text-slate-700 transition-colors hover:text-accent-600"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/get-involved" className="text-[15px] text-slate-700 transition-colors hover:text-accent-600">
                    {footerChrome.getInvolvedLabel}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3 — contact + legal */}
            <div className="lg:col-span-4 lg:border-l lg:border-slate-200/80 lg:pl-10">
              <h3 className="mb-5 font-sans text-base font-bold text-slate-900">{footerChrome.contactHeading}</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-[15px] text-slate-700">
                  <span className={iconBoxLightClass}>
                    <MapPin className="h-4 w-4" />
                  </span>
                  <span className="leading-relaxed">{siteSettings.address}</span>
                </li>
                <li>
                  <a
                    href={`tel:${phoneClean}`}
                    className="flex items-center gap-3 text-[15px] text-slate-700 transition-colors hover:text-accent-600"
                  >
                    <span className={iconBoxLightClass}>
                      <Phone className="h-4 w-4" />
                    </span>
                    {siteSettings.phone}
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${siteSettings.email.programs}`}
                    className="flex items-start gap-3 text-[15px] text-slate-700 transition-colors hover:text-accent-600"
                  >
                    <span className={iconBoxLightClass}>
                      <Mail className="h-4 w-4" />
                    </span>
                    <span className="break-all leading-relaxed">{siteSettings.email.programs}</span>
                  </a>
                </li>
              </ul>

              <h3 className="mb-5 mt-10 font-sans text-base font-bold text-accent-600">Legal</h3>
              <ul className="space-y-3">
                {footerChrome.legal.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-[15px] text-slate-700 transition-colors hover:text-accent-600">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* —— Tier 3: Copyright bar — */}
        <div className="border-t border-accent-600/90 bg-accent-600 py-5">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 text-center text-sm text-slate-600 sm:flex-row sm:px-6 sm:text-left lg:px-8">
            <p className="text-white">
              © {new Date().getFullYear()}{" "}
              <Link href="/" className="font-medium text-white transition-colors hover:text-accent-100">
                {siteSettings.name}
              </Link>. {footerChrome.rightsReserved}
            </p>
            <Link href="/admin/login" className="text-white transition-colors hover:text-accent-100">
              {footerChrome.adminLabel}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
