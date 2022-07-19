/**
 * perma-extension
 * @module tests/components/AppHeader.spec
 * @author The Harvard Library Innovation Lab
 * @license MIT
 * @description Browser-based tests for `<app-header>`.
 */
import { expect } from "@playwright/test";
import { test } from "../index.js";

// Refresh extension page and wait 500ms before each test.
test.beforeEach(async ({ page, extensionId }, testInfo) => {
  await page.goto(`chrome-extension://${extensionId}/popup/index.html`);
  await page.waitForTimeout(500);
});

test("Enforces the singleton pattern", async ({ page, extensionId }) => {
  // Try to inject a second `<app-header>` in the document. 
  // Only the first one should remain.
  // (Assumes one is already present in the document).
  const count = await page.evaluate(() => {
    const extra = document.createElement("app-header");
    extra.setAttribute("tab-url", "TEST");
    extra.setAttribute("tab-title", "TEST");
    document.querySelector("body").appendChild(extra);

    return document.querySelectorAll("app-header").length;
  });

  expect(count).toBe(1);
});

test("`tab-title` and `tab-url` are observed and trigger renders.", async ({ page, extensionId }) => {
  const updates = {
    "tabTitle": "LOREM IPSUM",
    "tabUrl": "https://lil.harvard.edu"
  };

  await page.evaluate((updates) => {
    document.querySelector("app-header").setAttribute("tab-title", updates.tabTitle);
    document.querySelector("app-header").setAttribute("tab-url", updates.tabUrl);
  }, updates);

  expect(await page.getAttribute("app-header", "tab-title")).toBe(updates.tabTitle);
  expect(await page.locator("app-header div span").innerText()).toBe(updates.tabTitle);

  expect(await page.getAttribute("app-header", "tab-url")).toBe(updates.tabUrl);
  expect(await page.locator("app-header div strong").innerText()).toBe(updates.tabUrl);
});
