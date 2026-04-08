import { OurWorkClient } from "./our-work-client";
import { getPrograms, getProjects } from "@/lib/content";
import { workContent, type OurWorkPageContent } from "@/data/content";
import { placeholderImages } from "@/data/images";
import { cmsStaticOrEmpty, getMergedPageContent } from "@/lib/page-content";
import { cardImageUrlOrNull } from "@/lib/image-delivery";
import { resolveImageUrl } from "@/lib/media";
import { getSiteSettings } from "@/lib/site-settings";

export const metadata = {
  title: "Our Work",
  description: "Programs, projects, and advisory services advancing governance excellence across Africa.",
};

export const revalidate = 60;

function stripHtmlDescription(html: string | undefined, maxLen: number) {
  return (html || "").replace(/<[^>]*>/g, "").slice(0, maxLen);
}

export default async function OurWorkPage() {
  const [cmsPrograms, cmsProjects, merged, siteSettings] = await Promise.all([
    getPrograms(),
    getProjects(),
    getMergedPageContent<typeof workContent>("our-work", cmsStaticOrEmpty(workContent)),
    getSiteSettings(),
  ]);

  const programsResolved = await Promise.all(
    cmsPrograms.map(async (p) => ({
      key: `program-${p.id}`,
      title: p.title,
      description: stripHtmlDescription(p.description, 300),
      imageUrl: cardImageUrlOrNull((await resolveImageUrl(p.image)) ?? null),
    }))
  );

  const projectsResolved = await Promise.all(
    cmsProjects.map(async (p) => ({
      key: `project-${p.id}`,
      title: p.title,
      description: stripHtmlDescription(p.description, 300),
      imageUrl: cardImageUrlOrNull((await resolveImageUrl(p.image)) ?? null),
    }))
  );

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
