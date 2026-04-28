export default function ContactLoading() {
  return (
    <div className="min-h-[50vh] animate-pulse motion-reduce:animate-none">
      <div className="h-48 bg-stone-200/80" />
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <div className="h-6 w-48 rounded bg-stone-200" />
        <div className="mt-8 space-y-4 rounded-2xl border border-border bg-white p-6 shadow-sm">
          <div className="h-10 w-full rounded-lg bg-stone-100" />
          <div className="h-10 w-full rounded-lg bg-stone-100" />
          <div className="h-28 w-full rounded-lg bg-stone-100" />
          <div className="h-12 w-40 rounded-lg bg-accent-200/60" />
        </div>
      </div>
    </div>
  );
}
