import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { Mail, UserPlus, MessageSquare, Handshake, ChevronLeft, ChevronRight, Download } from "lucide-react";
import { AdminMobileEntityCard } from "../_components/AdminMobileEntityCard";
import { AdminPageHeader } from "../_components/AdminPageHeader";
import { SUBMISSIONS_PAGE_SIZE } from "@/lib/submissions-constants";
import { DeleteButton } from "../DeleteButton";
import {
  deleteContactSubmission,
  deleteNewsletterSignup,
  deleteVolunteerApplication,
  deletePartnershipInquiry,
} from "./actions";

export const dynamic = "force-dynamic";

function formatDate(d: Date) {
  return new Date(d).toLocaleDateString("en-GB", { dateStyle: "medium" });
}

function parsePage(v: string | undefined) {
  const n = parseInt(v || "1", 10);
  return Number.isFinite(n) && n >= 1 ? n : 1;
}

function Pager({
  page,
  totalPages,
  param,
  otherParams,
}: {
  page: number;
  totalPages: number;
  param: string;
  otherParams: Record<string, string>;
}) {
  if (totalPages <= 1) return null;
  const mk = (p: number) => {
    const q = new URLSearchParams(otherParams);
    q.set(param, String(p));
    return `/admin/submissions?${q.toString()}`;
  };
  return (
    <nav className="flex items-center gap-2 border-t border-slate-200 px-4 py-3 sm:px-6" aria-label="Pagination">
      {page > 1 ? (
        <Link
          href={mk(page - 1)}
          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Link>
      ) : (
        <span className="inline-flex items-center gap-1 rounded-lg border border-slate-100 px-3 py-1.5 text-sm text-slate-400">
          <ChevronLeft className="h-4 w-4" />
          Previous
        </span>
      )}
      <span className="text-sm text-slate-600">
        Page {page} of {totalPages}
      </span>
      {page < totalPages ? (
        <Link
          href={mk(page + 1)}
          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Link>
      ) : (
        <span className="inline-flex items-center gap-1 rounded-lg border border-slate-100 px-3 py-1.5 text-sm text-slate-400">
          Next
          <ChevronRight className="h-4 w-4" />
        </span>
      )}
    </nav>
  );
}

const typeLabels: Record<string, string> = {
  volunteer: "Volunteer",
  staff: "Staff",
  fellow: "Fellow",
};

type SearchParams = Promise<{
  np?: string;
  cp?: string;
  ap?: string;
  pp?: string;
  deleted?: string;
}>;

