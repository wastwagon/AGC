import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";
import type { RoiEventType } from "@/data/roi-forms";

export type RoiSmtpConfig = {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  from: string;
};

function env(name: string): string {
  return (process.env[name] ?? "").trim();
}

function parsePort(raw: string, fallback: number): number {
  const n = parseInt(raw, 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

function parseSecure(raw: string, port: number): boolean {
  if (raw === "true" || raw === "1") return true;
  if (raw === "false" || raw === "0") return false;
  return port === 465;
}

const EVENT_PREFIX: Record<RoiEventType, string> = {
  apps: "SMTP_APPS",
  aypf: "SMTP_AYPF",
  awpls: "SMTP_AWPLS",
};

const DEFAULT_FROM: Record<RoiEventType, string> = {
  apps: "appi@africagovernancecentre.org",
  aypf: "aypf@africagovernancecentre.org",
  awpls: "awpls@africagovernancecentre.org",
};

/**
 * Resolve per-event SMTP settings.
 * Event-specific vars override shared `ROI_SMTP_*` defaults.
 */
export function getRoiSmtpConfig(eventType: RoiEventType): RoiSmtpConfig | null {
  const prefix = EVENT_PREFIX[eventType];
  const host = env(`${prefix}_HOST`) || env("ROI_SMTP_HOST");
  const user = env(`${prefix}_USER`) || env("ROI_SMTP_USER");
  const pass = env(`${prefix}_PASS`) || env("ROI_SMTP_PASS");
  const port = parsePort(env(`${prefix}_PORT`) || env("ROI_SMTP_PORT"), 587);
  const secure = parseSecure(env(`${prefix}_SECURE`) || env("ROI_SMTP_SECURE"), port);
  const from = env(`${prefix}_FROM`) || DEFAULT_FROM[eventType];

  if (!host || !user || !pass) return null;

  return { host, port, secure, user, pass, from };
}

export function isRoiSmtpConfigured(eventType: RoiEventType): boolean {
  return getRoiSmtpConfig(eventType) !== null;
}

export function createRoiSmtpTransport(config: RoiSmtpConfig): Transporter {
  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.pass,
    },
  });
}

export async function sendRoiSmtpMail(opts: {
  eventType: RoiEventType;
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const config = getRoiSmtpConfig(opts.eventType);
  if (!config) {
    return { ok: false, error: `SMTP not configured for ${opts.eventType}` };
  }

  try {
    const transport = createRoiSmtpTransport(config);
    await transport.sendMail({
      from: config.from,
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
      replyTo: opts.replyTo,
    });
    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "SMTP send failed";
    console.error(`ROI SMTP error (${opts.eventType}):`, err);
    return { ok: false, error: message };
  }
}
