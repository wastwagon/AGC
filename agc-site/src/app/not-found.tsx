import Link from "next/link";
import { Button } from "@/components/Button";

export default function NotFound() {
  return (
    <div className="relative min-h-[70vh] overflow-hidden bg-[#f7f4ef] px-4 py-20">
      <div
        className="pointer-events-none absolute -right-24 top-1/4 h-72 w-72 rounded-full bg-accent-200/30 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-16 bottom-1/4 h-56 w-56 rounded-full bg-accent-500/10 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-lg text-center">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-stone-500">404</p>
        <h1 className="page-heading mt-4 text-4xl tracking-tight text-stone-900 sm:text-[2.75rem]">
          This page isn&apos;t here
        </h1>
        <p className="mt-6 page-prose text-[1.05rem]">
          The link may be outdated, or the page moved. Try the homepage, or browse news and publications.
        </p>
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button asChild href="/" variant="primary">
            Back to home
          </Button>
          <Link
            href="/news"
            className="text-sm font-medium text-accent-800 underline decoration-accent-300 underline-offset-4 transition-colors hover:text-accent-950 hover:decoration-accent-600"
          >
            Latest news
          </Link>
          <Link
            href="/publications"
            className="text-sm font-medium text-accent-800 underline decoration-accent-300 underline-offset-4 transition-colors hover:text-accent-950 hover:decoration-accent-600"
          >
            Publications
          </Link>
        </div>
      </div>
    </div>
  );
}
