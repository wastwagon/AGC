/** Shown in development when Prisma cannot reach Postgres (e.g. Docker DB not started). */
export function AdminDatabaseUnavailable() {
  return (
    <div className="mx-auto max-w-lg rounded-xl border border-amber-200 bg-amber-50 p-6 text-slate-800">
      <p className="font-semibold text-slate-900">Database unavailable</p>
      <p className="mt-2 text-sm leading-relaxed">
        Start PostgreSQL (for example run{" "}
        <code className="rounded bg-white px-1.5 py-0.5 text-xs">docker compose up -d agc-db</code> from the repo root)
        and set <code className="rounded bg-white px-1.5 py-0.5 text-xs">DATABASE_URL</code> in{" "}
        <code className="rounded bg-white px-1.5 py-0.5 text-xs">agc-site/.env.local</code> to match.
      </p>
    </div>
  );
}
