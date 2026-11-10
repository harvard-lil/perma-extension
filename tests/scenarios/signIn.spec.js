/**
 * perma-extension
 * @module tests/scenarios/SignIn.spec
 * @author The Harvard Library Innovation Lab
 * @license MIT
 * @description E2E Testing scenario: Signing in. Assumes "env.TESTS_API_KEY" is available and valid.
 */
import { expect } from "@playwright/test";
import { test, WAIT_MS_AFTER_BOOT } from "../index.js";
import { MOCK_API_KEY } from "../mocks.js";

// Refresh extension page and wait `WAIT_MS_AFTER_BOOT` ms before each test.
// Clears `chrome.storage.local` before each test.
test.beforeEach(async ({ page, extensionId }, testInfo) => {
  await page.goto(`chrome-extension://${extensionId}/popup/index.html`);
  await page.evaluate(async () => await chrome.storage.local.clear());
  await page.reload();
  await page.waitForTimeout(WAIT_MS_AFTER_BOOT);
});

/**
 * Submits `apiKey` through the sign-in form, then returns the `action` of the form shown afterwards.
 * @param {import("@playwright/test").Page} page
 * @param {string} apiKey
 * @returns {Promise<string|null>}
 */
async function signInAndGetFormAction(page, apiKey) {
  await page.evaluate( async(apiKey) => {
    const signInForm = document.querySelector('archive-form [action="#sign-in"]');
    signInForm.querySelector("input[name='api-key']").value = apiKey;
    signInForm.querySelector("button").click();
  }, apiKey);

  await page.waitForTimeout(WAIT_MS_AFTER_BOOT * 10);

  return await page.getAttribute("archive-form > form", "action");
}

test("App stays on Sign-In when invalid credentials are provided.", async ({ page, extensionId }) => {
  expect(await signInAndGetFormAction(page, MOCK_API_KEY)).toBe("#sign-in");
});

test("App switches between Sign-In and Archive Creation when valid credentials are provided.", async ({ page, extensionId }) => {
  // Signs in to the live Perma API, so it needs a real key. CI doesn't have one.
  test.skip(!process.env["TESTS_API_KEY"], "TESTS_API_KEY is not set");

  expect(await signInAndGetFormAction(page, process.env["TESTS_API_KEY"])).toBe("#create-archive");
});