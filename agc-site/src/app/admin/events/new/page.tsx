import { prisma } from "@/lib/db";
import { requireAdminSession } from "@/lib/require-admin";
import { AdminFormErrorSuspense } from "../../_components/AdminFormErrorSuspense";
import { AdminFormSuccessSuspense } from "../../_components/AdminFormSuccessSuspense";
import { AdminPageHeader } from "../../_components/AdminPageHeader";
import { EventForm } from "../EventForm";

export const dynamic = "force-dynamic";

export default async function AdminEventsNewPage() {
  await requireAdminSession();
  const teamOptions = await prisma.team.findMany({
    orderBy: [{ order: "asc" }, { id: "asc" }],
    select: { id: true, name: true },
  });

  return (
    <div>
      <AdminPageHeader
        title="Add event"
        description="Create an event, set registration limits, and add an agenda or speakers for the public registration page."
      />
      <AdminFormErrorSuspense />
      <AdminFormSuccessSuspense />
      <div className="rounded-xl border border-border bg-white p-4 shadow-sm sm:p-8">
        <EventForm teamOptions={teamOptions} />
      </div>
    </div>
  );
}
