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
  title: "Capacity Building",
  description: "Capacity building and learning programmes from the Africa Governance Centre.",
};

type TrainingItem = {
  title: string;
  description: string;
};

type TrainingWorkMerged = typeof workContent.training & { heroImage?: string; cards?: TrainingItem[] };

export default async function TrainingWorkPage() {
  const [merged, bc] = await Promise.all([
    getMergedPageContent<TrainingWorkMerged>(
      "our-work-training",
      cmsStaticOrEmpty(workContent.training as TrainingWorkMerged)
    ),
    getBreadcrumbLabels(),
  ]);
  const content = merged;
  const displayTitle = (content.title || "").trim().toLowerCase() === "training" ? "Capacity Building" : content.title;
  const heroSrc =
    cardImageUrlOrNull((await resolveImageUrl(content.heroImage)) ?? null) ?? undefined;
  const training =
    Array.isArray(content.cards) && content.cards.length > 0
      ? content.cards
      : ([] as TrainingItem[]);

  return (
    <>
      <PageHero
        variant="compact"
        title={displayTitle}
        subtitle={content.subtitle}
        image={heroSrc}
        imageAlt="Capacity Building"
        breadcrumbs={[
          { label: bc.home, href: "/" },
          { label: bc.ourWork, href: "/our-work" },
          { label: displayTitle },
        ]}
      />

      <HomeScrollReveal variant="fadeUp" start="top 88%" className="block w-full">
        <Section className="bg-white">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="space-y-8">
              <p className="page-prose max-w-none text-black">
                AGC delivers training and capacity-building initiatives designed to equip leaders, practitioners,
                and emerging actors with the skills and knowledge required to navigate governance challenges. Our
                programmes combine theoretical grounding with practical application, offering participants
                opportunities to engage with real-world policy issues, develop leadership capabilities, and
                strengthen their contributions to governance processes.
              </p>

              <ProgramsCarousel programs={training} />
            </div>

            <div className="mt-16 flex flex-wrap gap-4">
              <Button asChild href="/our-work" variant="outline">
                Back to Our Work
              </Button>
              <Button asChild href="/events" variant="primary">
                View Events
              </Button>
            </div>
          </div>
        </Section>
      </HomeScrollReveal>
    </>
  );
}
