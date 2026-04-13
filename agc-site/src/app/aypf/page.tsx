import { aypfContent } from "@/data/aypf";
import { getMergedPageContent } from "@/lib/page-content";
import { resolveImageUrl } from "@/lib/media";
import { getSiteSettings } from "@/lib/site-settings";
import { AypfClient } from "./AypfClient";

/** Match root layout: header/nav/footer come from DB — avoid ISR snapshotting old chrome after deploy or on refresh. */
export const dynamic = "force-dynamic";

const PLACEHOLDER_HERO = "/uploads/placeholder.svg";

type AypfMerged = typeof aypfContent & { heroImage?: string };

const aypfBuildFallback: AypfMerged = {
  ...aypfContent,
  heroImage: PLACEHOLDER_HERO,
};

async function resolveAypfHeroImage(content: AypfMerged): Promise<string | undefined> {
  const ref = content.heroImage;
  if (typeof ref !== "string" || ref.trim() === "" || ref.trim() === PLACEHOLDER_HERO) {
    return undefined;
  }
  const url = await resolveImageUrl(ref);
  if (url && url !== PLACEHOLDER_HERO) return url;
  return undefined;
}

export default async function AypfPage() {
  /** Full static base so the page renders when no CMS row exists; CMS JSON still deep-merges over this. */
  const [merged, siteSettings] = await Promise.all([
    getMergedPageContent<AypfMerged>("aypf", aypfBuildFallback),
    getSiteSettings(),
  ]);
  const heroImage = await resolveAypfHeroImage(merged);

  return <AypfClient content={merged} heroImage={heroImage} siteSettings={siteSettings} />;
}
