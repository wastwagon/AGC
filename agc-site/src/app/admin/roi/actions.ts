"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { roiReviewStatusSchema } from "@/lib/validations";

async function requireSession() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
}

export async function deleteRegistrationOfInterest(id: number) {
  await requireSession();
  const row = await prisma.registrationOfInterest.findUnique({ where: { id } });
  await prisma.registrationOfInterest.delete({ where: { id } });
  revalidatePath("/admin/roi");
  const event = row?.eventType ?? "apps";
  redirect(`/admin/roi?event=${event}&deleted=1`);
}

export async function updateRoiReviewStatus(formData: FormData) {
  await requireSession();
  const id = parseInt(String(formData.get("id") || ""), 10);
  if (Number.isNaN(id)) redirect("/admin/roi");

  const statusParsed = roiReviewStatusSchema.safeParse(formData.get("reviewStatus"));
  if (!statusParsed.success) {
    redirect(`/admin/roi/${id}?error=status`);
  }

  const reviewNotes = String(formData.get("reviewNotes") || "").trim().slice(0, 5000);

  await prisma.registrationOfInterest.update({
    where: { id },
    data: {
      reviewStatus: statusParsed.data,
      reviewNotes: reviewNotes || null,
      reviewedAt: new Date(),
    },
  });

  revalidatePath("/admin/roi");
  revalidatePath(`/admin/roi/${id}`);
  redirect(`/admin/roi/${id}?updated=1`);
}
