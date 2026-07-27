import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdminSession } from "@/lib/require-admin";
import { AdminPageHeader } from "../../_components/AdminPageHeader";
import { DeleteButton } from "../../DeleteButton";
import { deleteRegistrationOfInterest, updateRoiReviewStatus } from "../actions";
import {
  getRoiFormConfig,
  ROI_REVIEW_STATUSES,
  ROI_REVIEW_STATUS_LABELS,
  type RoiReviewStatus,
} from "@/data/roi-forms";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ updated?: string; error?: string }>;
};

export const dynamic = "force-dynamic";

function parseAreas(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(String) : [raw];
  } catch {
    return [raw];
  }
}

export default async function AdminRoiDetailPage({ params, searchParams }: Props) {
  await requireAdminSession();

  const { id: idRaw } = await params;
  const sp = await searchParams;
  const id = parseInt(idRaw, 10);
  if (Number.isNaN(id)) notFound();

  const row = await prisma.registrationOfInterest.findUnique({ where: { id } });
  if (!row) notFound();

  const config = getRoiFormConfig(row.eventType);
  const areas = parseAreas(row.areasOfInterest);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={`${config?.shortName ?? row.eventType} — Registration of Interest`}
        description={
          <>
            {row.fullName} · {new Date(row.createdAt).toLocaleString("en-GB")}.{" "}
            <Link
              href={`/admin/roi?event=${row.eventType}`}
              className="font-medium text-accent-600 hover:underline"
            >
              Back to {config?.shortName ?? "ROI"} entries
            </Link>
          </>
        }
      />

      {sp.updated && (
        <p className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          Review status updated.
        </p>
      )}
      {sp.error === "status" && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          Invalid review status.
        </p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-white p-4 shadow-sm">
        <div className="text-sm text-slate-600">
          Confirmations are sent via SMTP from{" "}
          <a href={`mailto:${config?.fromEmail}`} className="font-medium text-accent-600 hover:underline">
            {config?.fromEmail ?? "—"}
          </a>
          {" "}when that event’s SMTP settings are configured.
        </div>
        <DeleteButton
          action={deleteRegistrationOfInterest.bind(null, id)}
          label="Delete entry"
          confirmMessage="Delete this Registration of Interest permanently?"
        />
      </div>

      <form
        action={updateRoiReviewStatus}
        className="space-y-4 rounded-xl border border-border bg-white p-6 shadow-sm"
      >
        <input type="hidden" name="id" value={id} />
        <h3 className="text-sm font-semibold text-slate-900">Review for clarity</h3>
        <p className="text-sm text-slate-600">
          Mark where this application sits in the assessment process. Notes are internal only.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="reviewStatus" className="block text-xs font-medium uppercase tracking-wider text-slate-500">
              Status
            </label>
            <select
              id="reviewStatus"
              name="reviewStatus"
              defaultValue={row.reviewStatus}
              className="mt-1.5 w-full rounded-lg border border-border px-3 py-2 text-sm"
            >
              {ROI_REVIEW_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {ROI_REVIEW_STATUS_LABELS[s]}
                </option>
              ))}
            </select>
          </div>
          <div className="text-sm text-slate-600 sm:pt-6">
            Current:{" "}
            <strong>
              {ROI_REVIEW_STATUS_LABELS[row.reviewStatus as RoiReviewStatus] ?? row.reviewStatus}
            </strong>
            {row.reviewedAt && (
              <> · Last reviewed {new Date(row.reviewedAt).toLocaleString("en-GB")}</>
            )}
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="reviewNotes" className="block text-xs font-medium uppercase tracking-wider text-slate-500">
              Internal notes
            </label>
            <textarea
              id="reviewNotes"
              name="reviewNotes"
              rows={3}
              defaultValue={row.reviewNotes ?? ""}
              className="mt-1.5 w-full rounded-lg border border-border px-3 py-2 text-sm"
              placeholder="Stakeholder balance, capacity, follow-up…"
            />
          </div>
        </div>
        <button
          type="submit"
          className="rounded-lg bg-accent-700 px-4 py-2 text-sm font-medium text-white hover:bg-accent-800"
        >
          Save review
        </button>
      </form>

      <dl className="grid gap-4 rounded-xl border border-border bg-white p-6 shadow-sm sm:grid-cols-2">
        <div>
          <dt className="text-xs font-medium uppercase tracking-wider text-slate-500">Title</dt>
          <dd className="mt-1 text-slate-900">{row.title ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wider text-slate-500">Full name</dt>
          <dd className="mt-1 text-slate-900">{row.fullName}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wider text-slate-500">Job title</dt>
          <dd className="mt-1 text-slate-900">{row.jobTitle}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wider text-slate-500">Organisation</dt>
          <dd className="mt-1 text-slate-900">{row.organisation}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wider text-slate-500">Country / nationality</dt>
          <dd className="mt-1 text-slate-900">{row.country}</dd>
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
          <dt className="text-xs font-medium uppercase tracking-wider text-slate-500">Telephone</dt>
          <dd className="mt-1 text-slate-900">{row.telephone}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wider text-slate-500">
            {config?.organisationTypeLabel ?? "Organisation type"}
          </dt>
          <dd className="mt-1 text-slate-900">{row.organisationType}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wider text-slate-500">Intended participation</dt>
          <dd className="mt-1 text-slate-900">{row.participationType}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wider text-slate-500">Previous participation</dt>
          <dd className="mt-1 text-slate-900">{row.previousParticipation ? "Yes" : "No"}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wider text-slate-500">Visa support</dt>
          <dd className="mt-1 text-slate-900">{row.visaSupport ? "Yes" : "No"}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wider text-slate-500">How heard</dt>
          <dd className="mt-1 text-slate-900">{row.howHeard}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-xs font-medium uppercase tracking-wider text-slate-500">Areas of interest</dt>
          <dd className="mt-1 text-slate-900">
            <ul className="list-disc pl-5">
              {areas.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-xs font-medium uppercase tracking-wider text-slate-500">Accessibility requirements</dt>
          <dd className="mt-1 whitespace-pre-wrap text-slate-900">{row.accessibilityReqs || "—"}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-xs font-medium uppercase tracking-wider text-slate-500">Dietary requirements</dt>
          <dd className="mt-1 whitespace-pre-wrap text-slate-900">{row.dietaryReqs || "—"}</dd>
        </div>
      </dl>
    </div>
  );
}
