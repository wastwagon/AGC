"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { publicationFormSchema } from "@/lib/validations";

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function createPublication(formData: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const raw = {
    title: formData.get("title"),
    slug: formData.get("slug") || undefined,
    excerpt: formData.get("excerpt") || undefined,
    type: formData.get("type") || undefined,
    file: formData.get("file") || undefined,
    image: formData.get("image") || undefined,
    datePublished: formData.get("datePublished") || undefined,
    author: formData.get("author") || undefined,
    status: formData.get("status") || "draft",
  };

  const parsed = publicationFormSchema.safeParse(raw);
  if (!parsed.success) {
    redirect(`/admin/publications/new?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Invalid input")}`);
  }

  const { title, slug, excerpt, type, file, image, datePublished, author, status } = parsed.data;
  const finalSlug = slug?.trim() || slugify(title);

  await prisma.publication.create({
    data: {
      title,
      slug: finalSlug,
      excerpt: excerpt || null,
      type: type || null,
      file: file || null,
      image: image || null,
      datePublished: datePublished ? new Date(datePublished) : null,
      author: author || null,
      status,
    },
  });

  revalidatePath("/admin/publications");
  revalidatePath("/");
  redirect("/admin/publications");
}

export async function updatePublication(id: number, formData: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const raw = {
    title: formData.get("title"),
    slug: formData.get("slug") || undefined,
    excerpt: formData.get("excerpt") || undefined,
    type: formData.get("type") || undefined,
    file: formData.get("file") || undefined,
    image: formData.get("image") || undefined,
    datePublished: formData.get("datePublished") || undefined,
    author: formData.get("author") || undefined,
    status: formData.get("status") || "draft",
  };

  const parsed = publicationFormSchema.safeParse(raw);
  if (!parsed.success) {
    redirect(`/admin/publications/${id}/edit?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Invalid input")}`);
  }

  const { title, slug, excerpt, type, file, image, datePublished, author, status } = parsed.data;
  const finalSlug = slug?.trim() || slugify(title);

  await prisma.publication.update({
    where: { id },
    data: {
      title,
      slug: finalSlug,
      excerpt: excerpt || null,
      type: type || null,
      file: file || null,
      image: image || null,
      datePublished: datePublished ? new Date(datePublished) : null,
      author: author || null,
      status,
    },
  });

  revalidatePath("/admin/publications");
  revalidatePath(`/admin/publications/${id}/edit`);
  revalidatePath("/");
  redirect("/admin/publications");
}

export async function deletePublication(id: number, _formData?: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  await prisma.publication.delete({ where: { id } });

  revalidatePath("/admin/publications");
  revalidatePath("/");
  redirect("/admin/publications");
}
