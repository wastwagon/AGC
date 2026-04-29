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
    slug: "our-work-programs",
    title: "Programs",
    contentJson: {
      title: "Programs",
      subtitle: "Our core focus areas",
      description:
        "Through forums and expert roundtables, the Africa Governance Centre promotes a culture of collaboration, knowledge sharing, and collective action to advance good governance practices and support economic transformation in Africa.",
      programs: [
        {
          title: "African Political Parties Initiative",
          description:
            "The African Political Parties Initiative (APPI) is a project developed by the Africa Governance Centre dedicated to supporting the role of political parties in Africa's development.",
          backgroundImage: "",
        },
        {
          title: "Africa Governance Review",
          description:
            "The Africa Governance Review Project is a comprehensive initiative dedicated to conducting detailed assessments, offering policy recommendations, and facilitating discussions on governance challenges and opportunities across African nations.",
          backgroundImage: "",
        },
        {
          title: "Africa Resource Governance Initiative",
          description:
            "The Africa Resource Governance Initiative (ARGI), a project of the Africa Governance Centre, is dedicated to promoting transparency, accountability, and sustainable management of natural resources across Africa.",
          backgroundImage: "",
        },
        {
          title: "Public Sector Efficiency and Innovation Project",
          description:
            "The Public Sector Efficiency and Innovation Project is dedicated to addressing the critical need for streamlined operations, improved public service delivery, and the integration of innovative solutions to support Africa's development.",
          backgroundImage: "",
        },
        {
          title: "Media and Democracy Initiative",
          description:
            "The Media and Democracy Initiative of the Africa Governance Centre seek to empower media professionals, support independent journalism, and strengthen the media's ability to facilitate informed citizen participation in governance processes.",
          backgroundImage: "",
        },
      ],
    },
  },
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
