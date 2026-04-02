import Link from "next/link";
import { prisma } from "@/lib/db";
import { Plus, Pencil } from "lucide-react";
import { AdminMobileEntityCard, AdminStatusPill } from "../_components/AdminMobileEntityCard";
import { AdminPageHeader } from "../_components/AdminPageHeader";
import { AdminFormErrorSuspense } from "../_components/AdminFormErrorSuspense";
import { AdminFormSuccessSuspense } from "../_components/AdminFormSuccessSuspense";
import { DeleteButton } from "../DeleteButton";
import { deletePublication } from "./actions";
import { getSiteTaxonomy, labelForPublicationTypeSlug } from "@/lib/site-taxonomy";
import { requireAdminSession } from "@/lib/require-admin";

export const dynamic = "force-dynamic";

function formatPublicationTypesCell(types: unknown, taxonomy: { slug: string; label: string }[]): string {
  const arr = Array.isArray(types) ? (types as string[]) : [];
  if (arr.length === 0) return "—";
  return arr.map((s) => labelForPublicationTypeSlug(s, taxonomy)).join(", ");
}

export default async function AdminPublicationsPage() {
  await requireAdminSession();
  const [items, taxonomy] = await Promise.all([
    prisma.publication.findMany({
      orderBy: [{ datePublished: "desc" }, { createdAt: "desc" }],
    }),
    getSiteTaxonomy(),
  ]);

  return (
    <div>
      <AdminPageHeader
        title="Publications"
        description="Reports, policy briefs, and publications on the public site. Use Media for cover images."
      >
        <Link
          href="/admin/publications/new"
          className="flex min-h-[44px] items-center gap-2 rounded-lg bg-accent-500 px-4 py-3 font-medium text-white hover:bg-accent-600"
        >
          <Plus className="h-4 w-4" />
          Add Publication
        </Link>
      </AdminPageHeader>
      <AdminFormErrorSuspense />
      <AdminFormSuccessSuspense />

      <ul className="space-y-3 md:hidden">
        {items.map((item) => (
          <li key={item.id}>
            <AdminMobileEntityCard
              title={item.title}
              rows={[
                { label: "Types", value: formatPublicationTypesCell(item.types, taxonomy.publicationTypes) },
                {
                  label: "Date",
                  value: item.datePublished
                    ? new Date(item.datePublished).toLocaleDateString("en-GB")
                    : new Date(item.createdAt).toLocaleDateString("en-GB"),
                },
                { label: "Status", value: <AdminStatusPill status={item.status} /> },
              ]}
              actions={
                <>
                  <Link
                    href={`/admin/publications/${item.id}/edit`}
                    className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg p-2 text-slate-600 hover:bg-slate-100"
                    aria-label={`Edit ${item.title}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </Link>
                  <DeleteButton action={deletePublication.bind(null, item.id)} label="Delete publication" />
                </>
              }
            />
          </li>
        ))}
      </ul>

      <div className="hidden overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm md:block">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Title</th>
              <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Types</th>
              <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Date</th>
              <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Status</th>
              <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider text-slate-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-900">{item.title}</td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {formatPublicationTypesCell(item.types, taxonomy.publicationTypes)}
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {item.datePublished
                    ? new Date(item.datePublished).toLocaleDateString("en-GB")
                    : new Date(item.createdAt).toLocaleDateString("en-GB")}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      item.status === "published" ? "bg-green-100 text-green-800" : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/publications/${item.id}/edit`}
                      className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      aria-label="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <DeleteButton action={deletePublication.bind(null, item.id)} label="Delete publication" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {items.length === 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center text-slate-500">
          No publications yet. Add your first publication.
        </div>
      )}
    </div>
  );
}
