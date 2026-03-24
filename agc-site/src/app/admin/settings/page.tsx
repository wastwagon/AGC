import { prisma } from "@/lib/db";
import Link from "next/link";
import { AdminPageHeader } from "../_components/AdminPageHeader";
import { AdminMaintenancePanel } from "./AdminMaintenancePanel";

export const dynamic = "force-dynamic";

async function getContentCounts() {
  const [
    events,
    news,
    publications,
    team,
    programs,
    projects,
    partners,
    pages,
    submissions,
    signups,
  ] = await Promise.all([
    prisma.event.count(),
    prisma.news.count(),
    prisma.publication.count(),
    prisma.team.count(),
    prisma.program.count(),
    prisma.project.count(),
    prisma.partner.count(),
    prisma.pageContent.count(),
    prisma.contactSubmission.count(),
    prisma.newsletterSignup.count(),
  ]);
  return { events, news, publications, team, programs, projects, partners, pages, submissions, signups };
}

export default async function AdminSettingsPage() {
  const counts = await getContentCounts();

  return (
    <div>
      <AdminPageHeader
        title="Operations"
        description="Operational controls for deployment health. Run DB migration/seed manually if startup jobs fail in Coolify."
      />

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-serif text-lg font-semibold text-slate-900">Deployment maintenance</h2>
        <p className="mt-1 text-sm text-slate-600">
          Use these actions when your VPS deploy is up but migration/seed did not run automatically.
        </p>
        <div className="mt-4">
          <AdminMaintenancePanel />
        </div>
        <p className="mt-4 text-sm text-slate-600">
          Need to edit organization identity, contacts, and socials?{" "}
          <Link href="/admin/site-settings" className="font-medium text-accent-700 hover:underline">
            Open Site Settings
          </Link>
          .
        </p>
      </section>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-serif text-lg font-semibold text-slate-900">Database content snapshot</h2>
        <p className="mt-1 text-sm text-slate-600">Quick verification that CMS sections are reading/writing from PostgreSQL.</p>
        <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {Object.entries(counts).map(([key, value]) => (
            <div key={key} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
              <dt className="text-xs uppercase tracking-wide text-slate-500">{key}</dt>
              <dd className="mt-1 text-lg font-semibold text-slate-900">{value}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
