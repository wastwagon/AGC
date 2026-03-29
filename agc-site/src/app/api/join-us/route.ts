import { NextResponse } from "next/server";
import { Resend } from "resend";
import { prisma } from "@/lib/db";
import { nl2br, escapeHtml } from "@/lib/sanitize";
import { rateLimit } from "@/lib/rate-limit";
import { getSiteSettings } from "@/lib/site-settings";
import { joinUsInquirySchema } from "@/lib/validations";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

function getClientIp(request: Request): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}

export async function POST(request: Request) {
  try {
    const siteSettings = await getSiteSettings();
    const ip = getClientIp(request);
    const { success, retryAfter } = await rateLimit(`join-us:${ip}`);
    if (!success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429, headers: { "Retry-After": String(retryAfter ?? 60) } }
      );
    }

    const body = await request.json();
    const parsed = joinUsInquirySchema.safeParse(body);
    if (!parsed.success) {
      const msg = parsed.error.issues[0]?.message || "Invalid input";
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    const { name, email, phone, organization, interestArea, message } = parsed.data;

    await prisma.joinUsInquiry.create({
      data: {
        name,
        email,
        phone: phone ?? null,
        organization: organization ?? null,
        interestArea: interestArea ?? null,
        message,
      },
    });

    let emailFailed = false;
    if (resend) {
      const { error } = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
        to: siteSettings.email.programs,
        replyTo: email,
        subject: `[AGC Careers] Inquiry from ${escapeHtml(name)}`,
        html: `
          <h2>New “Work with us” inquiry</h2>
          <p><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Phone:</strong> ${phone ? escapeHtml(phone) : "—"}</p>
          <p><strong>Organization:</strong> ${organization ? escapeHtml(organization) : "—"}</p>
          <p><strong>Interest:</strong> ${interestArea ? escapeHtml(interestArea) : "—"}</p>
          <p><strong>Message:</strong></p>
          <p>${nl2br(message)}</p>
        `,
      });
      if (error) {
        console.error("Resend join-us error:", error);
        emailFailed = true;
      }
    }

    return NextResponse.json({ success: true, emailFailed });
  } catch (err) {
    console.error("Join-us API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
