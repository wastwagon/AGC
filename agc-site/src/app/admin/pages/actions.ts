"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { pageContentFormSchema } from "@/lib/validations";

export async function updatePageContent(slug: string, formData: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const raw = {
    slug: formData.get("slug"),
    title: formData.get("title") || undefined,
    status: formData.get("status") || "published",
    heroSubtitle: formData.get("heroSubtitle") || undefined,
    heroTitle: formData.get("heroTitle") || undefined,
    intro: formData.get("intro") || undefined,
    description: formData.get("description") || undefined,
    mission: formData.get("mission") || undefined,
    objectivesTitle: formData.get("objectivesTitle") || undefined,
    objectivesContent: formData.get("objectivesContent") || undefined,
    objectivesPrinciples: formData.get("objectivesPrinciples") || undefined,
    objectivesAgenda2063: formData.get("objectivesAgenda2063") || undefined,
  };

  const parsed = pageContentFormSchema.safeParse(raw);
  if (!parsed.success) {
    redirect(`/admin/pages/${encodeURIComponent(slug)}/edit?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Invalid input")}`);
  }

  const data = parsed.data;

  await prisma.pageContent.update({
    where: { slug },
    data: {
      slug: data.slug,
      title: data.title || null,
      status: data.status,
      heroSubtitle: data.heroSubtitle || null,
      heroTitle: data.heroTitle || null,
      intro: data.intro || null,
      description: data.description || null,
      mission: data.mission || null,
      objectivesTitle: data.objectivesTitle || null,
      objectivesContent: data.objectivesContent || null,
      objectivesPrinciples: data.objectivesPrinciples || null,
      objectivesAgenda2063: data.objectivesAgenda2063 || null,
    },
  });

  revalidatePath("/admin/pages");
  revalidatePath(`/admin/pages/${slug}/edit`);
  revalidatePath("/");
  redirect("/admin/pages");
}
