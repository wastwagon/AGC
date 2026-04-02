"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { SITE_TAXONOMY_SLUG, parseTaxonomyLines } from "@/lib/site-taxonomy";
import { ADMIN_DB_ERROR_MESSAGE } from "@/lib/admin-flash-messages";

export async function saveSiteTaxonomy(formData: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const newsCategories = parseTaxonomyLines(String(formData.get("newsCategories") ?? ""));
  const publicationTypes = parseTaxonomyLines(String(formData.get("publicationTypes") ?? ""));
  const newsTags = parseTaxonomyLines(String(formData.get("newsTags") ?? ""));

  if (newsCategories.length === 0 || publicationTypes.length === 0 || newsTags.length === 0) {
    redirect(
      `/admin/taxonomy?error=${encodeURIComponent("Add at least one news category, one publication type, and one news tag (one per line: slug | label).")}`
    );
  }

  const contentJson = { newsCategories, publicationTypes, newsTags } as unknown as Prisma.InputJsonValue;

  try {
    await prisma.pageContent.upsert({
      where: { slug: SITE_TAXONOMY_SLUG },
      create: {
        slug: SITE_TAXONOMY_SLUG,
        title: "Site taxonomy",
        status: "published",
        contentJson,
      },
      update: { contentJson },
    });
  } catch (err) {
    console.error("saveSiteTaxonomy:", err);
    redirect(`/admin/taxonomy?error=${encodeURIComponent(ADMIN_DB_ERROR_MESSAGE)}`);
  }

  revalidatePath("/admin/taxonomy");
  revalidatePath("/news");
  revalidatePath("/news/tag", "layout");
  revalidatePath("/publications");
  redirect("/admin/taxonomy?saved=1");
}
