import { expect } from "@playwright/test";
import { test } from "./index.js";

test("Quick Test", async ({ page, extensionId }) => {
  await page.goto(`chrome-extension://${extensionId}/popup/index.html`);
  await page.waitForTimeout(500);

  //await expect(page.locator("body")).toHaveText("Changed by my-extension");
  const href = await page.evaluate(() => document.location.href);

  console.log(href);
  expect(true);
});