import { appSummitContent } from "@/data/app-summit";
import { cmsStaticOrEmpty, getMergedPageContent } from "@/lib/page-content";
import { resolveImageUrl } from "@/lib/media";
import { getSiteSettings } from "@/lib/site-settings";
import { AppSummitClient } from "./AppSummitClient";

export const revalidate = 60;

const PLACEHOLDER_HERO = "/uploads/placeholder.svg";

type AppSummitMerged = typeof appSummitContent & { heroImage?: string; sectionImage?: string };

const appSummitBuildFallback: AppSummitMerged = {
  ...appSummitContent,
  heroImage: PLACEHOLDER_HERO,
};

/** Skip seeded placeholder; try hero then section image so CMS media ids always surface. */
async function resolveAppSummitHeroImage(content: AppSummitMerged): Promise<string | undefined> {
  const candidates = [content.heroImage, content.sectionImage].filter(
    (ref): ref is string => typeof ref === "string" && ref.trim() !== "" && ref.trim() !== PLACEHOLDER_HERO
  );
  for (const ref of candidates) {
    const url = await resolveImageUrl(ref);
    if (url && url !== PLACEHOLDER_HERO) return url;
  }
  return undefined;
}

export default async function AppSummitPage() {
  const fallback = cmsStaticOrEmpty(appSummitBuildFallback);

  const [merged, siteSettings] = await Promise.all([
    getMergedPageContent<AppSummitMerged>("app-summit", fallback),
    getSiteSettings(),
  ]);
  const content = merged;
  const heroImage = await resolveAppSummitHeroImage(content);

  return <AppSummitClient content={content} heroImage={heroImage} siteSettings={siteSettings} />;
}
