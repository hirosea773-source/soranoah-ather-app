import { test, expect } from "@playwright/test";

/**
 * UI確認用スクリーンショットと基本機能テスト
 */
test("home ui", async ({ page }) => {
  await page.goto("http://localhost:3000");

  // ページタイトル確認
  await expect(page.getByTestId("page-title")).toHaveText("画像リサイズツール");

  // ステップカードの存在確認
  await expect(page.getByTestId("step-upload")).toBeVisible();
  await expect(page.getByTestId("step-images")).toBeVisible();

  // スクリーンショット取得
  await page.screenshot({
    path: "tests/screenshots/home.png",
    fullPage: true,
  });
});
