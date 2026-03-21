"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import type { Prisma } from "@prisma/client";
import { getDefaultHomePageCms, type HomePageCms } from "@/lib/home-page-data";
import { ADMIN_DB_ERROR_MESSAGE } from "@/lib/admin-flash-messages";

export async function updateHomePageContent(formData: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const partnersRaw = String(formData.get("partners") ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  const heroSliderRaw = String(formData.get("hero_slider_images") ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .slice(0, 10);

  const defaults = getDefaultHomePageCms();
  const stats: HomePageCms["homeImpactStats"] = [];
  for (let i = 0; i < 4; i++) {
    const d = defaults.homeImpactStats[i];
    stats.push({
      value: String(formData.get(`stat${i}_value`) ?? d?.value ?? "").slice(0, 32),
      label: String(formData.get(`stat${i}_label`) ?? d?.label ?? "").slice(0, 200),
      note: String(formData.get(`stat${i}_note`) ?? d?.note ?? "").slice(0, 500),
    });
  }

  let paragraphs = [
    String(formData.get("spot_p1") ?? "").slice(0, 2000),
    String(formData.get("spot_p2") ?? "").slice(0, 2000),
  ].filter((p) => p.length > 0);
  if (paragraphs.length === 0) paragraphs = [...defaults.homeSpotlightStory.paragraphs];

  const contentJson: Record<string, unknown> = {
    heroSliderImages: heroSliderRaw,
    heroContent: {
      eyebrow: String(formData.get("hero_eyebrow") ?? "").slice(0, 500),
      title: String(formData.get("hero_title") ?? "").slice(0, 300),
      subtitle: String(formData.get("hero_subtitle") ?? "").slice(0, 2000),
      cta: String(formData.get("hero_cta") ?? "").slice(0, 120),
      ctaHref: String(formData.get("hero_ctaHref") ?? "/our-work").slice(0, 200),
      ctaSecondary: String(formData.get("hero_ctaSecondary") ?? "").slice(0, 120),
      ctaSecondaryHref: String(formData.get("hero_ctaSecondaryHref") ?? "").slice(0, 200),
    },
    homeTestimonial: {
      quote: String(formData.get("test_quote") ?? "").slice(0, 2500),
      name: String(formData.get("test_name") ?? "").slice(0, 200),
      title: String(formData.get("test_title") ?? "").slice(0, 200),
      organization: String(formData.get("test_org") ?? "").slice(0, 300),
      initials: String(formData.get("test_initials") ?? "").slice(0, 6).toUpperCase(),
    },
    homeSpotlightStory: {
      label: String(formData.get("spot_label") ?? "").slice(0, 120),
      headline: String(formData.get("spot_headline") ?? "").slice(0, 300),
      paragraphs,
      name: String(formData.get("spot_name") ?? "").slice(0, 200),
      role: String(formData.get("spot_role") ?? "").slice(0, 300),
      initials: String(formData.get("spot_initials") ?? "").slice(0, 6).toUpperCase(),
      ctaLabel: String(formData.get("spot_ctaLabel") ?? "").slice(0, 120),
      ctaHref: String(formData.get("spot_ctaHref") ?? "/news").slice(0, 200),
    },
    homeReach: {
      title: String(formData.get("reach_title") ?? "").slice(0, 200),
      intro: String(formData.get("reach_intro") ?? "").slice(0, 1000),
    },
    homeImpactMethodology: String(formData.get("methodology") ?? "").slice(0, 1500),
    homeImpactStats: stats,
    heroPartnerStrip:
      partnersRaw.length > 0 ? partnersRaw.slice(0, 12) : [...defaults.heroPartnerStrip],
    homePartnerBlurb: String(formData.get("partner_blurb") ?? "").slice(0, 500),
    status: formData.get("status") === "draft" ? "draft" : "published",
  };

  const status = contentJson.status === "draft" ? "draft" : "published";
  delete contentJson.status;

  const json = JSON.parse(JSON.stringify(contentJson)) as Prisma.InputJsonValue;

  try {
    await prisma.pageContent.upsert({
      where: { slug: "home" },
      create: {
        slug: "home",
        title: "Homepage",
        status,
        contentJson: json,
      },
      update: {
        status,
        contentJson: json,
      },
    });
  } catch (err) {
    console.error("updateHomePageContent:", err);
    redirect(`/admin/pages/home/edit?error=${encodeURIComponent(ADMIN_DB_ERROR_MESSAGE)}`);
  }

  revalidatePath("/");
  revalidatePath("/admin/pages");
  redirect("/admin/pages/home/edit?saved=1");
}
