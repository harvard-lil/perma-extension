/**
 * perma-extension
 * @module tests/components/StatusBar.spec
 * @author The Harvard Library Innovation Lab
 * @license MIT
 * @description Browser-based tests for `<status-bar>`.
 */
import { expect } from "@playwright/test";
import { test } from "../index.js";
 
// Refresh extension page and wait 500ms before each test.
test.beforeEach(async ({ page, extensionId }, testInfo) => {
  await page.goto(`chrome-extension://${extensionId}/popup/index.html`);
  await page.waitForTimeout(500);
});
 
test("Enforces the singleton pattern", async ({ page, extensionId }) => {
  // Try to inject a second `<status-bar>` in the document. 
  // Only the first one should remain.
  // (Assumes one is already present in the document).
  const count = await page.evaluate(() => {
    const extra = document.createElement("status-bar");
    extra.setAttribute("message", "status_default");
    document.querySelector("body").appendChild(extra);
 
    return document.querySelectorAll("status-bar").length;
  });
 
  expect(count).toBe(1);
});


/*
test('Shows "Sign-out" button', async ({ page, extensionId }) => {
});
*/