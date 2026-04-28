import { AdminPageHeader } from "../_components/AdminPageHeader";
import { getHomePageCmsForEdit } from "@/lib/home-page-data";
import { requireAdminSession } from "@/lib/require-admin";
import { HomeSettingsForm } from "./HomeSettingsForm";
import { workContent } from "@/data/content";
import { getMergedPageContent } from "@/lib/page-content";

export const dynamic = "force-dynamic";

type HomePillarSettings = {
  pillarRowTitlePrimary?: string;
  pillarRowTitleSecondary?: string;
  pillarReadMoreLabel?: string;
  pillarCardImages?: {
    programs?: string;
    projects?: string;
    advisory?: string;
    research?: string;
    training?: string;
    partnership?: string;
  };
};

export default async function AdminHomeSettingsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireAdminSession();
  const [home, params, work] = await Promise.all([
    getHomePageCmsForEdit(),
    searchParams,
    getMergedPageContent<HomePillarSettings & typeof workContent>("our-work", workContent as HomePillarSettings & typeof workContent),
  ]);
  const saved = params.saved === "1";
  const error = typeof params.error === "string" ? params.error : null;

  return (
    <div>
      <AdminPageHeader title="Home Settings" description="Professional editor for homepage hero, stats, stories, and spotlight." />
      {saved ? <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">Home settings updated.</div> : null}
      {error ? <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

      <HomeSettingsForm home={home} workPillars={work} saved={saved} />
    </div>
  );
}
