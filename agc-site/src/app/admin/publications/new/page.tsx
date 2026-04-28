import { getSiteTaxonomy } from "@/lib/site-taxonomy";
import { requireAdminSession } from "@/lib/require-admin";
import { AdminFormErrorSuspense } from "../../_components/AdminFormErrorSuspense";
import { AdminFormSuccessSuspense } from "../../_components/AdminFormSuccessSuspense";
import { AdminPageHeader } from "../../_components/AdminPageHeader";
import { PublicationForm } from "../PublicationForm";

export const dynamic = "force-dynamic";

export default async function AdminPublicationsNewPage() {
  await requireAdminSession();
  const taxonomy = await getSiteTaxonomy();
  return (
    <div>
      <AdminPageHeader
        title="Add publication"
        description="Add a report, policy brief, or other publication. Choose types from Admin → Taxonomy; link files and images from Media."
      />
      <AdminFormErrorSuspense />
      <AdminFormSuccessSuspense />
      <div className="rounded-xl border border-border bg-white p-4 shadow-sm sm:p-8">
        <PublicationForm typeOptions={taxonomy.publicationTypes} />
      </div>
    </div>
  );
}
