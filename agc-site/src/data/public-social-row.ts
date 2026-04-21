import type { SiteSettings } from "@/lib/site-settings";
import type { SocialBrand } from "@/components/SocialBrandIcon";
import { FOOTER_SOCIAL_DEFAULTS } from "@/data/footer-social-defaults";

export type PublicSocialSlot = { href: string | null; brand: SocialBrand; label: string };

export function pickPublicSocialHref(raw: string | undefined, fallback: string): string | null {
  const t = raw?.trim();
  if (t && t !== "#") return t;
  const f = fallback?.trim();
  return f || null;
}

/** Same four platforms and URL rules as the footer social row (X, Facebook, LinkedIn, Instagram). */
export function publicSocialSlots(settings: SiteSettings): PublicSocialSlot[] {
  const s = settings.social;
  const d = FOOTER_SOCIAL_DEFAULTS;
  return [
    { href: pickPublicSocialHref(s.twitter, d.twitter), brand: "twitter", label: "X (Twitter)" },
    { href: pickPublicSocialHref(s.facebook, d.facebook), brand: "facebook", label: "Facebook" },
    { href: pickPublicSocialHref(s.linkedin, d.linkedin), brand: "linkedin", label: "LinkedIn" },
    { href: pickPublicSocialHref(s.instagram, d.instagram), brand: "instagram", label: "Instagram" },
  ];
}
