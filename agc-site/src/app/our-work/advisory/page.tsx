import { workContent } from "@/data/content";
import { placeholderImages } from "@/data/images";
import { PageHero } from "@/components/PageHero";
import { cmsStaticOrEmpty, getMergedPageContent } from "@/lib/page-content";
import { resolveImageUrl } from "@/lib/media";
import { Button } from "@/components/Button";
import { getBreadcrumbLabels } from "@/lib/breadcrumbs";

export const metadata = {
  title: "Advisory",
  description: "Our expert services - the Africa Governance Review Project and policy recommendations.",
};

type AdvisoryWorkMerged = typeof workContent.advisory & { heroImage?: string };

export default async function AdvisoryPage() {
  const [merged, bc] = await Promise.all([
    getMergedPageContent<AdvisoryWorkMerged>(
      "our-work-advisory",
      cmsStaticOrEmpty(workContent.advisory as AdvisoryWorkMerged)
    ),
    getBreadcrumbLabels(),
  ]);
  const content = merged;
  const heroImage = (await resolveImageUrl(content.heroImage)) || placeholderImages.advisory;

  return (
    <>
      <PageHero
        variant="compact"
        title={content.title}
        subtitle={content.subtitle}
        image={heroImage}
        imageAlt="Advisory"
        breadcrumbs={[
          { label: bc.home, href: "/" },
          { label: bc.ourWork, href: "/our-work" },
          { label: bc.advisory },
        ]}
      />

      <section className="py-16 sm:py-20 lg:py-[80px] xl:py-[120px]">
        <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">

          <div className="prose prose-slate prose-lg max-w-none">
            <p className="text-slate-600">{content.description}</p>
          </div>

          <div className="mt-16 flex flex-wrap gap-4">
            <Button asChild href="/our-work" variant="outline">
              Back to Our Work
            </Button>
            <Button asChild href="/contact" variant="primary">
              Contact Us
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
