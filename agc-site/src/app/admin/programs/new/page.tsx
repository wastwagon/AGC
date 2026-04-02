import { AdminFormErrorSuspense } from "../../_components/AdminFormErrorSuspense";
import { AdminFormSuccessSuspense } from "../../_components/AdminFormSuccessSuspense";
import { AdminPageHeader } from "../../_components/AdminPageHeader";
import { requireAdminSession } from "@/lib/require-admin";
import { ProgramForm } from "../ProgramForm";

export const dynamic = "force-dynamic";

export default async function AdminProgramsNewPage() {
  await requireAdminSession();
  return (
    <div>
      <AdminPageHeader
        title="Add program"
        description="Create a program card for the public Programs section. Order controls how it appears in lists."
      />
      <AdminFormErrorSuspense />
      <AdminFormSuccessSuspense />
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-8">
        <ProgramForm />
      </div>
    </div>
  );
}
