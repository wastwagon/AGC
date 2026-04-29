import { workContent } from "@/data/content";
import { PageHero } from "@/components/PageHero";
import { HomeScrollReveal } from "@/components/home/HomeScrollReveal";
import { cmsStaticOrEmpty, getMergedPageContent } from "@/lib/page-content";
import { cardImageUrlOrNull } from "@/lib/image-delivery";
import { resolveImageUrl } from "@/lib/media";
import { Button } from "@/components/Button";
import { getBreadcrumbLabels } from "@/lib/breadcrumbs";
import { getPartners } from "@/lib/content";
import { PartnerGrid } from "@/components/our-work/PartnerGrid";

export const metadata = {
  title: "Partnership",
  description: "Collaborate with the Africa Governance Centre on research, programmes, and convenings.",
};

type PartnershipWorkMerged = typeof workContent.partnership & { heroImage?: string };

export default async function PartnershipWorkPage() {
  const [merged, bc, partnerRows] = await Promise.all([
    getMergedPageContent<PartnershipWorkMerged>(
      "our-work-partnership",
      cmsStaticOrEmpty(workContent.partnership as PartnershipWorkMerged)
    ),
    getBreadcrumbLabels(),
    getPartners(),
  ]);
  const content = merged;
  const partnersResolved = await Promise.all(
    partnerRows.map(async (p) => ({
      id: p.id,
      name: p.name,
      logoUrl: cardImageUrlOrNull((await resolveImageUrl(p.logo)) ?? null),
      url: p.url?.trim() || undefined,
    }))
  );
  const heroSrc =
    cardImageUrlOrNull((await resolveImageUrl(content.heroImage)) ?? null) ?? undefined;

  return (
    <>
      <PageHero
        variant="compact"
        title={content.title}
        subtitle={content.subtitle}
        image={heroSrc}
        imageAlt="Partnership"
        breadcrumbs={[
          { label: bc.home, href: "/" },
          { label: bc.ourWork, href: "/our-work" },
          { label: content.title },
        ]}
      />

      <HomeScrollReveal variant="fadeUp" start="top 88%" className="block w-full">
        <section className="bg-white py-16 sm:py-20 lg:py-[80px] xl:py-[120px]">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="prose prose-slate prose-lg max-w-none">
              <p className="text-slate-600">{content.description}</p>
            </div>

            <div className="mt-14 sm:mt-16">
              <p className="text-sm font-medium text-accent-800">Partners</p>
              <h2 className="page-heading mt-2 text-2xl text-black sm:text-3xl">
                Institutions we work with
              </h2>
              <div className="mt-10">
                <PartnerGrid partners={partnersResolved} />
              </div>
            </div>

            <div className="mt-16 flex flex-wrap gap-4">
              <Button asChild href="/our-work" variant="outline" className="rounded-none">
                Back to Our Work
              </Button>
              <Button asChild href="/get-involved/partnership" variant="primary" className="rounded-none">
                Partner with us
              </Button>
            </div>
          </div>
        </section>
      </HomeScrollReveal>
    </>
  );
}
