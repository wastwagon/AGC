import { workContent } from "@/data/content";
import { PageHero } from "@/components/PageHero";
import { HomeScrollReveal } from "@/components/home/HomeScrollReveal";
import { cmsStaticOrEmpty, getMergedPageContent } from "@/lib/page-content";
import { cardImageUrlOrNull } from "@/lib/image-delivery";
import { resolveImageUrl } from "@/lib/media";
import { Button } from "@/components/Button";
import { getBreadcrumbLabels } from "@/lib/breadcrumbs";

export const metadata = {
  title: "Capacity Building",
  description: "Capacity building and learning programmes from the Africa Governance Centre.",
};

type TrainingWorkMerged = typeof workContent.training & { heroImage?: string };

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
        <section className="bg-white py-16 sm:py-20 lg:py-[80px] xl:py-[120px]">
          <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="space-y-8">
              <p className="page-prose max-w-none text-black">
                AGC delivers training and capacity-building initiatives designed to equip leaders, practitioners,
                and emerging actors with the skills and knowledge required to navigate governance challenges. Our
                programmes combine theoretical grounding with practical application, offering participants
                opportunities to engage with real-world policy issues, develop leadership capabilities, and
                strengthen their contributions to governance processes.
              </p>

              <ol className="space-y-6">
                <li className="page-card p-5"><h3 className="font-serif text-xl font-semibold text-black">1. Leadership and governance development</h3><p className="page-prose mt-2 text-black">We deliver training programmes designed to strengthen leadership capacity and deepen understanding of governance systems, public policy, and institutional processes. These programmes are tailored to both emerging and experienced leaders across sectors.</p></li>
                <li className="page-card p-5"><h3 className="font-serif text-xl font-semibold text-black">2. Policy and research skills training</h3><p className="page-prose mt-2 text-black">AGC equips participants with practical skills in policy analysis, research methodologies, and evidence-based decision-making. Our training emphasises applied learning, enabling participants to engage effectively with real-world governance challenges.</p></li>
                <li className="page-card p-5"><h3 className="font-serif text-xl font-semibold text-black">3. Workshops and executive short courses</h3><p className="page-prose mt-2 text-black">We organise targeted workshops and short courses focused on specific governance and policy issues. These sessions provide intensive learning opportunities for professionals, practitioners, and public sector actors seeking to deepen their expertise.</p></li>
                <li className="page-card p-5"><h3 className="font-serif text-xl font-semibold text-black">4. Mentorship and professional development</h3><p className="page-prose mt-2 text-black">Through structured mentorship and coaching programmes, we support the growth of young leaders and practitioners in governance and public policy. Participants benefit from guided learning, practical exposure, and opportunities to contribute to research and policy work.</p></li>
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
              <Button asChild href="/events" variant="primary" className="rounded-none">
                View Events
              </Button>
            </div>
          </div>
        </section>
      </HomeScrollReveal>
    </>
  );
}
