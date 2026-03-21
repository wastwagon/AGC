import { NextResponse } from "next/server";

/**
 * Liveness probe only — does not touch the database.
 * Use this for Docker / Traefik / Coolify healthchecks so the proxy keeps routing
 * even when `/api/health` returns 503 (DB temporarily unavailable).
 */
export const dynamic = "force-dynamic";
export const revalidate = 0;

export function GET() {
  return NextResponse.json({ status: "ok", service: "agc-web" }, { status: 200 });
}
