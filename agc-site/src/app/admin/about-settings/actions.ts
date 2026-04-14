"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { aboutSettingsFormSchema } from "@/lib/validations";
import { ADMIN_DB_ERROR_MESSAGE } from "@/lib/admin-flash-messages";

export async function updateAboutSettings(formData: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const raw = Object.fromEntries(formData.entries());
  const parsed = aboutSettingsFormSchema.safeParse(raw);
  if (!parsed.success) {
    redirect(`/admin/about-settings?error=${encodeURIComponent(parsed.error.issues[0]?.message || "Invalid input")}`);
  }
  const d = parsed.data;

  const existing = await prisma.pageContent.findUnique({ where: { slug: "about" } });
  const prevJson =
    existing?.contentJson && typeof existing.contentJson === "object" && !Array.isArray(existing.contentJson)
      ? ({ ...(existing.contentJson as Record<string, unknown>) } as Record<string, unknown>)
      : {};

  const teamHero = d.teamHeroImage?.trim();
  const payload = {
    ...prevJson,
    title: d.title,
    hero: { subtitle: d.heroSubtitle },
    intro: d.intro,
    description: d.description,
    mission: d.mission,
    strategicObjectives: {
      title: d.strategicTitle,
      content: d.strategicContent,
      principles: d.strategicPrinciples,
      agenda2063: d.strategicAgenda2063,
    },
    heroImage: d.heroImage || undefined,
    whoWeAreImage: d.whoWeAreImage || undefined,
    sectionImage: d.sectionImage || undefined,
    teamPage: {
      title: d.teamPageTitle,
      subtitle: d.teamPageSubtitle,
      ...(teamHero ? { heroImage: teamHero } : {}),
    },
  };

  try {
    await prisma.pageContent.upsert({
      where: { slug: "about" },
      create: {
        slug: "about",
        title: d.title,
        status: "published",
        heroSubtitle: d.heroSubtitle,
        intro: d.intro,
        description: d.description,
        mission: d.mission,
        objectivesTitle: d.strategicTitle,
        objectivesContent: d.strategicContent,
        objectivesPrinciples: d.strategicPrinciples,
        objectivesAgenda2063: d.strategicAgenda2063,
        contentJson: payload as Prisma.InputJsonValue,
      },
      update: {
        title: d.title,
        heroSubtitle: d.heroSubtitle,
        intro: d.intro,
        description: d.description,
        mission: d.mission,
        objectivesTitle: d.strategicTitle,
        objectivesContent: d.strategicContent,
        objectivesPrinciples: d.strategicPrinciples,
        objectivesAgenda2063: d.strategicAgenda2063,
        contentJson: payload as Prisma.InputJsonValue,
      },
    });
  } catch (err) {
    console.error("updateAboutSettings:", err);
    redirect(`/admin/about-settings?error=${encodeURIComponent(ADMIN_DB_ERROR_MESSAGE)}`);
  }

  revalidatePath("/about");
  revalidatePath("/about/team");
  revalidatePath("/admin/about-settings");
  redirect("/admin/about-settings?saved=1");
}
