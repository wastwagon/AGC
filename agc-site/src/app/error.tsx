"use client";

import { useEffect } from "react";
import { Button } from "@/components/Button";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="relative min-h-[65vh] overflow-hidden bg-white px-4 py-20">
      <div className="relative mx-auto max-w-lg text-center">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-black">Something slipped</p>
        <h1 className="page-heading mt-4 text-3xl tracking-tight text-black sm:text-4xl">
          We couldn&apos;t load this
        </h1>
        <p className="mt-6 page-prose text-[1.02rem]">
          A temporary glitch on our side. Your work isn&apos;t lost — try again, or head home and come back in a
          moment.
        </p>
        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
          <Button onClick={reset} variant="primary" className="!rounded-none">
            Try again
          </Button>
          <Button asChild href="/" variant="outline" className="!rounded-none">
            Home
          </Button>
        </div>
        <p className="mt-12 text-xs text-black">
          Still stuck?{" "}
          <Link href="/contact" className="text-accent-800 underline underline-offset-2 hover:text-accent-950">
            Contact us
          </Link>
        </p>
      </div>
    </div>
  );
}
