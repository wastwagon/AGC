import { getInvolvedContent } from "@/data/content";
import { placeholderImages } from "@/data/images";
import { PageHero } from "@/components/PageHero";
import { Button } from "@/components/Button";
import { getMergedPageContent } from "@/lib/page-content";
import { resolveImageUrl } from "@/lib/media";
import { getSiteSettings } from "@/lib/site-settings";

export const metadata = {
  title: "Work with us",
  description: "Join the Africa Governance Centre team and advance governance excellence across Africa.",
};

export default async function JoinUsPage() {
  const [merged, siteSettings] = await Promise.all([
    getMergedPageContent("get-involved", getInvolvedContent as unknown as Record<string, unknown>),
    getSiteSettings(),
  ]);
  const c = (merged as unknown as typeof getInvolvedContent).joinUs;
  const heroImage = (await resolveImageUrl((c as Record<string, unknown>).heroImage as string | undefined)) || placeholderImages.applications;
  return (
    <>
      <PageHero
        variant="compact"
        title={c.title}
        subtitle={c.subtitle}
        image={heroImage}
        imageAlt="Work with us"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Get Involved", href: "/get-involved" },
          { label: "Work with us" },
        ]}
      />

      <section className="page-section-paper border-t border-stone-200/80 py-16 sm:py-20">
        <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-stone-500">Careers</p>
          <p className="mt-4 page-prose text-[1.08rem] leading-relaxed">{c.intro}</p>
          <p className="mt-6 page-prose">{c.description}</p>

          <div className="mt-14">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-accent-800">Opportunities</h2>
            <ul className="mt-6 space-y-4">
              {c.items.map((item, i) => (
                <li key={item} className="flex gap-4 border-b border-stone-200/60 pb-4 last:border-0">
                  <span className="font-serif text-2xl font-semibold tabular-nums text-accent-800">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="page-prose flex-1 pt-1">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="border-t border-stone-200/80 bg-accent-900 py-14 text-[#fffcf7] sm:py-20">
        <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-accent-300">Next step</p>
          <h2 className="page-heading mt-3 text-2xl text-[#fffcf7]">Get in touch</h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-stone-200/95">
            We&apos;re always interested in people passionate about governance, policy, and Africa&apos;s economic
            transformation.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button asChild href={c.contactHref} variant="primary">
              {c.cta}
            </Button>
            <Button asChild href="/get-involved" variant="outline" className="border-stone-400 text-[#fffcf7] hover:bg-white/10">
              Back to Get Involved
            </Button>
          </div>
          <p className="mt-10 text-sm text-stone-300/90">
            <a href={`mailto:${siteSettings.email.programs}`} className="underline decoration-accent-400/50 underline-offset-4 hover:decoration-accent-300">
              {siteSettings.email.programs}
            </a>
            {" · "}
            <a href={`tel:${siteSettings.phone.replace(/\s/g, "")}`} className="underline decoration-accent-400/50 underline-offset-4 hover:decoration-accent-300">
              {siteSettings.phone}
            </a>
          </p>
        </div>
      </section>
    </>
  );
}
