import { prisma } from "@/lib/db";
import type { CmsEvent, CmsNews, CmsPublication } from "@/lib/content";

/**
 * When the CMS has rows but none are published, public pages should not show
 * bundled demo content from code — show empty state + draft notice instead.
 */
export async function resolveNewsForPublic(
  publishedItems: CmsNews[],
  fallback: CmsNews[]
): Promise<{ items: CmsNews[]; cmsDraftsOnly: boolean }> {
  if (publishedItems.length > 0) return { items: publishedItems, cmsDraftsOnly: false };
  try {
    const total = await prisma.news.count();
    const published = await prisma.news.count({ where: { status: "published" } });
    if (total > 0 && published === 0) return { items: [], cmsDraftsOnly: true };
  } catch {
    /* build without DB or connection failure — use static fallback */
  }
  return { items: fallback, cmsDraftsOnly: false };
}

export async function resolveEventsForPublic(
  publishedItems: CmsEvent[],
  fallback: CmsEvent[]
): Promise<{ items: CmsEvent[]; cmsDraftsOnly: boolean }> {
  if (publishedItems.length > 0) return { items: publishedItems, cmsDraftsOnly: false };
  try {
    const total = await prisma.event.count();
    const published = await prisma.event.count({ where: { status: "published" } });
    if (total > 0 && published === 0) return { items: [], cmsDraftsOnly: true };
  } catch {
    /* build without DB or connection failure */
  }
  return { items: fallback, cmsDraftsOnly: false };
}

export async function resolvePublicationsForPublic(
  publishedItems: CmsPublication[],
  fallback: CmsPublication[]
): Promise<{ items: CmsPublication[]; cmsDraftsOnly: boolean }> {
  if (publishedItems.length > 0) return { items: publishedItems, cmsDraftsOnly: false };
  try {
    const total = await prisma.publication.count();
    const published = await prisma.publication.count({ where: { status: "published" } });
    if (total > 0 && published === 0) return { items: [], cmsDraftsOnly: true };
  } catch {
    /* schema mismatch or DB unavailable at build */
  }
  return { items: fallback, cmsDraftsOnly: false };
}
