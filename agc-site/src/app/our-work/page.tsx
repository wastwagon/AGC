import { OurWorkClient } from "./our-work-client";
import { workContent, type OurWorkPageContent } from "@/data/content";
import { placeholderImages } from "@/data/images";
import { cmsStaticOrEmpty, getMergedPageContent } from "@/lib/page-content";
import { resolveImageUrl } from "@/lib/media";
import { getSiteSettings } from "@/lib/site-settings";
import {
  resolveAdvisoryForOurWork,
  resolveProgramsForOurWork,
  resolveProjectsForOurWork,
} from "@/lib/our-work-cards";

export const metadata = {
  title: "Our Work",
  description: "Programs, projects, and advisory services advancing governance excellence across Africa.",
};

export const revalidate = 60;

async function resolveOurWorkInlineImages(content: OurWorkPageContent & { heroImage?: string; approachObjectivesBgImage?: string }) {
  const next = { ...content } as Record<string, unknown>;
  if (typeof content.approachObjectivesBgImage === "string" && content.approachObjectivesBgImage.trim()) {
    const resolved = await resolveImageUrl(content.approachObjectivesBgImage.trim());
    if (resolved) next.approachObjectivesBgImage = resolved;
  }
  return next as typeof content;
}

export default async function OurWorkPage() {
  const [programsResolved, projectsResolved, merged, siteSettings] = await Promise.all([
    resolveProgramsForOurWork(),
    resolveProjectsForOurWork(),
    getMergedPageContent<typeof workContent>("our-work", cmsStaticOrEmpty(workContent)),
    getSiteSettings(),
  ]);
  const advisoryResolved = await resolveAdvisoryForOurWork(
    (merged as unknown as { advisory?: { cards?: Array<Record<string, unknown>> } }).advisory?.cards as
      | Array<{ id?: string; title?: string; description?: string; image?: string; order?: number; status?: string }>
      | undefined
  );

  const workMerged = merged as unknown as OurWorkPageContent & { heroImage?: string };
  const heroImage =
    (await resolveImageUrl(workMerged.heroImage)) || placeholderImages.programs;
  const resolvedContent = await resolveOurWorkInlineImages(workMerged as OurWorkPageContent & {
    heroImage?: string;
    approachObjectivesBgImage?: string;
  });

  return (
    <OurWorkClient
      programsResolved={programsResolved}
      projectsResolved={projectsResolved}
      advisoryResolved={advisoryResolved}
      content={resolvedContent}
      heroImage={heroImage}
      breadcrumbLabels={siteSettings.chrome.breadcrumbs}
    />
  );
}
