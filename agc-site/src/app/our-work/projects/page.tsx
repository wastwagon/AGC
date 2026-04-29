import { workContent } from "@/data/content";
import { PageHero } from "@/components/PageHero";
import { HomeScrollReveal } from "@/components/home/HomeScrollReveal";
import { cmsStaticOrEmpty, getMergedPageContent } from "@/lib/page-content";
import { cardImageUrlOrNull } from "@/lib/image-delivery";
import { resolveImageUrl } from "@/lib/media";
import { Button } from "@/components/Button";
import { getBreadcrumbLabels } from "@/lib/breadcrumbs";

export const metadata = {
  title: "Projects",
  description: "Our targeted interventions - strengthening governance frameworks across African countries.",
};

type ProjectsWorkMerged = typeof workContent.projects & { heroImage?: string };

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

      <HomeScrollReveal variant="slideLeft" start="top 88%" className="block w-full">
        <section className="bg-white py-16 sm:py-20 lg:py-[80px] xl:py-[120px]">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="space-y-8">
            <p className="page-prose max-w-none text-black">
              Our projects are targeted initiatives developed in response to specific governance needs and
              opportunities. Each project is designed with clear objectives, defined outputs, and measurable
              outcomes, allowing for focused delivery within particular contexts. These interventions often
              contribute to broader programme goals while generating practical insights that inform future policy
              and institutional development.
            </p>

            <ol className="space-y-6">
              <li className="page-card p-5"><h3 className="font-serif text-xl font-semibold text-black">1. African Political Parties Summit</h3><p className="page-prose mt-2 text-black">The African Political Parties Summit convenes political parties, policymakers, civil society, development partners, and key stakeholders from across the continent to engage on issues of governance, democracy, and political reform. The Summit provides a neutral platform for dialogue, knowledge exchange, and collaboration, with a focus on strengthening political institutions and promoting accountable, inclusive governance systems.</p></li>
              <li className="page-card p-5"><h3 className="font-serif text-xl font-semibold text-black">2. Africa Women Political Leadership Summit</h3><p className="page-prose mt-2 text-black">The Africa Women Political Leadership Summit advances the role of women in governance by providing a platform for engagement, capacity building, and leadership development. The Summit brings together women leaders, policymakers, and stakeholders to address barriers to participation, share experiences, and promote inclusive leadership across political and public institutions.</p></li>
              <li className="page-card p-5"><h3 className="font-serif text-xl font-semibold text-black">3. African Youth in Politics Forum</h3><p className="page-prose mt-2 text-black">The African Youth in Politics Forum is a continental platform that equips young people with the knowledge, skills, and networks required to engage meaningfully in political and governance processes. Through dialogue, training, and mentorship, the Forum creates space for emerging leaders to contribute to policy conversations and strengthens youth participation in shaping Africa’s democratic future in line with the African Union Agenda 2026.</p></li>
              <li className="page-card p-5"><h3 className="font-serif text-xl font-semibold text-black">4. Public-Private Dialogues</h3><p className="page-prose mt-2 text-black">AGC organizes public-private dialogues to promote collaboration between government entities and the private sector.</p></li>
              <li className="page-card p-5"><h3 className="font-serif text-xl font-semibold text-black">5. Regional Governance Conferences</h3><p className="page-prose mt-2 text-black">AGC collaborates with regional organizations such as the African Union, ECOWAS, and SADC to convene governance conferences.</p></li>
              <li className="page-card p-5"><h3 className="font-serif text-xl font-semibold text-black">6. Sector-Specific Roundtables</h3><p className="page-prose mt-2 text-black">AGC organizes expert roundtables focused on sector-specific governance challenges, involving key stakeholders from sectors such as health, education, infrastructure, agriculture, and energy.</p></li>
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
            <Button asChild href="/get-involved/partnership" variant="primary">
              Partner With Us
            </Button>
          </div>
        </div>
      </section>
      </HomeScrollReveal>
    </>
  );
}
