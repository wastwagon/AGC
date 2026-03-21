"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { partnerFormSchema } from "@/lib/validations";

export async function createPartner(formData: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const raw = {
    name: formData.get("name"),
    logo: formData.get("logo") || undefined,
    url: formData.get("url") || undefined,
    order: formData.get("order") || undefined,
    status: formData.get("status") || "draft",
  };

  const parsed = partnerFormSchema.safeParse(raw);
  if (!parsed.success) {
    redirect(`/admin/partners/new?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Invalid input")}`);
  }

  const { name, logo, url, order, status } = parsed.data;

  await prisma.partner.create({
    data: {
      name,
      logo: logo || null,
      url: url || null,
      order,
      status,
    },
  });

  revalidatePath("/admin/partners");
  revalidatePath("/");
  redirect("/admin/partners");
}

export async function updatePartner(id: number, formData: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const raw = {
    name: formData.get("name"),
    logo: formData.get("logo") || undefined,
    url: formData.get("url") || undefined,
    order: formData.get("order") || undefined,
    status: formData.get("status") || "draft",
  };

  const parsed = partnerFormSchema.safeParse(raw);
  if (!parsed.success) {
    redirect(`/admin/partners/${id}/edit?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Invalid input")}`);
  }

  const { name, logo, url, order, status } = parsed.data;

  await prisma.partner.update({
    where: { id },
    data: {
      name,
      logo: logo || null,
      url: url || null,
      order,
      status,
    },
  });

  revalidatePath("/admin/partners");
  revalidatePath(`/admin/partners/${id}/edit`);
  revalidatePath("/");
  redirect("/admin/partners");
}

export async function deletePartner(id: number, _formData?: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  await prisma.partner.delete({ where: { id } });

  revalidatePath("/admin/partners");
  revalidatePath("/");
  redirect("/admin/partners");
}
