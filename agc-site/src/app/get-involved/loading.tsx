export default function GetInvolvedLoading() {
  return (
    <div className="min-h-[50vh] animate-pulse motion-reduce:animate-none">
      <div className="h-48 bg-stone-200/80" />
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="h-6 w-40 rounded bg-stone-200" />
        <div className="mt-3 h-8 max-w-lg rounded bg-stone-200" />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
              <div className="h-5 w-3/4 rounded bg-stone-200" />
              <div className="mt-4 h-3 w-full rounded bg-stone-100" />
              <div className="mt-2 h-3 w-[85%] rounded bg-stone-100" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
