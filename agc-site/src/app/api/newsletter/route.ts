import { NextResponse } from "next/server";
import { Resend } from "resend";
import { prisma } from "@/lib/db";
import { siteConfig } from "@/data/content";
import { rateLimit } from "@/lib/rate-limit";
import { newsletterSchema } from "@/lib/validations";
import { escapeHtml } from "@/lib/sanitize";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

function getClientIp(request: Request): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const { success, retryAfter } = await rateLimit(`newsletter:${ip}`);
    if (!success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429, headers: { "Retry-After": String(retryAfter ?? 60) } }
      );
    }

    const body = await request.json();
    const parsed = newsletterSchema.safeParse(body);

    if (!parsed.success) {
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
      return NextResponse.json({ success: true });
    }

    // Notify programs
    // For full newsletter: integrate Resend Audiences, Mailchimp, etc.
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
      to: siteConfig.email.programs,
      subject: `[AGC Newsletter] New subscriber: ${email}`,
      html: `<p><strong>New newsletter signup:</strong> ${escapeHtml(email)}</p><p>Add this contact to your newsletter platform.</p>`,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Newsletter API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
