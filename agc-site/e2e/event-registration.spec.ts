import { test, expect } from "@playwright/test";

test.describe("Event registration (public)", () => {
  test("waitlist-capable slug shows form and success when register API is mocked", async ({ page }) => {
    await page.route("**/api/events/register", async (route) => {
      if (route.request().method() !== "POST") {
        await route.continue();
        return;
      }
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          registration: {
            id: "e2e-test-id",
            registrationId: "AGC-EV-2026-E2E001",
            badgeUrl: "/events/badge/e2e-test-id",
            waitlisted: false,
          },
        }),
      });
    });

    await page.goto("/events/our-programs-description");
    await expect(page.getByRole("heading", { level: 1, name: /Our Programs Description/i })).toBeVisible();
    await page.getByRole("link", { name: /^Register$/i }).click();
    await expect(page).toHaveURL(/\/events\/register\/our-programs-description/);
    await expect(page.getByRole("heading", { name: /Register to attend in person/i })).toBeVisible();

    await page.locator("#fullName").fill("E2E Event Guest");
    await page.locator("#email").fill("e2e-event@example.com");

    await page.getByRole("button", { name: "Register" }).click();

    await expect(page.getByRole("heading", { name: "You’re registered" })).toBeVisible();
    await expect(page.getByText("AGC-EV-2026-E2E001")).toBeVisible();
  });

  test("ICS endpoint requires slug", async ({ request }) => {
    const res = await request.get("/api/events/ics");
    expect(res.status()).toBe(400);
  });
});
