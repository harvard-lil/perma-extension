/**
 * perma-extension
 * @module tests/scenarios/pickFolder.spec
 * @author The Harvard Library Innovation Lab
 * @license MIT
 * @description E2E Testing scenario: Picking a new default folder. Assumes "env.TESTS_API_KEY" is available and valid.
 */
import { expect } from "@playwright/test";
import { PermaAPI } from "@harvard-lil/perma-js-sdk";
import { test, WAIT_MS_AFTER_BOOT, EXPECTED_TESTS_API_USER } from "../index.js";
import { MOCK_TAB_URL, MOCK_TAB_TITLE } from "../mocks.js";
import { MESSAGE_IDS } from "../../src/constants/index.js";
import { PERMA_API_BASE_URL } from "../../src/constants/index.js";

let testFolder = null;

test.beforeAll(async () => {
  const api = new PermaAPI(process.env.TESTS_API_KEY, PERMA_API_BASE_URL);
  const user = await api.pullUser();

  if (process.env.TESTS_API_ALLOW_NON_TEST_USER !== "1" && user.full_name !== EXPECTED_TESTS_API_USER) {
    throw new Error(
      `TESTS_API_KEY belongs to "${user.full_name}", expected "${EXPECTED_TESTS_API_USER}". ` +
      "Set TESTS_API_ALLOW_NON_TEST_USER=1 to intentionally run the live API tests with another account."
    );
  }

  const topLevel = await api.pullTopLevelFolders(1);
  const personalFolder = topLevel.objects[0];
  testFolder = await api.createFolder(personalFolder.id, `perma-extension-e2e-${Date.now()}`);
});

test.afterAll(async () => {
  if (testFolder === null) {
    return;
  }

  const api = new PermaAPI(process.env.TESTS_API_KEY, PERMA_API_BASE_URL);
  await api.deleteFolder(testFolder.id);
});

// Refresh extension page and wait `WAIT_MS_AFTER_BOOT` ms before each test.
// Clears `chrome.storage.local` before each test.
// Signs in before each test.
test.beforeEach(async ({ page, extensionId }, testInfo) => {
  await page.goto(`chrome-extension://${extensionId}/popup/index.html`);

  // Clear storage
  await page.evaluate(async () => await chrome.storage.local.clear());
  await page.reload();

  // Simulate a real, capturable current tab. The folder cascade lives inside the create-archive
  // form, which only renders for capturable pages; the test browser's active tab is the popup's own
  // `chrome-extension://` page (non-capturable), so seed a real page via `TAB_SWITCH` first.
  await page.evaluate(async (args) => {
    const { MESSAGE_IDS, url, title } = args;
    await chrome.runtime.sendMessage({ messageId: MESSAGE_IDS.TAB_SWITCH, url, title });
  }, { MESSAGE_IDS, url: MOCK_TAB_URL, title: MOCK_TAB_TITLE });

  // Sign in
  await page.evaluate( async(apiKey) => {
    const signInForm = document.querySelector('archive-form [action="#sign-in"]');
    signInForm.querySelector("input[name='api-key']").value = apiKey;
    signInForm.querySelector("button").click();
  }, process.env["TESTS_API_KEY"]);

  await page.waitForTimeout(WAIT_MS_AFTER_BOOT * 10);
});

test("App retains folder that user picked as a default", async ({ page, extensionId }) => {
  // The picker is a lazy cascade. The test user only needs Personal Links at the top level; this
  // test creates a temporary child folder under it, then picks that child in the second select.
  await page.waitForSelector("select.folders-pick[data-level='1']");

  const beforePick = await page.evaluate(async () => {
    const { folders } = await chrome.storage.local.get("folders");
    return folders.pick;
  });

  // Simulate picking another folder
  const picked = await page.evaluate(async (folderId) => {
    const picker = document.querySelector("select.folders-pick[data-level='1']");
    const value = String(folderId);
    picker.value = value;
    picker.dispatchEvent(new Event("change"));
    return value;
  }, testFolder.id);

  // Wait for `FOLDERS_PICK_ONE` to actually persist the new selection before reloading. The change
  // handler fires the message and returns immediately, so reloading right away can race the save and
  // restore the previous pick (`folders.path[0]`).
  await page.waitForFunction(
    async (picked) => {
      const { folders } = await chrome.storage.local.get("folders");
      return String(folders?.pick) === String(picked);
    },
    picked
  );

  // Reload page and check that value was kept
  await page.reload();

  // Reloading re-runs `onPopupOpen`, which resets the current tab to the popup's own
  // `chrome-extension://` page (non-capturable) — collapsing the create form and its cascade. Wait
  // for that to settle, then re-seed a capturable tab so the cascade renders again from storage.
  await page.waitForTimeout(WAIT_MS_AFTER_BOOT * 2);
  await page.evaluate(async (args) => {
    const { MESSAGE_IDS, url, title } = args;
    await chrome.runtime.sendMessage({ messageId: MESSAGE_IDS.TAB_SWITCH, url, title });
  }, { MESSAGE_IDS, url: MOCK_TAB_URL, title: MOCK_TAB_TITLE });
  await page.waitForSelector("select.folders-pick[data-level='1']");

  const afterPick = await page.evaluate(async () => {
    return document.querySelector("select.folders-pick[data-level='1']").value;
  });

  // Compare
  expect(beforePick).toBeDefined();
  expect(afterPick).toBeDefined();
  expect(afterPick).toBe(String(testFolder.id));
  expect(afterPick).not.toBe(String(beforePick));
});
