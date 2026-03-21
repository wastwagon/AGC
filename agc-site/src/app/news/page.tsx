import { newsContent, siteConfig, fallbackNews } from "@/data/content";
import { placeholderImages } from "@/data/images";
import { getNews } from "@/lib/content";
import type { CmsNews } from "@/lib/content";
import { PageHero } from "@/components/PageHero";
import { NewsCard } from "@/components/NewsCard";
import { NewsFilters } from "@/components/NewsFilters";
import { Button } from "@/components/Button";
import { getActiveCategorySlugs } from "@/lib/news";
import { resolveImageUrl } from "@/lib/media";

export const metadata = {
  title: "News",
  description: "Latest news, insights, and developments from Africa Governance Centre.",
};

export const revalidate = 60;

export default async function NewsPage() {
  const cmsNews = await getNews(50);
  const newsItems: CmsNews[] = cmsNews.length > 0 ? cmsNews : (fallbackNews as CmsNews[]);
  const activeCategories = getActiveCategorySlugs(newsItems);
  const itemsWithImages = await Promise.all(
    newsItems.map(async (item) => ({
      item,
      imageUrl: (await resolveImageUrl(item.image)) || placeholderImages.news,
    }))
  );

  return (
    <>
      <PageHero
        title={newsContent.title}
        subtitle={newsContent.subtitle}
        image={placeholderImages.news}
        imageAlt="Latest News"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "News" }]}
      />

      <section className="page-section-warm border-t border-stone-200/60 py-16 sm:py-20 lg:py-24">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-2xl">
            <p className="text-sm font-medium text-accent-800">Updates</p>
            <p className="page-prose mt-2">{newsContent.intro}</p>
          </div>
          {activeCategories.length > 0 && (
            <NewsFilters
              activeCategorySlugs={activeCategories}
              currentCategory={undefined}
            />
          )}
          {newsItems.length > 0 ? (
                <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
                  {itemsWithImages.map(({ item, imageUrl }) => (
                    <NewsCard key={item.id} item={item} imageUrl={imageUrl} href="/news" />
                  ))}
                </div>
            ) : (
              <div className="page-card p-8">
                <p className="page-prose">{newsContent.intro}</p>
                <p className="page-prose mt-6">
                  Stay up-to-date with our latest news and initiatives. Subscribe to our newsletter or contact{" "}
                  <a href={`mailto:${siteConfig.email.programs}`} className="font-medium text-accent-600 hover:underline">
                    {siteConfig.email.programs}
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
