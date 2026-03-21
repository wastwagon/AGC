import { OurWorkClient } from "./our-work-client";
import { getPrograms, getProjects } from "@/lib/content";

export const metadata = {
  title: "Our Work",
  description: "Programs, projects, and advisory services advancing governance excellence across Africa.",
};

export const revalidate = 60;

export default async function OurWorkPage() {
  const [cmsPrograms, cmsProjects] = await Promise.all([getPrograms(), getProjects()]);

  return <OurWorkClient cmsPrograms={cmsPrograms} cmsProjects={cmsProjects} />;
}
