"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { newsFormSchema } from "@/lib/validations";
import { ADMIN_DB_ERROR_MESSAGE } from "@/lib/admin-flash-messages";
import { getSiteTaxonomy } from "@/lib/site-taxonomy";

async function filterNewsCategories(slugs: string[]): Promise<string[]> {
  const t = await getSiteTaxonomy();
  const allow = new Set(t.newsCategories.map((c) => c.slug));
  return slugs.filter((s) => allow.has(s));
}

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
    categories: formData.getAll("categories").filter((x): x is string => typeof x === "string"),
    tags: formData.get("tags") ? (formData.get("tags") as string).split(",").map((s) => s.trim()).filter(Boolean) : [],
    status: formData.get("status") || "draft",
    datePublished: formData.get("datePublished") || undefined,
  };

  const parsed = newsFormSchema.safeParse(raw);
  if (!parsed.success) {
    redirect(`/admin/news/new?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Invalid input")}`);
  }

  const { title, slug, image, excerpt, content, author, categories: rawCats, tags, status, datePublished } = parsed.data;
  const finalSlug = slug?.trim() || slugify(title);
  const categories = await filterNewsCategories(rawCats ?? []);

  let created;
  try {
    created = await prisma.news.create({
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
  } catch (err) {
    console.error("createNews:", err);
    redirect(`/admin/news/new?error=${encodeURIComponent(ADMIN_DB_ERROR_MESSAGE)}`);
  }

  revalidatePath("/admin/news");
  revalidatePath("/news");
  revalidatePath("/");
  redirect(`/admin/news/${created.id}/edit?saved=created`);
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
    categories: formData.getAll("categories").filter((x): x is string => typeof x === "string"),
    tags: formData.get("tags") ? (formData.get("tags") as string).split(",").map((s) => s.trim()).filter(Boolean) : [],
    status: formData.get("status") || "draft",
    datePublished: formData.get("datePublished") || undefined,
  };

  const parsed = newsFormSchema.safeParse(raw);
  if (!parsed.success) {
    redirect(`/admin/news/${id}/edit?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Invalid input")}`);
  }

  const { title, slug, image, excerpt, content, author, categories: rawCats, tags, status, datePublished } = parsed.data;
  const finalSlug = slug?.trim() || slugify(title);
  const categories = await filterNewsCategories(rawCats ?? []);

  try {
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
  } catch (err) {
    console.error("updateNews:", err);
    redirect(`/admin/news/${id}/edit?error=${encodeURIComponent(ADMIN_DB_ERROR_MESSAGE)}`);
  }

  revalidatePath("/admin/news");
  revalidatePath(`/admin/news/${id}/edit`);
  revalidatePath("/news");
  revalidatePath("/");
  redirect(`/admin/news/${id}/edit?saved=1`);
}

export async function deleteNews(id: number, _formData?: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  try {
    await prisma.news.delete({ where: { id } });
  } catch (err) {
    console.error("deleteNews:", err);
    redirect(`/admin/news?error=${encodeURIComponent(ADMIN_DB_ERROR_MESSAGE)}`);
  }

  revalidatePath("/admin/news");
  revalidatePath("/news");
  revalidatePath("/");
  redirect("/admin/news?saved=deleted");
}
