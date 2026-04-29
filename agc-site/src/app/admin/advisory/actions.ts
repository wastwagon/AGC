"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { advisoryFormSchema } from "@/lib/validations";
import { ADMIN_DB_ERROR_MESSAGE } from "@/lib/admin-flash-messages";

type AdvisoryCard = {
  id: string;
  title: string;
  description?: string;
  image?: string;
  order: number;
  status: "draft" | "published";
};

function randomCardId() {
  return `advisory-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function normalizeAdvisoryCards(input: unknown): AdvisoryCard[] {
  if (!Array.isArray(input)) return [];
  return input
    .map((item, index) => {
      const row = item && typeof item === "object" && !Array.isArray(item) ? (item as Record<string, unknown>) : {};
      const title = typeof row.title === "string" ? row.title.trim() : "";
      if (!title) return null;
      const status = row.status === "draft" ? "draft" : "published";
      const orderRaw = row.order;
      const order = typeof orderRaw === "number" ? orderRaw : Number.parseInt(String(orderRaw ?? index), 10);
      return {
        id: typeof row.id === "string" && row.id.trim() ? row.id.trim() : randomCardId(),
        title,
        description: typeof row.description === "string" ? row.description.trim() : "",
        image: typeof row.image === "string" ? row.image.trim() : "",
        order: Number.isFinite(order) ? order : index,
        status,
      } as AdvisoryCard;
    })
    .filter((x): x is AdvisoryCard => x !== null);
}

async function getOurWorkJsonForEdit(): Promise<Record<string, unknown>> {
  const row = await prisma.pageContent.findUnique({
    where: { slug: "our-work" },
    select: { contentJson: true },
  });
  if (row?.contentJson && typeof row.contentJson === "object" && !Array.isArray(row.contentJson)) {
    return { ...(row.contentJson as Record<string, unknown>) };
  }
  return {};
}

function upsertAdvisoryCardsIntoJson(
  json: Record<string, unknown>,
  updater: (cards: AdvisoryCard[]) => AdvisoryCard[]
): Record<string, unknown> {
  const advisoryRaw =
    json.advisory && typeof json.advisory === "object" && !Array.isArray(json.advisory)
      ? (json.advisory as Record<string, unknown>)
      : {};
  const cards = normalizeAdvisoryCards(advisoryRaw.cards);
  return {
    ...json,
    advisory: {
      ...advisoryRaw,
      cards: updater(cards),
    },
  };
}

export async function createAdvisory(formData: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const raw = {
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    image: formData.get("image") || undefined,
    order: formData.get("order") || undefined,
    status: formData.get("status") || "draft",
  };
  const parsed = advisoryFormSchema.safeParse(raw);
  if (!parsed.success) {
    redirect(`/admin/advisory/new?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Invalid input")}`);
  }
  const { title, description, image, order, status } = parsed.data;

  try {
    const current = await getOurWorkJsonForEdit();
    const next = upsertAdvisoryCardsIntoJson(current, (cards) => [
      ...cards,
      {
        id: randomCardId(),
        title,
        description: description || "",
        image: image || "",
        order,
        status,
      },
    ]);
    const nextJson = next as Prisma.InputJsonValue;
    const nextJson = next as Prisma.InputJsonValue;
    const nextJson = next as Prisma.InputJsonValue;
    await prisma.pageContent.upsert({
      where: { slug: "our-work" },
      create: {
        slug: "our-work",
        title: "Our Work",
        status: "published",
        contentJson: nextJson,
      },
      update: { contentJson: nextJson },
    });
  } catch (err) {
    console.error("createAdvisory:", err);
    redirect(`/admin/advisory/new?error=${encodeURIComponent(ADMIN_DB_ERROR_MESSAGE)}`);
  }

  revalidatePath("/admin/advisory");
  revalidatePath("/our-work");
  revalidatePath("/");
  redirect("/admin/advisory?saved=created");
}

export async function updateAdvisory(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const raw = {
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    image: formData.get("image") || undefined,
    order: formData.get("order") || undefined,
    status: formData.get("status") || "draft",
  };
  const parsed = advisoryFormSchema.safeParse(raw);
  if (!parsed.success) {
    redirect(
      `/admin/advisory/${encodeURIComponent(id)}/edit?error=${encodeURIComponent(
        parsed.error.issues[0]?.message ?? "Invalid input"
      )}`
    );
  }
  const { title, description, image, order, status } = parsed.data;

  try {
    const current = await getOurWorkJsonForEdit();
    const next = upsertAdvisoryCardsIntoJson(current, (cards) =>
      cards.map((card) =>
        card.id === id
          ? {
              ...card,
              title,
              description: description || "",
              image: image || "",
              order,
              status,
            }
          : card
      )
    );
    await prisma.pageContent.upsert({
      where: { slug: "our-work" },
      create: {
        slug: "our-work",
        title: "Our Work",
        status: "published",
        contentJson: nextJson,
      },
      update: { contentJson: nextJson },
    });
  } catch (err) {
    console.error("updateAdvisory:", err);
    redirect(`/admin/advisory/${encodeURIComponent(id)}/edit?error=${encodeURIComponent(ADMIN_DB_ERROR_MESSAGE)}`);
  }

  revalidatePath("/admin/advisory");
  revalidatePath(`/admin/advisory/${id}/edit`);
  revalidatePath("/our-work");
  revalidatePath("/");
  redirect(`/admin/advisory/${encodeURIComponent(id)}/edit?saved=1`);
}

export async function deleteAdvisory(id: string, _formData?: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  try {
    const current = await getOurWorkJsonForEdit();
    const next = upsertAdvisoryCardsIntoJson(current, (cards) => cards.filter((card) => card.id !== id));
    await prisma.pageContent.upsert({
      where: { slug: "our-work" },
      create: {
        slug: "our-work",
        title: "Our Work",
        status: "published",
        contentJson: nextJson,
      },
      update: { contentJson: nextJson },
    });
  } catch (err) {
    console.error("deleteAdvisory:", err);
    redirect(`/admin/advisory?error=${encodeURIComponent(ADMIN_DB_ERROR_MESSAGE)}`);
  }

  revalidatePath("/admin/advisory");
  revalidatePath("/our-work");
  revalidatePath("/");
  redirect("/admin/advisory?saved=deleted");
}
