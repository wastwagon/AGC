import { OurWorkClient } from "./our-work-client";
import { getPrograms, getProjects } from "@/lib/content";
import { workContent, type OurWorkPageContent } from "@/data/content";
import { cmsStaticOrEmpty, getMergedPageContent } from "@/lib/page-content";
import { getSiteSettings } from "@/lib/site-settings";

export const metadata = {
  title: "Our Work",
  description: "Programs, projects, and advisory services advancing governance excellence across Africa.",
};

export const revalidate = 60;

export default async function OurWorkPage() {
  const [cmsPrograms, cmsProjects, merged, siteSettings] = await Promise.all([
    getPrograms(),
    getProjects(),
    getMergedPageContent<typeof workContent>("our-work", cmsStaticOrEmpty(workContent)),
    getSiteSettings(),
  ]);

  return (
    <OurWorkClient
      cmsPrograms={cmsPrograms}
      cmsProjects={cmsProjects}
      content={merged as unknown as OurWorkPageContent}
      breadcrumbLabels={siteSettings.chrome.breadcrumbs}
    />
  );
}
