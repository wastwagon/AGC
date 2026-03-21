/**
 * Admin UI: page title and breadcrumb trail from pathname.
 */

const SECTION: Record<string, string> = {
  media: "Media Library",
  events: "Events",
  news: "News",
  team: "Team",
  publications: "Publications",
  programs: "Programs",
  projects: "Projects",
  partners: "Partners",
  pages: "Page content",
  submissions: "Submissions",
};

const EXACT_TITLE: Record<string, string> = {
  "/admin": "Admin Dashboard",
  "/admin/login": "Sign in",
  "/admin/media": "Media Library",
  "/admin/events": "Events",
  "/admin/events/new": "New event",
  "/admin/events/scan": "Check-in Scanner",
  "/admin/news": "News",
  "/admin/news/new": "New article",
  "/admin/team": "Team",
  "/admin/team/new": "New team member",
  "/admin/publications": "Publications",
  "/admin/publications/new": "New publication",
  "/admin/programs": "Programs",
  "/admin/programs/new": "New program",
  "/admin/projects": "Projects",
  "/admin/projects/new": "New project",
  "/admin/partners": "Partners",
  "/admin/partners/new": "New partner",
  "/admin/pages": "Page content",
  "/admin/submissions": "Submissions",
};

export function getAdminTitle(pathname: string): string {
  const n = pathname.replace(/\/$/, "") || "/admin";
  if (EXACT_TITLE[n]) return EXACT_TITLE[n];

  // /admin/news/123/edit
  const newsEdit = n.match(/^\/admin\/news\/(\d+)\/edit$/);
  if (newsEdit) return "Edit article";
  // /admin/events/edit/123
  const eventEdit = n.match(/^\/admin\/events\/edit\/(\d+)$/);
  if (eventEdit) return "Edit event";
  // /admin/pages/foo/edit
  const pageEdit = n.match(/^\/admin\/pages\/([^/]+)\/edit$/);
  if (pageEdit) return "Edit page";
  // /admin/team/123/edit, etc.
  const idEdit = n.match(/^\/admin\/(\w+)\/(\d+)\/edit$/);
  if (idEdit) {
    const s = SECTION[idEdit[1]] || idEdit[1];
    return `Edit ${s.replace(/Library|content/gi, "").trim() || "item"}`;
  }

  const newMatch = n.match(/^\/admin\/(\w+)\/new$/);
  if (newMatch && SECTION[newMatch[1]]) return `New ${SECTION[newMatch[1]].toLowerCase().replace("library", "").trim()}`;

  const parts = n.split("/").filter(Boolean);
  const last = parts[parts.length - 1];
  return last ? last.charAt(0).toUpperCase() + last.slice(1).replace(/-/g, " ") : "Admin";
}

export type Crumb = { label: string; href?: string };

export function getAdminBreadcrumbs(pathname: string): Crumb[] {
  const n = pathname.replace(/\/$/, "") || "/admin";
  // Root admin: no breadcrumb — header title already says "Admin Dashboard" (avoids "Dashboard" twice)
  if (n === "/admin") return [];
  if (n === "/admin/login") return [{ label: "Admin", href: "/admin" }, { label: "Sign in" }];

  const crumbs: Crumb[] = [{ label: "Dashboard", href: "/admin" }];

  if (n === "/admin/media") {
    crumbs.push({ label: "Media Library" });
    return crumbs;
  }

  const newsEdit = n.match(/^\/admin\/news\/(\d+)\/edit$/);
  if (newsEdit) {
    crumbs.push({ label: "News", href: "/admin/news" }, { label: "Edit" });
    return crumbs;
  }

  const eventEdit = n.match(/^\/admin\/events\/edit\/(\d+)$/);
  if (eventEdit) {
    crumbs.push({ label: "Events", href: "/admin/events" }, { label: "Edit" });
    return crumbs;
  }

  const pageEdit = n.match(/^\/admin\/pages\/([^/]+)\/edit$/);
  if (pageEdit) {
    crumbs.push({ label: "Page content", href: "/admin/pages" }, { label: "Edit" });
    return crumbs;
  }

  const genericEdit = n.match(/^\/admin\/(\w+)\/(\d+)\/edit$/);
  if (genericEdit) {
    const sec = SECTION[genericEdit[1]] || genericEdit[1];
    crumbs.push({ label: sec, href: `/admin/${genericEdit[1]}` }, { label: "Edit" });
    return crumbs;
  }

  const newM = n.match(/^\/admin\/(\w+)\/new$/);
  if (newM && SECTION[newM[1]]) {
    crumbs.push({ label: SECTION[newM[1]], href: `/admin/${newM[1]}` }, { label: "New" });
    return crumbs;
  }

  const parts = n.split("/").filter(Boolean).slice(1);
  if (parts[0] === "events" && parts[1] === "new") {
    crumbs.push({ label: "Events", href: "/admin/events" }, { label: "New event" });
    return crumbs;
  }
  if (parts[0] === "events" && parts[1] === "scan") {
    crumbs.push({ label: "Events", href: "/admin/events" }, { label: "Check-in Scanner" });
    return crumbs;
  }

  const section = parts[0];
  if (section && SECTION[section] && parts.length === 1) {
    crumbs.push({ label: SECTION[section] });
    return crumbs;
  }

  crumbs.push({ label: getAdminTitle(n) });
  return crumbs;
}
