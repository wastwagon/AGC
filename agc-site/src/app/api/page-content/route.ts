import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { resolveImageUrl } from "@/lib/media";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const slug = String(url.searchParams.get("slug") || "");
    if (!slug) return NextResponse.json({ error: "missing slug" }, { status: 400 });

    const p = await prisma.pageContent.findFirst({ where: { slug, status: "published" } });
    if (!p) return NextResponse.json({ error: "not found" }, { status: 404 });

    const fromDb =
      p.contentJson != null && typeof p.contentJson === "object" && !Array.isArray(p.contentJson)
        ? (p.contentJson as Record<string, unknown>)
        : {};

    const contentJson: Record<string, unknown> = {
      ...fromDb,
      title: p.title ?? undefined,
      subtitle: p.heroSubtitle ?? undefined,
      intro: p.intro,
      description: p.description,
    };

    const imageKeys = [
      "heroImage",
      "sectionImage",
      "focusSectionBgImage",
      "strategicPrioritiesBgImage",
      "keyFocusBgImage",
      "sponsorshipBgImage",
      ...Array.from({ length: 10 }, (_, i) => `highlightsImage${i + 1}`),
    ];

    for (const key of imageKeys) {
      const raw = fromDb[key];
      if (typeof raw !== "string" || !raw.trim()) continue;
      const resolved = await resolveImageUrl(raw.trim());
      if (resolved) contentJson[key] = resolved;
    }

    return NextResponse.json({ id: p.id, slug: p.slug, title: p.title, content_json: contentJson });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
