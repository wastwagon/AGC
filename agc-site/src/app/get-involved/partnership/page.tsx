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
  const [merged, siteSettings] = await Promise.all([
    getMergedPageContent<typeof getInvolvedContent>("get-involved", cmsStaticOrEmpty(getInvolvedContent)),
    getSiteSettings(),
  ]);
  const c = (merged as unknown as typeof getInvolvedContent).partnership;
  const heroImage = (await resolveImageUrl((c as Record<string, unknown>).heroImage as string | undefined)) || placeholderImages.getInvolved;
  
  type PartnershipCard = { title: string; description: string };
  const partnershipCards: PartnershipCard[] = Array.isArray((c as Record<string, unknown>).cards) && ((c as Record<string, unknown>).cards as PartnershipCard[]).length > 0
    ? ((c as Record<string, unknown>).cards as PartnershipCard[])
    : (getInvolvedContent.opportunities.find(opp => opp.id === "partnership")?.cards as PartnershipCard[] | undefined) ?? [];
  
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
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-black">Collaboration</p>
            <h2 className="mt-3 font-serif text-[1.85rem] font-semibold tracking-tight text-black sm:text-[2.2rem] lg:text-[2.55rem] lg:leading-tight">
              Partnership
            </h2>
            <p className="mt-4 page-prose text-[1.08rem] leading-relaxed">{c.intro}</p>
            <p className="mt-6 page-prose">{c.description}</p>

            <div className="mt-14">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-accent-800">Partnership areas</h2>
              <div className="mt-6">
                <ProgramsCarousel programs={partnershipCards} />
              </div>
            </div>
          </div>
        </Section>
      </HomeScrollReveal>

      <section
        id="partnership-inquiry"
        className="w-full border-t border-border/80 bg-white py-8 sm:py-12 lg:py-14"
      >
        <div className="mx-auto w-full max-w-none px-6 sm:px-8 lg:px-11 xl:px-16 2xl:px-24">
          <PartnershipInquiryForm programsEmail={siteSettings.email.programs} />
        </div>
      </section>

      <section className="border-t border-border/80 bg-white py-14 sm:py-20">
        <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-accent-800">Partners</p>
          <h2 className="page-heading mt-3 text-2xl text-black">Start a conversation</h2>
          <p className="mt-4 max-w-none text-base leading-relaxed text-black">
            Governments, institutions, civil society, and funders committed to good governance — we&apos;d like to hear
            from you.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button asChild href="#partnership-inquiry" variant="primary" className="!rounded-none">
              {c.cta}
            </Button>
            <Button
              asChild
              href="/get-involved"
              variant="outline"
              className="!rounded-none border-border text-black hover:bg-stone-50"
            >
              Back to Get Involved
            </Button>
          </div>
          <p className="mt-10 text-sm text-black">
            Programs:{" "}
            <a
              href={`mailto:${siteSettings.email.programs}`}
              className="font-medium text-accent-800 underline decoration-accent-300/60 underline-offset-4 hover:text-accent-950"
            >
              {siteSettings.email.programs}
            </a>
          </p>
        </div>
      </section>
    </>
  );
}
