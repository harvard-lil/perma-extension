/**
 * perma-extension
 * @module tests/components/ArchiveTimelineItem.spec
 * @author The Harvard Library Innovation Lab
 * @license MIT
 * @description Browser-based tests for `<archive-timeline-item>`.
 */
import { expect } from "@playwright/test";
import { test, WAIT_MS_AFTER_BOOT } from "../index.js";
import { MESSAGE_IDS } from "../../src/constants/index.js";
import { MOCK_ARCHIVE_TIMELINE, MOCK_ARCHIVE_GUID } from "../mocks.js";


// Refresh extension page and wait `WAIT_MS_AFTER_BOOT` ms before each test.
// This page contains an instance of `<archive-timeline>`
// - Set `is-authenticated` to "true" on `<archive-form>` and `<archive-timeline>` so we can use `<archive-timeline>`.
// - Mock a timeline in `<archive-timeline>`
test.beforeEach(async ({ page, extensionId }, testInfo) => {
  await page.goto(`chrome-extension://${extensionId}/popup/index.html`);
  await page.waitForTimeout(WAIT_MS_AFTER_BOOT);

  await page.evaluate(async (MOCK_ARCHIVE_TIMELINE) => {
    document.querySelector("archive-form").setAttribute("is-authenticated", "true");
    
    const archiveTimeline = document.querySelector("archive-timeline");
    archiveTimeline.setAttribute("is-authenticated", "true");
    archiveTimeline.addArchives(MOCK_ARCHIVE_TIMELINE)

    await new Promise(resolve => requestAnimationFrame(resolve));
  }, MOCK_ARCHIVE_TIMELINE);
});

test("`guid` is observed and taken into account.", async ({ page, extensionId }) => {
  const guids = [
    MOCK_ARCHIVE_GUID,
    "",
    null
  ];

  for (let guid of guids) {
    await page.evaluate(async (guid) => {
      const firstItem = document.querySelector("archive-timeline-item");
      firstItem.setAttribute("guid", guid);

      await new Promise(resolve => requestAnimationFrame(resolve));
    }, guid);
  
    const rendered = await page.locator("archive-timeline-item:first-of-type a strong").innerText();
    expect(rendered).toBe(`${guid}`);
  }
});

test("`creation-timestamp` is observed and taken into account.", async ({ page, extensionId }) => {
  const creationTimestamps = [
    new Date().toISOString(),
    new Date().toDateString(),
    Date.now(),
    "FOO",
    null
  ];

  for (let creationTimestamp of creationTimestamps) {
    await page.evaluate(async (creationTimestamp) => {
      const firstItem = document.querySelector("archive-timeline-item");
      firstItem.setAttribute("creation-timestamp", creationTimestamp);
      await new Promise(resolve => requestAnimationFrame(resolve));
    }, creationTimestamp);
  
    const rendered = await page.locator("archive-timeline-item:first-of-type a span").innerText();
    
    expect(rendered).toBe(
      new Date(`${creationTimestamp}`).toLocaleString() // Component renders dates in this format
    );
  }
});

test("`is-private` is observed and taken into account.", async ({ page, extensionId }) => {
  const isPrivateArgs = [
    true,
    false,
    null,
    "FOO"
  ];

  for (let isPrivate of isPrivateArgs) {
    await page.evaluate(async (isPrivate) => {
      const firstItem = document.querySelector("archive-timeline-item");
      firstItem.setAttribute("is-private", isPrivate);
      await new Promise(resolve => requestAnimationFrame(resolve));
    }, isPrivate);

    const button = await page.locator("archive-timeline-item:first-of-type button");

    if (isPrivate === true) {
      expect(await button.getAttribute("data-is-private")).toBe("true");
    }
    else {
      expect(await button.getAttribute("data-is-private")).toBe("false");
    }

  }
});

test("Click on privacy toggle button sends `ARCHIVE_PRIVACY_STATUS_TOGGLE` runtime message.", async ({ page, extensionId }) => {
  const scenarios = [
    {
      isPrivate: false,
      expectedIsPrivateInPayload: true,
    },
    {
      isPrivate: true,
      expectedIsPrivateInPayload: false,
    },
    {
      isPrivate: "FOO",
      expectedIsPrivateInPayload: true,
    },
    {
      isPrivate: null,
      expectedIsPrivateInPayload: true,
    }
  ];

  for (let scenario of scenarios) {
    // Monkey-patch `chrome.runtime.sendMessage` to intercept message.
    const payload = await page.evaluate(async (scenario) => {
      let payload = null;
      chrome.runtime.sendMessage = data => payload = data;

      const firstItem = document.querySelector("archive-timeline-item:first-of-type");
      firstItem.setAttribute("is-private", scenario.isPrivate);

      await new Promise(resolve => requestAnimationFrame(resolve));

      firstItem.querySelector("button").click();

      return payload;
    }, scenario);

    expect(payload.messageId).toBe(MESSAGE_IDS.ARCHIVE_PRIVACY_STATUS_TOGGLE);
    expect(payload.isPrivate).toBe(scenario.expectedIsPrivateInPayload);
  }
});
