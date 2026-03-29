import Link from "next/link";
import { privacyPolicy } from "@/data/legal";
import { PageHero } from "@/components/PageHero";
import { cmsStaticOrEmpty, getMergedPageContent } from "@/lib/page-content";
import { getSiteSettings } from "@/lib/site-settings";

export const metadata = {
  title: "Privacy Policy",
  description: "How Africa Governance Centre collects, uses, and protects your information.",
};

export default async function PrivacyPolicyPage() {
  const [merged, siteSettings] = await Promise.all([
    getMergedPageContent<typeof privacyPolicy>("privacy-policy", cmsStaticOrEmpty(privacyPolicy)),
    getSiteSettings(),
  ]);
  const content = merged as unknown as typeof privacyPolicy;
  return (
    <>
      <PageHero
        variant="minimal"
        title={content.title}
        subtitle={`Last updated · ${content.lastUpdated}`}
        breadcrumbs={[
          { label: siteSettings.chrome.breadcrumbs.home, href: "/" },
          { label: siteSettings.chrome.breadcrumbs.privacyPolicy },
        ]}
      />

      <section className="page-section-paper border-t border-stone-200/80 py-14 sm:py-16 lg:py-20">
        <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">
          <p className="border-l-[3px] border-accent-600 py-2 pl-5 text-sm page-prose leading-relaxed">
            This policy describes how we handle personal data when you use our website, register for events, or contact
            us. For questions, use the details at the end of this page.
          </p>

          <div className="mt-14 space-y-12">
            {content.sections.map((section) => (
              <article key={section.title} className="page-card p-6 sm:p-8">
                <h2 className="page-heading text-xl text-stone-900 sm:text-2xl">{section.title}</h2>
                <p className="mt-4 page-prose text-[0.98rem]">{section.content}</p>
                {"subsections" in section &&
                  section.subsections?.map((sub) => (
                    <div key={sub.title} className="mt-8 border-t border-stone-200/80 pt-6">
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-accent-800">{sub.title}</h3>
                      <p className="mt-3 page-prose text-[0.95rem]">{sub.content}</p>
                      {sub.items && (
                        <ul className="mt-4 list-none space-y-2 border-l-2 border-stone-200 pl-4 text-[0.95rem] text-stone-600">
                          {sub.items.map((item) => (
                            <li key={item} className="relative before:absolute before:-left-3 before:top-2.5 before:h-1 before:w-1 before:rounded-full before:bg-accent-600">
                              {item}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                {"items" in section && section.items && (
                  <ul className="mt-4 list-none space-y-2 border-l-2 border-stone-200 pl-4 text-[0.95rem] text-stone-600">
                    {section.items.map((item) => (
                      <li key={item} className="relative before:absolute before:-left-3 before:top-2.5 before:h-1 before:w-1 before:rounded-full before:bg-accent-600">
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-stone-200/80 bg-accent-900 py-14 text-[#fffcf7] sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-accent-300">Privacy & data</p>
          <h2 className="page-heading mt-3 text-2xl text-[#fffcf7]">Contact us</h2>
          <p className="mt-4 text-sm leading-relaxed text-stone-200/95">
            Questions about this policy or our data practices:
          </p>
          <ul className="mt-6 space-y-2 text-sm text-stone-200/90">
            <li>
              <a
                href={`mailto:${siteSettings.email.info}`}
                className="font-medium underline decoration-accent-400/50 underline-offset-4 hover:decoration-accent-300"
              >
                {siteSettings.email.info}
              </a>
            </li>
            <li>{siteSettings.address}</li>
            <li>{siteSettings.phone}</li>
          </ul>
          <p className="mt-10 text-xs text-stone-400">
            <Link href="/terms-of-service" className="text-accent-300/90 hover:text-accent-100">
              Terms of service
            </Link>
            {" · "}
            <Link href="/" className="text-accent-300/90 hover:text-accent-100">
              Home
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
