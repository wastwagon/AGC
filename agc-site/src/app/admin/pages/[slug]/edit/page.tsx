import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { PageContentForm } from "../../PageContentForm";
import { HomePageContentForm } from "../../HomePageContentForm";
import { getHomePageCmsForEdit } from "@/lib/home-page-data";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export default async function AdminPagesEditPage({ params }: Props) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  if (decodedSlug === "home") {
    await prisma.pageContent.upsert({
      where: { slug: "home" },
      create: { slug: "home", title: "Homepage", status: "published" },
      update: {},
    });
    const item = await prisma.pageContent.findUnique({ where: { slug: "home" } });
    const merged = await getHomePageCmsForEdit();
    return (
      <div>
        <h1 className="font-serif text-2xl font-bold text-slate-900">Edit homepage</h1>
        <p className="mt-2 text-sm text-slate-600">
          Controls the hero, testimonial, fellow spotlight, reach/stats, and partner strip on{" "}
          <strong>/</strong>. Set to <em>Draft</em> to show code defaults on the live site.
        </p>
        <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <HomePageContentForm data={merged} status={item?.status ?? "published"} />
        </div>
      </div>
    );
  }

  const item = await prisma.pageContent.findUnique({ where: { slug: decodedSlug } });
  if (!item) notFound();

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-slate-900">Edit Page: {item.title || item.slug}</h1>
      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <PageContentForm item={item} />
      </div>
    </div>
  );
}
