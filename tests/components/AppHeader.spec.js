/**
 * perma-extension
 * @module tests/components/AppHeader.spec
 * @author The Harvard Library Innovation Lab
 * @license MIT
 * @description Browser-based tests for `<app-header>`.
 */
import { expect } from "@playwright/test";
import { test, WAIT_MS_AFTER_BOOT } from "../index.js";

// Refresh extension page and wait `WAIT_MS_AFTER_BOOT` ms before each test.
// This page contains an instance of `<app-header>`.
test.beforeEach(async ({ page, extensionId }, testInfo) => {
  await page.goto(`chrome-extension://${extensionId}/popup/index.html`);
  await page.waitForTimeout(WAIT_MS_AFTER_BOOT);
});

test("Enforces the singleton pattern.", async ({ page, extensionId }) => {
  // Try to inject a second `<app-header>` in the document. 
  const count = await page.evaluate(() => {
    const extra = document.createElement("app-header");
    extra.setAttribute("tab-url", "TEST");
    extra.setAttribute("tab-title", "TEST");
    document.querySelector("body").appendChild(extra);

    return document.querySelectorAll("app-header").length;
  });

  expect(count).toBe(1); // Only the first one should remain.
});

test("`tab-title` and `tab-url` are observed and taken into account.", async ({ page, extensionId }) => {
  const updates = {
    "tabTitle": "LOREM IPSUM",
    "tabUrl": "https://lil.harvard.edu"
  };

  await page.evaluate((updates) => {
    document.querySelector("app-header").setAttribute("tab-title", updates.tabTitle);
    document.querySelector("app-header").setAttribute("tab-url", updates.tabUrl);
  }, updates);

  expect(await page.getAttribute("app-header", "tab-title")).toBe(updates.tabTitle);
  expect(await page.locator("app-header > div span").innerText()).toBe(updates.tabTitle);

  expect(await page.getAttribute("app-header", "tab-url")).toBe(updates.tabUrl);
  expect(await page.locator("app-header > div strong").innerText()).toBe(updates.tabUrl);
});
