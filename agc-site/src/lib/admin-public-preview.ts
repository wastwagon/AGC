/** Map CMS page slug to the public URL path. */
const PATH_BY_SLUG: Record<string, string> = {
  "our-work-programs": "/our-work#programs",
  "our-work-projects": "/our-work#projects",
  "our-work-advisory": "/our-work#advisory",
  "our-work-research": "/our-work/research",
  "our-work-training": "/our-work/training",
  "our-work-partnership": "/our-work/partnership",
};

export function publicPathForPageSlug(slug: string): string {
  const s = slug.trim();
  if (s === "" || s === "home") return "/";
  return PATH_BY_SLUG[s] ?? `/${s}`;
}
