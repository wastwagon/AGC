import { publicationsContent, fallbackPublications } from "@/data/content";
import { placeholderImages } from "@/data/images";
import { getPublications } from "@/lib/content";
import type { CmsPublication } from "@/lib/content";
import { PageHero } from "@/components/PageHero";
import { PublicationCard } from "@/components/PublicationCard";
import { Button } from "@/components/Button";
import { resolveImageUrl } from "@/lib/media";
import { getSiteTaxonomy } from "@/lib/site-taxonomy";
import { cmsStaticOrEmpty, getMergedPageContent } from "@/lib/page-content";
import { getSiteSettings } from "@/lib/site-settings";
import { resolvePublicationsForPublic } from "@/lib/cms-fallback";
import { CmsDraftNotice } from "@/components/CmsDraftNotice";

export const metadata = {
  title: "Publications",
  description: "Reports, policy briefs, and research from the Africa Governance Centre.",
};

export const revalidate = 30;

export default async function PublicationsPage() {
  const [cmsPublications, taxonomy, merged, siteSettings] = await Promise.all([
    getPublications(50),
    getSiteTaxonomy(),
    getMergedPageContent<typeof publicationsContent>("publications", cmsStaticOrEmpty(publicationsContent)),
    getSiteSettings(),
  ]);
  const content = merged as unknown as typeof publicationsContent & { heroImage?: string };
  const heroImage = (await resolveImageUrl(content.heroImage)) || placeholderImages.publications;
  const { items, cmsDraftsOnly: publicationsDraftsOnly } = await resolvePublicationsForPublic(
    cmsPublications,
    fallbackPublications as CmsPublication[]
  );
  const itemsWithImages = await Promise.all(
    items.map(async (item) => ({
      item,
      imageUrl: (await resolveImageUrl(item.image)) || placeholderImages.publications,
    }))
  );

  return (
    <>
      <PageHero
        title={content.title}
        subtitle={content.subtitle}
        image={heroImage}
        imageAlt="Publications"
        breadcrumbs={[
          { label: siteSettings.chrome.breadcrumbs.home, href: "/" },
          { label: siteSettings.chrome.breadcrumbs.publications },
        ]}
      />

      <section className="page-section-paper border-t border-stone-200/80 py-16 sm:py-20 lg:py-24">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 max-w-2xl space-y-4">
            <p className="text-sm font-medium text-accent-800">Library</p>
            <p className="page-prose mt-2">{content.intro}</p>
            {publicationsDraftsOnly && (
              <CmsDraftNotice entityLabel="publications" adminHref="/admin/publications" />
            )}
          </div>
          {items.length > 0 ? (
            <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
              {itemsWithImages.map(({ item, imageUrl }) => (
                <PublicationCard
                  key={item.id}
                  item={item}
                  imageUrl={imageUrl}
                  href="/publications"
                  publicationTypes={taxonomy.publicationTypes}
                />
              ))}
            </div>
          ) : (
            <div className="page-card p-8">
              <p className="page-prose">{content.intro}</p>
              <p className="page-prose mt-6">
                Stay up-to-date with our latest publications. Subscribe to our newsletter or contact{" "}
                <a href={`mailto:${siteSettings.email.programs}`} className="font-medium text-accent-600 hover:underline">
                  {siteSettings.email.programs}
                </a>{" "}
                to receive updates.
              </p>
              <Button asChild href="/contact" variant="outline" className="mt-6">
                Contact Us
              </Button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
