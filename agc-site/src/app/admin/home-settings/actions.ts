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

function trimOrEmpty(value: string | undefined): string {
  return value?.trim() ?? "";
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
    heroBackgroundVideoSrc: d.heroBackgroundVideoSrc?.trim() ?? "",
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
      image: d.spotlightImage?.trim() ?? "",
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
    homeEventsTitle: d.homeEventsTitle ?? "",
  };

  const workPillarPatch = {
    pillarRowTitlePrimary: trimOrEmpty(d.pillarRowTitlePrimary),
    pillarRowTitleSecondary: trimOrEmpty(d.pillarRowTitleSecondary),
    pillarReadMoreLabel: trimOrEmpty(d.pillarReadMoreLabel),
    pillarCardImages: {
      programs: trimOrEmpty(d.pillarImagePrograms),
      projects: trimOrEmpty(d.pillarImageProjects),
      advisory: trimOrEmpty(d.pillarImageAdvisory),
      research: trimOrEmpty(d.pillarImageResearch),
      training: trimOrEmpty(d.pillarImageTraining),
      partnership: trimOrEmpty(d.pillarImagePartnership),
    },
  };

  try {
    await prisma.$transaction(async (tx) => {
      await tx.pageContent.upsert({
        where: { slug: "home" },
        create: { slug: "home", title: "Homepage", status: "published", contentJson: payload as Prisma.InputJsonValue },
        update: { title: "Homepage", contentJson: payload as Prisma.InputJsonValue },
      });

      const existingOurWork = await tx.pageContent.findUnique({
        where: { slug: "our-work" },
        select: { contentJson: true },
      });
      const currentOurWorkJson =
        existingOurWork?.contentJson && typeof existingOurWork.contentJson === "object" && !Array.isArray(existingOurWork.contentJson)
          ? (existingOurWork.contentJson as Record<string, unknown>)
          : {};
      const currentPillarImages =
        currentOurWorkJson.pillarCardImages &&
        typeof currentOurWorkJson.pillarCardImages === "object" &&
        !Array.isArray(currentOurWorkJson.pillarCardImages)
          ? (currentOurWorkJson.pillarCardImages as Record<string, unknown>)
          : {};

      const mergedOurWork = {
        ...currentOurWorkJson,
        ...workPillarPatch,
        pillarCardImages: {
          ...currentPillarImages,
          ...workPillarPatch.pillarCardImages,
        },
      };

      await tx.pageContent.upsert({
        where: { slug: "our-work" },
        create: {
          slug: "our-work",
          title: "Our Work",
          status: "published",
          contentJson: mergedOurWork as Prisma.InputJsonValue,
        },
        update: {
          title: "Our Work",
          contentJson: mergedOurWork as Prisma.InputJsonValue,
        },
      });
    });
  } catch (err) {
    console.error("updateHomeSettings:", err);
    redirect(`/admin/home-settings?error=${encodeURIComponent(ADMIN_DB_ERROR_MESSAGE)}`);
  }

  revalidatePath("/");
  revalidatePath("/our-work");
  revalidatePath("/admin/home-settings");
  redirect("/admin/home-settings?saved=1");
}
