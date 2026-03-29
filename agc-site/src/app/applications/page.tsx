import { getMergedPageContent } from "@/lib/page-content";
import { resolveImageUrl } from "@/lib/media";
import { placeholderImages } from "@/data/images";
import { getSiteSettings } from "@/lib/site-settings";
import { ApplicationsClient } from "./ApplicationsClient";

export default async function ApplicationsPage() {
  const [merged, siteSettings] = await Promise.all([
    getMergedPageContent(
    "applications",
    {
      heroTitle: "Volunteer application",
      heroSubtitle:
        "Your skills and time strengthen research, events, and policy dialogue across the continent. Tell us how you’d like to contribute — we read every submission.",
      applyIntro: "A few minutes now helps us match you to the right team. Fields marked * are required.",
      heroImage: placeholderImages.applications,
    } as Record<string, unknown>
    ),
    getSiteSettings(),
  ]);

  const heroImage = (await resolveImageUrl(merged.heroImage as string | undefined)) || placeholderImages.applications;

  return (
    <ApplicationsClient
      hero={{
        title: (merged.heroTitle as string) || "Volunteer application",
        subtitle:
          (merged.heroSubtitle as string) ||
          "Your skills and time strengthen research, events, and policy dialogue across the continent. Tell us how you’d like to contribute — we read every submission.",
        image: heroImage,
      }}
      applyIntro={
        (merged.applyIntro as string) ||
        "A few minutes now helps us match you to the right team. Fields marked * are required."
      }
      programsEmail={siteSettings.email.programs}
    />
  );
}
