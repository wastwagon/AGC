import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-api";
import { normalizeCheckInScanInput } from "@/lib/event-check-in";
import { logApi } from "@/lib/api-log";

const ROUTE = "POST /api/events/check-in";

export async function POST(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const body = await request.json();
    const { scan, qrToken, registrationId, expectedEventSlug } = body as {
      scan?: string;
      qrToken?: string;
      registrationId?: string;
      expectedEventSlug?: string;
    };

    const raw =
      typeof scan === "string" && scan.trim()
        ? scan
        : typeof qrToken === "string" && qrToken.trim()
          ? qrToken
          : typeof registrationId === "string" && registrationId.trim()
            ? registrationId
            : "";

    const normalized = normalizeCheckInScanInput(raw);
    if (!normalized) {
      logApi(ROUTE, "info", "validation_failed", { reason: "empty_scan" });
      return NextResponse.json(
        { valid: false, error: "QR token, badge URL, or registration ID required" },
        { status: 400 }
      );
    }

    const where =
      normalized.kind === "badgeId"
        ? { id: normalized.value }
        : normalized.kind === "qrToken"
          ? { qrToken: normalized.value }
          : { registrationId: normalized.value };

    const registration = await prisma.eventRegistration.findFirst({ where });

    if (!registration) {
      logApi(ROUTE, "info", "not_found", { inputKind: normalized.kind });
      return NextResponse.json({
        valid: false,
        error: "Invalid badge",
        message: "No registration found. Badge may be invalid or expired.",
      });
    }

    if (
      typeof expectedEventSlug === "string" &&
      expectedEventSlug.trim() &&
      registration.eventSlug !== expectedEventSlug.trim()
    ) {
      logApi(ROUTE, "warn", "wrong_event", { expected: expectedEventSlug.trim() });
      return NextResponse.json({
        valid: false,
        error: "Wrong event",
        message: `This badge is for “${registration.eventTitle}”. Open check-in from that event’s admin page, or use the global scanner without an event filter.`,
      });
    }

    if (registration.checkedInAt) {
      logApi(ROUTE, "info", "already_checked_in");
      return NextResponse.json({
        valid: true,
        alreadyCheckedIn: true,
        registration: {
          fullName: registration.fullName,
          organization: registration.organization,
          eventTitle: registration.eventTitle,
          registrationId: registration.registrationId,
          eventSlug: registration.eventSlug,
          checkedInAt: registration.checkedInAt,
        },
        message: "Already checked in",
      });
    }

    const updated = await prisma.eventRegistration.update({
      where: { id: registration.id },
      data: { checkedInAt: new Date() },
    });

    logApi(ROUTE, "info", "checked_in");
    return NextResponse.json({
      valid: true,
      alreadyCheckedIn: false,
      registration: {
        fullName: updated.fullName,
        organization: updated.organization,
        eventTitle: updated.eventTitle,
        registrationId: updated.registrationId,
        eventSlug: updated.eventSlug,
        checkedInAt: updated.checkedInAt,
      },
      message: "Check-in successful",
    });
  } catch (err) {
    logApi(ROUTE, "error", "unhandled_exception");
    console.error("Check-in error:", err);
    return NextResponse.json(
      { valid: false, error: "Check-in failed" },
      { status: 500 }
    );
  }
}
