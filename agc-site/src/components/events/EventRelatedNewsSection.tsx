import type { CmsNews } from "@/lib/content";
import { NewsCard } from "@/components/NewsCard";

type Item = { item: CmsNews; imageUrl: string };

export function EventRelatedNewsSection({ items }: { items: Item[] }) {
  if (items.length === 0) return null;

  return (
    <section className="mt-20 border-t border-border/90 pt-10 lg:mt-24 lg:pt-12" aria-labelledby="event-related-news">
      <div className="border-b border-border/90 pb-4">
        <h2 id="event-related-news" className="font-sans text-2xl font-bold tracking-tight text-accent-950 sm:text-3xl">
          Related News
        </h2>
      </div>
      <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(({ item, imageUrl }) => (
          <NewsCard key={item.id} item={item} imageUrl={imageUrl} href="/news" variant="listing" />
        ))}
      </div>
    </section>
  );
}
