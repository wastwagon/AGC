/**
 * Normalize camera/manual input for check-in: raw QR secret, badge URL, or registration ID.
 */
export type NormalizedCheckInInput =
  | { kind: "badgeId"; value: string }
  | { kind: "qrToken"; value: string }
  | { kind: "registrationId"; value: string };

export function normalizeCheckInScanInput(raw: string): NormalizedCheckInInput | null {
  const t = raw.trim();
  if (!t) return null;

  const badgeMatch = t.match(/\/events\/badge\/([^/?#]+)\/?(?:\?.*)?(?:#.*)?$/i);
  if (badgeMatch?.[1]) {
    return { kind: "badgeId", value: badgeMatch[1] };
  }

  if (/^[a-f0-9]{32}$/i.test(t)) {
    return { kind: "qrToken", value: t.toLowerCase() };
  }

  return { kind: "registrationId", value: t.replace(/\s+/g, "").toUpperCase() };
}
