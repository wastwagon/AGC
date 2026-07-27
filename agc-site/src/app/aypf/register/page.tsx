import { RoiRegisterPage, roiRegisterMetadata } from "@/components/RoiRegisterPage";
import { aypfContent } from "@/data/aypf";
import { getMergedPageContent } from "@/lib/page-content";
import { resolveImageUrl } from "@/lib/media";

export const metadata = roiRegisterMetadata("aypf");
export const revalidate = 60;

const PLACEHOLDER_HERO = "/uploads/placeholder.svg";

export default async function AypfRegisterPage() {
  const content = await getMergedPageContent("aypf", {
    ...aypfContent,
    heroImage: PLACEHOLDER_HERO,
  });
  const ref = (content as { heroImage?: string }).heroImage;
  let heroImage: string | undefined;
  if (typeof ref === "string" && ref.trim() && ref.trim() !== PLACEHOLDER_HERO) {
    const url = await resolveImageUrl(ref);
    if (url && url !== PLACEHOLDER_HERO) heroImage = url;
  }
  return <RoiRegisterPage eventType="aypf" heroImage={heroImage} />;
}
