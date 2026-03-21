import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { Mail, UserPlus, MessageSquare } from "lucide-react";
import { AdminMobileEntityCard } from "../_components/AdminMobileEntityCard";
import { AdminPageHeader } from "../_components/AdminPageHeader";

export const dynamic = "force-dynamic";

function formatDate(d: Date) {
  return new Date(d).toLocaleDateString("en-GB", { dateStyle: "medium" });
}

export default async function AdminSubmissionsPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const [newsletter, applications, contact] = await Promise.all([
    prisma.newsletterSignup.findMany({ orderBy: { createdAt: "desc" }, take: 100 }),
    prisma.volunteerApplication.findMany({ orderBy: { createdAt: "desc" }, take: 50 }),
    prisma.contactSubmission.findMany({ orderBy: { createdAt: "desc" }, take: 50 }),
  ]);

  return (
    <div className="space-y-10">
      <AdminPageHeader
        title="Submissions"
        description="Newsletter signups, volunteer applications, and contact messages stored here. Email notifications use Resend when RESEND_API_KEY is set."
      />

      {/* Newsletter */}
      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 px-4 py-4 sm:px-6">
          <Mail className="h-5 w-5 shrink-0 text-accent-600" aria-hidden />
          <h2 className="font-semibold text-slate-900">Newsletter signups</h2>
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
            {newsletter.length} {newsletter.length === 1 ? "subscriber" : "subscribers"}
          </span>
        </div>

        <ul className="space-y-2 p-4 md:hidden">
          {newsletter.map((row) => (
            <li key={row.id}>
              <AdminMobileEntityCard
                title={row.email}
                rows={[{ label: "Signed up", value: formatDate(row.createdAt) }]}
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
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {newsletter.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-3 text-sm text-slate-900">{row.email}</td>
                  <td className="px-6 py-3 text-sm text-slate-600">{formatDate(row.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {newsletter.length === 0 && (
          <p className="px-4 py-8 text-center text-sm text-slate-500 sm:px-6">No newsletter signups yet.</p>
        )}
      </section>

      {/* Volunteer applications */}
      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 px-4 py-4 sm:px-6">
          <UserPlus className="h-5 w-5 shrink-0 text-accent-600" aria-hidden />
          <h2 className="font-semibold text-slate-900">Volunteer applications</h2>
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
            {applications.length} {applications.length === 1 ? "application" : "applications"}
          </span>
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
                  { label: "Organization", value: row.organization ?? "—" },
                  { label: "Date", value: formatDate(row.createdAt) },
                ]}
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
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {applications.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-3 text-sm font-medium text-slate-900">{row.fullName}</td>
                  <td className="px-6 py-3 text-sm text-slate-700">
                    <a href={`mailto:${row.email}`} className="text-accent-600 hover:underline">
                      {row.email}
                    </a>
                  </td>
                  <td className="px-6 py-3 text-sm text-slate-600">{row.organization ?? "—"}</td>
                  <td className="px-6 py-3 text-sm text-slate-600">{formatDate(row.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {applications.length === 0 && (
          <p className="px-4 py-8 text-center text-sm text-slate-500 sm:px-6">No volunteer applications yet.</p>
        )}
      </section>

      {/* Contact submissions */}
      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 px-4 py-4 sm:px-6">
          <MessageSquare className="h-5 w-5 shrink-0 text-accent-600" aria-hidden />
          <h2 className="font-semibold text-slate-900">Contact form</h2>
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
            {contact.length} {contact.length === 1 ? "message" : "messages"}
          </span>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {contact.length === 0 && (
          <p className="px-4 py-8 text-center text-sm text-slate-500 sm:px-6">No contact submissions yet.</p>
        )}
      </section>
    </div>
  );
}
