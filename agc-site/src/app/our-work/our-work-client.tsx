"use client";

import { useState } from "react";
import Image from "next/image";
import { LayoutGrid, Target, Users } from "lucide-react";
import type { OurWorkPageContent } from "@/data/content";
import { PageHero } from "@/components/PageHero";
import { preferUnoptimizedImage } from "@/lib/image-delivery";
import type { SiteBreadcrumbChrome } from "@/data/site-chrome";

const tabIcons = {
  programs: LayoutGrid,
  projects: Target,
  advisory: Users,
} as const;

export type OurWorkAreaCard = {
  key: string;
  title: string;
  description: string;
  /** Resolved URL from CMS image (uploads / media id); null uses a soft placeholder. */
  imageUrl: string | null;
};

type TabKey = "programs" | "projects" | "advisory";

type OurWorkClientProps = {
  programsResolved: OurWorkAreaCard[];
  projectsResolved: OurWorkAreaCard[];
  content: OurWorkPageContent;
  heroImage: string;
  breadcrumbLabels: SiteBreadcrumbChrome;
};

export function OurWorkClient({
  programsResolved,
  projectsResolved,
  content,
  heroImage,
  breadcrumbLabels,
}: OurWorkClientProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("programs");

  const tabs: { key: TabKey; label: string }[] = [
    { key: "programs", label: content.tabs.programs },
    { key: "projects", label: content.tabs.projects },
    { key: "advisory", label: content.tabs.advisory },
  ];

  const programsCards: OurWorkAreaCard[] =
    programsResolved.length > 0
      ? programsResolved
      : content.programs.cards.map((c) => ({
          key: c.title,
          title: c.title,
          description: c.description,
          imageUrl: null,
        }));

  const projectsCards: OurWorkAreaCard[] =
    projectsResolved.length > 0
      ? projectsResolved
      : content.projects.cards.map((c) => ({
          key: c.title,
          title: c.title,
          description: c.description,
          imageUrl: null,
        }));

  const advisoryCards: OurWorkAreaCard[] = content.advisory.cards.map((c) => ({
    key: c.title,
    title: c.title,
    description: c.description,
    imageUrl: null,
  }));

  const cardsByTab: Record<TabKey, OurWorkAreaCard[]> = {
    programs: programsCards,
    projects: projectsCards,
    advisory: advisoryCards,
  };

  const activeContent = content[activeTab];
  const cards = cardsByTab[activeTab];

  return (
    <>
      <PageHero
        title={content.hero.title}
        subtitle={content.hero.subtitle}
        image={heroImage}
        imageAlt="Our Work"
        breadcrumbs={[{ label: breadcrumbLabels.home, href: "/" }, { label: breadcrumbLabels.ourWork }]}
      />

      <section className="page-section-paper border-b border-stone-200/80 py-16 sm:py-20 lg:py-24">
        <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-medium text-accent-800">How we work</p>
          <h2 className="page-heading mt-2 text-2xl sm:text-3xl lg:text-4xl">{content.approach.title}</h2>
          <p className="page-prose mt-6">{content.approach.intro}</p>
          <p className="mt-8 text-sm font-semibold uppercase tracking-wide text-stone-500">
            {content.approach.objectivesLead}
          </p>
          <ul className="mt-6 space-y-5">
            {content.approach.objectives.map((obj, i) => (
              <li key={i} className="page-card flex gap-4 p-5 sm:gap-5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-100 font-sans text-sm font-bold tabular-nums text-accent-800">
                  {i + 1}
                </span>
                <span className="page-prose-tight pt-0.5">{obj}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="page-section-warm border-t border-stone-200/60 py-16 sm:py-20 lg:py-24">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center lg:mx-0 lg:max-w-xl lg:text-left">
            <p className="text-sm font-medium text-accent-800">Programmes & projects</p>
            <p className="page-prose mt-2 text-stone-600">{activeContent.description}</p>
          </div>
          <div
            className="mt-8 flex flex-wrap gap-0 border-b border-stone-300/80"
            role="tablist"
            aria-label="Work areas"
          >
            {tabs.map((tab) => {
              const Icon = tabIcons[tab.key];
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveTab(tab.key)}
                  className={`relative flex items-center gap-2 px-4 py-3.5 text-sm font-medium transition-colors sm:px-6 ${
                    isActive
                      ? "text-accent-900 after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:rounded-full after:bg-accent-600"
                      : "text-stone-500 hover:text-stone-800"
                  }`}
                >
                  <Icon className="h-4 w-4 opacity-80" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="mt-12">
            {cards.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {cards.map((card) => (
                  <article
                    key={card.key}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-stone-200/90 bg-[#fffcf7] shadow-sm transition-all duration-300 hover:border-accent-200/60 hover:shadow-md"
                  >
                    <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-stone-200/60">
                      {card.imageUrl ? (
                        <Image
                          src={card.imageUrl}
                          alt={card.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          unoptimized={preferUnoptimizedImage(card.imageUrl)}
                        />
                      ) : (
                        <div
                          className="absolute inset-0 bg-gradient-to-br from-accent-200/35 via-stone-200/50 to-accent-100/40"
                          aria-hidden
                        />
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-6 sm:p-7">
                      <h3 className="font-[family-name:var(--font-fraunces)] text-lg font-semibold leading-snug text-stone-900">
                        {card.title}
                      </h3>
                      <p className="page-prose-tight mt-3 flex-1 text-sm text-stone-600">{card.description}</p>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-stone-300 bg-[#fffcf7] py-14 text-center">
                <p className="text-stone-600">Nothing listed here yet—check back soon.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
