import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { AdminFormErrorSuspense } from "../../../_components/AdminFormErrorSuspense";
import { AdminFormSuccessSuspense } from "../../../_components/AdminFormSuccessSuspense";
import { AdminPageHeader } from "../../../_components/AdminPageHeader";
import { ProgramForm } from "../../ProgramForm";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function AdminProgramsEditPage({ params }: Props) {
  const { id } = await params;
  const numId = parseInt(id, 10);
  if (isNaN(numId)) notFound();

  const item = await prisma.program.findUnique({ where: { id: numId } });
  if (!item) notFound();

  return (
    <div>
      <AdminPageHeader
        title={`Edit: ${item.title}`}
        description="Update the program description, image, and order. Published programs appear on the public site."
      />
      <AdminFormErrorSuspense />
      <AdminFormSuccessSuspense />
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-8">
        <ProgramForm item={item} />
      </div>
    </div>
  );
}
