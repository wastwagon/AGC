"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { siteSettingsFormSchema } from "@/lib/validations";
import { ADMIN_DB_ERROR_MESSAGE } from "@/lib/admin-flash-messages";
import { mergeSiteChrome } from "@/lib/site-settings";

function parseOptionalJsonArray(raw: string | undefined, label: string): unknown[] | undefined {
  const t = (raw ?? "").trim();
  if (!t) return undefined;
  try {
    const v = JSON.parse(t) as unknown;
    if (!Array.isArray(v)) throw new Error("not array");
    return v;
  } catch {
    throw new Error(label);
  }
}

function parseLanguages(input: string | undefined): { code: string; label: string }[] {
  const raw = (input || "").trim();
  if (!raw) return [{ code: "en", label: "English" }];
  const lines = raw.split("\n").map((line) => line.trim()).filter(Boolean);
  const items = lines
    .map((line) => {
      const [codeRaw, ...labelParts] = line.split("|");
      const code = (codeRaw || "").trim();
      const label = labelParts.join("|").trim();
      if (!code || !label) return null;
      return { code, label };
    })
    .filter((x): x is { code: string; label: string } => !!x);
  return items.length > 0 ? items : [{ code: "en", label: "English" }];
}

export async function updateSiteSettings(formData: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const raw = {
    name: formData.get("name"),
    tagline: formData.get("tagline"),
    logo: formData.get("logo") || undefined,
    footerLogo: formData.get("footerLogo") || undefined,
    phone: formData.get("phone"),
    address: formData.get("address"),
    officeHours: formData.get("officeHours"),
    emailPrograms: formData.get("emailPrograms"),
    emailMedia: formData.get("emailMedia"),
    emailInfo: formData.get("emailInfo"),
    socialTwitter: formData.get("socialTwitter") || undefined,
    socialLinkedin: formData.get("socialLinkedin") || undefined,
    socialInstagram: formData.get("socialInstagram") || undefined,
    socialFacebook: formData.get("socialFacebook") || undefined,
    languages: formData.get("languages") || undefined,
    skipToContentLabel: formData.get("skipToContentLabel") || undefined,
    headerContactCta: formData.get("headerContactCta") || undefined,
    headerSearchAriaLabel: formData.get("headerSearchAriaLabel") || undefined,
    mobileDrawerAriaLabel: formData.get("mobileDrawerAriaLabel") || undefined,
    mobileDrawerCloseAriaLabel: formData.get("mobileDrawerCloseAriaLabel") || undefined,
    mobileSearchButtonLabel: formData.get("mobileSearchButtonLabel") || undefined,
    mobileDrawerContactCta: formData.get("mobileDrawerContactCta") || undefined,
    mobileLanguageEyebrow: formData.get("mobileLanguageEyebrow") || undefined,
    footerContactHeading: formData.get("footerContactHeading") || undefined,
    footerQuickLinksHeading: formData.get("footerQuickLinksHeading") || undefined,
    footerOurWorkHeading: formData.get("footerOurWorkHeading") || undefined,
    footerGetInvolvedLabel: formData.get("footerGetInvolvedLabel") || undefined,
    footerRightsReserved: formData.get("footerRightsReserved") || undefined,
    footerAdminLabel: formData.get("footerAdminLabel") || undefined,
    chromeNavJson: formData.get("chromeNavJson") || undefined,
    chromeBottomNavJson: formData.get("chromeBottomNavJson") || undefined,
    chromeFooterQuickLinksJson: formData.get("chromeFooterQuickLinksJson") || undefined,
    chromeFooterLegalJson: formData.get("chromeFooterLegalJson") || undefined,
    chromeFooterWorkThumbsJson: formData.get("chromeFooterWorkThumbsJson") || undefined,
  };

  const parsed = siteSettingsFormSchema.safeParse(raw);
  if (!parsed.success) {
    redirect(`/admin/site-settings?error=${encodeURIComponent(parsed.error.issues[0]?.message || "Invalid input")}`);
  }
  const data = parsed.data;

  let navJson: unknown[] | undefined;
  let bottomNavJson: unknown[] | undefined;
  let footerQuickJson: unknown[] | undefined;
  let footerLegalJson: unknown[] | undefined;
  let footerThumbsJson: unknown[] | undefined;
  try {
    navJson = parseOptionalJsonArray(data.chromeNavJson, "Main nav must be valid JSON array");
    bottomNavJson = parseOptionalJsonArray(data.chromeBottomNavJson, "Bottom nav must be valid JSON array");
    footerQuickJson = parseOptionalJsonArray(
      data.chromeFooterQuickLinksJson,
      "Footer quick links must be valid JSON array"
    );
    footerLegalJson = parseOptionalJsonArray(data.chromeFooterLegalJson, "Footer legal links must be valid JSON array");
    footerThumbsJson = parseOptionalJsonArray(
      data.chromeFooterWorkThumbsJson,
      "Footer work thumbnails must be valid JSON array"
    );
  } catch (e) {
    redirect(
      `/admin/site-settings?error=${encodeURIComponent(e instanceof Error ? e.message : "Invalid JSON")}`
    );
  }

  const chromePatch: Record<string, unknown> = {
    skipToContentLabel: data.skipToContentLabel,
    headerContactCta: data.headerContactCta,
    headerSearchAriaLabel: data.headerSearchAriaLabel,
    mobileDrawerAriaLabel: data.mobileDrawerAriaLabel,
    mobileDrawerCloseAriaLabel: data.mobileDrawerCloseAriaLabel,
    mobileSearchButtonLabel: data.mobileSearchButtonLabel,
    mobileDrawerContactCta: data.mobileDrawerContactCta,
    mobileLanguageEyebrow: data.mobileLanguageEyebrow,
  };
  if (navJson) chromePatch.nav = navJson;
  if (bottomNavJson) chromePatch.bottomNav = bottomNavJson;

  const footerPatch: Record<string, unknown> = {
    contactHeading: data.footerContactHeading,
    quickLinksHeading: data.footerQuickLinksHeading,
    ourWorkHeading: data.footerOurWorkHeading,
    getInvolvedLabel: data.footerGetInvolvedLabel,
    rightsReserved: data.footerRightsReserved,
    adminLabel: data.footerAdminLabel,
  };
  if (footerQuickJson) footerPatch.quickLinks = footerQuickJson;
  if (footerLegalJson) footerPatch.legal = footerLegalJson;
  if (footerThumbsJson) footerPatch.workThumbnails = footerThumbsJson;
  chromePatch.footer = footerPatch;

  const chrome = mergeSiteChrome(chromePatch);

  const payload = {
    name: data.name,
    tagline: data.tagline,
    logo: data.logo?.trim() || "",
    footerLogo: data.footerLogo?.trim() || "",
    phone: data.phone,
    address: data.address,
    officeHours: data.officeHours,
    email: {
      programs: data.emailPrograms,
      media: data.emailMedia,
      info: data.emailInfo,
    },
    social: {
      twitter: data.socialTwitter || "",
      linkedin: data.socialLinkedin || "",
      instagram: data.socialInstagram || "",
      facebook: data.socialFacebook || "",
    },
    languages: parseLanguages(data.languages),
    chrome,
  };

  try {
    await prisma.pageContent.upsert({
      where: { slug: "site-settings" },
      create: {
        slug: "site-settings",
        title: "Site Settings",
        status: "published",
        contentJson: payload as Prisma.InputJsonValue,
      },
      update: {
        title: "Site Settings",
        status: "published",
        contentJson: payload as Prisma.InputJsonValue,
      },
    });
  } catch (err) {
    console.error("updateSiteSettings:", err);
    redirect(`/admin/site-settings?error=${encodeURIComponent(ADMIN_DB_ERROR_MESSAGE)}`);
  }

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/site-settings");
  revalidatePath("/admin/pages");
  redirect("/admin/site-settings?saved=1");
}
