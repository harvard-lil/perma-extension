/**
 * perma-extension
 * @module tests/scenarios/pickFolder.spec
 * @author The Harvard Library Innovation Lab
 * @license MIT
 * @description E2E Testing scenario: Picking a new default folder. Assumes "env.TESTS_API_KEY" is available and valid.
 */
import { expect } from "@playwright/test";
import { test, WAIT_MS_AFTER_BOOT } from "../index.js";

// Refresh extension page and wait `WAIT_MS_AFTER_BOOT` ms before each test.
// Clears `chrome.storage.local` before each test.
// Signs in before each test.
test.beforeEach(async ({ page, extensionId }, testInfo) => {
  await page.goto(`chrome-extension://${extensionId}/popup/index.html`);

  // Clear storage
  await page.evaluate(async () => await chrome.storage.local.clear());
  await page.reload();

  // Sign in
  await page.evaluate( async(apiKey) => {
    const signInForm = document.querySelector('archive-form [action="#sign-in"]');
    signInForm.querySelector("input[name='api-key']").value = apiKey;
    signInForm.querySelector("button").click();
  }, process.env["TESTS_API_KEY"]);

  await page.waitForTimeout(WAIT_MS_AFTER_BOOT * 10);
});

test("App retains folder that user picked as a default", async ({ page, extensionId }) => {
  const beforePick = await page.evaluate(async () => {
    return document.querySelector("select[name='folders-pick']").value;
  });

  // Simulate picking another folder
  await page.evaluate(async () => {
    const picker = document.querySelector("select[name='folders-pick']");
    picker.value = picker.options[picker.options.length - 1].value; // Pick last of list
    picker.dispatchEvent(new Event("change"));
  });

  // Reload page and check that value was kept
  await page.reload();
  await page.waitForTimeout(WAIT_MS_AFTER_BOOT);

  const afterPick = await page.evaluate(async () => {
    return document.querySelector("select[name='folders-pick']").value;
  });

  // Compare
  expect(beforePick).toBeDefined();
  expect(afterPick).toBeDefined();
  expect(afterPick).not.toBe(beforePick);
});