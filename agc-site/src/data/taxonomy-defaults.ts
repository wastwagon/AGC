/**
 * Default taxonomy when DB row `site-taxonomy` is missing.
 * Admin: **Settings → Taxonomy** (`/admin/taxonomy`) overrides these in the database.
 */
export type TaxonomyOption = {
  slug: string;
  label: string;
  description?: string;
};

export const defaultNewsCategoryOptions: TaxonomyOption[] = [
  { slug: "appi", label: "African Political Parties Initiative", description: "APPI-related news and engagements" },
  { slug: "reports", label: "Reports & Publications", description: "Summary reports and publications" },
  { slug: "announcements", label: "Announcements", description: "Official announcements and calls" },
  { slug: "elections", label: "Elections & Democracy", description: "Electoral processes and democratic governance" },
  { slug: "fellowships", label: "Fellowships & Opportunities", description: "Calls for applications and opportunities" },
  { slug: "events", label: "Events", description: "Summits, conferences, and events" },
];

export const defaultPublicationTypeOptions: TaxonomyOption[] = [
  { slug: "report", label: "Report", description: "Summary and thematic reports" },
  { slug: "policy_brief", label: "Policy brief", description: "Short policy-oriented briefs" },
  { slug: "research", label: "Research", description: "Research papers and findings" },
  { slug: "working_paper", label: "Working paper", description: "Draft or discussion papers" },
  { slug: "toolkit", label: "Toolkit / guide", description: "Practical guides and toolkits" },
];

/** Flat news tags (comma-separated on articles); same line format as categories in Admin → Taxonomy */
export const defaultNewsTagOptions: TaxonomyOption[] = [
  { slug: "political-parties", label: "Political Parties" },
  { slug: "governance", label: "Governance" },
  { slug: "ghana", label: "Ghana" },
  { slug: "algeria", label: "Algeria" },
  { slug: "summit", label: "Summit" },
  { slug: "elections", label: "Elections" },
  { slug: "fellows", label: "Fellows" },
  { slug: "research", label: "Research" },
  { slug: "accra-declaration", label: "Accra Declaration" },
];
