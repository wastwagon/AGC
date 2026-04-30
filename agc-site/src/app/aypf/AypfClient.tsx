"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { HomeScrollReveal } from "@/components/home/HomeScrollReveal";
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
  const regHref = content.registerSection.registrationHref?.trim() || "/contact";
  const contentMap = content as unknown as Record<string, unknown>;
  const focusSectionBgImage =
    typeof contentMap.focusSectionBgImage === "string" && contentMap.focusSectionBgImage.trim()
      ? contentMap.focusSectionBgImage.trim()
      : "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=2200&q=80";
  const strategicPrioritiesBgImage =
    typeof contentMap.strategicPrioritiesBgImage === "string" && contentMap.strategicPrioritiesBgImage.trim()
      ? contentMap.strategicPrioritiesBgImage.trim()
      : "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=2200&q=80";

  const focusAreas = [
    "Building youth leadership pipelines within political parties",
    "Advancing institutional reforms that lower barriers to political entry",
    "Promoting issue-based political engagement, particularly on economic transformation",
    "Strengthening cross-border collaboration among young political actors",
    "Embedding youth influence in party systems through policy and structural change",
  ];

  const objectives = [
    "Institutionalise youth leadership as a transformative force in continental politics and economic governance.",
    "Reposition youth as co-architects of democratic renewal in party leadership, elections, and policymaking structures.",
    "Catalyze internal party reforms that promote intergenerational inclusion, transparency, and youth leadership pipelines.",
    "Promote alignment with the African Youth Charter, Agenda 2063, and SDG 16.",
  ];

  const strategicPriorities = [
    {
      title: "Strengthening youth representation in political decision-making",
      body: "Advance practical pathways for increasing youth participation in party structures, public institutions, and policy spaces.",
    },
    {
      title: "Advancing political party reform and accountability",
      body: "Examine how political parties can become more transparent, inclusive, and responsive, with young people shaping reform agendas.",
    },
    {
      title: "Driving political innovation and digital democracy",
      body: "Explore how technology and digital platforms are reshaping civic participation, communication, and accountability.",
    },
    {
      title: "Promoting youth economic participation in governance",
      body: "Connect economic inclusion with political stability by integrating youth entrepreneurship, employment, and economic agency into governance priorities.",
    },
  ];
  const [priorityIndex, setPriorityIndex] = useState(0);
  const activePriority = strategicPriorities[priorityIndex];

  const goPrevPriority = () => {
    setPriorityIndex((prev) => (prev === 0 ? strategicPriorities.length - 1 : prev - 1));
  };

  const goNextPriority = () => {
    setPriorityIndex((prev) => (prev === strategicPriorities.length - 1 ? 0 : prev + 1));
  };

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

      <HomeScrollReveal variant="fadeUp" start="top 88%" className="block w-full">
        <section className="w-full border-b border-border/80 bg-white py-10 sm:py-14 lg:py-16">
          <div className="mx-auto w-full max-w-none px-6 sm:px-8 lg:px-11 xl:px-16 2xl:px-24">
            <div className="grid gap-10 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <p className="text-sm font-semibold uppercase tracking-[0.08em] text-accent-800">AYPF</p>
                <h2 className="mt-3 font-serif text-[2rem] font-semibold leading-tight text-black sm:text-[2.5rem]">
                  Youth at the center of Africa’s political and economic transformation
                </h2>
                <p className="mt-6 page-prose text-[1.08rem] font-medium leading-relaxed text-stone-800">
                  The AYPF is a continental convening grounded in the conviction that Africa&apos;s transformation requires
                  inclusive leadership with youth at its centre. It convenes young politicians, activists, reformers,
                  and emerging leaders who are already shaping governance outcomes or aspire to do so.
                </p>
                <p className="mt-4 page-prose text-[1.08rem] font-medium leading-relaxed text-stone-800">
                  At its core is a simple belief: leadership gains legitimacy, creativity, and relevance when it
                  reflects the full diversity, intelligence, and lived experiences of young people. The inaugural
                  edition, held on International Youth Day in partnership with the Government of Ghana, brought
                  together over 1,000 young people and youth political leaders from across the continent.
                </p>
              </div>
              <div className="self-start rounded-none border border-border/90 bg-white p-6 shadow-sm">
                <h3 className="font-serif text-xl font-semibold text-black">Secure your spot at AYPF 2026</h3>
                <p className="mt-2 text-sm text-black">
                  Participation is by invitation. Register your interest to receive official updates and access
                  preparatory dialogues.
                </p>
                <Button asChild href={regHref} variant="primary" className="mt-5 w-full rounded-none bg-accent-600 hover:bg-accent-700">
                  Register Now
                </Button>
              </div>
            </div>
          </div>
        </section>
      </HomeScrollReveal>

      <HomeScrollReveal variant="slideLeft" start="top 88%" className="block w-full">
        <section
          className="w-full border-t border-white/20 bg-cover bg-center bg-no-repeat py-10 sm:py-14 lg:py-16 text-white"
          style={{
            backgroundImage:
              `linear-gradient(to bottom, rgba(12,74,110,0.86), rgba(8,47,73,0.9)), url('${focusSectionBgImage}')`,
          }}
        >
          <div className="mx-auto w-full max-w-none px-6 sm:px-8 lg:px-11 xl:px-16 2xl:px-24">
            <h2 className="font-serif text-[1.9rem] font-semibold sm:text-[2.3rem]">
              From symbolic inclusion to structured participation
            </h2>
            <p className="mt-4 max-w-4xl text-base font-medium leading-relaxed text-white/95">
              The AYPF is designed as a reform-oriented and capacity-building platform within Africa&apos;s political
              ecosystem. It works to shift youth engagement from symbolic representation to structured political
              participation where young people can exercise their full agency.
            </p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {focusAreas.map((item) => (
                <li key={item} className="rounded-none border border-white/20 bg-white/5 p-4 text-sm font-medium leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </HomeScrollReveal>

      <HomeScrollReveal variant="scaleUp" start="top 88%" className="block w-full">
        <section className="w-full border-t border-border/80 bg-white py-10 sm:py-14 lg:py-16">
          <div className="mx-auto w-full max-w-none px-6 sm:px-8 lg:px-11 xl:px-16 2xl:px-24">
            <h2 className="font-serif text-[1.9rem] font-semibold text-black sm:text-[2.3rem]">AYPF 2026</h2>
            <p className="mt-5 page-prose text-[1.08rem] font-medium leading-relaxed text-stone-800">
              The 2026 edition, themed <strong>&ldquo;Leveraging the Youth Dividend: Driving Africa&apos;s Economic and Political Transformation,&rdquo;</strong>{" "}
              underscores the central role of young Africans in shaping the continent&apos;s political and economic trajectory.
            </p>
            <p className="mt-4 page-prose text-[1.08rem] font-medium leading-relaxed text-stone-800">
              The Forum aligns with Aspiration 6 of Agenda 2063 and draws inspiration from the African Youth Charter and
              youth economic inclusion initiatives such as WYFEI 2030.
            </p>
          </div>
        </section>
      </HomeScrollReveal>

      <HomeScrollReveal variant="fadeIn" start="top 88%" className="block w-full">
        <section className="w-full border-t border-border/80 bg-white py-10 sm:py-14 lg:py-16">
          <div className="mx-auto w-full max-w-none px-6 sm:px-8 lg:px-11 xl:px-16 2xl:px-24">
            <h2 className="font-serif text-[1.9rem] font-semibold text-black sm:text-[2.3rem]">Objectives of AYPF 2026</h2>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
              {objectives.map((item) => (
                <li key={item} className="rounded-none border border-border/80 bg-white p-5 text-sm font-medium leading-relaxed text-black">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </HomeScrollReveal>

      <HomeScrollReveal variant="tiltUp" start="top 86%" className="block w-full">
        <section className="w-full border-t border-border/80 bg-white py-10 sm:py-14 lg:py-16">
          <div className="mx-auto w-full max-w-none px-6 sm:px-8 lg:px-11 xl:px-16 2xl:px-24">
            <h2 className="font-serif text-[1.9rem] font-semibold text-black sm:text-[2.3rem]">
              AYPF 2026 Strategic Priorities
            </h2>
            <div
              className="mt-7 overflow-hidden rounded-none border border-border/80 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage:
                  `linear-gradient(to bottom, rgba(2,6,23,0.72), rgba(2,6,23,0.8)), url('${strategicPrioritiesBgImage}')`,
              }}
            >
              <article className="min-h-[220px] p-6 sm:min-h-[240px] sm:p-8">
                <h3 className="font-sans text-2xl font-semibold text-white">{activePriority.title}</h3>
                <p className="mt-4 max-w-3xl text-base font-medium leading-relaxed text-white/95">{activePriority.body}</p>
              </article>
              <div className="flex items-center justify-between border-t border-white/30 bg-black/20 px-4 py-3 sm:px-6">
                <div className="text-sm font-medium text-white">
                  {priorityIndex + 1}/{strategicPriorities.length}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={goPrevPriority}
                    aria-label="Previous strategic priority"
                    className="flex h-9 w-9 items-center justify-center rounded-none border border-white/40 bg-white/10 text-white transition-colors hover:bg-white/20"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={goNextPriority}
                    aria-label="Next strategic priority"
                    className="flex h-9 w-9 items-center justify-center rounded-none border border-white/40 bg-white/10 text-white transition-colors hover:bg-white/20"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </HomeScrollReveal>

      <HomeScrollReveal variant="tiltUp" start="top 86%" className="block w-full">
        <section className="w-full border-t border-border/80 bg-white py-12 sm:py-16">
          <div className="mx-auto w-full max-w-4xl px-6 sm:px-8 lg:px-11">
            <div className="rounded-none border border-border/80 bg-accent-600 p-10 sm:p-12 text-white">
              <h2 className="font-serif text-3xl font-semibold text-white">Register Your Interest</h2>
              <p className="mt-3 text-sm font-medium leading-relaxed text-white/95">
                Participation in AYPF is by invitation. Register your interest to:
              </p>
              <ul className="mt-4 list-disc space-y-2 pl-6 text-white marker:text-white">
                <li>Receive official invitations</li>
                <li>Access early updates on the Forum</li>
                <li>Engage with preparatory dialogues and programming</li>
              </ul>
              <Button
                asChild
                href={regHref}
                variant="primary"
                className="mt-8 !rounded-none !bg-white font-semibold !text-accent-900 shadow-none hover:!bg-stone-100"
              >
                Register Now
              </Button>
            </div>
          </div>
        </section>
      </HomeScrollReveal>
    </>
  );
}
