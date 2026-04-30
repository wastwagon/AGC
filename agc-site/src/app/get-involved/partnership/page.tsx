import { getInvolvedContent } from "@/data/content";
import { placeholderImages } from "@/data/images";
import { PageHero } from "@/components/PageHero";
import { HomeScrollReveal } from "@/components/home/HomeScrollReveal";
import { Button } from "@/components/Button";
import { cmsStaticOrEmpty, getMergedPageContent } from "@/lib/page-content";
import { resolveImageUrl } from "@/lib/media";
import { getSiteSettings } from "@/lib/site-settings";
import { PartnershipInquiryForm } from "@/components/PartnershipInquiryForm";
import { ProgramsCarousel } from "@/components/ProgramsCarousel";
import { Section } from "@/components/Section";

export const metadata = {
  title: "Partnership",
  description: "Collaborate with Africa Governance Centre on research, events, and policy initiatives.",
};

export default async function PartnershipPage() {
  const partnershipFallback = {
    ...getInvolvedContent.partnership,
    cards:
      getInvolvedContent.opportunities.find((opp) => opp.id === "partnership")?.cards ?? [],
    sectionEyebrow: "Collaboration",
    sectionHeading: "Partnership",
    areasHeading: "Partnership areas",
    footerEyebrow: "Partners",
    footerHeading: "Start a conversation",
    footerBody:
      "Governments, institutions, civil society, and funders committed to good governance — we'd like to hear from you.",
    backLabel: "Back to Get Involved",
    programsLabel: "Programs:",
  };
  const [merged, siteSettings] = await Promise.all([
    getMergedPageContent<typeof partnershipFallback>("get-involved-partnership", cmsStaticOrEmpty(partnershipFallback)),
    getSiteSettings(),
  ]);
  const c = merged;
  const cMap = c as unknown as Record<string, unknown>;
  const getString = (key: string, fallback: string) =>
    typeof cMap[key] === "string" && String(cMap[key]).trim().length > 0 ? String(cMap[key]) : fallback;
  const heroImage = (await resolveImageUrl((c as Record<string, unknown>).heroImage as string | undefined)) || placeholderImages.getInvolved;
  
  type PartnershipCard = { id: number; title: string; description: string; backgroundImage?: string };
  const rawCards =
    Array.isArray((c as Record<string, unknown>).cards) && ((c as Record<string, unknown>).cards as PartnershipCard[]).length > 0
      ? ((c as Record<string, unknown>).cards as PartnershipCard[])
      : (partnershipFallback.cards as
          | Array<{ title: string; description: string; backgroundImage?: string }>
          | undefined) ?? [];
  const partnershipCards: PartnershipCard[] = rawCards.map((card, index) => ({
    id: typeof (card as { id?: unknown }).id === "number" ? Number((card as { id?: unknown }).id) : index + 1,
    title: card.title,
    description: card.description,
    backgroundImage: card.backgroundImage,
  }));
  
  return (
    <>
      <PageHero
        variant="immersive"
        title={c.title}
        subtitle={c.subtitle}
        image={heroImage}
        imageAlt="Partnership"
        breadcrumbs={[
          { label: siteSettings.chrome.breadcrumbs.home, href: "/" },
          { label: siteSettings.chrome.breadcrumbs.getInvolved, href: "/get-involved" },
          { label: siteSettings.chrome.breadcrumbs.partnership },
        ]}
      />

      <HomeScrollReveal variant="fadeUp" start="top 88%" className="block w-full">
        <Section className="w-full border-t border-border/80 bg-white py-8 sm:py-12 lg:py-14">
          <div className="mx-auto w-full max-w-none px-6 sm:px-8 lg:px-11 xl:px-16 2xl:px-24">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-black">
              {getString("sectionEyebrow", "Collaboration")}
            </p>
            <h2 className="mt-3 font-serif text-[1.85rem] font-semibold tracking-tight text-black sm:text-[2.2rem] lg:text-[2.55rem] lg:leading-tight">
              {getString("sectionHeading", "Partnership")}
            </h2>
            <p className="mt-4 page-prose text-[1.08rem] leading-relaxed">{c.intro}</p>
            <p className="mt-6 page-prose">{c.description}</p>

            <div className="mt-14">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-accent-800">
                {getString("areasHeading", "Partnership areas")}
              </h2>
              <div className="mt-6">
                <ProgramsCarousel programs={partnershipCards} />
              </div>
            </div>
          </div>
        </Section>
      </HomeScrollReveal>

      <section
        id="partnership-inquiry"
        className="w-full border-y border-border/80 bg-white py-10 sm:py-14 lg:py-16"
      >
        <div className="mx-auto w-full max-w-none px-6 sm:px-8 lg:px-11 xl:px-16 2xl:px-24">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
            <div>
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-accent-800">
                {getString("footerEyebrow", "Partners")}
              </p>
              <h2 className="page-heading mt-3 text-2xl text-black">
                {getString("footerHeading", "Start a conversation")}
              </h2>
              <p className="mt-4 max-w-none text-base leading-relaxed text-black">
                {getString(
                  "footerBody",
                  "Governments, institutions, civil society, and funders committed to good governance — we'd like to hear from you."
                )}
              </p>
              <div className="mt-6">
                <PartnershipInquiryForm programsEmail={siteSettings.email.programs} />
              </div>
            </div>
            <aside className="border border-border/80 bg-stone-50 p-5 lg:sticky lg:top-24">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-800">
                {getString("programsLabel", "Programs:")}
              </p>
              <a
                href={`mailto:${siteSettings.email.programs}`}
                className="mt-3 block font-medium text-accent-800 underline decoration-accent-300/60 underline-offset-4 hover:text-accent-950"
              >
                {siteSettings.email.programs}
              </a>
              <div className="mt-6 flex flex-col gap-3">
                <Button asChild href="#partnership-inquiry" variant="primary" className="!rounded-none justify-center">
                  {c.cta}
                </Button>
                <Button
                  asChild
                  href="/get-involved"
                  variant="outline"
                  className="!rounded-none border-border text-black hover:bg-white"
                >
                  {getString("backLabel", "Back to Get Involved")}
                </Button>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
