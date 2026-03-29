import Link from "next/link";
import { notFound } from "next/navigation";
import { getEventBySlugAdmin } from "@/lib/content";
import { fallbackEvents } from "@/data/content";
import type { CmsEvent } from "@/lib/content";
import { prisma } from "@/lib/db";
import type { EventRegistration } from "@prisma/client";
import { Download, Mail, Printer, RotateCcw, UserPlus } from "lucide-react";
import { AdminPageHeader } from "../../_components/AdminPageHeader";
import { AdminFormErrorSuspense } from "../../_components/AdminFormErrorSuspense";
import { AdminFormSuccessSuspense } from "../../_components/AdminFormSuccessSuspense";
import {
  promoteWaitlistRegistration,
  resendEventRegistrationEmail,
  undoEventRegistrationCheckIn,
} from "../registration-actions";

type Props = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

export default async function AdminEventRegistrationsPage({ params }: Props) {
  const { slug } = await params;
  const cmsEvent = await getEventBySlugAdmin(slug);
  const events = cmsEvent ? [cmsEvent] : (fallbackEvents as CmsEvent[]);
  const event = events.find((e) => e.slug === slug);

  if (!event) notFound();

  const registrations = await prisma.eventRegistration.findMany({
    where: { eventSlug: slug },
    orderBy: { createdAt: "desc" },
  });

  const checkedInCount = registrations.filter((r: EventRegistration) => r.checkedInAt).length;

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:9200";

  return (
    <div>
      <AdminFormErrorSuspense />
      <AdminFormSuccessSuspense />
      <AdminPageHeader
        title={event.title}
        description={
          <>
            <p>
              Registrations for this event. {checkedInCount} of {registrations.length} checked in. Export CSV for
              spreadsheets or open a badge to print.
            </p>
            <p className="mt-2">
              <Link
                href={`/admin/events/scan?event=${encodeURIComponent(slug)}`}
                className="font-medium text-accent-600 underline decoration-accent-300 underline-offset-2 hover:text-accent-800"
              >
                Open check-in scanner (this event only)
              </Link>
            </p>
          </>
        }
      />

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                  Organization
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                  Registration ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {registrations.map((r: EventRegistration) => (
                <tr key={r.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">{r.fullName}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{r.email}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{r.organization || "—"}</td>
                  <td className="px-6 py-4 font-mono text-sm text-slate-600">{r.registrationId}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      {r.waitlisted ? (
                        <span className="inline-flex w-fit rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-900">
                          Waitlist
                        </span>
                      ) : null}
                      {r.checkedInAt ? (
                        <span className="inline-flex w-fit rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                          Checked in
                        </span>
                      ) : (
                        <span className="inline-flex w-fit rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                          {r.waitlisted ? "Not confirmed" : "Pending"}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-2">
                      <a
                        href={`${baseUrl}/events/badge/${r.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-accent-600 hover:text-accent-700"
                      >
                        <Printer className="h-4 w-4" />
                        Print badge
                      </a>
                      <form action={resendEventRegistrationEmail}>
                        <input type="hidden" name="id" value={r.id} />
                        <button
                          type="submit"
                          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900"
                        >
                          <Mail className="h-4 w-4" aria-hidden />
                          Resend email
                        </button>
                      </form>
                      {r.checkedInAt ? (
                        <form action={undoEventRegistrationCheckIn}>
                          <input type="hidden" name="id" value={r.id} />
                          <button
                            type="submit"
                            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-orange-800"
                          >
                            <RotateCcw className="h-4 w-4" aria-hidden />
                            Undo check-in
                          </button>
                        </form>
                      ) : null}
                      {r.waitlisted ? (
                        <form action={promoteWaitlistRegistration}>
                          <input type="hidden" name="id" value={r.id} />
                          <button
                            type="submit"
                            className="inline-flex items-center gap-1.5 text-sm font-medium text-accent-600 hover:text-accent-800"
                          >
                            <UserPlus className="h-4 w-4" aria-hidden />
                            Promote from waitlist
                          </button>
                        </form>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {registrations.length > 0 && (
        <div className="mt-6">
          <a
            href={`/api/events/registrations/export?eventSlug=${slug}`}
            className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </a>
        </div>
      )}

      {registrations.length === 0 && (
        <div className="mt-8 rounded-xl border border-slate-200 bg-white p-12 text-center text-slate-500">
          No registrations yet for this event.
        </div>
      )}
    </div>
  );
}
