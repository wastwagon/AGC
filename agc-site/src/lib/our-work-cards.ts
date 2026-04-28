import { workContent } from "@/data/content";
import { getPrograms, getProjects } from "@/lib/content";
import { cardImageUrlOrNull } from "@/lib/image-delivery";
import { resolveImageUrl } from "@/lib/media";

/** Cards for Programs / Projects grids (hub + detail routes). */
export type WorkAreaCard = {
  key: string;
  title: string;
  description: string;
  imageUrl: string | null;
};

export function stripHtmlDescription(html: string | undefined, maxLen: number) {
  return (html || "").replace(/<[^>]*>/g, "").slice(0, maxLen);
}

export async function resolveProgramsForOurWork(): Promise<WorkAreaCard[]> {
  const cmsPrograms = await getPrograms();
  const resolved = await Promise.all(
    cmsPrograms.map(async (p) => ({
      key: `program-${p.id}`,
      title: p.title,
      description: stripHtmlDescription(p.description, 300),
      imageUrl: cardImageUrlOrNull((await resolveImageUrl(p.image)) ?? null),
    }))
  );
  if (resolved.length > 0) return resolved;
  return workContent.programs.cards.map((c) => ({
    key: c.title,
    title: c.title,
    description: c.description,
    imageUrl: null,
  }));
}

export async function resolveProjectsForOurWork(): Promise<WorkAreaCard[]> {
  const cmsProjects = await getProjects();
  const resolved = await Promise.all(
    cmsProjects.map(async (p) => ({
      key: `project-${p.id}`,
      title: p.title,
      description: stripHtmlDescription(p.description, 300),
      imageUrl: cardImageUrlOrNull((await resolveImageUrl(p.image)) ?? null),
    }))
  );
  if (resolved.length > 0) return resolved;
  return workContent.projects.cards.map((c) => ({
    key: c.title,
    title: c.title,
    description: c.description,
    imageUrl: null,
  }));
}
