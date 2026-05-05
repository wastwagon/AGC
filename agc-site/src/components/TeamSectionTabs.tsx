"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { User } from "lucide-react";
import { fallbackTeam } from "@/data/content";
import {
  cardImageUrlOrNull,
  preferUnoptimizedImage,
} from "@/lib/image-delivery";

type TeamMember = {
  id: number;
  name: string;
  role?: string;
  bio?: string;
  section?: string;
  /** Resolved public URL — set on About when mapping from CMS */
  imageUrl?: string | null;
};

/** Navy headline / outline control — Oxford-style institutional blue */
const navy = "#002147";

export function TeamSectionTabs({
  cmsTeam,
  tabs,
}: {
  cmsTeam: TeamMember[];
  tabs: { key: string; label: string }[];
}) {
  const [activeTab, setActiveTab] = useState(0);
  const team = cmsTeam.length > 0 ? cmsTeam : (fallbackTeam as TeamMember[]);
  const sectionKeys = tabs.map((t) => t.key);
  const activeSection =
    sectionKeys[activeTab] ?? sectionKeys[0] ?? "advisory_board";
  const members = activeSection === "all" ? team : team.filter((m) => (m.section || "advisory_board") === activeSection);

  return (
    <div>
      {/* <div className="mx-auto max-w-2xl text-center lg:mx-0 lg:max-w-none lg:text-left">
        <h2 className="mt-1 font-serif text-[1.85rem] font-semibold tracking-tight text-black sm:text-[2.2rem] lg:text-[2.55rem] lg:leading-tight">
          Our team & advisors
        </h2>
        <p className="page-prose mt-3 text-black font-medium">
          Fellows, associates, and advisory voices who shape our research and convenings.
        </p>
      </div> */}
      <div
        className="mt-8 flex flex-wrap gap-2"
        role="tablist"
        aria-label="Team sections"
      >
        {tabs.map((tab, i) => (
          <button
            key={`${tab.key}-${tab.label}`}
            type="button"
            role="tab"
            aria-selected={activeTab === i}
            onClick={() => setActiveTab(i)}
            className={`px-4 py-2 text-sm font-medium transition-colors sm:px-5 ${
              activeTab === i
                ? "bg-accent-600 text-white"
                : "bg-[#f1f4f9] text-black hover:bg-[#e4eaf3]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-10">
        {members.length > 0 ? (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {members.map((member) => {
              const resolved = cardImageUrlOrNull(member.imageUrl ?? undefined);
              return (
                <li
                  key={member.id}
                  className="flex flex-col overflow-hidden rounded-none bg-[#ffffff] shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="relative aspect-4/3 w-full shrink-0 bg-[#f1f4f9]">
                    {resolved ? (
                      <Image
                        src={resolved}
                        alt={member.name}
                        fill
                        className="object-cover object-top"
                        sizes="(max-width: 640px) 100vw, 33vw"
                        unoptimized={preferUnoptimizedImage(resolved)}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <User
                          className="h-14 w-14 text-slate-300"
                          strokeWidth={1.25}
                          aria-hidden
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-center px-6 pb-8 pt-8 text-center">
                    <h3
                      className="font-sans text-xs font-semibold uppercase leading-snug tracking-wide sm:text-sm"
                      style={{ color: navy }}
                    >
                      {member.name}
                    </h3>
                    {member.role && (
                      <p className="mt-3 text-sm font-bold leading-snug text-black">
                        {member.role}
                      </p>
                    )}
                    <Link
                      href={`/about/team/${member.id}`}
                      className="mt-8 text-sm font-medium text-[#002147] no-underline transition-colors hover:underline hover:underline-offset-4"
                    >
                      View profile
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="rounded-xl border border-dashed border-border bg-[#ffffff] py-12 text-center text-black">
            No profiles in this section yet.
          </p>
        )}
      </div>
    </div>
  );
}
