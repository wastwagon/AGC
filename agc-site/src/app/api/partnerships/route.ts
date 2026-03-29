import { NextResponse } from "next/server";
import { Resend } from "resend";
import { prisma } from "@/lib/db";
import { nl2br, escapeHtml } from "@/lib/sanitize";
import { rateLimit } from "@/lib/rate-limit";
import { getSiteSettings } from "@/lib/site-settings";
import { partnershipInquirySchema } from "@/lib/validations";
import { logApi } from "@/lib/api-log";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const ROUTE = "POST /api/partnerships";

function getClientIp(request: Request): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}

export async function POST(request: Request) {
  try {
    const siteSettings = await getSiteSettings();
    const ip = getClientIp(request);
    const { success, retryAfter } = await rateLimit(`partnerships:${ip}`);
    if (!success) {
      logApi(ROUTE, "warn", "rate_limited");
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429, headers: { "Retry-After": String(retryAfter ?? 60) } }
      );
    }

    const body = await request.json();
    const parsed = partnershipInquirySchema.safeParse(body);
    if (!parsed.success) {
      logApi(ROUTE, "info", "validation_failed");
      const msg = parsed.error.issues[0]?.message || "Invalid input";
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    const { name, email, organization, focusArea, message } = parsed.data;

    await prisma.partnershipInquiry.create({
      data: {
        name,
        email,
        organization: organization ?? null,
        focusArea: focusArea ?? null,
        message,
      },
    });

    let emailFailed = false;
    if (resend) {
      const { error } = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
        to: siteSettings.email.programs,
        replyTo: email,
        subject: `[AGC Partnership] Inquiry from ${escapeHtml(name)}`,
        html: `
          <h2>New partnership inquiry</h2>
          <p><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Organization:</strong> ${organization ? escapeHtml(organization) : "—"}</p>
          <p><strong>Focus:</strong> ${focusArea ? escapeHtml(focusArea) : "—"}</p>
          <p><strong>Message:</strong></p>
          <p>${nl2br(message)}</p>
        `,
      });
      if (error) {
        console.error("Resend partnership error:", error);
        emailFailed = true;
      }
    }

    logApi(ROUTE, "info", "submitted", { emailFailed });
    return NextResponse.json({ success: true, emailFailed });
  } catch (err) {
    logApi(ROUTE, "error", "unhandled_exception");
    console.error("Partnerships API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
