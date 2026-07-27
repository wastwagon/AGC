import { escapeHtml } from "@/lib/sanitize";
import type { RoiFormConfig } from "@/data/roi-forms";

export function buildRoiConfirmationEmailHtml(opts: {
  fullName: string;
  config: RoiFormConfig;
}): string {
  const body = opts.config.confirmationBody
    .map((p) => `<p>${escapeHtml(p)}</p>`)
    .join("\n");
  return `
    <h2>${escapeHtml(opts.config.confirmationTitle)}</h2>
    <p>Dear ${escapeHtml(opts.fullName)},</p>
    ${body}
    <p>Best regards,<br>${escapeHtml(opts.config.secretariatLabel)}<br>Africa Governance Centre</p>
  `;
}

export function buildRoiAdminNotifyEmailHtml(opts: {
  config: RoiFormConfig;
  fullName: string;
  email: string;
  organisation: string;
  country: string;
  participationType: string;
  organisationType: string;
  id: number;
}): string {
  return `
    <h2>New Registration of Interest — ${escapeHtml(opts.config.shortName)}</h2>
    <p><strong>ID:</strong> ${opts.id}</p>
    <p><strong>Name:</strong> ${escapeHtml(opts.fullName)}</p>
    <p><strong>Email:</strong> ${escapeHtml(opts.email)}</p>
    <p><strong>Organisation:</strong> ${escapeHtml(opts.organisation)}</p>
    <p><strong>Country:</strong> ${escapeHtml(opts.country)}</p>
    <p><strong>Organisation type:</strong> ${escapeHtml(opts.organisationType)}</p>
    <p><strong>Intended participation:</strong> ${escapeHtml(opts.participationType)}</p>
    <p>Review this entry in Admin → ROI Forms.</p>
  `;
}
