import { RoiRegisterPage, roiRegisterMetadata } from "@/components/RoiRegisterPage";
import { cmsStaticOrEmpty, getMergedPageContent } from "@/lib/page-content";
import { resolveImageUrl } from "@/lib/media";

export const metadata = roiRegisterMetadata("awpls");
export const revalidate = 60;

const PLACEHOLDER_HERO = "/uploads/placeholder.svg";

export default async function AwplsRegisterPage() {
  const content = await getMergedPageContent(
    "awpls",
    cmsStaticOrEmpty({
      title: "African Women Political Leadership Summit",
      subtitle: "AWPLS",
      heroImage: PLACEHOLDER_HERO,
    })
  );
  const ref = (content as { heroImage?: string }).heroImage;
  let heroImage: string | undefined;
  if (typeof ref === "string" && ref.trim() && ref.trim() !== PLACEHOLDER_HERO) {
    const url = await resolveImageUrl(ref);
    if (url && url !== PLACEHOLDER_HERO) heroImage = url;
  }
  return <RoiRegisterPage eventType="awpls" heroImage={heroImage} />;
}
