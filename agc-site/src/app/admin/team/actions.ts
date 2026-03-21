"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { teamFormSchema } from "@/lib/validations";

export async function createTeam(formData: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const raw = {
    name: formData.get("name"),
    role: formData.get("role") || undefined,
    bio: formData.get("bio") || undefined,
    image: formData.get("image") || undefined,
    order: formData.get("order") || undefined,
    status: formData.get("status") || "draft",
  };

  const parsed = teamFormSchema.safeParse(raw);
  if (!parsed.success) {
    redirect(`/admin/team/new?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Invalid input")}`);
  }

  const { name, role, bio, image, order, status } = parsed.data;

  await prisma.team.create({
    data: {
      name,
      role: role || null,
      bio: bio || null,
      image: image || null,
      order,
      status,
    },
  });

  revalidatePath("/admin/team");
  revalidatePath("/");
  redirect("/admin/team");
}

export async function updateTeam(id: number, formData: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const raw = {
    name: formData.get("name"),
    role: formData.get("role") || undefined,
    bio: formData.get("bio") || undefined,
    image: formData.get("image") || undefined,
    order: formData.get("order") || undefined,
    status: formData.get("status") || "draft",
  };

  const parsed = teamFormSchema.safeParse(raw);
  if (!parsed.success) {
    redirect(`/admin/team/${id}/edit?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Invalid input")}`);
  }

  const { name, role, bio, image, order, status } = parsed.data;

  await prisma.team.update({
    where: { id },
    data: {
      name,
      role: role || null,
      bio: bio || null,
      image: image || null,
      order,
      status,
    },
  });

  revalidatePath("/admin/team");
  revalidatePath(`/admin/team/${id}/edit`);
  revalidatePath("/");
  redirect("/admin/team");
}

export async function deleteTeam(id: number, _formData?: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  await prisma.team.delete({ where: { id } });

  revalidatePath("/admin/team");
  revalidatePath("/");
  redirect("/admin/team");
}
