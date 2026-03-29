/** Map CMS page slug to the public URL path. */
export function publicPathForPageSlug(slug: string): string {
  const s = slug.trim();
  if (s === "" || s === "home") return "/";
  return `/${s}`;
}
