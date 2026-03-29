import { test, expect } from "@playwright/test";

test.describe("Applications page", () => {
  test("renders hero and form (static fallback in dev)", async ({ page }) => {
    await page.goto("/applications");

    await expect(page.getByRole("heading", { level: 1, name: "Volunteer application" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Application form" })).toBeVisible();
    await expect(page.getByLabel(/I am applying as/i)).toBeVisible();
  });
});
