import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { AdminPageHeader } from "../../../_components/AdminPageHeader";
import { DeleteButton } from "../../../DeleteButton";
import { deleteContactSubmission } from "../../actions";

type Props = { params: Promise<{ id: string }> };

export const dynamic = "force-dynamic";

export default async function AdminContactSubmissionDetailPage({ params }: Props) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const { id: idRaw } = await params;
  const id = parseInt(idRaw, 10);
  if (Number.isNaN(id)) notFound();

  const row = await prisma.contactSubmission.findUnique({ where: { id } });
  if (!row) notFound();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Contact message"
        description={
          <>
            Received {new Date(row.createdAt).toLocaleString("en-GB")}.{" "}
            <Link href="/admin/submissions" className="font-medium text-accent-600 hover:underline">
              Back to submissions
            </Link>
          </>
        }
      />

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-slate-900">{row.name}</h2>
        <DeleteButton
          action={deleteContactSubmission.bind(null, id)}
          label="Delete message"
          confirmMessage="Delete this contact submission permanently?"
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
          <dt className="text-xs font-medium uppercase tracking-wider text-slate-500">Subject</dt>
          <dd className="mt-1 text-slate-900">{row.subject ?? "—"}</dd>
        </div>
      </dl>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-900">Message</h3>
        <p className="mt-3 whitespace-pre-wrap text-slate-700">{row.message}</p>
      </div>
    </div>
  );
}
