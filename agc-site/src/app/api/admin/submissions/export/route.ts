import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-api";
import { prisma } from "@/lib/db";
import { toCsvRow } from "@/lib/csv-escape";

export async function GET(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const type = request.nextUrl.searchParams.get("type");
  const allowed = ["contact", "application", "newsletter", "partnership"] as const;
  if (!type || !allowed.includes(type as (typeof allowed)[number])) {
    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  }

  try {
    let body: string;
    let filename: string;

    if (type === "contact") {
      const rows = await prisma.contactSubmission.findMany({ orderBy: { createdAt: "desc" } });
      const lines = [
        toCsvRow(["id", "name", "email", "subject", "message", "created_at"]),
        ...rows.map((r) =>
          toCsvRow([
            String(r.id),
            r.name,
            r.email,
            r.subject ?? "",
            r.message,
            r.createdAt.toISOString(),
          ])
        ),
      ];
      body = lines.join("");
      filename = "contact-submissions.csv";
    } else if (type === "application") {
      const rows = await prisma.volunteerApplication.findMany({ orderBy: { createdAt: "desc" } });
      const lines = [
        toCsvRow([
          "id",
          "application_type",
          "full_name",
          "email",
          "phone",
          "position",
          "organization",
          "country",
          "city",
          "experience",
          "skills",
          "motivation",
          "availability",
          "created_at",
        ]),
        ...rows.map((r) =>
          toCsvRow([
            String(r.id),
            r.applicationType,
            r.fullName,
            r.email,
            r.phone ?? "",
            r.position ?? "",
            r.organization ?? "",
            r.country ?? "",
            r.city ?? "",
            r.experience ?? "",
            r.skills ?? "",
            r.motivation ?? "",
            r.availability ?? "",
            r.createdAt.toISOString(),
          ])
        ),
      ];
      body = lines.join("");
      filename = "applications.csv";
    } else if (type === "newsletter") {
      const rows = await prisma.newsletterSignup.findMany({ orderBy: { createdAt: "desc" } });
      const lines = [toCsvRow(["id", "email", "created_at"]), ...rows.map((r) => toCsvRow([String(r.id), r.email, r.createdAt.toISOString()]))];
      body = lines.join("");
      filename = "newsletter-signups.csv";
    } else {
      const rows = await prisma.partnershipInquiry.findMany({ orderBy: { createdAt: "desc" } });
      const lines = [
        toCsvRow(["id", "name", "email", "organization", "focus_area", "message", "created_at"]),
        ...rows.map((r) =>
          toCsvRow([
            String(r.id),
            r.name,
            r.email,
            r.organization ?? "",
            r.focusArea ?? "",
            r.message,
            r.createdAt.toISOString(),
          ])
        ),
      ];
      body = lines.join("");
      filename = "partnership-inquiries.csv";
    }

    return new NextResponse("\uFEFF" + body, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (err) {
    console.error("Submissions export error:", err);
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }
}
