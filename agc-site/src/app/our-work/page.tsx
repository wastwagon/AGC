import { OurWorkClient } from "./our-work-client";
import { workContent, type OurWorkPageContent } from "@/data/content";
import { placeholderImages } from "@/data/images";
import { cmsStaticOrEmpty, getMergedPageContent } from "@/lib/page-content";
import { resolveImageUrl } from "@/lib/media";
import { getSiteSettings } from "@/lib/site-settings";
import { resolveProgramsForOurWork, resolveProjectsForOurWork } from "@/lib/our-work-cards";

export const metadata = {
  title: "Our Work",
  description: "Programs, projects, and advisory services advancing governance excellence across Africa.",
};

export const revalidate = 60;

export default async function OurWorkPage() {
  const [programsResolved, projectsResolved, merged, siteSettings] = await Promise.all([
    resolveProgramsForOurWork(),
    resolveProjectsForOurWork(),
    getMergedPageContent<typeof workContent>("our-work", cmsStaticOrEmpty(workContent)),
    getSiteSettings(),
  ]);

  const workMerged = merged as unknown as OurWorkPageContent & { heroImage?: string };
  const heroImage =
    (await resolveImageUrl(workMerged.heroImage)) || placeholderImages.programs;

  return (
    <OurWorkClient
      programsResolved={programsResolved}
      projectsResolved={projectsResolved}
      content={workMerged}
      heroImage={heroImage}
      breadcrumbLabels={siteSettings.chrome.breadcrumbs}
    />
  );
}
