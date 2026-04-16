import Image from "next/image";
import Link from "next/link";

export type PartnerStripItem = { name: string; logo?: string; url?: string };

export function HomePartnerStrip({
  blurb,
  partners,
}: {
  blurb: string;
  partners: PartnerStripItem[] | string[];
}) {
  const items: PartnerStripItem[] = partners.map((p) =>
    typeof p === "string" ? { name: p } : p
  );
  return (
    <section className="border-y border-stone-200 bg-accent-600 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
        <p className="max-w-prose text-sm leading-snug text-white sm:max-w-xs">{blurb}</p>
        <div className="flex min-w-0 flex-1 flex-col gap-2 sm:items-end">
          <p className="text-xs font-medium uppercase tracking-wide text-white">Alongside</p>
          {/* Mobile: 2-column grid (2×2 for four items). sm+: horizontal wrap, right-aligned. */}
          <ul className="grid grid-cols-2 gap-x-4 gap-y-3 sm:flex sm:flex-row sm:flex-wrap sm:items-center sm:justify-end sm:gap-x-8 sm:gap-y-3">
            {items.map((p) => (
              <li key={p.name} className="flex min-w-0 items-start sm:items-center">
                {p.logo ? (
                  p.url ? (
                    <Link
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative block h-10 w-28 grayscale opacity-90 transition hover:opacity-100 hover:grayscale-0"
                    >
                      <Image src={p.logo} alt={p.name} fill className="object-contain object-right" sizes="112px" />
                    </Link>
                  ) : (
                    <span className="relative block h-10 w-28 grayscale opacity-90">
                      <Image src={p.logo} alt={p.name} fill className="object-contain object-right" sizes="112px" />
                    </span>
                  )
                ) : (
                  <span className="text-sm text-white">
                    {p.url ? (
                      <Link
                        href={p.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white underline decoration-white/50 underline-offset-2 hover:decoration-white"
                      >
                        {p.name}
                      </Link>
                    ) : (
                      p.name
                    )}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
