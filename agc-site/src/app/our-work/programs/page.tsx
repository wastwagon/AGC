import { workContent } from "@/data/content";
import { PageHero } from "@/components/PageHero";
import { HomeScrollReveal } from "@/components/home/HomeScrollReveal";
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

      <HomeScrollReveal variant="fadeUp" start="top 88%" className="block w-full">
        <section className="bg-white py-16 sm:py-20 lg:py-[80px] xl:py-[120px]">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="space-y-8">
            <p className="page-prose max-w-none text-black">
              AGC designs and manages programmes that bring together multiple initiatives to address evolving
              governance challenge. These programmes provide structured frameworks for sustained engagement,
              combining research, dialogue, capacity building, and policy support within a coherent strategy.
              Through our programmes, we work with diverse stakeholders across sectors to drive long-term
              institutional strengthening and governance outcomes.
            </p>

            <ol className="space-y-6">
              <li className="page-card p-5">
                <h3 className="font-serif text-xl font-semibold text-black">1. African Political Parties Initiative</h3>
                <p className="page-prose mt-2 text-black">The African Political Parties Initiative (APPI) is a project developed by the Africa Governance Centre dedicated to supporting the role of political parties in Africa's development.</p>
              </li>
              <li className="page-card p-5">
                <h3 className="font-serif text-xl font-semibold text-black">2. Africa Governance Review</h3>
                <p className="page-prose mt-2 text-black">The Africa Governance Review Project is a comprehensive initiative dedicated to conducting detailed assessments, offering policy recommendations, and facilitating discussions on governance challenges and opportunities across African nations.</p>
              </li>
              <li className="page-card p-5">
                <h3 className="font-serif text-xl font-semibold text-black">3. Africa Resource Governance Initiative</h3>
                <p className="page-prose mt-2 text-black">The Africa Resource Governance Initiative (ARGI), a project of the Africa Governance Centre, is dedicated to promoting transparency, accountability, and sustainable management of natural resources across Africa.</p>
              </li>
              <li className="page-card p-5">
                <h3 className="font-serif text-xl font-semibold text-black">4. Public Sector Efficiency and Innovation Project</h3>
                <p className="page-prose mt-2 text-black">The Public Sector Efficiency and Innovation Project is dedicated to addressing the critical need for streamlined operations, improved public service delivery, and the integration of innovative solutions to support Africa's development.</p>
              </li>
              <li className="page-card p-5">
                <h3 className="font-serif text-xl font-semibold text-black">5. Media and Democracy Initiative</h3>
                <p className="page-prose mt-2 text-black">The Media and Democracy Initiative of the Africa Governance Centre seek to empower media professionals, support independent journalism, and strengthen the media's ability to facilitate informed citizen participation in governance processes.</p>
              </li>
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
