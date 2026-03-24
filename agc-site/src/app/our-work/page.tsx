import { OurWorkClient } from "./our-work-client";
import { getPrograms, getProjects } from "@/lib/content";
import { workContent } from "@/data/content";
import { getMergedPageContent } from "@/lib/page-content";

export const metadata = {
  title: "Our Work",
  description: "Programs, projects, and advisory services advancing governance excellence across Africa.",
};

export const revalidate = 60;

export default async function OurWorkPage() {
  const [cmsPrograms, cmsProjects, merged] = await Promise.all([
    getPrograms(),
    getProjects(),
    getMergedPageContent("our-work", workContent as unknown as Record<string, unknown>),
  ]);

  return (
    <OurWorkClient
      cmsPrograms={cmsPrograms}
      cmsProjects={cmsProjects}
      content={merged as unknown as typeof workContent}
    />
  );
}
