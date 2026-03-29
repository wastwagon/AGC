"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

async function requireSession() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
}

export async function deleteContactSubmission(id: number) {
  await requireSession();
  await prisma.contactSubmission.delete({ where: { id } });
  revalidatePath("/admin/submissions");
  redirect("/admin/submissions?deleted=contact");
}

export async function deleteVolunteerApplication(id: number) {
  await requireSession();
  await prisma.volunteerApplication.delete({ where: { id } });
  revalidatePath("/admin/submissions");
  redirect("/admin/submissions?deleted=application");
}

export async function deleteNewsletterSignup(id: number) {
  await requireSession();
  await prisma.newsletterSignup.delete({ where: { id } });
  revalidatePath("/admin/submissions");
  redirect("/admin/submissions?deleted=newsletter");
}

export async function deletePartnershipInquiry(id: number) {
  await requireSession();
  await prisma.partnershipInquiry.delete({ where: { id } });
  revalidatePath("/admin/submissions");
  redirect("/admin/submissions?deleted=partnership");
}
