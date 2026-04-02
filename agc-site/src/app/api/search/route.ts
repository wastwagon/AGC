import { NextResponse } from "next/server";
import { getEvents, getNews, getPublications } from "@/lib/content";
import { fallbackEvents, fallbackNews, fallbackPublications } from "@/data/content";
import type { CmsEvent, CmsNews, CmsPublication } from "@/lib/content";

export type SearchItem = {
  id: string;
  type: "event" | "news" | "publication";
  title: string;
  excerpt: string;
  href: string;
};

export async function GET() {
  try {
    const [cmsEvents, cmsNews, cmsPublications] = await Promise.all([
      getEvents(),
      getNews(50),
      getPublications(50),
    ]);
    const useFallback = process.env.BUILD_WITHOUT_DB === "1";

    const events: CmsEvent[] = useFallback ? (fallbackEvents as CmsEvent[]) : cmsEvents;
    const news: CmsNews[] = useFallback ? (fallbackNews as CmsNews[]) : cmsNews;
    const publications: CmsPublication[] = useFallback ? (fallbackPublications as CmsPublication[]) : cmsPublications;

    const items: SearchItem[] = [
      ...events.map((e) => ({
        id: `event-${e.id}`,
        type: "event" as const,
        title: e.title,
        excerpt: (e.description || "").replace(/<[^>]*>/g, "").slice(0, 200),
        href: e.slug ? `/events/register/${e.slug}` : "/events",
      })),
      ...news.map((n) => ({
        id: `news-${n.id}`,
        type: "news" as const,
        title: n.title,
        excerpt: (n.excerpt || n.content || "").replace(/<[^>]*>/g, "").slice(0, 200),
        href: n.slug ? `/news/${n.slug}` : "/news",
      })),
      ...publications.map((p) => ({
        id: `pub-${p.id}`,
        type: "publication" as const,
        title: p.title,
        excerpt: (p.excerpt || "").replace(/<[^>]*>/g, "").slice(0, 200),
        href: p.slug ? `/publications/${p.slug}` : "/publications",
      })),
    ];

    return NextResponse.json({ items });
  } catch (err) {
    console.error("Search index error:", err);
    return NextResponse.json({ items: [] });
  }
}
