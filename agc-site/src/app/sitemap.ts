import { MetadataRoute } from "next";
import { prisma } from "@/lib/db";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.africagovernancecentre.org";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let news: { slug: string | null; datePublished: Date | null }[] = [];
  let publications: { slug: string | null; datePublished: Date | null }[] = [];
  let events: { slug: string | null; startDate: Date }[] = [];

  try {
    [news, publications, events] = await Promise.all([
      prisma.news.findMany({
        where: { status: "published" },
        select: { slug: true, datePublished: true },
      }),
      prisma.publication.findMany({
        where: { status: "published" },
        select: { slug: true, datePublished: true },
      }),
      prisma.event.findMany({
        where: { status: "published" },
        select: { slug: true, startDate: true },
      }),
    ]);
  } catch {
    // DB unavailable (e.g. static export or no connection): use static entries only
  }

  const staticEntries: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/about/team`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/our-work`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/our-work/programs`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/our-work/projects`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/our-work/advisory`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/app-summit`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/events`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/news`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/publications`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/get-involved`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/get-involved/volunteer`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/get-involved/partnership`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/get-involved/join-us`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/applications`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/privacy-policy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/terms-of-service`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];

  const newsEntries: MetadataRoute.Sitemap = news
    .filter((n) => n.slug)
    .map((n) => ({
      url: `${baseUrl}/news/${n.slug}`,
      lastModified: n.datePublished ? new Date(n.datePublished) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

  const publicationEntries: MetadataRoute.Sitemap = publications
    .filter((p) => p.slug)
    .map((p) => ({
      url: `${baseUrl}/publications/${p.slug}`,
      lastModified: p.datePublished ? new Date(p.datePublished) : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

  const eventEntries: MetadataRoute.Sitemap = events
    .filter((e) => e.slug)
    .map((e) => ({
      url: `${baseUrl}/events/register/${e.slug}`,
      lastModified: new Date(e.startDate),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

  return [...staticEntries, ...newsEntries, ...publicationEntries, ...eventEntries];
}
