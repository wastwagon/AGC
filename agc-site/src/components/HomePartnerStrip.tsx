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
    <section className="border-y border-stone-200 bg-stone-800 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
        <p className="max-w-xs text-sm leading-snug text-stone-300">{blurb}</p>
        <div className="flex flex-1 flex-col gap-2 sm:items-end">
          <p className="text-xs font-medium uppercase tracking-wide text-stone-500">Alongside</p>
          <ul className="flex flex-wrap items-center gap-x-8 gap-y-3 sm:justify-end">
            {items.map((p) => (
              <li key={p.name} className="flex items-center">
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
                  <span className="text-sm text-stone-100">
                    {p.url ? (
                      <Link href={p.url} target="_blank" rel="noopener noreferrer" className="underline decoration-stone-500 underline-offset-2 hover:text-white">
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
