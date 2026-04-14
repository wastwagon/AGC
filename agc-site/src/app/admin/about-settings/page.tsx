import { aboutContent as aboutDefaults } from "@/data/content";
import { cmsStaticOrEmpty, getMergedPageContent } from "@/lib/page-content";
import { requireAdminSession } from "@/lib/require-admin";
import { AdminPageHeader } from "../_components/AdminPageHeader";
import { AboutSettingsForm } from "./AboutSettingsForm";

export const dynamic = "force-dynamic";

/** CMS merge can omit nested objects (column-only rows, partial JSON). Form requires full shape. */
function normalizeAboutFormContent(merged: unknown) {
  const m = merged as Record<string, unknown>;
  const hero =
    m.hero && typeof m.hero === "object" && !Array.isArray(m.hero)
      ? (m.hero as Record<string, unknown>)
      : {};
  const strat =
    m.strategicObjectives && typeof m.strategicObjectives === "object" && !Array.isArray(m.strategicObjectives)
      ? (m.strategicObjectives as Record<string, unknown>)
      : {};
  const teamRaw =
    m.teamPage && typeof m.teamPage === "object" && !Array.isArray(m.teamPage)
      ? (m.teamPage as Record<string, unknown>)
      : null;

  return {
    title: typeof m.title === "string" ? m.title : aboutDefaults.title,
    hero: {
      subtitle: typeof hero.subtitle === "string" ? hero.subtitle : aboutDefaults.hero.subtitle,
    },
    intro: typeof m.intro === "string" ? m.intro : aboutDefaults.intro,
    description: typeof m.description === "string" ? m.description : aboutDefaults.description,
    mission: typeof m.mission === "string" ? m.mission : aboutDefaults.mission,
    strategicObjectives: {
      title: typeof strat.title === "string" ? strat.title : aboutDefaults.strategicObjectives.title,
      content: typeof strat.content === "string" ? strat.content : aboutDefaults.strategicObjectives.content,
      principles: typeof strat.principles === "string" ? strat.principles : aboutDefaults.strategicObjectives.principles,
      agenda2063: typeof strat.agenda2063 === "string" ? strat.agenda2063 : aboutDefaults.strategicObjectives.agenda2063,
    },
    ...(typeof m.heroImage === "string" ? { heroImage: m.heroImage } : {}),
    ...(typeof m.whoWeAreImage === "string" ? { whoWeAreImage: m.whoWeAreImage } : {}),
    ...(typeof m.sectionImage === "string" ? { sectionImage: m.sectionImage } : {}),
    teamPage: teamRaw
      ? {
          title: typeof teamRaw.title === "string" ? teamRaw.title : aboutDefaults.teamPage.title,
          subtitle: typeof teamRaw.subtitle === "string" ? teamRaw.subtitle : aboutDefaults.teamPage.subtitle,
          ...(typeof teamRaw.heroImage === "string" ? { heroImage: teamRaw.heroImage } : {}),
        }
      : { ...aboutDefaults.teamPage },
  };
}

export default async function AdminAboutSettingsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireAdminSession();
  const [merged, params] = await Promise.all([
    getMergedPageContent<typeof aboutDefaults>("about", cmsStaticOrEmpty(aboutDefaults)),
    searchParams,
  ]);
  const c = normalizeAboutFormContent(merged);
  const saved = params.saved === "1";
  const error = typeof params.error === "string" ? params.error : null;

  return (
    <div>
      <AdminPageHeader title="About Settings" description="Structured editor for About page messaging, objectives, and images." />
      {saved ? <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">About settings updated.</div> : null}
      {error ? <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

      <AboutSettingsForm content={c} saved={saved} />
    </div>
  );
}
