/**
 * Mobile-first listing skeleton — avoids blank paint while RSC streams.
 */
export default function EventsLoading() {
  return (
    <div className="min-h-[50vh] animate-pulse motion-reduce:animate-none">
      <div className="h-48 bg-stone-200/80 sm:h-56 md:h-64" />
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="h-4 w-24 rounded bg-stone-200" />
        <div className="mt-3 h-6 max-w-2xl rounded bg-stone-200" />
        <div className="mt-8 flex gap-2">
          <div className="h-10 w-28 rounded-full bg-stone-200" />
          <div className="h-10 w-28 rounded-full bg-stone-100" />
        </div>
        <ul className="mt-10 space-y-4">
          {[1, 2, 3].map((i) => (
            <li key={i} className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
              <div className="h-5 w-3/4 max-w-md rounded bg-stone-200" />
              <div className="mt-3 h-4 w-full max-w-lg rounded bg-stone-100" />
              <div className="mt-2 h-4 w-2/3 max-w-sm rounded bg-stone-100" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
