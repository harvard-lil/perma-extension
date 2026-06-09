/**
 * perma-extension
 * @module tests/index
 * @author The Harvard Library Innovation Lab
 * @license MIT
 * @description Entry point for browser-based test suite. Defines suite-wide tools and fixtures.
 */
import { test as base, chromium } from "@playwright/test";
import { PermaAPI } from "@harvard-lil/perma-js-sdk";
import { PERMA_API_BASE_URL } from "../src/constants/index.js";

export const PLACEHOLDER_TESTS_API_KEY = "abcedfghijklmnopqrstuvwxyz12345678901234";
export const EXPECTED_TESTS_API_USER = "perma-js-sdk-test-user";

/**
 * Time (in MS) to wait before running a test.
 */
export const WAIT_MS_AFTER_BOOT = 500;

/**
 * Path to _built_ extension.
 * @constant
 */
export const EXTENSION_PATH = "./dist/";

/**
 * Extends Playwright's "test" function so it:
 * - Loads Chromium with the extension pre-loaded and clipboard permissions pre-enabled.
 * - Finds the extension id and feeds it to every test.
 */
export const test = base.extend({
  liveApiAccountGuard: [async ({ }, use) => {
    const apiKey = process.env.TESTS_API_KEY;
    const isLiveApiKey = Boolean(apiKey && apiKey !== PLACEHOLDER_TESTS_API_KEY);
    const allowOtherUser = process.env.TESTS_API_ALLOW_NON_TEST_USER === "1";

    if (isLiveApiKey && !allowOtherUser) {
      const api = new PermaAPI(apiKey, PERMA_API_BASE_URL);
      const user = await api.pullUser();

      if (user.full_name !== EXPECTED_TESTS_API_USER) {
        throw new Error(
          `TESTS_API_KEY belongs to "${user.full_name}", expected "${EXPECTED_TESTS_API_USER}". ` +
          "Set TESTS_API_ALLOW_NON_TEST_USER=1 to intentionally run the live API tests with another account."
        );
      }
    }

    await use();
  }, { scope: "worker", auto: true }],

  context: async ({ }, use) => {
    const pathToExtension = EXTENSION_PATH;

    // Extensions can't load in Chromium's legacy headless mode, only in the new one (--headless=new).
    // So we keep Playwright's `headless: false` and opt into new headless ourselves via an arg, gated
    // on HEADLESS (default on; set HEADLESS=false — e.g. `just headful=1 test` — to watch the browser).
    const headless = process.env.HEADLESS !== "false";

    const context = await chromium.launchPersistentContext("", {
      headless: false,
      args: [
        ...(headless ? ["--headless=new"] : []),
        `--disable-extensions-except=${pathToExtension}`,
        `--load-extension=${pathToExtension}`,
      ],
    });

    context.grantPermissions(["clipboard-read", "clipboard-write"]);
    
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
