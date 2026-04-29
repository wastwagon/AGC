import { workContent } from "@/data/content";
import { PageHero } from "@/components/PageHero";
import { HomeScrollReveal } from "@/components/home/HomeScrollReveal";
import { cmsStaticOrEmpty, getMergedPageContent } from "@/lib/page-content";
import { cardImageUrlOrNull } from "@/lib/image-delivery";
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
  const heroSrc =
    cardImageUrlOrNull((await resolveImageUrl(content.heroImage)) ?? null) ?? undefined;

  return (
    <>
      <PageHero
        variant="compact"
        title={content.title}
        subtitle={content.subtitle}
        image={heroSrc}
        imageAlt="Advisory"
        breadcrumbs={[
          { label: bc.home, href: "/" },
          { label: bc.ourWork, href: "/our-work" },
          { label: bc.advisory },
        ]}
      />

      <HomeScrollReveal variant="scaleUp" start="top 88%" className="block w-full">
        <section className="bg-white py-16 sm:py-20 lg:py-[80px] xl:py-[120px]">
        <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">

          <div className="space-y-8">
            <p className="page-prose max-w-none text-black">
              AGC provides strategic advisory support to governments, public institutions, and development
              partners on governance, policy, and institutional reform. Our advisory work is grounded in evidence
              and practical experience, enabling us to support decision-making processes, policy design, and
              implementation strategies. We work closely with partners to navigate complex governance
              environments and strengthen institutional effectiveness.
            </p>

            <ol className="space-y-6">
              <li className="page-card p-5"><h3 className="font-serif text-xl font-semibold text-black">1. Policy design and review</h3><p className="page-prose mt-2 text-black">We support governments and institutions in the development, review, and refinement of public policies. This includes providing evidence-based analysis, facilitating stakeholder consultations, and ensuring alignment with national priorities as well as regional and continental frameworks. Our approach strengthens the quality, relevance, and practicality of policy decisions.</p></li>
              <li className="page-card p-5"><h3 className="font-serif text-xl font-semibold text-black">2. Institutional strengthening support</h3><p className="page-prose mt-2 text-black">AGC works with public institutions to enhance their effectiveness, accountability, and long-term sustainability. We conduct institutional assessments, identify structural and operational gaps, and provide tailored recommendations that improve governance systems, internal processes, and service delivery outcomes.</p></li>
              <li className="page-card p-5"><h3 className="font-serif text-xl font-semibold text-black">3. Political and governance risk analysis</h3><p className="page-prose mt-2 text-black">We provide in-depth analysis of political dynamics, governance trends, and institutional risks to support informed decision-making. Our work helps partners anticipate challenges, understand evolving contexts, and develop strategies that are responsive to complex and often fluid political environments.</p></li>
              <li className="page-card p-5"><h3 className="font-serif text-xl font-semibold text-black">4. Stakeholder engagement and dialogue facilitation</h3><p className="page-prose mt-2 text-black">We design and support structured engagement processes that bring together governments, political actors, civil society, and other stakeholders. Through facilitated dialogue and consensus-building approaches, we help create inclusive spaces for policy discussion, reform processes, and collaborative problem-solving.</p></li>
            </ol>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex min-h-[180px] items-center justify-center border border-border bg-white text-sm text-black">Image placeholder</div>
              <div className="flex min-h-[180px] items-center justify-center border border-border bg-white text-sm text-black">Image placeholder</div>
              <div className="flex min-h-[180px] items-center justify-center border border-border bg-white text-sm text-black">Image placeholder</div>
            </div>
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
      </HomeScrollReveal>
    </>
  );
}
