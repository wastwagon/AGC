import Link from "next/link";
import { prisma } from "@/lib/db";
import { Plus, Pencil } from "lucide-react";
import { AdminMobileEntityCard, AdminStatusPill } from "../_components/AdminMobileEntityCard";
import { AdminPageHeader } from "../_components/AdminPageHeader";
import { AdminFormErrorSuspense } from "../_components/AdminFormErrorSuspense";
import { AdminFormSuccessSuspense } from "../_components/AdminFormSuccessSuspense";
import { DeleteButton } from "../DeleteButton";
import { deleteProgram } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminProgramsPage() {
  const items = await prisma.program.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <div>
      <AdminPageHeader
        title="Programs"
        description="Program listings for the public Programs section. Order controls how items appear."
      >
        <Link
          href="/admin/programs/new"
          className="flex min-h-[44px] items-center gap-2 rounded-lg bg-accent-500 px-4 py-3 font-medium text-white hover:bg-accent-600"
        >
          <Plus className="h-4 w-4" />
          Add Program
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
                { label: "Order", value: item.order },
                { label: "Status", value: <AdminStatusPill status={item.status} /> },
              ]}
              actions={
                <>
                  <Link
                    href={`/admin/programs/${item.id}/edit`}
                    className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg p-2 text-slate-600 hover:bg-slate-100"
                    aria-label={`Edit ${item.title}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </Link>
                  <DeleteButton action={deleteProgram.bind(null, item.id)} label="Delete program" />
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
              <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Order</th>
              <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Status</th>
              <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider text-slate-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-900">{item.title}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{item.order}</td>
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
                      href={`/admin/programs/${item.id}/edit`}
                      className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      aria-label="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <DeleteButton action={deleteProgram.bind(null, item.id)} label="Delete program" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {items.length === 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center text-slate-500">
          No programs yet. Add your first program.
        </div>
      )}
    </div>
  );
}
