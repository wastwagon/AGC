import { getSiteTaxonomy } from "@/lib/site-taxonomy";
import { requireAdminSession } from "@/lib/require-admin";
import { AdminFormErrorSuspense } from "../../_components/AdminFormErrorSuspense";
import { AdminFormSuccessSuspense } from "../../_components/AdminFormSuccessSuspense";
import { AdminPageHeader } from "../../_components/AdminPageHeader";
import { NewsForm } from "../NewsForm";

export const dynamic = "force-dynamic";

export default async function AdminNewsNewPage() {
  await requireAdminSession();
  const taxonomy = await getSiteTaxonomy();
  return (
    <div>
      <AdminPageHeader
        title="Add news article"
        description="Write a headline, excerpt, and body. Use Media for cover images. Pick categories from Admin → Taxonomy."
      />
      <AdminFormErrorSuspense />
      <AdminFormSuccessSuspense />
      <div className="rounded-xl border border-border bg-white p-4 shadow-sm sm:p-8">
        <NewsForm key="new" categoryOptions={taxonomy.newsCategories} tagOptions={taxonomy.newsTags} />
      </div>
    </div>
  );
}
