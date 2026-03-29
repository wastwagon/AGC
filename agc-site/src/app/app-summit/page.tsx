import { appSummitContent } from "@/data/app-summit";
import { getMergedPageContent } from "@/lib/page-content";
import { resolveImageUrl } from "@/lib/media";
import { getSiteSettings } from "@/lib/site-settings";
import { AppSummitClient } from "./AppSummitClient";

export default async function AppSummitPage() {
  const fallback =
    process.env.BUILD_WITHOUT_DB === "1"
      ? ({ ...appSummitContent, heroImage: "/uploads/placeholder.svg" } as Record<string, unknown>)
      : ({} as Record<string, unknown>);

  const [merged, siteSettings] = await Promise.all([
    getMergedPageContent("app-summit", fallback),
    getSiteSettings(),
  ]);
  const content = merged as unknown as typeof appSummitContent & { heroImage?: string };
  const resolved = content.heroImage ? await resolveImageUrl(content.heroImage) : null;
  const heroImage = resolved || undefined;

  return <AppSummitClient content={content} heroImage={heroImage} siteSettings={siteSettings} />;
}
