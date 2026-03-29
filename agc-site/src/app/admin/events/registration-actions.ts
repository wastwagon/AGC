"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Resend } from "resend";
import type { EventRegistration } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { getSiteSettings } from "@/lib/site-settings";
import { buildRegistrationConfirmationEmailHtml } from "@/lib/event-registration-email";
import { ADMIN_DB_ERROR_MESSAGE } from "@/lib/admin-flash-messages";
import { logApi } from "@/lib/api-log";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const ROUTE_RESEND = "admin/resendEventRegistrationEmail";
const ROUTE_UNDO = "admin/undoEventRegistrationCheckIn";
const ROUTE_PROMOTE = "admin/promoteWaitlistRegistration";
const ROUTE_PROMOTE_NEXT = "admin/promoteNextWaitlistedGuest";
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:9200";

function idFromForm(formData: FormData): string | null {
  const v = formData.get("id");
  return typeof v === "string" && v.trim() ? v.trim() : null;
}

/** When event has a numeric capacity, block promotion if confirmed (non-waitlist) count already fills it. */
async function capacityBlockMessageForPromotion(eventSlug: string): Promise<string | null> {
  const ev = await prisma.event.findFirst({
    where: { slug: eventSlug },
    select: { capacity: true },
  });
  if (!ev || ev.capacity == null) return null;
  const confirmed = await prisma.eventRegistration.count({
    where: { eventSlug, waitlisted: false },
  });
  if (confirmed >= ev.capacity) {
    return "At capacity — no free slot to promote from the waitlist. Increase the event capacity or remove a confirmed registration first.";
  }
  return null;
}

async function sendWaitlistPromotionEmail(reg: EventRegistration, logRoute: string) {
  if (!resend) return;
  const siteSettings = await getSiteSettings();
  const badgeUrl = `${baseUrl}/events/badge/${reg.id}`;
  const eventDate = new Date(reg.eventStartDate).toLocaleDateString("en-GB", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
      to: reg.email,
      subject: `Your spot is confirmed – ${reg.eventTitle}`,
      html: buildRegistrationConfirmationEmailHtml({
        fullName: reg.fullName,
        eventTitle: reg.eventTitle,
        registrationId: reg.registrationId,
        eventDate,
        eventLocation: reg.eventLocation,
        badgeUrl,
        programsEmail: siteSettings.email.programs,
        waitlisted: false,
        promotedFromWaitlist: true,
      }),
    });
    logApi(logRoute, "info", "promotion_email_sent", { eventSlug: reg.eventSlug });
  } catch (e) {
    logApi(logRoute, "warn", "promotion_email_failed", { eventSlug: reg.eventSlug });
    console.error("sendWaitlistPromotionEmail:", e);
  }
}

type PromoteCoreResult =
  | { ok: true; reg: EventRegistration }
  | { ok: false; redirectUrl: string };

async function promoteWaitlistedRegistrationCore(registrationId: string): Promise<PromoteCoreResult> {
  const existing = await prisma.eventRegistration.findUnique({ where: { id: registrationId } });
  if (!existing) {
    return { ok: false, redirectUrl: `/admin/events?error=${encodeURIComponent("Registration not found")}` };
  }
  if (!existing.waitlisted) {
    return {
      ok: false,
      redirectUrl: `/admin/events/${encodeURIComponent(existing.eventSlug)}?error=${encodeURIComponent("That guest is not on the waitlist.")}`,
    };
  }

  const capMsg = await capacityBlockMessageForPromotion(existing.eventSlug);
  if (capMsg) {
    return {
      ok: false,
      redirectUrl: `/admin/events/${encodeURIComponent(existing.eventSlug)}?error=${encodeURIComponent(capMsg)}`,
    };
  }

  try {
    const reg = await prisma.eventRegistration.update({
      where: { id: registrationId },
      data: { waitlisted: false },
    });
    return { ok: true, reg };
  } catch (e) {
    console.error("promoteWaitlistedRegistrationCore:", e);
    return { ok: false, redirectUrl: `/admin/events?error=${encodeURIComponent(ADMIN_DB_ERROR_MESSAGE)}` };
  }
}

