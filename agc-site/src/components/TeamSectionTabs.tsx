"use client";

import { useState } from "react";
import { User } from "lucide-react";
import { aboutContent, fallbackTeam } from "@/data/content";

type TeamMember = {
  id: number;
  name: string;
  role?: string;
  bio?: string;
  section?: string;
};

const sectionKeys = ["advisory_board", "management_team", "fellows", "associate_fellows"] as const;
const tabLabels = [
  aboutContent.teamTabs.advisoryBoard,
  aboutContent.teamTabs.managementTeam,
  aboutContent.teamTabs.fellows,
  aboutContent.teamTabs.associateFellows,
];

export function TeamSectionTabs({ cmsTeam }: { cmsTeam: TeamMember[] }) {
  const [activeTab, setActiveTab] = useState(0);
  const team = cmsTeam.length > 0 ? cmsTeam : (fallbackTeam as TeamMember[]);
  const activeSection = sectionKeys[activeTab];
  const members = team.filter((m) => (m.section || "advisory_board") === activeSection);

  return (
    <div>
      <div className="mx-auto max-w-2xl text-center lg:mx-0 lg:max-w-none lg:text-left">
        <p className="text-sm font-medium text-accent-800">People</p>
        <h2 className="page-heading mt-1 text-2xl sm:text-3xl">Our team & advisors</h2>
        <p className="page-prose mt-3 text-stone-600">
          Fellows, associates, and advisory voices who shape our research and convenings.
        </p>
      </div>
      <div
        className="mt-8 flex flex-wrap gap-0 border-b border-stone-200"
        role="tablist"
        aria-label="Team sections"
      >
        {tabLabels.map((label, i) => (
          <button
            key={label}
            type="button"
            role="tab"
            aria-selected={activeTab === i}
            onClick={() => setActiveTab(i)}
            className={`relative px-4 py-3 text-sm font-medium transition-colors sm:px-5 ${
              activeTab === i
                ? "text-accent-800 after:absolute after:bottom-0 after:left-2 after:right-2 after:h-0.5 after:rounded-full after:bg-accent-600"
                : "text-stone-500 hover:text-stone-800"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="mt-10">
        {members.length > 0 ? (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {members.map((member) => (
              <li
                key={member.id}
                className="bg-white border border-stone-200/80 flex gap-4 p-6 transition-shadow hover:shadow-md sm:flex-col sm:p-7"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent-100 text-accent-800">
                  <User className="h-6 w-6" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-sans text-lg font-semibold text-stone-900">{member.name}</h3>
                  {member.role && <p className="mt-1 text-sm font-medium text-accent-800">{member.role}</p>}
                  {member.bio && (
                    <p className="page-prose-tight mt-3 text-sm">{member.bio}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-xl border border-dashed border-stone-300 bg-stone-50/50 py-12 text-center text-stone-600">
            No profiles in this section yet.
          </p>
        )}
      </div>
    </div>
  );
}
