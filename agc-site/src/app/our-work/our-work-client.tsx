"use client";

import { useState } from "react";
import { LayoutGrid, Target, Users, BookOpen, Zap, Users2, Megaphone, Globe, Shield, Lightbulb } from "lucide-react";
import type { OurWorkPageContent } from "@/data/content";
import { placeholderImages } from "@/data/images";
import { PageHero } from "@/components/PageHero";
import type { CmsProgram, CmsProject } from "@/lib/content";
import type { SiteBreadcrumbChrome } from "@/data/site-chrome";

const tabIcons = {
  programs: LayoutGrid,
  projects: Target,
  advisory: Users,
} as const;

const cardIcons = [BookOpen, Zap, Users2, Megaphone, Globe, Shield, Lightbulb] as const;

type TabKey = "programs" | "projects" | "advisory";

type CardItem = { title: string; description: string };

type OurWorkClientProps = {
  cmsPrograms: CmsProgram[];
  cmsProjects: CmsProject[];
  content: OurWorkPageContent;
  breadcrumbLabels: SiteBreadcrumbChrome;
};

export function OurWorkClient({ cmsPrograms, cmsProjects, content, breadcrumbLabels }: OurWorkClientProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("programs");

  const tabs: { key: TabKey; label: string }[] = [
    { key: "programs", label: content.tabs.programs },
    { key: "projects", label: content.tabs.projects },
    { key: "advisory", label: content.tabs.advisory },
  ];

  const programsCards: CardItem[] =
    cmsPrograms.length > 0
      ? cmsPrograms.map((p) => ({
          title: p.title,
          description: (p.description || "").replace(/<[^>]*>/g, "").slice(0, 300),
        }))
      : content.programs.cards;

  const projectsCards: CardItem[] =
    cmsProjects.length > 0
      ? cmsProjects.map((p) => ({
          title: p.title,
          description: (p.description || "").replace(/<[^>]*>/g, "").slice(0, 300),
        }))
      : content.projects.cards;

  const cardsByTab: Record<TabKey, CardItem[]> = {
    programs: programsCards,
    projects: projectsCards,
    advisory: content.advisory.cards,
  };

  const activeContent = content[activeTab];
  const cards = cardsByTab[activeTab];

  return (
    <>
      <PageHero
        title={content.hero.title}
        subtitle={content.hero.subtitle}
        image={placeholderImages.programs}
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
            <p className="page-prose mt-2 text-stone-600">
              {activeContent.description}
            </p>
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
                {cards.map((card, i) => {
                  const Icon = cardIcons[i % cardIcons.length];
                  return (
                    <article
                      key={card.title}
                      className="group page-card p-7 transition-all duration-300 hover:border-accent-200/50 hover:shadow-md"
                    >
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-100 text-accent-700 transition-colors group-hover:bg-accent-200/80">
                        <Icon className="h-5 w-5" strokeWidth={1.75} />
                      </div>
                      <h3 className="mt-5 font-sans text-lg font-semibold text-stone-900">{card.title}</h3>
                      <p className="page-prose-tight mt-3 text-sm">{card.description}</p>
                    </article>
                  );
                })}
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
