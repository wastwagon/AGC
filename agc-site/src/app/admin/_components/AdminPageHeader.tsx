import type { ReactNode } from "react";

/**
 * Consistent page title + short description under the admin top bar (matches Media Library).
 * Optional `children` render top-right (e.g. primary actions).
 */
export function AdminPageHeader({
  title,
  description,
  children,
}: {
  title: string;
  description: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0 flex-1">
        <h1 className="font-serif text-2xl font-bold text-slate-900">{title}</h1>
        <div className="mt-1 text-slate-600 [&_strong]:font-semibold">{description}</div>
      </div>
      {children ? <div className="flex shrink-0 flex-wrap items-center gap-2 sm:self-start">{children}</div> : null}
    </div>
  );
}
