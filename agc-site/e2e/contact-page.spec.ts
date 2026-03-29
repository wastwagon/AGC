import { test, expect } from "@playwright/test";

test.describe("Contact page", () => {
  test("submits and shows thank-you (API mocked)", async ({ page }) => {
    await page.route("**/api/contact", async (route) => {
      if (route.request().method() !== "POST") {
        await route.continue();
        return;
      }
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true }),
      });
    });

    await page.goto("/contact");

    await page.locator("#name").fill("E2E Contact User");
    await page.locator("#email").fill("e2e-contact@example.com");
    await page.locator("#message").fill("Smoke test message from Playwright.");

    await page.getByRole("button", { name: "Send Message" }).click();

    await expect(page.getByText("Thank you! Your message was received.")).toBeVisible();
  });
});
