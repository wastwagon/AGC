import { cmsStaticOrEmpty, getMergedPageContent } from "@/lib/page-content";
import { resolveImageUrl } from "@/lib/media";
import { placeholderImages } from "@/data/images";
import { getSiteSettings } from "@/lib/site-settings";
import { ApplicationsClient } from "./ApplicationsClient";

const applicationsStaticFallback = {
  heroTitle: "Volunteer application",
  heroSubtitle:
    "Your skills and time strengthen research, events, and policy dialogue across the continent. Tell us how you’d like to contribute — we read every submission.",
  applyIntro: "A few minutes now helps us match you to the right team. Fields marked * are required.",
  heroImage: placeholderImages.applications,
};

export default async function ApplicationsPage() {
  const [merged, siteSettings] = await Promise.all([
    getMergedPageContent<typeof applicationsStaticFallback>(
      "applications",
      cmsStaticOrEmpty(applicationsStaticFallback)
    ),
    getSiteSettings(),
  ]);

  const heroImageRaw = merged.heroImage as string | undefined;
  const heroImage =
    (heroImageRaw ? await resolveImageUrl(heroImageRaw) : null) ||
    (process.env.BUILD_WITHOUT_DB === "1" ? placeholderImages.applications : undefined);

  return (
    <ApplicationsClient
      hero={{
        title: String(merged.heroTitle ?? "").trim(),
        subtitle: String(merged.heroSubtitle ?? "").trim(),
        image: heroImage,
      }}
      applyIntro={String(merged.applyIntro ?? "").trim()}
      programsEmail={siteSettings.email.programs}
    />
  );
}
