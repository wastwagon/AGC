import { test, expect } from "@playwright/test";

test.describe("Join us — career inquiry form", () => {
  test("submits and shows thank-you (API mocked)", async ({ page }) => {
    await page.route("**/api/join-us", async (route) => {
      if (route.request().method() !== "POST") {
        await route.continue();
        return;
      }
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true, emailFailed: false }),
      });
    });

    await page.goto("/get-involved/join-us");

    await expect(page.getByRole("heading", { name: "Career inquiry form" })).toBeVisible();

    await page.locator("#ju-name").fill("E2E Test User");
    await page.locator("#ju-email").fill("e2e-join-us@example.com");
    await page.locator("#ju-message").fill("Smoke test message from Playwright.");

    await page.getByRole("button", { name: /Send inquiry/ }).click();

    await expect(page.getByText("Thank you — we received your inquiry.")).toBeVisible();
  });
});
