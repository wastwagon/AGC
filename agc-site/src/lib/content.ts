/**
 * Content data layer - Prisma
 * Single source of truth for all site content (managed via /admin)
 */

import { prisma } from "@/lib/db";

/** Set during `docker build` when no database is available (see Dockerfile). */
function buildSkipsDb(): boolean {
  return process.env.BUILD_WITHOUT_DB === "1";
}

/** DB missing a column/table vs current Prisma schema (run `npx prisma migrate deploy`). */
function isPrismaSchemaMismatch(e: unknown): boolean {
  return (
    typeof e === "object" &&
    e !== null &&
    "code" in e &&
    (e as { code: string }).code === "P2022"
  );
}

// ============ Shared types (compatible with former Cms* interfaces) ============

export interface CmsEventAgendaItem {
  time?: string;
  title: string;
  description?: string;
}

export interface CmsEvent {
  id: number;
  status: string;
  title: string;
  slug?: string;
  description?: string;
  location?: string;
  start_date: string;
  end_date?: string;
  image?: string;
  link?: string;
  category?: string;
  event_type?: string;
  venue_name?: string;
  venue_address?: string;
  capacity?: number;
  registration_deadline?: string;
  /** When capacity is full, visitors may still join the waitlist (CMS Events). */
  allow_waitlist?: boolean;
  agenda?: CmsEventAgendaItem[];
  speaker_ids?: number[];
}

export interface CmsTeamMember {
  id: number;
  status: string;
  name: string;
  role?: string;
  bio?: string;
  image?: string;
  order?: number;
}

export interface CmsPublication {
  id: number;
  status: string;
  title: string;
  slug?: string;
  excerpt?: string;
  /** Publication type slugs (multi-select) */
  types?: string[];
  /** @deprecated legacy single type (fallback content only) */
  type?: string;
  file?: string;
  image?: string;
  date_published?: string;
  date_created?: string;
  author?: string;
}

export interface CmsNews {
  id: number;
  status: string;
  title: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  image?: string;
  date_created: string;
  date_published?: string;
  categories?: string[];
  tags?: string[];
  author?: string;
}

export interface CmsProgram {
  id: number;
  status: string;
  title: string;
  description?: string;
  image?: string;
  order?: number;
}

export interface CmsProject {
  id: number;
  status: string;
  title: string;
  description?: string;
  image?: string;
  order?: number;
}

export interface CmsPartner {
  id: number;
  status: string;
  name: string;
  logo?: string;
  url?: string;
  order?: number;
}

// ============ Events ============

export async function getEvents() {
  if (buildSkipsDb()) return [];
  const rows = await prisma.event.findMany({
    where: { status: "published" },
    orderBy: { startDate: "desc" },
  });
  return rows.map((e) => ({
    id: e.id,
    status: e.status,
    title: e.title,
    slug: e.slug ?? undefined,
    description: e.description ?? undefined,
    location: e.location ?? undefined,
    start_date: e.startDate.toISOString(),
    end_date: e.endDate?.toISOString(),
    image: e.image ?? undefined,
    link: e.link ?? undefined,
    category: e.category ?? undefined,
    event_type: e.eventType ?? undefined,
    venue_name: e.venueName ?? undefined,
    venue_address: e.venueAddress ?? undefined,
    capacity: e.capacity ?? undefined,
    registration_deadline: e.registrationDeadline?.toISOString(),
    allow_waitlist: e.allowWaitlist,
    agenda: e.agenda as { time?: string; title: string; description?: string }[] | undefined,
    speaker_ids: e.speakerIds as number[] | undefined,
  }));
}

/** Admin: fetch event by slug (any status) */
export async function getEventBySlugAdmin(slug: string) {
  if (buildSkipsDb()) return null;
  const e = await prisma.event.findFirst({
    where: { slug },
  });
  if (!e) return null;
  return {
    id: e.id,
    status: e.status,
    title: e.title,
    slug: e.slug ?? undefined,
    description: e.description ?? undefined,
    location: e.location ?? undefined,
    start_date: e.startDate.toISOString(),
    end_date: e.endDate?.toISOString(),
    image: e.image ?? undefined,
    link: e.link ?? undefined,
    category: e.category ?? undefined,
    event_type: e.eventType ?? undefined,
    venue_name: e.venueName ?? undefined,
    venue_address: e.venueAddress ?? undefined,
    capacity: e.capacity ?? undefined,
    registration_deadline: e.registrationDeadline?.toISOString(),
    allow_waitlist: e.allowWaitlist,
    agenda: e.agenda as { time?: string; title: string; description?: string }[] | undefined,
    speaker_ids: e.speakerIds as number[] | undefined,
  };
}

