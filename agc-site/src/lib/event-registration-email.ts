import { escapeHtml } from "@/lib/sanitize";

export function buildRegistrationConfirmationEmailHtml(opts: {
  fullName: string;
  eventTitle: string;
  registrationId: string;
  eventDate: string;
  eventLocation?: string | null;
  badgeUrl: string;
  programsEmail: string;
  waitlisted: boolean;
  /** Email sent after staff promotes from waitlist — same badge, now eligible for check-in. */
  promotedFromWaitlist?: boolean;
}): string {
  const loc = opts.eventLocation ? `<p><strong>Location:</strong> ${escapeHtml(opts.eventLocation)}</p>` : "";
  if (opts.waitlisted) {
    return `
          <h2>You’re on the waitlist</h2>
          <p>Dear ${escapeHtml(opts.fullName)},</p>
          <p>Capacity is full for <strong>${escapeHtml(opts.eventTitle)}</strong>. We’ve recorded your details as a <strong>waitlist</strong> place.</p>
          <p><strong>Registration ID:</strong> ${escapeHtml(opts.registrationId)}</p>
          <p><strong>Date:</strong> ${escapeHtml(opts.eventDate)}</p>
          ${loc}
          <p>You can download a reference badge below. <strong>Waitlisted guests cannot self check-in</strong> until staff confirms a spot — please see the registration desk.</p>
          <p><a href="${opts.badgeUrl}" style="display:inline-block;background:#0d9488;color:white;padding:12px 24px;text-decoration:none;border-radius:8px;font-weight:600;">Open badge</a></p>
          <p>If you have any questions, contact us at ${escapeHtml(opts.programsEmail)}.</p>
          <p>Best regards,<br>Africa Governance Centre</p>
        `;
  }
  const intro = opts.promotedFromWaitlist
    ? `<p>Good news — a place has opened up. Your registration for <strong>${escapeHtml(opts.eventTitle)}</strong> is now <strong>confirmed</strong> (no longer on the waitlist). You may check in at the venue with your badge or registration ID.</p>`
    : `<p>Your registration for <strong>${escapeHtml(opts.eventTitle)}</strong> has been confirmed.</p>`;
  const heading = opts.promotedFromWaitlist ? "Your spot is confirmed" : "Registration Confirmed";

  return `
          <h2>${heading}</h2>
          <p>Dear ${escapeHtml(opts.fullName)},</p>
          ${intro}
          <p><strong>Registration ID:</strong> ${escapeHtml(opts.registrationId)}</p>
          <p><strong>Date:</strong> ${escapeHtml(opts.eventDate)}</p>
          ${loc}
          <p>Download and print your accreditation badge here:</p>
          <p><a href="${opts.badgeUrl}" style="display:inline-block;background:#0d9488;color:white;padding:12px 24px;text-decoration:none;border-radius:8px;font-weight:600;">Download Badge</a></p>
          <p>Present your badge (or Registration ID) at the event for check-in. The badge contains a QR code that will be scanned to confirm your attendance.</p>
          <p>If you have any questions, contact us at ${escapeHtml(opts.programsEmail)}.</p>
          <p>Best regards,<br>Africa Governance Centre</p>
        `;
}
