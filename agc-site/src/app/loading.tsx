export default function Loading() {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 px-4">
      <div
        className="h-10 w-10 animate-spin rounded-full border-2 border-accent-500 border-t-transparent motion-reduce:animate-none"
        aria-hidden
      />
      <p className="sr-only">Loading page</p>
      <div className="h-2 w-48 max-w-full animate-pulse rounded-full bg-stone-200 motion-reduce:animate-none" />
    </div>
  );
}
