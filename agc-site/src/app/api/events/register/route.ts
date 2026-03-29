import { NextResponse } from "next/server";
import { Resend } from "resend";
import { escapeHtml } from "@/lib/sanitize";
import { rateLimit } from "@/lib/rate-limit";
import { eventRegistrationSchema } from "@/lib/validations";
import { prisma } from "@/lib/db";
import { generateRegistrationId, generateQrToken } from "@/lib/event-registration";
import { getSiteSettings } from "@/lib/site-settings";
import { logApi } from "@/lib/api-log";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:9200";
const ROUTE = "POST /api/events/register";

function getClientIp(request: Request): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}

export async function POST(request: Request) {
  try {
    const siteSettings = await getSiteSettings();
    const ip = getClientIp(request);
    const { success, retryAfter } = await rateLimit(`event-register:${ip}`);
    if (!success) {
      logApi(ROUTE, "warn", "rate_limited");
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429, headers: { "Retry-After": String(retryAfter ?? 60) } }
      );
    }

    const body = await request.json();
    const parsed = eventRegistrationSchema.safeParse(body);

    if (!parsed.success) {
      logApi(ROUTE, "info", "validation_failed");
      const msg = parsed.error.issues[0]?.message || "Invalid input";
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    const data = parsed.data;

    const existing = await prisma.eventRegistration.findFirst({
      where: {
        eventSlug: data.eventSlug,
        email: { equals: data.email, mode: "insensitive" },
      },
      select: { id: true },
    });
    if (existing) {
      logApi(ROUTE, "info", "duplicate_registration");
      return NextResponse.json(
        { error: "You are already registered for this event. Check your email for your badge link, or contact the organiser." },
        { status: 409 }
      );
    }

    // Check registration deadline (if provided in payload)
    const deadline = (data as { registrationDeadline?: string }).registrationDeadline;
    if (deadline && new Date(deadline) < new Date()) {
      logApi(ROUTE, "info", "deadline_passed");
      return NextResponse.json({ error: "Registration for this event has closed." }, { status: 400 });
    }

    // Check capacity (count existing registrations)
    const capacity = (data as { capacity?: number }).capacity;
    if (typeof capacity === "number") {
      const currentCount = await prisma.eventRegistration.count({ where: { eventSlug: data.eventSlug } });
      if (currentCount >= capacity) {
        logApi(ROUTE, "info", "capacity_full");
        return NextResponse.json({ error: "This event has reached maximum capacity." }, { status: 400 });
      }
    }

    const registrationId = generateRegistrationId();
    const qrToken = generateQrToken();

    const registration = await prisma.eventRegistration.create({
      data: {
        eventSlug: data.eventSlug,
        eventId: data.eventId,
        eventTitle: data.eventTitle,
        eventStartDate: new Date(data.eventStartDate),
        eventEndDate: data.eventEndDate ? new Date(data.eventEndDate) : null,
        eventLocation: data.eventLocation,
        registrationId,
        qrToken,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        organization: data.organization,
        dietaryReqs: data.dietaryReqs,
      },
    });

    const badgeUrl = `${baseUrl}/events/badge/${registration.id}`;
    const eventDate = new Date(data.eventStartDate).toLocaleDateString("en-GB", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    if (resend) {
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
        to: data.email,
        subject: `Event Registration Confirmed – ${data.eventTitle}`,
        html: `
          <h2>Registration Confirmed</h2>
          <p>Dear ${escapeHtml(data.fullName)},</p>
          <p>Your registration for <strong>${escapeHtml(data.eventTitle)}</strong> has been confirmed.</p>
          <p><strong>Registration ID:</strong> ${registrationId}</p>
          <p><strong>Date:</strong> ${eventDate}</p>
          ${data.eventLocation ? `<p><strong>Location:</strong> ${escapeHtml(data.eventLocation)}</p>` : ""}
          <p>Download and print your accreditation badge here:</p>
          <p><a href="${badgeUrl}" style="display:inline-block;background:#0d9488;color:white;padding:12px 24px;text-decoration:none;border-radius:8px;font-weight:600;">Download Badge</a></p>
          <p>Present your badge (or Registration ID) at the event for check-in. The badge contains a QR code that will be scanned to confirm your attendance.</p>
          <p>If you have any questions, contact us at ${siteSettings.email.programs}.</p>
          <p>Best regards,<br>Africa Governance Centre</p>
        `,
      });
    }

    logApi(ROUTE, "info", "registered");
    return NextResponse.json({
      success: true,
      registration: {
        id: registration.id,
        registrationId: registration.registrationId,
        badgeUrl,
      },
    });
  } catch (err) {
    logApi(ROUTE, "error", "unhandled_exception");
    console.error("Event registration error:", err);
    return NextResponse.json({ error: "Registration failed. Please try again." }, { status: 500 });
  }
}
