import { Prisma } from "@prisma/client";
import { aypfContent } from "@/data/aypf";
import { prisma } from "@/lib/db";
import { shouldSkipPrismaCalls } from "@/lib/skip-db";

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
  {
    slug: "awpls",
    title: "African Women Political Leadership Summit (AWPLS)",
    contentJson: {
      title: "African Women Political Leadership Summit",
      subtitle: "AWPLS",
      description:
        "The African Women Political Leadership Summit (AWPLS) brings together women in and around political life to share evidence, build skills, and strengthen how parties and institutions govern. Programme details, dates, and registration will be announced here.",
      heroImage: "/uploads/placeholder.svg",
    },
  },
];

export async function ensureMissingBaselinePageRows(): Promise<void> {
  if (shouldSkipPrismaCalls()) return;

  for (const p of BASELINE_PAGES) {
    try {
      const existing = await prisma.pageContent.findUnique({ where: { slug: p.slug } });
      if (!existing) {
        await prisma.pageContent.create({
          data: {
            slug: p.slug,
            title: p.title,
            status: "published",
            contentJson: p.contentJson as Prisma.InputJsonValue,
          },
        });
      }
    } catch {
      // DB unavailable or schema mismatch — list page still tries findMany below.
    }
  }
}
