import { expect, test } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { budi } from "../fixtures/users";

test.describe("FEATURE", () => {
  test("BEHAVIOUR", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(budi.email, budi.password);

    // Arrange: open the screen under test

    // Assert: one behaviour, with getByRole or getByLabel
    await expect(page.getByRole("heading", { name: "Pinjaman Saya" })).toBeVisible();
  });
});