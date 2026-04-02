import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdminSession } from "@/lib/require-admin";
import { getSiteTaxonomy } from "@/lib/site-taxonomy";
import { AdminFormErrorSuspense } from "../../../_components/AdminFormErrorSuspense";
import { AdminFormSuccessSuspense } from "../../../_components/AdminFormSuccessSuspense";
import { AdminPageHeader } from "../../../_components/AdminPageHeader";
import { PublicationForm } from "../../PublicationForm";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function AdminPublicationsEditPage({ params }: Props) {
  await requireAdminSession();
  const { id } = await params;
  const numId = parseInt(id, 10);
  if (isNaN(numId)) notFound();

  const [item, taxonomy] = await Promise.all([
    prisma.publication.findUnique({ where: { id: numId } }),
    getSiteTaxonomy(),
  ]);
  if (!item) notFound();

  return (
    <div>
      <AdminPageHeader
        title={`Edit: ${item.title}`}
        description="Update the publication, cover, file, and types. Published items appear on the public site."
      />
      <AdminFormErrorSuspense />
      <AdminFormSuccessSuspense />
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-8">
        <PublicationForm typeOptions={taxonomy.publicationTypes} item={item} />
      </div>
    </div>
  );
}
