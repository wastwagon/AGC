import { aboutContent } from "@/data/content";
import { placeholderImages } from "@/data/images";
import { getTeam } from "@/lib/content";
import { cmsStaticOrEmpty, getMergedPageContent } from "@/lib/page-content";
import { PageHero } from "@/components/PageHero";
import { HomeScrollReveal } from "@/components/home/HomeScrollReveal";
import { TeamSectionTabs } from "@/components/TeamSectionTabs";
import { Button } from "@/components/Button";
import { resolveImageUrl } from "@/lib/media";
import { getBreadcrumbLabels } from "@/lib/breadcrumbs";

export const metadata = {
  title: "About Us",
  description: "Learn about Africa Governance Centre - an independent think tank promoting governance excellence across Africa.",
};

export const revalidate = 60;

function resolveTeamTabs(content: typeof aboutContent & { teamTabsList?: { key: string; label: string }[] }) {
  const configured = Array.isArray(content.teamTabsList) ? content.teamTabsList : [];
  const cleaned = configured
    .map((x) => ({
      key: String(x?.key ?? "").trim().toLowerCase().replace(/\s+/g, "_"),
      label: String(x?.label ?? "").trim(),
    }))
    .filter((x) => x.key && x.label);
  if (cleaned.length > 0) return cleaned;
  return [
    { key: "advisory_board", label: aboutContent.teamTabs.advisoryBoard },
    { key: "management_team", label: aboutContent.teamTabs.managementTeam },
    { key: "fellows", label: aboutContent.teamTabs.fellows },
    { key: "associate_fellows", label: aboutContent.teamTabs.associateFellows },
  ];
}

export default async function AboutPage() {
  const [cmsTeam, content, bc] = await Promise.all([
    getTeam(),
    getMergedPageContent<typeof aboutContent>("about", cmsStaticOrEmpty(aboutContent)),
    getBreadcrumbLabels(),
  ]);
  const heroImage = (await resolveImageUrl((content as Record<string, unknown>).heroImage as string | undefined)) || placeholderImages.about;
  const teamForTabs = await Promise.all(
    cmsTeam.map(async (m) => ({
      id: m.id,
      name: m.name,
      role: m.role,
      bio: m.bio,
      imageUrl: await resolveImageUrl(m.image ?? undefined),
      section: (m as { section?: string }).section || "advisory_board",
    }))
  );
  const teamTabs = resolveTeamTabs(content as typeof aboutContent & { teamTabsList?: { key: string; label: string }[] });

  return (
    <>
      <PageHero
        title={content.title}
        subtitle={content.hero.subtitle}
        image={heroImage}
        imageAlt="About Africa Governance Centre"
        breadcrumbs={[{ label: bc.home, href: "/" }, { label: bc.about }]}
      />

      <HomeScrollReveal variant="fadeUp" start="top 88%" className="block w-full bg-[#ffffff]">
        <section className="w-full border-b border-border/80 bg-[#ffffff] py-8 sm:py-12 lg:py-14">
          {/* Match home “Scope of Our Work”: full-width shell, header-aligned gutters */}
          <div className="mx-auto w-full max-w-none px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
            <header>
              <p className="text-sm font-medium text-black">Who we are</p>
              <h2 className="page-heading mt-2 text-2xl text-black sm:text-3xl">{content.title}</h2>
            </header>
            <p className="page-prose mt-8 max-w-none border-l-4 border-accent-600 pl-6 text-lg leading-relaxed text-black">
              {content.intro}
            </p>
            <p className="page-prose mt-8 max-w-none leading-relaxed text-black">{content.description}</p>
            <p className="page-prose mt-8 max-w-none leading-relaxed text-black">{content.mission}</p>
          </div>
        </section>
      </HomeScrollReveal>

      <HomeScrollReveal variant="slideLeft" start="top 88%" className="block w-full bg-[#ffffff]">
        <section className="w-full border-b border-border/80 bg-[#ffffff] py-8 sm:py-12 lg:py-14">
        <div className="mx-auto w-full max-w-none px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <header>
            <p className="text-sm font-medium text-black">Strategic direction</p>
            <h2 className="page-heading mt-2 text-2xl text-black sm:text-3xl">{content.strategicObjectives.title}</h2>
          </header>
          <p className="page-prose mt-8 max-w-none leading-relaxed text-black">{content.strategicObjectives.content}</p>
          <p className="page-prose mt-8 max-w-none leading-relaxed text-black">{content.strategicObjectives.principles}</p>
          <p className="page-prose mt-8 max-w-none leading-relaxed text-black">{content.strategicObjectives.agenda2063}</p>
        </div>
      </section>
      </HomeScrollReveal>

      <HomeScrollReveal variant="scaleUp" start="top 88%" className="block w-full bg-[#ffffff]">
        <section id="team" className="w-full border-t border-border/80 bg-[#ffffff] py-16 sm:py-20 lg:py-24">
        <div className="mx-auto w-full max-w-none px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <TeamSectionTabs cmsTeam={teamForTabs} tabs={teamTabs} />
          <div className="mt-14 flex justify-center">
            <Button asChild href="/get-involved" variant="primary" className="rounded-none px-8">
              Get involved
            </Button>
          </div>
        </div>
      </section>
      </HomeScrollReveal>
    </>
  );
}
