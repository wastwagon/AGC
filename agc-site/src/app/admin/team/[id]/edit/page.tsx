import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { AdminFormErrorSuspense } from "../../../_components/AdminFormErrorSuspense";
import { AdminFormSuccessSuspense } from "../../../_components/AdminFormSuccessSuspense";
import { AdminPageHeader } from "../../../_components/AdminPageHeader";
import { TeamForm } from "../../TeamForm";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function AdminTeamEditPage({ params }: Props) {
  const { id } = await params;
  const numId = parseInt(id, 10);
  if (isNaN(numId)) notFound();

  const item = await prisma.team.findUnique({ where: { id: numId } });
  if (!item) notFound();

  return (
    <div>
      <AdminPageHeader
        title={`Edit: ${item.name}`}
        description="Update this profile for the public Team page. Changes apply when status is published."
      />
      <AdminFormErrorSuspense />
      <AdminFormSuccessSuspense />
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-8">
        <TeamForm item={item} />
      </div>
    </div>
  );
}
