import { NextResponse } from "next/server";
import { Resend } from "resend";
import { prisma } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";
import { getSiteSettings } from "@/lib/site-settings";
import { escapeHtml, nl2br } from "@/lib/sanitize";
import { logApi } from "@/lib/api-log";
import { subscribeSchema } from "@/lib/validations";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const ROUTE = "POST /api/subscribe";

function getClientIp(request: Request): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}

export async function POST(request: Request) {
  try {
    const siteSettings = await getSiteSettings();
    const ip = getClientIp(request);
    const { success, retryAfter } = await rateLimit(`subscribe:${ip}`);
    if (!success) {
      logApi(ROUTE, "warn", "rate_limited");
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429, headers: { "Retry-After": String(retryAfter ?? 60) } }
      );
    }

    const body = await request.json();
    const parsed = subscribeSchema.safeParse(body);

    if (!parsed.success) {
      logApi(ROUTE, "info", "validation_failed");
      const msg = parsed.error.issues[0]?.message || "Invalid input";
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    const data = parsed.data;
    const fullName = `${data.firstName.trim()} ${data.lastName.trim()}`;
    const selectedTopics = data.topics.length ? data.topics.join(", ") : "All updates";
    const message = [
      `First name: ${data.firstName}`,
      `Last name: ${data.lastName}`,
      `Email: ${data.email}`,
      `Job title: ${data.jobTitle}`,
      `Company/Organisation: ${data.company}`,
      `Sector: ${data.sector}`,
      `City: ${data.city}`,
      `Country: ${data.country}`,
      `Updates requested: ${selectedTopics}`,
    ].join("\n");

    await prisma.contactSubmission.create({
      data: {
        name: fullName,
        email: data.email,
        subject: "Subscribe request",
        message,
      },
    });

    if (resend) {
      const { error } = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
        to: siteSettings.email.programs,
        replyTo: data.email,
        subject: `[AGC Subscribe] ${fullName}`,
        html: `
          <h2>New subscription request</h2>
          <p><strong>Name:</strong> ${escapeHtml(fullName)}</p>
          <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
          <p><strong>Job title:</strong> ${escapeHtml(data.jobTitle)}</p>
          <p><strong>Company/Organisation:</strong> ${escapeHtml(data.company)}</p>
          <p><strong>Sector:</strong> ${escapeHtml(data.sector)}</p>
          <p><strong>City:</strong> ${escapeHtml(data.city)}</p>
          <p><strong>Country:</strong> ${escapeHtml(data.country)}</p>
          <p><strong>Updates requested:</strong> ${escapeHtml(selectedTopics)}</p>
          <p><strong>Full submission:</strong></p>
          <p>${nl2br(message)}</p>
        `,
      });

      if (error) {
        console.error("Resend subscribe error:", error);
      }
    }

    logApi(ROUTE, "info", "submitted", { emailFailed: false });
    return NextResponse.json({ success: true });
  } catch (err) {
    logApi(ROUTE, "error", "unhandled_exception");
    console.error("Subscribe API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}