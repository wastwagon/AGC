"use client";

import { useState, useEffect } from "react";
import { LayoutGrid, Target, Users } from "lucide-react";
import type { OurWorkPageContent } from "@/data/content";
import { PageHero } from "@/components/PageHero";
import { HomeScrollReveal } from "@/components/home/HomeScrollReveal";
import type { SiteBreadcrumbChrome } from "@/data/site-chrome";
import type { WorkAreaCard } from "@/lib/our-work-cards";
import { WorkAreaCardGrid } from "@/components/our-work/WorkAreaCardGrid";

const tabIcons = {
  programs: LayoutGrid,
  projects: Target,
  advisory: Users,
} as const;

/** @deprecated Use WorkAreaCard from @/lib/our-work-cards */
export type OurWorkAreaCard = WorkAreaCard;

type TabKey = "programs" | "projects" | "advisory";

type OurWorkClientProps = {
  programsResolved: WorkAreaCard[];
  projectsResolved: WorkAreaCard[];
  advisoryResolved: WorkAreaCard[];
  content: OurWorkPageContent;
  heroImage: string;
  breadcrumbLabels: SiteBreadcrumbChrome;
};

function tabFromHash(): TabKey | null {
  if (typeof window === "undefined") return null;
  const h = window.location.hash.replace(/^#/, "");
  if (h === "programs" || h === "projects" || h === "advisory") return h;
  return null;
}

export function OurWorkClient({
  programsResolved,
  projectsResolved,
  advisoryResolved,
  content,
  heroImage,
  breadcrumbLabels,
}: OurWorkClientProps) {
  const [activeTab, setActiveTab] = useState<TabKey>(() => tabFromHash() ?? "programs");

  useEffect(() => {
    const fromHash = tabFromHash();
    if (fromHash) {
      requestAnimationFrame(() => {
        document.getElementById("our-work-areas")?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }, []);

  useEffect(() => {
    const syncFromHash = () => {
      const t = tabFromHash();
      if (t) setActiveTab(t);
    };
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, []);

  useEffect(() => {
    const next = `#${activeTab}`;
    if (typeof window !== "undefined" && window.location.hash !== next) {
      window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}${next}`);
    }
  }, [activeTab]);

  const tabs: { key: TabKey; label: string }[] = [
    { key: "programs", label: content.tabs.programs },
    { key: "projects", label: content.tabs.projects },
    { key: "advisory", label: content.tabs.advisory },
  ];

  const programsCards: WorkAreaCard[] =
    programsResolved.length > 0
      ? programsResolved
      : content.programs.cards.map((c) => ({
          key: c.title,
          title: c.title,
          description: c.description,
          imageUrl: null,
        }));

  const projectsCards: WorkAreaCard[] =
    projectsResolved.length > 0
      ? projectsResolved
      : content.projects.cards.map((c) => ({
          key: c.title,
          title: c.title,
          description: c.description,
          imageUrl: null,
        }));

  const advisoryCards: WorkAreaCard[] =
    advisoryResolved.length > 0
      ? advisoryResolved
      : content.advisory.cards.map((c) => ({
          key: c.title,
          title: c.title,
          description: c.description,
          imageUrl: null,
        }));

  const cardsByTab: Record<TabKey, WorkAreaCard[]> = {
    programs: programsCards,
    projects: projectsCards,
    advisory: advisoryCards,
  };

  const activeContent = content[activeTab];
  const cards = cardsByTab[activeTab];
  const heroTitle = (content.hero.title || "").trim() || breadcrumbLabels.ourWork;
  const heroSubtitle = (content.hero.subtitle || "").trim();

  return (
    <>
      <PageHero
        title={heroTitle}
        subtitle={heroSubtitle}
        image={heroImage}
        imageAlt="Our Work"
        breadcrumbs={[{ label: breadcrumbLabels.home, href: "/" }, { label: breadcrumbLabels.ourWork }]}
      />

      <HomeScrollReveal variant="slideLeft" start="top 88%" className="block w-full">
        <section className="w-full border-b border-border/80 bg-white py-8 sm:py-12 lg:py-14">
        <div className="mx-auto w-full max-w-none px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <p className="text-base font-semibold text-accent-800">How we work</p>
          <h2 className="page-heading mt-2 text-3xl font-extrabold sm:text-4xl lg:text-5xl">{content.approach.title}</h2>
          <p className="page-prose mt-6 text-lg font-semibold text-black sm:text-xl">{content.approach.intro}</p>
          <p className="mt-8 text-sm font-semibold uppercase tracking-wide text-black">
            {content.approach.objectivesLead}
          </p>
          <ul className="mt-6 space-y-5">
            {content.approach.objectives.map((obj, i) => (
              <li key={i} className="page-card flex gap-4 !rounded-none p-5 sm:gap-5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-none bg-accent-600 font-sans text-sm font-bold tabular-nums text-white">
                  {i + 1}
                </span>
                <span className="page-prose-tight pt-0.5">{obj}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
      </HomeScrollReveal>

      <HomeScrollReveal variant="tiltUp" start="top 86%" className="block w-full">
        <section
          id="our-work-areas"
          className="w-full border-t border-border/80 bg-white py-8 sm:py-12 lg:py-14"
        >
        <div className="mx-auto w-full max-w-none px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="mx-auto max-w-2xl text-center lg:mx-0 lg:max-w-xl lg:text-left">
            <p className="text-sm font-medium text-accent-800">Programmes & projects</p>
            <p className="page-prose mt-2 text-black">{activeContent.description}</p>
          </div>
          <div
            className="mt-10 flex flex-wrap gap-2 sm:mt-12"
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
                  onClick={() => {
                    setActiveTab(tab.key);
                    const el = document.getElementById("our-work-areas");
                    el?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors sm:px-5 ${
                    isActive
                      ? "bg-accent-600 text-white"
                      : "bg-[#f1f4f9] text-black hover:bg-[#e4eaf3]"
                  }`}
                >
                  <Icon className="h-4 w-4 opacity-80" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="mt-14 sm:mt-16">
            <WorkAreaCardGrid cards={cards} />
          </div>
        </div>
      </section>
      </HomeScrollReveal>
    </>
  );
}
