import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

function icsEscape(s: string) {
  return s.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/;/g, "\\;").replace(/,/g, "\\,");
}

function formatIcsUtc(d: Date) {
  return d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

/** Public iCalendar download for a published event (`?slug=...`). */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug")?.trim();
  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  try {
    const e = await prisma.event.findFirst({
      where: { slug, status: "published" },
    });
    if (!e) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const start = e.startDate;
    const end = e.endDate ?? e.startDate;
    const endExclusive = new Date(end.getTime() + 60_000);

    const uid = `agc-event-${e.id}@agc-site`;
    const dtStamp = formatIcsUtc(new Date());
    const dtStart = formatIcsUtc(start);
    const dtEnd = formatIcsUtc(endExclusive);
    const summary = icsEscape(e.title);
    const loc = e.venueName || e.location;
    const location = loc ? icsEscape(loc) : "";
    const descParts = [e.description?.replace(/<[^>]+>/g, "").trim(), e.venueAddress].filter(Boolean);
    const description = icsEscape(descParts.join("\\n\\n"));

    const site = process.env.NEXT_PUBLIC_SITE_URL || "";
    const url = site ? `${site.replace(/\/$/, "")}/events/register/${encodeURIComponent(slug)}` : "";

    const lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Africa Governance Centre//Event//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      `UID:${uid}`,
      `DTSTAMP:${dtStamp}`,
      `DTSTART:${dtStart}`,
      `DTEND:${dtEnd}`,
      `SUMMARY:${summary}`,
    ];
    if (location) lines.push(`LOCATION:${location}`);
    if (description) lines.push(`DESCRIPTION:${description}`);
    if (url) lines.push(`URL:${url}`);
    lines.push("END:VEVENT", "END:VCALENDAR");

    const body = lines.join("\r\n") + "\r\n";

    return new NextResponse(body, {
      status: 200,
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": `attachment; filename="${slug.slice(0, 60)}.ics"`,
        "Cache-Control": "public, max-age=300",
      },
    });
  } catch (err) {
    console.error("ICS export:", err);
    return NextResponse.json({ error: "Failed to build calendar" }, { status: 500 });
  }
}
