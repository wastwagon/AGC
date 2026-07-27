import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireAdminSession } from "@/lib/require-admin";
import { ClipboardList, ChevronLeft, ChevronRight, Download } from "lucide-react";
import { AdminMobileEntityCard } from "../_components/AdminMobileEntityCard";
import { AdminPageHeader } from "../_components/AdminPageHeader";
import { SUBMISSIONS_PAGE_SIZE } from "@/lib/submissions-constants";
import { DeleteButton } from "../DeleteButton";
import { deleteRegistrationOfInterest } from "./actions";
import {
  ROI_FORMS,
  ROI_REVIEW_STATUS_LABELS,
  type RoiEventType,
  type RoiReviewStatus,
} from "@/data/roi-forms";

export const dynamic = "force-dynamic";

function formatDate(d: Date) {
  return new Date(d).toLocaleDateString("en-GB", { dateStyle: "medium" });
}

function parsePage(v: string | undefined) {
  const n = parseInt(v || "1", 10);
  return Number.isFinite(n) && n >= 1 ? n : 1;
}

function isEventType(v: string | undefined): v is RoiEventType {
  return v === "apps" || v === "aypf" || v === "awpls";
}

function statusBadgeClass(status: string) {
  switch (status) {
    case "approved":
      return "bg-emerald-100 text-emerald-800";
    case "declined":
      return "bg-red-100 text-red-800";
    case "under_review":
      return "bg-amber-100 text-amber-900";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

type SearchParams = Promise<{
  event?: string;
  status?: string;
  p?: string;
  deleted?: string;
}>;

export default async function AdminRoiPage({ searchParams }: { searchParams: SearchParams }) {
  await requireAdminSession();

  const sp = await searchParams;
  const event: RoiEventType = isEventType(sp.event) ? sp.event : "apps";
  const statusFilter =
    sp.status === "pending" ||
    sp.status === "under_review" ||
    sp.status === "approved" ||
    sp.status === "declined"
      ? sp.status
      : "all";
  const page = parsePage(sp.p);

  const where = {
    eventType: event,
    ...(statusFilter !== "all" ? { reviewStatus: statusFilter } : {}),
  };

  const [total, rows, countsByEvent, statusCounts] = await Promise.all([
    prisma.registrationOfInterest.count({ where }),
    prisma.registrationOfInterest.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * SUBMISSIONS_PAGE_SIZE,
      take: SUBMISSIONS_PAGE_SIZE,
    }),
    Promise.all(
      (["apps", "aypf", "awpls"] as const).map(async (et) => ({
        eventType: et,
        count: await prisma.registrationOfInterest.count({ where: { eventType: et } }),
      }))
    ),
    Promise.all(
      (["pending", "under_review", "approved", "declined"] as const).map(async (st) => ({
        status: st,
        count: await prisma.registrationOfInterest.count({
          where: { eventType: event, reviewStatus: st },
        }),
      }))
    ),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / SUBMISSIONS_PAGE_SIZE));
  const config = ROI_FORMS[event];

  const mkHref = (opts: { event?: RoiEventType; status?: string; p?: number }) => {
    const q = new URLSearchParams();
    q.set("event", opts.event ?? event);
    const st = opts.status ?? statusFilter;
    if (st !== "all") q.set("status", st);
    if ((opts.p ?? page) > 1) q.set("p", String(opts.p ?? page));
    return `/admin/roi?${q.toString()}`;
  };

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="ROI Forms"
        description={
          <>
            Registration of Interest entries for APPS, AYPF, and AWPLS. Review status, export CSV, or open a full entry.
            Confirmation emails use each event’s SMTP inbox when configured (
            <code className="rounded bg-slate-100 px-1">SMTP_APPS_*</code>,{" "}
            <code className="rounded bg-slate-100 px-1">SMTP_AYPF_*</code>,{" "}
            <code className="rounded bg-slate-100 px-1">SMTP_AWPLS_*</code>).
          </>
        }
      />

      {sp.deleted && (
        <p className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          Entry removed.
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        {countsByEvent.map(({ eventType, count }) => {
          const active = eventType === event;
          return (
            <Link
              key={eventType}
              href={mkHref({ event: eventType, status: "all", p: 1 })}
              className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium ${
                active
                  ? "border-accent-600 bg-accent-50 text-accent-900"
                  : "border-border bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              {ROI_FORMS[eventType].shortName}
              <span className="rounded-full bg-white/80 px-2 py-0.5 text-xs">{count}</span>
            </Link>
          );
        })}
      </div>

      <section className="rounded-xl border border-border bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-4 sm:px-6">
          <div className="flex flex-wrap items-center gap-2">
            <ClipboardList className="h-5 w-5 shrink-0 text-accent-600" aria-hidden />
            <h2 className="font-semibold text-slate-900">{config.fullName}</h2>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
              {total} shown
            </span>
          </div>
          {total > 0 && (
            <a
              href={`/api/admin/roi/export?event=${event}${statusFilter !== "all" ? `&status=${statusFilter}` : ""}`}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-accent-600 hover:text-accent-700"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </a>
          )}
        </div>

        <div className="flex flex-wrap gap-2 border-b border-border px-4 py-3 sm:px-6">
          <Link
            href={mkHref({ status: "all", p: 1 })}
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              statusFilter === "all" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            All
          </Link>
          {statusCounts.map(({ status, count }) => (
            <Link
              key={status}
              href={mkHref({ status, p: 1 })}
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                statusFilter === status
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {ROI_REVIEW_STATUS_LABELS[status as RoiReviewStatus]} ({count})
            </Link>
          ))}
        </div>

        <ul className="space-y-3 p-4 md:hidden">
          {rows.map((row) => (
            <li key={row.id}>
              <AdminMobileEntityCard
                title={row.fullName}
                rows={[
                  {
                    label: "Email",
                    value: (
                      <a href={`mailto:${row.email}`} className="text-accent-600 hover:underline">
                        {row.email}
                      </a>
                    ),
                  },
                  { label: "Organisation", value: row.organisation },
                  {
                    label: "Status",
                    value: (
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${statusBadgeClass(row.reviewStatus)}`}
                      >
                        {ROI_REVIEW_STATUS_LABELS[row.reviewStatus as RoiReviewStatus] ?? row.reviewStatus}
                      </span>
                    ),
                  },
                  { label: "Date", value: formatDate(row.createdAt) },
                ]}
                actions={
                  <div className="flex gap-1">
                    <Link
                      href={`/admin/roi/${row.id}`}
                      className="flex min-h-[44px] items-center rounded-lg px-2 text-sm font-medium text-accent-600 hover:bg-slate-100"
                    >
                      Review
                    </Link>
                    <DeleteButton
                      action={deleteRegistrationOfInterest.bind(null, row.id)}
                      label="Delete entry"
                      confirmMessage="Delete this Registration of Interest permanently?"
                    />
                  </div>
                }
              />
            </li>
          ))}
        </ul>

        <div className="hidden overflow-x-auto md:block">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                  Organisation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                  Participation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Date</th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-3 text-sm font-medium text-slate-900">
                    <div>{row.fullName}</div>
                    <a href={`mailto:${row.email}`} className="text-xs text-accent-600 hover:underline">
                      {row.email}
                    </a>
                  </td>
                  <td className="px-6 py-3 text-sm text-slate-600">{row.organisation}</td>
                  <td className="px-6 py-3 text-sm text-slate-600">{row.participationType}</td>
                  <td className="px-6 py-3 text-sm">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${statusBadgeClass(row.reviewStatus)}`}
                    >
                      {ROI_REVIEW_STATUS_LABELS[row.reviewStatus as RoiReviewStatus] ?? row.reviewStatus}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm text-slate-600">{formatDate(row.createdAt)}</td>
                  <td className="px-6 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/roi/${row.id}`}
                        className="rounded-lg px-2 py-1 text-sm font-medium text-accent-600 hover:bg-slate-100"
                      >
                        Review
                      </Link>
                      <DeleteButton
                        action={deleteRegistrationOfInterest.bind(null, row.id)}
                        label="Delete entry"
                        confirmMessage="Delete this Registration of Interest permanently?"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <nav className="flex items-center gap-2 border-t border-border px-4 py-3 sm:px-6" aria-label="Pagination">
            {page > 1 ? (
              <Link
                href={mkHref({ p: page - 1 })}
                className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Link>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-sm text-slate-400">
                <ChevronLeft className="h-4 w-4" />
                Previous
              </span>
            )}
            <span className="text-sm text-slate-600">
              Page {page} of {totalPages}
            </span>
            {page < totalPages ? (
              <Link
                href={mkHref({ p: page + 1 })}
                className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Link>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-sm text-slate-400">
                Next
                <ChevronRight className="h-4 w-4" />
              </span>
            )}
          </nav>
        )}

        {rows.length === 0 && (
          <p className="px-4 py-8 text-center text-sm text-slate-500 sm:px-6">
            No Registration of Interest entries for {config.shortName} yet.
          </p>
        )}
      </section>

      <p className="text-sm text-slate-600">
        Public forms:{" "}
        <a href={ROI_FORMS.apps.path} className="text-accent-600 hover:underline" target="_blank" rel="noreferrer">
          APPS
        </a>
        {" · "}
        <a href={ROI_FORMS.aypf.path} className="text-accent-600 hover:underline" target="_blank" rel="noreferrer">
          AYPF
        </a>
        {" · "}
        <a href={ROI_FORMS.awpls.path} className="text-accent-600 hover:underline" target="_blank" rel="noreferrer">
          AWPLS
        </a>
      </p>
    </div>
  );
}
