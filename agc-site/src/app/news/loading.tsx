export default function NewsLoading() {
  return (
    <div className="min-h-[50vh] animate-pulse motion-reduce:animate-none">
      <div className="h-48 bg-stone-200/80 sm:h-56 md:h-64" />
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="h-4 w-20 rounded bg-stone-200" />
        <div className="mt-3 h-7 max-w-2xl rounded bg-stone-200" />
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
              <div className="aspect-[16/10] bg-stone-200" />
              <div className="space-y-2 p-4">
                <div className="h-4 w-24 rounded bg-stone-100" />
                <div className="h-5 w-full rounded bg-stone-200" />
                <div className="h-4 w-[85%] rounded bg-stone-100" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
