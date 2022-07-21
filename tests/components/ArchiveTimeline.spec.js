/**
 * perma-extension
 * @module tests/components/ArchiveTimeline.spec
 * @author The Harvard Library Innovation Lab
 * @license MIT
 * @description Browser-based tests for `<archive-timeline>`.
 */
import { expect } from "@playwright/test";
import { test, WAIT_MS_AFTER_BOOT } from "../index.js";
import { MESSAGE_IDS } from "../../src/constants/index.js";
import { MOCK_ARCHIVE_TIMELINE, MOCK_ARCHIVE_GUID } from "../mocks.js";

// Refresh extension page and wait `WAIT_MS_AFTER_BOOT` ms before each test.
// This page contains an instance of `<archive-timeline>`.
// We pass `is-authenticated="true"` to `<archive-timeline>` by default (most common test setup).
test.beforeEach(async ({ page, extensionId }, testInfo) => {
  await page.goto(`chrome-extension://${extensionId}/popup/index.html`);
  await page.waitForTimeout(WAIT_MS_AFTER_BOOT);

  await page.evaluate(async () => {
    document.querySelector("archive-form").setAttribute("is-authenticated", "true");
    document.querySelector("archive-timeline").setAttribute("is-authenticated", "true");
    document.querySelector("status-bar").setAttribute("is-authenticated", "true");
    await new Promise(resolve => requestAnimationFrame(resolve));
  });
});

test('Does not render if `is-authenticated` is not "true".', async ({ page, extensionId }) => {
  await page.evaluate(async () => {
    document.querySelector("archive-timeline").setAttribute("is-authenticated", "false");
    await new Promise(resolve => requestAnimationFrame(resolve));
  });

  const archiveTimeline = page.locator("archive-timeline");
  expect(await archiveTimeline.innerText()).toBe("");
  expect(await archiveTimeline.getAttribute("aria-hidden")).toBe("true");
});

test('Shows an "empty" message if no archive provided.', async ({ page, extensionId }) => {
  expect(await page.evaluate(async () => {
    return document.querySelectorAll("archive-timeline .empty").length
  })).toBe(1);
});

test("Renders archive objects as `<archive-timeline-item>` entries via `addArchives()`.", async ({ page, extensionId }) => {
  const renderedEntries = await page.evaluate(async (MOCK_ARCHIVE_TIMELINE) => {
    const archiveTimeline = document.querySelector("archive-timeline");
    archiveTimeline.addArchives(MOCK_ARCHIVE_TIMELINE);
    
    await new Promise(resolve => requestAnimationFrame(resolve));
    
    return archiveTimeline.querySelectorAll("archive-timeline-item").length;
  }, MOCK_ARCHIVE_TIMELINE);

  expect(renderedEntries).toBe(MOCK_ARCHIVE_TIMELINE.length);
});

test('All input elements of this subtree are disabled when `is-loading` is "true"', async ({ page, extensionId }) => {
  const inputsAreDisabled = await page.evaluate(async (MOCK_ARCHIVE_TIMELINE) => {
    const archiveTimeline = document.querySelector("archive-timeline");
    archiveTimeline.addArchives(MOCK_ARCHIVE_TIMELINE);
    archiveTimeline.setAttribute("is-loading", "true");

    await new Promise(resolve => requestAnimationFrame(resolve));

    for (let item of archiveTimeline.querySelectorAll("input, button, select")) {
      inputsAreDisabled = true;

      if (!item.getAttribute("disabled")) {
        inputsAreDisabled = false;
        break;
      }
    }

    return inputsAreDisabled;
  }, MOCK_ARCHIVE_TIMELINE);

  expect(inputsAreDisabled).toBe(true);
});
