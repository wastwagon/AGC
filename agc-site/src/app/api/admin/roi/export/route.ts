import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-api";
import { prisma } from "@/lib/db";
import { toCsvRow } from "@/lib/csv-escape";

export async function GET(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const event = request.nextUrl.searchParams.get("event");
  const status = request.nextUrl.searchParams.get("status");
  if (event !== "apps" && event !== "aypf" && event !== "awpls") {
    return NextResponse.json({ error: "Invalid event" }, { status: 400 });
  }

  try {
    const rows = await prisma.registrationOfInterest.findMany({
      where: {
        eventType: event,
        ...(status === "pending" ||
        status === "under_review" ||
        status === "approved" ||
        status === "declined"
          ? { reviewStatus: status }
          : {}),
      },
      orderBy: { createdAt: "desc" },
    });

    const lines = [
      toCsvRow([
        "id",
        "event_type",
        "review_status",
        "title",
        "full_name",
        "job_title",
        "organisation",
        "country",
        "email",
        "telephone",
        "organisation_type",
        "participation_type",
        "areas_of_interest",
        "previous_participation",
        "visa_support",
        "accessibility_reqs",
        "dietary_reqs",
        "how_heard",
        "review_notes",
        "reviewed_at",
        "created_at",
      ]),
      ...rows.map((r) =>
        toCsvRow([
          String(r.id),
          r.eventType,
          r.reviewStatus,
          r.title ?? "",
          r.fullName,
          r.jobTitle,
          r.organisation,
          r.country,
          r.email,
          r.telephone,
          r.organisationType,
          r.participationType,
          r.areasOfInterest,
          r.previousParticipation ? "yes" : "no",
          r.visaSupport ? "yes" : "no",
          r.accessibilityReqs ?? "",
          r.dietaryReqs ?? "",
          r.howHeard,
          r.reviewNotes ?? "",
          r.reviewedAt?.toISOString() ?? "",
          r.createdAt.toISOString(),
        ])
      ),
    ];

    return new NextResponse("\uFEFF" + lines.join(""), {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="roi-${event}.csv"`,
      },
    });
  } catch (err) {
    console.error("ROI export error:", err);
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }
}
