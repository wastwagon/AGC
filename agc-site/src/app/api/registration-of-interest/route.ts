import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";
import { getSiteSettings } from "@/lib/site-settings";
import { registrationOfInterestSchema } from "@/lib/validations";
import { logApi } from "@/lib/api-log";
import { getRoiFormConfig } from "@/data/roi-forms";
import { buildRoiAdminNotifyEmailHtml, buildRoiConfirmationEmailHtml } from "@/lib/roi-email";
import { isRoiSmtpConfigured, sendRoiSmtpMail } from "@/lib/roi-smtp";

const ROUTE = "POST /api/registration-of-interest";

function getClientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function POST(request: Request) {
  try {
    const siteSettings = await getSiteSettings();
    const ip = getClientIp(request);
    const { success, retryAfter } = await rateLimit(`roi:${ip}`);
    if (!success) {
      logApi(ROUTE, "warn", "rate_limited");
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429, headers: { "Retry-After": String(retryAfter ?? 60) } }
      );
    }

    const body = await request.json();
    if (body?.website) {
      return NextResponse.json({ success: true });
    }

    const parsed = registrationOfInterestSchema.safeParse(body);
    if (!parsed.success) {
      logApi(ROUTE, "info", "validation_failed");
      const msg = parsed.error.issues[0]?.message || "Invalid input";
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    const data = parsed.data;
    const config = getRoiFormConfig(data.eventType);
    if (!config) {
      return NextResponse.json({ error: "Invalid event" }, { status: 400 });
    }

    const allowedTitles = new Set(config.titles);
    const allowedOrgTypes = new Set(config.organisationTypes);
    const allowedParticipation = new Set(config.participationTypes);
    const allowedAreas = new Set(config.areasOfInterest);
    const allowedHowHeard = new Set(config.howHeardOptions);

    if (data.title && !allowedTitles.has(data.title)) {
      return NextResponse.json({ error: "Invalid title" }, { status: 400 });
    }
    if (!allowedOrgTypes.has(data.organisationType)) {
      return NextResponse.json({ error: "Invalid organisation type" }, { status: 400 });
    }
    if (!allowedParticipation.has(data.participationType)) {
      return NextResponse.json({ error: "Invalid participation type" }, { status: 400 });
    }
    if (data.areasOfInterest.some((a) => !allowedAreas.has(a))) {
      return NextResponse.json({ error: "Invalid area of interest" }, { status: 400 });
    }
    if (!allowedHowHeard.has(data.howHeard)) {
      return NextResponse.json({ error: "Invalid how-heard option" }, { status: 400 });
    }

    const row = await prisma.registrationOfInterest.create({
      data: {
        eventType: data.eventType,
        title: data.title?.trim() || null,
        fullName: data.fullName.trim(),
        jobTitle: data.jobTitle.trim(),
        organisation: data.organisation.trim(),
        country: data.country.trim(),
        email: data.email.trim().toLowerCase(),
        telephone: data.telephone.trim(),
        organisationType: data.organisationType,
        participationType: data.participationType,
        areasOfInterest: JSON.stringify(data.areasOfInterest),
        previousParticipation: data.previousParticipation,
        visaSupport: data.visaSupport,
        accessibilityReqs: data.accessibilityReqs?.trim() || null,
        dietaryReqs: data.dietaryReqs?.trim() || null,
        howHeard: data.howHeard,
        reviewStatus: "pending",
      },
    });

    let emailFailed = false;
    const smtpReady = isRoiSmtpConfigured(data.eventType);

    if (!smtpReady) {
      console.warn(`ROI SMTP not configured for ${data.eventType}; submission ${row.id} saved without email.`);
      emailFailed = true;
    } else {
      const confirmationHtml = buildRoiConfirmationEmailHtml({
        fullName: data.fullName.trim(),
        config,
      });
      const adminHtml = buildRoiAdminNotifyEmailHtml({
        config,
        fullName: data.fullName.trim(),
        email: data.email.trim(),
        organisation: data.organisation.trim(),
        country: data.country.trim(),
        participationType: data.participationType,
        organisationType: data.organisationType,
        id: row.id,
      });

      const [confirmResult, adminResult] = await Promise.all([
        sendRoiSmtpMail({
          eventType: data.eventType,
          to: data.email.trim(),
          subject: `Registration of Interest received — ${config.shortName} ${config.year}`,
          html: confirmationHtml,
        }),
        sendRoiSmtpMail({
          eventType: data.eventType,
          to: siteSettings.email.programs,
          replyTo: data.email.trim(),
          subject: `[${config.shortName}] New Registration of Interest — ${data.fullName.trim()}`,
          html: adminHtml,
        }),
      ]);

      if (!confirmResult.ok || !adminResult.ok) {
        emailFailed = true;
      }
    }

    logApi(ROUTE, "info", "submitted", { eventType: data.eventType, emailFailed, smtpReady });
    return NextResponse.json({
      success: true,
      emailFailed,
      confirmation: {
        title: config.confirmationTitle,
        body: config.confirmationBody,
      },
    });
  } catch (err) {
    logApi(ROUTE, "error", "unhandled_exception");
    console.error("ROI API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
