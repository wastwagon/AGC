import Image from "next/image";
import { aboutContent } from "@/data/content";
import { placeholderImages } from "@/data/images";
import { getTeam } from "@/lib/content";
import { getMergedPageContent } from "@/lib/page-content";
import { PageHero } from "@/components/PageHero";
import { TeamSectionTabs } from "@/components/TeamSectionTabs";
import { Button } from "@/components/Button";

export const metadata = {
  title: "About Us",
  description: "Learn about Africa Governance Centre - an independent think tank promoting governance excellence across Africa.",
};

export const revalidate = 60;

export default async function AboutPage() {
  const [cmsTeam, content] = await Promise.all([
    getTeam(),
    getMergedPageContent("about", aboutContent),
  ]);
  const teamForTabs = cmsTeam.map((m) => ({
    id: m.id,
    name: m.name,
    role: m.role,
    bio: m.bio,
    section: (m as { section?: string }).section || "advisory_board",
  }));

  return (
    <>
      <PageHero
        title={content.title}
        subtitle={content.hero.subtitle}
        image={placeholderImages.about}
        imageAlt="About Africa Governance Centre"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "About Us" }]}
      />

      <section className="page-section-paper border-b border-stone-200/80 py-16 sm:py-20 lg:py-24">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:gap-16 lg:px-8">
          <div className="lg:col-span-7">
            <p className="text-sm font-medium text-accent-800">Who we are</p>
            <h2 className="page-heading mt-2 text-2xl sm:text-3xl">{content.title}</h2>
            <p className="page-prose mt-6 border-l-4 border-accent-600 pl-6 text-lg text-stone-700">
              {content.intro}
            </p>
            <p className="page-prose mt-8">{content.description}</p>
            <p className="page-prose mt-6">{content.mission}</p>
          </div>
          <aside className="lg:col-span-5">
            <div className="sticky top-28 rounded-2xl border border-stone-200/80 bg-[#faf6ef] p-8">
              <p className="font-serif text-lg italic leading-snug text-stone-800">
                &ldquo;Governance is not abstract—it is the bridge between policy and the lives people actually
                lead.&rdquo;
              </p>
              <p className="mt-4 text-sm text-stone-500">How we frame our work with partners</p>
            </div>
          </aside>
        </div>
      </section>

      <section className="border-b border-stone-200/80 py-16 sm:py-20 lg:py-24 page-section-warm">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 lg:items-start">
            <div>
              <p className="text-sm font-medium text-accent-800">Strategic direction</p>
              <h2 className="page-heading mt-2 text-2xl sm:text-3xl">{content.strategicObjectives.title}</h2>
              <p className="page-prose mt-6">{content.strategicObjectives.content}</p>
              <p className="page-prose mt-6">{content.strategicObjectives.principles}</p>
              <p className="page-prose mt-6 text-stone-700">{content.strategicObjectives.agenda2063}</p>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-lg ring-1 ring-stone-200/60 lg:aspect-auto lg:min-h-[420px]">
              <Image
                src={placeholderImages.about}
                alt="Governance conference and summit"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="page-section-paper border-t border-stone-200/80 py-16 sm:py-20 lg:py-24">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <TeamSectionTabs cmsTeam={teamForTabs} />
          <div className="mt-14 flex justify-center">
            <Button asChild href="/get-involved" variant="primary" className="rounded-xl px-8">
              Get involved
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
