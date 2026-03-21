import { randomBytes } from "crypto";

/** Generate short registration ID: AGC-EV-2025-XXXXXX */
export function generateRegistrationId(): string {
  const year = new Date().getFullYear();
  const suffix = randomBytes(3).toString("hex").toUpperCase();
  return `AGC-EV-${year}-${suffix}`;
}

/** Generate unique QR token for validation */
export function generateQrToken(): string {
  return randomBytes(16).toString("hex");
}
