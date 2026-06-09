/**
 * perma-extension
 * @module tests/scenarios/createArchive.spec
 * @author The Harvard Library Innovation Lab
 * @license MIT
 * @description E2E Testing scenario: Creating an archive. Assumes "env.TESTS_API_KEY" is available and valid.
 */
import { expect } from "@playwright/test";
import { test, WAIT_MS_AFTER_BOOT } from "../index.js";
import { MOCK_TAB_URL, MOCK_TAB_TITLE } from "../mocks.js";
import { MESSAGE_IDS } from "../../src/constants/index.js";
 
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

test("App can request the creation of an archive and list the newly created entry.", async ({ page, extensionId }) => {
  const scenarios = [
    {
      // Use a unique URL per run so the timeline starts empty. The test account accumulates archives
      // for any fixed URL across runs, and the timeline only pulls the first 100 for a given URL
      // (see `archivePullTimeline`) — so on a reused URL the freshly created entry can fall outside
      // that page and the count never increments. A unique URL sidesteps that and keeps the diff at 1.
      url: `${MOCK_TAB_URL}?perma-extension-e2e=${Date.now()}`,
      title: MOCK_TAB_TITLE,
      expectedArchivesCountDiff: 1
    },
    {
      url: "chrome://extensions",
      title: MOCK_TAB_TITLE,
      expectedArchivesCountDiff: 0
    }
  ];

  for (let scenario of scenarios) {
    const archivesCountDiff = await page.evaluate(async (args) => {
      const { MESSAGE_IDS, scenario } = { ... args};

      // Simulate going on the page to archive (update "currentTab" in storage)
      await chrome.runtime.sendMessage({
        messageId: MESSAGE_IDS.TAB_SWITCH,
        url: scenario.url, 
        title: scenario.title
      });
      await chrome.runtime.sendMessage({messageId: MESSAGE_IDS.ARCHIVE_PULL_TIMELINE});
      await new Promise(resolve => setTimeout(resolve, 2500));
  
      // Create an archive, compare number of entries in `<archive-timeline>` before and after.
      let archivesCountBefore = document.querySelectorAll("archive-timeline-item").length;
      let archivesCountAfter = 0;
  
      // Non-capturable pages (e.g. `chrome://extensions`) render the "can't be archived" panel
      // instead of the create form, so there's no button to click — and no archive is created.
      document.querySelector("archive-form form[action='#create-archive'] button")?.click();
      await new Promise(resolve => setTimeout(resolve, 5000));
  
      archivesCountAfter = document.querySelectorAll("archive-timeline-item").length;
  
      return archivesCountAfter - archivesCountBefore;
    }, {scenario, MESSAGE_IDS});
  
    expect(archivesCountDiff).toBe(scenario.expectedArchivesCountDiff);
  }
});
