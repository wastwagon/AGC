import { AdminFormErrorSuspense } from "../../_components/AdminFormErrorSuspense";
import { AdminFormSuccessSuspense } from "../../_components/AdminFormSuccessSuspense";
import { AdminPageHeader } from "../../_components/AdminPageHeader";
import { NewsForm } from "../NewsForm";

export const dynamic = "force-dynamic";

export default function AdminNewsNewPage() {
  return (
    <div>
      <AdminPageHeader
        title="Add news article"
        description="Write a headline, excerpt, and body. Use Media for cover images and set publish date when ready."
      />
      <AdminFormErrorSuspense />
      <AdminFormSuccessSuspense />
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-8">
        <NewsForm />
      </div>
    </div>
  );
}
