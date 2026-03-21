"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { programFormSchema } from "@/lib/validations";
import { ADMIN_DB_ERROR_MESSAGE } from "@/lib/admin-flash-messages";

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

  let created;
  try {
    created = await prisma.program.create({
      data: {
        title,
        description: description || null,
        image: image || null,
        order,
        status,
      },
    });
  } catch (err) {
    console.error("createProgram:", err);
    redirect(`/admin/programs/new?error=${encodeURIComponent(ADMIN_DB_ERROR_MESSAGE)}`);
  }

  revalidatePath("/admin/programs");
  revalidatePath("/");
  redirect(`/admin/programs/${created.id}/edit?saved=created`);
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

  try {
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
  } catch (err) {
    console.error("updateProgram:", err);
    redirect(`/admin/programs/${id}/edit?error=${encodeURIComponent(ADMIN_DB_ERROR_MESSAGE)}`);
  }

  revalidatePath("/admin/programs");
  revalidatePath(`/admin/programs/${id}/edit`);
  revalidatePath("/");
  redirect(`/admin/programs/${id}/edit?saved=1`);
}

export async function deleteProgram(id: number, _formData?: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  try {
    await prisma.program.delete({ where: { id } });
  } catch (err) {
    console.error("deleteProgram:", err);
    redirect(`/admin/programs?error=${encodeURIComponent(ADMIN_DB_ERROR_MESSAGE)}`);
  }

  revalidatePath("/admin/programs");
  revalidatePath("/");
  redirect("/admin/programs?saved=deleted");
}