export default async function AdminSubmissionsPage({ searchParams }: { searchParams: SearchParams }) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const sp = await searchParams;
  const np = parsePage(sp.np);
  const cp = parsePage(sp.cp);
  const ap = parsePage(sp.ap);
  const pp = parsePage(sp.pp);

  const [
    newsletterCount,
    contactCount,
    applicationCount,
    partnershipCount,
    newsletter,
    contact,
    applications,
    partnerships,
  ] = await Promise.all([
    prisma.newsletterSignup.count(),
    prisma.contactSubmission.count(),
    prisma.volunteerApplication.count(),
    prisma.partnershipInquiry.count(),
    prisma.newsletterSignup.findMany({
      orderBy: { createdAt: "desc" },
      skip: (np - 1) * SUBMISSIONS_PAGE_SIZE,
      take: SUBMISSIONS_PAGE_SIZE,
    }),
    prisma.contactSubmission.findMany({
      orderBy: { createdAt: "desc" },
      skip: (cp - 1) * SUBMISSIONS_PAGE_SIZE,
      take: SUBMISSIONS_PAGE_SIZE,
    }),
    prisma.volunteerApplication.findMany({
      orderBy: { createdAt: "desc" },
      skip: (ap - 1) * SUBMISSIONS_PAGE_SIZE,
      take: SUBMISSIONS_PAGE_SIZE,
    }),
    prisma.partnershipInquiry.findMany({
      orderBy: { createdAt: "desc" },
      skip: (pp - 1) * SUBMISSIONS_PAGE_SIZE,
      take: SUBMISSIONS_PAGE_SIZE,
    }),
  ]);

  const nPages = Math.max(1, Math.ceil(newsletterCount / SUBMISSIONS_PAGE_SIZE));
  const cPages = Math.max(1, Math.ceil(contactCount / SUBMISSIONS_PAGE_SIZE));
  const aPages = Math.max(1, Math.ceil(applicationCount / SUBMISSIONS_PAGE_SIZE));
  const pPages = Math.max(1, Math.ceil(partnershipCount / SUBMISSIONS_PAGE_SIZE));

  const baseQ = {
    np: String(np),
    cp: String(cp),
    ap: String(ap),
    pp: String(pp),
  };

  const deletedKind = sp.deleted;

  return (
    <div className="space-y-10">
      <AdminPageHeader
        title="Submissions"
        description={
          <>
            Newsletter, applications, contact messages, and partnership inquiries. Notifications use Resend when{" "}
            <code className="rounded bg-slate-100 px-1">RESEND_API_KEY</code> is set; records are always stored first.
            Export CSV for archives. Delete entries here for retention — there is no automatic expiry.
          </>
        }
      />

      {deletedKind && (
        <p className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          Entry removed ({deletedKind}).
        </p>
      )}

      {/* Newsletter */}
      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 px-4 py-4 sm:px-6">
          <div className="flex flex-wrap items-center gap-2">
            <Mail className="h-5 w-5 shrink-0 text-accent-600" aria-hidden />
            <h2 className="font-semibold text-slate-900">Newsletter signups</h2>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
              {newsletterCount} total
            </span>
          </div>
          {newsletterCount > 0 && (
            <a
              href="/api/admin/submissions/export?type=newsletter"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-accent-600 hover:text-accent-700"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </a>
          )}
        </div>

        <ul className="space-y-2 p-4 md:hidden">
          {newsletter.map((row) => (
            <li key={row.id}>
              <AdminMobileEntityCard
                title={row.email}
                rows={[{ label: "Signed up", value: formatDate(row.createdAt) }]}
                actions={
                  <DeleteButton
                    action={deleteNewsletterSignup.bind(null, row.id)}
                    label="Delete subscriber"
                    confirmMessage="Remove this newsletter signup?"
                  />
                }
              />
            </li>
          ))}
        </ul>

        <div className="hidden overflow-x-auto md:block">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Signed up</th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {newsletter.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-3 text-sm text-slate-900">{row.email}</td>
                  <td className="px-6 py-3 text-sm text-slate-600">{formatDate(row.createdAt)}</td>
                  <td className="px-6 py-3 text-right">
                    <DeleteButton
                      action={deleteNewsletterSignup.bind(null, row.id)}
                      label="Delete subscriber"
                      confirmMessage="Remove this newsletter signup?"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pager page={np} totalPages={nPages} param="np" otherParams={baseQ} />
        {newsletter.length === 0 && (
          <p className="px-4 py-8 text-center text-sm text-slate-500 sm:px-6">No newsletter signups yet.</p>
        )}
      </section>

      {/* Applications */}
      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 px-4 py-4 sm:px-6">
          <div className="flex flex-wrap items-center gap-2">
            <UserPlus className="h-5 w-5 shrink-0 text-accent-600" aria-hidden />
            <h2 className="font-semibold text-slate-900">Applications</h2>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
              {applicationCount} total
            </span>
          </div>
          {applicationCount > 0 && (
            <a
              href="/api/admin/submissions/export?type=application"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-accent-600 hover:text-accent-700"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </a>
          )}
        </div>

        <ul className="space-y-3 p-4 md:hidden">
          {applications.map((row) => (
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
                  { label: "Type", value: typeLabels[row.applicationType] ?? row.applicationType },
                  { label: "Organization", value: row.organization ?? "—" },
                  { label: "Date", value: formatDate(row.createdAt) },
                ]}
                actions={
                  <div className="flex gap-1">
                    <Link
                      href={`/admin/submissions/application/${row.id}`}
                      className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg p-2 text-sm font-medium text-accent-600 hover:bg-slate-100"
                    >
                      View
                    </Link>
                    <DeleteButton
                      action={deleteVolunteerApplication.bind(null, row.id)}
                      label="Delete application"
                      confirmMessage="Delete this application permanently?"
                    />
                  </div>
                }
              />
            </li>
          ))}
        </ul>

        <div className="hidden overflow-x-auto md:block">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Organization</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Date</th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {applications.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-3 text-sm font-medium text-slate-900">{row.fullName}</td>
                  <td className="px-6 py-3 text-sm text-slate-600">{typeLabels[row.applicationType] ?? row.applicationType}</td>
                  <td className="px-6 py-3 text-sm text-slate-700">
                    <a href={`mailto:${row.email}`} className="text-accent-600 hover:underline">
                      {row.email}
                    </a>
                  </td>
                  <td className="px-6 py-3 text-sm text-slate-600">{row.organization ?? "—"}</td>
                  <td className="px-6 py-3 text-sm text-slate-600">{formatDate(row.createdAt)}</td>
                  <td className="px-6 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/submissions/application/${row.id}`}
                        className="rounded-lg px-2 py-1 text-sm font-medium text-accent-600 hover:bg-slate-100"
                      >
                        View
                      </Link>
                      <DeleteButton
                        action={deleteVolunteerApplication.bind(null, row.id)}
                        label="Delete application"
                        confirmMessage="Delete this application permanently?"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pager page={ap} totalPages={aPages} param="ap" otherParams={baseQ} />
        {applications.length === 0 && (
          <p className="px-4 py-8 text-center text-sm text-slate-500 sm:px-6">No applications yet.</p>
        )}
      </section>

      {/* Partnership */}
      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 px-4 py-4 sm:px-6">
          <div className="flex flex-wrap items-center gap-2">
            <Handshake className="h-5 w-5 shrink-0 text-accent-600" aria-hidden />
            <h2 className="font-semibold text-slate-900">Partnership inquiries</h2>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
              {partnershipCount} total
            </span>
          </div>
          {partnershipCount > 0 && (
            <a
              href="/api/admin/submissions/export?type=partnership"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-accent-600 hover:text-accent-700"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </a>
          )}
        </div>

        <ul className="space-y-3 p-4 md:hidden">
          {partnerships.map((row) => (
            <li key={row.id}>
              <AdminMobileEntityCard
                title={row.name}
                rows={[
                  {
                    label: "Email",
                    value: (
                      <a href={`mailto:${row.email}`} className="text-accent-600 hover:underline">
                        {row.email}
                      </a>
                    ),
                  },
                  { label: "Organization", value: row.organization ?? "—" },
                  { label: "Date", value: formatDate(row.createdAt) },
                ]}
                actions={
                  <div className="flex gap-1">
                    <Link
                      href={`/admin/submissions/partnership/${row.id}`}
                      className="flex min-h-[44px] items-center rounded-lg px-2 text-sm font-medium text-accent-600 hover:bg-slate-100"
                    >
                      View
                    </Link>
                    <DeleteButton
                      action={deletePartnershipInquiry.bind(null, row.id)}
                      label="Delete inquiry"
                      confirmMessage="Delete this inquiry permanently?"
                    />
                  </div>
                }
              />
            </li>
          ))}
        </ul>

        <div className="hidden overflow-x-auto md:block">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Organization</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Date</th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {partnerships.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-3 text-sm font-medium text-slate-900">{row.name}</td>
                  <td className="px-6 py-3 text-sm text-slate-700">
                    <a href={`mailto:${row.email}`} className="text-accent-600 hover:underline">
                      {row.email}
                    </a>
                  </td>
                  <td className="px-6 py-3 text-sm text-slate-600">{row.organization ?? "—"}</td>
                  <td className="px-6 py-3 text-sm text-slate-600">{formatDate(row.createdAt)}</td>
                  <td className="px-6 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/submissions/partnership/${row.id}`}
                        className="rounded-lg px-2 py-1 text-sm font-medium text-accent-600 hover:bg-slate-100"
                      >
                        View
                      </Link>
                      <DeleteButton
                        action={deletePartnershipInquiry.bind(null, row.id)}
                        label="Delete inquiry"
                        confirmMessage="Delete this inquiry permanently?"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pager page={pp} totalPages={pPages} param="pp" otherParams={baseQ} />
        {partnerships.length === 0 && (
          <p className="px-4 py-8 text-center text-sm text-slate-500 sm:px-6">No partnership inquiries yet.</p>
        )}
      </section>

      {/* Contact */}
      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 px-4 py-4 sm:px-6">
          <div className="flex flex-wrap items-center gap-2">
            <MessageSquare className="h-5 w-5 shrink-0 text-accent-600" aria-hidden />
            <h2 className="font-semibold text-slate-900">Contact form</h2>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
              {contactCount} total
            </span>
          </div>
          {contactCount > 0 && (
            <a
              href="/api/admin/submissions/export?type=contact"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-accent-600 hover:text-accent-700"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </a>
          )}
        </div>

        <ul className="space-y-3 p-4 md:hidden">
          {contact.map((row) => (
            <li key={row.id}>
              <AdminMobileEntityCard
                title={row.name}
                rows={[
                  {
                    label: "Email",
                    value: (
                      <a href={`mailto:${row.email}`} className="text-accent-600 hover:underline">
                        {row.email}
                      </a>
                    ),
                  },
                  { label: "Subject", value: row.subject ?? "—" },
                  { label: "Date", value: formatDate(row.createdAt) },
                ]}
                actions={
                  <div className="flex gap-1">
                    <Link
                      href={`/admin/submissions/contact/${row.id}`}
                      className="flex min-h-[44px] items-center rounded-lg px-2 text-sm font-medium text-accent-600 hover:bg-slate-100"
                    >
                      View
                    </Link>
                    <DeleteButton
                      action={deleteContactSubmission.bind(null, row.id)}
                      label="Delete message"
                      confirmMessage="Delete this contact submission permanently?"
                    />
                  </div>
                }
              />
            </li>
          ))}
        </ul>

        <div className="hidden overflow-x-auto md:block">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Date</th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {contact.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-3 text-sm font-medium text-slate-900">{row.name}</td>
                  <td className="px-6 py-3 text-sm text-slate-700">
                    <a href={`mailto:${row.email}`} className="text-accent-600 hover:underline">
                      {row.email}
                    </a>
                  </td>
                  <td className="max-w-[200px] truncate px-6 py-3 text-sm text-slate-600" title={row.subject ?? undefined}>
                    {row.subject ?? "—"}
                  </td>
                  <td className="px-6 py-3 text-sm text-slate-600">{formatDate(row.createdAt)}</td>
                  <td className="px-6 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/submissions/contact/${row.id}`}
                        className="rounded-lg px-2 py-1 text-sm font-medium text-accent-600 hover:bg-slate-100"
                      >
                        View
                      </Link>
                      <DeleteButton
                        action={deleteContactSubmission.bind(null, row.id)}
                        label="Delete message"
                        confirmMessage="Delete this contact submission permanently?"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pager page={cp} totalPages={cPages} param="cp" otherParams={baseQ} />
        {contact.length === 0 && (
          <p className="px-4 py-8 text-center text-sm text-slate-500 sm:px-6">No contact submissions yet.</p>
        )}
      </section>
    </div>
  );
}
