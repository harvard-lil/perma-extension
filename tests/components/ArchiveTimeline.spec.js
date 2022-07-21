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

test('Shows an "empty" message if no archives provided.', async ({ page, extensionId }) => {
  expect(await page.evaluate(async () => {
    return document.querySelectorAll("archive-timeline .empty").length
  })).toBe(1);
});

/*
test('Buttons are disabled when `is-loading` is "true"',  async ({ page, extensionId }) => {
  const buttonsAreDisabled = await page.evaluate(async () => {
    document.querySelector("archive-timeline").setAttribute("is-loading", "true");

    for (let item of document.querySelectorAll("archive-timeline-item")) {
      buttonsAreDisabled = true;

      if (!item.querySelector("button:disabled")) {
        buttonsAreDisabled = false;
        break;
      }
    }

    return buttonsAreDisabled;
  });

  expect(buttonsAreDisabled).toBe(true);
});
*/