"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { eventFormSchema } from "@/lib/validations";

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function createEvent(formData: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const raw = {
    title: formData.get("title"),
    slug: formData.get("slug") || undefined,
    description: formData.get("description") || undefined,
    location: formData.get("location") || undefined,
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate") || undefined,
    image: formData.get("image") || undefined,
    link: formData.get("link") || undefined,
    category: formData.get("category") || undefined,
    eventType: formData.get("eventType") || undefined,
    venueName: formData.get("venueName") || undefined,
    venueAddress: formData.get("venueAddress") || undefined,
    capacity: formData.get("capacity") || undefined,
    registrationDeadline: formData.get("registrationDeadline") || undefined,
    status: formData.get("status") || "draft",
  };

  const parsed = eventFormSchema.safeParse(raw);
  if (!parsed.success) {
    redirect(`/admin/events/new?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Invalid input")}`);
  }

  const data = parsed.data;
  const finalSlug = data.slug?.trim() || slugify(data.title);

  await prisma.event.create({
    data: {
      title: data.title,
      slug: finalSlug,
      description: data.description || null,
      location: data.location || null,
      startDate: new Date(data.startDate),
      endDate: data.endDate ? new Date(data.endDate) : null,
      image: data.image || null,
      link: data.link || null,
      category: data.category || null,
      eventType: data.eventType || null,
      venueName: data.venueName || null,
      venueAddress: data.venueAddress || null,
      capacity: data.capacity ?? null,
      registrationDeadline: data.registrationDeadline ? new Date(data.registrationDeadline) : null,
      status: data.status,
    },
  });

  revalidatePath("/admin/events");
  revalidatePath("/events");
  redirect("/admin/events");
}

export async function updateEvent(id: number, formData: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const raw = {
    title: formData.get("title"),
    slug: formData.get("slug") || undefined,
    description: formData.get("description") || undefined,
    location: formData.get("location") || undefined,
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate") || undefined,
    image: formData.get("image") || undefined,
    link: formData.get("link") || undefined,
    category: formData.get("category") || undefined,
    eventType: formData.get("eventType") || undefined,
    venueName: formData.get("venueName") || undefined,
    venueAddress: formData.get("venueAddress") || undefined,
    capacity: formData.get("capacity") || undefined,
    registrationDeadline: formData.get("registrationDeadline") || undefined,
    status: formData.get("status") || "draft",
  };

  const parsed = eventFormSchema.safeParse(raw);
  if (!parsed.success) {
    redirect(`/admin/events/edit/${id}?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Invalid input")}`);
  }

  const data = parsed.data;
  const finalSlug = data.slug?.trim() || slugify(data.title);

  await prisma.event.update({
    where: { id },
    data: {
      title: data.title,
      slug: finalSlug,
      description: data.description || null,
      location: data.location || null,
      startDate: new Date(data.startDate),
      endDate: data.endDate ? new Date(data.endDate) : null,
      image: data.image || null,
      link: data.link || null,
      category: data.category || null,
      eventType: data.eventType || null,
      venueName: data.venueName || null,
      venueAddress: data.venueAddress || null,
      capacity: data.capacity ?? null,
      registrationDeadline: data.registrationDeadline ? new Date(data.registrationDeadline) : null,
      status: data.status,
    },
  });

  revalidatePath("/admin/events");
  revalidatePath(`/admin/events/edit/${id}`);
  revalidatePath("/events");
  revalidatePath("/");
  redirect("/admin/events");
}

export async function deleteEvent(id: number, _formData?: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const event = await prisma.event.findUnique({ where: { id } });
  if (event?.slug) {
    await prisma.eventRegistration.deleteMany({ where: { eventSlug: event.slug } });
  } else {
    await prisma.eventRegistration.deleteMany({ where: { eventId: id } });
  }
  await prisma.event.delete({ where: { id } });

  revalidatePath("/admin/events");
  revalidatePath("/events");
  revalidatePath("/");
  redirect("/admin/events");
}
