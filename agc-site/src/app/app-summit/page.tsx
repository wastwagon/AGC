import { appSummitContent } from "@/data/app-summit";
import { cmsStaticOrEmpty, getMergedPageContent } from "@/lib/page-content";
import { resolveImageUrl } from "@/lib/media";
import { getSiteSettings } from "@/lib/site-settings";
import { AppSummitClient } from "./AppSummitClient";

type AppSummitMerged = typeof appSummitContent & { heroImage?: string };

const appSummitBuildFallback: AppSummitMerged = {
  ...appSummitContent,
  heroImage: "/uploads/placeholder.svg",
};

export default async function AppSummitPage() {
  const fallback = cmsStaticOrEmpty(appSummitBuildFallback);

  const [merged, siteSettings] = await Promise.all([
    getMergedPageContent<AppSummitMerged>("app-summit", fallback),
    getSiteSettings(),
  ]);
  const content = merged;
  const resolved = content.heroImage ? await resolveImageUrl(content.heroImage) : null;
  const heroImage = resolved || undefined;

  return <AppSummitClient content={content} heroImage={heroImage} siteSettings={siteSettings} />;
}
