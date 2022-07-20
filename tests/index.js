/**
 * perma-extension
 * @module tests/index
 * @author The Harvard Library Innovation Lab
 * @license MIT
 * @description Entry point for browser-based test suite. Defines suite-wide tools and fixtures.
 */
import { test as base, chromium } from "@playwright/test";

/**
 * Time (in MS) to wait before running a test.
 */
export const WAIT_MS_AFTER_BOOT = 400;

/**
 * Path to _built_ extension.
 * @constant
 */
export const EXTENSION_PATH = "./dist/";

/**
 * Extends Playwright's "test" function so it:
 * - Loads Chromium with the extension pre-loaded.
 * - Finds the extension id and feeds it to every test.
 */
export const test = base.extend({
  context: async ({ }, use) => {
    const pathToExtension = EXTENSION_PATH;
    const context = await chromium.launchPersistentContext("", {
      headless: false,
      args: [
        `--disable-extensions-except=${pathToExtension}`,
        `--load-extension=${pathToExtension}`,
      ],
    });
    await use(context);
    await context.close();
  },
  extensionId: async ({ context }, use) => {
    let [background] = context.serviceWorkers();
    if (!background)
      background = await context.waitForEvent("serviceworker");

    const extensionId = background.url().split("/")[2];
    await use(extensionId);
  },
});
