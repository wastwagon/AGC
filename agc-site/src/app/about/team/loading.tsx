export default function AboutTeamLoading() {
  return (
    <div className="min-h-[50vh] animate-pulse motion-reduce:animate-none">
      <div className="h-48 bg-stone-200/80 sm:h-56" />
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="h-8 max-w-lg rounded bg-stone-200" />
        <div className="mt-3 h-4 max-w-2xl rounded bg-stone-100" />
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="rounded-2xl border border-border bg-white p-6 shadow-sm">
              <div className="mx-auto h-24 w-24 rounded-full bg-stone-200" />
              <div className="mx-auto mt-4 h-5 w-40 rounded bg-stone-200" />
              <div className="mx-auto mt-2 h-3 w-28 rounded bg-stone-100" />
              <div className="mt-4 h-16 w-full rounded bg-stone-50" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
