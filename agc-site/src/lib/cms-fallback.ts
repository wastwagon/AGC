import { prisma } from "@/lib/db";
import type { CmsEvent, CmsNews, CmsPublication } from "@/lib/content";

const allowBundledDemo = process.env.BUILD_WITHOUT_DB === "1";

/**
 * Public listings use the database only. Bundled “demo” arrays from code are used
 * only when BUILD_WITHOUT_DB=1 (e.g. Next.js build without Postgres).
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
    if (allowBundledDemo) return { items: fallback, cmsDraftsOnly: false };
    return { items: [], cmsDraftsOnly: false };
  }
  if (allowBundledDemo) return { items: fallback, cmsDraftsOnly: false };
  return { items: [], cmsDraftsOnly: false };
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
    if (allowBundledDemo) return { items: fallback, cmsDraftsOnly: false };
    return { items: [], cmsDraftsOnly: false };
  }
  if (allowBundledDemo) return { items: fallback, cmsDraftsOnly: false };
  return { items: [], cmsDraftsOnly: false };
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
    if (allowBundledDemo) return { items: fallback, cmsDraftsOnly: false };
    return { items: [], cmsDraftsOnly: false };
  }
  if (allowBundledDemo) return { items: fallback, cmsDraftsOnly: false };
  return { items: [], cmsDraftsOnly: false };
}
