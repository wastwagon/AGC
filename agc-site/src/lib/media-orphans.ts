import { listMedia } from "@/lib/media";
import { findMediaReferences } from "@/lib/media-references";

/** Media library items with no references in DB-backed content (safe cleanup candidates). */
export async function listOrphanMediaItems() {
  const items = await listMedia();
  const orphans: Awaited<ReturnType<typeof listMedia>> = [];
  for (const item of items) {
    const refs = await findMediaReferences(item);
    if (refs.length === 0) orphans.push(item);
  }
  return orphans;
}
