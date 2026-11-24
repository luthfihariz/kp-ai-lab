import { expect, test } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { budi } from "../fixtures/users";

test.describe("Login", () => {
  test("shows the borrower's loans after login", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await loginPage.login(budi.email, budi.password);

    await expect(page.getByRole("heading", { name: "Pinjaman Saya" })).toBeVisible();
    await expect(page.getByRole("link", { name: "LN-1001" })).toBeVisible();
  });

  test("shows an error for a wrong password", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await loginPage.login(budi.email, "wrong-password");

    await expect(loginPage.errorMessage()).toHaveText("Email atau password salah.");
  });
});