export async function getEventBySlug(slug: string) {
  if (buildSkipsDb()) return null;
  const e = await prisma.event.findFirst({
    where: { slug, status: "published" },
  });
  if (!e) return null;
  return {
    id: e.id,
    status: e.status,
    title: e.title,
    slug: e.slug ?? undefined,
    description: e.description ?? undefined,
    location: e.location ?? undefined,
    start_date: e.startDate.toISOString(),
    end_date: e.endDate?.toISOString(),
    image: e.image ?? undefined,
    link: e.link ?? undefined,
    category: e.category ?? undefined,
    event_type: e.eventType ?? undefined,
    venue_name: e.venueName ?? undefined,
    venue_address: e.venueAddress ?? undefined,
    capacity: e.capacity ?? undefined,
    registration_deadline: e.registrationDeadline?.toISOString(),
    allow_waitlist: e.allowWaitlist,
    agenda: e.agenda as { time?: string; title: string; description?: string }[] | undefined,
    speaker_ids: e.speakerIds as number[] | undefined,
  };
}

// ============ News ============

export async function getNews(limit = 10) {
  if (buildSkipsDb()) return [];
  const rows = await prisma.news.findMany({
    where: { status: "published" },
    orderBy: [{ datePublished: "desc" }, { createdAt: "desc" }],
    take: limit,
  });
  return rows.map((n) => ({
    id: n.id,
    status: n.status,
    title: n.title,
    slug: n.slug ?? undefined,
    excerpt: n.excerpt ?? undefined,
    content: n.content ?? undefined,
    image: n.image ?? undefined,
    date_created: n.createdAt.toISOString(),
    date_published: n.datePublished?.toISOString(),
    author: n.author ?? undefined,
    categories: n.categories as string[] | undefined,
    tags: n.tags as string[] | undefined,
  }));
}

export async function getNewsBySlug(slug: string) {
  if (buildSkipsDb()) return null;
  const n = await prisma.news.findFirst({
    where: { slug, status: "published" },
  });
  if (!n) return null;
  return {
    id: n.id,
    status: n.status,
    title: n.title,
    slug: n.slug ?? undefined,
    excerpt: n.excerpt ?? undefined,
    content: n.content ?? undefined,
    image: n.image ?? undefined,
    date_created: n.createdAt.toISOString(),
    date_published: n.datePublished?.toISOString(),
    author: n.author ?? undefined,
    categories: n.categories as string[] | undefined,
    tags: n.tags as string[] | undefined,
  };
}

// ============ Team ============

export async function getTeam(): Promise<CmsTeamMember[]> {
  if (buildSkipsDb()) return [];
  const rows = await prisma.team.findMany({
    where: { status: "published" },
    orderBy: { order: "asc" },
  });
  return rows.map((t) => ({
    id: t.id,
    status: t.status,
    name: t.name,
    role: t.role ?? undefined,
    bio: t.bio ?? undefined,
    image: t.image ?? undefined,
    order: t.order,
  }));
}

// ============ Publications ============

export async function getPublications(limit = 20) {
  if (buildSkipsDb()) return [];
  try {
    const rows = await prisma.publication.findMany({
      where: { status: "published" },
      orderBy: [{ datePublished: "desc" }, { createdAt: "desc" }],
      take: limit,
    });
    return rows.map((p) => {
      const typesRaw = p.types as string[] | null | undefined;
      return {
        id: p.id,
        status: p.status,
        title: p.title,
        slug: p.slug ?? undefined,
        excerpt: p.excerpt ?? undefined,
        types: Array.isArray(typesRaw) ? typesRaw : undefined,
        file: p.file ?? undefined,
        image: p.image ?? undefined,
        date_published: p.datePublished?.toISOString(),
        date_created: p.createdAt.toISOString(),
        author: p.author ?? undefined,
      };
    });
  } catch (e) {
    if (isPrismaSchemaMismatch(e)) {
      if (process.env.NODE_ENV === "development") {
        console.warn(
          "[getPublications] DB schema out of date — run `npx prisma migrate deploy`. Using empty list."
        );
      }
      return [];
    }
    throw e;
  }
}

