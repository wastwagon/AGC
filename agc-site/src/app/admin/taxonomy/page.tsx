import { AdminFormErrorSuspense } from "../_components/AdminFormErrorSuspense";
import { AdminFormSuccessSuspense } from "../_components/AdminFormSuccessSuspense";
import { AdminPageHeader } from "../_components/AdminPageHeader";
import { formatTaxonomyLines, getSiteTaxonomy } from "@/lib/site-taxonomy";
import { requireAdminSession } from "@/lib/require-admin";
import { saveSiteTaxonomy } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminTaxonomyPage() {
  await requireAdminSession();
  const taxonomy = await getSiteTaxonomy();
  const newsCategories = formatTaxonomyLines(taxonomy.newsCategories);
  const publicationTypes = formatTaxonomyLines(taxonomy.publicationTypes);

  return (
    <div>
      <AdminPageHeader
        title="Taxonomy"
        description={
          <>
            Define <strong>news categories</strong> and <strong>publication types</strong> used as checklists when creating content. One option per line:{" "}
            <code className="rounded bg-slate-100 px-1">slug | label</code> or{" "}
            <code className="rounded bg-slate-100 px-1">slug | label | description</code>. Slugs are normalized (lowercase, hyphens).
          </>
        }
      />
      <AdminFormErrorSuspense />
      <AdminFormSuccessSuspense />

      <form action={saveSiteTaxonomy} className="space-y-8 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-8">
        <div>
          <label htmlFor="newsCategories" className="block text-sm font-medium text-slate-700">
            News categories
          </label>
          <textarea
            id="newsCategories"
            name="newsCategories"
            rows={12}
            defaultValue={newsCategories}
            className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm text-slate-900"
            spellCheck={false}
          />
          <p className="mt-1 text-xs text-slate-500">Editors pick from this list when adding or editing news (multiple allowed).</p>
        </div>

        <div>
          <label htmlFor="publicationTypes" className="block text-sm font-medium text-slate-700">
            Publication types
          </label>
          <textarea
            id="publicationTypes"
            name="publicationTypes"
            rows={10}
            defaultValue={publicationTypes}
            className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm text-slate-900"
            spellCheck={false}
          />
          <p className="mt-1 text-xs text-slate-500">Editors pick from this list when adding publications (multiple allowed).</p>
        </div>

        <button
          type="submit"
          className="rounded-lg bg-accent-500 px-6 py-2.5 font-medium text-white hover:bg-accent-600"
        >
          Save taxonomy
        </button>
      </form>
    </div>
  );
}
