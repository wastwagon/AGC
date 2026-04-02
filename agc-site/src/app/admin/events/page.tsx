import Link from "next/link";
import { prisma } from "@/lib/db";
import { Calendar, Users, QrCode, Plus, Pencil } from "lucide-react";
import { AdminPageHeader } from "../_components/AdminPageHeader";
import { AdminFormErrorSuspense } from "../_components/AdminFormErrorSuspense";
import { AdminFormSuccessSuspense } from "../_components/AdminFormSuccessSuspense";
import { DeleteButton } from "../DeleteButton";
import { deleteEvent } from "./actions";
import { requireAdminSession } from "@/lib/require-admin";

export const dynamic = "force-dynamic";

export default async function AdminEventsPage() {
  await requireAdminSession();
  const dbEvents = await prisma.event.findMany({
    orderBy: { startDate: "desc" },
  });
  const slugs = dbEvents.map((e) => e.slug).filter(Boolean) as string[];

  let countMap: Record<string, number> = {};
  let confirmedMap: Record<string, number> = {};
  let waitlistMap: Record<string, number> = {};
  let checkedInMap: Record<string, number> = {};

  if (slugs.length > 0) {
    const [counts, confirmedOnly, waitlistOnly, checkedInCounts] = await Promise.all([
      prisma.eventRegistration.groupBy({
        by: ["eventSlug"],
        where: { eventSlug: { in: slugs } },
        _count: { id: true },
      }),
      prisma.eventRegistration.groupBy({
        by: ["eventSlug"],
        where: { eventSlug: { in: slugs }, waitlisted: false },
        _count: { id: true },
      }),
      prisma.eventRegistration.groupBy({
        by: ["eventSlug"],
        where: { eventSlug: { in: slugs }, waitlisted: true },
        _count: { id: true },
      }),
      prisma.eventRegistration.groupBy({
        by: ["eventSlug"],
        where: { eventSlug: { in: slugs }, checkedInAt: { not: null } },
        _count: { id: true },
      }),
    ]);
    countMap = Object.fromEntries(counts.map((c) => [c.eventSlug, c._count.id]));
    confirmedMap = Object.fromEntries(confirmedOnly.map((c) => [c.eventSlug, c._count.id]));
    waitlistMap = Object.fromEntries(waitlistOnly.map((c) => [c.eventSlug, c._count.id]));
    checkedInMap = Object.fromEntries(checkedInCounts.map((c) => [c.eventSlug, c._count.id]));
  }

  return (
    <div>
      <AdminPageHeader
        title="Event Management"
        description="Create events, manage registrations, and check in attendees. Open the scanner to verify badges at the door."
      >
        <Link
          href="/admin/events/new"
          className="flex min-h-[44px] items-center gap-2 rounded-lg bg-accent-500 px-4 py-3 font-medium text-white hover:bg-accent-600"
        >
          <Plus className="h-4 w-4" />
          Add Event
        </Link>
        <Link
          href="/admin/events/scan"
          className="flex min-h-[44px] items-center gap-2 rounded-lg bg-slate-100 px-4 py-3 font-medium text-slate-700 hover:bg-slate-200"
        >
          <QrCode className="h-4 w-4" />
          Check-in Scanner
        </Link>
      </AdminPageHeader>
      <AdminFormErrorSuspense />
      <AdminFormSuccessSuspense />

      <div className="space-y-4">
        {dbEvents.map((event) => {
          const slug = event.slug;
          const total = slug ? countMap[slug] ?? 0 : 0;
          const confirmed = slug ? confirmedMap[slug] ?? 0 : 0;
          const waitlist = slug ? waitlistMap[slug] ?? 0 : 0;
          const checkedIn = slug ? checkedInMap[slug] ?? 0 : 0;

          return (
            <div
              key={event.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div>
                <h2 className="font-serif text-lg font-bold text-slate-900">{event.title}</h2>
                <p className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                  <Calendar className="h-4 w-4" />
                  {event.startDate.toLocaleDateString("en-GB", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                  {event.location && ` • ${event.location}`}
                </p>
                <span
                  className={`mt-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    event.status === "published" ? "bg-green-100 text-green-800" : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {event.status}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/events/edit/${event.id}`}
                  className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  aria-label="Edit"
                >
                  <Pencil className="h-4 w-4" />
                </Link>
                <DeleteButton action={deleteEvent.bind(null, event.id)} label="Delete event" confirmMessage="Delete this event and all its registrations? This cannot be undone." />
                <div className="flex items-center gap-2 text-slate-600">
                  <Users className="h-4 w-4" />
                  <span className="text-sm">
                    {checkedIn}/{confirmed > 0 ? confirmed : total || "—"} checked in
                    {slug && total > 0 ? (
                      <span className="text-slate-500">
                        {" "}
                        · {confirmed} confirmed
                        {waitlist > 0 ? ` · ${waitlist} waitlist` : ""}
                      </span>
                    ) : null}
                  </span>
                </div>
                {slug && (
                  <>
                    <Link
                      href={`/admin/events/scan?event=${encodeURIComponent(slug)}`}
                      className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                      <QrCode className="h-4 w-4 shrink-0" aria-hidden />
                      Scan this event
                    </Link>
                    <Link
                      href={`/admin/events/${slug}`}
                      className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
                    >
                      View Registrations
                    </Link>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {dbEvents.length === 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center text-slate-500">
          No events found.
        </div>
      )}
    </div>
  );
}
