export default function AppSummitLoading() {
  return (
    <div className="min-h-[50vh] animate-pulse motion-reduce:animate-none">
      <div className="h-52 bg-stone-200/80 sm:h-60" />
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-3 lg:gap-16">
          <div className="space-y-4 lg:col-span-2">
            <div className="h-6 w-48 rounded bg-stone-200" />
            <div className="h-4 w-full max-w-2xl rounded bg-stone-100" />
            <div className="h-4 w-full max-w-xl rounded bg-stone-100" />
            <div className="mt-8 h-12 w-40 rounded-lg bg-accent-200/50" />
          </div>
          <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
            <div className="h-5 w-32 rounded bg-stone-200" />
            <div className="mt-4 space-y-3">
              <div className="h-10 w-full rounded-lg bg-stone-100" />
              <div className="h-10 w-full rounded-lg bg-stone-100" />
            </div>
          </div>
        </div>
        <div className="mt-16 flex gap-2">
          <div className="h-10 w-24 rounded-full bg-stone-200" />
          <div className="h-10 w-24 rounded-full bg-stone-100" />
        </div>
        <div className="mt-8 h-64 rounded-2xl bg-stone-100" />
      </div>
    </div>
  );
}
