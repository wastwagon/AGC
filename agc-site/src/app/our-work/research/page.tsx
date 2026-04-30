import { workContent } from "@/data/content";
import { PageHero } from "@/components/PageHero";
import { HomeScrollReveal } from "@/components/home/HomeScrollReveal";
import { cmsStaticOrEmpty, getMergedPageContent } from "@/lib/page-content";
import { cardImageUrlOrNull } from "@/lib/image-delivery";
import { resolveImageUrl } from "@/lib/media";
import { Button } from "@/components/Button";
import { getBreadcrumbLabels } from "@/lib/breadcrumbs";
import { ProgramsCarousel } from "@/components/ProgramsCarousel";
import { Section } from "@/components/Section";

export const metadata = {
  title: "Research",
  description: "Evidence and inquiry driving governance excellence across Africa.",
};

type ResearchItem = {
  title: string;
  description: string;
};

type ResearchWorkMerged = typeof workContent.research & { heroImage?: string; cards?: ResearchItem[] };

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
  const research =
    Array.isArray(content.cards) && content.cards.length > 0
      ? content.cards
      : ([] as ResearchItem[]);

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
        <Section className="bg-white">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="space-y-8">
              <p className="page-prose max-w-none text-black">
                Our research generates rigorous, evidence-based analysis on governance, political economy, and
                institutional development across Africa. We prioritise work that is policy-relevant and grounded
                in African contexts, ensuring that our outputs contribute meaningfully to decision-making processes
                and public discourse. Through our research, we seek to bridge the gap between knowledge and
                practice while elevating African perspectives in continental and global debates.
              </p>

              <ProgramsCarousel programs={research} />
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
        </Section>
      </HomeScrollReveal>
    </>
  );
}
