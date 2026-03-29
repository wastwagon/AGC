import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSiteTaxonomy } from "@/lib/site-taxonomy";
import { AdminFormErrorSuspense } from "../../../_components/AdminFormErrorSuspense";
import { AdminFormSuccessSuspense } from "../../../_components/AdminFormSuccessSuspense";
import { AdminPageHeader } from "../../../_components/AdminPageHeader";
import { NewsForm } from "../../NewsForm";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function AdminNewsEditPage({ params }: Props) {
  const { id } = await params;
  const numId = parseInt(id, 10);
  if (isNaN(numId)) notFound();

  const [item, taxonomy] = await Promise.all([
    prisma.news.findUnique({ where: { id: numId } }),
    getSiteTaxonomy(),
  ]);
  if (!item) notFound();

  return (
    <div>
      <AdminPageHeader
        title={`Edit: ${item.title}`}
        description="Update the article, images, and publish date. Draft items stay hidden on the public site."
      />
      <AdminFormErrorSuspense />
      <AdminFormSuccessSuspense />
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-8">
        <NewsForm key={item.id} categoryOptions={taxonomy.newsCategories} item={item} />
      </div>
    </div>
  );
}
