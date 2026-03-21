import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { Mail, UserPlus, MessageSquare } from "lucide-react";
export const dynamic = "force-dynamic";

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
      <div>
        <h1 className="font-serif text-2xl font-bold text-slate-900">Submissions</h1>
        <p className="mt-1 text-sm text-slate-600">
          Newsletter signups, volunteer applications, and contact form messages. Stored in the database; email notifications still sent when RESEND_API_KEY is set.
        </p>
      </div>

      {/* Newsletter */}
      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center gap-2 border-b border-slate-200 px-6 py-4">
          <Mail className="h-5 w-5 text-accent-600" aria-hidden />
          <h2 className="font-semibold text-slate-900">Newsletter signups</h2>
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
            {newsletter.length} {newsletter.length === 1 ? "subscriber" : "subscribers"}
          </span>
        </div>
        <div className="overflow-x-auto">
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
                  <td className="px-6 py-3 text-sm text-slate-600">
                    {new Date(row.createdAt).toLocaleDateString("en-GB", { dateStyle: "medium" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {newsletter.length === 0 && (
          <p className="px-6 py-8 text-center text-sm text-slate-500">No newsletter signups yet.</p>
        )}
      </section>

      {/* Volunteer applications */}
      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center gap-2 border-b border-slate-200 px-6 py-4">
          <UserPlus className="h-5 w-5 text-accent-600" aria-hidden />
          <h2 className="font-semibold text-slate-900">Volunteer applications</h2>
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
            {applications.length} {applications.length === 1 ? "application" : "applications"}
          </span>
        </div>
        <div className="overflow-x-auto">
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
                  <td className="px-6 py-3 text-sm text-slate-600">
                    {new Date(row.createdAt).toLocaleDateString("en-GB", { dateStyle: "medium" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {applications.length === 0 && (
          <p className="px-6 py-8 text-center text-sm text-slate-500">No volunteer applications yet.</p>
        )}
      </section>

      {/* Contact submissions */}
      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center gap-2 border-b border-slate-200 px-6 py-4">
          <MessageSquare className="h-5 w-5 text-accent-600" aria-hidden />
          <h2 className="font-semibold text-slate-900">Contact form</h2>
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
            {contact.length} {contact.length === 1 ? "message" : "messages"}
          </span>
        </div>
        <div className="overflow-x-auto">
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
                  <td className="px-6 py-3 text-sm text-slate-600">
                    {new Date(row.createdAt).toLocaleDateString("en-GB", { dateStyle: "medium" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {contact.length === 0 && (
          <p className="px-6 py-8 text-center text-sm text-slate-500">No contact submissions yet.</p>
        )}
      </section>
    </div>
  );
}
