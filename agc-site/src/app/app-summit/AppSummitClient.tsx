"use client";

import type { ReactNode } from "react";
import { CalendarDays, Handshake, MapPin, Users } from "lucide-react";
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
  const registration = content.registration;
  const detailDate = "August 10-12, 2025";
  const detailLocation = "Accra International Conference Centre, Ghana";
  const detailParticipants = "Over 700 participants and 50+ political parties";

  const keyFocusAreas = [
    "Political Cooperation and Party Dialogue",
    "Democratic Governance and Institutional Reform",
    "Political Party Financing and Campaign Transparency",
    "Youth and Women’s Political Leadership",
    "Conflict Prevention and Peacebuilding",
    "Digital Innovation and Political Communication",
    "Continental Integration and Development Planning",
  ];

  const expectedOutcomes = [
    "Adoption of a high-level declaration articulating shared continental principles on economic transformation and political responsibility.",
    "Establishment of a structured inter-party economic policy dialogue platform under the African Political Parties Initiative.",
    "Agreement on technical working groups focused on fiscal governance, youth employment, and industrial development.",
    "Strengthened partnerships between political actors and regional economic institutions.",
    "Enhanced continental visibility of political parties as constructive contributors to Africa’s development agenda.",
    "A dedicated set of recommendations from the Africa Women Political Leadership Summit and the Africa Youth in Politics Forum informing continental party reform agendas.",
  ];

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

      <section className="w-full border-b border-border/80 bg-white py-10 sm:py-14 lg:py-16">
        <div className="mx-auto w-full max-w-none px-6 sm:px-8 lg:px-11 xl:px-16 2xl:px-24">
          <div className="grid gap-12 lg:grid-cols-3 lg:gap-14">
            <HomeScrollReveal variant="slideLeft" start="top 87%" className="block w-full lg:col-span-2">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.08em] text-accent-800">APP Summit</p>
                <h2 className="mt-3 font-serif text-[2rem] font-semibold leading-tight text-black sm:text-[2.5rem]">
                  A continental platform for democratic resilience and political transformation
                </h2>
                <p className="page-prose mt-6 text-lg leading-relaxed">
                  The African Political Parties Summit (APPS) is a high-level continental platform that convenes
                  political leaders, governance institutions, and policy influencers from across Africa. The concept
                  for the Summit was inspired by growing concerns about the continent&apos;s changing governance
                  landscape.
                </p>
                <p className="page-prose mt-4 text-lg leading-relaxed">
                  Over the past decade, Africa has experienced a concerning decline in democratic development,
                  evidenced by political unrest, electoral irregularities, and increasing public skepticism toward
                  democratic institutions. Given that political parties serve as the primary vehicles for leadership
                  selection and policy formulation, strengthening these institutions is crucial for safeguarding
                  democracy and effectively addressing Africa&apos;s evolving political landscape.
                </p>
                <p className="page-prose mt-4 text-lg leading-relaxed">
                  APPS offers a neutral, inclusive, and policy-oriented platform to advance reforms aimed at restoring
                  public trust and strengthening democratic resilience. The inaugural edition, held in Accra from
                  August 10-12, 2025, brought together over 700 participants from more than 50 countries for strategic
                  dialogue and collaboration.
                </p>
                <ul className="mt-8 grid gap-4 sm:grid-cols-3">
                  <li className="rounded-none border border-border/80 bg-white p-4">
                    <CalendarDays className="h-5 w-5 text-accent-700" />
                    <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-black">Date</p>
                    <p className="mt-1 text-sm font-medium text-black">{detailDate}</p>
                  </li>
                  <li className="rounded-none border border-border/80 bg-white p-4">
                    <MapPin className="h-5 w-5 text-accent-700" />
                    <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-black">Location</p>
                    <p className="mt-1 text-sm font-medium text-black">{detailLocation}</p>
                  </li>
                  <li className="rounded-none border border-border/80 bg-white p-4">
                    <Users className="h-5 w-5 text-accent-700" />
                    <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-black">Participants</p>
                    <p className="mt-1 text-sm font-medium text-black">{detailParticipants}</p>
                  </li>
                </ul>
              </div>
            </HomeScrollReveal>
            <HomeScrollReveal variant="slideRight" start="top 86%" className="block w-full self-start">
              <div className="rounded-none border border-border/90 bg-white p-6 shadow-sm sm:p-8">
                <h3 className="page-heading text-xl">Secure your spot</h3>
                <p className="page-prose mt-2 text-sm text-black">
                  <RegistrationCardSubtitle text={registration.subtitle ?? "Secure your spot at APP Summit 2026"} />
                </p>
                <Button asChild href={registration.href} variant="primary" className="mt-5 w-full rounded-none bg-accent-600 hover:bg-accent-700">
                  {registration.cta || "Register Now"}
                </Button>
                <p className="mt-5 text-xs leading-relaxed text-black">
                  Sponsorship prospectus available. To partner with APPS 2026, contact the Secretariat via{" "}
                  <a href={`mailto:${siteSettings.email.programs}`} className="font-medium underline">
                    {siteSettings.email.programs}
                  </a>
                  .
                </p>
              </div>
            </HomeScrollReveal>
          </div>
        </div>
      </section>

      <section className="w-full border-t border-border/80 bg-white py-10 sm:py-14 lg:py-16">
        <div className="mx-auto w-full max-w-none px-6 sm:px-8 lg:px-11 xl:px-16 2xl:px-24">
          <HomeScrollReveal variant="fadeUp" start="top 88%" className="block w-full">
            <div className="mb-6 flex items-end justify-between gap-4">
              <h2 className="font-serif text-[1.9rem] font-semibold text-black sm:text-[2.3rem]">
                APPS 2025 Highlights
              </h2>
              <p className="text-xs uppercase tracking-[0.08em] text-black">Image placeholders</p>
            </div>
          </HomeScrollReveal>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="relative aspect-[4/3] overflow-hidden rounded-none border border-border/80 bg-stone-100">
                <img src="/uploads/placeholder.svg" alt={`APPS 2025 placeholder ${i + 1}`} className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full border-t border-border/80 bg-white py-10 sm:py-14 lg:py-16">
        <div className="mx-auto w-full max-w-none px-6 sm:px-8 lg:px-11 xl:px-16 2xl:px-24">
          <div className="relative overflow-hidden rounded-none border border-border/80 bg-accent-900 px-6 py-10 text-white sm:px-10">
            <div className="pointer-events-none absolute inset-0 opacity-20">
              <img src="/uploads/placeholder.svg" alt="" className="h-full w-full object-cover" />
            </div>
            <div className="relative">
              <p className="text-sm font-semibold uppercase tracking-[0.08em] text-white/90">Key Focus Areas</p>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {keyFocusAreas.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm sm:text-base">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-white" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full border-t border-border/80 bg-white py-10 sm:py-14 lg:py-16">
        <div className="mx-auto w-full max-w-none px-6 sm:px-8 lg:px-11 xl:px-16 2xl:px-24">
          <h2 className="font-serif text-[1.9rem] font-semibold text-black sm:text-[2.3rem]">APPS 2026</h2>
          <p className="page-prose mt-5 text-lg leading-relaxed">
            The second edition of APPS moves the conversation from broad democratic commitments to a focused and
            practical inquiry: how can political parties become credible, institutional drivers of economic
            transformation in Africa?
          </p>
          <p className="page-prose mt-4 text-lg leading-relaxed">
            APPS seeks to convene heads of state, political leaders, policymakers, economists, private sector actors,
            academia, civil society organisations and development partners to explore how party systems can contribute
            meaningfully to Africa&apos;s economic renewal.
          </p>
        </div>
      </section>

      <section className="w-full border-t border-border/80 bg-white py-10 sm:py-14 lg:py-16">
        <div className="mx-auto w-full max-w-none px-6 sm:px-8 lg:px-11 xl:px-16 2xl:px-24">
          <h2 className="font-serif text-[1.9rem] font-semibold text-black sm:text-[2.3rem]">Expected Outcomes</h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {expectedOutcomes.map((item) => (
              <li key={item} className="rounded-none border border-border/80 bg-white p-5 text-sm leading-relaxed text-black">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="w-full border-t border-border/80 bg-white py-10 sm:py-14 lg:py-16">
        <div className="mx-auto w-full max-w-none px-6 sm:px-8 lg:px-11 xl:px-16 2xl:px-24">
          <h2 className="font-serif text-[1.9rem] font-semibold text-black sm:text-[2.3rem]">Summit Structure and Format</h2>
          <div className="mt-7 grid gap-5 lg:grid-cols-3">
            <div className="rounded-none border border-border/80 bg-white p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-accent-700">Day One</p>
              <h3 className="mt-2 font-sans text-xl font-semibold text-black">Inclusive leadership platforms</h3>
              <p className="mt-3 text-sm leading-relaxed text-black">
                Africa Women Political Leadership Summit and African Youth in Politics Forum as foundational pillars.
              </p>
            </div>
            <div className="rounded-none border border-border/80 bg-white p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-accent-700">Day Two</p>
              <h3 className="mt-2 font-sans text-xl font-semibold text-black">Plenary and strategic dialogues</h3>
              <p className="mt-3 text-sm leading-relaxed text-black">
                Full summit programme with thematic roundtables and moderated high-level discussions.
              </p>
            </div>
            <div className="rounded-none border border-border/80 bg-white p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-accent-700">Day Three</p>
              <h3 className="mt-2 font-sans text-xl font-semibold text-black">Consultations and commitments</h3>
              <p className="mt-3 text-sm leading-relaxed text-black">
                Closed-door consultations among party leaders, with outputs informed by youth and women platforms.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full border-t border-border/80 bg-white py-10 sm:py-14 lg:py-16">
        <div className="mx-auto w-full max-w-none px-6 sm:px-8 lg:px-11 xl:px-16 2xl:px-24">
          <div className="relative overflow-hidden rounded-none border border-border/80 bg-black px-6 py-10 text-white sm:px-10">
            <div className="pointer-events-none absolute inset-0 opacity-30">
              <img src="/uploads/placeholder.svg" alt="" className="h-full w-full object-cover" />
            </div>
            <div className="relative">
              <h2 className="font-serif text-[1.9rem] font-semibold sm:text-[2.3rem]">Sponsorship & Partnership</h2>
              <p className="mt-4 max-w-4xl text-sm leading-relaxed text-white/90 sm:text-base">
                APPS 2026 provides strategic opportunities for corporate and institutional sponsorship through
                high-visibility brand exposure, partnership recognition, and direct engagement with policy
                influencers from across Africa.
              </p>
              <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                <li className="text-sm text-white/90">Brand visibility across venues, digital platforms, and summit materials</li>
                <li className="text-sm text-white/90">Speaking opportunities and session branding</li>
                <li className="text-sm text-white/90">Exhibition space for products and services</li>
                <li className="text-sm text-white/90">Access to closed-door VIP sessions and publicity acknowledgements</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="isolate w-full border-t border-border/80 bg-white py-16 sm:py-20">
        <div className="mx-auto w-full max-w-4xl bg-white px-4 sm:px-6 lg:px-8">
          <HomeScrollReveal variant="scaleUp" start="top 88%" className="block w-full bg-white">
            <div className="rounded-none border border-border/80 bg-white p-8 sm:p-10">
              <h2 className="font-serif text-3xl font-semibold text-black">Secure your spot at APP Summit 2026</h2>
              <p className="page-prose mt-3 text-black">
                A sponsorship prospectus is available for download. Organizations interested in partnering with APPS
                2026 are encouraged to contact the Secretariat directly.
              </p>
              <div className="mt-6 flex flex-wrap gap-4">
                <Button asChild href={registration.href || "/contact"} variant="primary" className="rounded-none bg-accent-700 hover:bg-accent-800">
                  {registration.cta || "Register Now"}
                </Button>
                <Button asChild href="/contact" variant="outline" className="rounded-none">
                  Contact Secretariat
                </Button>
                <a
                  href={`mailto:${siteSettings.email.programs}`}
                  className="inline-flex items-center justify-center rounded-none border border-border/90 bg-white px-5 py-2.5 text-sm font-medium text-black transition-colors hover:border-accent-300"
                >
                  {siteSettings.email.programs}
                </a>
              </div>
              <div className="mt-6 flex items-start gap-3 rounded-none border border-border/80 bg-stone-50 p-4">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-accent-700" />
                <p className="text-sm text-black">No 5 Teinor Street, Dzorwulu – Accra Ghana</p>
              </div>
              <div className="mt-4 flex items-start gap-3 rounded-none border border-border/80 bg-stone-50 p-4">
                <Handshake className="mt-0.5 h-5 w-5 shrink-0 text-accent-700" />
                <p className="text-sm text-black">
                  Participants include heads of state and government affiliated with political parties, party
                  chairpersons and secretaries-general, members of parliament, economic advisors, private sector
                  leaders, academia, and civil society actors.
                </p>
              </div>
            </div>
          </HomeScrollReveal>
        </div>
      </section>
    </>
  );
}
