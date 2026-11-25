import { expect, test } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { budi } from "../fixtures/users";

test.describe("Loan detail", () => {
  test("shows the installment schedule with 6 rows", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(budi.email, budi.password);

    await page.getByRole("link", { name: "LN-1001" }).click();

    const schedule = page.getByRole("table");
    const installmentRows = schedule.getByRole("row").filter({ hasNotText: "Jatuh tempo" });
    await expect(page.getByRole("heading", { name: "Jadwal cicilan" })).toBeVisible();
    await expect(installmentRows).toHaveCount(6);
  });
});
