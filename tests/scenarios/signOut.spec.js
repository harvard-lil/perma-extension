/**
 * perma-extension
 * @module tests/scenarios/SignOut.spec
 * @author The Harvard Library Innovation Lab
 * @license MIT
 * @description E2E Testing scenario: Signing Out. Assumes "env.TESTS_API_KEY" is available and valid.
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

    await new Promise(resolve => setTimeout(resolve, 1500));
  }, process.env["TESTS_API_KEY"]);

  await page.waitForTimeout(WAIT_MS_AFTER_BOOT);
});

test("App switches back to the Sign-In form and clears user data from storage upon sign-out.", async ({ page, extensionId }) => {
  // See storage data structure definitions under `storage` module.
  const storage = await page.evaluate( async () => {
    document.querySelector("status-bar button").click();
    await new Promise(resolve => setTimeout(resolve, 500));
    return await chrome.storage.local.get();
  });

  // Sign-in form is shown
  const formAction = await page.getAttribute("archive-form > form", "action")
  expect(formAction).toBe("#sign-in");

  // User data was cleared
  expect(storage.auth.isChecked).toBe(false);
  expect(storage.auth.apiKey).toBe("");
  expect(Object.values(storage.archives.byUrl)).toHaveLength(0);
  expect(Object.values(storage.folders.available)).toHaveLength(0);
});