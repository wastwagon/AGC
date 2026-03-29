/**
 * One-line JSON logs for public API routes (Coolify / Docker log aggregation).
 * Avoid logging PII; use outcome flags and coarse metadata only.
 */
export type ApiLogLevel = "info" | "warn" | "error";

export function logApi(
  route: string,
  level: ApiLogLevel,
  event: string,
  meta?: Record<string, unknown>
): void {
  const payload: Record<string, unknown> = {
    level,
    route,
    event,
    ts: new Date().toISOString(),
    ...meta,
  };
  const line = JSON.stringify(payload);
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
}
