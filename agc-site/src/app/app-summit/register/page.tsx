import { RoiRegisterPage, roiRegisterMetadata } from "@/components/RoiRegisterPage";
import { appSummitContent } from "@/data/app-summit";
import { getMergedPageContent } from "@/lib/page-content";
import { resolveImageUrl } from "@/lib/media";

export const metadata = roiRegisterMetadata("apps");
export const revalidate = 60;

const PLACEHOLDER_HERO = "/uploads/placeholder.svg";

export default async function AppSummitRegisterPage() {
  const content = await getMergedPageContent("app-summit", {
    ...appSummitContent,
    heroImage: PLACEHOLDER_HERO,
  });
  const ref = (content as { heroImage?: string }).heroImage;
  let heroImage: string | undefined;
  if (typeof ref === "string" && ref.trim() && ref.trim() !== PLACEHOLDER_HERO) {
    const url = await resolveImageUrl(ref);
    if (url && url !== PLACEHOLDER_HERO) heroImage = url;
  }
  return <RoiRegisterPage eventType="apps" heroImage={heroImage} />;
}
