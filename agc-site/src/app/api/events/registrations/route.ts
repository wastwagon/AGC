import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-api";

export async function GET(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const { searchParams } = new URL(request.url);
    const eventSlug = searchParams.get("eventSlug");

    const where = eventSlug ? { eventSlug } : {};

    const registrations = await prisma.eventRegistration.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ registrations });
  } catch (err) {
    console.error("Registrations list error:", err);
    return NextResponse.json({ error: "Failed to fetch registrations" }, { status: 500 });
  }
}
