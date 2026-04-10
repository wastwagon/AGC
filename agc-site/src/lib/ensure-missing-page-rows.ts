import { aypfContent } from "@/data/aypf";
import { prisma } from "@/lib/db";

/**
 * Baseline PageContent rows that were added after early deployments.
 * Ensures they exist when an admin opens Page Content (no full re-seed required).
 */
const BASELINE_PAGES: { slug: string; title: string; contentJson: Record<string, unknown> }[] = [
  {
    slug: "aypf",
    title: "African Youth in Politics Forum (AYPF)",
    contentJson: { ...aypfContent, heroImage: "/uploads/placeholder.svg" },
  },
];

export async function ensureMissingBaselinePageRows(): Promise<void> {
  if (process.env.BUILD_WITHOUT_DB === "1") return;

  for (const p of BASELINE_PAGES) {
    try {
      const existing = await prisma.pageContent.findUnique({ where: { slug: p.slug } });
      if (!existing) {
        await prisma.pageContent.create({
          data: {
            slug: p.slug,
            title: p.title,
            status: "published",
            contentJson: p.contentJson,
          },
        });
      }
    } catch {
      // DB unavailable or schema mismatch — list page still tries findMany below.
    }
  }
}
