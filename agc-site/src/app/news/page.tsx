import { newsContent, fallbackNews } from "@/data/content";
import { placeholderImages } from "@/data/images";
import { getNews } from "@/lib/content";
import type { CmsNews } from "@/lib/content";
import { PageHero } from "@/components/PageHero";
import { HomeScrollReveal } from "@/components/home/HomeScrollReveal";
import { NewsListingSection } from "@/components/NewsListingSection";
import { Button } from "@/components/Button";
import { resolveImageUrl } from "@/lib/media";
import { getSiteTaxonomy } from "@/lib/site-taxonomy";
import { cmsStaticOrEmpty, getMergedPageContent } from "@/lib/page-content";
import { getSiteSettings } from "@/lib/site-settings";
import { resolveNewsForPublic } from "@/lib/cms-fallback";
import { CmsDraftNotice } from "@/components/CmsDraftNotice";

export const metadata = {
  title: "News",
  description: "Latest news, insights, and developments from Africa Governance Centre.",
};

export const revalidate = 30;

export default async function NewsPage() {
  const [cmsNews, taxonomy, merged, siteSettings] = await Promise.all([
    getNews(120),
    getSiteTaxonomy(),
    getMergedPageContent<typeof newsContent>("news", cmsStaticOrEmpty(newsContent)),
    getSiteSettings(),
  ]);
  const content = merged as unknown as typeof newsContent & { heroImage?: string };
  const heroImage = (await resolveImageUrl(content.heroImage)) || placeholderImages.news;
  const { items: newsItems, cmsDraftsOnly: newsDraftsOnly } = await resolveNewsForPublic(
    cmsNews,
    fallbackNews as CmsNews[]
  );
  const itemsWithImages = await Promise.all(
    newsItems.map(async (item) => ({
      item,
      imageUrl: (await resolveImageUrl(item.image)) || placeholderImages.news,
    }))
  );

  const f = content.filters as typeof content.filters & {
    filterLabel?: string;
    textSearch?: string;
    theme?: string;
    region?: string;
    country?: string;
    programme?: string;
    reset?: string;
    previous?: string;
    next?: string;
    allOption?: string;
    noMatchesFiltered?: string;
  };
  const listingLabels = {
    filter: f.filterLabel ?? "Filter:",
    textSearch: f.textSearch ?? "Text search",
    theme: f.theme ?? "Theme",
    region: f.region ?? "Region",
    country: f.country ?? "Country",
    programme: f.programme ?? "Programme",
    reset: f.reset ?? "Reset",
    previous: f.previous ?? "Previous",
    next: f.next ?? "Next",
    all: f.allOption ?? f.allCategories ?? "All",
    noMatches: f.noMatchesFiltered ?? f.noResults,
  };

  return (
    <>
      <PageHero
        title={content.title}
        subtitle={content.subtitle}
        image={heroImage}
        imageAlt="Latest News"
        breadcrumbs={[
          { label: siteSettings.chrome.breadcrumbs.home, href: "/" },
          { label: siteSettings.chrome.breadcrumbs.news },
        ]}
      />

      <HomeScrollReveal variant="slideRight" start="top 88%" className="block w-full">
        <section className="border-t border-stone-200/80 bg-white py-16 sm:py-20 lg:py-24">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          {newsItems.length > 0 ? (
            <NewsListingSection
              items={itemsWithImages}
              categoryOptions={taxonomy.newsCategories}
              tagOptions={taxonomy.newsTags}
              labels={listingLabels}
              intro={content.intro?.trim() ? <p className="page-prose max-w-2xl">{content.intro}</p> : undefined}
              draftsNotice={
                newsDraftsOnly ? <CmsDraftNotice entityLabel="news articles" adminHref="/admin/news" /> : undefined
              }
            />
          ) : (
            <div className="page-card max-w-2xl p-8">
              <p className="page-prose">{content.intro}</p>
              <p className="page-prose mt-6">
                Stay up-to-date with our latest news and initiatives. Subscribe to our newsletter or contact{" "}
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
      </HomeScrollReveal>
    </>
  );
}
