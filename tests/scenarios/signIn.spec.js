/**
 * perma-extension
 * @module tests/components/AppHeader.spec
 * @author The Harvard Library Innovation Lab
 * @license MIT
 * @description E2E Testing scenario: Signing in.
 */
import { expect } from "@playwright/test";
import { test, WAIT_MS_AFTER_BOOT } from "../index.js";
import { MOCK_TAB_TITLE, MOCK_TAB_URL } from "../mocks.js";

// Refresh extension page and wait `WAIT_MS_AFTER_BOOT` ms before each test.
// 
test.beforeEach(async ({ page, extensionId }, testInfo) => {
  await page.goto(`chrome-extension://${extensionId}/popup/index.html`);
  await page.waitForTimeout(WAIT_MS_AFTER_BOOT);
});