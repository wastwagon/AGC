import { AdminFormErrorSuspense } from "../../_components/AdminFormErrorSuspense";
import { AdminFormSuccessSuspense } from "../../_components/AdminFormSuccessSuspense";
import { AdminPageHeader } from "../../_components/AdminPageHeader";
import { ProjectForm } from "../ProjectForm";

export const dynamic = "force-dynamic";

export default function AdminProjectsNewPage() {
  return (
    <div>
      <AdminPageHeader
        title="Add project"
        description="Create a project card for the public Projects section. Order controls how it appears in lists."
      />
      <AdminFormErrorSuspense />
      <AdminFormSuccessSuspense />
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-8">
        <ProjectForm />
      </div>
    </div>
  );
}
