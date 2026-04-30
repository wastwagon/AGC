import { getInvolvedContent } from "@/data/content";
import { placeholderImages } from "@/data/images";
import { PageHero } from "@/components/PageHero";
import { HomeScrollReveal } from "@/components/home/HomeScrollReveal";
import { Button } from "@/components/Button";
import { cmsStaticOrEmpty, getMergedPageContent } from "@/lib/page-content";
import { resolveImageUrl } from "@/lib/media";
import { getSiteSettings } from "@/lib/site-settings";

export const metadata = {
  title: "Volunteer",
  description:
    "Contribute your time and skills to support Africa Governance Centre's research and advocacy efforts.",
};

export default async function VolunteerPage() {
  const [merged, siteSettings] = await Promise.all([
    getMergedPageContent<typeof getInvolvedContent>("get-involved", cmsStaticOrEmpty(getInvolvedContent)),
    getSiteSettings(),
  ]);
  const c = (merged as unknown as typeof getInvolvedContent).volunteer;
  const heroImage = (await resolveImageUrl((c as Record<string, unknown>).heroImage as string | undefined)) || placeholderImages.getInvolved;
  return (
    <>
      <PageHero
        variant="immersive"
        title={c.title}
        subtitle={c.subtitle}
        image={heroImage}
        imageAlt="Volunteer"
        breadcrumbs={[
          { label: siteSettings.chrome.breadcrumbs.home, href: "/" },
          { label: siteSettings.chrome.breadcrumbs.getInvolved, href: "/get-involved" },
          { label: siteSettings.chrome.breadcrumbs.volunteer },
        ]}
      />

      <HomeScrollReveal variant="fadeUp" start="top 88%" className="block w-full">
        <section className="w-full border-t border-border/80 bg-white py-8 sm:py-12 lg:py-14">
          <div className="mx-auto w-full max-w-none px-6 sm:px-8 lg:px-11 xl:px-16 2xl:px-24">
            <div className="grid gap-10 lg:grid-cols-3 lg:gap-12">
              <div className="lg:col-span-2">
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-black">Volunteering</p>
                <h2 className="mt-3 font-serif text-[1.85rem] font-semibold tracking-tight text-black sm:text-[2.2rem] lg:text-[2.55rem] lg:leading-tight">
                  Volunteer with us
                </h2>
                <p className="mt-4 page-prose text-[1.08rem] leading-relaxed">{c.intro}</p>
                <p className="mt-6 page-prose">{c.description}</p>
              </div>
              <div className="self-start">
                <div
                  className="relative min-h-[340px] overflow-hidden border border-border/80 bg-black"
                  style={{
                    backgroundImage: `linear-gradient(to bottom, rgba(15,23,42,0.25), rgba(15,23,42,0.62)), url('${heroImage}')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className="absolute inset-0 flex items-end p-6">
                    <div className="bg-white/90 p-4 backdrop-blur-sm">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-800">Impact roles</p>
                      <p className="mt-2 text-sm text-black">Research, events, communications, and administration support.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-accent-800">Ways to contribute</h2>
              <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                {c.items.map((item, i) => (
                  <li key={item} className="flex gap-4 border border-border/70 bg-white p-4">
                    <span className="font-sans text-2xl font-semibold tabular-nums text-accent-800">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="page-prose flex-1 pt-1">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </HomeScrollReveal>

      <HomeScrollReveal variant="slideRight" start="top 88%" className="block w-full">
        <section className="w-full border-y border-border/80 bg-white py-8 sm:py-12 lg:py-14">
        <div className="mx-auto w-full max-w-none px-6 sm:px-8 lg:px-11 xl:px-16 2xl:px-24">
          <div className="page-card border-l-[4px] border-l-accent-600 p-8 sm:p-10">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-black">Ready?</p>
            <h2 className="page-heading mt-2 text-xl text-black">Apply</h2>
            <p className="mt-3 page-prose">
              Complete the volunteer application — we welcome people who want to strengthen governance dialogue and
              research.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button asChild href={c.applicationHref} variant="primary" className="!rounded-none">
                {c.cta}
              </Button>
              <Button asChild href="/get-involved" variant="outline" className="!rounded-none">
                Back to Get Involved
              </Button>
            </div>
            <p className="mt-8 text-sm text-black">
              Questions?{" "}
              <a href={`mailto:${siteSettings.email.programs}`} className="font-medium text-accent-800 hover:underline">
                {siteSettings.email.programs}
              </a>
            </p>
          </div>
        </div>
      </section>
      </HomeScrollReveal>
    </>
  );
}
