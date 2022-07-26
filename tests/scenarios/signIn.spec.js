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

test("App switches between Sign-In and Archive Creation when valid credentials are provided.", async ({ page, extensionId }) => {
  // Notes:
  // - `expectedFormAction`: Expected value for the `action` attribute of archive-form > form after signing-in.
  const scenarios = [
    {
      apiKey: MOCK_API_KEY,
      expectedFormAction: "#sign-in"
    },
    {
      apiKey: process.env["TESTS_API_KEY"],
      expectedFormAction: "#create-archive"
    }
  ];

  for (let scenario of scenarios) {
    await page.evaluate( async(apiKey) => {
      const signInForm = document.querySelector('archive-form [action="#sign-in"]');

      signInForm.querySelector("input[name='api-key']").value = apiKey;
      signInForm.querySelector("button").click();

      await new Promise(resolve => setTimeout(resolve, 1500));
    }, scenario.apiKey);
  
    const formAction = await page.getAttribute("archive-form > form", "action")
    expect(formAction).toBe(scenario.expectedFormAction);
  }
});