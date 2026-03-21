import type { ReactNode } from "react";

type Row = { label: string; value: ReactNode };

/**
 * Stacked card for admin list rows on small screens (mobile-first).
 * Pair with a `hidden md:block` table for the same data.
 */
export function AdminMobileEntityCard({ title, rows, actions }: { title: ReactNode; rows: Row[]; actions?: ReactNode }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="text-base font-semibold leading-snug text-slate-900">{title}</h2>
      <dl className="mt-3 space-y-2 text-sm">
        {rows.map((r) => (
          <div key={r.label} className="flex gap-3 sm:gap-4">
            <dt className="w-[5.5rem] shrink-0 text-slate-500">{r.label}</dt>
            <dd className="min-w-0 flex-1 text-slate-800">{r.value}</dd>
          </div>
        ))}
      </dl>
      {actions ? <div className="mt-4 flex flex-wrap justify-end gap-2 border-t border-slate-100 pt-4">{actions}</div> : null}
    </article>
  );
}

/** Draft / published pill — reuse across admin lists */
export function AdminStatusPill({ status }: { status: string }) {
  const published = status === "published";
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
        published ? "bg-green-100 text-green-800" : "bg-slate-100 text-slate-700"
      }`}
    >
      {status}
    </span>
  );
}
