import Link from "next/link";
import { privacyPolicy } from "@/data/legal";
import { PageHero } from "@/components/PageHero";
import { HomeScrollReveal } from "@/components/home/HomeScrollReveal";
import { getMergedPageContent } from "@/lib/page-content";
import { cardImageUrlOrNull } from "@/lib/image-delivery";
import { resolveImageUrl } from "@/lib/media";
import { getSiteSettings } from "@/lib/site-settings";

/** Always read fresh CMS + media resolution so hero image updates are not stuck behind static cache. */
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Privacy Policy",
  description: "How Africa Governance Centre collects, uses, and protects your information.",
};

type PrivacyMerged = typeof privacyPolicy & { heroImage?: string; sectionImage?: string };

export default async function PrivacyPolicyPage() {
  const [merged, siteSettings] = await Promise.all([
    // Merge over full static legal copy so CMS fields (e.g. heroImage) overlay reliably.
    getMergedPageContent<PrivacyMerged>("privacy-policy", privacyPolicy as PrivacyMerged),
    getSiteSettings(),
  ]);
  const content = merged;

  const heroRaw = content.heroImage?.trim() || content.sectionImage?.trim() || undefined;
  const resolved = await resolveImageUrl(heroRaw);
  const heroSrc = cardImageUrlOrNull(resolved) ?? undefined;
  const heroSubtitle = [content.subtitle?.trim(), `Last updated · ${content.lastUpdated}`]
    .filter(Boolean)
    .join(" · ");
  const introSection = content.sections.find((section) => section.title.trim().toLowerCase() === "introduction");
  const introSectionText = "content" in (introSection ?? {}) ? introSection?.content?.trim() : "";

  return (
    <>
      <PageHero
        variant={heroSrc ? "compact" : "minimal"}
        title={content.title}
        subtitle={heroSubtitle}
        image={heroSrc}
        imageAlt=""
        breadcrumbs={[
          { label: siteSettings.chrome.breadcrumbs.home, href: "/" },
          { label: siteSettings.chrome.breadcrumbs.privacyPolicy },
        ]}
      />

      <HomeScrollReveal variant="fadeUp" start="top 90%" className="block w-full">
        <section className="w-full border-t border-border/80 bg-white py-8 sm:py-12 lg:py-14">
        <div className="mx-auto w-full max-w-none px-6 sm:px-8 lg:px-11 xl:px-16 2xl:px-24">
          <p className="border-l-[3px] border-accent-600 py-2 pl-5 text-sm page-prose leading-relaxed">
            This policy describes how we handle personal data when you use our website, register for events, or contact
            us. For questions, use the details at the end of this page.{" "}
            {introSectionText}
          </p>

          <div className="mt-14 grid gap-8 lg:grid-cols-2">
            {content.sections
              .filter((section) => section.title.trim().toLowerCase() !== "introduction")
              .map((section) => {
              const subs =
                "subsections" in section && Array.isArray(section.subsections) ? section.subsections : [];
              const lead = "content" in section ? section.content?.trim() ?? "" : "";
              const itemList = "items" in section && Array.isArray(section.items) ? section.items : [];
              const useSubGrid = subs.length >= 2;
              const useItemGrid = itemList.length >= 5;
              const isCompact = subs.length === 0 && itemList.length === 0 && lead.length < 260;
              const spanFull = subs.length > 0;

              return (
                <article
                  key={section.title}
                  className={
                    spanFull
                      ? "page-card p-6 sm:p-8 lg:col-span-2"
                      : isCompact
                        ? "page-card p-6 sm:p-7"
                        : "page-card p-6 sm:p-8"
                  }
                >
                  <h2 className="page-heading text-xl text-black sm:text-2xl">{section.title}</h2>
                  {lead ? <p className="mt-4 page-prose text-[0.98rem]">{section.content}</p> : null}

                  {subs.length > 0 ? (
                    <div
                      className={
                        lead
                          ? useSubGrid
                            ? "mt-8 grid gap-8 lg:grid-cols-2 lg:gap-10"
                            : "mt-8 space-y-8"
                          : useSubGrid
                            ? "mt-6 grid gap-8 lg:grid-cols-2 lg:gap-10"
                            : "mt-6 space-y-8"
                      }
                    >
                      {subs.map((sub: { title: string; content: string; items?: string[] }) => (
                        <div
                          key={sub.title}
                          className="min-w-0 border border-border/70 bg-stone-50/40 px-5 py-6 sm:px-6"
                        >
                          <h3 className="text-xs font-semibold uppercase tracking-wider text-accent-800">{sub.title}</h3>
                          <p className="mt-3 page-prose text-[0.95rem]">{sub.content}</p>
                          {sub.items && (
                            <ul className="mt-4 list-none space-y-2 border-l-2 border-border pl-4 text-[0.95rem] text-black">
                              {sub.items.map((item: string) => (
                                <li
                                  key={item}
                                  className="relative before:absolute before:-left-3 before:top-2.5 before:h-1 before:w-1 before:rounded-full before:bg-accent-600"
                                >
                                  {item}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : null}

                  {itemList.length > 0 ? (
                    <ul
                      className={
                        useItemGrid
                          ? "mt-4 grid list-none grid-cols-1 gap-x-8 gap-y-2 border-l-2 border-border pl-4 text-[0.95rem] text-black sm:grid-cols-2"
                          : "mt-4 list-none space-y-2 border-l-2 border-border pl-4 text-[0.95rem] text-black"
                      }
                    >
                      {itemList.map((item: string) => (
                        <li
                          key={item}
                          className="relative before:absolute before:-left-3 before:top-2.5 before:h-1 before:w-1 before:rounded-full before:bg-accent-600"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </article>
              );
            })}
          </div>
        </div>
      </section>
      </HomeScrollReveal>

      <HomeScrollReveal variant="fadeIn" start="top 92%" className="block w-full">
        <section className="w-full border-t border-border/80 bg-white py-8 text-black sm:py-12 lg:py-14">
        <div className="mx-auto w-full max-w-none px-6 sm:px-8 lg:px-11 xl:px-16 2xl:px-24">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-accent-800">Privacy & data</p>
          <h2 className="page-heading mt-3 text-2xl text-black">Contact us</h2>
          <p className="mt-4 text-sm leading-relaxed text-black">
            Questions about this policy or our data practices:
          </p>
          <ul className="mt-6 space-y-2 text-sm text-black">
            <li>
              <a
                href={`mailto:${siteSettings.email.info}`}
                className="font-medium text-accent-700 underline decoration-accent-300/70 underline-offset-4 hover:text-accent-900 hover:decoration-accent-600"
              >
                {siteSettings.email.info}
              </a>
            </li>
            <li>{siteSettings.address}</li>
            <li>{siteSettings.phone}</li>
          </ul>
          <p className="mt-10 text-xs text-black">
            <Link href="/terms-of-service" className="text-accent-700 hover:text-accent-900">
              Terms of service
            </Link>
            {" · "}
            <Link href="/" className="text-accent-700 hover:text-accent-900">
              Home
            </Link>
          </p>
        </div>
      </section>
      </HomeScrollReveal>
    </>
  );
}
