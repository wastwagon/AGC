import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdminSession } from "@/lib/require-admin";
import { AdminFormErrorSuspense } from "../../../_components/AdminFormErrorSuspense";
import { AdminFormSuccessSuspense } from "../../../_components/AdminFormSuccessSuspense";
import { AdminPageHeader } from "../../../_components/AdminPageHeader";
import { EventForm } from "../../EventForm";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function AdminEventsEditPage({ params }: Props) {
  await requireAdminSession();
  const { id } = await params;
  const numId = parseInt(id, 10);
  if (isNaN(numId)) notFound();

  const [item, teamOptions] = await Promise.all([
    prisma.event.findUnique({ where: { id: numId } }),
    prisma.team.findMany({
      orderBy: [{ order: "asc" }, { id: "asc" }],
      select: { id: true, name: true },
    }),
  ]);

  if (!item) notFound();

  return (
    <div>
      <AdminPageHeader
        title={`Edit: ${item.title}`}
        description="Update event details, agenda, and featured speakers. Changes apply to the public registration page when status is published."
      />
      <AdminFormErrorSuspense />
      <AdminFormSuccessSuspense />
      <div className="rounded-xl border border-border bg-white p-4 shadow-sm sm:p-8">
        <EventForm teamOptions={teamOptions} item={item} />
      </div>
    </div>
  );
}
