"use client";

import { useState, type ReactNode } from "react";
import { Calendar, Handshake, Lightbulb, MapPin, Scale, Users } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Button } from "@/components/Button";
import { HomeScrollReveal } from "@/components/home/HomeScrollReveal";
import type { AppSummitCmsContent } from "@/data/app-summit";
import type { SiteSettings } from "@/lib/site-settings";

/** Avoids the year (e.g. 2026) wrapping alone on its own line in the registration card */
function RegistrationCardSubtitle({ text }: { text: string }): ReactNode {
  const normalized = text
    .replace(/\b2025\b/g, "2026")
    .replace(/(Summit)\s+(20\d{2})/gi, "Summit\u00a0$2");
  const re = /(APP\s+Summit\s+20\d{2})/i;
  const match = normalized.match(re);
  if (!match || match.index === undefined) {
    return normalized;
  }
  const before = normalized.slice(0, match.index);
  const mid = match[0];
  const after = normalized.slice(match.index + mid.length);
  return (
    <>
      {before}
      <span className="whitespace-nowrap">{mid}</span>
      {after}
    </>
  );
}

export function AppSummitClient({
  content,
  heroImage,
  siteSettings,
}: {
  content: AppSummitCmsContent;
  /** Omit for gradient-only hero when no CMS image is set */
  heroImage?: string;
  siteSettings: SiteSettings;
}) {
  const [activeDay, setActiveDay] = useState(0);
  const { details, registration, agenda } = content;
  const activeAgenda = agenda.days[activeDay];
  const registrationSubtitle = registration.subtitle ?? "";
  const d = details ?? { date: "", location: "", participants: "" };
  const showDate = Boolean(d.date?.trim());
  const showLocation = Boolean(d.location?.trim());
  const showParticipants = Boolean(d.participants?.trim());
  const hasDetailRows = showDate || showLocation || showParticipants;
  const hasAboutHeader =
    Boolean(content.aboutSectionEyebrow?.trim()) || Boolean(content.aboutSectionHeading?.trim());
  const pi = content.purposeImpact;
  const pillarIcons = [Scale, Lightbulb, Handshake] as const;
  const showPurposeImpact =
    Boolean(pi) &&
    (Boolean(pi?.heading?.trim()) ||
      Boolean(pi?.intro?.trim()) ||
      Boolean(pi?.pillars?.some((p) => p.title?.trim() || p.description?.trim())));
  const showProgrammeAgenda = content.programmeAgendaVisible !== false;

  return (
    <>
      <PageHero
        breadcrumbs={[
          { label: siteSettings.chrome.breadcrumbs.home, href: "/" },
          { label: siteSettings.chrome.breadcrumbs.appSummit },
        ]}
        title={content.title}
        subtitle={content.subtitle}
        image={heroImage}
        imageAlt={content.heroImageAlt || "APP Summit"}
      />

      <section className="w-full border-b border-border/80 bg-white py-8 sm:py-12 lg:py-14">
        <div className="mx-auto w-full max-w-none px-6 sm:px-8 lg:px-11 xl:px-16 2xl:px-24">
          <div className="grid gap-12 lg:grid-cols-3 lg:gap-16">
            <HomeScrollReveal variant="slideLeft" start="top 87%" className="block w-full lg:col-span-2">
              <div>
                {content.aboutSectionEyebrow?.trim() ? (
                  <p className="text-sm font-medium text-black">{content.aboutSectionEyebrow}</p>
                ) : null}
                {content.aboutSectionHeading?.trim() ? (
                  <h2
                    className={`page-heading text-2xl sm:text-3xl ${content.aboutSectionEyebrow?.trim() ? "mt-2" : ""}`}
                  >
                    {content.aboutSectionHeading}
                  </h2>
                ) : null}
                <p className={`page-prose text-lg leading-relaxed ${hasAboutHeader ? "mt-4" : ""}`}>{content.intro}</p>
                {content.inauguralParagraph?.trim() ? (
                  <p className="page-prose mt-6 text-lg leading-relaxed">{content.inauguralParagraph}</p>
                ) : null}
                {hasDetailRows ? (
                  <HomeScrollReveal
                    variant="scaleUp"
                    staggerSelector="li"
                    stagger={0.1}
                    start="top 90%"
                    className="mt-10 block w-full"
                  >
                    <ul className="flex flex-wrap gap-6 sm:gap-10">
                      {showDate ? (
                        <li className="flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-100 text-accent-700">
                            <Calendar className="h-6 w-6" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-black">{content.detailLabelDate}</p>
                            <p className="font-semibold text-black">{d.date}</p>
                          </div>
                        </li>
                      ) : null}
                      {showLocation ? (
                        <li className="flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-100 text-accent-700">
                            <MapPin className="h-6 w-6" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-black">{content.detailLabelLocation}</p>
                            <p className="font-semibold text-black">{d.location}</p>
                          </div>
                        </li>
                      ) : null}
                      {showParticipants ? (
                        <li className="flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-100 text-accent-700">
                            <Users className="h-6 w-6" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-black">{content.detailLabelParticipants}</p>
                            <p className="font-semibold text-black">{d.participants}</p>
                          </div>
                        </li>
                      ) : null}
                    </ul>
                  </HomeScrollReveal>
                ) : null}
              </div>
            </HomeScrollReveal>
            <HomeScrollReveal variant="slideRight" start="top 86%" className="block w-full self-start">
              <div className="rounded-none border border-border/90 bg-white p-6 shadow-sm sm:p-8">
                <h3 className="page-heading text-xl">{registration.title}</h3>
                <p className="page-prose mt-2 text-sm text-black">
                  <RegistrationCardSubtitle text={registrationSubtitle} />
                </p>
                <Button asChild href={registration.href} variant="primary" className="mt-5 w-full rounded-none bg-accent-600 hover:bg-accent-700">
                  {registration.cta}
                </Button>
              </div>
            </HomeScrollReveal>
          </div>
        </div>
      </section>

      {showPurposeImpact && pi ? (
        <section className="w-full border-t border-border/80 bg-white py-8 sm:py-12 lg:py-14">
          <div className="mx-auto w-full max-w-none px-6 sm:px-8 lg:px-11 xl:px-16 2xl:px-24">
            <HomeScrollReveal variant="clipOpen" start="top 88%" className="block w-full">
              <div>
                {pi.eyebrow?.trim() ? (
                  <p className="text-sm font-medium text-accent-800">{pi.eyebrow}</p>
                ) : null}
                {pi.heading?.trim() ? (
                  <h2 className={`page-heading text-2xl sm:text-3xl ${pi.eyebrow?.trim() ? "mt-2" : ""}`}>
                    {pi.heading}
                  </h2>
                ) : null}
                {pi.intro?.trim() ? (
                  <p
                    className={`page-prose max-w-none text-lg leading-relaxed ${pi.heading?.trim() || pi.eyebrow?.trim() ? "mt-4" : ""}`}
                  >
                    {pi.intro}
                  </p>
                ) : null}
              </div>
            </HomeScrollReveal>
            {pi.pillars && pi.pillars.length > 0 ? (
              <HomeScrollReveal
                variant="fadeUp"
                staggerSelector="li"
                stagger={0.14}
                start="top 86%"
                className="mt-12 block w-full"
              >
                <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
                  {pi.pillars.map((pillar, idx) => {
                    const Icon = pillarIcons[idx] ?? Scale;
                    const hasText = pillar.title?.trim() || pillar.description?.trim();
                    if (!hasText) return null;
                    return (
                      <li
                        key={`${pillar.title}-${idx}`}
                        className="rounded-none border border-border/80 bg-white p-7 shadow-sm transition-all hover:border-accent-200/50 hover:shadow-md sm:p-8"
                      >
                        <div className="flex h-12 w-12 items-center justify-center rounded-none bg-accent-100 text-accent-700">
                          <Icon className="h-6 w-6" strokeWidth={1.75} aria-hidden />
                        </div>
                        {pillar.title?.trim() ? (
                          <h3 className="mt-5 font-sans text-lg font-semibold text-black">{pillar.title}</h3>
                        ) : null}
                        {pillar.description?.trim() ? (
                          <p className="page-prose-tight mt-2 text-sm leading-relaxed">{pillar.description}</p>
                        ) : null}
                      </li>
                    );
                  })}
                </ul>
              </HomeScrollReveal>
            ) : null}
          </div>
        </section>
      ) : null}

      {showProgrammeAgenda && agenda?.days?.length ? (
        <section className="border-t border-border/80 bg-white py-16 sm:py-20 lg:py-24">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <HomeScrollReveal variant="fadeUp" start="top 88%" className="block w-full">
              <div className="max-w-2xl">
                {content.programmeEyebrow?.trim() ? (
                  <p className="text-sm font-medium text-accent-800">{content.programmeEyebrow}</p>
                ) : null}
                <h2 className="page-heading mt-1 text-2xl sm:text-3xl">{agenda.title}</h2>
                <p className="page-prose mt-2">{agenda.subtitle}</p>
              </div>
            </HomeScrollReveal>

            <HomeScrollReveal variant="slideRight" start="top 90%" className="mt-10 block w-full">
              <div className="flex flex-wrap gap-0 border-b border-border/80">
                {agenda.days.map((d, i) => (
                  <button
                    key={d.day}
                    type="button"
                    onClick={() => setActiveDay(i)}
                    className={`relative px-5 py-3 text-sm font-medium transition-colors ${
                      activeDay === i
                        ? "text-accent-900 after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:rounded-full after:bg-accent-600"
                        : "text-black hover:text-black"
                    }`}
                  >
                    {[content.dayTabPrefix?.trim(), String(d.day)].filter(Boolean).join(" ") || String(d.day)}
                  </button>
                ))}
              </div>
            </HomeScrollReveal>

            <div className="mt-12">
              <HomeScrollReveal variant="fadeIn" start="top 92%" className="mb-8 block w-full">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-black">{activeAgenda.date}</h3>
              </HomeScrollReveal>
              <HomeScrollReveal
                key={activeDay}
                variant="tiltUp"
                staggerSelector="article"
                stagger={0.09}
                start="top 88%"
                className="space-y-4"
              >
                {activeAgenda.sessions.map((session, i) => (
                  <article
                    key={i}
                    className="flex gap-4 rounded-none border border-border/80 bg-white p-6 transition-all hover:border-accent-200/50 hover:shadow-sm sm:gap-6"
                  >
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 rounded-full bg-accent-600" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-accent-800">{session.time}</p>
                      <h4 className="mt-1 font-sans text-lg font-semibold text-black">{session.title}</h4>
                      {session.topic && (
                        <p className="page-prose-tight mt-2 text-sm">{session.topic}</p>
                      )}
                      {session.topics && (
                        <ul className="page-prose-tight mt-2 space-y-1 text-sm">
                          {session.topics.map((t, j) => (
                            <li key={j} className="flex gap-2">
                              <span className="text-accent-600">•</span>
                              {t}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </article>
                ))}
              </HomeScrollReveal>
            </div>
          </div>
        </section>
      ) : null}

      <section className="isolate w-full border-t border-border/80 bg-white py-16 sm:py-20">
        <div className="mx-auto w-full max-w-4xl bg-white px-4 sm:px-6 lg:px-8">
          <HomeScrollReveal variant="scaleUp" start="top 88%" className="block w-full bg-white">
            <div className="rounded-none border border-border/80 bg-white p-8 sm:p-10">
              <p className="page-prose text-black">{content.contactNote}</p>
              <div className="mt-6 flex flex-wrap gap-4">
                {content.contactSectionCtaLabel?.trim() ? (
                  <Button asChild href="/contact" variant="primary" className="rounded-none bg-accent-700 hover:bg-accent-800">
                    {content.contactSectionCtaLabel}
                  </Button>
                ) : null}
                <a
                  href={`mailto:${siteSettings.email.programs}`}
                  className="inline-flex items-center justify-center rounded-none border border-border/90 bg-white px-5 py-2.5 text-sm font-medium text-black transition-colors hover:border-accent-300"
                >
                  {siteSettings.email.programs}
                </a>
              </div>
            </div>
          </HomeScrollReveal>
        </div>
      </section>
    </>
  );
}