export async function getPublicationBySlug(slug: string) {
  if (buildSkipsDb()) return null;
  try {
    const p = await prisma.publication.findFirst({
      where: { slug, status: "published" },
    });
    if (!p) return null;
    const typesRaw = p.types as string[] | null | undefined;
    return {
      id: p.id,
      status: p.status,
      title: p.title,
      slug: p.slug ?? undefined,
      excerpt: p.excerpt ?? undefined,
      types: Array.isArray(typesRaw) ? typesRaw : undefined,
      file: p.file ?? undefined,
      image: p.image ?? undefined,
      date_published: p.datePublished?.toISOString(),
      date_created: p.createdAt.toISOString(),
      author: p.author ?? undefined,
    };
  } catch (e) {
    if (isPrismaSchemaMismatch(e)) {
      if (process.env.NODE_ENV === "development") {
        console.warn(
          "[getPublicationBySlug] DB schema out of date — run `npx prisma migrate deploy`. Skipping CMS row."
        );
      }
      return null;
    }
    throw e;
  }
}

// ============ Programs, Projects, Partners ============

export async function getPrograms() {
  if (buildSkipsDb()) return [];
  const rows = await prisma.program.findMany({
    where: { status: "published" },
    orderBy: { order: "asc" },
  });
  return rows.map((p) => ({
    id: p.id,
    status: p.status,
    title: p.title,
    description: p.description ?? undefined,
    image: p.image ?? undefined,
    order: p.order,
  }));
}

export async function getProjects() {
  if (buildSkipsDb()) return [];
  const rows = await prisma.project.findMany({
    where: { status: "published" },
    orderBy: { order: "asc" },
  });
  return rows.map((p) => ({
    id: p.id,
    status: p.status,
    title: p.title,
    description: p.description ?? undefined,
    image: p.image ?? undefined,
    order: p.order,
  }));
}

export async function getPartners() {
  if (buildSkipsDb()) return [];
  const rows = await prisma.partner.findMany({
    where: { status: "published" },
    orderBy: { order: "asc" },
  });
  return rows.map((p) => ({
    id: p.id,
    status: p.status,
    name: p.name,
    logo: p.logo ?? undefined,
    url: p.url ?? undefined,
    order: p.order,
  }));
}

// ============ Page Content ============

export async function getPageContent(slug: string) {
  if (buildSkipsDb()) return null;
  const p = await prisma.pageContent.findFirst({
    where: { slug, status: "published" },
  });
  if (!p) return null;
  const heroTitle = p.heroTitle;
  const heroSubtitle = p.heroSubtitle;
  const contentJson: Record<string, unknown> = {
    ...(p.contentJson as Record<string, unknown>),
    title: p.title ?? heroTitle,
    subtitle: heroSubtitle,
    hero: { title: heroTitle, subtitle: heroSubtitle },
    intro: p.intro,
    description: p.description,
    mission: p.mission,
    strategicObjectives: p.objectivesTitle
      ? {
          title: p.objectivesTitle,
          content: p.objectivesContent,
          principles: p.objectivesPrinciples,
          agenda2063: p.objectivesAgenda2063,
        }
      : undefined,
  };
  return {
    id: p.id,
    slug: p.slug,
    title: p.title ?? undefined,
    content_json: contentJson,
  };
}

// ============ Media/Image URLs (uploads live in /public/uploads) ============

/** Resolve image path to URL. Use for content layer (paths). For media-xxx use resolveImageUrl from media. */
export function getContentImageUrl(path: string | undefined): string | null {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return path.startsWith("/") ? path : `/${path}`;
}

export function getContentFileUrl(path: string | undefined): string | null {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return path.startsWith("/") ? path : `/${path}`;
}

/** Resolve event/image ref to URL for sync use. Content layer uses paths (uploads/xxx or /uploads/xxx). */
export function resolveImageUrlSync(ref: string | { id: string } | undefined): string | null {
  if (!ref) return null;
  const id = typeof ref === "object" ? ref?.id : ref;
  if (!id) return null;
  if (id.startsWith("http") || id.startsWith("/")) return id;
  if (id.includes("/") || id.startsWith("uploads")) return id.startsWith("/") ? id : `/${id}`;
  return null;
}
