"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { newsFormSchema } from "@/lib/validations";

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function createNews(formData: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const raw = {
    title: formData.get("title"),
    slug: formData.get("slug") || undefined,
    image: formData.get("image") || undefined,
    excerpt: formData.get("excerpt") || undefined,
    content: formData.get("content") || undefined,
    author: formData.get("author") || undefined,
    categories: formData.get("categories") ? (formData.get("categories") as string).split(",").map((s) => s.trim()).filter(Boolean) : [],
    tags: formData.get("tags") ? (formData.get("tags") as string).split(",").map((s) => s.trim()).filter(Boolean) : [],
    status: formData.get("status") || "draft",
    datePublished: formData.get("datePublished") || undefined,
  };

  const parsed = newsFormSchema.safeParse(raw);
  if (!parsed.success) {
    redirect(`/admin/news/new?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Invalid input")}`);
  }

  const { title, slug, image, excerpt, content, author, categories, tags, status, datePublished } = parsed.data;
  const finalSlug = slug?.trim() || slugify(title);

  await prisma.news.create({
    data: {
      title,
      slug: finalSlug,
      image: image || null,
      excerpt: excerpt || null,
      content: content || null,
      author: author || null,
      categories: categories?.length ? categories : [],
      tags: tags?.length ? tags : [],
      status,
      datePublished: datePublished ? new Date(datePublished) : null,
    },
  });

  revalidatePath("/admin/news");
  revalidatePath("/news");
  revalidatePath("/");
  redirect("/admin/news");
}

export async function updateNews(id: number, formData: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const raw = {
    title: formData.get("title"),
    slug: formData.get("slug") || undefined,
    image: formData.get("image") || undefined,
    excerpt: formData.get("excerpt") || undefined,
    content: formData.get("content") || undefined,
    author: formData.get("author") || undefined,
    categories: formData.get("categories") ? (formData.get("categories") as string).split(",").map((s) => s.trim()).filter(Boolean) : [],
    tags: formData.get("tags") ? (formData.get("tags") as string).split(",").map((s) => s.trim()).filter(Boolean) : [],
    status: formData.get("status") || "draft",
    datePublished: formData.get("datePublished") || undefined,
  };

  const parsed = newsFormSchema.safeParse(raw);
  if (!parsed.success) {
    redirect(`/admin/news/${id}/edit?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Invalid input")}`);
  }

  const { title, slug, image, excerpt, content, author, categories, tags, status, datePublished } = parsed.data;
  const finalSlug = slug?.trim() || slugify(title);

  await prisma.news.update({
    where: { id },
    data: {
      title,
      slug: finalSlug,
      image: image || null,
      excerpt: excerpt || null,
      content: content || null,
      author: author || null,
      categories: categories?.length ? categories : [],
      tags: tags?.length ? tags : [],
      status,
      datePublished: datePublished ? new Date(datePublished) : null,
    },
  });

  revalidatePath("/admin/news");
  revalidatePath(`/admin/news/${id}/edit`);
  revalidatePath("/news");
  revalidatePath("/");
  redirect("/admin/news");
}

export async function deleteNews(id: number, _formData?: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  await prisma.news.delete({ where: { id } });

  revalidatePath("/admin/news");
  revalidatePath("/news");
  revalidatePath("/");
  redirect("/admin/news");
}
