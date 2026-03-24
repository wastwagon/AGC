"use server";

import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

type MaintenanceTask = "migrate" | "seed";

export type MaintenanceResult = {
  ok: boolean;
  task: MaintenanceTask;
  command: string;
  summary: string;
  output: string;
};

function truncateOutput(raw: string, maxChars = 12000): string {
  if (raw.length <= maxChars) return raw;
  return `...output truncated...\n${raw.slice(raw.length - maxChars)}`;
}

function resolveMaintenanceEnv() {
  const env = { ...process.env };
  const db = (env.DATABASE_URL ?? "").trim();
  // Some local Prisma setups write prisma+postgres URLs to `.env`; maintenance commands
  // must use a real Postgres URL.
  if (!db || db.startsWith("prisma+postgres://")) {
    const dbPassword = env.AGC_DB_PASSWORD || "agc_secret";
    env.DATABASE_URL = `postgresql://agc:${dbPassword}@localhost:5436/agc?schema=public`;
  }
  return env;
}

async function runShell(command: string): Promise<{ ok: boolean; output: string }> {
  try {
    const { stdout, stderr } = await execFileAsync("sh", ["-lc", command], {
      cwd: process.cwd(),
      env: resolveMaintenanceEnv(),
      timeout: 180_000,
      maxBuffer: 8 * 1024 * 1024,
    });
    return { ok: true, output: `${stdout ?? ""}${stderr ?? ""}`.trim() };
  } catch (error: unknown) {
    const err = error as { stdout?: string; stderr?: string; message?: string };
    const output = `${err.stdout ?? ""}${err.stderr ?? ""}${err.message ? `\n${err.message}` : ""}`.trim();
    return { ok: false, output };
  }
}

export async function runMaintenanceTask(task: MaintenanceTask): Promise<MaintenanceResult> {
  if (task === "migrate") {
    const command = "npx prisma migrate deploy";
    const res = await runShell(command);
    return {
      ok: res.ok,
      task,
      command,
      summary: res.ok
        ? "Database migrations applied successfully."
        : "Migration failed. Check output and confirm Prisma CLI availability in your deployment runtime.",
      output: truncateOutput(res.output || "(no output)"),
    };
  }

  const command = "npm run db:seed";
  const res = await runShell(command);
  return {
    ok: res.ok,
    task,
    command,
    summary: res.ok
      ? "Database seed completed successfully."
      : "Seed failed. Check output and confirm seed script is available in your deployment runtime.",
    output: truncateOutput(res.output || "(no output)"),
  };
}
