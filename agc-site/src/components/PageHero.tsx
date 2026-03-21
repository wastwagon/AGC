import Image from "next/image";
import Link from "next/link";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

export type PageHeroVariant = "immersive" | "compact" | "minimal";

type PageHeroProps = {
  title: string;
  subtitle?: string;
  /** Required for immersive & compact */
  image?: string;
  imageAlt?: string;
  breadcrumbs?: BreadcrumbItem[];
  /** immersive = full-bleed image; compact = shorter bar; minimal = editorial strip, no hero image */
  variant?: PageHeroVariant;
};

/**
 * Inner page headers — use `minimal` for legal/long-form, `compact` for dense sections.
 */
export function PageHero({
  title,
  subtitle,
  image,
  imageAlt,
  breadcrumbs,
  variant = "immersive",
}: PageHeroProps) {
  const items = breadcrumbs ?? [{ label: "Home", href: "/" }, { label: title }];

  if (variant === "minimal") {
    return (
      <section className="border-b border-stone-200/90 bg-[#fffcf7]">
        <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
          <nav aria-label="Breadcrumb" className="text-sm text-stone-500">
            <ol className="flex flex-wrap items-center gap-1">
              {items.map((item, i) => (
                <li key={i} className="flex items-center gap-1">
                  {item.href ? (
                    <Link href={item.href} className="transition-colors hover:text-accent-700">
                      {item.label}
                    </Link>
                  ) : (
                    <span className="font-medium text-stone-400">{item.label}</span>
                  )}
                  {i < items.length - 1 && <span className="text-stone-300">/</span>}
                </li>
              ))}
            </ol>
          </nav>
          <h1 className="page-heading mt-4 text-3xl sm:text-4xl">
            {title}
          </h1>
          {subtitle && <p className="mt-3 text-stone-600">{subtitle}</p>}
          <div className="mt-6 h-px w-16 bg-accent-500" aria-hidden />
        </div>
      </section>
    );
  }

  if (variant === "compact") {
    const src = image ?? "";
    const alt = imageAlt ?? "";
    return (
      <section className="relative flex min-h-[160px] flex-col justify-center sm:min-h-[200px] lg:min-h-[240px]">
        <div className="absolute inset-0">
          {src ? (
            <Image src={src} alt={alt} fill className="object-cover object-center" sizes="100vw" priority />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-stone-900 to-accent-900" aria-hidden />
          )}
          <div
            className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-accent-900/78 to-accent-700/35"
            aria-hidden
          />
        </div>
        <div className="container relative z-10 mx-auto w-full px-4 py-10 text-left sm:px-6 lg:px-8 lg:py-12">
          <nav aria-label="Breadcrumb" className="text-sm text-white/70">
            <ol className="flex flex-wrap items-center gap-1">
              {items.map((item, i) => (
                <li key={i} className="flex items-center gap-1">
                  {item.href ? (
                    <Link href={item.href} className="transition-colors hover:text-white">
                      {item.label}
                    </Link>
                  ) : (
                    <span className="text-accent-200">{item.label}</span>
                  )}
                  {i < items.length - 1 && <span className="text-white/40">/</span>}
                </li>
              ))}
            </ol>
          </nav>
          <h1 className="mt-3 font-serif text-3xl font-semibold text-white sm:text-4xl lg:text-[2.75rem] lg:leading-tight">
            {title}
          </h1>
          {subtitle && <p className="mt-2 max-w-2xl text-base text-white/85 sm:text-lg">{subtitle}</p>}
        </div>
      </section>
    );
  }

  /* immersive */
  const src = image ?? "";
  const alt = imageAlt ?? "";
  return (
    <section className="relative flex min-h-[220px] flex-col justify-center sm:min-h-[280px] lg:min-h-[340px]">
      <div className="absolute inset-0">
        {src ? (
          <Image src={src} alt={alt} fill className="object-cover object-center" sizes="100vw" priority />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-stone-950 via-accent-900 to-accent-800" aria-hidden />
        )}
        <div
          className="absolute inset-0 bg-gradient-to-br from-stone-950/92 via-accent-900/80 to-accent-600/30"
          aria-hidden
        />
      </div>

      <div className="container relative z-10 mx-auto w-full px-4 py-14 text-center sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-3xl">
          <h1 className="font-serif text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-5xl xl:text-[3.25rem] xl:leading-tight">
            {title}
          </h1>
          {subtitle && <p className="mt-4 text-lg text-white/90 sm:text-xl">{subtitle}</p>}
          <nav aria-label="Breadcrumb" className="mt-8">
            <ol className="flex flex-wrap items-center justify-center gap-1 text-sm text-white/80 sm:gap-2 sm:text-base">
              {items.map((item, i) => (
                <li key={i} className="flex items-center gap-1 sm:gap-2">
                  {item.href ? (
                    <Link href={item.href} className="transition-colors hover:text-accent-200">
                      {item.label}
                    </Link>
                  ) : (
                    <span className="text-accent-200">{item.label}</span>
                  )}
                  {i < items.length - 1 && (
                    <span className="text-white/50" aria-hidden>
                      /
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </div>
    </section>
  );
}
