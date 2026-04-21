/** Shared copy for public event pages (Brookings-style layouts). */

export function timeZoneShort(d: Date): string {
  const parts = new Intl.DateTimeFormat("en-US", { timeZoneName: "short" }).formatToParts(d);
  return parts.find((p) => p.type === "timeZoneName")?.value ?? "";
}

/** Left column e.g. `10:00 am – 11:00 am EDT` */
export function formatEventTimeRangeLower(start: string, end?: string): string {
  const s = new Date(start);
  if (Number.isNaN(s.getTime())) return "";
  const timeOpts: Intl.DateTimeFormatOptions = { hour: "numeric", minute: "2-digit", hour12: true };
  const a = s.toLocaleTimeString("en-US", timeOpts).toLowerCase();
  const tz = timeZoneShort(s);
  if (end && end !== start) {
    const e = new Date(end);
    if (!Number.isNaN(e.getTime())) {
      const b = e.toLocaleTimeString("en-US", timeOpts).toLowerCase();
      return `${a} – ${b}${tz ? ` ${tz}` : ""}`;
    }
  }
  return `${a}${tz ? ` ${tz}` : ""}`;
}

/** One line under title: `Monday, April 27, 2026, 10:00 – 11:00 a.m.` */
export function formatRegistrationScheduleLine(start: string, end?: string): string {
  const s = new Date(start);
  if (Number.isNaN(s.getTime())) return "";
  const datePart = s.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const timeOpts: Intl.DateTimeFormatOptions = { hour: "numeric", minute: "2-digit", hour12: true };
  const t1 = s.toLocaleTimeString("en-US", timeOpts);
  if (end && end !== start) {
    const e = new Date(end);
    if (!Number.isNaN(e.getTime())) {
      const t2 = e.toLocaleTimeString("en-US", timeOpts);
      return `${datePart}, ${t1} – ${t2}`;
    }
  }
  return `${datePart}, ${t1}`;
}

export function eventLocationSentence(event: {
  venue_name?: string;
  venue_address?: string;
  location?: string;
}): string {
  const parts = [event.venue_name, event.venue_address, event.location]
    .map((p) => p?.trim())
    .filter((p): p is string => Boolean(p));
  if (parts.length === 0) return "";
  const seen = new Set<string>();
  return parts.filter((p) => (seen.has(p) ? false : (seen.add(p), true))).join(", ");
}
