"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { aboutSettingsFormSchema } from "@/lib/validations";
import { ADMIN_DB_ERROR_MESSAGE } from "@/lib/admin-flash-messages";

function parseTeamTabsConfig(input: string | undefined): { key: string; label: string }[] {
  const lines = (input ?? "")
    .split("\n")
    .map((x) => x.trim())
    .filter(Boolean);
  const out: { key: string; label: string }[] = [];
  const seen = new Set<string>();
  for (const line of lines) {
    const [rawKey = "", ...rest] = line.split("|");
    const key = rawKey.trim().toLowerCase().replace(/\s+/g, "_");
    const label = rest.join("|").trim();
    if (!key || !label || seen.has(key)) continue;
    seen.add(key);
    out.push({ key, label });
  }
  return out;
}

function splitLines(input: string | undefined): string[] {
  return (input ?? "")
    .split("\n")
    .map((x) => x.trim())
    .filter(Boolean);
}

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
  const teamTabsList = parseTeamTabsConfig(d.teamTabsConfig);
  const previousDeliveryPoints = Array.isArray(prevJson.deliveryPoints)
    ? (prevJson.deliveryPoints as Array<Record<string, unknown>>)
    : [];
  const deliveryPoints = [1, 2, 3, 4].map((n, idx) => {
    const prev = previousDeliveryPoints[idx] ?? {};
    const title =
      (d[`deliveryTitle${n}` as keyof typeof d] as string | undefined)?.trim() ||
      (typeof prev.title === "string" ? prev.title : "");
    const body =
      (d[`deliveryBody${n}` as keyof typeof d] as string | undefined)?.trim() ||
      (typeof prev.body === "string" ? prev.body : "");
    const image =
      (d[`deliveryImage${n}` as keyof typeof d] as string | undefined)?.trim() ||
      (typeof prev.image === "string" ? prev.image : "");
    return { title, body, ...(image ? { image } : {}) };
  });
  const payload = {
    ...prevJson,
    title: d.title,
    hero: { subtitle: d.heroSubtitle },
    intro: d.intro ?? (typeof prevJson.intro === "string" ? prevJson.intro : ""),
    description:
      d.description ?? (typeof prevJson.description === "string" ? prevJson.description : ""),
    mission: d.mission ?? (typeof prevJson.mission === "string" ? prevJson.mission : ""),
    strategicObjectives: {
      title:
        d.strategicTitle ??
        (typeof (prevJson.strategicObjectives as Record<string, unknown> | undefined)?.title === "string"
          ? ((prevJson.strategicObjectives as Record<string, unknown>).title as string)
          : ""),
      content:
        d.strategicContent ??
        (typeof (prevJson.strategicObjectives as Record<string, unknown> | undefined)?.content === "string"
          ? ((prevJson.strategicObjectives as Record<string, unknown>).content as string)
          : ""),
      principles:
        d.strategicPrinciples ??
        (typeof (prevJson.strategicObjectives as Record<string, unknown> | undefined)?.principles === "string"
          ? ((prevJson.strategicObjectives as Record<string, unknown>).principles as string)
          : ""),
      agenda2063:
        d.strategicAgenda2063 ??
        (typeof (prevJson.strategicObjectives as Record<string, unknown> | undefined)?.agenda2063 === "string"
          ? ((prevJson.strategicObjectives as Record<string, unknown>).agenda2063 as string)
          : ""),
    },
    heroImage: d.heroImage || undefined,
    aboutSectionEyebrow: d.aboutSectionEyebrow?.trim() || undefined,
    aboutSectionHeading: d.aboutSectionHeading?.trim() || undefined,
    aboutSectionImage: d.aboutSectionImage?.trim() || undefined,
    leadParagraphs: splitLines(d.leadParagraphs),
    deliverySectionHeading: d.deliverySectionHeading?.trim() || undefined,
    partnershipsHeading: d.partnershipsHeading?.trim() || undefined,
    partnershipsText: d.partnershipsText?.trim() || "",
    deliveryPoints,
    teamPage: {
      title: d.teamPageTitle,
      subtitle: d.teamPageSubtitle,
      ...(teamHero ? { heroImage: teamHero } : {}),
    },
    ...(teamTabsList.length > 0 ? { teamTabsList } : {}),
  };

  try {
    await prisma.pageContent.upsert({
      where: { slug: "about" },
      create: {
        slug: "about",
        title: d.title,
        status: "published",
        heroSubtitle: d.heroSubtitle,
        intro: d.intro ?? "",
        description: d.description ?? "",
        mission: d.mission ?? "",
        objectivesTitle: d.strategicTitle ?? "",
        objectivesContent: d.strategicContent ?? "",
        objectivesPrinciples: d.strategicPrinciples ?? "",
        objectivesAgenda2063: d.strategicAgenda2063 ?? "",
        contentJson: payload as Prisma.InputJsonValue,
      },
      update: {
        title: d.title,
        heroSubtitle: d.heroSubtitle,
        intro: d.intro ?? "",
        description: d.description ?? "",
        mission: d.mission ?? "",
        objectivesTitle: d.strategicTitle ?? "",
        objectivesContent: d.strategicContent ?? "",
        objectivesPrinciples: d.strategicPrinciples ?? "",
        objectivesAgenda2063: d.strategicAgenda2063 ?? "",
        contentJson: payload as Prisma.InputJsonValue,
      },
    });
  } catch (err) {
    console.error("updateAboutSettings:", err);
    redirect(`/admin/about-settings?error=${encodeURIComponent(ADMIN_DB_ERROR_MESSAGE)}`);
  }

  revalidatePath("/about");
  revalidatePath("/admin/about-settings");
  redirect("/admin/about-settings?saved=1");
}
