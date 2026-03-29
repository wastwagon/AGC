"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Resend } from "resend";
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
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:9200";

function idFromForm(formData: FormData): string | null {
  const v = formData.get("id");
  return typeof v === "string" && v.trim() ? v.trim() : null;
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

  const existing = await prisma.eventRegistration.findUnique({ where: { id } });
  if (!existing) redirect("/admin/events?error=" + encodeURIComponent("Registration not found"));
  if (!existing.waitlisted) {
    redirect(
      `/admin/events/${encodeURIComponent(existing.eventSlug)}?error=${encodeURIComponent("That guest is not on the waitlist.")}`
    );
  }

  try {
    const reg = await prisma.eventRegistration.update({
      where: { id },
      data: { waitlisted: false },
    });
    logApi(ROUTE_PROMOTE, "info", "promoted", { eventSlug: reg.eventSlug });
    revalidatePath(`/admin/events/${reg.eventSlug}`);
    revalidatePath("/admin/events");
    redirect(`/admin/events/${encodeURIComponent(reg.eventSlug)}?saved=promoted`);
  } catch (e) {
    logApi(ROUTE_PROMOTE, "error", "failed");
    console.error("promoteWaitlistRegistration:", e);
    redirect(`/admin/events?error=${encodeURIComponent(ADMIN_DB_ERROR_MESSAGE)}`);
  }
}
