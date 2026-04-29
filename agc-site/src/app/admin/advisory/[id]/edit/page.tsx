import { notFound } from "next/navigation";
import { requireAdminSession } from "@/lib/require-admin";
import { AdminFormErrorSuspense } from "../../../_components/AdminFormErrorSuspense";
import { AdminFormSuccessSuspense } from "../../../_components/AdminFormSuccessSuspense";
import { AdminPageHeader } from "../../../_components/AdminPageHeader";
import { AdvisoryForm } from "../../AdvisoryForm";
import { getAdvisoryCardsForAdmin } from "../../lib";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function AdminAdvisoryEditPage({ params }: Props) {
  await requireAdminSession();
  const { id } = await params;
  const decodedId = decodeURIComponent(id);
  const items = await getAdvisoryCardsForAdmin();
  const item = items.find((x) => x.id === decodedId);
  if (!item) notFound();

  return (
    <div>
      <AdminPageHeader
        title={`Edit: ${item.title}`}
        description="Update advisory description, image, and order. Published items appear on the public site."
      />
      <AdminFormErrorSuspense />
      <AdminFormSuccessSuspense />
      <div className="rounded-xl border border-border bg-white p-4 shadow-sm sm:p-8">
        <AdvisoryForm item={item} />
      </div>
    </div>
  );
}
