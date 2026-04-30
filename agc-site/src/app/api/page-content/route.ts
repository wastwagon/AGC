import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

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

    // keep media ids from content_json if present
    if (typeof fromDb.heroImage === "string" && fromDb.heroImage.trim()) contentJson.heroImage = fromDb.heroImage.trim();
    if (typeof fromDb.sectionImage === "string" && fromDb.sectionImage.trim()) contentJson.sectionImage = fromDb.sectionImage.trim();

    return NextResponse.json({ id: p.id, slug: p.slug, title: p.title, content_json: contentJson });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
