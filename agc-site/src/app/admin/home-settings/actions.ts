"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { homeSettingsFormSchema } from "@/lib/validations";
import { ADMIN_DB_ERROR_MESSAGE } from "@/lib/admin-flash-messages";

function splitLines(input: string | undefined): string[] {
  return (input || "").split("\n").map((x) => x.trim()).filter(Boolean);
}

export async function updateHomeSettings(formData: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const raw = Object.fromEntries(formData.entries());
  const parsed = homeSettingsFormSchema.safeParse(raw);
  if (!parsed.success) {
    redirect(`/admin/home-settings?error=${encodeURIComponent(parsed.error.issues[0]?.message || "Invalid input")}`);
  }
  const d = parsed.data;

  const impactStats = splitLines(d.impactStats).map((line) => {
    const [value = "", label = "", note = ""] = line.split("|").map((x) => x.trim());
    return { value, label, note };
  }).filter((s) => s.value || s.label || s.note);

  const payload = {
    heroSliderImages: splitLines(d.heroSliderImages),
    heroContent: {
      eyebrow: d.heroEyebrow,
      title: d.heroTitle,
      subtitle: d.heroSubtitle,
      cta: d.heroCta,
      ctaHref: d.heroCtaHref,
      ctaSecondary: d.heroCtaSecondary,
      ctaSecondaryHref: d.heroCtaSecondaryHref,
    },
    homeReach: {
      title: d.homeReachTitle,
      intro: d.homeReachIntro,
    },
    homeImpactMethodology: d.homeImpactMethodology,
    homePartnerBlurb: d.homePartnerBlurb,
    heroPartnerStrip: splitLines(d.heroPartnerStrip),
    homeImpactStats: impactStats,
    homeTestimonial: {
      quote: d.testimonialQuote,
      name: d.testimonialName,
      title: d.testimonialTitle,
      organization: d.testimonialOrganization,
      initials: d.testimonialInitials,
    },
    homeSpotlightStory: {
      label: d.spotlightLabel,
      headline: d.spotlightHeadline,
      paragraphs: splitLines(d.spotlightParagraphs),
      name: d.spotlightName,
      role: d.spotlightRole,
      initials: d.spotlightInitials,
      ctaLabel: d.spotlightCtaLabel,
      ctaHref: d.spotlightCtaHref,
    },
    homeCtaBand: {
      eyebrow: d.ctaBandEyebrow ?? "",
      title: d.ctaBandTitle ?? "",
      body: d.ctaBandBody ?? "",
      primaryCta: d.ctaBandPrimaryCta ?? "",
      primaryHref: d.ctaBandPrimaryHref ?? "/get-involved",
      secondaryCta: d.ctaBandSecondaryCta ?? "",
      secondaryHref: d.ctaBandSecondaryHref ?? "/about",
    },
    homeNewsTeaser: {
      title: d.homeNewsTitle ?? "",
      subtitle: d.homeNewsSubtitle ?? "",
    },
    homeAppSummitTeaser: {
      title: d.homeAppSummitTitle ?? "",
      description: d.homeAppSummitDescription ?? "",
      ctaLabel: d.homeAppSummitCtaLabel ?? "",
      ctaHref: d.homeAppSummitCtaHref ?? "/app-summit",
    },
  };

  try {
    await prisma.pageContent.upsert({
      where: { slug: "home" },
      create: { slug: "home", title: "Homepage", status: "published", contentJson: payload as Prisma.InputJsonValue },
      update: { title: "Homepage", contentJson: payload as Prisma.InputJsonValue },
    });
  } catch (err) {
    console.error("updateHomeSettings:", err);
    redirect(`/admin/home-settings?error=${encodeURIComponent(ADMIN_DB_ERROR_MESSAGE)}`);
  }

  revalidatePath("/");
  revalidatePath("/admin/home-settings");
  redirect("/admin/home-settings?saved=1");
}
