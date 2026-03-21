import { prisma } from "@/lib/db";
import { AdminFormErrorSuspense } from "../../_components/AdminFormErrorSuspense";
import { AdminFormSuccessSuspense } from "../../_components/AdminFormSuccessSuspense";
import { AdminPageHeader } from "../../_components/AdminPageHeader";
import { EventForm } from "../EventForm";

export const dynamic = "force-dynamic";

export default async function AdminEventsNewPage() {
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
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-8">
        <EventForm teamOptions={teamOptions} />
      </div>
    </div>
  );
}
