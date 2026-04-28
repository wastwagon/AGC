import type { ReactNode } from "react";
import Link from "next/link";

type AdminFormPreviewLinkProps = {
  href: string;
  children?: ReactNode;
};

/** Opens the public page in a new tab (admin “preview on site”). */
export function AdminFormPreviewLink({ href, children = "Preview on site" }: AdminFormPreviewLinkProps) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex min-h-[44px] items-center rounded-lg border border-border px-6 py-3 font-medium text-slate-700 hover:bg-slate-50"
    >
      {children}
    </Link>
  );
}
