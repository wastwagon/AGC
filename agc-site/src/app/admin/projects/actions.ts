"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { projectFormSchema } from "@/lib/validations";

export async function createProject(formData: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const raw = {
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    image: formData.get("image") || undefined,
    order: formData.get("order") || undefined,
    status: formData.get("status") || "draft",
  };

  const parsed = projectFormSchema.safeParse(raw);
  if (!parsed.success) {
    redirect(`/admin/projects/new?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Invalid input")}`);
  }

  const { title, description, image, order, status } = parsed.data;

  await prisma.project.create({
    data: {
      title,
      description: description || null,
      image: image || null,
      order,
      status,
    },
  });

  revalidatePath("/admin/projects");
  revalidatePath("/");
  redirect("/admin/projects");
}

export async function updateProject(id: number, formData: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const raw = {
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    image: formData.get("image") || undefined,
    order: formData.get("order") || undefined,
    status: formData.get("status") || "draft",
  };

  const parsed = projectFormSchema.safeParse(raw);
  if (!parsed.success) {
    redirect(`/admin/projects/${id}/edit?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Invalid input")}`);
  }

  const { title, description, image, order, status } = parsed.data;

  await prisma.project.update({
    where: { id },
    data: {
      title,
      description: description || null,
      image: image || null,
      order,
      status,
    },
  });

  revalidatePath("/admin/projects");
  revalidatePath(`/admin/projects/${id}/edit`);
  revalidatePath("/");
  redirect("/admin/projects");
}

export async function deleteProject(id: number, _formData?: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  await prisma.project.delete({ where: { id } });

  revalidatePath("/admin/projects");
  revalidatePath("/");
  redirect("/admin/projects");
}
