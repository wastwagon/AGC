"use client";

import { useState, type ReactNode } from "react";
import { Calendar, Handshake, Lightbulb, MapPin, Scale, Users } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Button } from "@/components/Button";
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

      <section className="page-section-paper border-b border-stone-200/80 py-16 sm:py-20 lg:py-24">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-3 lg:gap-16">
            <div className="lg:col-span-2">
              {content.aboutSectionEyebrow?.trim() ? (
                <p className="text-sm font-medium text-accent-800">{content.aboutSectionEyebrow}</p>
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
                <ul className="mt-10 flex flex-wrap gap-6 sm:gap-10">
                  {showDate ? (
                    <li className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-100 text-accent-700">
                        <Calendar className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-stone-500">{content.detailLabelDate}</p>
                        <p className="font-semibold text-stone-900">{d.date}</p>
                      </div>
                    </li>
                  ) : null}
                  {showLocation ? (
                    <li className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-100 text-accent-700">
                        <MapPin className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-stone-500">{content.detailLabelLocation}</p>
                        <p className="font-semibold text-stone-900">{d.location}</p>
                      </div>
                    </li>
                  ) : null}
                  {showParticipants ? (
                    <li className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-100 text-accent-700">
                        <Users className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-stone-500">{content.detailLabelParticipants}</p>
                        <p className="font-semibold text-stone-900">{d.participants}</p>
                      </div>
                    </li>
                  ) : null}
                </ul>
              ) : null}
            </div>
            <div className="self-start rounded-2xl border border-stone-200/90 bg-[#faf6ef] p-6 shadow-sm sm:p-8">
              <h3 className="page-heading text-xl">{registration.title}</h3>
              <p className="page-prose mt-2 text-sm text-balance">
                <RegistrationCardSubtitle text={registrationSubtitle} />
              </p>
              <Button asChild href={registration.href} variant="primary" className="mt-5 w-full rounded-xl bg-accent-700 hover:bg-accent-800">
                {registration.cta}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {showPurposeImpact && pi ? (
        <section className="page-section-paper border-t border-stone-200/80 py-16 sm:py-20 lg:py-24">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
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
                className={`page-prose max-w-3xl text-lg leading-relaxed ${pi.heading?.trim() || pi.eyebrow?.trim() ? "mt-4" : ""}`}
              >
                {pi.intro}
              </p>
            ) : null}
            {pi.pillars && pi.pillars.length > 0 ? (
              <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
                {pi.pillars.map((pillar, idx) => {
                  const Icon = pillarIcons[idx] ?? Scale;
                  const hasText = pillar.title?.trim() || pillar.description?.trim();
                  if (!hasText) return null;
                  return (
                    <li
                      key={`${pillar.title}-${idx}`}
                      className="rounded-2xl border border-stone-200/80 bg-[#fffcf7] p-7 shadow-sm transition-all hover:border-accent-200/50 hover:shadow-md sm:p-8"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-100 text-accent-700">
                        <Icon className="h-6 w-6" strokeWidth={1.75} aria-hidden />
                      </div>
                      {pillar.title?.trim() ? (
                        <h3 className="mt-5 font-sans text-lg font-semibold text-stone-900">{pillar.title}</h3>
                      ) : null}
                      {pillar.description?.trim() ? (
                        <p className="page-prose-tight mt-2 text-sm leading-relaxed">{pillar.description}</p>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </div>
        </section>
      ) : null}

      {showProgrammeAgenda && agenda?.days?.length ? (
        <section className="page-section-warm border-t border-stone-200/60 py-16 sm:py-20 lg:py-24">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              {content.programmeEyebrow?.trim() ? (
                <p className="text-sm font-medium text-accent-800">{content.programmeEyebrow}</p>
              ) : null}
              <h2 className="page-heading mt-1 text-2xl sm:text-3xl">{agenda.title}</h2>
              <p className="page-prose mt-2">{agenda.subtitle}</p>
            </div>

            <div className="mt-10 flex flex-wrap gap-0 border-b border-stone-300/80">
              {agenda.days.map((d, i) => (
                <button
                  key={d.day}
                  type="button"
                  onClick={() => setActiveDay(i)}
                  className={`relative px-5 py-3 text-sm font-medium transition-colors ${
                    activeDay === i
                      ? "text-accent-900 after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:rounded-full after:bg-accent-600"
                      : "text-stone-500 hover:text-stone-800"
                  }`}
                >
                  {[content.dayTabPrefix?.trim(), String(d.day)].filter(Boolean).join(" ") || String(d.day)}
                </button>
              ))}
            </div>

            <div className="mt-12">
              <h3 className="mb-8 text-sm font-semibold uppercase tracking-wide text-stone-500">{activeAgenda.date}</h3>
              <div className="space-y-4">
                {activeAgenda.sessions.map((session, i) => (
                  <article
                    key={i}
                    className="flex gap-4 rounded-2xl border border-stone-200/80 bg-[#fffcf7] p-6 transition-all hover:border-accent-200/50 hover:shadow-sm sm:gap-6"
                  >
                    <span className="mt-1.5 flex h-2 w-2 shrink-0 rounded-full bg-accent-600" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-accent-800">{session.time}</p>
                      <h4 className="mt-1 font-sans text-lg font-semibold text-stone-900">{session.title}</h4>
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
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section className="page-section-paper border-t border-stone-200/80 py-16 sm:py-20">
        <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-stone-200/80 bg-[#f2ebe3]/35 p-8 sm:p-10">
            <p className="page-prose">{content.contactNote}</p>
            <div className="mt-6 flex flex-wrap gap-4">
              {content.contactSectionCtaLabel?.trim() ? (
                <Button asChild href="/contact" variant="primary" className="rounded-xl bg-accent-700 hover:bg-accent-800">
                  {content.contactSectionCtaLabel}
                </Button>
              ) : null}
              <a
                href={`mailto:${siteSettings.email.programs}`}
                className="inline-flex items-center justify-center rounded-xl border border-stone-300/90 bg-[#fffcf7] px-5 py-2.5 text-sm font-medium text-stone-800 transition-colors hover:border-accent-300"
              >
                {siteSettings.email.programs}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
