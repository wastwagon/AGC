import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-api";
import { escapeCsvCell } from "@/lib/csv";

export async function GET(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const { searchParams } = new URL(request.url);
    const eventSlug = searchParams.get("eventSlug");

    if (!eventSlug) {
      return NextResponse.json({ error: "eventSlug required" }, { status: 400 });
    }

    const registrations = await prisma.eventRegistration.findMany({
      where: { eventSlug },
      orderBy: { createdAt: "desc" },
    });

    const headers = [
      "Name",
      "Email",
      "Phone",
      "Organization",
      "Dietary Requirements",
      "Registration ID",
      "Waitlisted",
      "Checked In",
      "Registered At",
    ];

    const rows = registrations.map((r) => [
      r.fullName,
      r.email,
      r.phone || "",
      r.organization || "",
      r.dietaryReqs || "",
      r.registrationId,
      r.waitlisted ? "Yes" : "No",
      r.checkedInAt ? "Yes" : "No",
      r.createdAt.toISOString(),
    ]);

    const csv = [headers.map(escapeCsvCell).join(","), ...rows.map((row) => row.map(escapeCsvCell).join(","))].join("\n");

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="registrations-${eventSlug}.csv"`,
      },
    });
  } catch (err) {
    console.error("Export error:", err);
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }
}
