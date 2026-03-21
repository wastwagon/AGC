export default function AdminLoading() {
  return (
    <div className="animate-pulse motion-reduce:animate-none">
      <div className="h-8 max-w-xs rounded bg-slate-200" />
      <div className="mt-2 h-4 max-w-lg rounded bg-slate-100" />
      <div className="mt-8 space-y-3">
        <div className="h-14 rounded-lg bg-slate-100" />
        <div className="h-14 rounded-lg bg-slate-100" />
        <div className="h-14 rounded-lg bg-slate-100" />
      </div>
    </div>
  );
}
