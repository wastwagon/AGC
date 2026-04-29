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
            <div className="space-y-8">
              <p className="page-prose max-w-none text-black">
                Partnerships are central to AGC’s approach. We collaborate with regional and international
                institutions, development partners, academia, civil society, and the private sector to advance shared
                governance objectives. Through these collaborations, we leverage complementary expertise, expand our
                reach, and support coordinated responses to governance challenges across different contexts.
              </p>

              <ol className="space-y-6">
                <li className="page-card p-5"><h3 className="font-serif text-xl font-semibold text-black">1. Strategic institutional partnerships</h3><p className="page-prose mt-2 text-black">AGC collaborates with regional and continental bodies such as ECOWAS and the African Union, as well as international partners including the European Union and UNDP. These partnerships enable us to contribute to high-level policy processes, support regional governance initiatives, and align our work with broader development priorities across Africa.</p></li>
                <li className="page-card p-5"><h3 className="font-serif text-xl font-semibold text-black">2. Multi-stakeholder collaboration platforms</h3><p className="page-prose mt-2 text-black">We create and sustain platforms that bring together governments, political actors, civil society, academia, and the private sector to engage on governance and development challenges. These platforms foster dialogue, shared learning, and coordinated responses to complex issues.</p></li>
                <li className="page-card p-5"><h3 className="font-serif text-xl font-semibold text-black">3. Academic and research collaborations</h3><p className="page-prose mt-2 text-black">AGC works with universities, research institutions, and scholars to strengthen knowledge production and promote evidence-based policy engagement. These collaborations support joint research, publications, and the exchange of ideas across disciplines and regions.</p></li>
                <li className="page-card p-5"><h3 className="font-serif text-xl font-semibold text-black">4. Diplomatic and development engagement</h3><p className="page-prose mt-2 text-black">We engage with the diplomatic community and development partners to facilitate policy dialogue, provide insights on governance trends, and support collaborative initiatives. This engagement helps bridge national, regional, and global perspectives on governance and development.</p></li>
              </ol>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="flex min-h-[180px] items-center justify-center border border-border bg-white text-sm text-black">Image placeholder</div>
                <div className="flex min-h-[180px] items-center justify-center border border-border bg-white text-sm text-black">Image placeholder</div>
                <div className="flex min-h-[180px] items-center justify-center border border-border bg-white text-sm text-black">Image placeholder</div>
              </div>
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
