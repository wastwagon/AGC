import { AdminFormErrorSuspense } from "../../_components/AdminFormErrorSuspense";
import { AdminFormSuccessSuspense } from "../../_components/AdminFormSuccessSuspense";
import { AdminPageHeader } from "../../_components/AdminPageHeader";
import { requireAdminSession } from "@/lib/require-admin";
import { ProjectForm } from "../ProjectForm";

export const dynamic = "force-dynamic";

export default async function AdminProjectsNewPage() {
  await requireAdminSession();
  return (
    <div>
      <AdminPageHeader
        title="Add project"
        description="Create a project card for the public Projects section. Order controls how it appears in lists."
      />
      <AdminFormErrorSuspense />
      <AdminFormSuccessSuspense />
      <div className="rounded-xl border border-border bg-white p-4 shadow-sm sm:p-8">
        <ProjectForm />
      </div>
    </div>
  );
}
