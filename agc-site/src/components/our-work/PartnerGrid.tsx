import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { preferUnoptimizedImage } from "@/lib/image-delivery";

export type PartnerGridItem = {
  id: number;
  name: string;
  logoUrl: string | null;
  url?: string;
};

type Props = {
  partners: PartnerGridItem[];
};

export function PartnerGrid({ partners }: Props) {
  if (partners.length === 0) {
    return (
      <div className="rounded-none border border-dashed border-border bg-white py-14 text-center">
        <p className="text-black">No partners listed yet.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {partners.map((p) => {
        const logoSrc = p.logoUrl?.trim() ?? "";
        const hasLogo = logoSrc.length > 0;
        const showFooter = hasLogo || Boolean(p.url);

        const cardInner = (
          <div className="flex flex-1 flex-col bg-white px-6 py-8 sm:px-7">
            <div className="flex min-h-[100px] items-center justify-center">
              {hasLogo ? (
                <Image
                  src={logoSrc}
                  alt={p.name}
                  width={220}
                  height={88}
                  className="max-h-20 w-auto max-w-full object-contain"
                  unoptimized={preferUnoptimizedImage(logoSrc)}
                />
              ) : (
                <h3 className="text-center font-serif text-xl font-semibold leading-snug text-black">{p.name}</h3>
              )}
            </div>
            {showFooter ? (
              <div className={`border-border/80 pt-6 ${hasLogo ? "mt-8 border-t" : ""}`}>
                {hasLogo ? (
                  <h3 className="font-serif text-base font-semibold text-black">{p.name}</h3>
                ) : null}
                {p.url ? (
                  <p
                    className={`inline-flex items-center gap-1.5 text-sm font-medium text-accent-700 ${hasLogo ? "mt-2" : ""}`}
                  >
                    <ExternalLink className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
                    Visit website
                  </p>
                ) : null}
              </div>
            ) : null}
          </div>
        );

        const baseClass =
          "flex flex-col overflow-hidden rounded-none border border-border/90 bg-stone-50/40 text-left shadow-sm transition-all hover:border-accent-200/60 hover:shadow-md";
        const linkClass = `${baseClass} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-600`;

        return p.url ? (
          <a
            key={p.id}
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            {cardInner}
          </a>
        ) : (
          <div key={p.id} className={baseClass}>
            {cardInner}
          </div>
        );
      })}
    </div>
  );
}
