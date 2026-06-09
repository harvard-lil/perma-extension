/**
 * perma-extension
 * @module tests/scenarios/SignIn.spec
 * @author The Harvard Library Innovation Lab
 * @license MIT
 * @description E2E Testing scenario: Signing in. Assumes "env.TESTS_API_KEY" is available and valid.
 */
import { expect } from "@playwright/test";
import { test, WAIT_MS_AFTER_BOOT } from "../index.js";
import { MOCK_API_KEY, MOCK_TAB_URL, MOCK_TAB_TITLE } from "../mocks.js";
import { MESSAGE_IDS } from "../../src/constants/index.js";

// Refresh extension page and wait `WAIT_MS_AFTER_BOOT` ms before each test.
// Clears `chrome.storage.local` before each test.
test.beforeEach(async ({ page, extensionId }, testInfo) => {
  await page.goto(`chrome-extension://${extensionId}/popup/index.html`);
  await page.evaluate(async () => await chrome.storage.local.clear());
  await page.reload();
  await page.waitForTimeout(WAIT_MS_AFTER_BOOT);

  // Simulate a real, capturable current tab. In the test browser the active tab is the popup's own
  // `chrome-extension://` page, which is non-capturable — so once signed in the archive form would
  // render the "can't be archived" panel instead of the create-archive form. A real popup always
  // opens over the page the user is on, so seed that here via `TAB_SWITCH`.
  await page.evaluate(async (args) => {
    const { MESSAGE_IDS, url, title } = args;
    await chrome.runtime.sendMessage({ messageId: MESSAGE_IDS.TAB_SWITCH, url, title });
  }, { MESSAGE_IDS, url: MOCK_TAB_URL, title: MOCK_TAB_TITLE });
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
    }, scenario.apiKey);

    await page.waitForTimeout(WAIT_MS_AFTER_BOOT * 10);
  
    const formAction = await page.getAttribute("archive-form > form", "action")
    expect(formAction).toBe(scenario.expectedFormAction);
  }
});