export async function resendEventRegistrationEmail(formData: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const id = idFromForm(formData);
  if (!id) redirect("/admin/events?error=" + encodeURIComponent("Missing registration id"));

  const reg = await prisma.eventRegistration.findUnique({ where: { id } });
  if (!reg) redirect("/admin/events?error=" + encodeURIComponent("Registration not found"));

  if (!resend) {
    redirect(
      `/admin/events/${encodeURIComponent(reg.eventSlug)}?error=${encodeURIComponent("Email is not configured (RESEND_API_KEY).")}`
    );
  }

  const siteSettings = await getSiteSettings();
  const badgeUrl = `${baseUrl}/events/badge/${reg.id}`;
  const eventDate = new Date(reg.eventStartDate).toLocaleDateString("en-GB", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
      to: reg.email,
      subject: reg.waitlisted
        ? `Waitlist – ${reg.eventTitle}`
        : `Event Registration Confirmed – ${reg.eventTitle}`,
      html: buildRegistrationConfirmationEmailHtml({
        fullName: reg.fullName,
        eventTitle: reg.eventTitle,
        registrationId: reg.registrationId,
        eventDate,
        eventLocation: reg.eventLocation,
        badgeUrl,
        programsEmail: siteSettings.email.programs,
        waitlisted: reg.waitlisted,
      }),
    });
  } catch (e) {
    logApi(ROUTE_RESEND, "error", "send_failed", { eventSlug: reg.eventSlug });
    console.error("resendEventRegistrationEmail:", e);
    redirect(
      `/admin/events/${encodeURIComponent(reg.eventSlug)}?error=${encodeURIComponent("Failed to send email.")}`
    );
  }

  logApi(ROUTE_RESEND, "info", "sent", { eventSlug: reg.eventSlug });
  revalidatePath(`/admin/events/${reg.eventSlug}`);
  revalidatePath("/admin/events");
  redirect(`/admin/events/${encodeURIComponent(reg.eventSlug)}?saved=resent`);
}

export async function undoEventRegistrationCheckIn(formData: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const id = idFromForm(formData);
  if (!id) redirect("/admin/events?error=" + encodeURIComponent("Missing registration id"));

  try {
    const reg = await prisma.eventRegistration.update({
      where: { id },
      data: { checkedInAt: null },
    });
    logApi(ROUTE_UNDO, "info", "cleared", { eventSlug: reg.eventSlug });
    revalidatePath(`/admin/events/${reg.eventSlug}`);
    revalidatePath("/admin/events");
    redirect(`/admin/events/${encodeURIComponent(reg.eventSlug)}?saved=checkin_cleared`);
  } catch (e) {
    logApi(ROUTE_UNDO, "error", "failed");
    console.error("undoEventRegistrationCheckIn:", e);
    redirect(`/admin/events?error=${encodeURIComponent(ADMIN_DB_ERROR_MESSAGE)}`);
  }
}

export async function promoteWaitlistRegistration(formData: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const id = idFromForm(formData);
  if (!id) redirect("/admin/events?error=" + encodeURIComponent("Missing registration id"));

  const result = await promoteWaitlistedRegistrationCore(id);
  if (!result.ok) {
    redirect(result.redirectUrl);
  }

  logApi(ROUTE_PROMOTE, "info", "promoted", { eventSlug: result.reg.eventSlug });
  await sendWaitlistPromotionEmail(result.reg, ROUTE_PROMOTE);
  revalidatePath(`/admin/events/${result.reg.eventSlug}`);
  revalidatePath("/admin/events");
  redirect(`/admin/events/${encodeURIComponent(result.reg.eventSlug)}?saved=promoted`);
}

export async function promoteNextWaitlistedGuest(formData: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const raw = formData.get("eventSlug");
  const eventSlug = typeof raw === "string" ? raw.trim() : "";
  if (!eventSlug) redirect("/admin/events?error=" + encodeURIComponent("Missing event"));

  const next = await prisma.eventRegistration.findFirst({
    where: { eventSlug, waitlisted: true },
    orderBy: { createdAt: "asc" },
  });

  if (!next) {
    redirect(
      `/admin/events/${encodeURIComponent(eventSlug)}?error=${encodeURIComponent("No one is on the waitlist.")}`
    );
  }

  const result = await promoteWaitlistedRegistrationCore(next.id);
  if (!result.ok) {
    redirect(result.redirectUrl);
  }

  logApi(ROUTE_PROMOTE_NEXT, "info", "promoted_fifo", { eventSlug: result.reg.eventSlug });
  await sendWaitlistPromotionEmail(result.reg, ROUTE_PROMOTE_NEXT);
  revalidatePath(`/admin/events/${result.reg.eventSlug}`);
  revalidatePath("/admin/events");
  redirect(`/admin/events/${encodeURIComponent(result.reg.eventSlug)}?saved=promoted`);
}
