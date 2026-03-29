import { NextResponse } from "next/server";
import { Resend } from "resend";
import { Prisma } from "@prisma/client";
import { rateLimit } from "@/lib/rate-limit";
import { eventRegistrationSchema } from "@/lib/validations";
import { prisma } from "@/lib/db";
import { generateRegistrationId, generateQrToken } from "@/lib/event-registration";
import { getSiteSettings } from "@/lib/site-settings";
import { logApi } from "@/lib/api-log";
import { buildRegistrationConfirmationEmailHtml } from "@/lib/event-registration-email";

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
    const emailNorm = data.email.trim().toLowerCase();

    const dbEvent = await prisma.event.findFirst({
      where: { slug: data.eventSlug, status: "published" },
      select: {
        capacity: true,
        registrationDeadline: true,
        allowWaitlist: true,
      },
    });

    let registrationDeadline: Date | null = null;
    let capacity: number | undefined;
    let allowWaitlist = false;

    if (dbEvent) {
      registrationDeadline = dbEvent.registrationDeadline;
      capacity = dbEvent.capacity ?? undefined;
      allowWaitlist = dbEvent.allowWaitlist;
    } else {
      const d = (data as { registrationDeadline?: string }).registrationDeadline;
      if (d) registrationDeadline = new Date(d);
      capacity = (data as { capacity?: number }).capacity;
    }

    if (registrationDeadline && registrationDeadline < new Date()) {
      logApi(ROUTE, "info", "deadline_passed");
      return NextResponse.json({ error: "Registration for this event has closed." }, { status: 400 });
    }

    const confirmedCount = await prisma.eventRegistration.count({
      where: { eventSlug: data.eventSlug, waitlisted: false },
    });

    let waitlisted = false;
    if (typeof capacity === "number" && capacity >= 0) {
      if (confirmedCount >= capacity) {
        if (allowWaitlist) {
          waitlisted = true;
        } else {
          logApi(ROUTE, "info", "capacity_full");
          return NextResponse.json({ error: "This event has reached maximum capacity." }, { status: 400 });
        }
      }
    }

    const registrationId = generateRegistrationId();
    const qrToken = generateQrToken();

    let registration;
    try {
      registration = await prisma.eventRegistration.create({
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
          email: emailNorm,
          phone: data.phone,
          organization: data.organization,
          dietaryReqs: data.dietaryReqs,
          waitlisted,
        },
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
        logApi(ROUTE, "info", "duplicate_registration");
        return NextResponse.json(
          {
            error:
              "You are already registered for this event. Check your email for your badge link, or contact the organiser.",
          },
          { status: 409 }
        );
      }
      throw err;
    }

    const badgeUrl = `${baseUrl}/events/badge/${registration.id}`;
    const eventDate = new Date(data.eventStartDate).toLocaleDateString("en-GB", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const emailHtml = buildRegistrationConfirmationEmailHtml({
      fullName: data.fullName,
      eventTitle: data.eventTitle,
      registrationId,
      eventDate,
      eventLocation: data.eventLocation,
      badgeUrl,
      programsEmail: siteSettings.email.programs,
      waitlisted,
    });

    if (resend) {
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
        to: emailNorm,
        subject: waitlisted
          ? `Waitlist – ${data.eventTitle}`
          : `Event Registration Confirmed – ${data.eventTitle}`,
        html: emailHtml,
      });
    }

    logApi(ROUTE, "info", waitlisted ? "waitlisted" : "registered");
    return NextResponse.json({
      success: true,
      registration: {
        id: registration.id,
        registrationId: registration.registrationId,
        badgeUrl,
        waitlisted,
      },
    });
  } catch (err) {
    logApi(ROUTE, "error", "unhandled_exception");
    console.error("Event registration error:", err);
    return NextResponse.json({ error: "Registration failed. Please try again." }, { status: 500 });
  }
}
