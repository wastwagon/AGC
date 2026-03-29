import { test, expect } from "@playwright/test";

test.describe("Health (liveness)", () => {
  test("GET /api/health/live returns ok without database", async ({ request }) => {
    const res = await request.get("/api/health/live");
    expect(res.ok()).toBeTruthy();
    const body = (await res.json()) as { status?: string; service?: string };
    expect(body.status).toBe("ok");
    expect(body.service).toBe("agc-web");
  });
});
