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
  title: "Projects",
  description: "Our targeted interventions - strengthening governance frameworks across African countries.",
};

type ProjectItem = {
  title: string;
  description: string;
};

type ProjectsWorkMerged = typeof workContent.projects & { heroImage?: string; cards?: ProjectItem[] };

export default async function ProjectsPage() {
  const [merged, bc] = await Promise.all([
    getMergedPageContent<ProjectsWorkMerged>(
      "our-work-projects",
      cmsStaticOrEmpty(workContent.projects as ProjectsWorkMerged)
    ),
    getBreadcrumbLabels(),
  ]);
  const content = merged;
  const heroSrc =
    cardImageUrlOrNull((await resolveImageUrl(content.heroImage)) ?? null) ?? undefined;
  const projects =
    Array.isArray(content.cards) && content.cards.length > 0
      ? content.cards
      : (workContent.projects.cards ?? []) as ProjectItem[];

  return (
    <>
      <PageHero
        variant="compact"
        title={content.title}
        subtitle={content.subtitle}
        image={heroSrc}
        imageAlt="Projects"
        breadcrumbs={[
          { label: bc.home, href: "/" },
          { label: bc.ourWork, href: "/our-work" },
          { label: bc.projects },
        ]}
      />

      <HomeScrollReveal variant="fadeUp" start="top 88%" className="block w-full">
        <Section className="bg-white">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">

            <div className="space-y-8">
              <p className="page-prose max-w-none text-black">
                Our projects are targeted initiatives developed in response to specific governance needs and
                opportunities. Each project is designed with clear objectives, defined outputs, and measurable
                outcomes, allowing for focused delivery within particular contexts. These interventions often
                contribute to broader programme goals while generating practical insights that inform future policy
                and institutional development.
              </p>

              <ProgramsCarousel programs={projects} />
            </div>

            <div className="mt-16 flex flex-wrap gap-4">
              <Button asChild href="/our-work" variant="outline">
                Back to Our Work
              </Button>
              <Button asChild href="/get-involved/partnership" variant="primary">
                Partner With Us
              </Button>
            </div>
          </div>
        </Section>
      </HomeScrollReveal>
    </>
  );
}
