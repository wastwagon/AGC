import type { PrismaClient } from "@prisma/client";
import type { CmsEventAgendaItem } from "@/lib/content";

const MAX_AGENDA_ITEMS = 50;

/** Parse agenda JSON from hidden form field; `null` clears the field in the database */
export function parseAgendaJsonField(raw: string | undefined | null): CmsEventAgendaItem[] | null {
  if (raw == null || raw.trim() === "") return null;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return null;
    const cleaned: CmsEventAgendaItem[] = [];
    for (const row of parsed.slice(0, MAX_AGENDA_ITEMS)) {
      if (!row || typeof row !== "object") continue;
      const o = row as Record<string, unknown>;
      const title = typeof o.title === "string" ? o.title.trim().slice(0, 500) : "";
      if (!title) continue;
      cleaned.push({
        time: typeof o.time === "string" ? o.time.trim().slice(0, 80) : undefined,
        title,
        description: typeof o.description === "string" ? o.description.trim().slice(0, 2000) : undefined,
      });
    }
    return cleaned.length > 0 ? cleaned : null;
  } catch {
    return null;
  }
}

/** Checkbox values from FormData — validated against existing team IDs */
export function parseSpeakerIdsFromForm(formData: FormData): number[] {
  const raw = formData.getAll("speakerIds");
  const nums = raw
    .map((v) => parseInt(String(v), 10))
    .filter((n) => !isNaN(n) && n > 0);
  return [...new Set(nums)];
}

export async function filterValidTeamIds(prisma: PrismaClient, ids: number[]) {
  if (ids.length === 0) return [];
  const rows = await prisma.team.findMany({
    where: { id: { in: ids } },
    select: { id: true },
  });
  const allowed = new Set(rows.map((r) => r.id));
  return ids.filter((id) => allowed.has(id));
}
