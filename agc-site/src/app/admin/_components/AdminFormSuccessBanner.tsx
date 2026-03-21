"use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, X } from "lucide-react";

const MESSAGES: Record<string, string> = {
  "1": "Changes saved successfully.",
  created: "Created successfully.",
  deleted: "Deleted successfully.",
};

/** Shows `?saved=` from server action redirects after create/update/delete. Dismiss clears the query param. */
export function AdminFormSuccessBanner() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const saved = searchParams.get("saved");

  const dismiss = useCallback(() => {
    const next = new URLSearchParams(searchParams.toString());
    next.delete("saved");
    const q = next.toString();
    router.replace(q ? `${pathname}?${q}` : pathname);
  }, [pathname, router, searchParams]);

  if (!saved || !(saved in MESSAGES)) return null;
  const message = MESSAGES[saved];

  return (
    <div
      className="mb-6 flex gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-950"
      role="status"
      aria-live="polite"
    >
      <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-700" aria-hidden />
      <p className="min-w-0 flex-1 pt-0.5">{message}</p>
      <button
        type="button"
        onClick={dismiss}
        className="shrink-0 rounded-lg p-1 text-emerald-800 hover:bg-emerald-100/80"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" aria-hidden />
      </button>
    </div>
  );
}
