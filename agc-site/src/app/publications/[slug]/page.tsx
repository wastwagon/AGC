import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, Calendar, Download } from "lucide-react";
import { placeholderImages } from "@/data/images";
import { getPublicationBySlug, getContentFileUrl } from "@/lib/content";
import { resolveImageUrl } from "@/lib/media";
import { fallbackPublications } from "@/data/content";
import type { CmsPublication } from "@/lib/content";

const typeLabels: Record<string, string> = {
  report: "Report",
  policy_brief: "Policy Brief",
  research: "Research",
};

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.africagovernancecentre.org";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cmsItem = await getPublicationBySlug(slug);
  const fallback = (fallbackPublications as CmsPublication[]).find((p) => p.slug === slug);
  const item = cmsItem ?? fallback;
  if (!item) return { title: "Publications" };
  const description = (item.excerpt || "").replace(/<[^>]*>/g, "").slice(0, 160);
  const imageUrl = (await resolveImageUrl(item.image)) || placeholderImages.publications;
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

async function getPublicationItem(slug: string): Promise<CmsPublication | null> {
  const cmsItem = await getPublicationBySlug(slug);
  if (cmsItem) return cmsItem;
  const fallback = (fallbackPublications as CmsPublication[]).find((p) => p.slug === slug);
  return fallback ?? null;
}

export default async function PublicationDetailPage({ params }: Props) {
  const { slug } = await params;
  const item = await getPublicationItem(slug);
  if (!item) notFound();

  const imageUrl = (await resolveImageUrl(item.image)) || placeholderImages.publications;
  const date = item.date_published || item.date_created;
  const dateStr = date
    ? new Date(date).toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" })
    : "";
  const fileUrl = getContentFileUrl(item.file ?? undefined);
  const typeLabel = item.type ? typeLabels[item.type] || item.type : "Publication";

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
            <p className="mb-3 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-accent-200">
              {typeLabel}
            </p>
            <h1 className="page-heading text-3xl leading-[1.15] text-[#fffcf7] sm:text-4xl lg:text-[2.35rem]">
              {item.title}
            </h1>
            <p className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-stone-200/95">
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-accent-300" aria-hidden />
                {dateStr}
              </span>
              {item.author && (
                <>
                  <span className="text-stone-500">·</span>
                  <span>{item.author}</span>
                </>
              )}
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
              <Link href="/publications" className="transition-colors hover:text-accent-700">
                Publications
              </Link>
              <span className="mx-2 text-stone-300">/</span>
              <span className="line-clamp-1 text-stone-700">{item.title}</span>
            </nav>

            {item.excerpt && (
              <p className="page-prose border-l-[3px] border-accent-600 bg-accent-50/40 py-3 pl-5 pr-4 text-lg leading-relaxed text-stone-700">
                {item.excerpt.replace(/<[^>]*>/g, "")}
              </p>
            )}

            {fileUrl && (
              <div className="mt-10">
                <div className="page-card border-l-[4px] border-l-accent-600 p-6 sm:p-8">
                  <h3 className="page-heading text-xl text-stone-900">Download</h3>
                  <p className="mt-2 page-prose text-[0.98rem]">
                    Full text as PDF — for research, teaching, and policy use.
                  </p>
                  <a
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex items-center gap-2 rounded-lg bg-accent-700 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-800"
                  >
                    <Download className="h-4 w-4" aria-hidden />
                    Download PDF
                  </a>
                </div>
              </div>
            )}

            <div className="mt-14 border-t border-stone-200 pt-8">
              <Link
                href="/publications"
                className="inline-flex items-center gap-2 text-sm font-medium text-accent-800 transition-colors hover:text-accent-950"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden />
                Back to publications
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="h-16 bg-[#f7f4ef]" aria-hidden />
    </article>
  );
}
