/**
 * Mobile-first listing skeleton — avoids blank paint while RSC streams.
 */
export default function EventsLoading() {
  return (
    <div className="min-h-[50vh] animate-pulse motion-reduce:animate-none">
      <div className="h-48 bg-stone-200/80 sm:h-56 md:h-64" />
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="h-4 w-24 rounded-none bg-stone-200" />
        <div className="mt-3 h-6 max-w-2xl rounded-none bg-stone-200" />
        <div className="mt-10 border-t border-stone-200/90 pt-2">
          <div className="h-10 max-w-xs rounded-none bg-stone-200" />
        </div>
        <div className="mt-8 grid grid-cols-1 gap-px bg-stone-200/90 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="min-h-[280px] bg-white p-8">
              <div className="h-3 w-24 rounded-none bg-stone-200" />
              <div className="mt-4 h-32 w-full rounded-none bg-stone-100" />
              <div className="mt-5 h-5 w-full rounded-none bg-stone-200" />
              <div className="mt-3 h-4 w-full rounded-none bg-stone-100" />
              <div className="mt-2 h-4 w-2/3 rounded-none bg-stone-100" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
