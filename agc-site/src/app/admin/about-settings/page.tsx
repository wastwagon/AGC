import { aboutContent } from "@/data/content";
import { cmsStaticOrEmpty, getMergedPageContent } from "@/lib/page-content";
import { AdminPageHeader } from "../_components/AdminPageHeader";
import { AboutSettingsForm } from "./AboutSettingsForm";

export const dynamic = "force-dynamic";

export default async function AdminAboutSettingsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [content, params] = await Promise.all([
    getMergedPageContent<typeof aboutContent>("about", cmsStaticOrEmpty(aboutContent)),
    searchParams,
  ]);
  const c = content as typeof aboutContent & { heroImage?: string; sectionImage?: string };
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
