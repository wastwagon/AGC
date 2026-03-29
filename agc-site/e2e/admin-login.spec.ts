import { test, expect } from "@playwright/test";

const hasAdminCreds = Boolean(process.env.E2E_ADMIN_EMAIL?.trim() && process.env.E2E_ADMIN_PASSWORD);

test.describe("Admin login", () => {
  test.skip(
    !hasAdminCreds,
    "Set E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD (valid staff user in the target environment) to run this test."
  );

  test("credentials sign-in reaches admin area", async ({ page }) => {
    await page.goto("/admin/login");
    await page.locator("#email").fill(process.env.E2E_ADMIN_EMAIL!);
    await page.locator("#password").fill(process.env.E2E_ADMIN_PASSWORD!);
    await page.getByRole("button", { name: /Sign in/i }).click();
    await expect(page.getByRole("heading", { level: 1, name: "Admin Dashboard" })).toBeVisible({ timeout: 20_000 });
  });
});
