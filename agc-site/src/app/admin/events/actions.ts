"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { eventFormSchema } from "@/lib/validations";
import { filterValidTeamIds, parseAgendaJsonField, parseSpeakerIdsFromForm } from "@/lib/event-admin-parse";
import { ADMIN_DB_ERROR_MESSAGE } from "@/lib/admin-flash-messages";

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function isEventSlugTaken(slug: string, excludeId?: number): Promise<boolean> {
  const existing = await prisma.event.findFirst({
    where: {
      slug,
      ...(typeof excludeId === "number" ? { id: { not: excludeId } } : {}),
    },
    select: { id: true },
  });
  return !!existing;
}

function isSlugUniqueConstraintError(err: unknown): boolean {
  if (!(err instanceof Prisma.PrismaClientKnownRequestError)) return false;
  if (err.code !== "P2002") return false;
  const target = err.meta?.target;
  if (Array.isArray(target)) return target.includes("slug");
  return typeof target === "string" ? target.includes("slug") : false;
}

export async function createEvent(formData: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const raw = {
    title: formData.get("title"),
    slug: formData.get("slug") || undefined,
    shortDescription: formData.get("shortDescription") || undefined,
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
    agendaJson: (() => {
      const v = formData.get("agendaJson");
      return typeof v === "string" ? v : undefined;
    })(),
  };

  const parsed = eventFormSchema.safeParse(raw);
  if (!parsed.success) {
    redirect(`/admin/events/new?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Invalid input")}`);
  }

  const data = parsed.data;
  const finalSlug = data.slug?.trim() || slugify(data.title);
  if (!finalSlug) {
    redirect(`/admin/events/new?error=${encodeURIComponent("Please provide a valid slug.")}`);
  }
  if (await isEventSlugTaken(finalSlug)) {
    redirect(`/admin/events/new?error=${encodeURIComponent("Slug already exists. Use a different slug.")}`);
  }

  let created;
  try {
    const agendaValue = parseAgendaJsonField(data.agendaJson);
    const speakerIdsRaw = parseSpeakerIdsFromForm(formData);
    const speakerIds = await filterValidTeamIds(prisma, speakerIdsRaw);
    const allowWaitlist = formData.get("allowWaitlist") === "on";
    created = await prisma.event.create({
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
        allowWaitlist,
        status: data.status,
        agenda: agendaValue === null ? Prisma.DbNull : (agendaValue as unknown as Prisma.InputJsonValue),
        speakerIds: speakerIds.length > 0 ? (speakerIds as unknown as Prisma.InputJsonValue) : Prisma.DbNull,
        ...(data.shortDescription !== undefined ? ({ shortDescription: data.shortDescription || null } as Record<string, unknown>) : {}),
      },
    });
  } catch (err) {
    if (isSlugUniqueConstraintError(err)) {
      redirect(`/admin/events/new?error=${encodeURIComponent("Slug already exists. Use a different slug.")}`);
    }
    console.error("createEvent:", err);
    redirect(`/admin/events/new?error=${encodeURIComponent(ADMIN_DB_ERROR_MESSAGE)}`);
  }

  revalidatePath("/admin/events");
  revalidatePath("/events");
  revalidatePath(`/events/register/${finalSlug}`);
  revalidatePath(`/events/${finalSlug}`);
  redirect(`/admin/events/edit/${created.id}?saved=created`);
}

export async function updateEvent(id: number, formData: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const raw = {
    title: formData.get("title"),
    slug: formData.get("slug") || undefined,
    shortDescription: formData.get("shortDescription") || undefined,
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
    agendaJson: (() => {
      const v = formData.get("agendaJson");
      return typeof v === "string" ? v : undefined;
    })(),
  };

  const parsed = eventFormSchema.safeParse(raw);
  if (!parsed.success) {
    redirect(`/admin/events/edit/${id}?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Invalid input")}`);
  }

  const data = parsed.data;
  const finalSlug = data.slug?.trim() || slugify(data.title);
  if (!finalSlug) {
    redirect(`/admin/events/edit/${id}?error=${encodeURIComponent("Please provide a valid slug.")}`);
  }
  if (await isEventSlugTaken(finalSlug, id)) {
    redirect(`/admin/events/edit/${id}?error=${encodeURIComponent("Slug already exists. Use a different slug.")}`);
  }

  try {
    const agendaValue = parseAgendaJsonField(data.agendaJson);
    const speakerIdsRaw = parseSpeakerIdsFromForm(formData);
    const speakerIds = await filterValidTeamIds(prisma, speakerIdsRaw);
    const allowWaitlist = formData.get("allowWaitlist") === "on";
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
        allowWaitlist,
        status: data.status,
        agenda: agendaValue === null ? Prisma.DbNull : (agendaValue as unknown as Prisma.InputJsonValue),
        speakerIds: speakerIds.length > 0 ? (speakerIds as unknown as Prisma.InputJsonValue) : Prisma.DbNull,
        ...(data.shortDescription !== undefined ? ({ shortDescription: data.shortDescription || null } as Record<string, unknown>) : {}),
      },
    });
  } catch (err) {
    if (isSlugUniqueConstraintError(err)) {
      redirect(`/admin/events/edit/${id}?error=${encodeURIComponent("Slug already exists. Use a different slug.")}`);
    }
    console.error("updateEvent:", err);
    redirect(`/admin/events/edit/${id}?error=${encodeURIComponent(ADMIN_DB_ERROR_MESSAGE)}`);
  }

  revalidatePath("/admin/events");
  revalidatePath(`/admin/events/edit/${id}`);
  revalidatePath("/events");
  revalidatePath("/");
  revalidatePath(`/events/register/${finalSlug}`);
  revalidatePath(`/events/${finalSlug}`);
  redirect(`/admin/events/edit/${id}?saved=1`);
}

export async function deleteEvent(id: number, _formData?: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  try {
    const event = await prisma.event.findUnique({ where: { id } });
    if (event?.slug) {
      await prisma.eventRegistration.deleteMany({ where: { eventSlug: event.slug } });
    } else {
      await prisma.eventRegistration.deleteMany({ where: { eventId: id } });
    }
    await prisma.event.delete({ where: { id } });
  } catch (err) {
    console.error("deleteEvent:", err);
    redirect(`/admin/events?error=${encodeURIComponent(ADMIN_DB_ERROR_MESSAGE)}`);
  }

  revalidatePath("/admin/events");
  revalidatePath("/events");
  revalidatePath("/");
  redirect("/admin/events?saved=deleted");
}
