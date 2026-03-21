"use client";

import { useSearchParams } from "next/navigation";
import { AlertCircle } from "lucide-react";

/** Shows `?error=` from server action redirects (e.g. validation). Wrap route segment in Suspense if needed. */
export function AdminFormErrorBanner() {
  const searchParams = useSearchParams();
  const err = searchParams.get("error");
  if (!err) return null;
  return (
    <div
      className="mb-6 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950"
      role="alert"
    >
      <AlertCircle className="h-5 w-5 shrink-0 text-amber-700" aria-hidden />
      <p className="min-w-0 pt-0.5">{err}</p>
    </div>
  );
}
