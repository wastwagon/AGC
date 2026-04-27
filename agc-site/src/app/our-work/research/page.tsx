import { workContent } from "@/data/content";
import { PageHero } from "@/components/PageHero";
import { HomeScrollReveal } from "@/components/home/HomeScrollReveal";
import { cmsStaticOrEmpty, getMergedPageContent } from "@/lib/page-content";
import { cardImageUrlOrNull } from "@/lib/image-delivery";
import { resolveImageUrl } from "@/lib/media";
import { Button } from "@/components/Button";
import { getBreadcrumbLabels } from "@/lib/breadcrumbs";

export const metadata = {
  title: "Research",
  description: "Evidence and inquiry driving governance excellence across Africa.",
};

type ResearchWorkMerged = typeof workContent.research & { heroImage?: string };

export default async function ResearchWorkPage() {
  const [merged, bc] = await Promise.all([
    getMergedPageContent<ResearchWorkMerged>(
      "our-work-research",
      cmsStaticOrEmpty(workContent.research as ResearchWorkMerged)
    ),
    getBreadcrumbLabels(),
  ]);
  const content = merged;
  const heroSrc =
    cardImageUrlOrNull((await resolveImageUrl(content.heroImage)) ?? null) ?? undefined;

  return (
    <>
      <PageHero
        variant="compact"
        title={content.title}
        subtitle={content.subtitle}
        image={heroSrc}
        imageAlt="Research"
        breadcrumbs={[
          { label: bc.home, href: "/" },
          { label: bc.ourWork, href: "/our-work" },
          { label: content.title },
        ]}
      />

      <HomeScrollReveal variant="fadeUp" start="top 88%" className="block w-full">
        <section className="bg-white py-16 sm:py-20 lg:py-[80px] xl:py-[120px]">
          <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="prose prose-slate prose-lg max-w-none">
              <p className="text-slate-600">{content.description}</p>
            </div>

            <div className="mt-16 flex flex-wrap gap-4">
              <Button asChild href="/our-work" variant="outline">
                Back to Our Work
              </Button>
              <Button asChild href="/publications" variant="primary">
                Publications
              </Button>
            </div>
          </div>
        </section>
      </HomeScrollReveal>
    </>
  );
}
