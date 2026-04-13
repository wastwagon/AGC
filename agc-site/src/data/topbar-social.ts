import type { LucideIcon } from "lucide-react";
import { Twitter, Linkedin, Instagram } from "lucide-react";

/** Shared control for top bar + mobile drawer (dark navy / drawer backgrounds). */
export const topbarDarkIconButtonClass =
  "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.11] ring-1 ring-white/[0.1] text-white/90 transition-[background-color,box-shadow,color] hover:bg-white/[0.2] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50";

/** Top bar / mobile drawer socials (fixed URLs; multiple LinkedIn showcase pages share the icon). */
export const TOPBAR_SOCIAL_LINKS: readonly { href: string; icon: LucideIcon; label: string }[] = [
  {
    href: "https://www.linkedin.com/company/africa-governance-centre-agc/",
    icon: Linkedin,
    label: "Africa Governance Centre on LinkedIn",
  },
  {
    href: "https://www.linkedin.com/showcase/african-youth-in-politics-forum/",
    icon: Linkedin,
    label: "African Youth in Politics Forum on LinkedIn",
  },
  {
    href: "https://x.com/AfricaGovCentre",
    icon: Twitter,
    label: "Africa Governance Centre on X",
  },
  {
    href: "https://www.instagram.com/africa_gov_centre/",
    icon: Instagram,
    label: "Africa Governance Centre on Instagram",
  },
  {
    href: "https://www.linkedin.com/showcase/africa-women-political-leadership-summit/",
    icon: Linkedin,
    label: "Africa Women Political Leadership Summit on LinkedIn",
  },
];
