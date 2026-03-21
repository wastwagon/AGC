import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { siteConfig } from "@/data/content";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.africagovernancecentre.org";

export async function GET() {
  try {
    const items = await prisma.news.findMany({
      where: { status: "published" },
      orderBy: { datePublished: "desc" },
      take: 50,
      select: { slug: true, title: true, excerpt: true, datePublished: true },
    });

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteConfig.name)} – News</title>
    <link>${baseUrl}/news</link>
    <description>${escapeXml(siteConfig.tagline)} Latest news and updates.</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/news/feed.xml" rel="self" type="application/rss+xml"/>
    ${items
      .filter((n) => n.slug)
      .map(
        (n) => `
    <item>
      <title>${escapeXml(n.title)}</title>
      <link>${baseUrl}/news/${n.slug}</link>
      <description>${escapeXml((n.excerpt || "").replace(/<[^>]*>/g, "").slice(0, 300))}</description>
      <pubDate>${n.datePublished ? new Date(n.datePublished).toUTCString() : new Date().toUTCString()}</pubDate>
      <guid isPermaLink="true">${baseUrl}/news/${n.slug}</guid>
    </item>`
      )
      .join("")}
  </channel>
</rss>`;

    return new NextResponse(rss.trim(), {
      headers: {
        "Content-Type": "application/rss+xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch {
    return new NextResponse("<?xml version=\"1.0\"?><rss version=\"2.0\"><channel><title>News</title><link>" + baseUrl + "/news</link></channel></rss>", {
      headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
    });
  }
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
