import { workContent } from "@/data/content";
import { PageHero } from "@/components/PageHero";
import { HomeScrollReveal } from "@/components/home/HomeScrollReveal";
import { cmsStaticOrEmpty, getMergedPageContent } from "@/lib/page-content";
import { cardImageUrlOrNull } from "@/lib/image-delivery";
import { resolveImageUrl } from "@/lib/media";
import { Button } from "@/components/Button";
import { getBreadcrumbLabels } from "@/lib/breadcrumbs";
import { resolveProgramsForOurWork } from "@/lib/our-work-cards";
import { WorkAreaCardGrid } from "@/components/our-work/WorkAreaCardGrid";

export const metadata = {
  title: "Programs",
  description: "Our core focus areas - forums and expert roundtables advancing governance excellence across Africa.",
};

type ProgramsWorkMerged = typeof workContent.programs & { heroImage?: string };

export default async function ProgramsPage() {
  const [merged, bc, programCards] = await Promise.all([
    getMergedPageContent<ProgramsWorkMerged>(
      "our-work-programs",
      cmsStaticOrEmpty(workContent.programs as ProgramsWorkMerged)
    ),
    getBreadcrumbLabels(),
    resolveProgramsForOurWork(),
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
        imageAlt="Programs"
        breadcrumbs={[
          { label: bc.home, href: "/" },
          { label: bc.ourWork, href: "/our-work" },
          { label: bc.programs },
        ]}
      />

      <HomeScrollReveal variant="fadeUp" start="top 88%" className="block w-full">
        <section className="bg-white py-16 sm:py-20 lg:py-[80px] xl:py-[120px]">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="prose prose-slate prose-lg max-w-none">
            <p className="text-slate-600">{content.description}</p>
          </div>

          <div className="mt-14 sm:mt-16">
            <p className="text-sm font-medium text-accent-800">Programmes</p>
            <h2 className="page-heading mt-2 text-2xl text-black sm:text-3xl">What we run</h2>
            <div className="mt-10">
              <WorkAreaCardGrid cards={programCards} />
            </div>
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
      </section>
      </HomeScrollReveal>
    </>
  );
}
