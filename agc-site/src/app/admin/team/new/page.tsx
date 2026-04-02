import { AdminFormErrorSuspense } from "../../_components/AdminFormErrorSuspense";
import { AdminFormSuccessSuspense } from "../../_components/AdminFormSuccessSuspense";
import { AdminPageHeader } from "../../_components/AdminPageHeader";
import { requireAdminSession } from "@/lib/require-admin";
import { TeamForm } from "../TeamForm";

export const dynamic = "force-dynamic";

export default async function AdminTeamNewPage() {
  await requireAdminSession();
  return (
    <div>
      <AdminPageHeader
        title="Add team member"
        description="Create a profile for the public Team page. Set display order, photo, and draft or published status."
      />
      <AdminFormErrorSuspense />
      <AdminFormSuccessSuspense />
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-8">
        <TeamForm />
      </div>
    </div>
  );
}
