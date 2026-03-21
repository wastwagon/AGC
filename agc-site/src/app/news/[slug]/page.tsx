import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Calendar, Download, FolderOpen } from "lucide-react";
import { placeholderImages } from "@/data/images";
import { getNewsBySlug } from "@/lib/content";
import { resolveImageUrl } from "@/lib/media";
import { fallbackNews } from "@/data/content";
import { getNewsCategorySlugs, getCategoryLabel } from "@/lib/news";
import type { CmsNews } from "@/lib/content";
import { sanitizeHtml } from "@/lib/sanitize";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.africagovernancecentre.org";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cmsItem = await getNewsBySlug(slug);
  const fallback = (fallbackNews as CmsNews[]).find((n) => n.slug === slug);
  const item = cmsItem ?? fallback;
  if (!item) return { title: "News" };
  const description = (item.excerpt || "").replace(/<[^>]*>/g, "").slice(0, 160);
  const imageUrl = (await resolveImageUrl(item.image)) || placeholderImages.news;
  const ogImage = imageUrl.startsWith("http") ? imageUrl : `${baseUrl}${imageUrl.startsWith("/") ? "" : "/"}${imageUrl}`;
  return {
    title: item.title,
    description,
    openGraph: {
      title: item.title,
      description,
      images: [{ url: ogImage, width: 1200, height: 630, alt: item.title }],
    },
    twitter: { card: "summary_large_image" },
  };
}

async function getNewsItem(slug: string): Promise<CmsNews | null> {
  const cmsItem = await getNewsBySlug(slug);
  if (cmsItem) return cmsItem;
  const fallback = (fallbackNews as CmsNews[]).find((n) => n.slug === slug);
  return fallback ?? null;
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params;
  const item = await getNewsItem(slug);
  if (!item) notFound();

  const imageUrl = (await resolveImageUrl(item.image)) || placeholderImages.news;
  const date = item.date_published || item.date_created;
  const dateStr = date
    ? new Date(date).toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" })
    : "";

  return (
    <article className="min-h-screen bg-[#f7f4ef]">
      <div className="relative aspect-[21/9] min-h-[220px] w-full overflow-hidden bg-accent-900">
        <Image
          src={imageUrl}
          alt={item.title}
          fill
          className="object-cover opacity-[0.72]"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-accent-900/95 via-accent-800/45 to-accent-900/25" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 lg:p-16">
          <div className="mx-auto w-full max-w-3xl">
            <p className="mb-3 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-white">
              News & updates
            </p>
            <h1 className="font-serif text-3xl font-semibold leading-[1.15] tracking-tight text-white sm:text-4xl lg:text-[2.35rem]">
              {item.title}
            </h1>
            <p className="mt-4 flex items-center gap-2 text-sm text-white">
              <Calendar className="h-4 w-4 shrink-0 text-white" aria-hidden />
              {dateStr}
            </p>
          </div>
        </div>
      </div>

      <div className="relative z-[1] -mt-6 sm:-mt-10">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="page-card rounded-2xl border border-stone-200/90 px-5 py-8 shadow-[0_12px_40px_-12px_rgba(28,25,23,0.12)] sm:px-8 sm:py-10 lg:px-10 lg:py-12">
            <nav aria-label="Breadcrumb" className="mb-8 border-b border-stone-200/80 pb-6 text-sm text-stone-500">
              <Link href="/" className="transition-colors hover:text-accent-700">
                Home
              </Link>
              <span className="mx-2 text-stone-300">/</span>
              <Link href="/news" className="transition-colors hover:text-accent-700">
                News
              </Link>
              <span className="mx-2 text-stone-300">/</span>
              <span className="line-clamp-1 text-stone-700">{item.title}</span>
            </nav>

            {getNewsCategorySlugs(item).length > 0 && (
              <div className="mb-10 flex flex-col gap-4 border-l-[3px] border-accent-600 bg-accent-50/40 py-4 pl-5 pr-4">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2">
                  <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-stone-500">
                    <FolderOpen className="h-3.5 w-3.5" aria-hidden />
                    Topics
                  </span>
                  <span className="flex flex-wrap gap-x-4 gap-y-1">
                    {getNewsCategorySlugs(item).map((catSlug) => (
                      <Link
                        key={catSlug}
                        href={`/news/category/${catSlug}`}
                        className="text-sm font-medium text-accent-800 underline decoration-accent-300 underline-offset-4 transition-colors hover:text-accent-950 hover:decoration-accent-600"
                      >
                        {getCategoryLabel(catSlug)}
                      </Link>
                    ))}
                  </span>
                </div>
              </div>
            )}

            <div
              className="prose prose-lg max-w-none
                prose-headings:page-heading prose-headings:mt-10 prose-headings:mb-4 prose-headings:text-stone-900
                prose-p:page-prose prose-p:mb-5
                prose-a:text-accent-700 prose-a:font-medium prose-a:no-underline hover:prose-a:underline prose-a:decoration-accent-400
                prose-strong:text-stone-900 prose-li:text-stone-600
                prose-blockquote:border-l-accent-600 prose-blockquote:bg-accent-50/30 prose-blockquote:py-1 prose-blockquote:not-italic prose-blockquote:text-stone-700"
              dangerouslySetInnerHTML={{
                __html: sanitizeHtml(
                  item.content ||
                    `<p>${(item.excerpt || "Full content coming soon.").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>`
                ),
              }}
            />

            {(() => {
              const resources = (item as { downloadResources?: { label: string; description: string; href: string } })
                .downloadResources;
              if (!resources || !resources.href || resources.href === "#") return null;
              return (
                <div className="mt-14 border-t border-stone-200 pt-10">
                  <div className="page-card border-l-[4px] border-l-accent-600 p-6 sm:p-8">
                    <h3 className="page-heading text-xl text-stone-900">{resources.label}</h3>
                    <p className="mt-2 page-prose text-[0.98rem]">{resources.description}</p>
                    <a
                      href={resources.href}
                      className="mt-5 inline-flex items-center gap-2 rounded-lg bg-accent-700 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-800"
                    >
                      <Download className="h-4 w-4" aria-hidden />
                      Download resources
                    </a>
                  </div>
                </div>
              );
            })()}

          </div>
        </div>
      </div>

      <div className="h-16 bg-[#f7f4ef]" aria-hidden />
    </article>
  );
}
