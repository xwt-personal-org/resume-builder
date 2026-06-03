import { expect, test } from "@playwright/test";

test.skip(
  process.env.EXPECT_PRODUCTION_UI !== "true",
  "Run with EXPECT_PRODUCTION_UI=true against npm start after npm run build.",
);

test("production export tools do not expose runtime shutdown control", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /导出|Export/i }).click();

  await expect(page.getByRole("button", { name: /关闭后台|Stop server/i })).toHaveCount(0);
  await expect(page.locator("text=/关闭后台|Stop server/i")).toHaveCount(0);
});
