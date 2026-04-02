import { AdminFormErrorSuspense } from "../../_components/AdminFormErrorSuspense";
import { AdminFormSuccessSuspense } from "../../_components/AdminFormSuccessSuspense";
import { AdminPageHeader } from "../../_components/AdminPageHeader";
import { requireAdminSession } from "@/lib/require-admin";
import { PartnerForm } from "../PartnerForm";

export const dynamic = "force-dynamic";

export default async function AdminPartnersNewPage() {
  await requireAdminSession();
  return (
    <div>
      <AdminPageHeader
        title="Add partner"
        description="Add a partner name, logo URL, and link. Order affects the partner strip on the home page."
      />
      <AdminFormErrorSuspense />
      <AdminFormSuccessSuspense />
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-8">
        <PartnerForm />
      </div>
    </div>
  );
}
