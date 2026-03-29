import { prisma } from "@/lib/db";
import type { MediaItem } from "@/lib/media";

export type MediaReference = {
  kind: string;
  label: string;
  href: string;
};

/** Substrings used to find this asset in stored page data and text fields */
function needlesForItem(item: MediaItem): string[] {
  return [item.id, item.filename, item.url].filter((x): x is string => Boolean(x && x.length > 0));
}

function dedupeKey(r: MediaReference): string {
  return `${r.kind}\0${r.href}`;
}

export async function findMediaReferences(item: MediaItem): Promise<MediaReference[]> {
  const needles = needlesForItem(item);
  if (needles.length === 0) return [];

  const refs: MediaReference[] = [];
  const seen = new Set<string>();

  const add = (kind: string, label: string, href: string) => {
    const r = { kind, label, href };
    const k = dedupeKey(r);
    if (seen.has(k)) return;
    seen.add(k);
    refs.push(r);
  };

  const imageClause = { OR: needles.map((n) => ({ image: { contains: n } })) };
  const logoClause = { OR: needles.map((n) => ({ logo: { contains: n } })) };
  const publicationClause = {
    OR: [
      ...needles.map((n) => ({ image: { contains: n } })),
      ...needles.map((n) => ({ file: { contains: n } })),
    ],
  };

  const [newsRows, eventRows, teamRows, pubs, programs, projects, partners] = await Promise.all([
    prisma.news.findMany({ where: imageClause, select: { id: true, title: true } }),
    prisma.event.findMany({ where: imageClause, select: { id: true, title: true } }),
    prisma.team.findMany({ where: imageClause, select: { id: true, name: true } }),
    prisma.publication.findMany({ where: publicationClause, select: { id: true, title: true } }),
    prisma.program.findMany({ where: imageClause, select: { id: true, title: true } }),
    prisma.project.findMany({ where: imageClause, select: { id: true, title: true } }),
    prisma.partner.findMany({ where: logoClause, select: { id: true, name: true } }),
  ]);

  for (const n of newsRows) {
    add("News", n.title, `/admin/news/${n.id}/edit`);
  }
  for (const e of eventRows) {
    add("Event", e.title, `/admin/events/edit/${e.id}`);
  }
  for (const t of teamRows) {
    add("Team", t.name, `/admin/team/${t.id}/edit`);
  }
  for (const p of pubs) {
    add("Publication", p.title, `/admin/publications/${p.id}/edit`);
  }
  for (const p of programs) {
    add("Program", p.title, `/admin/programs/${p.id}/edit`);
  }
  for (const p of projects) {
    add("Project", p.title, `/admin/projects/${p.id}/edit`);
  }
  for (const p of partners) {
    add("Partner", p.name, `/admin/partners/${p.id}/edit`);
  }

  for (const n of needles) {
    const pattern = `%${n.replace(/%/g, "\\%").replace(/_/g, "\\_")}%`;
    const pageRows = await prisma.$queryRaw<Array<{ slug: string; title: string | null }>>`
      SELECT slug, title FROM page_content WHERE content_json::text ILIKE ${pattern}
      LIMIT 50
    `;
    for (const row of pageRows) {
      const label = row.title || row.slug;
      if (row.slug === "site-settings") {
        add("Page content", label, "/admin/site-settings");
      } else if (row.slug === "home") {
        add("Page content", label, "/admin/home-settings");
      } else if (row.slug === "about") {
        add("Page content", label, "/admin/about-settings");
      } else {
        add("Page content", label, `/admin/pages/${encodeURIComponent(row.slug)}/edit`);
      }
    }
  }

  const siteSettingsRow = await prisma.pageContent.findUnique({
    where: { slug: "site-settings" },
    select: { contentJson: true },
  });
  const siteJson = siteSettingsRow?.contentJson;
  if (siteJson && typeof siteJson === "object" && !Array.isArray(siteJson)) {
    const logoVal = String((siteJson as Record<string, unknown>).logo ?? "");
    for (const n of needles) {
      if (n && logoVal && logoVal.includes(n)) {
        add("Site settings", "Header & footer logo", "/admin/site-settings");
        break;
      }
    }
  }

  return refs;
}
