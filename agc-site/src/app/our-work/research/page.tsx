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
            <div className="space-y-8">
              <p className="page-prose max-w-none text-black">
                Our research generates rigorous, evidence-based analysis on governance, political economy, and
                institutional development across Africa. We prioritise work that is policy-relevant and grounded
                in African contexts, ensuring that our outputs contribute meaningfully to decision-making processes
                and public discourse. Through our research, we seek to bridge the gap between knowledge and
                practice while elevating African perspectives in continental and global debates.
              </p>

              <ol className="space-y-6">
                <li className="page-card p-5"><h3 className="font-serif text-xl font-semibold text-black">1. Policy research and analysis</h3><p className="page-prose mt-2 text-black">AGC conducts rigorous research on governance, political economy, and institutional development across Africa. Our work is grounded in local realities and designed to generate insights that directly inform policy decisions and governance reforms.</p></li>
                <li className="page-card p-5"><h3 className="font-serif text-xl font-semibold text-black">2. Publications and policy briefs</h3><p className="page-prose mt-2 text-black">We produce a range of knowledge products, including reports, policy briefs, and analytical papers that translate complex research into clear, accessible, and actionable recommendations for policymakers and practitioners.</p></li>
                <li className="page-card p-5"><h3 className="font-serif text-xl font-semibold text-black">3. Governance assessments</h3><p className="page-prose mt-2 text-black">We undertake data-driven assessments of governance systems, institutions, and policy environments to identify gaps, challenges, and opportunities. These diagnostics provide a foundation for targeted interventions and evidence-based reform strategies.</p></li>
                <li className="page-card p-5"><h3 className="font-serif text-xl font-semibold text-black">4. Thematic and comparative research initiatives</h3><p className="page-prose mt-2 text-black">We lead and contribute to research initiatives focused on key governance themes such as democratic processes, regional integration, political participation, and institutional accountability. Our work often includes comparative analysis that draws lessons across countries and regions.</p></li>
              </ol>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="flex min-h-[180px] items-center justify-center border border-border bg-white text-sm text-black">Image placeholder</div>
                <div className="flex min-h-[180px] items-center justify-center border border-border bg-white text-sm text-black">Image placeholder</div>
                <div className="flex min-h-[180px] items-center justify-center border border-border bg-white text-sm text-black">Image placeholder</div>
              </div>
            </div>

            <div className="mt-16 flex flex-wrap gap-4">
              <Button asChild href="/our-work" variant="outline" className="rounded-none">
                Back to Our Work
              </Button>
              <Button asChild href="/publications" variant="primary" className="rounded-none">
                Publications
              </Button>
            </div>
          </div>
        </section>
      </HomeScrollReveal>
    </>
  );
}
