export default function AboutLoading() {
  return (
    <div className="min-h-[50vh] animate-pulse motion-reduce:animate-none">
      <div className="h-52 bg-stone-200/80 sm:h-64" />
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="h-8 max-w-md rounded bg-stone-200" />
        <div className="mt-4 h-4 w-full max-w-2xl rounded bg-stone-100" />
        <div className="mt-2 h-4 w-full max-w-xl rounded bg-stone-100" />
        <div className="mt-10 space-y-4">
          <div className="h-32 rounded-2xl bg-stone-100" />
          <div className="h-32 rounded-2xl bg-stone-100" />
        </div>
      </div>
    </div>
  );
}
