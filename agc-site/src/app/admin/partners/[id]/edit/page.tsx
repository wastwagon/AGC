import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdminSession } from "@/lib/require-admin";
import { AdminFormErrorSuspense } from "../../../_components/AdminFormErrorSuspense";
import { AdminFormSuccessSuspense } from "../../../_components/AdminFormSuccessSuspense";
import { AdminPageHeader } from "../../../_components/AdminPageHeader";
import { PartnerForm } from "../../PartnerForm";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function AdminPartnersEditPage({ params }: Props) {
  await requireAdminSession();
  const { id } = await params;
  const numId = parseInt(id, 10);
  if (isNaN(numId)) notFound();

  const item = await prisma.partner.findUnique({ where: { id: numId } });
  if (!item) notFound();

  return (
    <div>
      <AdminPageHeader
        title={`Edit: ${item.name}`}
        description="Update this partner’s logo URL and link. Order controls placement on the home partner strip."
      />
      <AdminFormErrorSuspense />
      <AdminFormSuccessSuspense />
      <div className="rounded-xl border border-border bg-white p-4 shadow-sm sm:p-8">
        <PartnerForm item={item} />
      </div>
    </div>
  );
}
