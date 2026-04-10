"use client";

import { PageHero } from "@/components/PageHero";
import { Button } from "@/components/Button";
import type { AypfCmsContent } from "@/data/aypf";
import type { SiteSettings } from "@/lib/site-settings";

export function AypfClient({
  content,
  heroImage,
  siteSettings,
}: {
  content: AypfCmsContent;
  heroImage?: string;
  siteSettings: SiteSettings;
}) {
  const bc = content.breadcrumbLabel?.trim() || content.title;
  const regHref = content.registerSection.registrationHref?.trim() ?? "";

  return (
    <>
      <PageHero
        breadcrumbs={[
          { label: siteSettings.chrome.breadcrumbs.home, href: "/" },
          { label: bc },
        ]}
        title={content.title}
        subtitle={content.subtitle}
        image={heroImage}
        imageAlt={content.heroImageAlt || "African Youth in Politics Forum"}
      />

      <section className="page-section-paper border-b border-stone-200/80 py-16 sm:py-20 lg:py-24">
        <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">
          <p className="page-prose text-lg leading-relaxed">{content.leadParagraph}</p>
          <p className="page-prose mt-6 text-lg leading-relaxed">{content.launchParagraph}</p>
          {content.themeQuote?.trim() ? (
            <blockquote className="mt-10 border-l-4 border-accent-600 pl-6">
              <p className="text-lg font-medium italic text-stone-800">&ldquo;{content.themeQuote}&rdquo;</p>
            </blockquote>
          ) : null}
          <p className="page-prose mt-8 text-lg leading-relaxed">{content.inauguralParagraph}</p>
        </div>
      </section>

      <section className="page-section-warm border-t border-stone-200/60 py-16 sm:py-20 lg:py-24">
        <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">
          {content.purposeSection.eyebrow?.trim() ? (
            <p className="text-sm font-medium text-accent-800">{content.purposeSection.eyebrow}</p>
          ) : null}
          <h2 className="page-heading mt-2 text-2xl sm:text-3xl">{content.purposeSection.heading}</h2>
          <p className="page-prose mt-4 text-lg">{content.purposeSection.intro}</p>
          <ul className="mt-8 list-disc space-y-3 pl-6 text-stone-800 marker:text-accent-700">
            {content.purposeSection.focusAreas.map((item) => (
              <li key={item} className="leading-relaxed">
                {item}
              </li>
            ))}
          </ul>
          <p className="page-prose mt-10 text-lg leading-relaxed">{content.legitimacyParagraph}</p>
        </div>
      </section>

      <section className="page-section-paper border-t border-stone-200/80 py-16 sm:py-20 lg:py-24">
        <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">
          {content.actionSection.eyebrow?.trim() ? (
            <p className="text-sm font-medium text-accent-800">{content.actionSection.eyebrow}</p>
          ) : null}
          <h2 className="page-heading mt-2 text-2xl sm:text-3xl">{content.actionSection.heading}</h2>
          <p className="page-prose mt-4 text-lg">{content.actionSection.intro}</p>
          <ul className="mt-8 list-disc space-y-3 pl-6 text-stone-800 marker:text-accent-700">
            {content.actionSection.discussionPoints.map((item) => (
              <li key={item} className="leading-relaxed">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="page-section-warm border-t border-stone-200/60 py-16 sm:py-20 lg:py-24">
        <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">
          {content.lookingAheadSection.eyebrow?.trim() ? (
            <p className="text-sm font-medium text-accent-800">{content.lookingAheadSection.eyebrow}</p>
          ) : null}
          <h2 className="page-heading mt-2 text-2xl sm:text-3xl">{content.lookingAheadSection.heading}</h2>
          <p className="page-prose mt-4 text-lg">{content.lookingAheadSection.intro}</p>
          <ul className="mt-8 list-disc space-y-3 pl-6 text-stone-800 marker:text-accent-700">
            {content.lookingAheadSection.topics.map((item) => (
              <li key={item} className="leading-relaxed">
                {item}
              </li>
            ))}
          </ul>
          {content.lookingAheadSection.invitationNote?.trim() ? (
            <p className="page-prose mt-10 text-lg leading-relaxed">{content.lookingAheadSection.invitationNote}</p>
          ) : null}
        </div>
      </section>

      <section className="page-section-paper border-t border-stone-200/80 py-16 sm:py-20 lg:py-24">
        <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-stone-200/90 bg-[#faf6ef] p-10 shadow-sm sm:p-12">
            <h2 className="page-heading text-2xl">{content.registerSection.heading}</h2>
            <p className="page-prose mt-2 text-lg">{content.registerSection.intro}</p>
            <p className="mt-6 text-sm font-medium text-stone-600">
              Interested applicants are encouraged to register their interest to:
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-6 text-stone-800 marker:text-accent-700">
              {content.registerSection.benefits.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            {regHref ? (
              <Button
                asChild
                href={regHref}
                variant="primary"
                className="mt-8 rounded-xl bg-accent-700 hover:bg-accent-800"
              >
                {content.registerSection.ctaLabel}
              </Button>
            ) : (
              <p className="mt-8 text-sm text-stone-500">
                Add the registration link in Admin → Page Content → aypf (registration URL field) when it is available.
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
