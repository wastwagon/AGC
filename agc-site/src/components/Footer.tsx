"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, Mail, Twitter, Linkedin, Instagram, Facebook } from "lucide-react";
import { placeholderImages } from "@/data/images";
import type { SiteSettings } from "@/lib/site-settings";
import { preferUnoptimizedImage } from "@/lib/image-delivery";
import { NewsletterSignup } from "./NewsletterSignup";

const footerThumbImageByHref: Record<string, string> = {
  "/our-work/programs": placeholderImages.programs,
  "/our-work/projects": placeholderImages.projects,
  "/our-work/advisory": placeholderImages.advisory,
  "/app-summit": placeholderImages.appSummit,
  "/events": placeholderImages.events,
  "/news": placeholderImages.news,
};

/**
 * Consultar-style footer: dark navy upper (4 cols), darker lower (copyright)
 * Mobile-first: columns stack, enhanced spacing and accent highlights
 */
export function Footer({ siteSettings, brandLogoSrc }: { siteSettings: SiteSettings; brandLogoSrc: string }) {
  const { footer: footerChrome } = siteSettings.chrome;
  const footerWorkItems = footerChrome.workThumbnails.map((item) => ({
    href: item.href,
    alt: item.alt,
    image: footerThumbImageByHref[item.href] ?? placeholderImages.hero,
  }));
  const socialLinks = [
    { href: siteSettings.social.twitter, icon: Twitter, label: "Twitter" },
    { href: siteSettings.social.linkedin, icon: Linkedin, label: "LinkedIn" },
    { href: siteSettings.social.instagram, icon: Instagram, label: "Instagram" },
    { href: siteSettings.social.facebook, icon: Facebook, label: "Facebook" },
  ].filter((s) => s.href && s.href !== "#");
  return (
    <footer className="relative overflow-hidden border-t border-accent-500/30 bg-accent-900 pb-[calc(4.25rem+env(safe-area-inset-bottom,0px))] text-white xl:pb-0">
      {/* Upper footer - 4 columns */}
      <div className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-[60px] xl:py-[90px]">
        <div className="mx-auto w-full max-w-6xl">
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12 xl:gap-16">
            {/* 1. About widget */}
            <div className="min-h-0">
              <Link href="/" className="inline-block max-w-[180px]">
                <Image
                  src={brandLogoSrc}
                  alt={siteSettings.name}
                  width={160}
                  height={48}
                  className={`h-10 w-auto object-contain ${brandLogoSrc === "/agc-logo.png" ? "brightness-0 invert" : ""}`}
                  unoptimized={preferUnoptimizedImage(brandLogoSrc)}
                />
              </Link>
              <p className="mt-4 text-[15px] leading-[1.9] text-white/90">
                {siteSettings.tagline}
              </p>
              <ul className="mt-5 flex flex-wrap gap-3">
                {socialLinks.map(({ href, icon: Icon, label }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white transition-all hover:bg-accent-500 hover:text-white"
                      aria-label={label}
                    >
                      <Icon className="h-[18px] w-[18px]" />
                    </a>
                  </li>
                ))}
              </ul>
              <NewsletterSignup />
            </div>

            {/* 2. Contact */}
            <div className="lg:pl-0">
              <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider text-accent-300 sm:mb-8">
                {footerChrome.contactHeading}
              </h3>
              <ul className="space-y-5">
                <li className="flex items-start gap-3 text-[15px] text-white/90">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-accent-300">
                    <MapPin className="h-4 w-4" />
                  </span>
                  <span className="leading-relaxed">{siteSettings.address}</span>
                </li>
                <li>
                  <a
                    href={`tel:${siteSettings.phone.replace(/\s/g, "")}`}
                    className="flex items-center gap-3 text-[15px] text-white/90 transition-colors hover:text-accent-300"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-accent-300">
                      <Phone className="h-4 w-4" />
                    </span>
                    {siteSettings.phone}
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${siteSettings.email.programs}`}
                    className="flex items-start gap-3 text-[15px] text-white/90 transition-colors hover:text-accent-300"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-accent-300">
                      <Mail className="h-4 w-4" />
                    </span>
                    <span className="break-all leading-relaxed">{siteSettings.email.programs}</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* 3. Services / Quick Links */}
            <div className="lg:pl-0">
              <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider text-accent-300 sm:mb-8">
                {footerChrome.quickLinksHeading}
              </h3>
              <ul className="space-y-3">
                {footerChrome.quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[15px] text-white/90 transition-colors hover:text-accent-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href="/get-involved"
                    className="text-[15px] text-white/90 transition-colors hover:text-accent-300"
                  >
                    {footerChrome.getInvolvedLabel}
                  </Link>
                </li>
              </ul>
            </div>

            {/* 4. Projects / Our Work thumbnails */}
            <div>
              <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider text-accent-300 sm:mb-8">
                {footerChrome.ourWorkHeading}
              </h3>
              <ul className="grid grid-cols-3 gap-2">
                {footerWorkItems.map((item) => (
                  <li key={item.href} className="aspect-square">
                    <Link
                      href={item.href}
                      className="block h-full w-full overflow-hidden rounded-lg transition-all hover:ring-2 hover:ring-accent-400/50"
                    >
                      <Image
                        src={item.image}
                        alt={item.alt}
                        width={100}
                        height={100}
                        className="h-full w-full object-cover"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Lower footer - copyright */}
      <div className="border-t border-white/10 bg-black/25 py-6 text-center">
        <div className="px-4 sm:px-6 lg:px-8">
          <p className="text-[14px] text-white/80">
            © {new Date().getFullYear()}{" "}
            <Link href="/" className="text-white transition-colors hover:text-accent-300">
              {siteSettings.name}
            </Link>
            . {footerChrome.rightsReserved}
            <span className="mx-2">|</span>
            <Link
              href="/admin/login"
              className="text-white/70 transition-colors hover:text-accent-300"
            >
              {footerChrome.adminLabel}
            </Link>
            {footerChrome.legal.map((link) => (
              <span key={link.href}>
                <span className="mx-2">·</span>
                <Link href={link.href} className="text-white/90 transition-colors hover:text-accent-300">
                  {link.label}
                </Link>
              </span>
            ))}
          </p>
        </div>
      </div>
    </footer>
  );
}
