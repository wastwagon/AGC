import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { PartnerForm } from "../../PartnerForm";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function AdminPartnersEditPage({ params }: Props) {
  const { id } = await params;
  const numId = parseInt(id, 10);
  if (isNaN(numId)) notFound();

  const item = await prisma.partner.findUnique({ where: { id: numId } });
  if (!item) notFound();

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-slate-900">Edit: {item.name}</h1>
      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <PartnerForm item={item} />
      </div>
    </div>
  );
}
