import { AdminFormErrorSuspense } from "../../_components/AdminFormErrorSuspense";
import { AdminFormSuccessSuspense } from "../../_components/AdminFormSuccessSuspense";
import { AdminPageHeader } from "../../_components/AdminPageHeader";
import { requireAdminSession } from "@/lib/require-admin";
import { AdvisoryForm } from "../AdvisoryForm";

export const dynamic = "force-dynamic";

export default async function AdminAdvisoryNewPage() {
  await requireAdminSession();
  return (
    <div>
      <AdminPageHeader
        title="Add advisory item"
        description="Create an advisory card for the public Advisory section. Order controls how it appears in lists."
      />
      <AdminFormErrorSuspense />
      <AdminFormSuccessSuspense />
      <div className="rounded-xl border border-border bg-white p-4 shadow-sm sm:p-8">
        <AdvisoryForm />
      </div>
    </div>
  );
}
