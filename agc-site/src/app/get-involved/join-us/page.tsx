import { getInvolvedContent } from "@/data/content";
import { placeholderImages } from "@/data/images";
import { PageHero } from "@/components/PageHero";
import { HomeScrollReveal } from "@/components/home/HomeScrollReveal";
import { Button } from "@/components/Button";
import { cmsStaticOrEmpty, getMergedPageContent } from "@/lib/page-content";
import { resolveImageUrl } from "@/lib/media";
import { getSiteSettings } from "@/lib/site-settings";
import { JoinUsInquiryForm } from "@/components/JoinUsInquiryForm";

export const metadata = {
  title: "Work with us",
  description: "Join the Africa Governance Centre team and advance governance excellence across Africa.",
};

export default async function JoinUsPage() {
  const [merged, siteSettings] = await Promise.all([
    getMergedPageContent<typeof getInvolvedContent>("get-involved", cmsStaticOrEmpty(getInvolvedContent)),
    getSiteSettings(),
  ]);
  const c = (merged as unknown as typeof getInvolvedContent).joinUs;
  const heroImage = (await resolveImageUrl((c as Record<string, unknown>).heroImage as string | undefined)) || placeholderImages.applications;
  return (
    <>
      <PageHero
        variant="immersive"
        title={c.title}
        subtitle={c.subtitle}
        image={heroImage}
        imageAlt="Work with us"
        breadcrumbs={[
          { label: siteSettings.chrome.breadcrumbs.home, href: "/" },
          { label: siteSettings.chrome.breadcrumbs.getInvolved, href: "/get-involved" },
          { label: siteSettings.chrome.breadcrumbs.joinUs },
        ]}
      />

      <HomeScrollReveal variant="fadeUp" start="top 88%" className="block w-full">
        <section className="w-full border-t border-border/80 bg-white py-8 sm:py-12 lg:py-14">
        <div className="mx-auto w-full max-w-none px-6 sm:px-8 lg:px-11 xl:px-16 2xl:px-24">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-black">Careers</p>
          <p className="mt-4 page-prose text-[1.08rem] leading-relaxed">{c.intro}</p>
          <p className="mt-6 page-prose">{c.description}</p>

          <div className="mt-14">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-accent-800">Opportunities</h2>
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

      <HomeScrollReveal variant="slideLeft" start="top 88%" className="block w-full">
        <section className="w-full border-t border-border/80 bg-white py-8 sm:py-12 lg:py-14">
        <div className="mx-auto w-full max-w-none px-6 sm:px-8 lg:px-11 xl:px-16 2xl:px-24">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-black">Enquiry</p>
          <h2 className="page-heading mt-3 text-2xl text-black">Tell us you&apos;re interested</h2>
          <p className="mt-2 text-black">
            Use the form for a structured inquiry — or use the buttons below to email or call.
          </p>
          <div className="mt-10">
            <JoinUsInquiryForm programsEmail={siteSettings.email.programs} />
          </div>
        </div>
      </section>

      <section className="w-full border-t border-border/80 bg-white py-8 sm:py-12 lg:py-14">
        <div className="mx-auto w-full max-w-none px-6 sm:px-8 lg:px-11 xl:px-16 2xl:px-24">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-black">Next step</p>
          <h2 className="page-heading mt-3 text-2xl text-black">Get in touch</h2>
          <p className="mt-4 max-w-none text-base leading-relaxed text-black">
            We&apos;re always interested in people passionate about governance, policy, and Africa&apos;s economic
            transformation.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button asChild href={c.contactHref} variant="primary" className="!rounded-none">
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
            <a
              href={`mailto:${siteSettings.email.programs}`}
              className="font-medium text-accent-800 underline decoration-accent-300/60 underline-offset-4 hover:text-accent-950"
            >
              {siteSettings.email.programs}
            </a>
            {" · "}
            <a
              href={`tel:${siteSettings.phone.replace(/\s/g, "")}`}
              className="font-medium text-accent-800 underline decoration-accent-300/60 underline-offset-4 hover:text-accent-950"
            >
              {siteSettings.phone}
            </a>
          </p>
        </div>
      </section>
      </HomeScrollReveal>
    </>
  );
}
