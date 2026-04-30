"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { teamFormSchema } from "@/lib/validations";
import { ADMIN_DB_ERROR_MESSAGE } from "@/lib/admin-flash-messages";

function canRetryWithoutSection(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  return (
    msg.includes("Unknown argument `section`") ||
    msg.includes('Unknown field `section`') ||
    msg.includes('column "section" does not exist') ||
    msg.includes("The column `section` does not exist")
  );
}

export async function createTeam(formData: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const raw = {
    name: formData.get("name"),
    role: formData.get("role") || undefined,
    bio: formData.get("bio") || undefined,
    image: formData.get("image") || undefined,
    section: formData.get("section") || undefined,
    order: formData.get("order") || undefined,
    status: formData.get("status") || "draft",
  };

  const parsed = teamFormSchema.safeParse(raw);
  if (!parsed.success) {
    redirect(`/admin/team/new?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Invalid input")}`);
  }

  const { name, role, bio, image, section, order, status } = parsed.data;

  let created;
  try {
    const baseData = {
      name,
      role: role || null,
      bio: bio || null,
      image: image || null,
      order,
      status,
    };
    try {
      created = await prisma.team.create({
        data: {
          ...baseData,
          ...(section ? ({ section } as Record<string, unknown>) : {}),
        },
      });
    } catch (err) {
      if (!canRetryWithoutSection(err)) throw err;
      created = await prisma.team.create({ data: baseData });
    }
  } catch (err) {
    console.error("createTeam:", err);
    redirect(`/admin/team/new?error=${encodeURIComponent(ADMIN_DB_ERROR_MESSAGE)}`);
  }

  revalidatePath("/admin/team");
  revalidatePath("/");
  redirect(`/admin/team/${created.id}/edit?saved=created`);
}

export async function updateTeam(id: number, formData: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const raw = {
    name: formData.get("name"),
    role: formData.get("role") || undefined,
    bio: formData.get("bio") || undefined,
    image: formData.get("image") || undefined,
    section: formData.get("section") || undefined,
    order: formData.get("order") || undefined,
    status: formData.get("status") || "draft",
  };

  const parsed = teamFormSchema.safeParse(raw);
  if (!parsed.success) {
    redirect(`/admin/team/${id}/edit?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Invalid input")}`);
  }

  const { name, role, bio, image, section, order, status } = parsed.data;

  try {
    const baseData = {
      name,
      role: role || null,
      bio: bio || null,
      image: image || null,
      order,
      status,
    };
    try {
      await prisma.team.update({
        where: { id },
        data: {
          ...baseData,
          ...(section ? ({ section } as Record<string, unknown>) : {}),
        },
      });
    } catch (err) {
      if (!canRetryWithoutSection(err)) throw err;
      await prisma.team.update({
        where: { id },
        data: baseData,
      });
    }
  } catch (err) {
    console.error("updateTeam:", err);
    redirect(`/admin/team/${id}/edit?error=${encodeURIComponent(ADMIN_DB_ERROR_MESSAGE)}`);
  }

  revalidatePath("/admin/team");
  revalidatePath(`/admin/team/${id}/edit`);
  revalidatePath("/");
  redirect(`/admin/team/${id}/edit?saved=1`);
}

export async function deleteTeam(id: number, _formData?: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  try {
    await prisma.team.delete({ where: { id } });
  } catch (err) {
    console.error("deleteTeam:", err);
    redirect(`/admin/team?error=${encodeURIComponent(ADMIN_DB_ERROR_MESSAGE)}`);
  }

  revalidatePath("/admin/team");
  revalidatePath("/");
  redirect("/admin/team?saved=deleted");
}
