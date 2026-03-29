import { NextResponse } from "next/server";
import { Resend } from "resend";
import { prisma } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";
import { getSiteSettings } from "@/lib/site-settings";
import { newsletterSchema } from "@/lib/validations";
import { escapeHtml } from "@/lib/sanitize";
import { logApi } from "@/lib/api-log";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const ROUTE = "POST /api/newsletter";

function getClientIp(request: Request): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}

export async function POST(request: Request) {
  try {
    const siteSettings = await getSiteSettings();
    const ip = getClientIp(request);
    const { success, retryAfter } = await rateLimit(`newsletter:${ip}`);
    if (!success) {
      logApi(ROUTE, "warn", "rate_limited");
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429, headers: { "Retry-After": String(retryAfter ?? 60) } }
      );
    }

    const body = await request.json();
    const parsed = newsletterSchema.safeParse(body);

    if (!parsed.success) {
      logApi(ROUTE, "info", "validation_failed");
      const msg = parsed.error.issues[0]?.message || "Invalid input";
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    const { email } = parsed.data;

    // Store in DB (ignore duplicate email)
    await prisma.newsletterSignup.upsert({
      where: { email: email.toLowerCase().trim() },
      create: { email: email.toLowerCase().trim() },
      update: {},
    });

    if (!resend) {
      logApi(ROUTE, "info", "subscribed");
      return NextResponse.json({ success: true });
    }

    // Notify programs
    // For full newsletter: integrate Resend Audiences, Mailchimp, etc.
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
      to: siteSettings.email.programs,
      subject: `[AGC Newsletter] New subscriber: ${email}`,
      html: `<p><strong>New newsletter signup:</strong> ${escapeHtml(email)}</p><p>Add this contact to your newsletter platform.</p>`,
    });

    logApi(ROUTE, "info", "subscribed");
    return NextResponse.json({ success: true });
  } catch (err) {
    logApi(ROUTE, "error", "unhandled_exception");
    console.error("Newsletter API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
