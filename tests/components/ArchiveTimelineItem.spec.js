/**
 * perma-extension
 * @module tests/components/ArchiveTimelineItem.spec
 * @author The Harvard Library Innovation Lab
 * @license MIT
 * @description Browser-based tests for `<archive-timeline-item>`.
 */
import { expect } from "@playwright/test";
import { test, WAIT_MS_AFTER_BOOT } from "../index.js";
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

test("`capture-status` is observed and taken into account.", async ({ page, extensionId }) => {
  const statuses = ["success", "failed", "pending", true, "BAR", null];

  for (let status of statuses) {
    await page.evaluate(async (status) => {
      const firstItem = document.querySelector("archive-timeline-item");
      firstItem.setAttribute("capture-status", status);
      await new Promise(resolve => requestAnimationFrame(resolve));
    }, status);

    // Based on `capture-status`, a > span should contain:
    // - If status is "failed" or "pending": a message
    // - If status is anything else: a date
    const spanContent = await page.locator("archive-timeline-item:first-of-type a > span").innerText();

    expect(new Date(spanContent)).toBeInstanceOf(Date);

    if (["pending", "failed"].includes(status)) {
      expect(new Date(spanContent).toString()).toBe("Invalid Date");
    }
    else {
      expect(new Date(spanContent).toString()).not.toBe("Invalid Date");
    }

  }
});

test('Click on "Copy" button uses `guid` and `archived-url` to create a reference and add it to clipboard.', async ({ page, extensionId }) => {
  await page.keyboard.down('Tab');

  const clipboardContent = await page.evaluate(async () => {
    await navigator.clipboard.writeText("");

    const firstItem = document.querySelector("archive-timeline-item");
    firstItem.querySelector("button").click();

    await new Promise(resolve => requestAnimationFrame(resolve));

    return await navigator.clipboard.readText();
  });

  const guid = await page.getAttribute("archive-timeline-item:first-of-type", "guid");
  const archivedUrl = await page.getAttribute("archive-timeline-item:first-of-type", "archived-url");

  expect(clipboardContent.startsWith(archivedUrl)).toBe(true);
  expect(clipboardContent.endsWith(guid)).toBe(true);
});
