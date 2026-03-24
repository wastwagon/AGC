import { appSummitContent } from "@/data/app-summit";
import { placeholderImages } from "@/data/images";
import { getMergedPageContent } from "@/lib/page-content";
import { resolveImageUrl } from "@/lib/media";
import { getSiteSettings } from "@/lib/site-settings";
import { AppSummitClient } from "./AppSummitClient";

export default async function AppSummitPage() {
  const [merged, siteSettings] = await Promise.all([
    getMergedPageContent("app-summit", {
      ...appSummitContent,
      heroImage: placeholderImages.appSummit,
    } as Record<string, unknown>),
    getSiteSettings(),
  ]);
  const content = merged as unknown as typeof appSummitContent & { heroImage?: string };
  const heroImage = (await resolveImageUrl(content.heroImage)) || placeholderImages.appSummit;

  return <AppSummitClient content={content} heroImage={heroImage} siteSettings={siteSettings} />;
}
