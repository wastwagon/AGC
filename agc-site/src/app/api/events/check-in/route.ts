import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-api";

export async function POST(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const body = await request.json();
    const { qrToken, registrationId } = body;

    const identifier = qrToken || registrationId;
    if (!identifier || typeof identifier !== "string") {
      return NextResponse.json(
        { valid: false, error: "QR token or registration ID required" },
        { status: 400 }
      );
    }

    const registration = await prisma.eventRegistration.findFirst({
      where: qrToken
        ? { qrToken: identifier }
        : { registrationId: identifier.toUpperCase().trim() },
    });

    if (!registration) {
      return NextResponse.json({
        valid: false,
        error: "Invalid badge",
        message: "No registration found. Badge may be invalid or expired.",
      });
    }

    if (registration.checkedInAt) {
      return NextResponse.json({
        valid: true,
        alreadyCheckedIn: true,
        registration: {
          fullName: registration.fullName,
          organization: registration.organization,
          eventTitle: registration.eventTitle,
          registrationId: registration.registrationId,
          checkedInAt: registration.checkedInAt,
        },
        message: "Already checked in",
      });
    }

    const updated = await prisma.eventRegistration.update({
      where: { id: registration.id },
      data: { checkedInAt: new Date() },
    });

    return NextResponse.json({
      valid: true,
      alreadyCheckedIn: false,
      registration: {
        fullName: updated.fullName,
        organization: updated.organization,
        eventTitle: updated.eventTitle,
        registrationId: updated.registrationId,
        checkedInAt: updated.checkedInAt,
      },
      message: "Check-in successful",
    });
  } catch (err) {
    console.error("Check-in error:", err);
    return NextResponse.json(
      { valid: false, error: "Check-in failed" },
      { status: 500 }
    );
  }
}
