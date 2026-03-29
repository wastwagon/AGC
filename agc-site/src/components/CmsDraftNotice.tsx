import Link from "next/link";

type Props = {
  entityLabel: string;
  adminHref: string;
};

/** Shown when CMS has records but none are published yet (avoids confusing demo fallback). */
export function CmsDraftNotice({ entityLabel, adminHref }: Props) {
  return (
    <div className="rounded-xl border border-amber-200/90 bg-amber-50/95 px-4 py-3 text-sm text-amber-950 sm:px-5 sm:py-4">
      <p className="font-medium">Unpublished content in the admin</p>
      <p className="mt-1 text-amber-900/90">
        You have {entityLabel} saved as drafts. Publish at least one item in the admin, or the public list stays empty
        (demo sample content is hidden so visitors are not misled).
      </p>
      <Link href={adminHref} className="mt-2 inline-block font-medium text-accent-800 underline-offset-2 hover:underline">
        Open {entityLabel} in admin →
      </Link>
    </div>
  );
}
