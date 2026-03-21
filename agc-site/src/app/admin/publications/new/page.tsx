import { AdminFormErrorSuspense } from "../../_components/AdminFormErrorSuspense";
import { AdminFormSuccessSuspense } from "../../_components/AdminFormSuccessSuspense";
import { AdminPageHeader } from "../../_components/AdminPageHeader";
import { PublicationForm } from "../PublicationForm";

export const dynamic = "force-dynamic";

export default function AdminPublicationsNewPage() {
  return (
    <div>
      <AdminPageHeader
        title="Add publication"
        description="Add a report, policy brief, or other publication. Link cover image and file URLs from Media when available."
      />
      <AdminFormErrorSuspense />
      <AdminFormSuccessSuspense />
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-8">
        <PublicationForm />
      </div>
    </div>
  );
}
