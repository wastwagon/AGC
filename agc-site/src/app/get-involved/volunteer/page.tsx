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
        <div className="mx-auto w-full max-w-none px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-black">Volunteering</p>
          <p className="mt-4 page-prose text-[1.08rem] leading-relaxed">{c.intro}</p>
          <p className="mt-6 page-prose">{c.description}</p>

          <div className="mt-14">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-accent-800">Ways to contribute</h2>
            <ul className="mt-6 space-y-4">
              {c.items.map((item, i) => (
                <li key={item} className="flex gap-4 border-b border-border/60 pb-4 last:border-0">
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
        <div className="mx-auto w-full max-w-none px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
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
