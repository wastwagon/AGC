import { workContent } from "@/data/content";
import { PageHero } from "@/components/PageHero";
import { cmsStaticOrEmpty, getMergedPageContent } from "@/lib/page-content";
import { cardImageUrlOrNull } from "@/lib/image-delivery";
import { resolveImageUrl } from "@/lib/media";
import { Button } from "@/components/Button";
import { getBreadcrumbLabels } from "@/lib/breadcrumbs";

export const metadata = {
  title: "Programs",
  description: "Our core focus areas - forums and expert roundtables advancing governance excellence across Africa.",
};

type ProgramsWorkMerged = typeof workContent.programs & { heroImage?: string };

export default async function ProgramsPage() {
  const [merged, bc] = await Promise.all([
    getMergedPageContent<ProgramsWorkMerged>(
      "our-work-programs",
      cmsStaticOrEmpty(workContent.programs as ProgramsWorkMerged)
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
        imageAlt="Programs"
        breadcrumbs={[
          { label: bc.home, href: "/" },
          { label: bc.ourWork, href: "/our-work" },
          { label: bc.programs },
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
            <Button asChild href="/events" variant="primary">
              View Events
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
