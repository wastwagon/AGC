import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdminSession } from "@/lib/require-admin";
import { AdminPageHeader } from "../../../_components/AdminPageHeader";
import { DeleteButton } from "../../../DeleteButton";
import { deleteJoinUsInquiry } from "../../actions";

type Props = { params: Promise<{ id: string }> };

export const dynamic = "force-dynamic";

export default async function AdminJoinUsDetailPage({ params }: Props) {
  await requireAdminSession();

  const { id: idRaw } = await params;
  const id = parseInt(idRaw, 10);
  if (Number.isNaN(id)) notFound();

  const row = await prisma.joinUsInquiry.findUnique({ where: { id } });
  if (!row) notFound();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Work with us inquiry"
        description={
          <>
            {row.name} · {new Date(row.createdAt).toLocaleString("en-GB")}.{" "}
            <Link href="/admin/submissions" className="font-medium text-accent-600 hover:underline">
              Back to submissions
            </Link>
          </>
        }
      />

      <div className="flex flex-wrap items-center justify-end gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <DeleteButton
          action={deleteJoinUsInquiry.bind(null, id)}
          label="Delete inquiry"
          confirmMessage="Delete this career inquiry permanently?"
        />
      </div>

      <dl className="grid gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:grid-cols-2">
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
          <dt className="text-xs font-medium uppercase tracking-wider text-slate-500">Organisation</dt>
          <dd className="mt-1 text-slate-900">{row.organization ?? "—"}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-xs font-medium uppercase tracking-wider text-slate-500">Interest</dt>
          <dd className="mt-1 text-slate-900">{row.interestArea ?? "—"}</dd>
        </div>
      </dl>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-900">Message</h3>
        <p className="mt-3 whitespace-pre-wrap text-slate-700">{row.message}</p>
      </div>
    </div>
  );
}
