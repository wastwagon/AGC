"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { siteSettingsFormSchema } from "@/lib/validations";
import { ADMIN_DB_ERROR_MESSAGE } from "@/lib/admin-flash-messages";

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
  };

  const parsed = siteSettingsFormSchema.safeParse(raw);
  if (!parsed.success) {
    redirect(`/admin/site-settings?error=${encodeURIComponent(parsed.error.issues[0]?.message || "Invalid input")}`);
  }
  const data = parsed.data;

  const payload = {
    name: data.name,
    tagline: data.tagline,
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
