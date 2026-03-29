import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { AdminPageHeader } from "../../../_components/AdminPageHeader";
import { DeleteButton } from "../../../DeleteButton";
import { deleteVolunteerApplication } from "../../actions";

type Props = { params: Promise<{ id: string }> };

export const dynamic = "force-dynamic";

const typeLabels: Record<string, string> = {
  volunteer: "Volunteer",
  staff: "Staff / career interest",
  fellow: "Fellowship",
};

export default async function AdminApplicationDetailPage({ params }: Props) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const { id: idRaw } = await params;
  const id = parseInt(idRaw, 10);
  if (Number.isNaN(id)) notFound();

  const row = await prisma.volunteerApplication.findUnique({ where: { id } });
  if (!row) notFound();

  const typeLabel = typeLabels[row.applicationType] ?? row.applicationType;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={row.fullName}
        description={
          <>
            {typeLabel} · {new Date(row.createdAt).toLocaleString("en-GB")}.{" "}
            <Link href="/admin/submissions" className="font-medium text-accent-600 hover:underline">
              Back to submissions
            </Link>
          </>
        }
      />

      <div className="flex flex-wrap items-center justify-end gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <DeleteButton
          action={deleteVolunteerApplication.bind(null, id)}
          label="Delete application"
          confirmMessage="Delete this application permanently?"
        />
      </div>

      <dl className="grid gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:grid-cols-2">
        <div>
          <dt className="text-xs font-medium uppercase tracking-wider text-slate-500">Application type</dt>
          <dd className="mt-1 text-slate-900">{typeLabel}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wider text-slate-500">Email</dt>
          <dd className="mt-1">
            <a href={`mailto:${row.email}`} className="text-accent-600 hover:underline">
              {row.email}
            </a>
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wider text-slate-500">Phone</dt>
          <dd className="mt-1 text-slate-900">{row.phone ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wider text-slate-500">Position</dt>
          <dd className="mt-1 text-slate-900">{row.position ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wider text-slate-500">Organization</dt>
          <dd className="mt-1 text-slate-900">{row.organization ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wider text-slate-500">Country</dt>
          <dd className="mt-1 text-slate-900">{row.country ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wider text-slate-500">City</dt>
          <dd className="mt-1 text-slate-900">{row.city ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wider text-slate-500">Availability</dt>
          <dd className="mt-1 text-slate-900">{row.availability ?? "—"}</dd>
        </div>
      </dl>

      <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Experience</h3>
          <p className="mt-2 whitespace-pre-wrap text-slate-700">{row.experience ?? "—"}</p>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Skills</h3>
          <p className="mt-2 whitespace-pre-wrap text-slate-700">{row.skills ?? "—"}</p>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Motivation</h3>
          <p className="mt-2 whitespace-pre-wrap text-slate-700">{row.motivation ?? "—"}</p>
        </div>
      </div>
    </div>
  );
}
