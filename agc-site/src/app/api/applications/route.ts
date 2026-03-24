import { NextResponse } from "next/server";
import { Resend } from "resend";
import { prisma } from "@/lib/db";
import { nl2br, escapeHtml } from "@/lib/sanitize";
import { rateLimit } from "@/lib/rate-limit";
import { getSiteSettings } from "@/lib/site-settings";
import { applicationSchema } from "@/lib/validations";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

function getClientIp(request: Request): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}

export async function POST(request: Request) {
  try {
    const siteSettings = await getSiteSettings();
    const ip = getClientIp(request);
    const { success, retryAfter } = await rateLimit(`applications:${ip}`);
    if (!success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429, headers: { "Retry-After": String(retryAfter ?? 60) } }
      );
    }

    const body = await request.json();
    const parsed = applicationSchema.safeParse(body);

    if (!parsed.success) {
      const msg = parsed.error.issues[0]?.message || "Invalid input";
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    const data = parsed.data;

    // Store in DB
    await prisma.volunteerApplication.create({
      data: {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone ?? null,
        position: data.position ?? null,
        organization: data.organization ?? null,
        country: data.country ?? null,
        city: data.city ?? null,
        experience: data.experience ?? null,
        skills: data.skills ?? null,
        motivation: data.motivation ?? null,
        availability: data.availability ?? null,
      },
    });

    if (!resend) {
      return NextResponse.json({ success: true });
    }

    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
      to: siteSettings.email.programs,
      replyTo: data.email,
      subject: `[AGC Volunteer] Application from ${escapeHtml(data.fullName)}`,
      html: `
        <h2>New Volunteer Application</h2>
        <p><strong>Full Name:</strong> ${escapeHtml(data.fullName)}</p>
        <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
        <p><strong>Phone:</strong> ${data.phone ? escapeHtml(data.phone) : "—"}</p>
        <p><strong>Position:</strong> ${data.position ? escapeHtml(data.position) : "—"}</p>
        <p><strong>Organization:</strong> ${data.organization ? escapeHtml(data.organization) : "—"}</p>
        <p><strong>Country:</strong> ${escapeHtml(data.country)}</p>
        <p><strong>City:</strong> ${escapeHtml(data.city)}</p>
        <p><strong>Availability:</strong> ${data.availability ? escapeHtml(data.availability) : "—"}</p>
        <h3>Relevant Experience</h3>
        <p>${data.experience ? nl2br(data.experience) : "—"}</p>
        <h3>Skills & Expertise</h3>
        <p>${data.skills ? nl2br(data.skills) : "—"}</p>
        <h3>Why volunteer with AGC?</h3>
        <p>${nl2br(data.motivation)}</p>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: "Failed to submit application" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Applications API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
