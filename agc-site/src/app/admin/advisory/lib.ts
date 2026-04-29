import { prisma } from "@/lib/db";
import { workContent } from "@/data/content";

export type AdvisoryAdminItem = {
  id: string;
  title: string;
  description: string;
  image: string;
  order: number;
  status: "draft" | "published";
};

function randomCardId() {
  return `advisory-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function normalizeAdvisoryCards(input: unknown): AdvisoryAdminItem[] {
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
      } as AdvisoryAdminItem;
    })
    .filter((x): x is AdvisoryAdminItem => x !== null)
    .sort((a, b) => a.order - b.order);
}

export async function getAdvisoryCardsForAdmin(): Promise<AdvisoryAdminItem[]> {
  const row = await prisma.pageContent.findUnique({
    where: { slug: "our-work" },
    select: { contentJson: true },
  });
  const advisoryRaw =
    row?.contentJson &&
    typeof row.contentJson === "object" &&
    !Array.isArray(row.contentJson) &&
    (row.contentJson as Record<string, unknown>).advisory &&
    typeof (row.contentJson as Record<string, unknown>).advisory === "object" &&
    !Array.isArray((row.contentJson as Record<string, unknown>).advisory)
      ? ((row.contentJson as Record<string, unknown>).advisory as Record<string, unknown>)
      : null;
  const cards = normalizeAdvisoryCards(advisoryRaw?.cards);
  if (cards.length > 0) return cards;
  return workContent.advisory.cards.map((c, index) => ({
    id: randomCardId(),
    title: c.title,
    description: c.description,
    image: "",
    order: index,
    status: "published",
  }));
}
