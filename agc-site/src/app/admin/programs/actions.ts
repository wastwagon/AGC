"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { programFormSchema } from "@/lib/validations";

export async function createProgram(formData: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const raw = {
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    image: formData.get("image") || undefined,
    order: formData.get("order") || undefined,
    status: formData.get("status") || "draft",
  };

  const parsed = programFormSchema.safeParse(raw);
  if (!parsed.success) {
    redirect(`/admin/programs/new?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Invalid input")}`);
  }

  const { title, description, image, order, status } = parsed.data;

  await prisma.program.create({
    data: {
      title,
      description: description || null,
      image: image || null,
      order,
      status,
    },
  });

  revalidatePath("/admin/programs");
  revalidatePath("/");
  redirect("/admin/programs");
}

export async function updateProgram(id: number, formData: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const raw = {
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    image: formData.get("image") || undefined,
    order: formData.get("order") || undefined,
    status: formData.get("status") || "draft",
  };

  const parsed = programFormSchema.safeParse(raw);
  if (!parsed.success) {
    redirect(`/admin/programs/${id}/edit?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Invalid input")}`);
  }

  const { title, description, image, order, status } = parsed.data;

  await prisma.program.update({
    where: { id },
    data: {
      title,
      description: description || null,
      image: image || null,
      order,
      status,
    },
  });

  revalidatePath("/admin/programs");
  revalidatePath(`/admin/programs/${id}/edit`);
  revalidatePath("/");
  redirect("/admin/programs");
}

export async function deleteProgram(id: number, _formData?: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  await prisma.program.delete({ where: { id } });

  revalidatePath("/admin/programs");
  revalidatePath("/");
  redirect("/admin/programs");
}
